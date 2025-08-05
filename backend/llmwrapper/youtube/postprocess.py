import tiktoken
import regex as re, random, os
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from nltk.corpus import stopwords
from typing import List, Tuple, Pattern
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from langdetect import detect, DetectorFactory
from youtube.youtube_types import VideoDescription
from torch.cuda import is_available as cuda_is_available

# --- Initialize NLTK ---
import nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')
nltk.download('omw-1.4')
nltk.download('punkt_tab')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# --- Regex Patterns ---
regexps: Tuple[str, ...] = (
    r'\b(?:https?://|www\.)\S+\b',
    r'\b(?:[\w-]+\.)+(com|org|net|in|io|edu|gov|co|uk|info|biz|me)(/\S*)?\b',
    r'[@#]\w+',
    r'\d{1,2}:\d{2}(?::\d{2})?',
    r'\p{Emoji}+',
    r'[^\w\s.,!?]',
    r'\s+'
)
compiled_regex: Tuple[Pattern, ...] = tuple(re.compile(r) for r in regexps)

# --- Language Detection Configuration ---
DetectorFactory.seed = 0
SUPPORTED_LANGS = {
    'hi': 'Hindi',
    'mr': 'Marathi'
}

# --- Custom noisy phrases to remove ---
noise_phrases = [
    'like share comment', 'copyright disclaimer', 'subscribe', 'follow us on',
    'official instagram', 'official facebook', 'disclaimer', 'used under fair use',
    'educational purpose', 'motivational purpose', 'video clip', 'credit', 'music by',
    'tag', 'channel', 'join', 'comment', 'description', 'social media', 'video content',
    'educational personal use', 'youtube child safety', 'please believe', 'important link',
    'used fair use policy', 'supervision professional', 'experiment shown video'
]

# --- MODIFICATION START: Functions to load and use local models ---

def load_translation_models():
    """
    Loads translation models and tokenizers from local directories.
    
    Returns:
        dict: A dictionary where keys are language codes (e.g., 'hi', 'mr')
              and values are another dictionary containing the 'model' and 'tokenizer'.
    """
    print("Attempting to load local models...")
    
    local_model_dirs = {
        "hi": "opus-mt-hi-en",
        "mr": "opus-mt-mr-en"
    }
    
    loaded_models = {}
    base_models_path = "models"

    for lang_code, dir_name in local_model_dirs.items():
        model_path = os.path.join(base_models_path, dir_name)
        
        if not os.path.isdir(model_path):
            print(f"❌ Error: Directory not found at '{model_path}'. Please run the download script.")
            continue

        try:
            print(f"Loading tokenizer for '{lang_code}' from '{model_path}'...")
            tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
            
            print(f"Loading model for '{lang_code}' from '{model_path}'...")
            model = AutoModelForSeq2SeqLM.from_pretrained(model_path, local_files_only=True)
            
            loaded_models[lang_code] = {"tokenizer": tokenizer, "model": model}
            print(f"✅ Successfully loaded model for language: '{lang_code}'")
            
        except Exception as e:
            print(f"❌ Failed to load model from '{model_path}'. Error: {e}")

    return loaded_models

# Load the models into a module-level variable when this file is imported
translation_models = load_translation_models()

def translate_text(text: str, src_lang: str) -> str:
    """
    Translates text using the pre-loaded local models.
    """
    if src_lang == 'en' or src_lang not in translation_models:
        if src_lang != 'en':
             print(f"Translation not supported or model not loaded for language: '{src_lang}'")
        return text

    try:
        translator = translation_models[src_lang]
        tokenizer = translator['tokenizer']
        model = translator['model']
        
        # Prepare the text for the model
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=400)
        
        # Generate translation
        outputs = model.generate(**inputs)
        
        # Decode the translation
        return tokenizer.decode(outputs[0], skip_special_tokens=True)

    except Exception as e:
        print(f"Translation failed ({SUPPORTED_LANGS.get(src_lang)}): {e}")
        return text


def remove_noise_phrases(text: str) -> str:
    """Remove predefined noise phrases from text."""
    for phrase in noise_phrases:
        text = text.replace(phrase, ' ')
    return text

def detect_language(text: str) -> str:
    try:
        lang = detect(text)
        return lang if lang in SUPPORTED_LANGS else 'en'
    except:
        return 'en'

def clean_text(text: str) -> str:
    text = text.lower()
    for exp in compiled_regex:
        text = exp.sub(' ', text)
    return text.encode('ascii', 'ignore').decode().strip()

def refine_text(text: str) -> str:
    """Tokenize, remove stopwords, lemmatize, and return a clean string."""
    text = remove_noise_phrases(text)
    tokens = word_tokenize(text)
    processed = [
        lemmatizer.lemmatize(token)
        for token in tokens
        if token.isalnum() and token not in stop_words
    ]
    return ' '.join(processed)

def process_description(desc: str) -> str:
    lang = detect_language(desc)
    translated = translate_text(desc, lang) # This now uses the new function
    basic_cleaned = clean_text(translated)
    return refine_text(basic_cleaned)

def clean_video_descriptions(
    descriptions: List[VideoDescription]
) -> List[VideoDescription]:
    return [
        {
            'title': clean_text(desc['title']),
            'titleUrl': desc['titleUrl'],
            'description': process_description(desc['description'])
        }
        for desc in descriptions
        if not desc.get('error') and desc.get('description')
    ]

def count_tokens(text: str) -> int:
    """Estimate the number of tokens in the given text."""
    enc = tiktoken.encoding_for_model("gpt-4")
    return len(enc.encode(text))

def choose_limited(data: List[VideoDescription], count: int = 20) -> List[VideoDescription]:
    """
    Selects a diverse and token-limited subset of video descriptions.
    """
    random.shuffle(data)
    return data[:count]
