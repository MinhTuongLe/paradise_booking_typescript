import { create } from "zustand";

const useReportModal = create((set) => ({
  isOpen: false,
  // onOpen: () => set({ isOpen: true }),
  // onClose: () => set({ isOpen: false }),
  place: {},
  user: {},
  onOpen: ({ place, user }: { place: string; user: string }) =>
    set({ isOpen: true, place: place, user: user }),
  onClose: () => set({ isOpen: false }),
}));

export default useReportModal;
