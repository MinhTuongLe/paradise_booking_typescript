import { ReportTypes } from "@/enum";
import { create } from "zustand";

interface ReportModalState {
  isOpen: boolean;
  type: ReportTypes;
  onOpen: ({ type }: { type: ReportTypes }) => void;
  onClose: () => void;
}

const useReportModal = create<ReportModalState>((set) => ({
  isOpen: false,
  onOpen: ({ type }: { type: ReportTypes }) => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false }),
  type: ReportTypes.Place,
}));

export default useReportModal;
