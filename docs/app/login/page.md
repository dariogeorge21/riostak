# Login Page (`/login`)

## Overview

The `/login` route serves as the restricted entry portal for RIOSTAK academic secretariat fellows and content curators. It implements table-based username and password authentication verified against the Supabase `admin_users` table using bcrypt hashing.

## Architectural Responsibilities

- **Authentication Protocol:** Table-based verification against `public.admin_users` table with bcrypt hash comparison (`bcrypt.compare`).
- **Session Handling:** Sets an HTTP-only, secure, `SameSite=Lax` session cookie with an HMAC-SHA256 signed session payload and database tracking in `admin_sessions`.
- **Session Redirection:** If an authenticated session is already active upon visiting `/login`, the user is immediately redirected to `/manage`.
- **Accessibility & Compliance:** WCAG 2.2 AA compliant with explicit `<label htmlFor="...">`, `aria-describedby` error associations, keyboard focus-visible gold rings, and no reliance on placeholders alone.

## Default Credentials

- **Username:** `sdc`
- **Password:** `sdc.123`
