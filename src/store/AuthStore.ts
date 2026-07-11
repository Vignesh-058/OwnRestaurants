import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer } from '@/types/customer.types';
import { TokenManager } from '@/utils/TokenManager';

interface AuthState {
 isAuthenticated: boolean;
 user: Customer | null;
 setAuth: (isAuthenticated: boolean, user: Customer, token: string) => void;
 logout: () => void;
}

export const useAuthStore = create<AuthState>()(
 persist(
 (set) => ({
 isAuthenticated: TokenManager.isAuthenticated(),
 user: null,
 setAuth: (isAuthenticated, user, token) => {
 console.log("[AUTH STORE] setAuth triggered:", { isAuthenticated, user, token });
 TokenManager.setToken(token);
 console.log("[AUTH STORE] Token stored in TokenManager:", TokenManager.getToken());
 set({ isAuthenticated, user });
 console.log("[AUTH STORE] Zustand state updated.");
 },
 logout: () => {
 console.log("[AUTH STORE] Logout triggered.");
 TokenManager.removeToken();
 set({ isAuthenticated: false, user: null });
 // Force a hard reload to clear any cached data (React Query, other Zustand stores, etc.)
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
