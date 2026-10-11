import { APIRequestContext, APIResponse, TestInfo, expect } from "@playwright/test"
import { Authorization, BaseService } from "./baseService.model"
import { Booking, CreatedBooking } from "../fixtures/booking.data"
import { Status } from "../fixtures/statusCodes.data"

export class BookingService extends BaseService {
    /** Bookings created through this service, deleted after the test */
    createdIds: number[] = []

    constructor(request: APIRequestContext, worker: TestInfo) {
        super(request, worker)
    }

    /**
     * POST /booking
     * @param data - booking object, or any value for negative tests
     * @param headers - e.g. a different Accept header
     */
    async createBookingResponse(data: unknown, headers: Record<string, string> = {}): Promise<APIResponse> {
        const response = await this.request.post("/booking", { data, headers })
        await this.attachExchange("POST /booking", data, response)

        if (response.ok() && response.headers()["content-type"]?.includes("json")) {
            const body = await response.json()
            if (typeof body.bookingid === "number") {
                this.createdIds.push(body.bookingid)
            }
        }
        return response
    }

    /**
     * POST /booking with a raw body, for malformed JSON tests
     */
    async createBookingRawResponse(rawBody: string): Promise<APIResponse> {
        const response = await this.request.post("/booking", {
            data: Buffer.from(rawBody),
            headers: { "Content-Type": "application/json" },
        })
        await this.attachExchange("POST /booking (raw)", rawBody, response)
        return response
    }

    /** Use this method to create a booking a test needs as a precondition */
    async createBooking(booking: Booking): Promise<CreatedBooking> {
        const response = await this.createBookingResponse(booking)
        expect(response, "POST /booking").toBeOK()
        return response.json()
    }

    /** GET /booking/:id */
    async getBookingResponse(id: number | string, headers: Record<string, string> = {}): Promise<APIResponse> {
        const response = await this.request.get(`/booking/${id}`, { headers })
        await this.attachExchange(`GET /booking/${id}`, null, response)
        return response
    }

    /** PUT /booking/:id */
    async updateBookingResponse(id: number | string, data: unknown, auth: Authorization): Promise<APIResponse> {
        const response = await this.request.put(`/booking/${id}`, { data, headers: this.authHeaders(auth) })
        await this.attachExchange(`PUT /booking/${id}`, { auth: auth.type, data }, response)
        return response
    }

    /** PUT /booking/:id with a raw body, for malformed JSON tests */
    async updateBookingRawResponse(id: number | string, rawBody: string, auth: Authorization): Promise<APIResponse> {
        const response = await this.request.put(`/booking/${id}`, {
            data: Buffer.from(rawBody),
            headers: { "Content-Type": "application/json", ...this.authHeaders(auth) },
        })
        await this.attachExchange(`PUT /booking/${id} (raw)`, { auth: auth.type, rawBody }, response)
        return response
    }

    /** DELETE /booking/:id */
    async deleteBookingResponse(id: number | string, auth: Authorization): Promise<APIResponse> {
        const response = await this.request.delete(`/booking/${id}`, { headers: this.authHeaders(auth) })
        await this.attachExchange(`DELETE /booking/${id}`, { auth: auth.type }, response)
        return response
    }

    /**
     * Deletes every booking this service created.*/
    async cleanUp(auth: Authorization) {
        for (const id of this.createdIds) {
            const response = await this.request.delete(`/booking/${id}`, { headers: this.authHeaders(auth) })
            expect([Status.created, Status.methodNotAllowed], `clean up booking ${id}`).toContain(response.status())
        }
        this.createdIds = []
    }
}
