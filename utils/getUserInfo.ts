import { User } from "@/models/user";

export const getUserName = (user: User) =>
  user?.full_name || user?.username || user?.email?.split("@")[0]!;
