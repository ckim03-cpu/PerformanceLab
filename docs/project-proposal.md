# Project Proposal: PerformanceLab

## Project Name
PerformanceLab

## Target Audience
Students, athletes, and professionals who want to track habits, workouts, and personal performance metrics in one place.

## Problem Statement
People track habits, workouts, and productivity across many disconnected apps. There is no simple dashboard that brings daily performance metrics together in one view, making it hard to see patterns, stay consistent, or understand progress over time.

## Value Proposition
PerformanceLab helps users track habits, workouts, and productivity metrics in one simple dashboard so they can improve consistency and performance over time.

---

## MVP Features (Must-Have)

1. **User Accounts** — Users can create an account and log in securely.
2. **Habit Tracking** — Users can create daily habits and mark them complete each day.
3. **Workout Logging** — Users can log workouts with exercise name, reps, and weight.
4. **Performance Dashboard** — Users see a unified dashboard showing their habits and workouts.
5. **API Endpoints** — Frontend communicates with a backend REST API to create and retrieve all data.

## Features NOT Building (Out of Scope for MVP)

- Social sharing or community features
- Mobile app (iOS / Android)
- AI coaching suggestions or smart recommendations
- Push notifications or reminders
- Wearable device integrations (Apple Watch, Fitbit, etc.)

---

## Pages & User Flow

| Page | What It Shows |
|------|--------------|
| **Home** | Landing page explaining the app, CTA to sign up or log in |
| **Login / Signup** | Authentication form for new and returning users |
| **Dashboard** | Overview of recent habits and workouts, quick-add buttons |
| **Habits** | List of all habits; mark complete, add new habits |
| **Workouts** | Log a new workout set; view recent workout history |

**Navigation flow:**
Home → Sign Up / Login → Dashboard → Habits or Workouts (via nav)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Go |
| Database | MySQL |
| Deployment | AWS Lightsail + GitHub Actions |
