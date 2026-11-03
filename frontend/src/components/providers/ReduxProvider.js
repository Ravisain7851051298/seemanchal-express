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
      // Avoid making an unneeded network call or prompting cross-origin storage permissions
      // on device startup for normal readers/visitors who have never logged in
      const hasStoredSession =
        typeof window !== 'undefined' &&
        (localStorage.getItem('seemanchal_has_session') === 'true' ||
          Boolean(localStorage.getItem('seemanchal_refresh_token')));

      if (!hasStoredSession) {
        dispatch(setAuthLoading(false));
        return;
      }

      try {
        const storedRefreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('seemanchal_refresh_token')
            : null;

        // Attempt silent refresh with cookie + body fallback for cross-domain stability
        const res = await api.post('/auth/refresh-token', {
          refreshToken: storedRefreshToken,
        });

        if (res.data.success && res.data.accessToken) {
          if (res.data.refreshToken && typeof window !== 'undefined') {
            localStorage.setItem('seemanchal_refresh_token', res.data.refreshToken);
          }
          dispatch(
            setCredentials({
              accessToken: res.data.accessToken,
              user: res.data.user,
            })
          );
        } else {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('seemanchal_has_session');
            localStorage.removeItem('seemanchal_refresh_token');
          }
          dispatch(setAuthLoading(false));
        }
      } catch (err) {
        // No active refresh session or expired
        if (typeof window !== 'undefined') {
          localStorage.removeItem('seemanchal_has_session');
          localStorage.removeItem('seemanchal_refresh_token');
        }
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

