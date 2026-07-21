import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer } from '@/types/customer.types';
import { TokenManager } from '@/utils/TokenManager';

interface AuthState {
 isAuthenticated: boolean;
 isGuest: boolean;
 user: Customer | null;
 setAuth: (isAuthenticated: boolean, user: Customer, token: string) => void;
 updateUser: (user: Partial<Customer>) => void;
 logout: () => void;
}

export const useAuthStore = create<AuthState>()(
 persist(
 (set) => ({
 isAuthenticated: TokenManager.isAuthenticated(),
 isGuest: !TokenManager.isAuthenticated(),
 user: null,
 setAuth: (isAuthenticated, user, token) => {

 TokenManager.setToken(token);

 set({ isAuthenticated, isGuest: !isAuthenticated, user });

 },
 updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
 logout: () => {
  TokenManager.removeToken();
  set({ isAuthenticated: false, isGuest: true, user: null });
  
  // Clear all persisted stores related to user session
  const keysToRemove = [
  'auth-storage',
  'cart-storage',
  'location-storage',
  'search-storage',
  'coupon-storage',
  'outlet-storage'
  ];
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  sessionStorage.clear();
  
  // Hard redirect to home page to clear React Query cache and memory and enforce public view
  window.location.href = '/';
  },
 }),
 {
 name: 'auth-storage',
 // We only persist the user object, TokenManager handles the token
 partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
 }
 )
);
