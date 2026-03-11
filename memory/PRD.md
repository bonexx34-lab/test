# CuratedCloset - PRD

## Problem Statement
Build a stunning, modern landing page for "CuratedCloset" — a platform for creators and brands. Premium, minimal, confident design with email collection and admin management.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB
- **Export**: openpyxl for Excel generation

## User Personas
- **Creators/Brands**: Visit landing page, sign up with email
- **Admin**: View subscriber list, export to Excel, delete subscribers

## Core Requirements
- Deep black (#050505) background with off-white typography
- Gold (#D4AF37) accent color
- Glassmorphism CTA card with email input
- Micro-animations on load (staggered fade-in)
- Noise texture + grid overlay for depth
- Floating gradient orbs for subtle animation
- Mobile-first, fully responsive
- Footer with curatedcloset.cc

## What's Been Implemented (Dec 2025)
- Landing page with full hero section (headline, subheadline, tagline, body, CTA)
- Email subscription (POST /api/subscribe) with duplicate detection
- Admin page (/admin) with subscriber table
- Excel export (GET /api/admin/subscribers/export)
- Delete subscriber functionality
- Sonner toast notifications
- Manrope font, glassmorphism, staggered animations
- All tests passing (100% backend, frontend, integration, mobile)

## Prioritized Backlog
### P0 (Critical) - Done
- [x] Landing page hero
- [x] Email collection
- [x] Admin view + export

### P1 (Nice to Have)
- [ ] Password-protected admin page
- [ ] Email confirmation/welcome flow
- [ ] Analytics (visits, conversion rate)

### P2 (Future)
- [ ] A/B testing for CTA copy
- [ ] Social proof section
- [ ] Testimonials or feature highlights
- [ ] Multi-language support
