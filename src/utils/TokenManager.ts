import { StorageManager } from './StorageManager';

const TOKEN_KEY = 'owncart_auth_token';

export const TokenManager = {
 getToken: (): string | null => {
 return StorageManager.get<string>(TOKEN_KEY);
 },
 setToken: (token: string): void => {
 StorageManager.set(TOKEN_KEY, token);
 },
 removeToken: (): void => {
 StorageManager.remove(TOKEN_KEY);
 },
 isAuthenticated: (): boolean => {
 return !!TokenManager.getToken();
 }
};
