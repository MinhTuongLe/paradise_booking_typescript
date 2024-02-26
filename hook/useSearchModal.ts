import { create } from "zustand";

const useSearchModal = create((set) => ({
  isOpen: false,
  option: 1,
  onOpen: (option: number) => set({ isOpen: true, option: option }),
  onClose: () => set({ isOpen: false }),
}));

export default useSearchModal;
