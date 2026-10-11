import { Locator, Page, TestInfo, expect } from "@playwright/test"

export type Box = { x: number, y: number, width: number, height: number }

export class BasePage {
    page: Page
    worker: TestInfo

    constructor(page: Page, worker: TestInfo) {
        this.page = page
        this.worker = worker
    }

    /**
     * Use this method to navigate to a page
     * @param uri - path relative to baseURL
     */
    async navigateToPage(uri: string) {
        await this.page.goto(uri, { waitUntil: "load" })
    }

    /**
     * Use this method to get the position and size of an element.
     * Fails with a clear message instead of returning null when it is not rendered.
     */
    async boxOf(locator: Locator): Promise<Box> {
        await expect(locator).toBeVisible()
        const box = await locator.boundingBox()
        expect(box, `bounding box of ${locator}`).not.toBeNull()
        return box!
    }
}
