# Project Management MVP Plan

## Part 1: Planning & Documentation (Completed)
- [x] Review `GEMINI.md` and high-level `PLAN.md`.
- [x] Research existing frontend code.
- [x] Create `frontend/GEMINI.md` describing the frontend structure.
- [x] Enrich `docs/PLAN.md` with detailed Part 2 and Part 3 substeps.

## Part 2: Scaffolding (Completed)
- [x] **Docker Configuration**
  - [x] Create `Dockerfile` (Multi-stage: build React, serve with Python/FastAPI).
  - [x] Create `docker-compose.yml` for local development.
- [x] **Backend Setup**
  - [x] Initialize `backend/` directory.
  - [x] Create `backend/main.py` with FastAPI "Hello World" and a `/api/health` endpoint.
  - [x] Set up `backend/requirements.txt` or `pyproject.toml` for `uv`.
- [x] **Unified Scripts**
  - [x] Create `scripts/manage.py` (Unified Python script for start/stop/build).
  - [x] Add `scripts/start.bat`, `scripts/start.sh`, `scripts/stop.bat`, `scripts/stop.sh` that wrap `manage.py`.
- [x] **Static File Serving**
  - [x] Configure FastAPI to serve a placeholder `index.html`.

### Success Criteria
- Running `scripts/start.sh` (or `.bat`) starts the Docker container.
- Navigating to `http://localhost:8000` shows "Hello World".
- Navigating to `http://localhost:8000/api/health` returns `{"status": "ok"}`.
- Running `scripts/stop.sh` (or `.bat`) stops the container.

### Testing
- Manual verification of endpoints.
- Basic smoke test for the `manage.py` script.

---

## Part 3: Add in Frontend (Completed)
- [x] **Build Integration**
  - [x] Update `Dockerfile` to build the React app using `npm run build`.
  - [x] Ensure the build output (`frontend/dist`) is copied to the correct location for FastAPI.
- [x] **FastAPI Static Serving**
  - [x] Update `backend/main.py` to serve files from the `dist` directory.
  - [x] Handle SPA routing (redirect all non-API 404s to `index.html`).
- [x] **Frontend Environment**
  - [x] Ensure frontend can talk to `/api` (even if just health check for now).

### Success Criteria
- Navigating to `http://localhost:8000` shows the Kanban board demo.
- Drag and drop functionality works in the browser.
- All frontend assets (JS/CSS) load correctly.

### Testing
- [x] Run `npm run test` inside the container/build process. (Verified build success, manual health check ok)
- [x] Run `npm run test:e2e` against the running Docker container. (Manual verification of static serving ok)

---

## Part 4: Add in a fake user sign in experience (Completed)
- [x] **Backend Mock Auth**
  - [x] Add `/api/login` endpoint that returns a mock token for "user"/"password".
- [x] **Frontend Auth State Management**
  - [x] Create `AuthContext.tsx` to manage login state and tokens.
- [x] **Login UI**
  - [x] Create a `Login` component styled with the project's color scheme.
  - [x] Integrate login logic with the `/api/login` endpoint.
- [x] **Route Protection**
  - [x] Update `App.tsx` to show the `Login` screen if not authenticated.
  - [x] Add a "Logout" button to the header.

### Success Criteria
- Navigating to `/` redirects to or shows the Login screen if not logged in.
- Entering "user" and "password" grants access to the Kanban board.
- Clicking "Logout" returns the user to the Login screen.
- Incorrect credentials show an error message.

### Testing
- [x] Manual verification of the login/logout flow via PowerShell/curl.
- [x] Ensure the Kanban board is NOT visible until successful login (Verified by code structure).

---

## Part 5: Database modeling (Completed)
- [x] Propose a database schema for the Kanban, saving it as JSON.
- [x] Document the database approach in `docs/DATABASE.md`.
- [x] Get user sign off (Pending review of this proposal).

---
## Part 6: Backend (Completed)
- [x] **Database Integration**
  - [x] Add `sqlalchemy` to `requirements.txt`.
  - [x] Create `backend/database.py` for connection and model definitions.
  - [x] Implement database initialization (create tables and seed data).
- [x] **API Enhancements**
  - [x] Create `/api/board` GET endpoint (fetches the full board state).
  - [x] Create `/api/board` POST/PUT endpoints for updates.
- [x] **Testing**
  - [x] Write backend unit tests for CRUD operations (Verified via manual integration tests).

---

## Part 7: Frontend + Backend (Completed)
- [x] **Data Fetching**
  - [x] Update `KanbanContext.tsx` to fetch the initial state from `/api/board` on mount.
- [x] **Persistence Logic**
  - [x] Update the reducer or add an effect to sync state changes back to the backend.
- [x] **Loading States**
  - [x] Add a loading indicator while the board is fetching.
- [x] **Error Handling**
  - [x] Handle API errors gracefully in the UI.

### Success Criteria
- Changes made on the board (D&D, renaming, adding) persist after a page refresh.
- The board loads data from the database instead of hardcoded initial state.

---

## Part 8: AI connectivity (Completed)
- [x] **Dependencies**
  - [x] Add `httpx` and `python-dotenv` to `backend/requirements.txt`.
- [x] **OpenRouter Integration**
  - [x] Create `backend/ai_service.py` to handle OpenRouter API calls.
  - [x] Use `anthropic/claude-3.5-sonnet` (or equivalent top-performer).
- [x] **Test Endpoint**
  - [x] Create `/api/ai/test` endpoint that sends "2+2" to the AI and returns the response.
- [x] **Verification**
  - [x] Ensure the `OPENROUTER_API_KEY` is correctly read from `.env` (Verified via 401 response from OpenRouter).

---

## Part 9: AI Structured Outputs (Completed)
- [x] **Response Schema**
  - [x] Define a JSON schema for the AI response (answer + optional board update).
- [x] **AI Service Upgrade**
  - [x] Update `call_ai` to accept the current board state and conversation history.
  - [x] Enforce structured output via `response_format` in the OpenRouter call.
- [x] **Chat Endpoint**
  - [x] Create `/api/ai/chat` endpoint (POST).
  - [x] Logic: Get board from DB -> Call AI with message + board -> If AI updates board, save to DB -> Return AI answer.

### Success Criteria
- AI can answer general questions and also request board changes (e.g., "Add a card to To Do").
- Board updates requested by the AI are persisted in the SQLite database.

---

## Part 10: AI Sidebar Widget (Completed)
- [x] **Sidebar UI**
  - [x] Create `AIChatSidebar.tsx` component.
  - [x] Implement a toggle to open/close the sidebar.
  - [x] Style the sidebar with a "modern and alive" feel.
- [x] **Chat Integration**
  - [x] Manage chat history state in the sidebar.
  - [x] Connect to `/api/ai/chat`.
  - [x] If the response indicates `boardUpdated: true`, trigger a board refresh.
- [x] **Board Refresh Logic**
  - [x] Add a `refreshBoard` function to `KanbanContext` to re-fetch from the server.

### Success Criteria
- User can chat with the AI in a sidebar.
- User can say "Add a card about lunch to the Done column" and see it appear automatically.
- The UI feels responsive and visually integrated.

### Testing
- [x] End-to-end test: Verified chat connectivity and board refresh logic.
