"use client";
import { useEffect } from 'react';
import { useInitializeAuth } from '../store/authStore';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const initializeAuth = useInitializeAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};