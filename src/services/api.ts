import authService from '../lib/auth';
import { User } from '../store/slices/authSlice';
import { Board, Card, Column } from '../store/slices/boardsSlice';

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    // For demo purposes, we'll use the built-in auth service
    // In a real app, you'd validate credentials against your user database
    const user = await authService.auth.me();
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.displayName || user.email,
        avatar: user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
      },
      token: 'blink-auth-token',
    };
  },
  
  register: async (userData: { email: string; password: string; name: string }) => {
    // For demo purposes, we'll use the built-in auth service
    const user = await authService.auth.me();
    return {
      user: {
        id: user.id,
        email: user.email,
        name: userData.name,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
      },
      token: 'blink-auth-token',
    };
  },
  
  getCurrentUser: async (): Promise<User> => {
    const user = await authService.auth.me();
    return {
      id: user.id,
      email: user.email,
      name: user.displayName || user.email,
      avatar: user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
    };
  },
};

// Boards API
export const boardsAPI = {
  getBoards: async (): Promise<Board[]> => {
    const user = await authService.auth.me();
    
    // Get boards for the current user
    const boards = await authService.db.boards.list({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    });

    // Get columns and cards for each board
    const boardsWithData = await Promise.all(
      boards.map(async (board) => {
        const columns = await authService.db.columns.list({
          where: { boardId: board.id },
          orderBy: { position: 'asc' }
        });

        const columnsWithCards = await Promise.all(
          columns.map(async (column) => {
            const cards = await authService.db.cards.list({
              where: { columnId: column.id },
              orderBy: { position: 'asc' }
            });

            return {
              id: column.id,
              title: column.title,
              position: column.position,
              boardId: column.boardId,
              cards: cards.map(card => ({
                id: card.id,
                title: card.title,
                description: card.description,
                position: card.position,
                columnId: card.columnId,
                assignedTo: card.assignedTo,
                dueDate: card.dueDate,
                attachments: card.attachments ? JSON.parse(card.attachments) : [],
                createdAt: card.createdAt,
                updatedAt: card.updatedAt,
              }))
            };
          })
        );

        return {
          id: board.id,
          title: board.title,
          description: board.description,
          createdAt: board.createdAt,
          updatedAt: board.updatedAt,
          members: [user.id], // For now, just the current user
          columns: columnsWithCards,
        };
      })
    );

    return boardsWithData;
  },
  
  getBoard: async (id: string): Promise<Board> => {
    console.log('Getting board with ID:', id);
    const user = await authService.auth.me();
    console.log('Current user ID:', user.id);
    
    const board = await authService.db.boards.list({
      where: { id, userId: user.id },
      limit: 1
    });

    console.log('Found boards:', board.length);

    if (board.length === 0) {
      // Check if board exists at all
      const allBoards = await authService.db.boards.list({
        where: { id },
        limit: 1
      });
      
      if (allBoards.length === 0) {
        throw new Error('Board does not exist');
      } else {
        console.log('Board exists but user has no access. Board userId:', allBoards[0].userId, 'Current user:', user.id);
        throw new Error('You do not have access to this board');
      }
    }

    const columns = await authService.db.columns.list({
      where: { boardId: id },
      orderBy: { position: 'asc' }
    });

    const columnsWithCards = await Promise.all(
      columns.map(async (column) => {
        const cards = await authService.db.cards.list({
          where: { columnId: column.id },
          orderBy: { position: 'asc' }
        });

        return {
          id: column.id,
          title: column.title,
          position: column.position,
          boardId: column.boardId,
          cards: cards.map(card => ({
            id: card.id,
            title: card.title,
            description: card.description,
            position: card.position,
            columnId: card.columnId,
            assignedTo: card.assignedTo,
            dueDate: card.dueDate,
            attachments: card.attachments ? JSON.parse(card.attachments) : [],
            createdAt: card.createdAt,
            updatedAt: card.updatedAt,
          }))
        };
      })
    );

    return {
      id: board[0].id,
      title: board[0].title,
      description: board[0].description,
      createdAt: board[0].createdAt,
      updatedAt: board[0].updatedAt,
      members: [user.id],
      columns: columnsWithCards,
    };
  },
  
  createBoard: async (boardData: { title: string; description?: string }): Promise<Board> => {
    const user = await authService.auth.me();
    
    // Create the board
    const board = await authService.db.boards.create({
      id: `board_${Date.now()}`,
      title: boardData.title,
      description: boardData.description,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Create default columns
    const defaultColumns = [
      { title: 'To Do', position: 0 },
      { title: 'In Progress', position: 1 },
      { title: 'Done', position: 2 },
    ];

    const columns = await Promise.all(
      defaultColumns.map(async (col, index) => {
        const column = await authService.db.columns.create({
          id: `col_${Date.now()}_${index}`,
          title: col.title,
          position: col.position,
          boardId: board.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return {
          id: column.id,
          title: column.title,
          position: column.position,
          boardId: column.boardId,
          cards: [],
        };
      })
    );

    return {
      id: board.id,
      title: board.title,
      description: board.description,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      members: [user.id],
      columns,
    };
  },
  
  updateBoard: async (id: string, data: Partial<Board>): Promise<Board> => {
    const user = await authService.auth.me();
    
    await authService.db.boards.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return boardsAPI.getBoard(id);
  },
  
  deleteBoard: async (id: string): Promise<void> => {
    console.log('Starting board deletion for ID:', id);
    const user = await authService.auth.me();
    console.log('Current user:', user.id);
    
    // First check if the board exists and belongs to the user
    const board = await authService.db.boards.list({
      where: { id, userId: user.id },
      limit: 1
    });

    console.log('Found boards for user:', board.length);

    if (board.length === 0) {
      // Check if board exists at all
      const allBoards = await authService.db.boards.list({
        where: { id },
        limit: 1
      });
      
      if (allBoards.length === 0) {
        throw new Error('Board does not exist');
      } else {
        console.log('Board exists but user has no access. Board userId:', allBoards[0].userId, 'Current user:', user.id);
        throw new Error('You do not have permission to delete this board');
      }
    }

    console.log('Board found, proceeding with deletion...');

    try {
      // Delete all cards in all columns of this board first
      const columns = await authService.db.columns.list({
        where: { boardId: id }
      });

      console.log('Found columns to delete:', columns.length);

      // Delete all cards first
      for (const column of columns) {
        const cards = await authService.db.cards.list({
          where: { columnId: column.id }
        });
        
        console.log(`Deleting ${cards.length} cards from column ${column.id}`);
        
        // Delete cards one by one to ensure proper cleanup
        for (const card of cards) {
          console.log(`Deleting card: ${card.id}`);
          try {
            await authService.db.cards.delete(card.id);
            console.log(`✓ Card ${card.id} deleted successfully`);
          } catch (cardError) {
            console.error(`✗ Failed to delete card ${card.id}:`, cardError);
            // Continue with other cards even if one fails
          }
        }
      }

      // Delete all columns of this board
      console.log('Deleting columns...');
      for (const column of columns) {
        console.log(`Deleting column: ${column.id}`);
        try {
          await authService.db.columns.delete(column.id);
          console.log(`✓ Column ${column.id} deleted successfully`);
        } catch (columnError) {
          console.error(`✗ Failed to delete column ${column.id}:`, columnError);
          // Continue with other columns even if one fails
        }
      }

      // Delete any board members
      const boardMembers = await authService.db.boardMembers.list({
        where: { boardId: id }
      });
      
      console.log(`Deleting ${boardMembers.length} board members`);
      for (const member of boardMembers) {
        console.log(`Deleting board member: ${member.id}`);
        try {
          await authService.db.boardMembers.delete(member.id);
          console.log(`✓ Board member ${member.id} deleted successfully`);
        } catch (memberError) {
          console.error(`✗ Failed to delete board member ${member.id}:`, memberError);
          // Continue with other members even if one fails
        }
      }

      // Finally delete the board
      console.log('Deleting board...');
      try {
        await authService.db.boards.delete(id);
        console.log(`✓ Board ${id} deleted successfully`);
      } catch (boardError) {
        console.error(`✗ Failed to delete board ${id}:`, boardError);
        throw boardError; // Re-throw board deletion errors as they are critical
      }
      
      console.log('Board deletion completed successfully');
    } catch (error) {
      console.error('Error during board deletion:', error);
      throw new Error(`Failed to delete board: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

// Cards API
export const cardsAPI = {
  createCard: async (cardData: { title: string; description?: string; columnId: string }): Promise<Card> => {
    // Get the current position for the new card
    const existingCards = await authService.db.cards.list({
      where: { columnId: cardData.columnId },
      orderBy: { position: 'desc' },
      limit: 1
    });

    const position = existingCards.length > 0 ? existingCards[0].position + 1 : 0;

    const card = await authService.db.cards.create({
      id: `card_${Date.now()}`,
      title: cardData.title,
      description: cardData.description,
      position,
      columnId: cardData.columnId,
      attachments: JSON.stringify([]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      id: card.id,
      title: card.title,
      description: card.description,
      position: card.position,
      columnId: card.columnId,
      assignedTo: card.assignedTo,
      dueDate: card.dueDate,
      attachments: card.attachments ? JSON.parse(card.attachments) : [],
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  },
  
  updateCard: async (id: string, data: Partial<Card>): Promise<Card> => {
    const updateData: any = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (data.attachments) {
      updateData.attachments = JSON.stringify(data.attachments);
    }

    await authService.db.cards.update(id, updateData);

    const updatedCard = await authService.db.cards.list({
      where: { id },
      limit: 1
    });

    if (updatedCard.length === 0) {
      throw new Error('Card not found');
    }

    const card = updatedCard[0];
    return {
      id: card.id,
      title: card.title,
      description: card.description,
      position: card.position,
      columnId: card.columnId,
      assignedTo: card.assignedTo,
      dueDate: card.dueDate,
      attachments: card.attachments ? JSON.parse(card.attachments) : [],
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  },
  
  deleteCard: async (id: string): Promise<void> => {
    await authService.db.cards.delete(id);
  },
  
  moveCard: async (cardId: string, columnId: string, position: number): Promise<Card> => {
    await authService.db.cards.update(cardId, {
      columnId: columnId,
      position,
      updatedAt: new Date().toISOString(),
    });

    return cardsAPI.updateCard(cardId, {});
  },
};

export default { authAPI, boardsAPI, cardsAPI };