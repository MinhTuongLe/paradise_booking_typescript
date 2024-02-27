import { create } from "zustand";

interface WishlistModalState {
  isOpen: boolean;
  listingId: number | string | null;
  onOpen: (id: number | string | undefined) => void;
  onClose: () => void;
}

const useWishlistModal = create<WishlistModalState>((set) => ({
  isOpen: false,
  listingId: null,
  onOpen: (id: number | string | undefined) =>
    set({ isOpen: true, listingId: id }),
  onClose: () => set({ isOpen: false, listingId: null }),
}));

export default useWishlistModal;
