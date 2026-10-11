# Restful Booker API Automation
API automation tests for the [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html#api-Booking) Booking API through Playwright and TypeScript

## Requirements

|Requirement                                                   |Status              |Spec                                         |
|--------------------------------------------------------------|--------------------|---------------------------------------------|
|a. CreateBooking tests with response field assertions         | :white_check_mark: | `a. CreateBooking` in `tests/createBooking.spec.ts` |
|b. UpdateBooking tests with response field assertions         | :white_check_mark: | `b. UpdateBooking` in `tests/updateBooking.spec.ts` |
|c. GetBooking tests with response field assertions            | :white_check_mark: | `c. GetBooking` in `tests/getBooking.spec.ts` |
|d. DeleteBooking tests with response field assertions         | :white_check_mark: | `d. DeleteBooking` in `tests/deleteBooking.spec.ts` |
|Positive tests                                                | :white_check_mark: | `Positive tests` in every endpoint spec |
|Negative tests                                                | :white_check_mark: | `Negative tests` in every endpoint spec |
|API response field assertions                                 | :white_check_mark: | `helpers/assertions/booking.assertions.ts`, used by every spec |
|Location / position of web element assertions                 | :white_check_mark: | `e. API documentation` in `tests/apiDoc.spec.ts` |

## What "response field assertions" cover

Every booking returned by the API goes through `expectBookingFields()`, which checks each field for:

|Check     |Example                                                                   |
|----------|--------------------------------------------------------------------------|
|Position  |Fields come back in the documented order: `firstname, lastname, totalprice, depositpaid, bookingdates, additionalneeds`, and `checkin` before `checkout` |
|Type      |`totalprice` is a whole number, `depositpaid` is a boolean                |
|Format    |`checkin` / `checkout` are `YYYY-MM-DD`                                   |
|Value     |Every field equals what was sent                                          |
|Absence   |`additionalneeds` is omitted when it was not sent; GetBooking / UpdateBooking never return `bookingid` |

Status code and `content-type` are asserted on every response, and error bodies are asserted exactly (e.g. `Forbidden`).

## Test Coverage

### a. CreateBooking - `POST /booking`

|Test                                                     |Tags                 |
|---------------------------------------------------------|---------------------|
|A booking is created with every field                    |`@smoke @create`     |
|The created booking is saved and returned by GetBooking  |`@smoke @create`     |
|A booking with a missing required field is rejected (500)|`@negative @create`  |
|Malformed JSON is rejected (400)                         |`@negative @create`  |

### b. UpdateBooking - `PUT /booking/:id`

|Test                                                     |Tags                 |
|---------------------------------------------------------|---------------------|
|A booking is updated with a valid token                  |`@smoke @update`     |
|The update is saved and returned by GetBooking           |`@smoke @update`     |
|An update without authorization is forbidden (403)       |`@negative @update`  |
|An update with a missing required field is rejected (400)|`@negative @update`  |

Every rejected update also checks the stored booking is unchanged.

### c. GetBooking - `GET /booking/:id`

|Test                                                     |Tags                 |
|---------------------------------------------------------|---------------------|
|An existing booking is returned with every field         |`@smoke @get`        |
|A booking id that does not exist returns Not Found (404) |`@negative @get`     |

### d. DeleteBooking - `DELETE /booking/:id`

|Test                                                     |Tags                 |
|---------------------------------------------------------|---------------------|
|A booking is deleted with a valid token (201 "Created")  |`@smoke @delete`     |
|A deleted booking can no longer be retrieved             |`@smoke @delete`     |
|A delete without authorization is forbidden (403)        |`@negative @delete`  |
|Deleting a booking id that does not exist is rejected (405) |`@negative @delete` |

Every rejected delete also checks the booking still exists, unchanged.

### e. API documentation - element positions

|Test                                                     |Tags                 |
|---------------------------------------------------------|---------------------|
|The side navigation is to the left of the content        |`@smoke @apidoc`     |
|The Booking endpoints are listed in order under the Booking header |`@apidoc`  |
|Get / Create / Update / DeleteBooking section layout: title, then method, then URL |`@apidoc` |
|The endpoint sections are in the same order as the navigation |`@apidoc`       |
|The documented GetBooking response fields match the API's field order |`@apidoc` |
|The documented CreateBooking response starts with bookingid then booking |`@apidoc` |

## Known defects

Found while mapping the API's behaviour before writing the tests.

**Invalid data the API accepts.** Found during exploratory testing and kept out of the suite, which covers the documented contract only:

|Defect                                                   |Observed                                                |
|---------------------------------------------------------|--------------------------------------------------------|
|Non-numeric `totalprice` is accepted                     |200, `totalprice` stored as `null`                      |
|Invalid `checkin` date is accepted                       |200, `checkin` stored as `"0NaN-aN-aN"`                 |
|`checkout` before `checkin` is accepted                  |200                                                     |
|Decimal `totalprice` is truncated                        |`99.99` stored as `99`                                  |

**Unconventional status codes.** The negative tests assert the codes the API actually returns, so a change in either direction gets noticed:

|Case                                                     |Observed           |Usually expected   |
|---------------------------------------------------------|-------------------|-------------------|
|CreateBooking without a required field                   |500                |400                |
|DeleteBooking for an id that does not exist              |405                |404                |
|DeleteBooking success                                    |201 "Created"      |200 / 204          |

## Project Structure

```
├── helpers
│   ├── assertions
│   │   └── booking.assertions.ts         # Response field, JSON and plain-text response assertions
│   ├── fixtures
│   │   ├── bookingTests.ts               # Extends Playwright test with services, auth and apiDocPage
│   │   ├── booking.data.ts               # Booking types, builders, credentials, field order
│   │   └── statusCodes.data.ts           # Status codes observed on the API
│   ├── pageObjects
│   │   ├── basePage.model.ts             # Navigation, element bounding boxes
│   │   └── apiDocPage.model.ts           # Side navigation, endpoint sections
│   ├── selectors
│   │   └── apiDocPage.selectors.ts
│   └── services
│       ├── baseService.model.ts          # Authorization headers, request/response report attachments
│       ├── authService.model.ts          # POST /auth
│       └── bookingService.model.ts       # Booking endpoints, clean up of created bookings
├── tests
│   ├── createBooking.spec.ts
│   ├── updateBooking.spec.ts
│   ├── getBooking.spec.ts
│   ├── deleteBooking.spec.ts
│   └── apiDoc.spec.ts
└── playwright.config.ts
```

## Setup

```
npm install
npx playwright install chromium
```

Chromium is only needed for the `@apidoc` tests; the API tests use Playwright's request client.

## Running the tests

|Command                  |Description                       |
|-------------------------|----------------------------------|
|`npm test`               | Run all tests                    |
|`npm run test:smoke`     | Run `@smoke` tests only          |
|`npm run test:create`    | Run requirement a                |
|`npm run test:update`    | Run requirement b                |
|`npm run test:get`       | Run requirement c                |
|`npm run test:delete`    | Run requirement d                |
|`npm run test:negative`  | Run the negative tests only      |
|`npm run test:apidoc`    | Run the element position tests   |
|`npm run test:ui`        | Open Playwright UI mode          |
|`npm run report`         | Open the last HTML report        |
|`npm run build`          | Type check the project           |

## Notes

* **Independent tests.** Every test creates the booking it needs, and the `bookingService` fixture deletes every booking it created once the test ends. No test depends on another test or on the API's seed data, so tests run in parallel and in any order.
* **Reporting.** Every request and response (status, headers, body) is attached to the HTML report, so a failure can be investigated without re-running it.
* **Test data.** Booking names get a unique suffix and dates are always in the future, so data from parallel runs never collides.
* **Shared API.** Restful Booker is a public demo that resets its data every few minutes. Workers are kept at 2 and failed tests retry once, to allow for the free Heroku dyno waking up.
* **Selectors** for the documentation page use its generated `data-group` / `data-name` attributes. If the page changes, only `helpers/selectors` needs updating.
