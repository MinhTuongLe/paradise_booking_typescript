import { account_status } from "@/const";
import { AccountActive } from "@/enum";

export const getAccountActive = (value: AccountActive) =>
  account_status.filter((status) => status.id === value)[0].name;
