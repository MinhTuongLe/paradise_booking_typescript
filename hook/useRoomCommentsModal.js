import { create } from "zustand";

const useRoomCommentsModal = create((set) => ({
  isOpen: false,
  rating_average: 0,
  onOpen: (rating_average) =>
    set({ isOpen: true, rating_average: rating_average }),
  onClose: () => set({ isOpen: false }),
}));

export default useRoomCommentsModal;
