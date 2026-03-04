# Database Schema: PerformanceLab

## Overview

All data is stored in a MySQL database named `performancelab`. The schema has four tables: `users`, `habits`, `habit_logs`, and `workouts`.

---

## Entity Relationship Diagram

```
users
  │
  ├──< habits ──< habit_logs
  │
  └──< workouts
```

---

## Tables

### `users`

Stores registered user accounts.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Used as login identifier |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt hash, never plaintext |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | |

```sql
CREATE TABLE users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)    NOT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  created_at    DATETIME        NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);
```

---

### `habits`

Stores habit definitions created by a user.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | |
| `user_id` | INT UNSIGNED | NOT NULL, FK → users.id | |
| `name` | VARCHAR(255) | NOT NULL | e.g. "Morning run" |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | |

```sql
CREATE TABLE habits (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  name       VARCHAR(255)  NOT NULL,
  created_at DATETIME      NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT fk_habits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### `habit_logs`

Records each day a habit was marked complete.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | |
| `habit_id` | INT UNSIGNED | NOT NULL, FK → habits.id | |
| `date` | DATE | NOT NULL | The day the habit was completed |
| `completed` | TINYINT(1) | NOT NULL, DEFAULT 1 | 1 = done |

```sql
CREATE TABLE habit_logs (
  id        INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  habit_id  INT UNSIGNED  NOT NULL,
  date      DATE          NOT NULL,
  completed TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_habit_log_day (habit_id, date),
  CONSTRAINT fk_habit_logs_habit FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);
```

---

### `workouts`

Stores individual exercise sets logged by a user.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | INT UNSIGNED | PRIMARY KEY, AUTO_INCREMENT | |
| `user_id` | INT UNSIGNED | NOT NULL, FK → users.id | |
| `exercise` | VARCHAR(255) | NOT NULL | e.g. "Squat" |
| `reps` | INT UNSIGNED | NOT NULL | Number of repetitions |
| `weight` | DECIMAL(6,2) | NOT NULL, DEFAULT 0 | Weight in lbs or kg |
| `created_at` | DATETIME | NOT NULL, DEFAULT NOW() | |

```sql
CREATE TABLE workouts (
  id         INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED   NOT NULL,
  exercise   VARCHAR(255)   NOT NULL,
  reps       INT UNSIGNED   NOT NULL,
  weight     DECIMAL(6,2)   NOT NULL DEFAULT 0,
  created_at DATETIME       NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT fk_workouts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Relationships Summary

| Relationship | Type | Notes |
|---|---|---|
| `users` → `habits` | One-to-many | A user can have many habits |
| `habits` → `habit_logs` | One-to-many | Each habit can be logged many days |
| `users` → `workouts` | One-to-many | A user can log many workout sets |

Cascading deletes are set so removing a user removes all their habits, logs, and workouts.

---

## Full Schema (single script)

```sql
CREATE DATABASE IF NOT EXISTS performancelab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE performancelab;

CREATE TABLE users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  email         VARCHAR(255)    NOT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  created_at    DATETIME        NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);

CREATE TABLE habits (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  name       VARCHAR(255)  NOT NULL,
  created_at DATETIME      NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT fk_habits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE habit_logs (
  id        INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  habit_id  INT UNSIGNED  NOT NULL,
  date      DATE          NOT NULL,
  completed TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_habit_log_day (habit_id, date),
  CONSTRAINT fk_habit_logs_habit FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

CREATE TABLE workouts (
  id         INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED   NOT NULL,
  exercise   VARCHAR(255)   NOT NULL,
  reps       INT UNSIGNED   NOT NULL,
  weight     DECIMAL(6,2)   NOT NULL DEFAULT 0,
  created_at DATETIME       NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id),
  CONSTRAINT fk_workouts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
