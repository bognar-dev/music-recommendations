import cv2
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from skimage import feature
from skimage.color import rgb2hsv
from typing import List, Tuple
import os
from tqdm import tqdm  # Import tqdm
# pip install ultralytics  # For YOLOv8


def dominant_color_kmeans(image: np.ndarray, k: int = 3) -> List[Tuple[int, int, int]]:
    """
    Finds the dominant colors in an image using K-means clustering.

    Args:
        image: A numpy array representing the image (H, W, C).
        k: The number of dominant colors to find.

    Returns:
        A list of tuples representing the dominant colors in RGB format.
    """
    # Reshape the image to be a list of pixels
    pixels = image.reshape((-1, 3))

    # Use K-means clustering to find the dominant colors
    kmeans = KMeans(n_clusters=k, n_init=10, random_state=0)  # Explicitly set n_init and random_state
    kmeans.fit(pixels)

    # Get the cluster centers (dominant colors)
    dominant_colors = kmeans.cluster_centers_.astype(int)

    return [tuple(color) for color in dominant_colors]


def color_temperature(image: np.ndarray) -> str:
    """
    Determines if the image has a cool or warm color temperature.

    Args:
        image: A numpy array representing the image (H, W, C).

    Returns:
        "Cool" if the image has a cool color temperature, "Warm" otherwise.
    """
    # Calculate the average color of the image
    average_color = np.mean(image, axis=(0, 1)).astype(int)

    # Compare the blue/green values to the red/yellow values
    if average_color[0] > average_color[2]:  # Blue > Red
        return "Cool"
    else:
        return "Warm"


def color_brightness(image: np.ndarray) -> str:
    """
    Determines if the image has bright or soft colors.

    Args:
        image: A numpy array representing the image (H, W, C).

    Returns:
        "Bright" if the image has bright colors, "Soft" otherwise.
    """
    # Convert the image to HSV color space
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Calculate the average saturation and value
    average_saturation = np.mean(hsv_image[:, :, 1])
    average_value = np.mean(hsv_image[:, :, 2])

    # Determine if the colors are bright or soft based on the average
    # saturation and value
    if average_saturation > 128 and average_value > 128:
        return "Bright"
    else:
        return "Soft"


def overall_lightness(image: np.ndarray) -> str:
    """
    Determines if the image has light, dark, or medium tones.

    Args:
        image: A numpy array representing the image (H, W, C).

    Returns:
        "Light" if the image has light tones, "Dark" if the image has dark
        tones, "Medium" otherwise.
    """
    # Calculate the average lightness of the image
    average_lightness = np.mean(image)

    # Determine if the image has light, dark, or medium tones based on the
    # average lightness
    if average_lightness > 170:
        return "Light"
    elif average_lightness < 85:
        return "Dark"
    else:
        return "Medium"


def color_histograms(image: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Extracts color histograms for RGB and HSV color spaces.

    Args:
        image: A numpy array representing the image (H, W, C).

    Returns:
        A tuple containing the RGB and HSV histograms.
    """
    # Extract RGB histogram
    rgb_hist = [cv2.calcHist([image], [i], None, [256], [0, 256]) for i in range(3)]

    # Convert the image to HSV color space
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Extract HSV histogram
    hsv_hist = [cv2.calcHist([hsv_image], [i], None, [256], [0, 256]) for i in range(3)]

    return tuple(rgb_hist), tuple(hsv_hist)


def edge_detection(image: np.ndarray) -> np.ndarray:
    """
    Detects edges in the image using the Canny edge detection algorithm.

    Args:
        image: A numpy array representing the image (H, W, C).

    Returns:
        A numpy array representing the edge map.
    """
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Canny edge detection
    edges = cv2.Canny(gray_image, 100, 200)

    return edges


def texture_analysis(image: np.ndarray, num_points: int = 24, radius: int = 3) -> np.ndarray:
    """
    Performs texture analysis using Local Binary Patterns (LBP).

    Args:
        image: A numpy array representing the image (H, W, C).
        num_points: The number of points to sample around each pixel.
        radius: The radius of the circle around each pixel.

    Returns:
        A numpy array representing the LBP histogram.
    """
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Calculate LBP
    lbp = feature.local_binary_pattern(gray_image, num_points, radius, method="uniform")

    # Calculate the LBP histogram
    (hist, _) = np.histogram(lbp.ravel(), bins=np.arange(0, num_points + 3))

    # Normalize the histogram
    hist = hist.astype("float")
    hist /= (hist.sum() + 1e-7)

    return hist


def resize_to_single_pixel(image: np.ndarray) -> Tuple[int, int, int]:
    """
    Resizes the image to a single pixel and returns the color.

    Args:
        image: A numpy array representing the image (H, W, C).

    Returns:
        A tuple representing the color of the single pixel in RGB format.
    """
    resized_image = cv2.resize(image, (1, 1), interpolation=cv2.INTER_AREA)
    return tuple(resized_image[0, 0])


def luminosity_weighted_average(image: np.ndarray) -> Tuple[int, int, int]:
    """
    Calculates the luminosity-weighted average color of the image.

    Args:
        image: A numpy array representing the image (H, W, C).

    Returns:
        A tuple representing the luminosity-weighted average color in RGB
        format.
    """
    # Convert the image to float
    image = image.astype(float)

    # Calculate the luminosity weights
    weights = np.array([0.299, 0.587, 0.114])

    # Calculate the luminosity-weighted average color
    weighted_average = np.sum(image * weights, axis=(2))
    weighted_average = np.mean(weighted_average, axis=(0, 1))

    return tuple(np.repeat(weighted_average, 3).astype(int))


def find_most_vibrant_color(image: np.ndarray, brightness_threshold: float = 0.5) -> Tuple[int, int, int]:
    """
    Finds the most vibrant color in the image.

    Args:
        image: A numpy array representing the image (H, W, C).
        brightness_threshold: The minimum brightness threshold for a pixel to be
            considered.

    Returns:
        A tuple representing the most vibrant color in RGB format.
    """
    # Convert the image to HSV color space
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Get the height and width of the image
    height, width = hsv_image.shape[:2]

    # Create a list to store the vibrant colors
    vibrant_colors = []

    # Iterate over the pixels in the image
    for y in range(height):
        for x in range(width):
            # Get the HSV values for the pixel
            hue, saturation, value = hsv_image[y, x]

            # Check if the pixel meets the brightness threshold
            if value / 255.0 > brightness_threshold:
                # Add the pixel to the list of vibrant colors
                vibrant_colors.append((hue, saturation, value))

    # Check if there are any vibrant colors
    if not vibrant_colors:
        return (0, 0, 0)  # Return black if there are no vibrant colors

    # Find the most saturated color
    most_vibrant_color = max(vibrant_colors, key=lambda color: color[1])

    # Convert the most vibrant color back to RGB
    most_vibrant_color_hsv = np.uint8([[most_vibrant_color]])
    most_vibrant_color_rgb = cv2.cvtColor(most_vibrant_color_hsv, cv2.COLOR_HSV2BGR)[0][0]

    return tuple(most_vibrant_color_rgb.astype(int))


def object_detection(image: np.ndarray) -> List[str]:
    """
    Performs object detection using a pre-trained YOLOv8 model.

    Args:
        image: A numpy array representing the image (H, W, C).

    Returns:
        A list of strings representing the detected objects.
    """
    try:
        from ultralytics import YOLO  # Import YOLO here to avoid import errors if not installed
    except ImportError:
        print(
            "Error: ultralytics is not installed. Please install it using: pip install ultralytics"
        )
        return []

    # Load a pretrained YOLOv8 model
    model = YOLO("yolov8n.pt")  # You can change this to a different model if needed

    # Run inference on the image
    results = model(image)

    # Extract the detected objects
    detected_objects = []
    for result in results:
        boxes = result.boxes  # Boxes object for bounding box outputs
        for box in boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            detected_objects.append(class_name)

    return detected_objects


def extract_image_features(image_path: str) -> dict:
    """
    Extracts image features from the given image path.

    Args:
        image_path: The path to the image file.

    Returns:
        A dictionary containing the extracted image features.
    """
    try:
        image = cv2.imread(image_path)
        if image is None:
            print(f"Error: Could not read the image at {image_path}")
            return None

        # Color-Based Features
        dominant_colors = dominant_color_kmeans(image)
        temp = color_temperature(image)
        brightness = color_brightness(image)
        lightness = overall_lightness(image)
        rgb_hist, hsv_hist = color_histograms(image)
        single_pixel_color = resize_to_single_pixel(image)
        weighted_average_color = luminosity_weighted_average(image)
        most_vibrant = find_most_vibrant_color(image)

        # Structure and Content-Based Features
        edges = edge_detection(image)
        lbp_hist = texture_analysis(image)

        # Object Detection
        detected_objects = object_detection(image)

        features = {
            "dominant_colors": dominant_colors,
            "color_temperature": temp,
            "color_brightness": brightness,
            "overall_lightness": lightness,
            "rgb_histogram_shapes": [h.shape for h in rgb_hist],
            "hsv_histogram_shapes": [h.shape for h in hsv_hist],
            "single_pixel_color": single_pixel_color,
            "weighted_average_color": weighted_average_color,
            "most_vibrant_color": most_vibrant,
            "edge_map_shape": edges.shape,
            "lbp_histogram_shape": lbp_hist.shape,
            "detected_objects": detected_objects,
        }
        return features
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")
        return None


if __name__ == "__main__":
    # Load the Spotify data from CSV
    spotify_data_path = "spotify_data.csv"
    spotify_df = pd.read_csv(spotify_data_path)
    print(f"Loaded Spotify data from {spotify_data_path}")

    # Create a directory to store the album cover images
    image_dir = "album_covers"
    if not os.path.exists(image_dir):
        os.makedirs(image_dir)
        print(f"Created directory {image_dir}")

    # Function to download images (replace with your actual download function)
    def download_image(image_url: str, image_path: str) -> bool:
        """Downloads an image from the given URL to the specified path."""
        try:
            import requests
            response = requests.get(image_url, stream=True)
            response.raise_for_status()  # Raise an exception for bad status codes
            with open(image_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True
        except Exception as e:
            print(f"Error downloading image from {image_url}: {e}")
            return False

    # Add a new column to store the image file paths
    spotify_df["image_path"] = ""

    # Download album cover images and store their paths
    print("Downloading album cover images...")
    for index, row in tqdm(spotify_df.iterrows(), total=len(spotify_df), desc="Downloading Images"):
        image_url = row["img"]
        if not isinstance(image_url, str):
            print(f"Skipping download for index {index} due to invalid image URL: {image_url}")
            continue

        image_filename = f"album_cover_{index}.jpg"
        image_path = os.path.join(image_dir, image_filename)
        spotify_df.at[index, "image_path"] = image_path

        if not os.path.exists(image_path):
            if not download_image(image_url, image_path):
                spotify_df.at[index, "image_path"] = None  # Set to None if download fails
        else:
            print(f"Image already exists at {image_path}, skipping download.")

    # Save the updated DataFrame with image paths to a new CSV file
    image_paths_csv_path = "spotify_data_with_image_paths.csv"
    spotify_df.to_csv(image_paths_csv_path, index=False)
    print(f"Image paths saved to {image_paths_csv_path}")

    # Extract image features and add them to the DataFrame
    feature_columns = [
        "dominant_colors",
        "color_temperature",
        "color_brightness",
        "overall_lightness",
        "rgb_histogram_shapes",
        "hsv_histogram_shapes",
        "single_pixel_color",
        "weighted_average_color",
        "most_vibrant_color",
        "edge_map_shape",
        "lbp_histogram_shape",
        "detected_objects",
    ]
    print("Initializing feature columns...")
    for column in feature_columns:
        spotify_df[column] = None  # Initialize the new columns

    # Add new columns for the color values of the color features
    spotify_df["single_pixel_color_r"] = None
    spotify_df["single_pixel_color_g"] = None
    spotify_df["single_pixel_color_b"] = None
    spotify_df["weighted_average_color_r"] = None
    spotify_df["weighted_average_color_g"] = None
    spotify_df["weighted_average_color_b"] = None
    spotify_df["most_vibrant_color_r"] = None
    spotify_df["most_vibrant_color_g"] = None
    spotify_df["most_vibrant_color_b"] = None

    print("Extracting image features...")
    for index, row in tqdm(spotify_df.iterrows(), total=len(spotify_df), desc="Extracting Features"):
        image_path = row["image_path"]
        if image_path and os.path.exists(image_path):
            print(f"Processing image at {image_path}")
            features = extract_image_features(image_path)
            if features:
                print(f"Features extracted: {features.keys()}")
                for column in feature_columns:
                    spotify_df.at[index, column] = features.get(column)

                # Extract and assign the color values
                single_pixel_color = features.get("single_pixel_color")
                if single_pixel_color:
                    spotify_df.at[index, "single_pixel_color_r"] = single_pixel_color[0]
                    spotify_df.at[index, "single_pixel_color_g"] = single_pixel_color[1]
                    spotify_df.at[index, "single_pixel_color_b"] = single_pixel_color[2]

                weighted_average_color = features.get("weighted_average_color")
                if weighted_average_color:
                    spotify_df.at[index, "weighted_average_color_r"] = weighted_average_color[0]
                    spotify_df.at[index, "weighted_average_color_g"] = weighted_average_color[1]
                    spotify_df.at[index, "weighted_average_color_b"] = weighted_average_color[2]

                most_vibrant_color = features.get("most_vibrant_color")
                if most_vibrant_color:
                    spotify_df.at[index, "most_vibrant_color_r"] = most_vibrant_color[0]
                    spotify_df.at[index, "most_vibrant_color_g"] = most_vibrant_color[1]
                    spotify_df.at[index, "most_vibrant_color_b"] = most_vibrant_color[2]
            else:
                print(f"No features extracted for image at {image_path}")
        else:
            print(f"Skipping feature extraction for index {index} due to missing image.")

    # Save the updated DataFrame to a new CSV file
    output_csv_path = "spotify_data_with_image_features.csv"
    spotify_df.to_csv(output_csv_path, index=False)

    print(f"Image features added and saved to {output_csv_path}")