import { AccountActive, account_status } from "@/const";

export const getAccountActive = (value: AccountActive) =>
  account_status.filter((status) => status.id === value)[0].name;
