/**
 * Status codes returned by Restful Booker, as observed on the live API.
 * Some differ from common REST conventions, see "Known defects" in the README.
 */
export const Status = {
    ok: 200,
    /** DeleteBooking success (body "Created") */
    created: 201,
    /** Malformed JSON body, or UpdateBooking without a required field */
    badRequest: 400,
    /** UpdateBooking / DeleteBooking without valid authorization */
    forbidden: 403,
    notFound: 404,
    /** UpdateBooking / DeleteBooking for an id that does not exist */
    methodNotAllowed: 405,
    /** Unsupported Accept header */
    teapot: 418,
    /** CreateBooking without a required field */
    internalServerError: 500,
}
