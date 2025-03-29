import numpy as np
import torch
from torchvision import models, transforms
from PIL import Image
import cv2
from tqdm import tqdm
import pandas as pd
import os
import pickle
from skimage.feature import local_binary_pattern
import multiprocessing
from concurrent.futures import ProcessPoolExecutor, as_completed
import time
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

# Global variables for models to avoid reloading in each process
MODELS = {}

def extract_deep_features(image_path, model_name='efficientnet_v2'):
    """
    Extract deep features using a pre-trained CNN model with PyTorch.
    
    Parameters:
        image_path (str): Path to the image.
        model_name (str): Model to use ('efficientnet_v2', 'mobilenet_v3', 'resnet50', 'convnext').
        
    Returns:
        np.ndarray: Flattened feature vector.
    """
    # Define image transformations
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    # Load and preprocess image
    try:
        img = Image.open(image_path).convert('RGB')
        img_tensor = preprocess(img)
        img_tensor = img_tensor.unsqueeze(0)  # Add batch dimension
    except Exception as e:
        raise ValueError(f"Error loading image {image_path}: {e}")
    
    # Select model
    model_map = {
        'efficientnet_v2': (models.efficientnet_v2_s, 1280),
        'mobilenet_v3': (models.mobilenet_v3_large, 1280),
        'resnet50': (models.resnet50, 2048),
        'convnext': (models.convnext_tiny, 768)
    }
    
    if model_name not in model_map:
        raise ValueError(f"Invalid model_name '{model_name}'. Choose from {list(model_map.keys())}")
    
    # Get or create model
    global MODELS
    if model_name not in MODELS:
        model_func, feature_size = model_map[model_name]
        model = model_func(pretrained=True)
        
        # Remove the classification layer to get features
        if model_name == 'efficientnet_v2':
            model.classifier = torch.nn.Identity()
        elif model_name == 'mobilenet_v3':
            model.classifier = torch.nn.Identity()
        elif model_name == 'resnet50':
            model.fc = torch.nn.Identity()
        elif model_name == 'convnext':
            model.classifier = torch.nn.Identity()
        
        model.eval()
        MODELS[model_name] = model
    else:
        model = MODELS[model_name]
        _, feature_size = model_map[model_name]
    
    # Extract features
    with torch.no_grad():
        features = model(img_tensor)
    
    return features.cpu().numpy().flatten(), feature_size


def extract_traditional_features(image_path):
    """
    Extract traditional computer vision features without deep learning.
    
    Parameters:
        image_path (str): Path to the image.
        
    Returns:
        np.ndarray: Feature vector.
    """
    try:
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        # Resize for consistency
        img = cv2.resize(img, (224, 224))
        
        # Convert to different color spaces
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        features = []
        
        # Color histograms (RGB)
        for i, channel in enumerate(cv2.split(img)):
            hist = cv2.calcHist([channel], [0], None, [32], [0, 256])
            features.extend(hist.flatten())
        
        # HSV histograms
        for i, channel in enumerate(cv2.split(hsv)):
            hist = cv2.calcHist([channel], [0], None, [32], [0, 256])
            features.extend(hist.flatten())
        
        # Basic statistics per channel
        for channel in cv2.split(img):
            features.extend([
                np.mean(channel),
                np.std(channel),
                np.min(channel),
                np.max(channel)
            ])
        
        # Edge features
        edges = cv2.Canny(gray, 100, 200)
        edge_percentage = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        features.append(edge_percentage)
        
        # Texture features - Local Binary Pattern
        radius = 3
        n_points = 8 * radius
        lbp = local_binary_pattern(gray, n_points, radius, method='uniform')
        lbp_hist, _ = np.histogram(lbp, bins=10, range=(0, 10))
        features.extend(lbp_hist)
        
        return np.array(features)
        
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        # Return empty array
        return np.array([])


def extract_features(args):
    """
    Extract features using specified method.
    
    Parameters:
        args (tuple): (image_path, index, method, model_name)
        
    Returns:
        tuple: (index, features)
    """
    image_path, index, method, model_name = args
    
    if not os.path.exists(image_path):
        print(f"Image not found: {image_path}")
        return index, np.array([])
    
    try:
        if method == 'deep':
            features, _ = extract_deep_features(image_path, model_name)
            return index, features
        elif method == 'traditional':
            return index, extract_traditional_features(image_path)
        elif method == 'both':
            deep_features, _ = extract_deep_features(image_path, model_name)
            trad_features = extract_traditional_features(image_path)
            if len(trad_features) > 0:
                return index, np.concatenate([deep_features, trad_features])
            else:
                return index, deep_features
        else:
            raise ValueError(f"Invalid method: {method}. Choose from 'deep', 'traditional', or 'both'")
    except Exception as e:
        print(f"Error extracting features from {image_path}: {e}")
        return index, np.array([])


def process_images_with_features(csv_path, method='both', model_name='efficientnet_v2', 
                                output_csv_path=None, features_pickle_path=None,
                                checkpoint_interval=40, num_workers=None):
    """
    Process images to extract features, save a CSV with metadata and a pickle file with features.

    Args:
        csv_path (str): Path to the CSV file with image paths.
        method (str): 'deep', 'traditional', or 'both'.
        model_name (str): Deep learning model to use.
        output_csv_path (str): Path for the output CSV. If None, will generate one.
        features_pickle_path (str): Path for the pickle file with features. If None, will generate one.
        checkpoint_interval (int): Save progress every N songs.
        num_workers (int): Number of parallel workers. If None, uses CPU count - 1.

    Returns:
        tuple: (DataFrame with metadata, Dictionary with features)
    """
    # Set number of workers
    if num_workers is None:
        num_workers = max(1, multiprocessing.cpu_count() - 1)
    
    print(f"Using {num_workers} workers for parallel processing")
    
    # Generate output filenames if not provided
    if output_csv_path is None:
        base, ext = os.path.splitext(csv_path)
        output_csv_path = f"{base}_{method}_metadata{ext}"
    
    if features_pickle_path is None:
        base, _ = os.path.splitext(csv_path)
        features_pickle_path = f"{base}_{method}_{model_name}_features.pkl"
    
    # Load the original CSV
    df = pd.read_csv(csv_path, low_memory=False)
    
    # Ensure 'image_path' column exists
    if 'image_path' not in df.columns:
        raise ValueError("The CSV file must contain an 'image_path' column.")
    
    # Create a copy for output
    result_df = df.copy()
    
    # Initialize or load features dictionary
    features_dict = {}
    start_index = 0
    
    # Check if pickle file exists to resume processing
    if os.path.exists(features_pickle_path):
        try:
            with open(features_pickle_path, 'rb') as f:
                features_dict = pickle.load(f)
            
            # Determine how many images have been processed
            processed_indices = list(features_dict.keys())
            if processed_indices:
                start_index = max(processed_indices) + 1
                print(f"Resuming from index {start_index} ({len(processed_indices)} images already processed)")
        except Exception as e:
            print(f"Error loading existing features file: {e}")
            print("Starting from scratch")
            features_dict = {}
    
    # Add a column to indicate feature extraction status
    feature_status_col = f"{method}_{model_name}_extracted"
    if feature_status_col not in result_df.columns:
        result_df[feature_status_col] = False
    
    # Mark already processed images
    for idx in features_dict.keys():
        if idx < len(result_df):
            result_df.at[idx, feature_status_col] = True
    
    # Get the list of images to process
    images_to_process = df['image_path'].iloc[start_index:].tolist()
    indices_to_process = list(range(start_index, len(df)))
    
    # Prepare arguments for parallel processing
    process_args = [(img, idx, method, model_name) 
                   for img, idx in zip(images_to_process, indices_to_process)]
    
    # Process in batches for checkpointing
    batch_size = min(checkpoint_interval, len(process_args))
    num_batches = (len(process_args) + batch_size - 1) // batch_size
    
    # Process images with parallel execution and checkpointing
    with tqdm(total=num_batches, desc="Processing Batches") as batch_pbar:
        for batch_idx in range(num_batches):
            batch_start = batch_idx * batch_size
            batch_end = min((batch_idx + 1) * batch_size, len(process_args))
            batch_args = process_args[batch_start:batch_end]
            
            batch_pbar.set_description(f"Processing batch {batch_idx+1}/{num_batches} (indices {start_index + batch_start} to {start_index + batch_end - 1})")
            
            # Process batch in parallel
            batch_results = []
            with ProcessPoolExecutor(max_workers=num_workers) as executor:
                futures = {executor.submit(extract_features, arg): arg for arg in batch_args}
                
                # Show progress bar
                with tqdm(total=len(batch_args), desc=f"Extracting {method} features") as pbar:
                    for future in as_completed(futures):
                        pbar.update(1)
                        try:
                            batch_results.append(future.result())
                        except Exception as e:
                            print(f"Error in worker: {e}")
            
            # Update features dictionary and dataframe
            for idx, features in batch_results:
                if len(features) > 0:
                    features_dict[idx] = features
                    result_df.at[idx, feature_status_col] = True
            
            # Save checkpoint after each batch
            result_df.to_csv(output_csv_path, index=False)
            with open(features_pickle_path, 'wb') as f:
                pickle.dump(features_dict, f)
            
            print(f"Checkpoint saved at index {start_index + batch_end - 1}")
            print(f"Features saved to {features_pickle_path}")
            print(f"Metadata saved to {output_csv_path}")
            
            # Small delay to allow system resources to stabilize
            time.sleep(1)
            batch_pbar.update(1)
    
    print(f"Processing complete. Extracted {method} features using {model_name if method != 'traditional' else 'N/A'}")
    print(f"Total features extracted: {len(features_dict)}")
    print(f"Features saved to: {features_pickle_path}")
    print(f"Metadata saved to: {output_csv_path}")

    return result_df, features_dict


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Extract image features and save to pickle')
    parser.add_argument('--csv', required=True, help='Path to input CSV with image_path column')
    parser.add_argument('--output-csv', help='Path to output CSV with metadata (default: auto-generated)')
    parser.add_argument('--output-pickle', help='Path to output pickle file with features (default: auto-generated)')
    parser.add_argument('--method', choices=['deep', 'traditional', 'both'], default='both',
                        help='Feature extraction method (default: both)')
    parser.add_argument('--model', choices=['efficientnet_v2', 'mobilenet_v3', 'resnet50', 'convnext'], 
                        default='efficientnet_v2', help='Deep learning model to use (default: efficientnet_v2)')
    parser.add_argument('--checkpoint', type=int, default=40,
                        help='Save checkpoint every N songs (default: 40)')
    parser.add_argument('--workers', type=int, default=None,
                        help='Number of parallel workers (default: CPU count - 1)')
    
    args = parser.parse_args()
    
    try:
        # Set torch to use all available cores
        torch.set_num_threads(multiprocessing.cpu_count())
        
        # Process the CSV file
        df_metadata, features = process_images_with_features(
            args.csv, 
            method=args.method,
            model_name=args.model,
            output_csv_path=args.output_csv,
            features_pickle_path=args.output_pickle,
            checkpoint_interval=args.checkpoint,
            num_workers=args.workers
        )
        
        print(f"Processing complete. Added {args.method} features using {args.model if args.method != 'traditional' else 'N/A'}")
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
