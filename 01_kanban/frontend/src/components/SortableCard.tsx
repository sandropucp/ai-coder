import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../types';
import { CardUI } from './CardUI';

interface SortableCardProps {
  card: CardType;
  columnId: string;
}

export const SortableCard: React.FC<SortableCardProps> = ({ card, columnId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: card.id,
    data: {
      type: 'Card',
      columnId,
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <CardUI card={card} columnId={columnId} isDragging={isDragging} />
    </div>
  );
};
