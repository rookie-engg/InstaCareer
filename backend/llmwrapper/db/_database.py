from typing import Dict, List
from pymongo import MongoClient, UpdateOne
from youtube.youtube_types import VideoDescription

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

        # --- MODIFICATION START ---
        # Construct a standard MongoDB connection string URI
        # This is the recommended way to connect.
        connection_uri = (
            f"mongodb://{self._DATABASE_USERNAME}:{self._DATABASE_PASSWORD}@"
            f"{self._DATABASE_HOST}:{self._DATABASE_PORT}/"
            f"?authSource={self._DATABASE_AUTH_SOURCE}"
        )

        # Connect using the URI
        self._client = MongoClient(connection_uri)
        # --- MODIFICATION END ---
        
        self._database = self._client.get_database(name=self._DATABASE_NAME)
        self._raw_description_collection = self._database.get_collection(name=self._RAW_COLLECTION_NAME)
        self._processed_description_collection = self._database.get_collection(name=self._PROCESSED_COLLECTION_NAME)

        # Create unique index on titleUrl to prevent duplicates
        # It's good practice to wrap this in a try-except block in case of connection issues
        try:
            self._raw_description_collection.create_index(self._URL_KEY, unique=True)
            self._processed_description_collection.create_index(self._URL_KEY, unique=True)
            print("✅ Successfully connected to database and ensured indexes.")
        except Exception as e:
            print(f"❌ Could not connect to MongoDB or create indexes. Error: {e}")
            # Depending on your application's needs, you might want to exit or raise the exception
            raise e

    def get_raw_youtube_description(self, url: str) -> VideoDescription | None:
        return self._raw_description_collection.find_one({self._URL_KEY: url}, {'_id': 0})

    def get_preprocessed_youtube_description(self, url: str) -> VideoDescription | None:
        return self._processed_description_collection.find_one({self._URL_KEY: url}, {'_id': 0})

    def save_in_raw_youtube_description(self, data):
        self._raw_description_collection.update_one(
            {self._URL_KEY: data[self._URL_KEY]},
            {'$set': data},
            upsert=True
        )

    def save_in_processed_youtube_description(self, data):
        self._processed_description_collection.update_one(
            {self._URL_KEY: data[self._URL_KEY]},
            {'$set': data},
            upsert=True
        )

    def save_in_raw_youtube_description_bulk(self, descs: List[VideoDescription]):
        if not descs: return
        operations = [
            UpdateOne(
                {self._URL_KEY: desc[self._URL_KEY]},
                {'$set': desc},
                upsert=True
            )
            for desc in descs
        ]
        self._raw_description_collection.bulk_write(operations)

    def save_in_processed_youtube_description_bulk(self, descs: List[VideoDescription]):
        if not descs: return
        operations = [
            UpdateOne(
                {self._URL_KEY: desc[self._URL_KEY]},
                {'$set': desc},
                upsert=True
            )
            for desc in descs
        ]
        self._processed_description_collection.bulk_write(operations)
