# SUB-2 Half Marathon Coach

Personal adaptive training tracker for a Nov 8 half marathon (sub-2 stretch goal).

## What it does

- Stores your **15-week plan** (Chicago + Italy constraints baked in)
- Syncs **detailed run stats** from Strava (distance, pace, HR, elevation, splits, calories)
- Matches runs to planned sessions and tracks weekly mileage
- Retunes **easy-pace guidance** from recent runs
- Emits **active recommendations** / plan-change signals (hold mileage, ease pace, delay quality, etc.)
- Exports an **.ics calendar** of all planned sessions for Apple/Google Calendar reminders

Works in **seed mode** without Strava (loads runs derived from your recent Apple Fitness history) so the UI is usable immediately.

## Quick start

```bash
cd running-coach
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Click **Sync runs** once to load seed history (or after connecting Strava).

## Connect Strava

1. Create an API app at [https://www.strava.com/settings/api](https://www.strava.com/settings/api)
2. Set Authorization Callback Domain / redirect to your app, e.g. `http://localhost:3000/api/strava/callback`
3. Copy `.env.example` → `.env.local` and fill:

```bash
STRAVA_CLIENT_ID=...
STRAVA_CLIENT_SECRET=...
STRAVA_REDIRECT_URI=http://localhost:3000/api/strava/callback
```

4. Click **Connect Strava** in the UI, then **Sync runs**

Tokens are stored locally in `data/strava-tokens.json` (gitignored).

## Calendar reminders

Click **Add to calendar** or open `/api/calendar` to download `half-marathon-plan.ics`.

Import into Apple Calendar or Google Calendar.

## OpenClaw (optional)

If workouts land as files in OpenClaw drops, you can later point a watcher at those files and POST normalized activities into the same `data/runs.json` store. Strava remains the preferred source of truth for a stable UI.

## Plan source

Edit `data/plan.json` to change weekly mileage, sessions, or pace defaults. The coach engine reads this on every `/api/coach` load.
