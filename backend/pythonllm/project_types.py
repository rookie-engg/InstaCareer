from pydantic import BaseModel, Field
from typing import TypedDict, List, Dict
from youtube.youtube_types import VideoDescription, YouTubeActivity

class Task(TypedDict):
    id: str
    activities: List[YouTubeActivity]

class TaskResult(TypedDict):
    id: str
    raw_descritions: List[VideoDescription]
    cleaned_descriptions: List[VideoDescription]
    model_promt: str
    model_res: str



class OceanTrait(BaseModel):
    score: int = Field(..., ge=0, le=100)
    description: str


class OceanTraits(BaseModel):
    openness: OceanTrait
    conscientiousness: OceanTrait
    extraversion: OceanTrait
    agreeableness: OceanTrait
    neuroticism: OceanTrait


class ModelResponse(BaseModel):
    interests: List[str]
    career_suggestions: List[str]
    mapped_interest_to_careers: Dict[str, List[str]]
    career_justifications: Dict[str, str]
    interest_traits: Dict[str, List[str]]
    confidence_scores: Dict[str, float]  # Float between 0.0 and 1.0
    values: List[str]
    emotional_patterns: List[str]
    self_concept_attributes: List[str]
    ocean_traits: OceanTraits
    content_themes: List[str]
    psychological_insights: List[str]
