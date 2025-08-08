import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AppDispatch } from '../../store';
import { createCard } from '../../store/slices/cardsSlice';
import { fetchBoard, Column } from '../../store/slices/boardsSlice';
import BoardCard from './BoardCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Plus, X } from 'lucide-react';

interface BoardColumnProps {
  column: Column;
  boardId: string;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ column, boardId }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      await dispatch(createCard({
        title: newCardTitle,
        columnId: column.id,
      })).unwrap();
      
      setNewCardTitle('');
      setIsAddingCard(false);
      
      // Refresh the board to show the new card
      dispatch(fetchBoard(boardId));
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingCard(false);
    setNewCardTitle('');
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-100 w-80 h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-blue-500"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 w-80 max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-white p-3 rounded-t-md border-b border-gray-200 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {column.cards?.length || 0}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {column.cards?.map((card) => (
          <BoardCard key={card.id} card={card} boardId={boardId} />
        ))}

        {isAddingCard ? (
          <Card className="p-3">
            <form onSubmit={handleAddCard}>
              <Input
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Enter card title"
                className="mb-2"
                autoFocus
              />
              <div className="flex items-center space-x-2">
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Add Card
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelAdd}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:bg-white hover:text-gray-900"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add a card
          </Button>
        )}
      </div>
    </div>
  );
};

export default BoardColumn;