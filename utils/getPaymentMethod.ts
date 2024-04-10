import { PaymentMethods, payment_methods } from "@/const";

export const getPaymentMethodName = (value: PaymentMethods) =>
  payment_methods.filter((method) => method.id === value)[0].name;
