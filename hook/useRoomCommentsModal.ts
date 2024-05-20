import { Role } from "@/enum";
import { create } from "zustand";

interface RoomCommentsModalState {
  isOpen: boolean;
  rating_average: number;
  userRole: Role;
  onOpen: (rating_average: number, userRole: Role) => void;
  onClose: () => void;
}

const useRoomCommentsModal = create<RoomCommentsModalState>((set) => ({
  isOpen: false,
  rating_average: 0,
  userRole: Role.Vendor,
  onOpen: (rating_average: number, userRole: Role) =>
    set({ isOpen: true, rating_average: rating_average, userRole }),
  onClose: () => set({ isOpen: false }),
}));

export default useRoomCommentsModal;
