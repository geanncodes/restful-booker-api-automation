import { APIRequestContext, APIResponse, TestInfo, expect } from "@playwright/test"
import { BaseService } from "./baseService.model"

export class AuthService extends BaseService {

    constructor(request: APIRequestContext, worker: TestInfo) {
        super(request, worker)
    }

    /** POST /auth */
    async createTokenResponse(username: string, password: string): Promise<APIResponse> {
        const response = await this.request.post("/auth", { data: { username, password } })
        await this.attachExchange("POST /auth", { username }, response)
        return response
    }

    /** Use this method to get a token for UpdateBooking / DeleteBooking */
    async createToken(username: string, password: string): Promise<string> {
        const response = await this.createTokenResponse(username, password)
        expect(response, "POST /auth").toBeOK()

        const body = await response.json()
        expect(body.token, "token returned by POST /auth").toEqual(expect.any(String))
        return body.token
    }
}
