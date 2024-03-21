import { create } from "zustand";

interface AddNewPostGuiderModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAddNewPostGuiderModal = create<AddNewPostGuiderModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddNewPostGuiderModal;
