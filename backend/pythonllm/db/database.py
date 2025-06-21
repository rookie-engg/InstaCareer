from typing import Dict, List
from pymongo import MongoClient, UpdateOne
from youtube.youtube_types import VideoDescription

class Database():

    def __init__(self, host: str, port: int, dname: str):
        self._DATABASE_HOST: str = host
        self._DATABASE_PORT: int = port
        self._DATABASE_NAME: str = dname
        self._RAW_COLLECTION_NAME: str = 'raw_descriptions'
        self._PROCESSED_COLLECTION_NAME: str = 'processed_descriptions'
        self._URL_KEY = 'titleUrl'
        self._TITLE_KEY = 'title'
        self._DESCRIPTION_KEY = 'description'
        self._client = MongoClient(
            host=self._DATABASE_HOST, 
            port=self._DATABASE_PORT,
            username='root',
            password='root',
            authSource='admin'
        )
        self._database = self._client.get_database(name=self._DATABASE_NAME)
        self._raw_description_collection = self._database.get_collection(name=self._RAW_COLLECTION_NAME)
        self._processed_description_collection = self._database.get_collection(name=self._PROCESSED_COLLECTION_NAME)

        # Create unique index on titleUrl to prevent duplicates
        self._raw_description_collection.create_index(self._URL_KEY, unique=True)
        self._processed_description_collection.create_index(self._URL_KEY, unique=True)

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
