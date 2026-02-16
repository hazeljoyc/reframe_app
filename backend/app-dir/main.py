from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator, Field, ValidationError
from typing import Optional, List
import os
from dotenv import load_dotenv
from groq import Groq
import random
import string
import json

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Pydantic Models
class GenerateRequest(BaseModel):
    category: str
    emotion: int = Field(ge=1, le=7)
    emotion_context: Optional[str] = None
    situation: int = str
    intensity: int=Field(ge=1, le=10)
    additional_context: Optional[str] = None 
    timeframe: str 

    @field_validator("category")
    @classmethod
    def category_validation(cls, category: str):
        valid_categories = ["School", "Internships", "Career", "Life"]
        if category not in valid_categories:
            raise ValueError("Invalid category")
        return category

class action_item(BaseModel):
    title: str
    description: str

class timeline_action(BaseModel):
    title: str
    description: str

class timeline_item(BaseModel):
    week: List[timeline_action]
    month: List[timeline_action]

class GenerateResponse(BaseModel):
    planId: str
    reframe: str
    analysis: list[str]
    actions: List[action_item]
    timeline: List[timeline_item] 

app = FastAPI(title="Reframe API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check Health
@app.get("/health")
def check_health():
    return {"status": "healthy"}

def generate_ai_response(request: GenerateRequest) -> str:
    """
    AI prompt wrapper - sends user input to Groq and returns AI-generated response.
    """
    prompt = f"""You are a supportive career and education advisor helping students and young professionals.

<<<<<<< HEAD
Category: {request.category}
Timeframe: {request.timeframe}
{f"User's situation: {request.userinput}" if request.userinput else ""}

The user is feeling stressed or uncertain about their {request.category.lower()} situation. Help them reframe their perspective and create an actionable plan.

Please provide:
1. A reframed perspective - help them see their situation in a more empowering way
2. Analysis - 2-3 key insights about their situation
3. Three concrete action items with titles and descriptions
4. A timeline with specific tasks for this week and this month
=======
The user is feeling stressed about their {request.category} situation.
Their emotion is {request.emotion}/10, with 1 being feeling good and 10 being feeling terrible.
Situation type: {request.situation}
The intensity of their feelings is {request.intensity}/10.

{f"Emotional context: {request.emotion_context}" if request.emotion_context else ""}
{f"Additional context: {request.additional_context}" if request.additional_context else ""}


Please provide:
1. A reframed perspective on their situation
2. Analysis with three explanations of the reframed perspective.
3. Three concrete next steps they can take
4. Three steps for a timeline of what they can do in the next week.
5. Three steps for a timeline of what they can do in the next year.
>>>>>>> 7a38e8243f950d6d1abda06a7849526be52c4426

Be empathetic, practical, and encouraging. Help them feel less "behind" and more empowered.

Return ONLY a JSON object with this exact structure:
    {{
      "reframe": "string",
      "analysis": ["string", "string", "string"],
      "actions": [{{ "title": "string", "description": "string" }}],
      "timeline": {{
        "week": [{{ "title": "string", "description": "string" }}],
        "month": [{{ "title": "string", "description": "string" }}]
      }}
    }}
    
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    data = chat_completion.choices[0].message.content

    try:
        return json.loads(data)
    except json.JSONDecodeError:
        return {"Error: Error generating valid JSON object"}

@app.get("/api/plan/:planId")
def generate_planId(length=6):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))

@app.post("/generate-path")
def generate_path(request: GenerateRequest):
    request.timeframe = "week"

    ai_response = generate_ai_response(request)
    planId = generate_planId()
    ai_response["planId"] = planId

    # Validation for response
    try:
        validated_response = GenerateResponse.model_validate(ai_response)
        return validated_response
    except ValidationError as error:
        return{
  "error": True,
  "message": "Something went wrong."
}
