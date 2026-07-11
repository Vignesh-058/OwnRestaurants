import { create } from 'zustand';

interface LocationModalState {
 isOpen: boolean;
 openModal: () => void;
 closeModal: () => void;
}

export const useLocationModalStore = create<LocationModalState>((set) => ({
 isOpen: false,
 openModal: () => set({ isOpen: true }),
 closeModal: () => set({ isOpen: false }),
}));
