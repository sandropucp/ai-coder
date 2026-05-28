import React, { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Column as ColumnType, Card as CardType } from '../types';
import { SortableCard } from './SortableCard';
import { useKanban } from '../KanbanContext';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
}

export const Column: React.FC<ColumnProps> = ({ column, cards }) => {
  const { dispatch } = useKanban();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDetails, setNewCardDetails] = useState('');

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
    }
  });

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title !== column.title) {
      dispatch({ type: 'RENAME_COLUMN', columnId: column.id, newTitle: title });
    }
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      dispatch({
        type: 'ADD_CARD',
        columnId: column.id,
        title: newCardTitle,
        details: newCardDetails,
      });
      setNewCardTitle('');
      setNewCardDetails('');
      setIsAddingCard(false);
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        {isEditingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
            className="column-title-input"
          />
        ) : (
          <>
            <h3 onClick={() => setIsEditingTitle(true)} className="column-title">
              {column.title}
            </h3>
            <span className="card-count">{cards.length}</span>
          </>
        )}
      </div>

      <div ref={setNodeRef} className="card-list">
        <SortableContext 
          id={column.id}
          items={column.cardIds} 
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} columnId={column.id} />
          ))}
        </SortableContext>
      </div>

      {isAddingCard ? (
        <div className="add-card-form">
          <input
            placeholder="Card Title"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="add-card-input"
          />
          <textarea
            placeholder="Details"
            value={newCardDetails}
            onChange={(e) => setNewCardDetails(e.target.value)}
            className="add-card-textarea"
          />
          <div className="add-card-actions">
            <button onClick={handleAddCard} className="submit-card-btn">Add</button>
            <button onClick={() => setIsAddingCard(false)} className="cancel-card-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAddingCard(true)} className="add-card-btn">
          + Add Card
        </button>
      )}
    </div>
  );
};
