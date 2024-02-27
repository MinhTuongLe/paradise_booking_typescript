import { create } from "zustand";

interface SearchModalState {
  isOpen: boolean;
  option: number;
  onOpen: (option: number) => void;
  onClose: () => void;
}

const useSearchModal = create<SearchModalState>((set) => ({
  isOpen: false,
  option: 1,
  onOpen: (option: number) => set({ isOpen: true, option: option }),
  onClose: () => set({ isOpen: false }),
}));

export default useSearchModal;
