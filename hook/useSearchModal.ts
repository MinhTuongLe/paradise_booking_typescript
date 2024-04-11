import { SearchModalOptions } from "@/enum";
import { create } from "zustand";

interface SearchModalState {
  isOpen: boolean;
  option: SearchModalOptions;
  onOpen: (option: SearchModalOptions) => void;
  onClose: () => void;
}

const useSearchModal = create<SearchModalState>((set) => ({
  isOpen: false,
  option: 1,
  onOpen: (option: SearchModalOptions) => set({ isOpen: true, option: option }),
  onClose: () => set({ isOpen: false }),
}));

export default useSearchModal;
