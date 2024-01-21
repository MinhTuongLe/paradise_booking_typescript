import { create } from "zustand";

const useBecomeVendorModal = create((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useBecomeVendorModal;
