import { create } from "zustand";

const useCheckAvailableModal = create((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCheckAvailableModal;
