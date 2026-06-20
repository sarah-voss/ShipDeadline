# ShipDeadline

A logistics tool that calculates safe shipping windows to ensure goods arrive within a target fiscal month.

Built from real-world experience in logistics coordination, where delays and planning errors directly impact delivery performance and monthly revenue recognition.


## The Problem

Shipment planning requires manually gathering transit times from multiple carriers for every individual shipment. The process is time-consuming, fragmented, and difficult to align with internal fiscal deadlines.

When a shipment misses a fiscal month cut-off, it does not just affect logistics. It affects revenue reporting.


## The Solution

ShipDeadline calculates the latest safe departure date based on a few key inputs: origin, destination, vehicle type, and target fiscal month.

It gives planners an immediate answer without phone calls, emails, or spreadsheets.


## Features

### Fiscal month management
- Define custom fiscal months with start and end dates
- Settings persist across sessions via localStorage

### Route input
- Origin and destination lookup with real-time geocoding (OpenStreetMap / Nominatim)
- Automatic detection of continental Europe destinations
- Postcode and city auto-fill based on country selection

### Full load road shipments (FTL)
- Supports three vehicle types: standard truck, van, exceptional load
- Up to three vehicles per shipment
- Estimated transit times per vehicle type
- Accounts for weekends and non-working days

### Summary
- Clear output of the safe shipping window per vehicle
- Step-by-step review before confirming


## Roadmap

The following scenarios are planned for future versions:

- Full load sea shipments (FCL): document cut-off dates, port-to-door transit times
- Partial load road (LTL / groupage)
- Partial load air (express and standard)


## Tech Stack

- HTML
- CSS
- Vanilla JavaScript, no frameworks or external dependencies


## Status

Version 1 in active development, focused on full load road shipments (FTL).

Target: complete the FTL flow end-to-end, then publish as v1.
