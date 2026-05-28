# Backend Documentation

## Overview
The backend is a FastAPI application designed to serve both the React frontend and a RESTful API.

## Tech Stack
- **Framework:** FastAPI
- **Server:** Uvicorn
- **Package Manager:** `uv` (used within Docker)
- **Database:** SQLite (planned)

## Project Structure
- `main.py`: Entry point for the FastAPI application.
- `requirements.txt`: Python dependencies.

## API Endpoints
- `GET /api/health`: Returns the health status of the API.
- `GET /`: Serves the static React application (currently a placeholder).
