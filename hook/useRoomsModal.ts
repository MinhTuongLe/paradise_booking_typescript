import { create } from "zustand";

interface RoomsModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useRoomsModal = create<RoomsModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useRoomsModal;
