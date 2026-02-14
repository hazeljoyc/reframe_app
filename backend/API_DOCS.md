# Backend API Documentation

## Endpoint

**POST** `http://localhost:8000/generate-path`

## Request Body (JSON)

```json
{
  "category": "internships",
  "emotion": 7,
  "situation": 1,
  "q1": "User answer 1",
  "q2": "User answer 2",
  "q3": "User answer 3",
  "q4": "User answer 4",
  "context": "optional extra context"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | string | Yes | One of: "education", "internships", "career" |
| emotion | int | Yes | Emotional intensity level (1-10) |
| situation | int | Yes | Situation type identifier |
| q1-q4 | string | Yes | User's answers to the adaptive questions |
| context | string | No | Optional additional context |

## Response

```json
{
  "response": "AI-generated text with reframe, explanation, next steps, and timeline"
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
    "emotion": 7,
    "situation": 1,
    "q1": "I feel stuck",
    "q2": "No callbacks",
    "q3": "Sophomore CS major",
    "q4": "Want to work in tech"
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
    emotion: 7,
    situation: 1,
    q1: '...',
    q2: '...',
    q3: '...',
    q4: '...'
  })
});

const data = await response.json();
console.log(data.response);
```

---

## Health Check

**GET** `http://localhost:8000/health`

Returns: `{"status": "healthy"}`
