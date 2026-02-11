import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model

# Path to the model
model_path = "e:/TRIZEN/MLPT14IDM-1/backend/fingerprint_altered_easy_vs_real.h5"
test_path = "e:/TRIZEN/MLPT14IDM-1/backend/test_dataset"

print("Loading model...")
model = load_model(model_path)
print("Model loaded successfully.")

for class_name in ["Real", "Altered-Easy"]:
    folder_path = os.path.join(test_path, class_name)
    if not os.path.exists(folder_path):
        print(f"Directory not found: {folder_path}")
        continue
        
    files = os.listdir(folder_path)
    print(f"\nChecking images in: {class_name}")
    
    for file in files[:10]:   # Testing first 10 images
        img_path = os.path.join(folder_path, file)
        
        try:
            img = image.load_img(img_path, target_size=(128,128))
            img_array = image.img_to_array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            
            prediction = model.predict(img_array, verbose=0)[0][0]
            
            if prediction > 0.5:
                predicted_label = "Real"
                confidence = prediction
            else:
                predicted_label = "Altered-Easy"
                confidence = 1 - prediction
            
            print(f"Image: {file}")
            print(f"Actual: {class_name}")
            print(f"Predicted: {predicted_label}")
            print(f"Confidence: {round(confidence*100,2)}%")
            print("-" * 40)
        except Exception as e:
            print(f"Error processing {file}: {e}")
