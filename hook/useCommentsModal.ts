import { create } from "zustand";
import { Role } from "@/enum";

interface CommentsModalState {
  isOpen: boolean;
  userRole: Role;
  onOpen: (userRole: Role) => void;
  onClose: () => void;
}

const useCommentsModal = create<CommentsModalState>((set) => ({
  isOpen: false,
  userRole: Role.Vendor,
  onOpen: (userRole: Role) => set({ isOpen: true, userRole }),
  onClose: () => set({ isOpen: false }),
}));

export default useCommentsModal;
