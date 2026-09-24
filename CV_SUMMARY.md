# EL8 Platform & Digital Ecosystem
A high-performance bilingual agency platform, client management portal, and interactive web application suite engineered for the EL8 software engineering collective.

## Role & timeline
- **My role:** Core Full-Stack Developer & Technical Contributor (Worked collaboratively within a 2-person development team; led performance architecture, critical path rendering optimization, and Supabase RLS security).
- **Start and end dates:** July 31, 2026 – September 1, 2026 (Active/maintained).
- **Team size:** 2 contributors (`Entity-8` with 65 commits, `zero0max` with 2 commits).

## Problem solved
High-fidelity modern agency platforms frequently suffer from significant GPU rendering bottlenecks, slow First Contentful Paint (FCP), and severe frame drops caused by concurrent blur filters, animated particle canvases, and bloated vector DOM payloads. This project delivers an ultra-smooth, 60–120 FPS bilingual web experience with dynamic client project tracking, admin content management, and robust backend isolation.

## Tech stack
- **Languages:** TypeScript (~80%), CSS (~13%), JavaScript / HTML (~7%).
- **Frameworks & Libraries:** React 18, Vite, React Router v7, Motion (Framer Motion), Radix UI (headless primitives), Tailwind CSS, Lucide React, i18next (English & Arabic RTL).
- **Databases & Cloud Infrastructure:** Supabase (PostgreSQL, GoTrue Authentication, Row Level Security policies), Vercel, Sentry error monitoring (`@sentry/react`).
- **Testing & Tooling:** Biome (`biome.json`), TypeScript native compiler checks (`tsconfig.check.json`), Vitest & Testing Library.

## Key features
- **Modular Feature-Driven Architecture:** Clean separation into domains including landing showcase, project portfolios, articles/blogs engine, client status tracking portal, and secured administrative controls.
- **Client Project Tracker & Portal:** Interactive tracking portal enabling clients to follow milestone execution, deliverable updates, and contract states with role-guarded access.
- **Full Bilingual Localization & RTL Optimization:** Seamless English/Arabic internationalization with automated RTL layout inversion, dynamic typography scaling, and tailored cultural copy.
- **Dynamic Content & Blog Management:** Markdown-driven article engine supporting dynamic publishing, category filtering, and rich remark-GFM rendering.
- **Administrative Control Suite:** Protected back-office interface for managing case studies, team profiles, inquiry submissions, and client review verification.
- **Koer Handwriting Recognition Engine (Companion App):** Embedded stroke-based Arabic handwriting-to-text canvas engine with Telegram Mini App integration and Bezier smoothing.

## Technical highlights
- **Compositor Fill-Rate Optimization:** Diagnosed and eliminated severe GPU frame drops caused by concurrent 20px backdrop filters and continuous canvas particles by engineering an active scroll listener that pauses `requestAnimationFrame` loops during page scrolls (`AmbientBackground.tsx`, `ParticlesBackground.tsx`, `redesign.css`).
- **AOT SVG Vector Extraction:** Extracted 751 lines of heavy JSX virtual-DOM SVGs into standalone asynchronous vector assets with CSS drop-shadows, drastically reducing main-thread React reconciliation and preventing element ID collisions.
- **Critical Path Code Splitting & Prerendering:** Decoupled modals, search palettes, and Sentry telemetry from the critical rendering path, purged inline Base64 data URIs from `index.html`, and added static HTML pre-rendering with automated sitemap generation (`scripts/prerender.js`, `scripts/generate-sitemap.js`).
- **Database & RLS Security Hardening:** Formulated and enforced PostgreSQL Row Level Security (RLS) policies on Supabase tables to ensure strict isolation between public visitor queries and administrative operations.

## Scale & metrics
- **Lines of Code:** ~17,700+ lines in main frontend (`13,718` TSX, `2,249` CSS, `1,124` TS across 126 source files).
- **Commits count:** 67 commits across project history.
- **Pages & Modules:** 8 dedicated page routes (`HomePage`, `Dashboard`, `ProjectsPage`, `ProjectFullPage`, `Login`, etc.) and 7 modular feature domains (`admin`, `articles`, `dashboard`, `landing`, `profiles`, `projects`, `reviews`).

## Status & links
- **Repository URL:** https://github.com/El8dev/Elite.git
- **Public Domain / Branding:** EL8 collective (Contact: `el8dev@gmail.com`, GitHub: `@el8dev`).
- **Documentation:** Full technical history, benchmarks, and performance logs documented in `agent_dev_log.md` and `README.md`.

## Suggested CV bullets
- Co-developed a responsive bilingual agency platform and client portal with React 18, TypeScript, and Supabase, collaborating in a two-person engineering team.
- Resolved GPU rendering bottlenecks by optimizing compositor fill-rates, extracting runtime SVG payloads, and throttling animated canvas particles to achieve stable 60–120 FPS scrolling.
- Hardened database security by implementing PostgreSQL Row Level Security (RLS) policies and authentication flows across administrative and client portals.
- Spearheaded critical rendering path optimizations, reducing initial document payload bloat and code-splitting secondary telemetry and modal dialogs.
