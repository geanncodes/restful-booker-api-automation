import { BookingTests as test, expect } from "../helpers/fixtures/bookingTests"
import { buildBooking, buildUpdatedBooking, CreatedBooking, withoutField } from "../helpers/fixtures/booking.data"
import { Status } from "../helpers/fixtures/statusCodes.data"
import { BookingService } from "../helpers/services/bookingService.model"
import { expectBookingFields, expectJsonResponse, expectTextResponse } from "../helpers/assertions/booking.assertions"


test.describe("b. UpdateBooking - PUT /booking/:id", () => {
    let created: CreatedBooking

    test.beforeEach(async ({ bookingService }) => {
        created = await bookingService.createBooking(buildBooking())
    })

    test.describe("Positive tests", () => {
        test(`Validate a booking is updated with a valid token @smoke @update`, async ({ bookingService, tokenAuth }) => {
            const updated = buildUpdatedBooking()

            const response = await bookingService.updateBookingResponse(created.bookingid, updated, tokenAuth)

            expectJsonResponse(response, Status.ok)
            const body = await response.json()
            expect(body, "UpdateBooking does not return the id").not.toHaveProperty("bookingid")
            expectBookingFields(body, updated)
        })

        test(`Validate the update is saved and returned by GetBooking @smoke @update`, async ({ bookingService, tokenAuth }) => {
            const updated = buildUpdatedBooking()

            await bookingService.updateBookingResponse(created.bookingid, updated, tokenAuth)
            const response = await bookingService.getBookingResponse(created.bookingid)

            expectJsonResponse(response, Status.ok)
            expectBookingFields(await response.json(), updated)
        })
    })

    test.describe("Negative tests", () => {
        test(`Validate an update without authorization is forbidden @negative @update`, async ({ bookingService }) => {
            const response = await bookingService.updateBookingResponse(created.bookingid, buildUpdatedBooking(), { type: "none" })

            await expectTextResponse(response, Status.forbidden, "Forbidden")
            await expectBookingUnchanged(bookingService)
        })

        test(`Validate an update with a missing required field is rejected @negative @update`, async ({ bookingService, tokenAuth }) => {
            const response = await bookingService.updateBookingResponse(created.bookingid, withoutField(buildUpdatedBooking(), "firstname"), tokenAuth)

            await expectTextResponse(response, Status.badRequest, "Bad Request")
            await expectBookingUnchanged(bookingService)
        })
    })

    /** A rejected update must not change the stored booking */
    async function expectBookingUnchanged(bookingService: BookingService) {
        const response = await bookingService.getBookingResponse(created.bookingid)
        expectBookingFields(await response.json(), created.booking)
    }
})
