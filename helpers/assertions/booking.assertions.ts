import { APIResponse, expect } from "@playwright/test"
import { Booking, FieldOrder } from "../fixtures/booking.data"

const isoDate = /^\d{4}-\d{2}-\d{2}$/

/**
 * Use this method to assert every field of a booking returned by the API:
 * field position (order), type, format and value.
 * @param actual - booking object from a response body
 * @param expected - booking that was sent
 */
export function expectBookingFields(actual: Record<string, any>, expected: Booking) {
    const expectedOrder = expected.additionalneeds === undefined
        ? FieldOrder.bookingWithoutAdditionalNeeds
        : FieldOrder.booking
    expect(Object.keys(actual), "booking field order").toEqual(expectedOrder)
    expect(Object.keys(actual.bookingdates), "bookingdates field order").toEqual(FieldOrder.bookingDates)

    expect(typeof actual.firstname, "firstname type").toBe("string")
    expect(typeof actual.lastname, "lastname type").toBe("string")
    expect(Number.isInteger(actual.totalprice), "totalprice is a whole number").toBe(true)
    expect(typeof actual.depositpaid, "depositpaid type").toBe("boolean")
    expect(actual.bookingdates.checkin, "checkin format").toMatch(isoDate)
    expect(actual.bookingdates.checkout, "checkout format").toMatch(isoDate)

    expect(actual.firstname, "firstname").toBe(expected.firstname)
    expect(actual.lastname, "lastname").toBe(expected.lastname)
    expect(actual.totalprice, "totalprice").toBe(expected.totalprice)
    expect(actual.depositpaid, "depositpaid").toBe(expected.depositpaid)
    expect(actual.bookingdates.checkin, "checkin").toBe(expected.bookingdates.checkin)
    expect(actual.bookingdates.checkout, "checkout").toBe(expected.bookingdates.checkout)
    if (expected.additionalneeds === undefined) {
        expect(actual, "additionalneeds is omitted when not sent").not.toHaveProperty("additionalneeds")
    } else {
        expect(actual.additionalneeds, "additionalneeds").toBe(expected.additionalneeds)
    }
}

export function expectJsonResponse(response: APIResponse, status: number) {
    expect(response.status(), `status of ${response.url()}`).toBe(status)
    expect(response.headers()["content-type"], "content-type").toContain("application/json")
}

export async function expectTextResponse(response: APIResponse, status: number, message: string) {
    expect(response.status(), `status of ${response.url()}`).toBe(status)
    expect(response.headers()["content-type"], "content-type").toContain("text/plain")
    expect(await response.text(), "response body").toBe(message)
}
