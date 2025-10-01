# MSK Suggestion Management Dashboard

A small Next.js app for managing musculoskeletal (MSK) suggestions for employees. It reads and writes to Firestore, keeps a lightweight mock auth session in `localStorage`, and leans on Tailwind CSS for styling (including a simple light/dark theme switch). The live build is here: [`https://msk-smd-demo.netlify.app/`](https://msk-smd-demo.netlify.app/).

**Context**: This project was built as a technical task submission for Vitrue Health's full-stack developer role (Stage 2 interview). Task brief: [`https://vitruehealth.notion.site/full-stack-developer-task`](https://vitruehealth.notion.site/full-stack-developer-task)


## User flow and features

The app was designed with user convenience front and centre — quick navigation, fast status updates, and at‑a‑glance summaries. Here's what you'll find:

**Dashboard page (`/`)**

- **Mock sign‑in**: Purely for demonstration. No real auth provider—just pick an email from the list and you're in.
- **Header**: Shows the app title, current user info, a theme toggle (light/dark), and a sign‑out button.
- **Overview cards**: Instant visibility into suggestion stats—total count, pending/in‑progress/completed breakdowns, priority distribution, and source breakdown (VIDA vs admin).
- **Overdue suggestions**: A dedicated card highlights overdue items with a quick‑nav button to jump straight to them.
- **Recent suggestions**: Displays the three most recent suggestions in grid card format. Each card is expandable for quick actions, and there's a "Show All (6)" button to see more without leaving the page.
- **Responsive grid**: Cards collapse to a single column on mobile for easy scrolling.
- **Side navigation**: Clean nav bar for switching between Dashboard and All Suggestions. Collapses to a hamburger menu on smaller screens.

**Suggestions page (`/suggestions`)**

- **Search and filter**: The "Search All" input searches across employee names, descriptions, status, and priority. Dropdown filters narrow results by Employee, Status, or Priority.
- **Results counter**: Quick reference showing how many suggestions are displayed out of the total.
- **View toggle**: Switch between table and grid card views depending on your preference.
- **Create suggestion**: Button to add a new suggestion (saved directly to Firestore).
- **Overdue toggle**: Show or hide overdue suggestions on demand.
- **Table features** (desktop/tablet):
  - Horizontal scrolling with the first two columns frozen in place.
  - Sortable "Last Updated" column.
  - Clickable employee name opens an **Employee Drawer** showing all suggestions for that person, with inline update buttons for quick status changes.
  - Clickable description opens a **Suggestion Detail Modal** with full info and a status update button.
  - Category, source (VIDA/admin), and sortable status/priority columns.
  - Action button at the end of each row for additional operations.
- **Mobile view**: Suggestions collapse into expandable single‑column grid cards with all the features above (except sortability).

**Stretch ideas** (thought about, not yet implemented)

- Sortability for grid cards on mobile.
- Auto‑archiving dismissed suggestions after a specified retention period.
- Microanimations


## Getting started

I used Node 20.18.0 locally (same as Netlify’s deploy env). If you have `asdf`/`nodenv`/`nvm`, that’ll make life easier.

1) Install dependencies

```bash
npm ci
```

2) Set environment variables

The app expects Firebase client config as public env vars so it can talk to Firestore from the browser. Create a `.env.local` in `msk_suggestion_management_dashboard` with values that point at the Firebase project:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

3) Run the dev server

```bash
npm run dev
```

Then visit `http://localhost:3000`.

4) Build and serve locally (optional)

```bash
npm run build && npm start
```

5) Tests

```bash
npm test
```


## Assumptions I made

- Authentication is simulated. There’s no real identity provider; I’m persisting a mock admin user in `localStorage`. It’s fine for a prototype, not for production. You can sign in as any of:
  - `hsmanager@company.com`
  - `admin@company.com`
  - `viewer@company.com`
  (These are defined in `src/services/authService.ts`.)
- Firestore is the single source of truth for `employees` and `suggestions`. No server layer sits in front of it. That means the browser has direct access to the Firebase project, which may be acceptable for demo purposes but would likely need rules tightened carefully.
- Dates are stored in Firestore as `Timestamp` and normalised to ISO strings for UI state. This may suggest a future need for a consistent serialiser/deserialiser and stricter typing if features are broadened.
- The app doesn’t handle multi-tenant concerns or role-based row-level security in Firestore; read/write security relies on client permissions and Firestore rules I applied on this project. For a real deployment, I’d put a minimal API layer in front.
- Netlify is used for hosting. The repo includes `netlify.toml` and the `@netlify/plugin-nextjs`. Publishing directory is `.next`. It appears to work well enough for a static-friendly Next.js app with client-side Firebase calls.

### Seeding sample data

To populate Firestore with sample employees and suggestions for testing, I created a seeding script and a temporary UI button:

- **Seed script** (`src/scripts/seedData.ts`): Reads from `expanded_sample_data.json` and writes employees and suggestions to Firestore. It's clever enough to check for existing employees and map them to suggestions, so you won't get duplicates if you run it twice.
- **Temporary UI button** (`src/components/SeedDataButton.tsx`): I added this to the dashboard during development so I could seed data with a single click rather than running a script manually. It calls the seed function and shows success/error messages. Handy for demos, though you'd probably remove it in production.

### How I used it:
1. I made sure the Firebase config was set up correctly in `.env.local`.
2. Added the `SeedDataButton` anywhere in the UI, clicked the "Seed Sample Data" button once.

However, thinking back, I could have alternatively, ran it from the browser console or created a runner script and imported the `seedFirestoreData()` function and ran it from the command line using NodeJS but I just wanted to create something user friendly and less technical.

To clear data, the easiest route is via the Firebase Console (Firestore Database → delete collections). The seed script will detect existing employees and avoid duplication.


### How it’s put together (architecture)

I kept things predictable and, hopefully, easy to navigate.

- **Next.js (App Router)**: The entry point is `src/app/page.tsx`, which renders `src/components/App.tsx`. There’s also `src/app/suggestions/page.tsx` for the table-first view and a simple `src/app/login/page.tsx` that reuses the same `LoginScreen`.
- **State and theming**: A tiny `ThemeContext` in `src/contexts/ThemeContext.tsx` manages light/dark, syncing a `dark` class on `html`. It’s intentionally simple—no CSS-in-JS, just Tailwind classes and a handful of helpers in `src/utils/themeClasses.ts`.
- **Data model**: Types live in `src/types/index.ts` (`Employee`, `Suggestion`, and a `SuggestionWithEmployee` for display).
- **Data access**: `src/lib/firebase.ts` initialises Firebase using public env vars. Services talk to Firestore directly:
  - `src/services/employeeService.ts` reads `employees`.
  - `src/services/suggestionService.ts` handles reads/writes for `suggestions` and exposes convenience helpers (e.g. `getSuggestionsWithEmployees`, `updateSuggestionStatus`). Timestamps are converted to ISO strings for rendering.
- **Auth (mocked)**: `src/services/authService.ts` exposes three mocked users and a `mockSignIn(email)` method. The session sits in `localStorage` for 24 hours. Permissions are just string flags checked client-side.
- **UI composition**: `src/components` contains the `DashboardLayout`, `DashboardPage`, `SuggestionTable`, and modal components (`SuggestionDetailModal`, `CreateSuggestionModal`, `StatusUpdateModal`). The table handles filtering, sorting, and status updates via the service.
- **Tooling**: Tailwind v4, Next 15, React 19. Jest + Testing Library are set up with a basic config. ESLint and Prettier guard the edges.

### Why this shape (with a few caveats - self critique/reflection)

- By keeping the backend helper code simple and well-typed, I made it easy to test. Any extra behaviour, like showing instant feedback, happens in the UI instead. That should make the system easier to grow over time.
- Client‑side Firebase keeps infra light and iteration quick. It also pushes security and validation to Firestore rules, which is okay for a demo but, I’ll be honest, can get hairy for anything sensitive. A tiny Next.js API layer may be a better middle ground if audit trails and stricter validation is needed.
- Types are explicit enough to stop common mistakes (e.g. status/priority unions). That said, timestamp handling could be tightened so we don’t sprinkle conversions around the codebase.
- The mock auth is intentionally unsophisticated. It avoids the cognitive and operational overhead of OAuth for this exercise, while making permission checks visible and testable.

Local data expectations

- Firestore collections expected:
  - `employees` (documents with fields matching `Employee`)
  - `suggestions` (documents matching `Suggestion`; `dateCreated`/`dateUpdated` as `Timestamp`)



Deployment notes

- The site is deployed to Netlify at [`https://msk-smd-demo.netlify.app/`](https://msk-smd-demo.netlify.app/).
- `netlify.toml` pins Node to 20.18.0 and uses `@netlify/plugin-nextjs`. Build command is `npm run build`, publish dir is `.next`.
- You’ll want to set the same Firebase env vars in your Netlify site settings (as public env set for the build). The app reads them client‑side.

Possible next steps (if I had another afternoon)

- Add a minimal `app/api` layer for suggestion mutations to centralise validation, rate limiting, and audit logging.
- Wrap Firestore date conversions in a small utility so services return consistent types.
- Add pagination or infinite scrolling to `SuggestionTable`—it’s currently fine for small datasets.
- Introduce proper auth (e.g. Firebase Auth or Auth0) and mirror permissions in Firestore rules.
- Snapshot tests for modals and a couple of service integration tests using the Firebase emulator.

Known trade‑offs

- Client‑only data access is convenient but may expose too much unless Firestore rules are carefully locked down.
- Mock auth means no true user identity; auditability is limited.
- Some UI components are chunky on purpose to keep files co‑located; if this grows, I’d split logic/hooks out.



## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **Database**: Firebase Firestore
- **Authentication**: Mock authentication system
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 20.18.0 (matches deploy environment)
- npm or yarn
- Firebase project with Firestore enabled

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd msk_suggestion_management_dashboard
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy your Firebase config to `.env.local`:

```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Seed Sample Data

Option A (UI): Temporarily add `SeedDataButton` to `DashboardPage` and click "Seed Sample Data" once, then remove it.

Option B (script): Call `seedFirestoreData()` from the browser console or a tiny Node script after importing from `src/scripts/seedData.ts`.

## 🔐 Demo Credentials

Mock authentication is email‑only for the demo. Use any of:

- `hsmanager@company.com`
- `admin@company.com`
- `viewer@company.com`

## 🏗️ Project Structure

```
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── page.tsx
│   └── suggestions/
│       └── page.tsx
├── components/
│   ├── App.tsx
│   ├── CreateSuggestionModal.tsx
│   ├── DashboardLayout.tsx
│   ├── DashboardOverview.tsx
│   ├── DashboardPage.tsx
│   ├── EmployeeDrawer.tsx
│   ├── Header.tsx
│   ├── LoginScreen.tsx
│   ├── PermissionGuard.tsx
│   ├── RecentSuggestions.tsx
│   ├── SeedDataButton.tsx
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   ├── StatusUpdateModal.tsx
│   ├── SuggestionCard.tsx
│   ├── SuggestionDetailModal.tsx
│   ├── SuggestionTable.tsx
│   ├── SuggestionTableData.tsx
│   ├── ThemeToggle.tsx
│   ├── Toast.tsx
│   └── ui/
│       ├── Badges.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       └── SvgIcons.tsx
├── contexts/
│   └── ThemeContext.tsx
├── hooks/
│   └── useSuggestions.ts
├── lib/
│   └── firebase.ts
├── scripts/
│   └── seedData.ts
├── services/
│   ├── __tests__/
│   │   └── suggestionService.integration.test.ts
│   ├── authService.ts
│   ├── employeeService.ts
│   └── suggestionService.ts
├── types/
│   └── index.ts
└── utils/
    ├── __tests__/
    │   ├── currency.test.ts
    │   ├── dates.test.ts
    │   └── filters.test.ts
    ├── animations.ts
    ├── currency.ts
    ├── dates.ts
    ├── filters.ts
    └── themeClasses.ts
```

