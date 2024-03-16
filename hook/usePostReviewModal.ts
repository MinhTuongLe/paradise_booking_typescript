import { create } from "zustand";

interface PostReviewModalState {
  isOpen: boolean;
  data: any;
  onOpen: ({ data }: { data: any }) => void;
  onClose: () => void;
}

const usePostReviewModal = create<PostReviewModalState>((set) => ({
  isOpen: false,
  data: null,
  onOpen: ({ data }: { data: any }) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));

export default usePostReviewModal;
