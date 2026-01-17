"""
Fingerprint Liveness Detection - Training Script

ADAPTED FROM:
    souvikbaruah/CNN-Model-Detecting-Liveness-of-Fingerprint-using-Deep-Learning-
    https://github.com/souvikbaruah/CNN-Model-Detecting-Liveness-of-Fingerprint-using-Deep-Learning-

ORIGINAL APPROACH:
    - Uses Keras Sequential CNN for binary classification (Live vs Fake)
    - Input size: 300x300 (original), adapted to 96x96 for this system
    - Uses ImageDataGenerator for data augmentation and loading
    - Binary crossentropy loss with Adam optimizer

SYSTEM-SPECIFIC ADAPTATIONS:
    - Input resized to 96x96 to match existing image_utils.py
    - Model saved to app/models/spoof_model.h5 for FastAPI integration
    - Simplified architecture for demo-level training

DATASET STRUCTURE (expected):
    dataset/
    ├── live/     # Class 1 - Real fingerprints
    └── spoof/    # Class 0 - Fake fingerprints

USAGE:
    python training/train_spoof_model.py --dataset_path ./dataset --epochs 10
"""

import os
import sys
import argparse

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Activation, Input
)
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# =============================================================================
# CONFIGURATION
# =============================================================================

# Model input dimensions - MUST match image_utils.py IMAGE_SIZE
INPUT_SIZE = (96, 96)
INPUT_SHAPE = (96, 96, 3)

# Training parameters
BATCH_SIZE = 32
DEFAULT_EPOCHS = 10
LEARNING_RATE = 0.001

# Output path for trained model
MODEL_OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    'app', 'models', 'spoof_model.h5'
)


# =============================================================================
# CNN ARCHITECTURE
# Adapted from reference repository's CNN model
# =============================================================================

def create_cnn_model():
    """
    Create CNN model for fingerprint liveness detection.
    
    ARCHITECTURE (adapted from reference repo):
        - Multiple Conv2D layers with ReLU activation
        - MaxPooling2D for spatial reduction
        - Dropout for regularization (prevents overfitting)
        - Dense layers for classification
        - Binary output: [Live probability, Spoof probability]
    
    ORIGINAL REFERENCE used:
        - Input: 300x300
        - Multiple conv blocks
        - Softmax output for 2 classes
    
    ADAPTED FOR THIS SYSTEM:
        - Input: 96x96 (matches existing preprocessing)
        - Reduced layers for faster demo training
        - Same softmax output structure
    
    Returns:
        Compiled Keras Sequential model
    """
    model = Sequential([
        # Input layer (explicit for Keras 3.x compatibility)
        Input(shape=INPUT_SHAPE),
        
        # Block 1: Feature extraction
        # REUSED from reference: Conv2D -> ReLU -> MaxPool pattern
        Conv2D(32, (3, 3), padding='same'),
        Activation('relu'),
        MaxPooling2D(pool_size=(2, 2)),
        
        # Block 2: Deeper features
        Conv2D(64, (3, 3), padding='same'),
        Activation('relu'),
        MaxPooling2D(pool_size=(2, 2)),
        
        # Block 3: More complex patterns
        Conv2D(64, (3, 3), padding='same'),
        Activation('relu'),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),  # REUSED: Dropout for regularization
        
        # Block 4: High-level features
        Conv2D(128, (3, 3), padding='same'),
        Activation('relu'),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Classification head
        # REUSED from reference: Flatten -> Dense -> Output
        Flatten(),
        Dense(256),
        Activation('relu'),
        Dropout(0.5),
        
        Dense(128),
        Activation('relu'),
        Dropout(0.5),
        
        # Output layer: 2 classes (Live, Spoof)
        # REUSED: Softmax for probability distribution
        Dense(2),
        Activation('softmax')
    ])
    
    # Compile model
    # REUSED from reference: Adam optimizer, categorical crossentropy
    model.compile(
        optimizer=Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model


# =============================================================================
# DATA LOADING
# Adapted from reference's ImageDataGenerator approach
# =============================================================================

def create_data_generators(dataset_path: str, validation_split: float = 0.2):
    """
    Create training and validation data generators.
    
    REUSED from reference:
        - ImageDataGenerator for loading and augmentation
        - rescale=1./255 for normalization to [0, 1]
        - flow_from_directory for folder-based classification
    
    SYSTEM-SPECIFIC:
        - target_size matches our INPUT_SIZE (96x96)
        - class_mode='categorical' for 2-class softmax
    
    Args:
        dataset_path: Path to dataset with 'live' and 'spoof' subdirectories
        validation_split: Fraction of data for validation
        
    Returns:
        Tuple of (train_generator, validation_generator)
    """
    # REUSED: Data augmentation and normalization
    train_datagen = ImageDataGenerator(
        rescale=1./255,              # Normalize to [0, 1] - REUSED
        validation_split=validation_split,
        rotation_range=10,           # SYSTEM-SPECIFIC: Light augmentation
        width_shift_range=0.1,
        height_shift_range=0.1,
        horizontal_flip=True
    )
    
    # Validation data: Only rescale, no augmentation
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=validation_split
    )
    
    # REUSED: flow_from_directory pattern from reference
    train_generator = train_datagen.flow_from_directory(
        dataset_path,
        target_size=INPUT_SIZE,      # ADAPTED: 96x96 instead of 300x300
        batch_size=BATCH_SIZE,
        class_mode='categorical',    # For 2-class softmax output
        subset='training',
        shuffle=True
    )
    
    validation_generator = val_datagen.flow_from_directory(
        dataset_path,
        target_size=INPUT_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation',
        shuffle=False
    )
    
    return train_generator, validation_generator


# =============================================================================
# TRAINING LOOP
# =============================================================================

def train_model(dataset_path: str, epochs: int = DEFAULT_EPOCHS):
    """
    Train the fingerprint liveness detection model.
    
    REUSED from reference:
        - model.fit() / model.fit_generator() pattern
        - ModelCheckpoint for saving best model
        - Epoch-based training
    
    Args:
        dataset_path: Path to dataset directory
        epochs: Number of training epochs
        
    Returns:
        Trained model and training history
    """
    print("=" * 60)
    print("Fingerprint Liveness Detection - Training Script")
    print("=" * 60)
    print(f"Dataset path: {dataset_path}")
    print(f"Input size: {INPUT_SIZE}")
    print(f"Epochs: {epochs}")
    print(f"Output model: {MODEL_OUTPUT_PATH}")
    print("=" * 60)
    
    # Validate dataset path
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset path not found: {dataset_path}")
    
    # Create data generators
    print("\n[1/4] Creating data generators...")
    train_gen, val_gen = create_data_generators(dataset_path)
    
    print(f"Training samples: {train_gen.samples}")
    print(f"Validation samples: {val_gen.samples}")
    print(f"Classes: {train_gen.class_indices}")
    
    # Create model
    print("\n[2/4] Building CNN model...")
    model = create_cnn_model()
    model.summary()
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(MODEL_OUTPUT_PATH), exist_ok=True)
    
    # Callbacks
    # REUSED from reference: ModelCheckpoint for saving best model
    callbacks = [
        ModelCheckpoint(
            MODEL_OUTPUT_PATH,
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        EarlyStopping(
            monitor='val_accuracy',
            patience=5,
            restore_best_weights=True,
            verbose=1
        )
    ]
    
    # Train model
    # REUSED: fit() pattern from reference
    print("\n[3/4] Training model...")
    history = model.fit(
        train_gen,
        epochs=epochs,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1
    )
    
    # Save final model (in case it's different from best checkpoint)
    print("\n[4/4] Saving trained model...")
    model.save(MODEL_OUTPUT_PATH)
    print(f"Model saved to: {MODEL_OUTPUT_PATH}")
    
    # Print final results
    print("\n" + "=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)
    final_acc = history.history['accuracy'][-1]
    final_val_acc = history.history['val_accuracy'][-1]
    print(f"Final Training Accuracy: {final_acc:.4f}")
    print(f"Final Validation Accuracy: {final_val_acc:.4f}")
    print("=" * 60)
    
    return model, history


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

def main():
    """Main entry point for training script."""
    global MODEL_OUTPUT_PATH  # Declare global at start of function
    
    parser = argparse.ArgumentParser(
        description='Train fingerprint liveness detection model'
    )
    parser.add_argument(
        '--dataset_path',
        type=str,
        required=True,
        help='Path to dataset directory with live/ and spoof/ subdirs'
    )
    parser.add_argument(
        '--epochs',
        type=int,
        default=DEFAULT_EPOCHS,
        help=f'Number of training epochs (default: {DEFAULT_EPOCHS})'
    )
    parser.add_argument(
        '--output',
        type=str,
        default=None,
        help='Output path for trained model (default: app/models/spoof_model.h5)'
    )
    
    args = parser.parse_args()
    
    # Update output path if specified
    if args.output is not None:
        MODEL_OUTPUT_PATH = args.output
    
    # Run training
    train_model(args.dataset_path, args.epochs)


if __name__ == '__main__':
    main()
