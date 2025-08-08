import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AppDispatch } from '../../store';
import { updateCard, deleteCard } from '../../store/slices/cardsSlice';
import { fetchBoard, Card } from '../../store/slices/boardsSlice';
import { Card as UICard, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Calendar, User, Paperclip, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface BoardCardProps {
  card: Card;
  boardId: string;
}

const BoardCard: React.FC<BoardCardProps> = ({ card, boardId }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description || '');
  const dispatch = useDispatch<AppDispatch>();

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
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(updateCard({
        id: card.id,
        data: {
          title: editTitle,
          description: editDescription,
        },
      })).unwrap();
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update card:', error);
    }
  };

  const handleDeleteCard = async () => {
    try {
      await dispatch(deleteCard(card.id)).unwrap();
      // Refresh the board to show the updated state
      dispatch(fetchBoard(boardId));
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-white p-3 rounded-md shadow-sm border-2 border-blue-500 rotate-5"
      />
    );
  }

  return (
    <>
      <UICard
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow duration-200 group"
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-5 flex-1 pr-2">
              {card.title}
            </h4>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Card</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{card.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCard} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {card.description && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2">
              {card.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {card.dueDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>{formatDate(card.dueDate)}</span>
                </div>
              )}
              
              {card.attachments && card.attachments.length > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <Paperclip className="mr-1 h-3 w-3" />
                  <span>{card.attachments.length}</span>
                </div>
              )}
            </div>

            {card.assignedTo && (
              <div className="flex items-center text-xs text-gray-500">
                <User className="mr-1 h-3 w-3" />
                <span>Assigned</span>
              </div>
            )}
          </div>
        </CardContent>
      </UICard>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdateCard}>
            <DialogHeader>
              <DialogTitle>Edit Card</DialogTitle>
              <DialogDescription>
                Make changes to your card here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BoardCard;