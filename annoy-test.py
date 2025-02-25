import pandas as pd
import annoy
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler
import os

# Load the CSV data into a pandas DataFrame
print("Loading data...")
df_uncleaned = pd.read_csv("spotify_data_with_image_features.csv")
print(f"Original DataFrame loaded successfully. Shape: {df_uncleaned.shape}")

# Filter out rows where 'preview_url' or 'image_url' are NaN, 'no', or empty string
df = df_uncleaned[~df_uncleaned['preview'].isin([None, 'no', '']) & ~df_uncleaned['image_path'].notnull()]
df.reset_index(drop=True, inplace=True)
print(f"Cleaned DataFrame size: {df.shape}")

# Load the deep learning features from pickle file
print("Loading deep learning features from pickle file...")
pickle_path = "spotify_data_both_efficientnet_v2_features.pkl"  # Update this path to your pickle file

if os.path.exists(pickle_path):
    with open(pickle_path, 'rb') as f:
        features_dict = pickle.load(f)
    print(f"Loaded features for {len(features_dict)} songs")
else:
    print(f"Warning: Pickle file {pickle_path} not found. Proceeding without deep learning features.")
    features_dict = {}

# Create a mapping from DataFrame index to original index
df_index_to_original = {i: idx for i, idx in enumerate(df.index)}
original_to_df_index = {idx: i for i, idx in df_index_to_original.items()}

# Filter to only include songs that have deep learning features
if features_dict:
    # Convert original indices in features_dict to new DataFrame indices
    valid_indices = [original_to_df_index.get(idx) for idx in features_dict.keys() 
                     if idx in original_to_df_index]
    valid_indices = [idx for idx in valid_indices if idx is not None]
    
    # Filter DataFrame to only include rows with features
    df = df.iloc[valid_indices].reset_index(drop=True)
    print(f"DataFrame filtered to songs with deep features. New shape: {df.shape}")
    
    # Create a new mapping after filtering
    df_index_to_original = {i: idx for i, idx in enumerate(df.index)}
    original_to_df_index = {idx: i for i, idx in df_index_to_original.items()}
    
    # Extract deep learning features in the same order as DataFrame
    deep_features = []
    for i in range(len(df)):
        original_idx = df_index_to_original[i]
        if original_idx in features_dict:
            deep_features.append(features_dict[original_idx])
        else:
            # This shouldn't happen after filtering, but just in case
            print(f"Warning: Missing features for index {i} (original index {original_idx})")
            # Use zeros as placeholder
            sample_feature = next(iter(features_dict.values()))
            deep_features.append(np.zeros_like(sample_feature))
    
    deep_features = np.array(deep_features)
    print(f"Deep learning features shape: {deep_features.shape}")
else:
    deep_features = None
    print("No deep learning features available.")

# Extract non-image features (e.g., danceability, energy, etc.)
audio_features = ['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 
                 'instrumentalness', 'liveness', 'valence', 'tempo']
non_image_features = df[audio_features].values
print(f"Non-image features shape: {non_image_features.shape}")

# Extract basic image features
basic_image_features = np.array([
    np.concatenate([
        np.array([df['single_pixel_color_r'][i], df['single_pixel_color_g'][i], df['single_pixel_color_b'][i]]),
        np.array([df['weighted_average_color_r'][i], df['weighted_average_color_g'][i], df['weighted_average_color_b'][i]]),
        np.array([df['most_vibrant_color_r'][i], df['most_vibrant_color_g'][i], df['most_vibrant_color_b'][i]])
    ]) for i in range(len(df))
])
print(f"Basic image features shape: {basic_image_features.shape}")

# Standardize the features
print("Standardizing features...")
scaler = StandardScaler()
non_image_features_scaled = scaler.fit_transform(non_image_features)
basic_image_features_scaled = scaler.fit_transform(basic_image_features)

# Standardize deep features if available
if deep_features is not None:
    # Handle potential NaN values
    deep_features_clean = np.nan_to_num(deep_features)
    deep_features_scaled = scaler.fit_transform(deep_features_clean)
    print(f"Deep features scaled. Shape: {deep_features_scaled.shape}")
else:
    deep_features_scaled = None

# Create different feature combinations
print("Creating feature combinations...")

# Model 1: Audio features only
features_audio = non_image_features_scaled
print(f"Audio features shape: {features_audio.shape}")

# Model 2: Basic image features only
features_basic_image = basic_image_features_scaled
print(f"Basic image features shape: {features_basic_image.shape}")

# Model 3: Audio + Basic image features
features_audio_basic_image = np.concatenate([non_image_features_scaled, basic_image_features_scaled], axis=1)
print(f"Audio + Basic image features shape: {features_audio_basic_image.shape}")

# Model 4: Deep learning features only (if available)
if deep_features_scaled is not None:
    features_deep = deep_features_scaled
    print(f"Deep features shape: {features_deep.shape}")

# Model 5: Audio + Deep features (if available)
if deep_features_scaled is not None:
    features_audio_deep = np.concatenate([non_image_features_scaled, deep_features_scaled], axis=1)
    print(f"Audio + Deep features shape: {features_audio_deep.shape}")

# Model 6: All features combined (if deep features available)
if deep_features_scaled is not None:
    features_all = np.concatenate([non_image_features_scaled, basic_image_features_scaled, deep_features_scaled], axis=1)
    print(f"All features combined shape: {features_all.shape}")

# Build Annoy indices for each feature set
print("Building Annoy indices...")

# Model 1: Audio features
index_audio = annoy.AnnoyIndex(features_audio.shape[1], 'euclidean')
for i, feature in enumerate(features_audio):
    index_audio.add_item(i, feature)
index_audio.build(10)  # Number of trees
index_audio.save('audio_features.ann')
print("Audio features index built and saved.")

# Model 2: Basic image features
index_basic_image = annoy.AnnoyIndex(features_basic_image.shape[1], 'euclidean')
for i, feature in enumerate(features_basic_image):
    index_basic_image.add_item(i, feature)
index_basic_image.build(10)
index_basic_image.save('basic_image_features.ann')
print("Basic image features index built and saved.")

# Model 3: Audio + Basic image features
index_audio_basic_image = annoy.AnnoyIndex(features_audio_basic_image.shape[1], 'euclidean')
for i, feature in enumerate(features_audio_basic_image):
    index_audio_basic_image.add_item(i, feature)
index_audio_basic_image.build(10)
index_audio_basic_image.save('audio_basic_image_features.ann')
print("Audio + Basic image features index built and saved.")

# Model 4: Deep learning features (if available)
if deep_features_scaled is not None:
    index_deep = annoy.AnnoyIndex(features_deep.shape[1], 'euclidean')
    for i, feature in enumerate(features_deep):
        index_deep.add_item(i, feature)
    index_deep.build(10)
    index_deep.save('deep_features.ann')
    print("Deep features index built and saved.")

# Model 5: Audio + Deep features (if available)
if deep_features_scaled is not None:
    index_audio_deep = annoy.AnnoyIndex(features_audio_deep.shape[1], 'euclidean')
    for i, feature in enumerate(features_audio_deep):
        index_audio_deep.add_item(i, feature)
    index_audio_deep.build(10)
    index_audio_deep.save('audio_deep_features.ann')
    print("Audio + Deep features index built and saved.")

# Model 6: All features combined (if deep features available)
if deep_features_scaled is not None:
    index_all = annoy.AnnoyIndex(features_all.shape[1], 'euclidean')
    for i, feature in enumerate(features_all):
        index_all.add_item(i, feature)
    index_all.build(10)
    index_all.save('all_features.ann')
    print("All features combined index built and saved.")

# Function to get song recommendations
def get_recommendations(song_id, num_recommendations=10):
    """
    Get song recommendations based on different feature sets
    
    Args:
        song_id (str): Spotify ID of the query song
        num_recommendations (int): Number of recommendations to return
        
    Returns:
        dict: Dictionary with recommendations from different models
    """
    # Find the song in the DataFrame
    if song_id not in df['id'].values:
        print(f"Song ID {song_id} not found in the dataset.")
        return None
    
    song_index = df[df['id'] == song_id].index[0]
    song_data = df.iloc[song_index]
    
    print("\n===== QUERY SONG =====")
    print(f"Song: {song_data['name']} by {song_data['artist']}")
    print(f"Spotify ID: {song_data['id']}")
    print(f"Image URL: {song_data['img']}")
    print(f"Preview URL: {song_data['preview']}")
    print("======================\n")
    
    recommendations = {}
    
    # Model 1: Audio features
    index_audio.load('audio_features.ann')
    closest_indices_audio = index_audio.get_nns_by_item(song_index, num_recommendations + 1)
    # Remove the query song itself (first result)
    closest_indices_audio = [idx for idx in closest_indices_audio if idx != song_index][:num_recommendations]
    recommendations['audio'] = df.iloc[closest_indices_audio]
    
    # Model 2: Basic image features
    index_basic_image.load('basic_image_features.ann')
    closest_indices_basic_image = index_basic_image.get_nns_by_item(song_index, num_recommendations + 1)
    closest_indices_basic_image = [idx for idx in closest_indices_basic_image if idx != song_index][:num_recommendations]
    recommendations['basic_image'] = df.iloc[closest_indices_basic_image]
    
    # Model 3: Audio + Basic image features
    index_audio_basic_image.load('audio_basic_image_features.ann')
    closest_indices_audio_basic_image = index_audio_basic_image.get_nns_by_item(song_index, num_recommendations + 1)
    closest_indices_audio_basic_image = [idx for idx in closest_indices_audio_basic_image if idx != song_index][:num_recommendations]
    recommendations['audio_basic_image'] = df.iloc[closest_indices_audio_basic_image]
    
    # Model 4: Deep learning features (if available)
    if deep_features_scaled is not None:
        index_deep.load('deep_features.ann')
        closest_indices_deep = index_deep.get_nns_by_item(song_index, num_recommendations + 1)
        closest_indices_deep = [idx for idx in closest_indices_deep if idx != song_index][:num_recommendations]
        recommendations['deep'] = df.iloc[closest_indices_deep]
    
    # Model 5: Audio + Deep features (if available)
    if deep_features_scaled is not None:
        index_audio_deep.load('audio_deep_features.ann')
        closest_indices_audio_deep = index_audio_deep.get_nns_by_item(song_index, num_recommendations + 1)
        closest_indices_audio_deep = [idx for idx in closest_indices_audio_deep if idx != song_index][:num_recommendations]
        recommendations['audio_deep'] = df.iloc[closest_indices_audio_deep]
    
    # Model 6: All features combined (if deep features available)
    if deep_features_scaled is not None:
        index_all.load('all_features.ann')
        closest_indices_all = index_all.get_nns_by_item(song_index, num_recommendations + 1)
        closest_indices_all = [idx for idx in closest_indices_all if idx != song_index][:num_recommendations]
        recommendations['all'] = df.iloc[closest_indices_all]
    
    return recommendations

# Function to print recommendations
def print_recommendations(recommendations):
    """Print recommendations from different models"""
    if recommendations is None:
        return
    
    for model_name, recs in recommendations.items():
        print(f"\n===== RECOMMENDATIONS USING {model_name.upper()} FEATURES =====")
        for i, (_, song) in enumerate(recs.iterrows()):
            print(f"{i+1}. {song['name']} by {song['artist']}")
            print(f"   Spotify ID: {song['id']}")
            print(f"   Image URL: {song['img']}")
            print(f"   Preview URL: {song['preview']}")
            print("   ---")
        print(f"===== END OF {model_name.upper()} RECOMMENDATIONS =====\n")

# Example usage
if __name__ == "__main__":
    # You can replace this with any song ID from your dataset
    query_song_id = '2245x0g1ft0HC7sf79zbYN'
    
    # Get recommendations
    recommendations = get_recommendations(query_song_id, num_recommendations=5)
    
    # Print recommendations
    print_recommendations(recommendations)
