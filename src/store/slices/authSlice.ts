import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../lib/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    // For demo purposes, we'll use the built-in auth service
    const user = await authService.auth.me();
    const authData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.displayName || user.email,
        avatar: user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
      },
      token: 'blink-auth-token',
    };
    
    localStorage.setItem('token', authData.token);
    return authData;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }) => {
    // For demo purposes, we'll use the built-in auth service
    const user = await authService.auth.me();
    const authData = {
      user: {
        id: user.id,
        email: user.email,
        name: userData.name,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
      },
      token: 'blink-auth-token',
    };
    
    localStorage.setItem('token', authData.token);
    return authData;
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const user = await authService.auth.me();
    return {
      id: user.id,
      email: user.email,
      name: user.displayName || user.email,
      avatar: user.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`,
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      authService.auth.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;