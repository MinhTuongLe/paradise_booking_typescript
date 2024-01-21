import { ReactNode } from "react"
import { Place } from "./place"

export type Booking = {
    id: number
    place: Place
    status_id: number
    totalPrice: number
}

export type BookingStatus = {
    id: number
    name: string
    icon: ReactNode | undefined | any
    color: string
}