'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../../store';
import { setCredentials, setAuthLoading } from '../../store/slices/authSlice';
import api from '../../lib/api';

function AuthHydrator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        // Attempt silent refresh via HttpOnly cookie on app boot
        const res = await api.post('/auth/refresh-token');
        if (res.data.success && res.data.accessToken) {
          dispatch(
            setCredentials({
              accessToken: res.data.accessToken,
              user: res.data.user,
            })
          );
        } else {
          dispatch(setAuthLoading(false));
        }
      } catch (err) {
        // No active refresh session or expired
        dispatch(setAuthLoading(false));
      }
    };

    hydrateAuth();
  }, [dispatch]);

  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}

