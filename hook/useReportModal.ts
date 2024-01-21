import { create } from "zustand";

const useRentModal = create((set) => ({
  isOpen: false,
  // onOpen: () => set({ isOpen: true }),
  // onClose: () => set({ isOpen: false }),
  place: {},
  user: {},
  onOpen: ({ place, user }) => set({ isOpen: true, place: place, user: user }),
  onClose: () => set({ isOpen: false }),
}));

export default useRentModal;
