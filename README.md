# Beauty Center Skien

## Frontend

Responsive design - Optimized for desktop, tablet, and mobile
Modern UI - Elegant design with Tailwind CSS
Static pages - About us, services, contact
Navigation - Header with navbar and footer

## Booking System

Interactive calendar - Select desired date
Dynamic available times - Fetches available times from database
Service selection - Complete overview of treatments and prices
Form validation - Validation of name, email, and phone number
Double booking protection - Prevents conflicts
Success modal - Elegant confirmation after booking

## Backend & Database

SQLite database - With Prisma ORM
API endpoints - RESTful API for bookings
Email system - Automatic confirmations via Nodemailer
Data security - Input validation and sanitization

## Technology Stack

- Next.js 15.4.5 (React framework)
- TypeScript (Type-safe JavaScript)
- Tailwind CSS (Utility-first CSS)
- SQLite + Prisma (Database & ORM)
- Nodemailer (Email service)
- React DatePicker (Calendar component)

## Security

Input Validation:

Zod schema validation on both frontend and backend
Type-safe input handling with TypeScript
Data sanitization (removes dangerous characters and extra whitespace)
Regex validation for phone numbers and names
Email format validation

Rate Limiting:

Booking API: 3 attempts per 10 minutes per IP address
Contact API: 5 messages per hour per IP address
Upstash Redis backend for distributed rate limiting
Sliding window algorithm for fair limitation

Date/Time Security:

Past date validation: Cannot book dates/times in the past
15-minute buffer: Cannot book appointments starting in less than 15 minutes
Visual feedback: Past times shown grayed out and disabled

Anti-Spam Protection:

Automatic spam filter that blocks URLs and spam keywords
IP logging for security tracking
Content analysis of messages and subjects

Database Security:

Prisma ORM prevents SQL injection
PostgreSQL in production (Neon database)
Connection string secured via environment variables
Unique constraints on booking times to prevent double-booking

API Security:

Error handling without exposing system details
CORS configuration via Next.js
HTTP-only communication with HTTPS in production
Structured error messages that don't reveal system information

## Getting Started

## Prerequisites

Node.js 18+
npm or yarn

## Installation

## Clone the project

bash
git clone <https://github.com/AslanKhatuev/beautycenterskien-website.git>
cd beautycenterskien-website

## Install dependencies

bash
npm install

## Set up environment variables Create .env.local file

envDATABASE_URL="file:./prisma/dev.db"
EMAIL_USER=<massagevika24@gmail.com>
EMAIL_PASS="csky qluf tydj ovri"
EMAIL_FROM=<massagevika24@gmail.com>
EMAIL_TO=<massagevika24@gmail.com>

## Set up database

bash
npx prisma generate
npx prisma db push

## Start development server

bash
npm run dev
Open localhost:3000 in your browser.

## Support

For questions or issues:

Email: <massagevika24@gmail.com>
Phone: +47 968 09 506

License
This project is created for Beauty Center Skien.
Maintenance
Regular tasks

Database backup
Dependencies updates
Email delivery monitoring
Booking statistics review

Made with love for Beauty Center Skien
