import { create } from 'zustand';

interface NetworkState {
 isOnline: boolean;
 wasOffline: boolean; // to show "back online" toast
 setOnline: (online: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
 isOnline: navigator.onLine,
 wasOffline: false,

 setOnline: (online: boolean) => {
 const prev = get().isOnline;
 set({
 isOnline: online,
 wasOffline: !online ? true : get().wasOffline,
 });
 // Reset wasOffline after coming back online
 if (online && !prev) {
 setTimeout(() => set({ wasOffline: false }), 3000);
 }
 },
}));
