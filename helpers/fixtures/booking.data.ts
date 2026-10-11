export type BookingDates = {
    checkin: string
    checkout: string
}

export type Booking = {
    firstname: string
    lastname: string
    totalprice: number
    depositpaid: boolean
    bookingdates: BookingDates
    additionalneeds?: string
}

export type CreatedBooking = {
    bookingid: number
    booking: Booking
}

/** Credentials published in the API documentation */
export const Credentials = {
    username: "admin",
    password: "password123",
}

/**
 * Response field order as listed in the documentation's "Success 200" tables.
 * The API returns the fields in this exact order.
 */
export const FieldOrder = {
    createResponse: ["bookingid", "booking"],
    booking: ["firstname", "lastname", "totalprice", "depositpaid", "bookingdates", "additionalneeds"],
    bookingWithoutAdditionalNeeds: ["firstname", "lastname", "totalprice", "depositpaid", "bookingdates"],
    bookingDates: ["checkin", "checkout"],
}

export const NonExistentBookingId = 999999999

export function addDays(base: Date, days: number): Date {
    const date = new Date(base)
    date.setDate(date.getDate() + days)
    return date
}

/** 2026-10-27, the date format the API uses */
export function toIsoDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Use this method to build a valid booking.
 * @param overrides - fields to change from the defaults
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
    const suffix = Date.now().toString(36) + Math.floor(Math.random() * 1000)
    const checkin = addDays(new Date(), 21)

    return {
        firstname: `Gee${suffix}`,
        lastname: "Data",
        totalprice: 888,
        depositpaid: true,
        bookingdates: {
            checkin: toIsoDate(checkin),
            checkout: toIsoDate(addDays(checkin, 7)),
        },
        additionalneeds: "Breakfast",
        ...overrides,
    }
}

export function buildUpdatedBooking(): Booking {
    const checkin = addDays(new Date(), 60)

    return buildBooking({
        firstname: "Sally",
        lastname: "Smith",
        totalprice: 450,
        depositpaid: false,
        bookingdates: {
            checkin: toIsoDate(checkin),
            checkout: toIsoDate(addDays(checkin, 3)),
        },
        additionalneeds: "Late checkout",
    })
}

export function withoutField(booking: Booking, field: keyof Booking): Record<string, unknown> {
    const { [field]: _removed, ...rest } = booking
    return rest
}
