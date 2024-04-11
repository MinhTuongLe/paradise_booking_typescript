import { payment_methods } from "@/const";
import { PaymentMethods } from "@/enum";

export const getPaymentMethodName = (value: PaymentMethods) =>
  payment_methods.filter((method) => method.id === value)[0].name;
