import tiktoken
import regex as re, random
from transformers import pipeline
from nltk.corpus import stopwords
from typing import List, Tuple, Pattern
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from langdetect import detect, DetectorFactory
from youtube.youtube_types import VideoDescription
from torch.cuda import is_available as cuda_is_available

# # --- Initialize NLTK ---
# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('stopwords')
# nltk.download('omw-1.4')

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

device = "cpu"
# if cuda_is_available():
#     device = "cuda"


# --- Translation Pipelines ---
translators = {
    'hi': pipeline("translation", model="Helsinki-NLP/opus-mt-hi-en", device=device),
    'mr': pipeline("translation", model="Helsinki-NLP/opus-mt-mr-en", device=device)
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

def translate_text(text: str, src_lang: str) -> str:
    if src_lang == 'en':
        return text
    try:
        return translators[src_lang](text, max_length=400)[0]['translation_text']
    except Exception as e:
        print(f"Translation failed ({SUPPORTED_LANGS.get(src_lang)}): {e}")
        return text

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
    translated = translate_text(desc, lang)
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
        # if desc.get('description')
        if not desc.get('error')
    ]

def count_tokens(text: str) -> int:
    """Estimate the number of tokens in the given text."""

    enc = tiktoken.encoding_for_model("gpt-4")
    return len(enc.encode(text))

def choose_limited(data: List[VideoDescription], count: int = 20) -> List[VideoDescription]:
    """
    Selects a diverse and token-limited subset of video descriptions.
    Ensures total tokens (prompt + descriptions) stay under `max_tokens`.
    """
    random.shuffle(data)  # Shuffle for content diversity
    return data[:count]

