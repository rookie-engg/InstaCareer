from typing import List
from youtube.youtube_types import YouTubeActivity

def extract_youtube_titles_urls_pairs(watch_data: YouTubeActivity) -> List[YouTubeActivity]:

    reduced_list = []
    for activity in watch_data:
        if 'title' not in activity or 'titleUrl' not in activity:
            # skip the dict
            continue
        reduced_list.append({
            'title': activity['title'],
            'titleUrl': activity['titleUrl']
        })
    
    return reduced_list