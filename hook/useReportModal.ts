import { create } from "zustand";

interface ReportModalState {
  isOpen: boolean;
  place: {};
  user: {};
  onOpen: () => void;
  onClose: () => void;
  // onOpen: ({ place, user }: { place: string; user: string }) => void;
  // onClose: () => void;
}

const useReportModal = create<ReportModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  place: {},
  user: {},
  // onOpen: ({ place, user }: { place: string; user: string }) =>
  //   set({ isOpen: true, place: place, user: user }),
  // onClose: () => set({ isOpen: false }),
}));

export default useReportModal;
