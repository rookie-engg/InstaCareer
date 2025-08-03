from youtube.youtube_types import VideoDescription, YouTubeActivity
from yt_dlp import YoutubeDL
from typing import List, Tuple

import concurrent.futures
import time
import random

def get_youtube_description(activity: YouTubeActivity) -> VideoDescription:
    ydl_opts = {
        'quiet': True,
        'extract_flat': False,
        'skip_download': True,
        'socket_timeout': 5,
        'no_warnings': True
    }

    try:
        with YoutubeDL(ydl_opts) as ydl:
            url = activity['titleUrl']
            info = ydl.extract_info(url, download=False)
            description = info.get('description', '')
            print(f'fetched description from Youtube url:{url}')
            return {
                'title': activity['title'],
                'titleUrl': url,
                'description': description,
                'error': None,
            }
    except Exception as e:
        print(e)
        print(f'ERROR fetching descrciption for url:{activity["titleUrl"]}')
        return {
            'title': activity['title'],
            'titleUrl': activity['titleUrl'],
            'description': '',
            'error': str(e)
        }

def fetch_descriptions_parallel(
        activities: List[VideoDescription], 
        max_workers: int = 5, 
        delay_range: Tuple[float, float] = (0.5, 2.0)) -> List[VideoDescription]:
    """
    Fetch YouTube descriptions in parallel with randomized delays to avoid bot detection.
    
    Args:
        activities: List of YouutbeActivity format dicts
        max_workers: Maximum number of parallel threads to use
        delay_range: Tuple of (min, max) delay between requests in seconds
        
    Returns:
        List of results in the same order as input activities
    """
    results = [None] * len(activities)
    
    def process_activity(index: int, activity: YouTubeActivity):
        # Add random delay to avoid appearing as a bot
        time.sleep(random.uniform(*delay_range))
        return index, get_youtube_description(activity)
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        futures = [executor.submit(process_activity, idx, act) 
                  for idx, act in enumerate(activities)]
        
        # As they complete, store results in the correct position
        for future in concurrent.futures.as_completed(futures):
            try:
                index, result = future.result()
                results[index] = result
            except Exception as e:
                print(e)
                print(f"Error processing activity: {e}")
    
    return results