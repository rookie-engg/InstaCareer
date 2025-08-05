from queue import Queue
from project_types import Task, TaskResult
from youtube.fetch_data import fetch_descriptions_parallel
from youtube.postprocess import clean_video_descriptions
from youtube.youtube_types import VideoDescription, YouTubeActivity
from ollama_llm import OllamaLLM
from db._database import Database
from typing import List, Tuple

def video_description_task_executor(
        task: Task, 
        ollama_instance: OllamaLLM, 
        database_instance: Database,
        suffix_prompt: str = '',
        save_desc_queue: Queue[
            Tuple[List[VideoDescription], List[VideoDescription]]]|None = None
    ) -> TaskResult:
    '''
    Processes a task to fetch and analyze YouTube video descriptions.
    It first checks the database for existing descriptions before fetching new ones.
    '''

    id: str = task['id']
    activities: List[YouTubeActivity] = task['activities']
    
    missing_from_db: List[YouTubeActivity] = []
    all_processed_descriptions: List[VideoDescription] = []
    all_raw_descriptions: List[VideoDescription] = []

    print(f'Task with id {id} started. Checking database for {len(activities)} activities...')

    # 1. Check the database for each activity.
    for activity in activities:
        url = activity['titleUrl']
        
        processed_desc = database_instance.get_preprocessed_youtube_description(url=url)
        raw_desc = database_instance.get_raw_youtube_description(url=url)

        if processed_desc and raw_desc:
            print(f"CACHE HIT: Found description for {url} in the database.")
            all_processed_descriptions.append(processed_desc)
            all_raw_descriptions.append(raw_desc)
        else:
            print(f"CACHE MISS: No entry for {url}. Will fetch from YouTube.")
            missing_from_db.append({
                'titleUrl': url,
                'title': activity['title']
            })

    # 2. Fetch all missing descriptions from the internet in parallel.
    if missing_from_db:
        print(f"Fetching {len(missing_from_db)} new descriptions from YouTube...")
        new_raw_descriptions = fetch_descriptions_parallel(
            activities=missing_from_db,
            max_workers=10
        )
        
        # --- FIX: Filter for valid descriptions before processing and saving ---
        
        # Only keep descriptions that were fetched successfully (no 'error' key)
        valid_new_raw = [desc for desc in new_raw_descriptions if desc.get('error') is None]
        
        if valid_new_raw:
            # Clean only the valid descriptions
            valid_new_processed = clean_video_descriptions(valid_new_raw)
            
            # Add the new valid descriptions to our main lists for the current task
            all_raw_descriptions.extend(valid_new_raw)
            all_processed_descriptions.extend(valid_new_processed)

            # Queue only the valid descriptions to be saved to the database
            if save_desc_queue:
                save_desc_queue.put(tuple((valid_new_raw, valid_new_processed)))
                print(f"Queued {len(valid_new_raw)} valid new descriptions to be saved to the database.")
        else:
            print("No new valid descriptions were fetched from the missing items.")

    # 3. Build the prompt for the LLM using all available descriptions (from cache + new)
    prompt = ''
    for count, desc in enumerate(all_processed_descriptions):
        if desc and 'title' in desc and 'description' in desc:
            prompt += f"{count+1}. Title: {desc['title']}\nDescription: {desc['description']}\n\n"
    
    prompt += suffix_prompt
    
    # 4. Get the final response from the LLM.
    model_res = ollama_instance.get_model_json_response(prompt)
    
    print(f'Task with id {id} completed.')

    # 5. Return the final result.
    return {
        'id': id,
        'raw_descritions': all_raw_descriptions,
        'cleaned_descriptions': all_processed_descriptions,
        'model_promt': prompt,
        'model_res': model_res
    }