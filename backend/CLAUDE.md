# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reframe is a decision engine helping students navigate education, internships, and career uncertainty. The backend is a Python FastAPI application that integrates with the Groq API (llama-3.3-70b-versatile model) to generate personalized action plans.

## Commands

**Run development server:**
```bash
uvicorn app-dir.main:app --reload
```
Server runs at `http://localhost:8000`

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Test the API:**
- Swagger UI: `http://localhost:8000/docs`
- Health check: `curl http://localhost:8000/health`
- Full test:
```bash
curl -X POST http://localhost:8000/generate-path \
  -H "Content-Type: application/json" \
  -d '{"category": "internships", "emotion": 4, "situation": "I don't know where to start", "intensity": 7, "context": "Feeling behind"}'
```

## Architecture

**app-dir/main.py** - Single-file FastAPI application containing:
- Pydantic models for request/response validation (`GenerateRequest`, `GenerateResponse`)
- `generate_ai_response()` - Wraps user input in structured prompt, calls Groq API, parses JSON response
- `POST /generate-path` - Main endpoint accepting user responses, returns AI-generated action plan
- `GET /health` - Health check endpoint

**Request flow:**
1. Frontend POSTs user data (category, emotion 0-6, situation, intensity 1-10, context)
2. Backend validates with Pydantic, builds prompt for Groq
3. AI returns: reframe perspective, 3 insights, 3 action items, weekly/monthly timeline
4. Response validated and returned with generated planId

## Environment

Requires `GROQ_API_KEY` in `.env` file (git-ignored).

## Team Context

- Backend: Timothy (API + AI integration), Xinya (data verification + response formatting)
- Frontend: Lauren & Hazel (Next.js at `http://localhost:3000`)
- CORS configured for localhost:3000 only
