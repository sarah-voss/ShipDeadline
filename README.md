# ShipDeadline

A vanilla JavaScript portfolio project inspired by my work in logistics coordination.

I built ShipDeadline around a question that comes up in shipment planning: **when should a shipment leave to arrive before a fiscal closing date?**

I wanted to practise JavaScript with a problem I knew from work. The app takes a route, vehicle types and a target fiscal month, then estimates a departure window. It gives a starting point for planning; actual transit times and availability still need to be checked with the carrier.

**[Try the live demo](https://sarah-voss.github.io/ShipDeadline/)** — no account or installation needed.

![ShipDeadline shipping recommendation for Milan to Berlin](docs/screenshot-result.jpg)

## Try it

For an example, choose Italy / Milan as the departure and Germany / Berlin as the destination, selecting each location from the suggestions. Choose November 2026 and Standard Truck, then continue to the result.

You can also open **Fiscal Deadlines** to change the monthly closing dates. Your settings and progress are saved in your browser.

## What it does

- Finds cities and postcodes using Geoapify autocomplete.
- Estimates a departure window and latest departure date for full-load road shipments within the supported European country list.
- Supports Standard Truck, Van and Exceptional Load, with up to three different vehicle types per shipment.
- Shows the route, estimated transit time, customs allowance and fiscal deadline together on the result screen.
- Lets you customise monthly fiscal deadlines for 2026 and 2027.
- Adapts to smaller screens and includes keyboard navigation, screen reader labels and reduced motion support.

## What I practised

This project gave me practice with JavaScript beyond individual exercises: connecting form inputs, an external API, saved settings and calculation rules in one app.

The main areas were:

- Fetching location suggestions and handling responses from an API.
- Validating inputs and keeping the interface in sync with the selected route and vehicles.
- Saving progress and settings with `localStorage`.
- Working with calendar dates and weekends.
- Splitting JavaScript into modules, with the calculation rules separate from the code that updates the page.

## How the estimate works

The calculation uses a simplified model:

1. Calculate the straight-line distance between the locations and add 30% as an approximation of road distance.
2. Estimate driving time using the slowest selected vehicle: 70 km/h for Standard Truck, 85 km/h for Van or 45 km/h for Exceptional Load.
3. Add the longest loading allowance among the selected vehicles, plus 6 hours for customs if either country is outside the EU customs union.
4. Allow same-day arrival for totals up to 8 hours; otherwise split the time into transit days using a simplified 9-hour allowance per day.
5. Count backwards from the fiscal deadline using working days. Weekend deadlines move back to Friday, and the suggested window starts four working days before the latest departure date.

These are planning estimates. The daily allowances are not a driver-hours compliance model.

## Built with

- HTML, CSS and vanilla JavaScript with ES modules.
- [Geoapify Autocomplete API](https://www.geoapify.com/address-autocomplete) for location search.
- `localStorage` for browser settings and progress.
- Node.js's built-in test runner for automated checks.
- GitHub Pages and GitHub Actions for hosting and deployment.
- Google Fonts: Manrope and Zen Dots.

There is no frontend framework or bundler. Node.js is used for tests and deployment packaging.

## Current limits

Version 1 focuses on full-load road shipments. The other transport options are placeholders.

- Distances are approximate, rather than calculated from real road routes.
- Traffic, public holidays, carrier schedules, ferry services and exceptional-load permits are not included.
- Loading times, speeds and customs allowances are fixed assumptions.
- Fiscal years are limited to 2026 and 2027.
- A current-month calculation can suggest a departure date that has already passed, so check the dates before planning.
- Saved data stays in the current browser; it is not shared between devices.

The accessibility features have not had a full independent audit.

## Possible future improvements

I may explore more accurate route estimates and support for other transport modes, such as groupage, sea or air. These are ideas for later; the current version focuses on the full-load road workflow.

## For anyone exploring the code

The calculation rules are in `js/features/calculator/logic/`. Controllers handle events and state, renderers update the page, and `js/services/` contains the Geoapify integration.

<details>
<summary>Run locally and run the tests (optional)</summary>

You only need these steps to run a copy on your own computer. To use the app, open the live demo above.

1. Clone or download this repository.
2. Create your own API key at [Geoapify](https://www.geoapify.com/).
3. Copy `js/services/env.example.js` to `js/services/env.js` and set your key:

   ```js
   export const GEOAPIFY_API_KEY = 'your_api_key_here';
   ```

4. Serve the folder with a local server, such as the VS Code **Live Server** extension, and open `index.html`. JavaScript modules need a server rather than opening the file directly.

`env.js` is ignored by Git. Browser API keys are still visible in the running website, so restrict your key to the origins/referrers where you intend to use it. See [Geoapify key restrictions](https://myprojects.geoapify.com/help/api-keys/).

With Node.js 22 or newer, run the automated checks with:

```sh
npm test
```

The tests cover API errors, calendar dates in three time zones, weekend handling, the planning buffer, distance estimates, vehicle/customs assumptions, leap years and recovery after correcting duplicate vehicle selections.

For deployment details, see [Publishing on GitHub Pages](docs/PUBLISHING.md).

</details>

## Author and credits

Built by [Sarah Voss](https://github.com/sarah-voss) as part of my transition from logistics into software development, alongside part-time computer science studies.

Location search: [Geoapify](https://www.geoapify.com/). Map data: [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

© 2026 Sarah Voss. Third-party services and assets belong to their respective owners.
