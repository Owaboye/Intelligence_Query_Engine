# Intelligence Query Engine

## Project Overview

This project extends a basic profile API into a **Queryable Intelligence Engine**.

It integrates external APIs to enrich user data and provides powerful querying capabilities over a structured dataset.

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* SQLite (better-sqlite3)
* Axios
* UUID v7

---


## Base URL:
(URL:)[https://intelligencequeryengine-production-16a0.up.railway.app]

## Installation
- npm install
- npm run dev

### 4. API Endpoints

```
- POST /api/profiles
- GET /api/profiles
- GET /api/profiles/:id
- DELETE /api/profiles/:id
- GET /api/profiles/search?q=
```

### 5. Features

```
- Filtering
- Sorting
- Pagination
- Natural Language Query Parsing
- SQLite persistence
```

---

### 6. Example request

```
GET https://intelligencequeryengine-production-16a0.up.railway.app/api/profiles/search?q=young males from nigeria
```
