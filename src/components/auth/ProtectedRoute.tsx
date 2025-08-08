import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../store';
import { getCurrentUser } from '../../store/slices/authSlice';
import { socketService } from '../../services/socket';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (token) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;