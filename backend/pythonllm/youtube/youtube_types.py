from typing import TypedDict

class YouTubeActivity(TypedDict):
    title: str
    titleUrl: str

class VideoDescription(TypedDict):
    title: str
    titleUrl: str
    description: str
    error: str | None