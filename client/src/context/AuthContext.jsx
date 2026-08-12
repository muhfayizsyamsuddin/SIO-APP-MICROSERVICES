import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem('access_token'))
  );

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });

    localStorage.setItem('access_token', data.access_token);

    const profile = await apiRequest('/users/profile');

    setUser(profile);

    return profile;
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return;
    }

    const loadProfile = async () => {
      try {
        console.log('Restoring session...');
        const profile = await apiRequest('/users/profile');
        console.log('Profile restored:', profile);
        setUser(profile);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        localStorage.removeItem('access_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}