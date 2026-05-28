import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { BoardState, Card } from './types';

export type Action =
  | { type: 'SET_BOARD'; state: BoardState }
  | { type: 'ADD_CARD'; columnId: string; title: string; details: string }
  | { type: 'DELETE_CARD'; cardId: string; columnId: string }
  | { type: 'MOVE_CARD'; cardId: string; sourceColumnId: string; destinationColumnId: string; destinationIndex: number }
  | { type: 'RENAME_COLUMN'; columnId: string; newTitle: string };

const emptyState: BoardState = {
  cards: {},
  columns: {},
  columnOrder: [],
};

export function kanbanReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'SET_BOARD':
      return action.state;
    case 'ADD_CARD': {
      const newCardId = `card-${Date.now()}`;
      const newCard: Card = { id: newCardId, title: action.title, details: action.details };
      return {
        ...state,
        cards: { ...state.cards, [newCardId]: newCard },
        columns: {
          ...state.columns,
          [action.columnId]: {
            ...state.columns[action.columnId],
            cardIds: [...state.columns[action.columnId].cardIds, newCardId],
          },
        },
      };
    }
    case 'DELETE_CARD': {
      const { [action.cardId]: _, ...remainingCards } = state.cards;
      return {
        ...state,
        cards: remainingCards,
        columns: {
          ...state.columns,
          [action.columnId]: {
            ...state.columns[action.columnId],
            cardIds: state.columns[action.columnId].cardIds.filter(id => id !== action.cardId),
          },
        },
      };
    }
    case 'MOVE_CARD': {
      const { cardId, sourceColumnId, destinationColumnId, destinationIndex } = action;
      
      const sourceColumn = state.columns[sourceColumnId];
      const destColumn = state.columns[destinationColumnId];
      
      if (!sourceColumn || !destColumn) return state;

      // Extract cards without the one being moved
      const sourceCardIds = sourceColumn.cardIds.filter(id => id !== cardId);
      
      if (sourceColumnId === destinationColumnId) {
        const newCardIds = [...sourceCardIds];
        newCardIds.splice(destinationIndex, 0, cardId);
        
        return {
          ...state,
          columns: {
            ...state.columns,
            [sourceColumnId]: { ...sourceColumn, cardIds: newCardIds },
          },
        };
      }

      const destCardIds = [...destColumn.cardIds.filter(id => id !== cardId)];
      destCardIds.splice(destinationIndex, 0, cardId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColumnId]: { ...sourceColumn, cardIds: sourceCardIds },
          [destinationColumnId]: { ...destColumn, cardIds: destCardIds },
        },
      };
    }
    case 'RENAME_COLUMN': {
      return {
        ...state,
        columns: {
          ...state.columns,
          [action.columnId]: { ...state.columns[action.columnId], title: action.newTitle },
        },
      };
    }
    default:
      return state;
  }
}

const KanbanContext = createContext<{
  state: BoardState;
  dispatch: React.Dispatch<Action>;
  isLoading: boolean;
  error: string | null;
  refreshBoard: () => Promise<void>;
} | undefined>(undefined);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, emptyState);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const isInitialMount = React.useRef(true);

  const fetchBoard = async () => {
    try {
      const response = await fetch('/api/board');
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: 'SET_BOARD', state: data });
      } else {
        setError('Failed to load board');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial state
  React.useEffect(() => {
    fetchBoard();
  }, []);

  const refreshBoard = async () => {
    await fetchBoard();
  };

  // Sync state changes to backend
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const syncBoard = async () => {
      try {
        await fetch('/api/board', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        });
      } catch (err) {
        console.error('Failed to sync board:', err);
      }
    };

    // Simple debounce to avoid too many requests during drag
    const timeoutId = setTimeout(syncBoard, 500);
    return () => clearTimeout(timeoutId);
  }, [state]);

  return (
    <KanbanContext.Provider value={{ state, dispatch, isLoading, error, refreshBoard }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
