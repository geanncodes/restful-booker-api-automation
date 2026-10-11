import { APIRequestContext, APIResponse, TestInfo } from "@playwright/test"

/** How a request proves it is allowed to change a booking */
export type Authorization =
    | { type: "token", token: string }
    | { type: "basic", username: string, password: string }
    | { type: "none" }

export class BaseService {
    request: APIRequestContext
    worker: TestInfo

    constructor(request: APIRequestContext, worker: TestInfo) {
        this.request = request
        this.worker = worker
    }

    /**
     * Use this method to turn an Authorization into request headers.
     * The API accepts either a token cookie or a Basic authorization header.
     */
    authHeaders(auth: Authorization): Record<string, string> {
        switch (auth.type) {
            case "token":
                return { Cookie: `token=${auth.token}` }
            case "basic":
                return { Authorization: `Basic ${Buffer.from(`${auth.username}:${auth.password}`).toString("base64")}` }
            case "none":
                return {}
        }
    }

    /**
     * Attaches the request and response to the HTML report,
     * so a failure can be investigated without re-running the test
     */
    async attachExchange(name: string, request: unknown, response: APIResponse) {
        const body = await response.text()
        await this.worker.attach(name, {
            contentType: "application/json",
            body: JSON.stringify({
                request,
                response: { status: response.status(), headers: response.headers(), body },
            }, null, 2),
        })
    }
}
