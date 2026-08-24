# admin-chamber-role Specification

## Purpose

Defines CHAMBER as a staff-panel role with the same access as SUPPORT, so chamber operators can log in, be assigned, and work appointments like support staff.

## Requirements

### Requirement: CHAMBER is a staff-panel role
The system SHALL treat `CHAMBER` as a staff-panel role. A CHAMBER user with a valid password and active account SHALL authenticate to the admin panel. Unauthenticated or inactive CHAMBER accounts SHALL be denied.

#### Scenario: CHAMBER can log in
- **WHEN** an active CHAMBER user submits valid staff credentials
- **THEN** the system authenticates them and issues a staff session

#### Scenario: Inactive CHAMBER cannot log in
- **WHEN** an inactive CHAMBER user submits otherwise valid credentials
- **THEN** the system denies access

### Requirement: CHAMBER access matches SUPPORT
A CHAMBER user SHALL have the same admin permissions as SUPPORT: appointments, appointment schedules, contact messages, and announcements. CHAMBER SHALL NOT gain permissions SUPPORT does not have (dashboard overview, articles, analytics settings, delete approvals, admin management). After login, the default path SHALL be the appointments list.

#### Scenario: CHAMBER opens appointments
- **WHEN** a CHAMBER user is authenticated
- **THEN** they can open the appointments list, create-appointment form, and appointment schedules

#### Scenario: CHAMBER is denied support-out-of-scope pages
- **WHEN** a CHAMBER user requests admin management, articles, analytics settings, or delete approvals
- **THEN** the system denies access

#### Scenario: Default landing is appointments
- **WHEN** a CHAMBER user logs in with no deeper requested path
- **THEN** they land on the appointments list

### Requirement: Staff admins can assign CHAMBER
SUPER_ADMIN, MANAGER, and ADMIN actors who can already assign SUPPORT SHALL be able to create and update staff users with role CHAMBER using the same assignment rules as SUPPORT.

#### Scenario: Admin creates a CHAMBER user
- **WHEN** an ADMIN creates a staff user with role CHAMBER
- **THEN** the user is stored as CHAMBER and can sign in to the staff panel

#### Scenario: Role picker includes CHAMBER
- **WHEN** a SUPER_ADMIN, MANAGER, or ADMIN opens the staff create or edit form
- **THEN** CHAMBER is listed among assignable roles using the same actor rules as SUPPORT
