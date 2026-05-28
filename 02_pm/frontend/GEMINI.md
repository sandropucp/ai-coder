# Frontend Documentation

## Overview
This is a React-based Kanban board MVP. It uses Vite as the build tool and TypeScript for type safety.

## Tech Stack
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Drag & Drop:** `@dnd-kit` (core, sortable, utilities)
- **State Management:** React Context API + `useReducer`
- **Testing:**
  - **Unit:** Vitest
  - **E2E:** Playwright
- **Styling:** Vanilla CSS (`index.css`)

## Key Components
- `App.tsx`: The root component that sets up the layout.
- `KanbanContext.tsx`: Contains the `kanbanReducer` and provides the global state for cards and columns.
- `Board.tsx`: Orchestrates the `DndContext` and renders columns.
- `Column.tsx`: Renders a list of `SortableCard` components.
- `SortableCard.tsx`: Wrapper for `CardUI` to make it draggable.
- `CardUI.tsx`: The presentation component for a Kanban card.

## State Structure
The board state is defined in `types.ts` and managed in `KanbanContext.tsx`:
- `cards`: A map of card IDs to card objects.
- `columns`: A map of column IDs to column objects (including an array of `cardIds`).
- `columnOrder`: An array of column IDs to determine the horizontal order.

## Available Scripts
- `npm run dev`: Start Vite dev server.
- `npm run build`: Build for production.
- `npm run test`: Run unit tests with Vitest.
- `npm run test:e2e`: Run E2E tests with Playwright.
- `npm run lint`: Run ESLint.
