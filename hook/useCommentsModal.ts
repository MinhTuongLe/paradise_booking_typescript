import { create } from "zustand";

interface CommentsModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCommentsModal = create<CommentsModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCommentsModal;
