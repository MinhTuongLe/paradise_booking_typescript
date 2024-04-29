import { Pagination } from "./api";
import { PostReview } from "./post";
import { User } from "./user";

export type Place = {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  cover: string;
  address: string;
  district: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  max_guest: number;
  num_bed: number;
  bed_room: number;
  rating_average: number;
  is_free: boolean;
  number_of_guest?: number;
  user_id?: number;
  is_booked?: boolean;
  num_place_original?: number;
  num_place_booked?: number;
  num_place_remain?: number;
  booking_place_history?: any;
};

export type PlaceLocation = {
  address: string;
  district: string;
  state: string;
  country: string;
};

export type Amenity = {
  label: string;
  description: string;
  name?: string;
  id?: number;
};

export type DateRange = {
  startDate: Date | number;
  endDate: Date | number;
  key: string;
};

type DataRating = {
  rating: number;
  created_at: string;
  content: string;
};

export type Comment = {
  DataRating: DataRating;
  user: User;
};

export type Rating = {
  place: Place;
  user: User;
  DataRating: DataRating;
};

export type Reservation = {
  id: number;
  status_id: number;
  total_price: number;
  user: User;
  guest_name: string;
  content_to_vendor: string;
  checkin_date: string;
  checkout_date: string;
  created_at: string;
  place: Place;
};

export type Reservations = {
  data: { data: Reservation[] };
  paging: Pagination;
};

export type PlaceStatus = {
  id: number;
  name: string;
  icon?: any;
  color?: string;
};

export type ReservationSecData = {
  id: number;
  content_to_vendor: string;
  guest_name: string;
  place: {
    id: number;
    name: string;
    cover: string;
    address: string;
    city: string;
    country: string;
    district: string;
    state: string;
  };
  status_id: number;
  payment_method: number;
  created_at: string;
  checkin_date: string;
  checkout_date: string;
  total_price: number;
};

export type ReservationSec = {
  data: ReservationSecData;
  user_id: number;
  user: User;
};

export type PostReviews = {
  data: { data: PostReview[] };
  paging: Pagination;
};
