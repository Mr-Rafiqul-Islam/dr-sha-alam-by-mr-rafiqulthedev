# Dr. Shah Alam – Online Appointment Booking Website

## 1. Overview

**Dr. Shah Alam – Online Appointment Booking Website** is a modern, patient-centered web platform and digital appointment portal built for **Dr. Md. Shah Alam**, an Orthopedic Spine Specialist and Certified Yoga Instructor based in Dhaka, Bangladesh.

### Main Purpose
The application enables patients suffering from spinal, nerve, and musculoskeletal conditions—including PLID (Prolapsed Lumbar Intervertebral Disc), sciatica, chronic back pain, and cervical neck pain—to easily consult with Dr. Shah Alam. It provides:
1. Online appointment scheduling with live chamber calendar awareness.
2. A choice between submitting a **Free Appointment Request** (confirmed by the clinical care team) or completing an **Instant Paid Booking** via the SSLCommerz payment gateway.
3. Evidence-based clinical guidelines, pre-visit instructions, rehabilitation advice, patient recovery stories, and an educational medical blog.


### Problem It Solves
- **Phone Queue Delays**: Replaces congested telephone lines with a direct, 24/7 web booking workflow.
- **Scheduling Conflicts**: Synchronizes with the clinic schedule in real time, preventing bookings on closed chamber dates, public holidays, or unavailable time slots.
- **Unprepared Consultations**: Provides clear pre-visit guidance (what medical records, MRIs, and prescriptions to bring), ensuring higher-quality clinical evaluations.
- **Intake Tracking**: Assigns a sequential daily serial number upon confirmation to minimize chamber waiting room friction.


---

## 2. Key Features

- **Doctor Profile & Credentials**: Detailed presentation of Dr. Shah Alam's medical qualifications, orthopedic spine background, yoga certification, and holistic recovery philosophy.
- **Dual-Mode Appointment Booking**:
  - **Free Appointment Request**: Submit personal details and desired date/time for staff review and manual phone/WhatsApp confirmation.
  - **Instant Paid Booking**: Seamless checkout integration via SSLCommerz to pay the consultation fee and confirm immediately.
- **Live Chamber Schedule & Slot Synchronization**:
  - Fetches active clinic slots dynamically from `/api/v1/client/appointment-schedules/defaults`.
  - Fetches closed and inactive chamber dates from `/api/v1/client/appointment-schedules`.
- **Intelligent Calendar Date Picker**:
  - Powered by `react-day-picker`.
  - Automatically disables past dates and highlights closed chamber dates in red.
  - Enforces condition-specific booking rules (e.g., PLID slot `P-9` requires a future appointment date).
- **Patient Information Form**:
  - Required fields: Full Name, Phone Number, Home Address, Preferred Time, Preferred Date.
  - Optional fields: Email Address, Gender (Male / Female / Other), Age, Problem / Symptoms description.
- **Booking Confirmation & Serial Assignment (`/booking-success`)**:
  - Displays patient name, scheduled date, time slot, home address, and assigned serial number (e.g., `#01`).
  - Outlines the 3-step recovery timeline (Request review -> Phone confirmation -> Chamber visit).
  - Provides direct WhatsApp support and one-click Google Maps navigation to the clinic.
- **Payment Lifecycle Feedback**:
  - Dedicated `/payment-failed` page with error message resolution based on payment gateway status codes.
  - Dedicated `/payment-cancelled` page allowing users to retry booking without data loss.
- **Educational Medical Blog Engine (`/blog`, `/blog/[slug]`)**:
  - Server-side data fetching with Incremental Static Regeneration (ISR, 60s cache).
  - Category filtering and real-time search query matching.
  - Automated Table of Contents (TOC) generated from HTML `<h2>` elements.
  - Read-time estimation, author metadata, related articles, and native social share buttons.
- **Patient Success Stories & Video Testimonials**:
  - Video testimonial integration and patient recovery case studies.
- **Clinical Guidelines & Instructions**:
  - Pre-visit instructions (`/before-visit-instructions`) and post-treatment guidance (`/after-treatment-instructions`).
  - General patient preparation guidelines (`/patient-guidelines`).
  - Comprehensive expandable FAQ accordion (`/faq`).
- **Chamber Information & Interactive Contact (`/contact`)**:
  - Complete contact form submitting to `/api/v1/client/contact-messages`.
  - Chamber address at TruCare Diagnostic Centre, Mohakhali, Dhaka.
  - Click-to-call telephone links, direct WhatsApp chat, and interactive Google Maps direction links.
- **Meta (Facebook) Pixel & Conversion Tracking**:
  - Dynamic pixel configuration fetched from `/api/v1/client/analytics-config`.
  - Client-side event tracking for `Schedule`, `InitiateCheckout`, and `Purchase`.
  - Automated forwarding of `_fbc`, `_fbp`, and `fbEventId` cookies through Server Actions.
- **Tawk.to Live Chat Widget**: Asynchronous live customer support widget loaded via `next/script`.
- **Responsive Dark/Light Theme**: Built with custom Tailwind CSS dark mode variant (`dark:`).
- **Automated SEO & Structured Data**: OpenGraph tags, canonical links, dynamic `sitemap.ts`, and `robot.ts`.

---

## 3. Tech Stack

| Layer | Technology | Version | Purpose / Details |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `^16.2.7` | App Router, Server Actions, Standalone output |
| **Runtime & UI** | React / React DOM | `^19.2.1` | React 19 concurrent features, Server & Client Components |
| **Language** | TypeScript | `5.9.3` | Strict type checking throughout components and actions |
| **Styling** | Tailwind CSS | `4.1.11` | Utility-first CSS using Tailwind v4 theme configuration |
| **CSS Plugins** | `@tailwindcss/postcss`<br>`@tailwindcss/typography`<br>`tw-animate-css` | `4.1.11`<br>`^0.5.20`<br>`^1.4.0` | PostCSS processing, blog typography, CSS animations |
| **Motion** | `motion` | `^12.23.24` | Smooth transitions and scroll reveal micro-animations |
| **Icons & Fonts** | `lucide-react`<br>Google Material Symbols<br>Font Awesome 6<br>Google Fonts | `^0.553.0`<br>CDN<br>`6.4.2`<br>`next/font` | UI iconography, Manrope display font, Anek Bangla font |
| **Date Picker** | `react-day-picker` | `^10.0.1` | Accessible, customizable calendar picker |
| **Form Resolvers**| `@hookform/resolvers` | `^5.2.1` | Hook form validation resolver utility |
| **Style Utilities**| `clsx`<br>`tailwind-merge`<br>`class-variance-authority` | `^2.1.1`<br>`^3.3.1`<br>`^0.7.1` | Conditional styling and class name merging |
| **External SDK** | `@google/genai` | `^1.17.0` | Google GenAI SDK integration |
| **Process Manager**| PM2 | `ecosystem.config.cjs` | VPS Node process orchestration on port 3000 |
| **Backend Integration** | Express REST API | External | Communicates with the `drsa-server` backend and PostgreSQL |
| **Payment Gateway** | SSLCommerz | LTS | Payment gateway redirection and transaction processing |

---



## 4. Project Structure

```
client/
├── app/                              # Next.js App Router routes & configuration
│   ├── about/                        # About Dr. Shah Alam page
│   ├── after-treatment-instructions/ # Post-treatment rehabilitation guide
│   ├── appointment/                  # Main appointment booking page & FAQ
│   ├── before-visit-instructions/    # Pre-consultation checklist & guidelines
│   ├── blog/                         # Blog listing & /blog/[slug] dynamic detail
│   ├── booking-success/              # Post-booking confirmation with serial number
│   ├── contact/                      # Contact form, chamber hours & clinic map
│   ├── faq/                          # Frequently asked questions accordion
│   ├── patient-guidelines/           # Clinical and diagnostic guidelines
│   ├── payment-cancelled/            # Payment cancellation notification page
│   ├── payment-failed/               # Payment error display with code mapping
│   ├── privacy-policy/               # Privacy policy disclosure
│   ├── success-stories/              # Patient video testimonials & written stories
│   ├── terms-conditions/             # Terms and conditions page
│   ├── treatments/                   # Treatments & conditions catalog
│   ├── globals.css                   # Tailwind v4 import, theme variables & styles
│   ├── layout.tsx                    # Root HTML layout, fonts, header, footer, scripts
│   ├── page.tsx                      # Homepage composed of landing sections
│   ├── robot.ts                      # Dynamic robots.txt generation
│   └── sitemap.ts                    # Dynamic XML sitemap generator
├── components/                       # Modular UI components
│   ├── about/                        # About page sections
│   ├── after-treatment/              # After-treatment content sections
│   ├── analytics/                    # FacebookPixel client component
│   ├── appointment/                  # AppointmentSteps and step indicators
│   ├── before-visit/                 # Before-visit advice components
│   ├── blog/                         # BlogHero, BlogContent, AuthorBio, TOC, cards
│   ├── booking/                      # BookingForm.tsx, PreferredDatePicker.tsx
│   ├── contact/                      # ContactForm.tsx, ContactInfo.tsx
│   ├── faq/                          # FAQ listing components
│   ├── layout/                       # Header.tsx, Footer.tsx, Navigation
│   ├── success-stories/              # VideoTestimonials, PatientReview modals
│   ├── treatments/                   # Treatment detail cards and lists
│   └── ScrollReveal.tsx              # Motion animation wrapper
├── hooks/                            # Custom React hooks
│   └── use-mobile.ts                 # Responsive viewport breakpoint detection hook
├── lib/                              # Core business logic & utility modules
│   ├── api.ts                        # Base URL resolver & default doctor ID helper
│   ├── appointmentDate.ts            # Date formatting, PLID rules & past date checks
│   ├── appointmentSchedules.ts       # Closed chamber dates parsing and filtering
│   ├── appointmentSerial.ts          # Serial number calculation and #01 formatting
│   ├── blog.ts                       # Blog slug normalization, TOC parser & read time
│   ├── metaAnalytics.ts              # Browser Meta Pixel trackMetaEvent & cookie reader
│   ├── metaCookies.ts                # Server-side _fbc and _fbp cookie extractor
│   └── utils.ts                      # clsx and tailwind-merge helper function (cn)
├── public/                           # Static assets (images, photos, icons)
├── server-actions/                   # Next.js Server Actions calling backend API
│   ├── getAllBlogs.ts                # Fetches paginated blogs with search/category
│   ├── getAppointmentById.ts         # Fetches single appointment confirmation details
│   ├── getAppointmentSchedules.ts    # Fetches active/inactive schedule dates
│   ├── getBlogDetailsBySlug.ts       # Fetches single blog by normalized slug
│   ├── getSlotDefaults.ts            # Fetches available booking slots
│   ├── startPayment.ts               # Initiates SSLCommerz payment session
│   ├── submitContactMessage.ts       # Submits user contact form messages
│   └── submitFreeAppointment.ts      # Creates a free appointment request
├── types/                            # TypeScript interfaces & type definitions
│   ├── appointmentSchedule.ts        # Schedule record and API response schemas
│   ├── blog.ts                       # PublicBlog, author, category & pagination types
│   ├── booking.ts                    # Appointment form payload & summary types
│   ├── contact.ts                    # Contact message payload & response types
│   └── slotDefaults.ts               # Slot defaults and siteRef schemas
├── ecosystem.config.cjs              # PM2 production process configuration
├── next.config.ts                    # Next.js standalone output & image domains
├── package.json                      # Dependencies and npm scripts
└── tsconfig.json                     # TypeScript compilation configuration
```

---

## 5. Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher (Node 20+ required by Next.js 16 and React 19)
- **Package Manager**: `npm` (v10+), `bun`, or `pnpm`
- **Backend Service**: An active instance of `drsa-server` (or local API server)

### Installation
Clone the repository, navigate to the `client` directory, and install dependencies:

```bash
cd client
npm install
```

### Environment Variables
Create a `.env.local` file in the `client/` root based on `.env.example`:

```bash
cp .env.example .env.local
```

Configure the environment variables:

```env
# Backend REST API Base URL (Do not include trailing slash)
NEXT_PUBLIC_API_BASE_URL=https://api.trucarehealingcentre.com

# Public Frontend URL (Used for metadataBase, canonical links, and sitemap)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Default Doctor UUID (Database ID for Dr. Shah Alam)
NEXT_PUBLIC_DEFAULT_DOCTOR_ID=89bb0bc4-ba91-460e-9aff-cae9b5c827fd

# Optional: Disable Hot Module Replacement (useful in restricted IDE environments)
# DISABLE_HMR=true
```

> [!IMPORTANT]
> `NEXT_PUBLIC_API_BASE_URL` is required for both server actions and client-side schedule retrieval. If unconfigured, server actions will throw an `"API URL is not configured"` error.

### Development
Start the Next.js local development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Build the optimized standalone production bundle:

```bash
npm run build
```

Run the built production server locally:

```bash
npm run start
```

---


## 6. Appointment Booking Flow

The booking system supports two flows: **Free Appointment Request** and **Paid Instant Booking**.

### Detailed Booking Steps

1. **Initiation**: The patient arrives at `/appointment` and scrolls to the `#booking-form` section.
2. **Slot & Chamber Ingestion**:
   - `getSlotDefaults()` retrieves active consultation slots (e.g., Morning 10:00 AM, Afternoon 3:00 PM, Evening 5:00 PM).
   - `getAppointmentSchedules()` retrieves the list of closed dates for `DOCTOR_SHA_ALAM`.
3. **Date Selection & Validation Rules**:
   - When the user selects a time slot, `getMinPreferredDateYmd` computes the minimum selectable date:
     - For slot `P-9` (PLID consultations), a future date is strictly enforced (`getTomorrowYmd()`).
     - For general slots, today's date is allowed if the chamber is open.
   - `PreferredDatePicker` disables dates prior to `minDate` and any date in `closedDates` (highlighted in red with class `.rdp-chamber-closed`).
4. **Data Entry**:
   - Patient enters Full Name, Bangladeshi mobile number, home address, and optional demographic details (age, gender, symptom description).
5. **Form Submission & Branching**:
   - **Free Mode**:
     - Calls `submitFreeAppointment()`, bundling form fields with `fbEventId` and Meta cookies (`_fbc`, `_fbp`).
     - Submits a `POST` request to `${NEXT_PUBLIC_API_BASE_URL}/api/v1/client/appointments`.
     - On response, triggers Meta Pixel `Schedule` event and routes to `/booking-success?appointmentId=<id>`.
   - **Paid Mode**:
     - Calls `startPayment()`, attaching `siteRef: "DOCTOR_SHA_ALAM"`, `doctorId: NEXT_PUBLIC_DEFAULT_DOCTOR_ID`, and client user-agent.
     - Submits a `POST` request to `${NEXT_PUBLIC_API_BASE_URL}/api/v1/payment/start`.
     - Triggers Meta Pixel `InitiateCheckout` event and immediately redirects `window.location.href` to the SSLCommerz payment page.
6. **Payment Outcomes**:
   - **Success**: Payment gateway redirects to `/booking-success?appointmentId=<id>&tranId=<tranId>`. The page triggers a Meta `Purchase` event with currency `BDT`.
   - **Failure**: Redirects to `/payment-failed?error=<errorCode>`.
   - **Cancellation**: Redirects to `/payment-cancelled`.
7. **Success Confirmation**:
   - `/booking-success` calls `getAppointmentById(appointmentId)`.
   - The effective serial number is formatted via `formatSerialDisplay(getEffectiveSerialNumber(appointment))` (e.g., `#01`).
   - The patient receives consultation steps, WhatsApp support links (`wa.me/+8801701313001`), and Google Maps directions to the Mohakhali clinic.
8. **Chamber Intake & Status**:
   - The booking is stored in the database with status `PENDING`.
   - The clinic staff contacts the patient via phone or WhatsApp to verify reports and confirm the final consultation schedule.

---

## 7. API Integration

All external API interactions originate from Next.js Server Actions using the `fetch` API.

| Endpoint Path | Method | Server Action | Purpose | Auth Required | Cache / Revalidation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/client/appointment-schedules` | `GET` | `getAppointmentSchedules` | Retrieve closed dates & schedule statuses | None (Public) | `cache: "no-store"` |
| `/api/v1/client/appointment-schedules/defaults` | `GET` | `getSlotDefaults` | Retrieve available slot options for siteRef | None (Public) | `cache: "no-store"` |
| `/api/v1/client/appointments` | `POST` | `submitFreeAppointment` | Submit a free appointment request | None (Public) | Network mutation |
| `/api/v1/payment/start` | `POST` | `startPayment` | Initiate SSLCommerz checkout session | None (Public) | Network mutation |
| `/api/v1/client/appointments/:id` | `GET` | `getAppointmentById` | Fetch appointment summary for confirmation | None (Public) | `cache: "no-store"` |
| `/api/v1/client/blogs` | `GET` | `getAllBlogs` | Retrieve paginated blog posts with filters | None (Public) | `next: { revalidate: 60 }` |
| `/api/v1/client/blogs/:slug` | `GET` | `getBlogDetailsBySlug` | Retrieve single blog post by slug | None (Public) | `next: { revalidate: 60 }` |
| `/api/v1/client/contact-messages` | `POST` | `submitContactMessage` | Submit feedback or general inquiries | None (Public) | Network mutation |
| `/api/v1/client/analytics-config` | `GET` | `layout.tsx` (Direct) | Fetch active Meta Pixel ID & status | None (Public) | `next: { revalidate: 300 }` |


---


## 8. SEO & Performance

### Search Engine Optimization (SEO)
- **Metadata API**: `layout.tsx` defines default metadata, titles, descriptions, authors, publisher tags, and canonical alternates.
- **Multilingual Keywords**: Configured with both English and Bengali keywords (e.g., `"Dr. Shah Alam"`, `"পিএলআইডি ডাক্তার"`, `"Orthopedic Spine Specialist"`).
- **Dynamic Sitemap (`app/sitemap.ts`)**: Automatically merges static routes (`/`, `/about`, `/appointment`, `/treatments`, etc.) with dynamic blog posts queried live from `/api/v1/client/blogs`.
- **Crawler Directives (`app/robot.ts`)**: Allows all user agents (`User-agent: *`) and references `${NEXT_PUBLIC_FRONTEND_URL}/sitemap.xml`.
- **OpenGraph & Twitter**: Fully configured cards with title, description, and preview imagery.

### Performance Optimizations
- **Next.js Image Optimization**: Remote image sources configured in `next.config.ts` (`picsum.photos`, `images.unsplash.com`, `lh3.googleusercontent.com`, `res.cloudinary.com`, `image.mux.com`, `www.facebook.com`).
- **Font Optimization**: Uses `next/font/google` for `Manrope` and `Anek_Bangla` with CSS variables (`--font-display`, `--font-anek-bangla`), preventing cumulative layout shift (CLS).
- **Incremental Static Regeneration**: Blog pages cache content for 60 seconds (`{ next: { revalidate: 60 } }`), reducing database query load.
- **Standalone Build**: Configured with `output: 'standalone'` in `next.config.ts` for minimal production artifacts.

---

## 9. Responsive & UI

### Design Tokens (`app/globals.css`)
Built with Tailwind CSS v4 using a customized medical color system:

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `--color-primary` | `#00779B` | Deep Ocean Teal for headers, hero titles, primary brand elements |
| `--color-primary-dark` | `#005c7a` | Darker teal for hover states and button interactions |
| `--color-accent` | `#00CBC0` | Vibrant Aqua for buttons, badges, icons, and CTA highlights |
| `--color-accent-dark` | `#00a89f` | Aqua hover state |
| `--color-background-light` | `#f8fbfc` | Soft ice-blue background for clean clinical reading |
| `--color-background-dark` | `#0f1e23` | Dark mode base canvas |
| `--color-surface-light` | `#ffffff` | Clean card and container surfaces |
| `--color-surface-dark` | `#162a31` | Dark mode container surfaces |

### Responsive Design Principles
- **Mobile-First Layout**: Grid layouts adapt from 1 column on mobile to 2 columns on tablets/desktops (`grid-cols-1 md:grid-cols-2`).
- **Sticky Glassmorphic Header**: Blur-backed navigation (`backdrop-filter: blur(8px)`) sticky to the top of the viewport.
- **Customized DayPicker**: Custom calendar styles (`.booking-date-picker`) integrating teal selection accents and red disabled days for chamber closures.
- **Micro-Animations**: Uses `ScrollReveal` (powered by `motion`) to create subtle entry animations as users scroll through credentials, testimonials, and guidelines.

---


## 10. Future Improvements

Identified from codebase review and commented feature placeholders:

- **Direct Calendar Export**: Activate the "Add to Calendar" button (currently commented out in `booking-success/page.tsx`) to generate `.ics` files and Google Calendar links.
- **Automated Medical Report Upload**: Implement pre-consultation MRI and prescription file uploads directly in `BookingForm.tsx` (presently noted in the FAQ as an upcoming capability).
- **Patient Appointment Lookup Portal**: Add a self-service page where patients can enter their phone number or transaction ID to check their serial status and appointment confirmation.
- **Automated Unit & E2E Testing**: Add automated testing suites with Vitest / React Testing Library and Playwright for critical booking paths.

---

## 11. License

This repository and codebase are proprietary and private property of **Dr. Md. Shah Alam**. All rights reserved. Unauthorized reproduction, modification, or distribution is strictly prohibited.
