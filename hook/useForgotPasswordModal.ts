import { create } from "zustand";

interface ForgotPasswordModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useForgotPasswordModel = create<ForgotPasswordModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useForgotPasswordModel;
