import { create } from "zustand";

const useForgotPasswordModel = create((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useForgotPasswordModel;
