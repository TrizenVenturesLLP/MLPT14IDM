"""
Liveness Detection Agent (Agent 2)

Detects whether a fingerprint image appears live or spoofed using CNN-based analysis.

MODEL LOADING:
    - Loads trained model from app/models/spoof_model.h5
    - Falls back to demo model if trained model not found
    
MODEL ARCHITECTURE (from training script):
    - CNN with Conv2D, MaxPooling, Dropout layers
    - Input: 96x96x3 RGB image
    - Output: [live_probability, spoof_probability] via softmax

INTEGRATION WITH RISK ENGINE:
    - Returns liveness_score ∈ [0, 1]
    - Higher score = more likely to be LIVE
    - Score is passed to risk_engine.py for classification
"""

import os
import numpy as np
from typing import Optional, Tuple

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Activation, Input
)


class LivenessAgent:
    """
    Agent 2: Fingerprint Liveness/Spoof Detection
    
    Uses a trained CNN model to analyze fingerprint images and determine
    the probability that the fingerprint is from a live finger
    versus a spoofed/artificial source.
    
    MODEL OUTPUT INTERPRETATION:
        - Model outputs [live_prob, spoof_prob] via softmax
        - live_prob is returned as liveness_score
        - Higher liveness_score = more likely to be a live fingerprint
    """
    
    # Model input dimensions - MUST match image_utils.py and training script
    INPUT_SHAPE: Tuple[int, int, int] = (96, 96, 3)
    
    # Default model path
    DEFAULT_MODEL_PATH = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        'models',
        'spoof_model.h5'
    )
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize the liveness detection agent.
        
        Args:
            model_path: Path to trained model (.h5 file).
                       If None, uses default path app/models/spoof_model.h5
                       If model not found, creates demo model.
        """
        # Use provided path or default
        self.model_path = model_path or self.DEFAULT_MODEL_PATH
        self.model = self._load_or_create_model()
        self._is_trained_model = False
        
    def _load_or_create_model(self) -> tf.keras.Model:
        """
        Load trained model or create demo model.
        
        Priority:
            1. Load trained model from self.model_path
            2. Fall back to demo model if trained model not found
        
        Returns:
            Keras model ready for inference
        """
        if self.model_path and os.path.exists(self.model_path):
            print(f"[LivenessAgent] Loading trained model from: {self.model_path}")
            self._is_trained_model = True
            return load_model(self.model_path)
        else:
            print(f"[LivenessAgent] Trained model not found at: {self.model_path}")
            print("[LivenessAgent] Creating demo model (predictions will be random)")
            self._is_trained_model = False
            return self._create_demo_model()
    
    def _create_demo_model(self) -> tf.keras.Model:
        """
        Create a lightweight CNN model for demonstration.
        
        This is used when no trained model is available.
        Architecture matches the training script for consistency.
        
        NOTE: This model is NOT trained and will produce random predictions.
        For real predictions, train the model using training/train_spoof_model.py
        
        Returns:
            Compiled Keras model (untrained)
        """
        model = Sequential([
            # Match training script architecture
            Input(shape=self.INPUT_SHAPE),
            
            # Block 1
            Conv2D(32, (3, 3), padding='same'),
            Activation('relu'),
            MaxPooling2D(pool_size=(2, 2)),
            
            # Block 2
            Conv2D(64, (3, 3), padding='same'),
            Activation('relu'),
            MaxPooling2D(pool_size=(2, 2)),
            
            # Block 3
            Conv2D(64, (3, 3), padding='same'),
            Activation('relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            
            # Block 4
            Conv2D(128, (3, 3), padding='same'),
            Activation('relu'),
            MaxPooling2D(pool_size=(2, 2)),
            Dropout(0.25),
            
            # Classification head
            Flatten(),
            Dense(256),
            Activation('relu'),
            Dropout(0.5),
            
            Dense(128),
            Activation('relu'),
            Dropout(0.5),
            
            # Output: [live_prob, spoof_prob]
            Dense(2),
            Activation('softmax')
        ])
        
        model.compile(
            loss='categorical_crossentropy',
            optimizer='adam',
            metrics=['accuracy']
        )
        
        return model
    
    def predict(self, preprocessed_image: np.ndarray) -> float:
        """
        Predict liveness score for a fingerprint image.
        
        MODEL OUTPUT:
            - Shape: (1, 2) -> [live_probability, spoof_probability]
            - We return live_probability as liveness_score
        
        LIVENESS SCORE INTERPRETATION:
            - 0.0 = Definitely spoofed (fake fingerprint)
            - 1.0 = Definitely live (real fingerprint)
            - Score is passed to risk_engine for risk level classification
        
        Args:
            preprocessed_image: Preprocessed image array of shape (1, 96, 96, 3)
                               Must be normalized to [0, 1]
            
        Returns:
            Liveness score between 0 and 1
        """
        # Get model predictions
        predictions = self.model.predict(preprocessed_image, verbose=0)
        
        # MODEL OUTPUT FORMAT:
        # predictions shape: (1, 2) -> [live_prob, spoof_prob]
        # Index 0 = Live probability (assuming class 'live' is index 0)
        # Index 1 = Spoof probability (assuming class 'spoof' is index 1)
        
        # Note: Class indices depend on folder alphabetical order
        # 'live' comes before 'spoof' alphabetically, so:
        #   - Index 0 = live
        #   - Index 1 = spoof
        
        # Return live probability as liveness score
        liveness_score = float(predictions[0][0])
        
        return liveness_score
    
    def analyze(self, preprocessed_image: np.ndarray) -> dict:
        """
        Perform full liveness analysis.
        
        Args:
            preprocessed_image: Preprocessed image array
            
        Returns:
            Dictionary with liveness analysis results
        """
        liveness_score = self.predict(preprocessed_image)
        
        return {
            "liveness_score": round(liveness_score, 4),
            "is_live": liveness_score >= 0.5,
            "confidence": abs(liveness_score - 0.5) * 2,  # 0-1 scale
            "model_type": "trained" if self._is_trained_model else "demo"
        }
    
    @property
    def is_trained(self) -> bool:
        """Check if using a trained model."""
        return self._is_trained_model
