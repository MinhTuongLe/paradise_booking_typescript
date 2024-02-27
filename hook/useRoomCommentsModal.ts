import { create } from "zustand";

interface RoomCommentsModalState {
  isOpen: boolean;
  rating_average: number;
  onOpen: (rating_average: number) => void;
  onClose: () => void;
}

const useRoomCommentsModal = create<RoomCommentsModalState>((set) => ({
  isOpen: false,
  rating_average: 0,
  onOpen: (rating_average: number) =>
    set({ isOpen: true, rating_average: rating_average }),
  onClose: () => set({ isOpen: false }),
}));

export default useRoomCommentsModal;
