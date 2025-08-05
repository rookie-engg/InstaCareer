from typing import Dict, List
from pymongo import MongoClient, UpdateOne
from youtube.youtube_types import VideoDescription
import re

# --- FIX: Added the URL normalization function ---
def normalize_youtube_url(url: str) -> str | None:
    """Extracts the video ID and returns a canonical YouTube URL."""
    if not url:
        return None
    
    # Regex to find the 11-character video ID from various URL formats
    match = re.search(r"(?:v=|\/|youtu\.be\/)([0-9A-Za-z_-]{11})", url)
    
    if match:
        video_id = match.group(1)
        # Return a single, consistent format to be used as the key
        return f"https://www.youtube.com/watch?v={video_id}"
        
    # Return None if no valid YouTube video ID is found in the URL
    return None

class Database():

    def __init__(self, host: str, username: str, password: str, port: int, dname: str, auth_source: str):
        self._DATABASE_HOST: str = host
        self._DATABASE_PORT: int = port
        self._DATABASE_NAME: str = dname
        self._DATABASE_USERNAME: str = username
        self._DATABASE_PASSWORD: str = password
        self._DATABASE_AUTH_SOURCE: str = auth_source
        self._RAW_COLLECTION_NAME: str = 'raw_descriptions'
        self._PROCESSED_COLLECTION_NAME: str = 'processed_descriptions'
        self._TITLE_KEY = 'title'
        self._URL_KEY = 'titleUrl'
        self._DESCRIPTION_KEY = 'description'
        self._client = MongoClient(
            host=self._DATABASE_HOST, 
            port=self._DATABASE_PORT,
            username=self._DATABASE_USERNAME,
            password=self._DATABASE_PASSWORD,
            authSource=self._DATABASE_AUTH_SOURCE
        )
        
        self._database = self._client.get_database(name=self._DATABASE_NAME)
        self._raw_description_collection = self._database.get_collection(name=self._RAW_COLLECTION_NAME)
        self._processed_description_collection = self._database.get_collection(name=self._PROCESSED_COLLECTION_NAME)

        # Create unique index on titleUrl to prevent duplicates
        self._raw_description_collection.create_index(self._URL_KEY, unique=True)
        self._processed_description_collection.create_index(self._URL_KEY, unique=True)

    def get_raw_youtube_description(self, url: str) -> VideoDescription | None:
        normalized_url = normalize_youtube_url(url)
        if not normalized_url:
            return None
        return self._raw_description_collection.find_one({self._URL_KEY: normalized_url}, {'_id': 0})

    def get_preprocessed_youtube_description(self, url: str) -> VideoDescription | None:
        normalized_url = normalize_youtube_url(url)
        if not normalized_url:
            return None
        return self._processed_description_collection.find_one({self._URL_KEY: normalized_url}, {'_id': 0})

    def save_in_raw_youtube_description(self, data):
        normalized_url = normalize_youtube_url(data[self._URL_KEY])
        if not normalized_url:
            return
        data[self._URL_KEY] = normalized_url
        self._raw_description_collection.update_one(
            {self._URL_KEY: normalized_url},
            {'$set': data},
            upsert=True
        )

    def save_in_processed_youtube_description(self, data):
        normalized_url = normalize_youtube_url(data[self._URL_KEY])
        if not normalized_url:
            return
        data[self._URL_KEY] = normalized_url
        self._processed_description_collection.update_one(
            {self._URL_KEY: normalized_url},
            {'$set': data},
            upsert=True
        )

    def save_in_raw_youtube_description_bulk(self, descs: List[VideoDescription]):
        if not descs: return
        operations = []
        for desc in descs:
            normalized_url = normalize_youtube_url(desc[self._URL_KEY])
            if normalized_url:
                desc[self._URL_KEY] = normalized_url
                operations.append(
                    UpdateOne(
                        {self._URL_KEY: normalized_url},
                        {'$set': desc},
                        upsert=True
                    )
                )
        if operations:
            self._raw_description_collection.bulk_write(operations)

    def save_in_processed_youtube_description_bulk(self, descs: List[VideoDescription]):
        if not descs: return
        operations = []
        for desc in descs:
            normalized_url = normalize_youtube_url(desc[self._URL_KEY])
            if normalized_url:
                desc[self._URL_KEY] = normalized_url
                operations.append(
                    UpdateOne(
                        {self._URL_KEY: normalized_url},
                        {'$set': desc},
                        upsert=True
                    )
                )
        if operations:
            self._processed_description_collection.bulk_write(operations)
