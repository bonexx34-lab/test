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
- Landing page with exact copy: CuratedCloset headline, "for Creators & Brands", "CURATE. CONVERT.", baseline, keywords, "Join the guestlist →" CTA
- Light cream theme (#F5F0EB) with Inter font, gold accents, glassmorphism CTA card
- Invisible admin link (opacity:0, still clickable)
- Email subscription with duplicate detection
- Password-protected admin page (curatedcloset2025)
- Analytics dashboard: total visits, subscribers, conversion rate
- Excel export + subscriber management
- Visit tracking on page load
- Footer: "Patent-pending concept & technology"
- All tests passing (100% backend, frontend, integration, mobile, copy)

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
