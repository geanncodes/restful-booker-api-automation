/**
 * Selectors for the API documentation page (apidoc).
 * The page is generated, so the data-group / data-name attributes are the most stable hooks.
 */
export const SideNav = {
    container: `#sidenav`,
    filterInput: `#sidenav input.search`,
    groupHeader: (group: string) => `#sidenav li.nav-header[data-group="${group}"]`,
    endpoint: (group: string, name: string) => `#sidenav li[data-group="${group}"][data-name="${name}"]`,
},

Content = {
    container: `#content`,
    endpointSection: (group: string, name: string) => `#api-${group}-${name}`,
    title: `article h1`,
    methodBadge: `span.type`,
    endpointUrl: `pre.language-http`,
    successFieldNames: `h2:has-text("Success 200") + table tbody tr td:first-child`,
}

/** Endpoints under test, as named in the documentation */
export const BookingEndpoints = {
    getBooking: { name: "GetBooking", title: "Booking - GetBooking", method: "get" },
    createBooking: { name: "CreateBooking", title: "Booking - CreateBooking", method: "post" },
    updateBooking: { name: "UpdateBooking", title: "Booking - UpdateBooking", method: "put" },
    deleteBooking: { name: "DeleteBooking", title: "Booking - DeleteBooking", method: "delete" },
}

/** Order of the Booking endpoints in the side navigation */
export const BookingNavOrder = ["GetBookings", "GetBooking", "CreateBooking", "UpdateBooking", "PartialUpdateBooking", "DeleteBooking"]
