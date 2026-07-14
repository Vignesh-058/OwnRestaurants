import { create } from 'zustand';

interface OutletModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useOutletModalStore = create<OutletModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
