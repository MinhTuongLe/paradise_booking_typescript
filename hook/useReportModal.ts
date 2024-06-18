import { ReportTypes } from "@/enum";
import { create } from "zustand";

interface ReportModalState {
  isOpen: boolean;
  type: ReportTypes;
  object_id: number;
  onOpen: ({
    type,
    object_id,
  }: {
    type: ReportTypes;
    object_id: number;
  }) => void;
  onClose: () => void;
}

const useReportModal = create<ReportModalState>((set) => ({
  isOpen: false,
  object_id: 0,
  onOpen: ({ type, object_id }: { type: ReportTypes; object_id: number }) =>
    set({ isOpen: true, type: type, object_id: object_id }),
  onClose: () => set({ isOpen: false }),
  type: ReportTypes.Place,
}));

export default useReportModal;
