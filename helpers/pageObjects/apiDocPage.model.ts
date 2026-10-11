import { Locator, Page, TestInfo, expect } from "@playwright/test"
import { BasePage } from "./basePage.model"
import { Content, SideNav } from "../selectors/apiDocPage.selectors"

export class ApiDocPage extends BasePage {

    constructor(page: Page, worker: TestInfo) {
        super(page, worker)
    }

    get sideNav(): Locator { return this.page.locator(SideNav.container) }
    get filterInput(): Locator { return this.page.locator(SideNav.filterInput) }
    get content(): Locator { return this.page.locator(Content.container) }
    get bookingNavItems(): Locator { return this.page.locator(`#sidenav li[data-group="Booking"][data-name]`) }

    navGroupHeader(group: string): Locator { return this.page.locator(SideNav.groupHeader(group)) }
    navEndpoint(name: string, group = "Booking"): Locator { return this.page.locator(SideNav.endpoint(group, name)) }

    section(name: string, group = "Booking"): Locator { return this.page.locator(Content.endpointSection(group, name)) }
    sectionTitle(name: string): Locator { return this.section(name).locator(Content.title) }
    sectionMethodBadge(name: string): Locator { return this.section(name).locator(Content.methodBadge) }
    sectionUrl(name: string): Locator { return this.section(name).locator(Content.endpointUrl) }
    sectionSuccessFields(name: string): Locator { return this.section(name).locator(Content.successFieldNames) }

    /** Opens the documentation on the Booking group */
    async openBookingDocs() {
        await this.navigateToPage("/apidoc/index.html#api-Booking")
        // The page is rendered by JavaScript after load
        await expect(this.section("CreateBooking")).toBeAttached()
    }

    /** Use this method to click an endpoint in the side navigation */
    async openEndpoint(name: string) {
        await this.navEndpoint(name).locator("a").click()
        await expect(this.page).toHaveURL(new RegExp(`#api-Booking-${name}$`))
    }

    /** Field names listed in an endpoint's "Success 200" table, in order */
    async successFieldNames(name: string): Promise<string[]> {
        const names = await this.sectionSuccessFields(name).allInnerTexts()
        return names.map(text => text.trim())
    }
}
