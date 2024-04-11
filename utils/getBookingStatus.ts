import { booking_status } from "@/const";
import { BookingStatus } from "@/enum";

export const getBookingStatusValue = (value: BookingStatus) =>
  booking_status.filter((status) => status.id === value)[0].id;
