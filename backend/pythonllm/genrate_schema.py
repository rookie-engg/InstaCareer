from typing import List
from project_types import ModelResponse, Task
import json

from youtube.youtube_types import YouTubeActivity

schema = ModelResponse.model_json_schema()

with open('schema/schema.json', 'w') as f:
    f.write(json.dumps(schema, indent=2))

from typing import List
from pydantic import BaseModel

class YouTubeActivity(BaseModel):
    title: str
    titleUrl: str

class Task(BaseModel):
    id: str
    activities: List[YouTubeActivity]

    
with open('schema/request_scheme.json', 'w') as f:
    f.write(json.dumps(Task.model_json_schema() ,indent=2))
