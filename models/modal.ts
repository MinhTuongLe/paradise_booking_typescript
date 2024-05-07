import { PostGuiderType, Topic } from "@/enum";

export type BecomeVendorModal = {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  password: string;
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
  type?: number;
  full_name?: string;
  avatar?: string;
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

export type AddPostReviewModal = {
  account_id?: number;
  title: string;
  topic: Topic;
  content: string;
  image: string;
  videos: string;
  lat?: number;
  lng?: number;
};

export type UpdatePostReviewModal = {
  post_review_id: number;
  account_id?: number;
  title: string;
  topic: string;
  content: string;
  image: string;
  videos: string;
  lat?: number;
  lng?: number;
};

export type BecomeGuiderModal = {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  experience: string;
  languages: string[];
  types: string[];
  description: string;
  reason_become_guider: string;
};
