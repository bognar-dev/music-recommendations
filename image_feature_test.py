import cv2
import numpy as np
from sklearn.cluster import KMeans
from skimage import feature
from skimage.color import rgb2hsv
from typing import List, Tuple
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
    kmeans = KMeans(n_clusters=k, n_init=10)  # Explicitly set n_init
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


# Example Usage (replace "album_cover.jpg" with your image file)
if __name__ == "__main__":
    image = cv2.imread("album_cover.jpg")

    if image is None:
        print("Error: Could not read the image.  Make sure 'album_cover.jpg' exists.")
        exit()

    # Color-Based Features
    dominant_colors = dominant_color_kmeans(image)
    print(f"Dominant Colors (K-means): {dominant_colors}")

    temp = color_temperature(image)
    print(f"Color Temperature: {temp}")

    brightness = color_brightness(image)
    print(f"Color Brightness: {brightness}")

    lightness = overall_lightness(image)
    print(f"Overall Lightness: {lightness}")

    rgb_hist, hsv_hist = color_histograms(image)
    print(f"RGB Histogram Shapes: {[h.shape for h in rgb_hist]}")  # Print shapes
    print(f"HSV Histogram Shapes: {[h.shape for h in hsv_hist]}")  # Print shapes

    single_pixel_color = resize_to_single_pixel(image)
    print(f"Single Pixel Color: {single_pixel_color}")

    weighted_average_color = luminosity_weighted_average(image)
    print(f"Luminosity Weighted Average Color: {weighted_average_color}")

    most_vibrant = find_most_vibrant_color(image)
    print(f"Most Vibrant Color: {most_vibrant}")

    # Structure and Content-Based Features
    edges = edge_detection(image)
    print(f"Edge Map Shape: {edges.shape}")  # Print shape

    lbp_hist = texture_analysis(image)
    print(f"LBP Histogram Shape: {lbp_hist.shape}")  # Print shape

    # Object Detection
    detected_objects = object_detection(image)
    print(f"Detected Objects: {detected_objects}")

    Display the edge map (optional)
    cv2.imshow("Edges", edges)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
