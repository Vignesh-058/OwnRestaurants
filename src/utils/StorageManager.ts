export const StorageManager = {
 get: <T>(key: string): T | null => {
 try {
 const item = localStorage.getItem(key);
 return item ? JSON.parse(item) : null;
 } catch {
 return null;
 }
 },
 set: (key: string, value: unknown): void => {
 try {
 localStorage.setItem(key, JSON.stringify(value));
 } catch (e) {
 console.error('Error saving to localStorage', e);
 }
 },
 remove: (key: string): void => {
 localStorage.removeItem(key);
 },
 clear: (): void => {
 localStorage.clear();
 },
};
