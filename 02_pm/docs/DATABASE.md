# Database Design Documentation

## Overview
The Project Management MVP uses **SQLite** for persistence. This choice ensures simplicity, zero-config deployment within the Docker container, and sufficient performance for a single-user-at-a-time tool.

## Schema Strategy
We have chosen a **Relational Schema** rather than a JSON blob. 

### Why Relational?
1. **Granularity:** Allows the AI and the backend to update specific cards or move them between columns without rewriting the entire board state.
2. **Integrity:** Enforces relationships (e.g., a card must belong to a column).
3. **Scalability:** Easily supports multiple boards per user or multiple users in the future.

## Tables

### `users`
Stores user credentials (for MVP: hardcoded check, but DB ready).
- `id`: Unique identifier.
- `username`: User's login name.
- `password`: Hashed password (for MVP: plain text "password" is fine, but structure supports hashing).

### `boards`
Represents a Kanban board.
- `id`: Unique identifier.
- `user_id`: Link to the owner.
- `name`: Board display name.

### `columns`
Represents the vertical lists in the Kanban.
- `id`: String ID (matching frontend UUIDs/slugs).
- `board_id`: Link to the parent board.
- `title`: Column name (e.g., "To Do").
- `position`: Order of the column on the board.

### `cards`
The individual tasks.
- `id`: String ID (matching frontend UUIDs/slugs).
- `column_id`: Current column the card is in.
- `title`: Card heading.
- `details`: Rich description.
- `position`: Order of the card within its column.

## Implementation Notes
- The database file will be stored in the root as `kanban.db` (and excluded from git).
- SQLAlchemy (or similar) will be used in the backend for ORM-like access.
- On startup, the backend will check if the database exists and create it if necessary, including a default board for the demo user.
