import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { boardsAPI } from '../../services/api';

export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members: string[];
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards: Card[];
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  columnId: string;
  assignedTo?: string;
  dueDate?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface BoardsState {
  boards: Board[];
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  deletingBoardId: string | null;
  deleteError: string | null;
}

const initialState: BoardsState = {
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,
  deletingBoardId: null,
  deleteError: null,
};

export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async () => {
    const response = await boardsAPI.getBoards();
    return response;
  }
);

export const fetchBoard = createAsyncThunk(
  'boards/fetchBoard',
  async (boardId: string) => {
    const response = await boardsAPI.getBoard(boardId);
    return response;
  }
);

export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (boardData: { title: string; description?: string }) => {
    const response = await boardsAPI.createBoard(boardData);
    return response;
  }
);

export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ id, data }: { id: string; data: Partial<Board> }) => {
    const response = await boardsAPI.updateBoard(id, data);
    return response;
  }
);

export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId: string) => {
    await boardsAPI.deleteBoard(boardId);
    return boardId;
  }
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    clearCurrentBoard: (state) => {
      state.currentBoard = null;
    },
    updateBoardRealtime: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
      if (state.currentBoard?.id === action.payload.id) {
        state.currentBoard = action.payload;
      }
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
      state.deletingBoardId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch boards';
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.currentBoard = action.payload;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push(action.payload);
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        const index = state.boards.findIndex(board => board.id === action.payload.id);
        if (index !== -1) {
          state.boards[index] = action.payload;
        }
        if (state.currentBoard?.id === action.payload.id) {
          state.currentBoard = action.payload;
        }
      })
      .addCase(deleteBoard.pending, (state, action) => {
        state.deletingBoardId = action.meta.arg;
        state.deleteError = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.deletingBoardId = null;
        state.boards = state.boards.filter(board => board.id !== action.payload);
        if (state.currentBoard?.id === action.payload) {
          state.currentBoard = null;
        }
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.deletingBoardId = null;
        state.deleteError = action.error.message || 'Failed to delete board';
      });
  },
});

export const { clearCurrentBoard, updateBoardRealtime, clearDeleteError } = boardsSlice.actions;
export default boardsSlice.reducer;