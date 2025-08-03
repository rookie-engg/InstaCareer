from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os

# --- Updated to handle multiple models ---
# List of all models you want to download and save locally
model_names = [
    "Helsinki-NLP/opus-mt-hi-en",
    "Helsinki-NLP/opus-mt-mr-en"
]

print(f"Starting download for {len(model_names)} models...")

# Loop through each model name in the list
for model_name in model_names:
    try:
        # Define the local directory where you want to save the model
        # We'll use the part after the '/' for a clean directory name
        local_dir_name = model_name.split('/')[-1]
        local_model_path = os.path.join("models", local_dir_name)

        # Create the directory if it doesn't exist
        os.makedirs(local_model_path, exist_ok=True)

        print(f"\nSaving model '{model_name}' to '{local_model_path}'...")

        # Download and save the tokenizer
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        tokenizer.save_pretrained(local_model_path)

        # Download and save the model
        model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        model.save_pretrained(local_model_path)

        print(f"✅ Successfully saved '{model_name}'.")

    except Exception as e:
        print(f"❌ Failed to download '{model_name}'. Error: {e}")


print("\nAll downloads complete! ✨")