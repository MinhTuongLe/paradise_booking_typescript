import { ReportStatus } from "@/enum";
import { User } from "./user";

export type Report = {
  id: number;
  object_id: number;
  object_type: number;
  object_name: string;
  type: string;
  description: string;
  status_id: ReportStatus;
  status_name: string;
  videos: string[];
  images: string[];
  user_id: number;
  user: User;
  user_reported: User;
  object_value: any;
};
