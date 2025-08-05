# First, make sure you have the Google API client library installed:
# pip install google-api-python-client

from youtube.youtube_types import VideoDescription, YouTubeActivity
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from urllib.parse import urlparse, parse_qs
from typing import List, Tuple

import concurrent.futures
import time
import random
import os

# --- IMPORTANT ---
# It is strongly recommended to set your API key as an environment variable
# rather than hardcoding it directly in the script for security reasons.
# You can set it in your terminal like this:
# export YOUTUBE_API_KEY='AIzaSyAZ38ihtcvx5fLcBOrw7qGhcqsxieage7g'
# The code will then read it from the environment.
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "AIzaSyAZ38ihtcvx5fLcBOrw7qGhcqsxieage7g")
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

def get_youtube_description(activity: YouTubeActivity) -> VideoDescription:
    """
    Fetches a single YouTube video's description using the YouTube Data API.
    """
    url = activity.get('titleUrl')
    if not url:
        return {
            'title': activity.get('title'),
            'titleUrl': url,
            'description': '',
            'error': 'Missing titleUrl in activity data'
        }

    try:
        # Extract the video ID from the URL.
        # This handles URLs like 'https://www.youtube.com/watch?v=VIDEO_ID'
        parsed_url = urlparse(url)
        video_id = parse_qs(parsed_url.query).get('v', [None])[0]

        if not video_id:
            raise ValueError(f"Could not parse video ID from URL: {url}")

        # Build the YouTube API service object.
        youtube_service = build(
            YOUTUBE_API_SERVICE_NAME, 
            YOUTUBE_API_VERSION, 
            developerKey=YOUTUBE_API_KEY
        )

        # Make the API call to the videos().list endpoint.
        request = youtube_service.videos().list(
            part="snippet",
            id=video_id
        )
        response = request.execute()

        # Extract the description from the API response.
        if response.get("items"):
            description = response["items"][0]["snippet"].get("description", "")
            print(f'Fetched description from YouTube API for url: {url}')
            return {
                'title': activity['title'],
                'titleUrl': url,
                'description': description,
                'error': None,
            }
        else:
            # Handle cases where the video might not be found or is private.
            raise ValueError(f"No video items returned for ID: {video_id}")

    except (HttpError, ValueError, KeyError) as e:
        # Catch potential errors from the API call or data parsing.
        print(e)
        print(f'ERROR fetching description for url: {activity["titleUrl"]}')
        return {
            'title': activity['title'],
            'titleUrl': activity['titleUrl'],
            'description': '',
            'error': str(e)
        }

def fetch_descriptions_parallel(
        activities: List[YouTubeActivity], 
        max_workers: int = 5, 
        delay_range: Tuple[float, float] = (0.1, 0.5)) -> List[VideoDescription]:
    """
    Fetch YouTube descriptions in parallel with randomized delays.
    This function's logic remains unchanged, but it now calls the new API-based function.
    
    Args:
        activities: List of YouTubeActivity format dicts
        max_workers: Maximum number of parallel threads to use
        delay_range: Tuple of (min, max) delay between requests in seconds
        
    Returns:
        List of results in the same order as input activities
    """
    results = [None] * len(activities)
    
    def process_activity(index: int, activity: YouTubeActivity):
        # A small delay can still be useful to space out API requests.
        time.sleep(random.uniform(*delay_range))
        return index, get_youtube_description(activity)
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks.
        futures = [executor.submit(process_activity, idx, act) 
                   for idx, act in enumerate(activities)]
        
        # As they complete, store results in the correct position.
        for future in concurrent.futures.as_completed(futures):
            try:
                index, result = future.result()
                results[index] = result
            except Exception as e:
                print(e)
                print(f"Error processing activity in thread: {e}")
    
    return results

# Example Usage (optional, for testing)
if __name__ == '__main__':
    # Make sure you have a youtube_types.py file or define the types here.
    # For testing, we can define them as simple dicts.
    YouTubeActivity = dict
    VideoDescription = dict

    sample_activities: List[YouTubeActivity] = [
        {'title': 'Google I/O 2023 Keynote', 'titleUrl': 'https://www.youtube.com/watch?v=GZ38y-S_f_E'},
        {'title': 'A nonexistent video', 'titleUrl': 'https://www.youtube.com/watch?v=notarealvideo'},
        {'title': 'Introduction to Large Language Models', 'titleUrl': 'https://www.youtube.com/watch?v=zjkBMFhNj_g'}
    ]

    # Check if API key is set
    if YOUTUBE_API_KEY == "AIzaSyAZ38ihtcvx5fLcBOrw7qGhcqsxieage7g" and "YOUTUBE_API_KEY" not in os.environ:
        print("--- WARNING ---")
        print("Using a hardcoded API key. For better security, please set the YOUTUBE_API_KEY environment variable.")
        print("---------------")


    print("Fetching descriptions...")
    video_descriptions = fetch_descriptions_parallel(sample_activities)
    print("\n--- Results ---")
    import json
    print(json.dumps(video_descriptions, indent=2))
