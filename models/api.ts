import {
  PaymentMethods,
  PostGuiderType,
  ReportStatus,
  ReportTypes,
  Topic,
} from "@/enum";
import { Payment } from "./payment";
import { Place, PlaceStatus, Reservation } from "./place";
import { User } from "./user";
import { BookingGuider, PostGuider } from "./post";

export type Pagination = {
  page: number | string;
  limit: number | string;
  total?: number | string;
  status?: string;
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
  state?: string;
};

export type ReservationAPI = {
  page: number | string;
  limit: number | string;
  placeId: number | string;
};

export type PlaceWishlistAPI = {
  page: number | string;
  limit: number | string;
  wish_list_id?: number | string;
};

export type PlaceVendorAPI = {
  page: number | string;
  limit: number | string;
  total?: number | string | undefined;
  vendor_id: number | string | undefined;
  booking_id?: number;
};

export type AccountAPI = {
  accounts: User[] | any;
  paging: Pagination | any;
};

export type PlaceAPISec = {
  place: Place;
  vendor_id: string | number;
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
  name: string | undefined;
  description: string | undefined;
  price_per_night: number | undefined;
  address: string | undefined;
  lat: number | undefined;
  lng: number | undefined;
  max_guest: number | undefined;
  num_bed: number | undefined;
  bed_room: number | undefined;
};

export type FilterReservationDataSubmit = {
  date_from: string;
  date_to: string;
  statuses: PlaceStatus[] | PlaceStatus;
};

export type RatingDataSubmit = {
  rating: number;
  content: string;
  title: string;
};

export type ReportDataSubmit = {
  object_id: number;
  object_type: ReportTypes;
  type: string | number;
  description: string;
  status_id: ReportStatus;
  user_id: number;
  videos: string[];
  images: string[];
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

export type CreateReservationPlaceDataSubmit = {
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

export type CreateReservationUserDataSubmit = {
  full_name: string;
  phone: string;
  email: string;
  guest_name: string;
  content_to_vendor: string;
  number_of_guest: number;
};

export type PostReviewByTopicId = {
  topic_id: Topic;
  page: number | string;
  limit: number | string;
  date_from: string;
  date_to: string;
  lat: number | string;
  lng: number | string;
};

export type CreatePostGuiderDataSubmit = {
  title: string;
  cover: string;
  description: string;
  address: string;
  topic_id: PostGuiderType;
  schedule: string;
  post_owner_id: number | undefined;
};

export type PostGuiderByTopicId = {
  topic_id: Topic | null;
  page: number | string;
  limit: number | string;
  lat: number | string | null;
  lng: number | string | null;
  post_owner_id: number | string;
  state?: string;
};

export type CalendarGuiders = {
  page: number | string;
  limit: number | string;
  post_guide_id?: number | string;
  guider_id?: number | string;
  date_from: string | null;
  date_to: string | null;
};

export type CreateGuiderReservationDataSubmit = {
  calendar_guider_id: number;
  email: string;
  number_of_people: number;
  name: string;
  note: string;
  total_price: number;
  phone: string;
  payment_method: PaymentMethods;
  user_id?: number | null;
  post_guide_id: number;
  guider_id: number;
};

export type BookingGuiderApi = {
  page: number | string;
  limit: number | string;
  post_guide_id: number | string;
};

export type BookingGuidersApi = {
  reservations: BookingGuider[] | any;
  paging: Pagination | any;
};

export type PropertiesAPI = {
  places?: Place[] | any;
  post?: PostGuider[] | any;
  paging: Pagination | any;
};
