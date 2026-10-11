import { PlaywrightTestConfig, devices } from "@playwright/test"

const config: PlaywrightTestConfig = {
    testDir: "./tests",
    timeout: 60 * 1000,

    // Every test creates and cleans up its own booking, so tests can run in parallel.
    // Kept low because the API is a shared, free Heroku app.
    workers: 2,
    fullyParallel: true,
    retries: process.env.CI ? 2 : 1,
    forbidOnly: !!process.env.CI,

    expect: {
        timeout: 15000
    },

    reporter: [
        ["list"],
        ["html", { open: "never" }],
    ],

    use: {
        baseURL: "https://restful-booker.herokuapp.com",
        extraHTTPHeaders: {
            Accept: "application/json",
        },
        trace: "retain-on-failure",
    },

    projects: [
        // API tests need no browser
        { name: "api", testIgnore: /apiDoc\.spec\.ts/ },
        // Element position tests run against the API documentation page
        {
            name: "apidoc",
            testMatch: /apiDoc\.spec\.ts/,
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1440, height: 900 },
                headless: !process.env.HEADED,
                screenshot: "only-on-failure",
            },
        },
    ],
}

export default config
