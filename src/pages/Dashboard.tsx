import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { fetchBoards, createBoard, deleteBoard, clearDeleteError } from '../store/slices/boardsSlice';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Plus, Users, Calendar, MoreHorizontal, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const Dashboard: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { boards, isLoading, deletingBoardId, deleteError } = useSelector((state: RootState) => state.boards);

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      await dispatch(createBoard({
        title: newBoardTitle,
        description: newBoardDescription,
      })).unwrap();
      
      setNewBoardTitle('');
      setNewBoardDescription('');
      setIsCreateDialogOpen(false);
      
      // Refresh boards list
      dispatch(fetchBoards());
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      console.log('Dashboard: Attempting to delete board:', boardId);
      
      // Find the board being deleted for better logging
      const boardToDeleteData = boards.find(b => b.id === boardId);
      console.log('Dashboard: Board details:', {
        id: boardToDeleteData?.id,
        title: boardToDeleteData?.title,
        columnsCount: boardToDeleteData?.columns?.length || 0,
        totalCards: boardToDeleteData?.columns?.reduce((sum, col) => sum + (col.cards?.length || 0), 0) || 0
      });
      
      // Dispatch delete action - same pattern as fetchBoard
      const result = await dispatch(deleteBoard(boardId)).unwrap();
      console.log('Dashboard: Board deleted successfully', result);
      
      // Refresh boards list to reflect the change - same as open board refreshes data
      await dispatch(fetchBoards()).unwrap();
      console.log('Dashboard: Boards list refreshed');
      
      // Success feedback - mirroring open board success patterns
      console.log('✅ Board deleted successfully');
      
      // Close the confirmation dialog
      setBoardToDelete(null);
      
    } catch (error) {
      console.error('Dashboard: Failed to delete board:', error);
      console.error('Dashboard: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        boardId,
        timestamp: new Date().toISOString()
      });
      
      // Refresh boards list anyway in case of partial deletion - same recovery pattern
      try {
        console.log('Dashboard: Attempting to refresh boards after error...');
        await dispatch(fetchBoards()).unwrap();
        console.log('Dashboard: Boards refreshed after error');
      } catch (refreshError) {
        console.error('Failed to refresh boards after deletion error:', refreshError);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      // Check if the date is today
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      if (isToday) {
        return date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your boards...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's a delete error - mirroring open board error patterns
  if (deleteError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to delete board</h3>
          <p className="text-gray-600 mb-6">{deleteError}</p>
          <div className="space-y-2">
            <Button onClick={() => dispatch(clearDeleteError())} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                dispatch(clearDeleteError());
                dispatch(fetchBoards());
              }}
              className="w-full"
            >
              Refresh Boards
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Boards</h2>
            <p className="text-gray-600 mt-1">Manage your projects and collaborate with your team</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Board
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreateBoard}>
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                  <DialogDescription>
                    Create a new board to organize your tasks and collaborate with your team.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Board Title</Label>
                    <Input
                      id="title"
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="Enter board title"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={newBoardDescription}
                      onChange={(e) => setNewBoardDescription(e.target.value)}
                      placeholder="Enter board description"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    Create Board
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No boards yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first board</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <Card 
                key={board.id} 
                className={`hover:shadow-lg transition-shadow duration-200 group relative ${
                  deletingBoardId === board.id ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div 
                      className="cursor-pointer flex-1 pr-2"
                      onClick={() => navigate(`/board/${board.id}`)}
                    >
                      <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {board.title}
                      </CardTitle>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 focus:opacity-100 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/board/${board.id}`);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Open Board
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            setBoardToDelete(board.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {board.description && (
                    <div 
                      className="cursor-pointer"
                      onClick={() => navigate(`/board/${board.id}`)}
                    >
                      <CardDescription className="line-clamp-3">
                        {board.description}
                      </CardDescription>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent 
                  className="cursor-pointer"
                  onClick={() => navigate(`/board/${board.id}`)}
                >
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{board.members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{formatDate(board.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
                
                {/* Loading overlay when deleting - mirroring open board loading pattern */}
                {deletingBoardId === board.id && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-red-200">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-3 text-sm font-medium text-gray-700">Deleting board...</p>
                      <p className="mt-1 text-xs text-gray-500">This may take a moment</p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!boardToDelete} onOpenChange={() => setBoardToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <AlertDialogTitle>Delete Board</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="mt-4">
                Are you sure you want to delete <strong>"{boards.find(b => b.id === boardToDelete)?.title}"</strong>? 
                <br /><br />
                This will permanently delete:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>The board and all its columns</li>
                  <li>All cards and their content</li>
                  <li>All attachments and comments</li>
                  <li>Board member access</li>
                </ul>
                <br />
                <span className="text-red-600 font-medium">This action cannot be undone.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletingBoardId === boardToDelete}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => boardToDelete && handleDeleteBoard(boardToDelete)} 
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                disabled={deletingBoardId === boardToDelete}
              >
                {deletingBoardId === boardToDelete ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting board...
                  </div>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Board
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
  );
};

export default Dashboard;