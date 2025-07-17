import React, { useState, createContext, useContext } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  login: (username: string, pass: string) => Promise<User | null>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const item = window.sessionStorage.getItem('user');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to parse user from sessionStorage', error);
      return null;
    }
  });

  const login = async (username: string, pass: string): Promise<User | null> => {
    try {
      console.log('Attempting login with username:', username, 'and password:', pass);
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: pass }),
      });

      const responseData = await response.json();
      console.log('Login API response status:', response.status, 'data:', responseData);

      if (!response.ok) {
        console.error('Login failed:', responseData);
        return null;
      }

      const { user: userData } = responseData;

      if (userData) {
        window.sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Failed to login:', error);
      return null;
    }
  };

  const logout = () => {
    try {
      window.sessionStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to remove user from sessionStorage', error);
    }
    setUser(null);
  };

  return React.createElement(UserContext.Provider, { value: { user, login, logout } }, children);
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};