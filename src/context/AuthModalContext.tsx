'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

interface AuthModalContextType {
  isOpen: boolean;
  mode: 'signIn' | 'signUp';
  openModal: (mode?: 'signIn' | 'signUp') => void;
  closeModal: () => void;
  setMode: (mode: 'signIn' | 'signUp') => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const { isSignedIn, isLoaded } = useUser();

  const openModal = useCallback((newMode: 'signIn' | 'signUp' = 'signIn') => {
    setMode(newMode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('corex_auth_prompt_dismissed', 'true');
    }
  }, []);

  // 16-second auto-prompt for signed-out visitors who remain on the website
  useEffect(() => {
    if (!isLoaded || isSignedIn) return;

    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('corex_auth_prompt_dismissed');
      if (dismissed === 'true') return;
    }

    const timer = setTimeout(() => {
      // Re-verify that user has not signed in during the 16 seconds
      if (!isSignedIn) {
        setIsOpen(true);
      }
    }, 16000);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  // When user successfully authenticates, automatically close the modal
  useEffect(() => {
    if (isSignedIn && isOpen) {
      setIsOpen(false);
    }
  }, [isSignedIn, isOpen]);

  return (
    <AuthModalContext.Provider value={{ isOpen, mode, openModal, closeModal, setMode }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
