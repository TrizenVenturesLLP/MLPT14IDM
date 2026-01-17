"""
Dataset Setup Script

Creates a sample dataset with synthetic fingerprint-like images for demo training.
This allows testing the training pipeline without requiring the full Kaggle dataset.

For production, use a real dataset like:
- UniNa Fingerprints PAD Dataset: https://www.kaggle.com/c/unina-data-mining-1819-fingeprints-pad
- LivDet datasets: https://livdet.org/

USAGE:
    python training/create_demo_dataset.py
"""

import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import random

# Output directory
DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dataset')
LIVE_PATH = os.path.join(DATASET_PATH, 'live')
SPOOF_PATH = os.path.join(DATASET_PATH, 'spoof')

# Number of images to generate
NUM_LIVE_IMAGES = 100
NUM_SPOOF_IMAGES = 100
IMAGE_SIZE = (96, 96)


def create_fingerprint_pattern(is_live: bool) -> Image.Image:
    """
    Create a synthetic fingerprint-like pattern.
    
    Live fingerprints: More natural variation, cleaner ridges
    Spoof fingerprints: More uniform, artificial patterns
    
    Args:
        is_live: If True, create live-like pattern; else spoof-like
        
    Returns:
        PIL Image with fingerprint-like pattern
    """
    # Create base image with noise
    img = Image.new('RGB', IMAGE_SIZE, color=(200, 200, 200))
    draw = ImageDraw.Draw(img)
    
    # Generate ridge-like patterns
    if is_live:
        # Live: Natural curved ridges with variation
        base_color = random.randint(50, 100)
        for i in range(20):
            # Curved lines with natural variation
            y_offset = random.randint(0, IMAGE_SIZE[1])
            amplitude = random.uniform(3, 8)
            frequency = random.uniform(0.05, 0.15)
            
            points = []
            for x in range(0, IMAGE_SIZE[0], 2):
                y = y_offset + amplitude * np.sin(frequency * x + random.uniform(0, 0.5))
                y = int(y) % IMAGE_SIZE[1]
                points.append((x, y))
            
            if len(points) > 1:
                color = (base_color + random.randint(-20, 20),) * 3
                draw.line(points, fill=color, width=random.randint(1, 2))
        
        # Add natural noise
        img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
        
    else:
        # Spoof: More uniform, artificial patterns
        base_color = random.randint(60, 80)
        for i in range(15):
            # Straighter, more uniform lines
            y_offset = i * 6 + random.randint(0, 3)
            
            points = []
            for x in range(0, IMAGE_SIZE[0], 3):
                y = y_offset + random.randint(-1, 1)
                y = max(0, min(IMAGE_SIZE[1] - 1, y))
                points.append((x, y))
            
            if len(points) > 1:
                color = (base_color,) * 3
                draw.line(points, fill=color, width=2)
        
        # Add uniform noise (less natural)
        img = img.filter(ImageFilter.GaussianBlur(radius=1.0))
    
    # Add some random dots to simulate minutiae
    for _ in range(random.randint(10, 30)):
        x = random.randint(0, IMAGE_SIZE[0] - 1)
        y = random.randint(0, IMAGE_SIZE[1] - 1)
        r = random.randint(1, 2)
        color = random.randint(40, 120)
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(color, color, color))
    
    return img


def create_demo_dataset():
    """Create demo dataset with synthetic fingerprint images."""
    print("=" * 60)
    print("Creating Demo Dataset")
    print("=" * 60)
    
    # Create directories
    os.makedirs(LIVE_PATH, exist_ok=True)
    os.makedirs(SPOOF_PATH, exist_ok=True)
    
    # Generate live images
    print(f"\nGenerating {NUM_LIVE_IMAGES} live fingerprint images...")
    for i in range(NUM_LIVE_IMAGES):
        img = create_fingerprint_pattern(is_live=True)
        img.save(os.path.join(LIVE_PATH, f'live_{i:04d}.png'))
        if (i + 1) % 20 == 0:
            print(f"  Created {i + 1}/{NUM_LIVE_IMAGES} live images")
    
    # Generate spoof images
    print(f"\nGenerating {NUM_SPOOF_IMAGES} spoof fingerprint images...")
    for i in range(NUM_SPOOF_IMAGES):
        img = create_fingerprint_pattern(is_live=False)
        img.save(os.path.join(SPOOF_PATH, f'spoof_{i:04d}.png'))
        if (i + 1) % 20 == 0:
            print(f"  Created {i + 1}/{NUM_SPOOF_IMAGES} spoof images")
    
    print("\n" + "=" * 60)
    print("Demo Dataset Created!")
    print("=" * 60)
    print(f"Live images: {LIVE_PATH}")
    print(f"Spoof images: {SPOOF_PATH}")
    print(f"Total images: {NUM_LIVE_IMAGES + NUM_SPOOF_IMAGES}")
    print("=" * 60)
    print("\nNext step: Run training with:")
    print("  python training/train_spoof_model.py --dataset_path ./dataset --epochs 10")


if __name__ == '__main__':
    create_demo_dataset()
