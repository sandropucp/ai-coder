import { describe, it, expect } from 'vitest';
import { kanbanReducer, type Action } from './KanbanContext';
import type { BoardState } from './types';

const mockState: BoardState = {
  cards: {
    'card-1': { id: 'card-1', title: 'Card 1', details: 'Details 1' },
    'card-2': { id: 'card-2', title: 'Card 2', details: 'Details 2' },
  },
  columns: {
    'col-1': { id: 'col-1', title: 'Column 1', cardIds: ['card-1'] },
    'col-2': { id: 'col-2', title: 'Column 2', cardIds: ['card-2'] },
  },
  columnOrder: ['col-1', 'col-2'],
};

describe('kanbanReducer', () => {
  it('should rename a column', () => {
    const action: Action = { type: 'RENAME_COLUMN', columnId: 'col-1', newTitle: 'New Title' };
    const newState = kanbanReducer(mockState, action);
    expect(newState.columns['col-1'].title).toBe('New Title');
  });

  it('should delete a card', () => {
    const action: Action = { type: 'DELETE_CARD', cardId: 'card-1', columnId: 'col-1' };
    const newState = kanbanReducer(mockState, action);
    expect(newState.cards['card-1']).toBeUndefined();
    expect(newState.columns['col-1'].cardIds).not.toContain('card-1');
  });

  it('should move a card within the same column', () => {
    const stateWithTwoCards: BoardState = {
      ...mockState,
      columns: {
        ...mockState.columns,
        'col-1': { id: 'col-1', title: 'Column 1', cardIds: ['card-1', 'card-2'] },
      },
    };
    const action: Action = {
      type: 'MOVE_CARD',
      cardId: 'card-2',
      sourceColumnId: 'col-1',
      destinationColumnId: 'col-1',
      destinationIndex: 0,
    };
    const newState = kanbanReducer(stateWithTwoCards, action);
    expect(newState.columns['col-1'].cardIds).toEqual(['card-2', 'card-1']);
  });

  it('should move a card to a different column', () => {
    const action: Action = {
      type: 'MOVE_CARD',
      cardId: 'card-1',
      sourceColumnId: 'col-1',
      destinationColumnId: 'col-2',
      destinationIndex: 0,
    };
    const newState = kanbanReducer(mockState, action);
    expect(newState.columns['col-1'].cardIds).toEqual([]);
    expect(newState.columns['col-2'].cardIds).toEqual(['card-1', 'card-2']);
  });

  it('should add a card', () => {
    const action: Action = {
      type: 'ADD_CARD',
      columnId: 'col-1',
      title: 'New Card',
      details: 'New Details',
    };
    const newState = kanbanReducer(mockState, action);
    const oldKeys = Object.keys(mockState.cards);
    const newCardId = Object.keys(newState.cards).find(id => !oldKeys.includes(id));
    
    expect(newCardId).toBeDefined();
    expect(newState.cards[newCardId!].title).toBe('New Card');
    expect(newState.columns['col-1'].cardIds).toContain(newCardId);
  });
});
