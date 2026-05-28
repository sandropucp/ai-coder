import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { BoardState, Card } from './types';

export type Action =
  | { type: 'ADD_CARD'; columnId: string; title: string; details: string }
  | { type: 'DELETE_CARD'; cardId: string; columnId: string }
  | { type: 'MOVE_CARD'; cardId: string; sourceColumnId: string; destinationColumnId: string; destinationIndex: number }
  | { type: 'RENAME_COLUMN'; columnId: string; newTitle: string };

const initialState: BoardState = {
  cards: {
    'card-1': { id: 'card-1', title: 'Research competitors', details: 'Analyze top 3 competitors in the space' },
    'card-2': { id: 'card-2', title: 'Design system', details: 'Create a consistent color palette and typography' },
    'card-3': { id: 'card-3', title: 'API implementation', details: 'Set up the basic Express server' },
    'card-4': { id: 'card-4', title: 'Unit tests', details: 'Write tests for the main business logic' },
    'card-5': { id: 'card-5', title: 'Deployment', details: 'Configure CI/CD pipeline' },
  },
  columns: {
    'col-1': { id: 'col-1', title: 'To Do', cardIds: ['card-1', 'card-2'] },
    'col-2': { id: 'col-2', title: 'In Progress', cardIds: ['card-3'] },
    'col-3': { id: 'col-3', title: 'Review', cardIds: ['card-4'] },
    'col-4': { id: 'col-4', title: 'Testing', cardIds: [] },
    'col-5': { id: 'col-5', title: 'Done', cardIds: ['card-5'] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
};

export function kanbanReducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
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
} | undefined>(undefined);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);
  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
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
