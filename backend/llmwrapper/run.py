#!/usr/bin/env python3
import os
import subprocess
import nltk
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# --- Configuration ---
# List of Hugging Face models to check for and download if missing.
REQUIRED_MODELS = [
    "Helsinki-NLP/opus-mt-hi-en",
    "Helsinki-NLP/opus-mt-mr-en"
]
MODELS_BASE_DIR = "models"

# List of NLTK data packages required by your application.
REQUIRED_NLTK_PACKAGES = [
    'punkt',
    'wordnet',
    'stopwords',
    'omw-1.4'
]

# The name of your main server file to run after checks are complete.
SERVER_FILE = "server.py"

def check_and_download_models():
    """
    Checks for local Hugging Face models and downloads them if they are missing.
    """
    print("--- 🔎 Checking for NLP models... ---")
    os.makedirs(MODELS_BASE_DIR, exist_ok=True)
    all_models_found = True

    for model_name in REQUIRED_MODELS:
        # Create a clean directory name from the model identifier.
        local_dir_name = model_name.split('/')[-1]
        local_model_path = os.path.join(MODELS_BASE_DIR, local_dir_name)

        # Check if the model directory already exists.
        if os.path.isdir(local_model_path):
            print(f"✅ Model '{model_name}' found at '{local_model_path}'.")
        else:
            all_models_found = False
            print(f"⚠️ Model '{model_name}' not found. Downloading...")
            try:
                # Download and save both the tokenizer and the model.
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                tokenizer.save_pretrained(local_model_path)

                model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
                model.save_pretrained(local_model_path)
                
                print(f"✅ Successfully saved '{model_name}' to '{local_model_path}'.")
            except Exception as e:
                print(f"❌ Critical Error: Failed to download '{model_name}'.")
                print(f"   Reason: {e}")
                print("   Please check your internet connection and try again.")
                exit(1) # Exit the script as the server cannot run without models.
    
    if all_models_found:
        print("👍 All required models are already in place.")


def check_and_download_nltk_data():
    """
    Checks for necessary NLTK data and downloads any missing packages.
    """
    print("\n--- 🔎 Checking for NLTK data packages... ---")
    try:
        for package in REQUIRED_NLTK_PACKAGES:
            # nltk.download is idempotent; it checks before downloading.
            # 'quiet=True' suppresses verbose output for packages that already exist.
            nltk.download(package, quiet=True)
        print("👍 All required NLTK packages are available.")
    except Exception as e:
        print(f"❌ Critical Error: Failed to download NLTK data.")
        print(f"   Reason: {e}")
        print("   Please check your internet connection and permissions.")
        exit(1) # Exit as the server may depend on this data.

def start_server():
    """
    Starts the main server application using a subprocess.
    """
    print(f"\n--- ▶️ Pre-execution checks complete. Starting '{SERVER_FILE}'... ---")
    try:
        # Execute the server.py script.
        # 'check=True' will raise an exception if the server exits with an error.
        subprocess.run(["python", SERVER_FILE], check=True)
    except FileNotFoundError:
        print(f"❌ Error: The server file '{SERVER_FILE}' was not found.")
        print("   Please ensure this script is in the same directory as your server file.")
        exit(1)
    except subprocess.CalledProcessError as e:
        print(f"❌ The server '{SERVER_FILE}' exited with an error (code {e.returncode}).")
        exit(1)

if __name__ == "__main__":
    check_and_download_models()
    check_and_download_nltk_data()
    start_server()