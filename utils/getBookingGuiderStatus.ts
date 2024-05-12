import { booking_guider_status } from "@/const";
import { BookingGuiderStatus } from "@/enum";

export const getBookingGuiderStatus = (value: BookingGuiderStatus) =>
  booking_guider_status.filter((status) => status.id === value)[0].id;
