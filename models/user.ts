import { BecomeGuiderStatus } from "@/enum";

export type User = {
  id: number;
  full_name: string;
  username: string;
  avatar: string;
  email: string;
  address: string;
  role: number;
  phone?: string;
  dob?: string;
  bio?: string;
  created: string;
};

export type Guider = {
  id: number;
  user_id: number;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  description: string;
  experience: string;
  reason: string;
  goals_of_travel: string[];
  languages: string[];
  status: BecomeGuiderStatus;
  user: User
};
