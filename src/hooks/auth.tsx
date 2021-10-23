import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSessions from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const CLIENT_ID = '8e7d9b0dd47737f2c97b';
const SCOPE = 'read:user';
const USER_STORAGE = '@doWhile:user';
const TOKEN_STORAGE = '@doWhile:token';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextData = {
  user: User | null;
  isSigning: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isSigning, setIsSigning] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  async function signIn(): Promise<void> {
    try {
      setIsSigning(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
      const authSessionResponse = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse;

      if (authSessionResponse.type === 'success' && authSessionResponse.params.error !== 'access_denied') {      
        if (authSessionResponse.params && authSessionResponse.params.code) {
          const authResponse = await api.post('authenticate', { code: authSessionResponse.params.code });
          const { user, token } = authResponse.data as AuthResponse;
  
          api.defaults.headers.common.authorization = `Bearer ${token}`;
          
          await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
          await AsyncStorage.setItem(TOKEN_STORAGE, token);
  
          setUser(user);       
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigning(false);
    }
  }

  async function signOut(): Promise<void> {
    await AsyncStorage.multiRemove([USER_STORAGE, TOKEN_STORAGE]);
    setUser(null);
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

      if (userStorage && tokenStorage) {
        const user = JSON.parse(userStorage);
        api.defaults.headers.common.authorization = `Bearer ${tokenStorage}`;
        setUser(user);
      }
      setIsSigning(false);
    }

    loadUserStorageData();
  }, [])

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      isSigning,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };