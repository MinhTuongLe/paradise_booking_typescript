import { roles } from "@/const";
import { Role } from "@/enum";
import { User } from "@/models/user";

export const getUserName = (user: User) =>
  user?.full_name || user?.username || user?.email?.split("@")[0]!;

export const getRoleId = (role: Role) => roles[role - 1].id;
export const getRoleName = (role: Role) => roles[role - 1].name;
