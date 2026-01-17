"""
Image Utilities Module

Provides image preprocessing functions for fingerprint liveness detection.
Based on techniques from fingerprint liveness research.
"""

import cv2
import numpy as np
from typing import Tuple

# Model input dimensions
IMAGE_SIZE: Tuple[int, int] = (96, 96)


def decode_image(file_bytes: bytes) -> np.ndarray:
    """
    Decode image bytes to numpy array.
    
    Args:
        file_bytes: Raw bytes from uploaded file
        
    Returns:
        OpenCV image as numpy array (BGR format)
        
    Raises:
        ValueError: If image cannot be decoded
    """
    # Convert bytes to numpy array
    nparr = np.frombuffer(file_bytes, np.uint8)
    
    # Decode image
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise ValueError("Could not decode image. Ensure it's a valid image file.")
    
    return image


def preprocess_for_model(image: np.ndarray) -> np.ndarray:
    """
    Preprocess image for CNN model input.
    
    Steps:
    1. Convert BGR to RGB (OpenCV uses BGR)
    2. Resize to model input size
    3. Normalize pixel values to [0, 1]
    4. Add batch dimension
    
    Args:
        image: OpenCV image (BGR format)
        
    Returns:
        Preprocessed image ready for model input (1, H, W, 3)
    """
    # Convert BGR to RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Resize to model input size
    resized = cv2.resize(rgb_image, IMAGE_SIZE)
    
    # Normalize to [0, 1]
    normalized = resized.astype(np.float32) / 255.0
    
    # Add batch dimension: (H, W, C) -> (1, H, W, C)
    batched = np.expand_dims(normalized, axis=0)
    
    return batched


def validate_image(image: np.ndarray) -> bool:
    """
    Validate that image meets basic requirements.
    
    Args:
        image: OpenCV image
        
    Returns:
        True if image is valid, False otherwise
    """
    if image is None:
        return False
    
    # Check minimum dimensions
    if image.shape[0] < 32 or image.shape[1] < 32:
        return False
    
    # Check channels (should be color or grayscale)
    if len(image.shape) < 2:
        return False
    
    return True
