import { PostGuiderType, Topic } from "@/enum";

export type BecomeVendorModalType = {
  user_id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  description: string;
  experience: string;
};

export type ForgotPasswordModalType = {
  email: string;
  secret_code: string;
  new_password: string;
  confirmPassword: string;
};

export type LoginModalType = {
  email: string;
  password: string;
  type?: number;
  full_name?: string;
  avatar?: string;
};

export type WishlistModalType = {
  title: string;
};

export type GeneralModalType = {
  isOpen: boolean;
  listingId?: number | string;
  onOpen: (param?: any) => void;
  onClose: () => void;
};

export type AddPostReviewModalType = {
  account_id?: number;
  title: string;
  topic: Topic;
  content: string;
  image: string;
  video: string;
  lat?: number;
  lng?: number;
};

export type UpdatePostReviewModalType = {
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

export type BecomeGuiderModalType = {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  experience: string;
  languages: string[];
  goals_of_travel: string[];
  description: string;
  reason: string;
  user_id: number | undefined;
};
