import { test as base } from "@playwright/test"
import { AuthService } from "../services/authService.model"
import { BookingService } from "../services/bookingService.model"
import { Authorization } from "../services/baseService.model"
import { ApiDocPage } from "../pageObjects/apiDocPage.model"
import { Credentials } from "./booking.data"

export type bookingTests = {
    authService: AuthService
    bookingService: BookingService
    tokenAuth: Authorization
    basicAuth: Authorization
    apiDocPage: ApiDocPage
}

export const BookingTests = base.extend<bookingTests>({
    authService: async ({ request }, use, worker) => {
        await use(new AuthService(request, worker))
    },
    basicAuth: async ({}, use) => {
        await use({ type: "basic", ...Credentials })
    },
    tokenAuth: async ({ authService }, use) => {
        const token = await authService.createToken(Credentials.username, Credentials.password)
        await use({ type: "token", token })
    },
    bookingService: async ({ request, basicAuth }, use, worker) => {
        const bookingService = new BookingService(request, worker)
        await use(bookingService)
        await bookingService.cleanUp(basicAuth)
    },
    apiDocPage: async ({ page }, use, worker) => {
        await use(new ApiDocPage(page, worker))
    },
})

export { expect } from "@playwright/test"
