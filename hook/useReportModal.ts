import { ReportTypes } from "@/enum";
import { create } from "zustand";

interface ReportModalState {
  isOpen: boolean;
  object: {};
  user: {};
  type: ReportTypes;
  onClose: () => void;
  // onOpen: ({ place, user }: { place: string; user: string }) => void;
  onOpen: ({ type }: { type: ReportTypes }) => void;
  // onClose: () => void;
}

const useReportModal = create<ReportModalState>((set) => ({
  isOpen: false,
  onOpen: ({ type }: { type: ReportTypes }) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false }),
  object: {},
  user: {},
  type: ReportTypes.Place,
  // onOpen: ({ place, user }: { place: string; user: string }) =>
  //   set({ isOpen: true, place: place, user: user }),
  // onClose: () => set({ isOpen: false }),
}));

export default useReportModal;
