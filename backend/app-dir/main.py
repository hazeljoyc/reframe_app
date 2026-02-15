from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator, Field
from typing import Optional, List
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Pydantic Models
class GenerateRequest(BaseModel):
    category: str
    #emotion: int = Field(ge=1, le=7)
    userinput: Optional[str] = None
    #situation: int = Field(ge=1, le=5)
    #intensity: int=Field(ge=1, le=10)
    #additional_context: Optional[str] = None 
    timeframe: str # changed request class to match frontend

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
    planId = str
    reframe: str
    analysis: list[str]
    actions: List[action_item]
    timeline: List[timeline_item] # changed response class to match frontend

app = FastAPI(title="Reframe API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  # TODO for Xinya - replace with specific domains for production
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

The user is feeling stressed about their {request.category} situation.
Their emotional intensity level is {request.emotion}/10.
Situation type: {request.situation}

Their responses to the questions:
- Q1: {request.q1}
- Q2: {request.q2}
- Q3: {request.q3}
- Q4: {request.q4}

{f"Additional context: {request.context}" if request.context else ""}

Please provide:
1. A reframed perspective on their situation
2. A brief explanation of why this reframe helps
3. Three concrete next steps they can take
4. A timeline: what to do this week vs. this month

Be empathetic, practical, and encouraging. Help them feel less "behind" and more empowered."""

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    return chat_completion.choices[0].message.content


@app.post("/generate-path")
def generate_path(request: GenerateRequest):
    # TODO for Xinya - add data verification/validation here before processing

    ai_response = generate_ai_response(request)

    # TODO for Xinya - add response formatting here before returning

    return GenerateResponse(response=ai_response)
