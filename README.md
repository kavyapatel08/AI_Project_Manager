# 🧠 Mini AI Project Manager

Turn unstructured meeting notes into structured, trackable tasks — automatically extracting **owners**, **due dates**, and **priority** using an LLM.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![Python](https://img.shields.io/badge/backend-FastAPI-009688) ![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB) ![LLM](https://img.shields.io/badge/AI-Groq%20Llama%203.1-orange)

---

## ✨ What It Does

- 📝 Paste raw meeting notes or task descriptions into a simple text box
- 🤖 An LLM (Groq `llama-3.1-8b-instant`) extracts actionable tasks and infers:
  - Task description
  - Owner (if mentioned)
  - Due date (even from relative terms like *"by Friday"* or *"next week"*)
  - Priority (`High` / `Medium` / `Low`) based on urgency language
- 💾 Tasks are saved to a database automatically
- 📋 View all tasks in a clean, filterable list (by owner, status, priority)
- ✅ One-click status toggle (Pending → In Progress → Done) directly from the list
- ✏️ Edit any task's details inline
- 🗑️ Delete tasks (with a confirmation prompt so you don't lose one by accident)
- 📤 Export the full task list to CSV

---

## 🔒 Security Measures Implemented

This started as a fast prototype, so these were added deliberately once the core feature worked — not left as defaults:

| Area | What's in place |
|---|---|
| **CORS** | Restricted to explicit allowed origins via an env variable — no wildcard `*` access |
| **Rate limiting** | The LLM-calling endpoint (`/extract-tasks`) is rate-limited to prevent cost abuse / DoS |
| **CSV injection** | Export sanitizes any cell starting with `=`, `+`, `-`, `@` so Excel/Sheets can't execute it as a formula |
| **Prompt injection defense** | 3 layers: (1) a pre-filter regex blocks known jailbreak/injection phrasing before it reaches the LLM, (2) the prompt explicitly instructs the model to treat notes as untrusted data and reject instructions disguised as tasks, (3) a post-filter drops any suspicious task/owner that still slips through |
| **Input validation** | Notes are capped at a max length before being sent to the LLM; all extracted fields are type- and shape-checked before being saved to the database |
| **Environment-based config** | API URLs and secrets are read from environment variables, never hardcoded — safe to deploy across environments |
| **Safe date handling** | Relative dates ("Friday", "next week") are resolved via a precomputed date lookup table in Python rather than trusting the LLM to do date math |

> ⚠️ **Note:** This project does not yet include user authentication/authorization — anyone with API access can read/edit/delete tasks. Not recommended for multi-user production use without adding an auth layer.

---

## 🛠️ Tech Stack

- **Backend:** FastAPI, SQLAlchemy, SQLite, Groq API
- **Frontend:** React (Vite), Tailwind CSS, Axios
- **LLM:** Groq `llama-3.1-8b-instant`

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/mini-ai-project-manager.git
cd mini-ai-project-manager
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
GROQ_API_KEY=your_groq_api_key_here
ALLOWED_ORIGINS=http://localhost:5173
```

Run the backend:

```bash
uvicorn main:app --reload
```

The API will be live at `http://localhost:8000`.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE=http://localhost:8000
```

Run the frontend:

```bash
npm run dev
```

The app will be live at `http://localhost:5173`.

---

## 📁 Project Structure

```
mini-ai-pm/
├── backend/
│   ├── main.py              # FastAPI app, routes, CORS, rate limiting
│   ├── models.py             # SQLAlchemy models (Task)
│   ├── schemas.py            # Pydantic schemas
│   ├── database.py           # DB engine/session setup
│   ├── groq_service.py       # LLM extraction logic + prompt + guardrails
│   ├── requirements.txt
│   └── .env                  # GROQ_API_KEY, ALLOWED_ORIGINS (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── NotesInput.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   ├── TaskEditModal.jsx
│   │   │   └── ExportButton.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── .env                  # VITE_API_BASE (not committed)
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/extract-tasks` | Extract structured tasks from raw notes |
| `GET` | `/tasks` | List tasks (optional filters: `owner`, `status`, `priority`) |
| `PUT` | `/tasks/{id}` | Update a task |
| `DELETE` | `/tasks/{id}` | Delete a task |
| `GET` | `/tasks/export` | Export all tasks as CSV |

---

## 🌐 Deployment

- **Backend:** Deployed on [Railway](https://railway.app)
- **Frontend:** Deployed on [Vercel](https://vercel.com)

Make sure `ALLOWED_ORIGINS` on the backend matches your deployed frontend URL exactly (no trailing slash), and `VITE_API_BASE` on the frontend points to your deployed backend URL.

---

## 📄 License

This project is for educational/demo purposes.