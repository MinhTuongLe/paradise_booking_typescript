import { create } from "zustand";

interface PostReviewModalState {
  isOpen: boolean;
  data: any;
  isEdit: boolean;
  onOpen: ({ data, isEdit }: { data: any; isEdit: boolean }) => void;
  onClose: () => void;
}

const usePostReviewModal = create<PostReviewModalState>((set) => ({
  isOpen: false,
  data: null,
  isEdit: false,
  onOpen: ({ data, isEdit }: { data: any; isEdit: boolean }) =>
    set({ isOpen: true, data, isEdit }),
  onClose: () => set({ isOpen: false }),
}));

export default usePostReviewModal;
