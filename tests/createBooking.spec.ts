import { BookingTests as test, expect } from "../helpers/fixtures/bookingTests"
import { buildBooking, FieldOrder, withoutField } from "../helpers/fixtures/booking.data"
import { Status } from "../helpers/fixtures/statusCodes.data"
import { expectBookingFields, expectJsonResponse, expectTextResponse } from "../helpers/assertions/booking.assertions"


test.describe("a. CreateBooking - POST /booking", () => {

    test.describe("Positive tests", () => {
        test(`Validate a booking is created with every field @smoke @create`, async ({ bookingService }) => {
            const booking = buildBooking()

            const response = await bookingService.createBookingResponse(booking)

            expectJsonResponse(response, Status.ok)
            const body = await response.json()
            expect(Object.keys(body), "response field order").toEqual(FieldOrder.createResponse)
            expect(Number.isInteger(body.bookingid), "bookingid is a whole number").toBe(true)
            expect(body.bookingid, "bookingid").toBeGreaterThan(0)
            expectBookingFields(body.booking, booking)
        })

        test(`Validate the created booking is saved and returned by GetBooking @smoke @create`, async ({ bookingService }) => {
            const booking = buildBooking()

            const { bookingid } = await bookingService.createBooking(booking)
            const response = await bookingService.getBookingResponse(bookingid)

            expectJsonResponse(response, Status.ok)
            expectBookingFields(await response.json(), booking)
        })
    })

    test.describe("Negative tests", () => {
        test(`Validate a booking with a missing required field is rejected @negative @create`, async ({ bookingService }) => {
            const response = await bookingService.createBookingResponse(withoutField(buildBooking(), "firstname"))

            await expectTextResponse(response, Status.internalServerError, "Internal Server Error")
        })

        test(`Validate malformed JSON is rejected @negative @create`, async ({ bookingService }) => {
            const response = await bookingService.createBookingRawResponse(`{"firstname": "Gee",`)

            await expectTextResponse(response, Status.badRequest, "Bad Request")
        })
    })
})
