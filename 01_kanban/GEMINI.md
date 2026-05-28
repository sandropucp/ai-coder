# Kanban Project

## 1. Overview

An MVP of a Kanban-style Project Management application focused on a slick, professional UI and extreme simplicity. The goal is a functional prototype for a single board with minimal but high-quality features.

## 2. Functional Requirements

- **Single Board:** The application supports exactly one board.
- **Fixed Columns:** The board must have exactly 5 columns.
- **Column Customization:** Users can rename column titles.
- **Card Management:**
  - Each card consists of a **Title** and **Details** (text only).
  - Create: Add new cards to any column.
  - Delete: Remove existing cards.
  - Move: Drag and drop interface to move cards between columns.
- **Initial State:** The application must launch with dummy data pre-populated for the board.
- **Constraints:** No search, no filtering, no archiving, and no multi-board support.

## 3. UI/UX & Design

- **Aesthetic:** Slick, professional, and gorgeous interface.
- **Responsiveness:** Full-width layout. Columns must adapt to fill the screen width on all device sizes (mobile, tablet, desktop).
- **Interactions:** Smooth drag-and-drop transitions and hover states.
- **Color Palette:**
  - **Accent Yellow:** `#ecad0a` (highlights, accent lines)
  - **Blue Primary:** `#209dd7` (links, primary buttons/sections)
  - **Purple Secondary:** `#753991` (submit buttons, important actions)
  - **Dark Navy:** `#032147` (main headings, background elements)
  - **Gray Text:** `#888888` (supporting text, labels)

## 4. Technical Architecture

- **Frontend:** React (TypeScript) with Vite.
- **State Management:** Client-side only (no persistence/backend required for MVP).
- **Libraries:** Use modern, standard libraries for drag-and-drop (e.g., `@hello-pangea/dnd` or `dnd-kit`) and styling (e.g., Vanilla CSS or CSS Modules).
- **Location:** All frontend code must reside in the `/frontend` subdirectory.

## 5. Development Strategy

1. **Scaffolding:** Initialize Vite project in `/frontend` with TypeScript and proper `.gitignore`.
2. **Component Architecture:** Design modular components (Board, Column, Card).
3. **Core Logic:** Implement state management for cards and column titles.
4. **Drag & Drop:** Integrate movement logic.
5. **Polishing:** Apply the design system and ensure responsiveness.

## 6. Testing & Validation

- **Unit Testing:** Rigorous unit tests for core logic (moving cards, updating titles).
- **E2E Testing:** Integration testing using Playwright to verify the complete user flow (creating cards, drag-and-drop).
- **Manual Verification:** Confirm responsive behavior across multiple viewport sizes.

## 7. Coding Standards

- **Simplicity:** NEVER over-engineer. Focus on the simplest implementation that meets the requirements.
- **Modernity:** Use the latest stable versions of libraries and idiomatic React patterns.
- **Brevity:** Keep README and documentation minimal.
- **Constraint:** NO emojis in the codebase, commits, or documentation.
