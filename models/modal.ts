export type BecomeVendorModal = {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  job: string;
  dob: string;
  address: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordModal = {
  email: string;
  secret_code: string;
  new_password: string;
  confirmPassword: string;
};

export type LoginModal = {
  email: string;
  password: string;
};

export type WishlistModal = {
  title: string;
};

export type GeneralModal = {
  isOpen: boolean;
  listingId?: number | string;
  onOpen: (param?: any) => void;
  onClose: () => void;
};
