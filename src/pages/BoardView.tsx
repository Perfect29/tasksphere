import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { AppDispatch, RootState } from '../store';
import { fetchBoard } from '../store/slices/boardsSlice';
import { moveCard } from '../store/slices/cardsSlice';
import { socketService } from '../services/socket';
import BoardColumn from '../components/board/BoardColumn';
import BoardCard from '../components/board/BoardCard';
import { Button } from '../components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Column, Card } from '../store/slices/boardsSlice';

const BoardView: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentBoard, isLoading } = useSelector((state: RootState) => state.boards);
  
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeCard, setActiveCard] = React.useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = React.useState<Column | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const columnsId = useMemo(() => {
    return currentBoard?.columns?.map((col) => col.id) || [];
  }, [currentBoard?.columns]);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoard(boardId));
      socketService.joinBoard(boardId);
    }

    return () => {
      if (boardId) {
        socketService.leaveBoard(boardId);
      }
    };
  }, [boardId, dispatch]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    if (active.data.current?.type === 'Card') {
      setActiveCard(active.data.current.card);
    }

    if (active.data.current?.type === 'Column') {
      setActiveColumn(active.data.current.column);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Card';
    const isOverACard = over.data.current?.type === 'Card';

    if (!isActiveACard) return;

    // Card over another card
    if (isActiveACard && isOverACard) {
      // Handle card reordering logic here
    }

    // Card over a column
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveACard && isOverAColumn) {
      // Handle moving card to different column
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    setActiveCard(null);
    setActiveColumn(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Card';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveACard && isOverAColumn) {
      const activeCard = active.data.current.card;
      const overColumn = over.data.current.column;

      if (activeCard.columnId !== overColumn.id) {
        try {
          await dispatch(moveCard({
            cardId: activeCard.id,
            columnId: overColumn.id,
            position: overColumn.cards?.length || 0,
          })).unwrap();

          // Refresh the board to show the updated state
          dispatch(fetchBoard(boardId!));

          // Emit real-time update
          socketService.emitCardMove(activeCard.id, overColumn.id, overColumn.cards?.length || 0);
        } catch (error) {
          console.error('Failed to move card:', error);
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Board not found</h3>
          <p className="text-gray-600 mb-6">The board you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentBoard.title}</h1>
              {currentBoard.description && (
                <p className="text-gray-600 text-sm">{currentBoard.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Column
            </Button>
          </div>
        </div>
      </div>

      <main className="p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-6 pb-6">
            <SortableContext items={columnsId}>
              {currentBoard.columns?.map((column) => (
                <BoardColumn key={column.id} column={column} boardId={boardId!} />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeCard && <BoardCard card={activeCard} boardId={boardId!} />}
            {activeColumn && <BoardColumn column={activeColumn} boardId={boardId!} />}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
};

export default BoardView;