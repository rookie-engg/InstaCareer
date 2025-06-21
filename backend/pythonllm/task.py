from queue import Queue
from project_types import Task, TaskResult
from youtube.fetch_data import fetch_descriptions_parallel
from youtube.postprocess import clean_video_descriptions
from youtube.youtube_types import VideoDescription, YouTubeActivity
from ollama_llm import OllamaLLM
from db.database import Database
from typing import List, Tuple

def video_description_task_executor(
        task: Task, 
        ollama_instance: OllamaLLM, 
        database_instance: Database,
        suffix_prompt: str = '',
        save_desc_queue: Queue[
            Tuple[List[VideoDescription], List[VideoDescription]]]|None = None
    ) -> Tuple[TaskResult, List[VideoDescription], List[VideoDescription]]:
    '''returns processed model response and newly 
        fetch description and processed descriptions'''

    id: str = task['id']
    activities: List[YouTubeActivity] = task['activities']
    missing_descriptions: List[YouTubeActivity] = []
    processed_descriptions: List[VideoDescription] = []
    raw_descriptions: List[VideoDescription] = []

    print(f'task with id{id} started')

    for activity in activities:
        url = activity['titleUrl']
        processed = database_instance.get_preprocessed_youtube_description(url=url)
        raw = database_instance.get_raw_youtube_description(url=url)
        if not processed:
            missing_descriptions.append({
                'titleUrl': url,
                'title': activity['title']
            })
        else:
            print(f'database url found: {url}')
            processed_descriptions.append(processed)
            raw_descriptions.append(raw)

    new_raw_descriptions = fetch_descriptions_parallel(
        activities=missing_descriptions
    )
    raw_descriptions.extend(new_raw_descriptions)
    new_processed_descriptions = clean_video_descriptions(new_raw_descriptions)
    processed_descriptions.extend(new_processed_descriptions)

    if save_desc_queue:
        save_desc_queue.put(tuple((new_raw_descriptions, new_processed_descriptions)))
    
    prompt = ''
    for count, desc in enumerate(processed_descriptions):
        if 'title' not in desc or 'description' not in desc: continue
        prompt += f"{count+1}. Title:{desc['title']}\nDescription:{desc['description']}\n\n"
    
    prompt += suffix_prompt
    model_res = ollama_instance.get_model_json_response(prompt)
    
    print(f'task with {id} completed')

    return {
        'id': id,
        'raw_descritions': raw_descriptions,
        'cleaned_descriptions': processed_descriptions,
        'model_promt': prompt,
        'model_res': model_res
    }

