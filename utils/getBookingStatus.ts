import { booking_status, BookingStatus } from "@/const";

export const getBookingStatusValue = (value: BookingStatus) =>
  booking_status.filter((status) => status.id === value)[0].id;
