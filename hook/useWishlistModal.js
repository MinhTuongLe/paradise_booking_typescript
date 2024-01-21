import { create } from "zustand";

const useWishlistModal = create((set) => ({
  isOpen: false,
  listingId: null,
  onOpen: (id) => set({ isOpen: true, listingId: id }),
  onClose: () => set({ isOpen: false, listingId: null }),
}));

export default useWishlistModal;
