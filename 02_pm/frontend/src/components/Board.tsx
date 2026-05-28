import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type CollisionDetection,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useKanban } from '../KanbanContext';
import { Column } from './Column';
import { CardUI } from './CardUI';

export const Board: React.FC = () => {
  const { state, dispatch, isLoading, error } = useKanban();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnOfCard = useCallback((cardId: string) => {
    if (state.columns[cardId]) return cardId;
    return Object.keys(state.columns).find((colId) =>
      state.columns[colId].cardIds.includes(cardId)
    );
  }, [state.columns]);

  const customCollisionDetection: CollisionDetection = useCallback(
    (args) => {
      // First, try to find a collision with a card using pointerWithin
      const pointerCollisions = pointerWithin(args);
      const cardCollision = pointerCollisions.find((c) => {
        const data = c.data?.droppableContainer?.data?.current;
        return data && data.type === 'Card';
      });

      if (cardCollision) {
        return [cardCollision];
      }

      // If no card is found, look for columns
      const columnCollisions = pointerCollisions.find((c) => {
        const data = c.data?.droppableContainer?.data?.current;
        return data && data.type === 'Column';
      });

      if (columnCollisions) {
        return [columnCollisions];
      }

      // Fallback to closestCorners
      return closestCorners(args);
    },
    []
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumnId = findColumnOfCard(activeId);
    const overColumnId = findColumnOfCard(overId);

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
      return;
    }

    const destColumn = state.columns[overColumnId];
    const destinationIndex = destColumn.cardIds.indexOf(overId);
    const finalIndex = destinationIndex === -1 ? destColumn.cardIds.length : destinationIndex;

    dispatch({
      type: 'MOVE_CARD',
      cardId: activeId,
      sourceColumnId: activeColumnId,
      destinationColumnId: overColumnId,
      destinationIndex: finalIndex,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const activeColumnId = findColumnOfCard(activeId);
      const overColumnId = findColumnOfCard(overId);

      if (activeColumnId && overColumnId) {
        const destColumn = state.columns[overColumnId];
        const destinationIndex = destColumn.cardIds.indexOf(overId);
        const finalIndex = destinationIndex === -1 ? destColumn.cardIds.length : destinationIndex;

        if (activeId !== overId || activeColumnId !== overColumnId) {
          dispatch({
            type: 'MOVE_CARD',
            cardId: activeId,
            sourceColumnId: activeColumnId,
            destinationColumnId: overColumnId,
            destinationIndex: finalIndex,
          });
        }
      }
    }

    setActiveId(null);
  };

  const activeCard = activeId ? state.cards[activeId] : null;
  const activeCardColumnId = activeId ? findColumnOfCard(activeId) : null;

  if (isLoading) {
    return <div className="board-message">Loading your board...</div>;
  }

  if (error) {
    return <div className="board-message error">{error}</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          const cards = column.cardIds.map((id) => state.cards[id]);
          return <Column key={column.id} column={column} cards={cards} />;
        })}
      </div>
      <DragOverlay>
        {activeId && activeCard && activeCardColumnId ? (
          <CardUI card={activeCard} columnId={activeCardColumnId} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
