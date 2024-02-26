import { Payment } from "./payment";
import { Place, PlaceStatus, Reservation } from "./place";
import { User } from "./user";

export type Pagination = {
  page: number | string;
  limit: number | string;
  total?: number | string;
};

export type PlaceAPI = {
  page: number | string;
  limit: number | string;
  guest?: string;
  price_from?: string;
  price_to?: string;
  lat?: string;
  lng?: string;
  date_from?: string;
  date_to?: string;
};

export type ReservationAPI = {
  page: number | string;
  limit: number | string;
  placeId: number;
};

export type PlaceWishlistAPI = {
  page: number | string;
  limit: number | string;
  wish_list_id: number;
};

export type PlaceVendorAPI = {
  page: number | string;
  limit: number | string;
  vendor_id: number;
  booking_id?: number;
};

export type AccountAPI = {
  accounts: User[] | any;
  paging: Pagination | any;
};

export type ChangePasswordDataSubmit = {
  new_password: string;
  confirmed_password: string;
};

export type FavoriteAPI = {
  places: Place[] | any;
  paging: Pagination | any;
};

export type PaymentAPI = {
  payments: Payment[] | any;
  paging: Pagination | any;
};

export type ReservationsAPI = {
  reservations: Reservation[] | any;
  paging: Pagination | any;
};

export type UserClientDataSubmit = {
  full_name: string;
  username: string;
  email: string;
  address: string;
  role?: number;
  phone: string;
  dob: string;
  bio: string;
  avatar: string;
};

export type PlaceDataSubmit = {
  cover: string | undefined;
  name: string;
  description: string;
  price_per_night: number;
  address: string;
  lat: number;
  lng: number;
  max_guest: number;
  num_bed: number;
  bed_room: number;
};

export type FilterReservationDataSubmit = {
  date_from: string;
  date_to: string;
  statuses: PlaceStatus[];
};

export type RatingDataSubmit = {
  rating: number;
  content: string;
  title: string;
};

export type ReportDataSubmit = {
  type: number;
  description: string;
};

export type RentPlaceDataSubmit = {
  name: string;
  max_guest: number;
  num_bed: number;
  bed_room: number;
  cover: string;
  price_per_night: number;
  description: string;
  address: string;
  num_place_original: number;
};

export type RegisterDataSubmit = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type PropertiesFilterDataSubmit = {
  place_id: string | number;
  date_from: string;
  date_to: string;
};

export type CreateReservationDataSubmit = {
  place_id: number;
  checkin_date: string;
  checkout_date: string;
  payment_method: number;
  booking_info: {
    type: number;
    total_price: number;
    number_of_guest: number;
  };
  user_id?: number;
};
