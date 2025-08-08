import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cardsAPI } from '../../services/api';
import { Card } from './boardsSlice';

interface CardsState {
  isLoading: boolean;
  error: string | null;
}

const initialState: CardsState = {
  isLoading: false,
  error: null,
};

export const createCard = createAsyncThunk(
  'cards/createCard',
  async (cardData: { title: string; description?: string; columnId: string }, { rejectWithValue }) => {
    try {
      const response = await cardsAPI.createCard(cardData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create card');
    }
  }
);

export const updateCard = createAsyncThunk(
  'cards/updateCard',
  async ({ id, data }: { id: string; data: Partial<Card> }, { rejectWithValue }) => {
    try {
      const response = await cardsAPI.updateCard(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update card');
    }
  }
);

export const deleteCard = createAsyncThunk(
  'cards/deleteCard',
  async (cardId: string, { rejectWithValue }) => {
    try {
      console.log('Deleting card:', cardId);
      await cardsAPI.deleteCard(cardId);
      console.log('Card deleted successfully:', cardId);
      return cardId;
    } catch (error: any) {
      console.error('Delete card error:', error);
      return rejectWithValue(error.message || 'Failed to delete card');
    }
  }
);

export const moveCard = createAsyncThunk(
  'cards/moveCard',
  async ({ cardId, columnId, position }: { cardId: string; columnId: string; position: number }, { rejectWithValue }) => {
    try {
      const response = await cardsAPI.moveCard(cardId, columnId, position);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to move card');
    }
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create card
      .addCase(createCard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCard.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createCard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to create card';
      })
      // Update card
      .addCase(updateCard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCard.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to update card';
      })
      // Delete card
      .addCase(deleteCard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Card deleted successfully from Redux state:', action.payload);
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to delete card';
        console.error('Delete card rejected:', action.payload);
      })
      // Move card
      .addCase(moveCard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(moveCard.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(moveCard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to move card';
      });
  },
});

export const { clearError } = cardsSlice.actions;
export default cardsSlice.reducer;