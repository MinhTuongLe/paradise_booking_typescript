export type Pagination = {
    page: number | string
    limit: number | string
}

export type PlaceAPI = {
    page: number | string
    limit: number | string
    guest?: string,
    price_from?: string,
    price_to?: string,
    lat?: string,
    lng?: string,
    date_from?: string,
    date_to?: string,
}

export type ReservationAPI = {
    page: number | string
    limit: number | string
    placeId: number
}

export type PlaceWishlistAPI = {
    page: number | string
    limit: number | string
    wish_list_id: number
}

export type PlaceVendorAPI = {
    page: number | string
    limit: number | string
    vendor_id: number,
    booking_id?: number,
}