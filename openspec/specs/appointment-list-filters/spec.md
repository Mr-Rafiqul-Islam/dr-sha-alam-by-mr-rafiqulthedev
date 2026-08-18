# appointment-list-filters Specification

## Purpose

Defines how admins filter the Recent Appointments list so date and today stay prominent while category, clinical, and attendance filters live in a compact Filter panel.

## Requirements

### Requirement: Visible filter bar controls
The admin Recent Appointments page SHALL show Search, Date picker, Today's Appointments, Filter, Clear Filters, and Refresh in the main filter bar. Category and extended filters MUST NOT appear as always-visible chips in that bar.

#### Scenario: Default filter bar layout
- **WHEN** an admin opens Recent Appointments
- **THEN** the filter bar shows Search, Date, Today's Appointments, Filter, Clear Filters, and Refresh and does not show General, Old General, PLID New, or PLID Old as inline chips

### Requirement: Filter panel for extended options
Clicking **Filter** SHALL open a panel listing category toggles (General, Old General, PLID New, PLID Old) and extended toggles (Injection, Surgery, Attended, Not Attended). Each option SHALL use the same active/inactive toggle styling as the previous inline category chips. Multiple options MAY be selected at once.

#### Scenario: Open Filter panel
- **WHEN** an admin clicks Filter
- **THEN** a panel opens with all category and extended filter toggles

#### Scenario: Active Filter indicator
- **WHEN** any category or extended filter is selected
- **THEN** the Filter control shows the active (selected) visual state

### Requirement: Category filters remain server-side multi-select
Selecting one or more category filters SHALL refetch appointments from the list API with `category` query parameters (OR semantics). Category selection MUST combine with client filters using AND semantics.

#### Scenario: General and PLID New selected
- **WHEN** an admin selects General and PLID New in the Filter panel
- **THEN** the list API is called with both categories and results include appointments matching either category

### Requirement: Extended filters are client-side multi-select
Injection, Surgery, Attended, and Not Attended filters SHALL apply on the loaded appointment list without a separate API call. When multiple extended filters are selected, an appointment matching ANY selected extended filter SHALL be included (OR). When both category and extended filters are active, an appointment MUST match the category result AND match at least one selected extended filter.

#### Scenario: Injection filter
- **WHEN** an admin selects Injection only
- **THEN** the table shows only appointments with a non-empty injection name

#### Scenario: Surgery filter
- **WHEN** an admin selects Surgery only
- **THEN** the table shows only appointments with a non-empty operation (surgery) name

#### Scenario: Attended filter
- **WHEN** an admin selects Attended only
- **THEN** the table shows only appointments whose status is ATTEND

#### Scenario: Not Attended filter
- **WHEN** an admin selects Not Attended only
- **THEN** the table shows only appointments whose status is NOT_ATTENDED

### Requirement: Clear Filters resets all filter state
Clear Filters SHALL reset search, date, Today's Appointments, all category selections, and all extended filter selections.

#### Scenario: Clear all filters
- **WHEN** an admin clicks Clear Filters with any combination of filters active
- **THEN** all filter controls return to their default empty state and the full appointment list is shown
