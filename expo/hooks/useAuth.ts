import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      if (userData && token) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Mock login - replace with real API call
    const mockUser: User = {
      id: '1',
      fullName: 'John Doe',
      username: 'johndoe',
      email,
      subscription: 'free',
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    await AsyncStorage.setItem('token', 'mock-jwt-token');
    setUser(mockUser);
    return mockUser;
  };

  const signup = async (fullName: string, username: string, email: string, password: string) => {
    // Mock signup - replace with real API call
    const mockUser: User = {
      id: Date.now().toString(),
      fullName,
      username,
      email,
      subscription: 'free',
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    await AsyncStorage.setItem('token', 'mock-jwt-token');
    setUser(mockUser);
    return mockUser;
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    // Mock API call - replace with real PATCH request to /api/users/:id
    const updatedUser: User = {
      ...user,
      ...updatedData,
      updated_at: new Date().toISOString(),
    };

    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    signup,
    updateProfile,
    logout,
  };
}