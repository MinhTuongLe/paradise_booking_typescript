import { User } from "./user"

export type Place = {
    id: number,
    name: string,
    description: string,
    price_per_night: number
    cover: string
    address: string
    district: string
    state: string
    country: string
    lat: number
    lng: number
    max_guest: number
    num_bed: number
    bed_room: number
    rating_average: number
    is_free: boolean
}

export type Amenity = {
    label: string
    description: string
}

export type DateRange = {
    startDate: Date | string
    endDate: Date | string
    key: string
}

type DataRating = {
    rating: number
    created_at: string
    content: string
}

export type Comment = {
    DataRating: DataRating
    user: User
}

export type Rating = {
    place: Place
    user: User
    DataRating: DataRating
}