# Backend API Documentation

## Endpoint

**POST** `http://localhost:8000/generate-path`

## Request Body (JSON)

```json
{
  "category": "internships",
  "emotion": 4,
  "situation": "I don't know where to start",
  "intensity": 7,
  "context": "Feeling behind my peers",
  "additional_context": "Sophomore CS student"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | string | Yes | One of: "school", "internships", "career", "life" |
| emotion | int | Yes | Emoji index 0-6 (0=calm, 6=deeply frustrated) |
| situation | string | Yes | The reflection text - what feels most true |
| intensity | int | Yes | Intensity level 1-10 |
| context | string | No | Emotional context from step 2 |
| additional_context | string | No | Optional extra context from step 3 |
| timeframe | string | No | Defaults to "week" |

## Response

```json
{
  "planId": "abc123",
  "reframe": "You're not behind, you're just getting started...",
  "analysis": [
    "Insight 1 about their situation",
    "Insight 2 about their situation",
    "Insight 3 about their situation"
  ],
  "actions": [
    { "title": "Action 1", "description": "Description of action 1" },
    { "title": "Action 2", "description": "Description of action 2" },
    { "title": "Action 3", "description": "Description of action 3" }
  ],
  "timeline": [
    {
      "week": [
        { "title": "Week task 1", "description": "Description" },
        { "title": "Week task 2", "description": "Description" },
        { "title": "Week task 3", "description": "Description" }
      ],
      "month": [
        { "title": "Month task 1", "description": "Description" },
        { "title": "Month task 2", "description": "Description" },
        { "title": "Month task 3", "description": "Description" }
      ]
    }
  ]
}
```

---

## Running the Backend Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn app-dir.main:app --reload
```

API runs at `http://localhost:8000`

---

## Environment Setup

Create `backend/.env` with:

```
GROQ_API_KEY=<get this from Timothy or Xinya>
```

**Important:** Never commit the `.env` file to git.

---

## Testing

Open `http://localhost:8000/docs` in your browser for the Swagger UI playground.

Or use curl:

```bash
curl -X POST http://localhost:8000/generate-path \
  -H "Content-Type: application/json" \
  -d '{
    "category": "internships",
    "emotion": 4,
    "situation": "I don't know where to start",
    "intensity": 7,
    "context": "Feeling behind my peers",
    "additional_context": "Sophomore CS student"
  }'
```

---

## Frontend Integration Example

```javascript
const response = await fetch('http://localhost:8000/generate-path', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    category: 'internships',
    emotion: 4,
    situation: "I don't know where to start",
    intensity: 7,
    context: 'Feeling behind my peers',
    additional_context: 'Sophomore CS student'
  })
});

const data = await response.json();
console.log(data.reframe);
console.log(data.actions);
console.log(data.timeline);
```

---

## Health Check

**GET** `http://localhost:8000/health`

Returns: `{"status": "healthy"}`
