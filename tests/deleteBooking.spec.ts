import { BookingTests as test, expect } from "../helpers/fixtures/bookingTests"
import { buildBooking, CreatedBooking, NonExistentBookingId } from "../helpers/fixtures/booking.data"
import { Status } from "../helpers/fixtures/statusCodes.data"
import { BookingService } from "../helpers/services/bookingService.model"
import { expectBookingFields, expectTextResponse } from "../helpers/assertions/booking.assertions"


test.describe("d. DeleteBooking - DELETE /booking/:id", () => {
    let created: CreatedBooking

    test.beforeEach(async ({ bookingService }) => {
        created = await bookingService.createBooking(buildBooking())
    })

    test.describe("Positive tests", () => {
        test(`Validate a booking is deleted with a valid token @smoke @delete`, async ({ bookingService, tokenAuth }) => {
            const response = await bookingService.deleteBookingResponse(created.bookingid, tokenAuth)

            await expectTextResponse(response, Status.created, "Created")
        })

        test(`Validate a deleted booking can no longer be retrieved @smoke @delete`, async ({ bookingService, tokenAuth }) => {
            await bookingService.deleteBookingResponse(created.bookingid, tokenAuth)

            const response = await bookingService.getBookingResponse(created.bookingid)

            await expectTextResponse(response, Status.notFound, "Not Found")
        })
    })

    test.describe("Negative tests", () => {
        test(`Validate a delete without authorization is forbidden @negative @delete`, async ({ bookingService }) => {
            const response = await bookingService.deleteBookingResponse(created.bookingid, { type: "none" })

            await expectTextResponse(response, Status.forbidden, "Forbidden")
            await expectBookingStillExists(bookingService)
        })

        test(`Validate deleting a booking id that does not exist is rejected @negative @delete`, async ({ bookingService, tokenAuth }) => {
            const response = await bookingService.deleteBookingResponse(NonExistentBookingId, tokenAuth)

            await expectTextResponse(response, Status.methodNotAllowed, "Method Not Allowed")
        })
    })

    /** A rejected delete must leave the booking unchanged */
    async function expectBookingStillExists(bookingService: BookingService) {
        const response = await bookingService.getBookingResponse(created.bookingid)
        expect(response.status(), "booking still exists").toBe(Status.ok)
        expectBookingFields(await response.json(), created.booking)
    }
})
