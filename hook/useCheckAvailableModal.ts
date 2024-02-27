import { create } from "zustand";

interface CheckAvailableModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCheckAvailableModal = create<CheckAvailableModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCheckAvailableModal;
