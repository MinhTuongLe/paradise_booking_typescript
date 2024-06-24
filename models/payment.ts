export type Payment = {
  id: number;
  booking_id: number;
  created_at: string;
  amount: number;
  method_id: number;
  status_id: number;
};

export type PaymentStatusSelection = {
  id: number | null;
  name: string;
  color: string;
  background: string;
};
