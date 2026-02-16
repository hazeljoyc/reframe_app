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
    emotion: int = Field(ge=0, le=6)  # 0-6 emoji index from frontend
    context: Optional[str] = None  # renamed from emotion_context to match frontend
    situation: str  # changed from int to str - the reflection text from frontend
    intensity: int = Field(ge=1, le=10)
    additional_context: Optional[str] = None
    timeframe: str = "week"  # default to "week"

    @field_validator("category")
    @classmethod
    def category_validation(cls, category: str):
        # Accept lowercase from frontend, capitalize for internal use
        valid_categories = ["school", "internships", "career", "life"]
        if category.lower() not in valid_categories:
            raise ValueError("Invalid category")
        return category.capitalize()  # Convert to capitalized version

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

# Enable CORS - allow localhost and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check Health
@app.get("/health")
def check_health():
    return {"status": "healthy"}

def generate_ai_response(request: GenerateRequest) -> dict:
    """
    AI prompt wrapper - sends user input to Groq and returns AI-generated response.
    """
    try:
        # Convert emotion index (0-6) to display value (1-7)
        emotion_display = request.emotion + 1

        prompt = f"""You are a supportive career and education advisor helping students and young professionals.

Category: {request.category}
Timeframe: {request.timeframe}
Emotion level: {emotion_display}/7 (1 = feeling calm, 7 = feeling deeply frustrated)
What feels most true: {request.situation}
Intensity: {request.intensity}/10

{f"Emotional context: {request.context}" if request.context else ""}
{f"Additional context: {request.additional_context}" if request.additional_context else ""}

The user is feeling stressed about their {request.category.lower()} situation. Help them reframe their perspective and create an actionable plan.

Please provide:
1. A reframed perspective - help them see their situation in a more empowering way
2. Analysis - exactly 3 key insights about their situation
3. Three concrete action items with titles and descriptions
4. A timeline with 3 tasks for this week and 3 tasks for this month

Be empathetic, practical, and encouraging. Help them feel less "behind" and more empowered.

Return ONLY a JSON object with this exact structure (no extra text, just the JSON):
{{
  "reframe": "your reframed perspective here",
  "analysis": ["insight 1", "insight 2", "insight 3"],
  "actions": [
    {{ "title": "action 1 title", "description": "action 1 description" }},
    {{ "title": "action 2 title", "description": "action 2 description" }},
    {{ "title": "action 3 title", "description": "action 3 description" }}
  ],
  "timeline": [
    {{
      "week": [
        {{ "title": "week task 1", "description": "description" }},
        {{ "title": "week task 2", "description": "description" }},
        {{ "title": "week task 3", "description": "description" }}
      ],
      "month": [
        {{ "title": "month task 1", "description": "description" }},
        {{ "title": "month task 2", "description": "description" }},
        {{ "title": "month task 3", "description": "description" }}
      ]
    }}
  ]
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

        return json.loads(data)
    except json.JSONDecodeError:
        print("JSON decode error - AI returned invalid JSON")
        return {"error": "Error generating valid JSON object"}
    except Exception as e:
        print(f"Error in generate_ai_response: {e}")
        return {"error": f"API error: {str(e)}"}

def generate_plan_id(length=6):
    """Generate a random plan ID."""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for i in range(length))


@app.post("/generate-path")
def generate_path(request: GenerateRequest):
    request.timeframe = "week"

    ai_response = generate_ai_response(request)

    # Check if AI returned an error
    if "error" in ai_response:
        return {"error": True, "message": "Failed to generate AI response."}

    plan_id = generate_plan_id()
    ai_response["planId"] = plan_id

    # Validation for response
    try:
        validated_response = GenerateResponse.model_validate(ai_response)
        return validated_response
    except ValidationError as error:
        return {"error": True, "message": "Something went wrong."}
