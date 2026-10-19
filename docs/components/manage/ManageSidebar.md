# ManageSidebar Component (`components/manage/ManageSidebar.tsx`)

## Overview

A responsive sidebar navigation tailored for administrative management under Swiss Modernist aesthetics.

## Props Contract

| Prop | Type | Description |
| :--- | :--- | :--- |
| `activeTab` | `"blogs" \| "courses"` | Current active management section. |
| `onSelectTab` | `(tab: ManageTab) => void` | Tab change callback. |
| `user` | `AdminUser` | Authenticated session user object. |
| `blogCount` | `number` | Count of registered blog monographs. |
| `courseCount` | `number` | Count of registered course curricula. |

## Interactive Behaviors

- **Active Highlighting:** High-contrast navy container with gold icons.
- **Counter Badges:** Displays live totals for each entity.
- **Sign Out Form:** Invokes `logoutAction` server action to invalidate session and clear HTTP-only cookie.
