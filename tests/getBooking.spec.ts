import { BookingTests as test, expect } from "../helpers/fixtures/bookingTests"
import { buildBooking, NonExistentBookingId } from "../helpers/fixtures/booking.data"
import { Status } from "../helpers/fixtures/statusCodes.data"
import { expectBookingFields, expectJsonResponse, expectTextResponse } from "../helpers/assertions/booking.assertions"


test.describe("c. GetBooking - GET /booking/:id", () => {

    test.describe("Positive tests", () => {
        test(`Validate an existing booking is returned with every field @smoke @get`, async ({ bookingService }) => {
            const created = await bookingService.createBooking(buildBooking())

            const response = await bookingService.getBookingResponse(created.bookingid)

            expectJsonResponse(response, Status.ok)
            const body = await response.json()
            expect(body, "GetBooking does not return the id").not.toHaveProperty("bookingid")
            expectBookingFields(body, created.booking)
        })
    })

    test.describe("Negative tests", () => {
        test(`Validate a booking id that does not exist returns Not Found @negative @get`, async ({ bookingService }) => {
            const response = await bookingService.getBookingResponse(NonExistentBookingId)

            await expectTextResponse(response, Status.notFound, "Not Found")
        })
    })
})
