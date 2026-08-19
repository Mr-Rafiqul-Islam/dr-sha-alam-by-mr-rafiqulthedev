## Purpose

Defines how appointment invoices appear on screen and when printed onto TruCare A5 letterhead pads that already carry branded header and footer art.

## ADDED Requirements

### Requirement: Preview shows generated letterhead
When an admin opens an appointment invoice in the invoice modal, the on-screen preview SHALL include the generated clinic header band (logo, brand, and contact artwork).

#### Scenario: Open invoice preview
- **WHEN** an admin opens the appointment invoice modal for a booking
- **THEN** the preview includes the generated header band above the invoice body

### Requirement: Pad print omits generated letterhead
When an admin prints an appointment invoice onto a pre-printed A5 pad, the printed PDF SHALL omit the generated header band so it does not overlap the pad's pre-printed header.

#### Scenario: Print onto pad
- **WHEN** an admin prints an appointment invoice with the modal Print action
- **THEN** the printed page has no generated header band and starts with invoice content below a reserved top inset

### Requirement: Print content clears pad header and footer
Pad-print invoices SHALL remain A5. Invoice title, patient fields, line items, and total SHALL sit in the pad's blank middle, using named top and bottom insets that staff can change in one place and reprint to match the physical pad. The PAID seal and signature SHALL sit above the pad's pre-printed footer band, higher than the preview signature position.

#### Scenario: Content inset on pad print
- **WHEN** an admin prints an appointment invoice with the modal Print action
- **THEN** the invoice body starts below the top inset and the PAID seal and signature sit above the bottom inset, clear of the pad footer

#### Scenario: Tune pad insets
- **WHEN** a developer changes the named pad-print inset values and reprints
- **THEN** the printed invoice uses those new top, bottom, and signature offsets without other layout code changes

### Requirement: Pad prints use the Print action only
The invoice modal SHALL not expose a viewer-toolbar print control that would print the headered preview PDF. Pad prints MUST go through the modal Print action, which uses the headerless pad-print layout.

#### Scenario: Viewer has no print control
- **WHEN** an admin views an appointment invoice in the modal
- **THEN** the preview viewer does not offer a print control that would output the headered preview

#### Scenario: Modal Print uses pad layout
- **WHEN** an admin clicks the modal Print button
- **THEN** the system prints the headerless pad-print layout, not the headered preview
