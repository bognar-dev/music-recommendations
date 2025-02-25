import numpy as np
from tensorflow.keras.applications import (
    EfficientNetV2B0, MobileNetV3Large, ResNet50V2, ConvNeXtTiny
)
from tensorflow.keras.applications.efficientnet_v2 import preprocess_input as efficientnet_preprocess
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input as mobilenet_preprocess
from tensorflow.keras.applications.resnet_v2 import preprocess_input as resnet_preprocess
from tensorflow.keras.applications.convnext import preprocess_input as convnext_preprocess
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras import backend as K

def extract_cnn_features(image_path, model_name='efficientnet_v2'):
    """
    Extract deep features using a pre-trained CNN model.
    
    Parameters:
        image_path (str): Path to the image.
        model_name (str): Model to use ('efficientnet_v2', 'mobilenet_v3', 'resnet50_v2', 'convnext').
        
    Returns:
        np.ndarray: Flattened feature vector.
    """
    
    # Resize image to 224x224
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img)

    # Select model and preprocess input accordingly
    model_map = {
        'efficientnet_v2': (EfficientNetV2B0, efficientnet_preprocess),
        'mobilenet_v3': (MobileNetV3Large, mobilenet_preprocess),
        'resnet50_v2': (ResNet50V2, resnet_preprocess),
        'convnext': (ConvNeXtTiny, convnext_preprocess)
    }
    
    if model_name not in model_map:
        raise ValueError(f"Invalid model_name '{model_name}'. Choose from {list(model_map.keys())}")

    ModelClass, preprocess_func = model_map[model_name]
    
    # Load pre-trained model
    model = ModelClass(weights='imagenet', include_top=False, pooling='avg')

    # Preprocess
