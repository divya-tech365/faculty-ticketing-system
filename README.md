# Faculty Ticketing System (Prototype)

A responsive web prototype where faculty raise service requests (IT, maintenance, electrical, etc.) and the college team tracks them from **Open → In Progress → Completed**, with automatic **Overdue** detection.

> **Prototype notice:** this is a front-end only demo. There is no backend or database. All data is stored in the browser's `localStorage`, so it stays on one device and can be cleared by the browser.

## Features
- Role-based dashboards: **Faculty / Staff**, **Technician**, **HOD** (one per department), **Admin**
- Faculty module is open access (enter a name, no password) to raise and track tickets
- Create tickets with department, priority, location, due date, attachment name
- Admin / HOD assign department, technician, deadline and priority; ticket history is logged
- Automatic overdue detection (due date passed and not completed)
- Notifications for Admin, the department HOD and the department's technicians
- Search, filters, sorting; dashboard statistics and charts
- Built-in rule-based help assistant (not a real AI)
- Self-registration for Technician / HOD / Admin (HOD and Admin need a registration code)
- Responsive layout for phone, tablet and desktop

## Tech
HTML, CSS, JavaScript, **React 18** (via CDN) with `htm` templates. No build step.

## Run locally
1. Download or clone this repository.
2. Open the folder in VS Code and start **Live Server** on `index.html` (or just double-click `index.html`).
3. An internet connection is needed to load React from the CDN.

## Demo accounts
| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| HOD (IT) | `hod.it` | `hodit123` |
| HOD (Maintenance) | `hod.maintenance` | `hodmaint123` |
| HOD (Facilities) | `hod.facilities` | `hodfac123` |
| HOD (Electrical) | `hod.electrical` | `hodelec123` |
| HOD (Academic Support) | `hod.academic` | `hodacad123` |
| Technician (IT) | `ravi` / `arjun` | `staff123` / `tech123` |
| Technician (Maintenance) | `priya` | `tech123` |
| Technician (Electrical) | `meena` | `tech123` |
| Faculty / Staff | open access, use the *Faculty / Staff* tab and enter a name (e.g. `Dr. Ananya`) | none |

Registration codes for the Register tab (prototype defaults): Admin `ADMIN-2026`, HOD `HOD-2026`.

## Suggested demo flow
Faculty creates a ticket → Admin or HOD assigns it → Technician starts and completes it → Faculty sees the new status → Admin dashboard statistics update. `FT-1003` is pre-seeded as an overdue ticket.

## Deploy (optional)
Because this is a static site, it can be hosted free on GitHub Pages: *Settings → Pages → Deploy from a branch → `main` / root*.

## Future work
Spring Boot + MySQL backend with REST APIs and JWT authentication, as described in the project proposal.
