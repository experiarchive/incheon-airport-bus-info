# Project Status Handoff Notes
**Date:** 2025-12-07
**Objective:** Incheon Airport Bus & Congestion Info Web App

## 1. Accomplishments (Completed)
- **AdSense Optimization:**
    - Resolved "Invalid Traffic" issues by increasing ad margins (`my-10`), reducing ads per page (max 2), and applying `IntersectionObserver`.
    - Fixed `availableWidth=0` and connection errors.
- **Airport Congestion Feature:** 
    - **UI:** `AirportCongestion.astro` displays real-time departure gate status.
    - **Logic:** Calls `/api/congestion` (Serverless Function).
    - **T1:** Shows Gates 2, 3, 4, 5 (Filtered out 1, 6 per standard).
    - **T2:** Hides section (API does not provide T2 data).
    - **Status:** Mapped to Minutes (Wait Time) + People (Queue Length).
        - **Green (원활):** < 20 min
        - **Yellow (보통):** 20~30 min
        - **Orange (혼잡):** 30~40 min
        - **Red (매우 혼잡):** > 40 min
- **Commercial Facilities Feature (New):**
    - **Goal:** Suggest nearby waiting spots (Cafes) for *Crowded* gates.
    - **Logic:** Calls `/api/facilities`. Matches Gate Entrance (e.g. Near Gate 4 -> Entrance 10) with Facility Location.
    - **Current Status:** **Using Mock Data**.

## 2. Active Issues & Next Steps
- **Commercial Facilities API Key:**
    - The provided API Key works for `Congestion` but returns `Forbidden` for `Commercial Facilities`.
    - **Action Required:** User must apply for **"인천국제공항공사_상업시설 현황"** on Public Data Portal.
    - **Code:** `/api/facilities.js` is already coded to switch from Mock to Live data automatically once the key works. 

## 3. Key Files Structure
- `src/components/AirportCongestion.astro`: Main UI component.
- `src/pages/api/congestion.js`: Proxy for checking wait times.
- `src/pages/api/facilities.js`: Proxy for shop info (contains Mock Data fallback).
- `src/pages/routes/[routeNumber].astro`: Route detail page where components are mounted.

## 4. How to Resume
Ask the agent:
> "Read `handoff_notes.md` and `task.md`. Help me verify if the Commercial Facilities API Key is active."
