import { create } from "zustand";

interface BecomeVendorModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useBecomeVendorModal = create<BecomeVendorModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useBecomeVendorModal;
