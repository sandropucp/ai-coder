import React from 'react';
import type { Card as CardType } from '../types';
import { useKanban } from '../KanbanContext';

interface CardUIProps {
  card: CardType;
  columnId: string;
  isDragging?: boolean;
}

export const CardUI: React.FC<CardUIProps> = ({ card, columnId, isDragging }) => {
  const { dispatch } = useKanban();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_CARD', cardId: card.id, columnId });
  };

  return (
    <div
      className={`card ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.6 : 1 }}
    >
      <div className="card-header">
        <h4 className="card-title">{card.title}</h4>
        <button onClick={handleDelete} className="delete-btn" aria-label="Delete card">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      {card.details && <p className="card-details">{card.details}</p>}
    </div>
  );
};
