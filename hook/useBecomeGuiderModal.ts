import { create } from "zustand";

interface BecomeGuiderModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useBecomeGuiderModal = create<BecomeGuiderModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useBecomeGuiderModal;
