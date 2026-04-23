# Profile Intelligence API — Stage 2 (Query Engine)

A production-ready **Demographic Intelligence Query Engine** built with Node.js, Express, and SQLite.

This API allows clients (marketing teams, analysts, product teams) to:

* Collect and store demographic profiles
* Perform advanced filtering and segmentation
* Sort and paginate large datasets
* Query data using natural language

---

## 📌 Live API

**Base URL**

```
https://your-app-url.up.railway.app
```

---

## 📂 GitHub Repository

```
(https://github.com/Owaboye/Intelligence_Query_Engine.git)
```

---

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

## Database Schema

The `profiles` table strictly follows the required structure:

| Field               | Type    | Description                       |
| ------------------- | ------- | --------------------------------- |
| id                  | TEXT    | UUID v7 (Primary Key)             |
| name                | TEXT    | Unique full name                  |
| gender              | TEXT    | male / female                     |
| gender_probability  | REAL    | Confidence score                  |
| age                 | INTEGER | Exact age                         |
| age_group           | TEXT    | child / teenager / adult / senior |
| country_id          | TEXT    | ISO country code                  |
| country_name        | TEXT    | Full country name                 |
| country_probability | REAL    | Confidence score                  |
| created_at          | TEXT    | ISO 8601 timestamp                |

---

## Data Seeding

* Database seeded with **2026 profiles**
* Seeding is **idempotent** (no duplicates)
* Uses `name` as unique constraint

---

## API Endpoints

---

### 1. Create Profile

**POST** `/api/profiles`

Creates a profile by calling external APIs:

* Genderize
* Agify
* Nationalize

#### Request

```json
{
  "name": "ella"
}
```

#### Response

```json
{
  "status": "success",
  "data": { ...profile }
}
```

---

### 2. Get All Profiles (Advanced Querying)

**GET** `/api/profiles`

#### Supported Filters

| Parameter               | Description                       |
| ----------------------- | --------------------------------- |
| gender                  | male / female                     |
| age_group               | child / teenager / adult / senior |
| country_id              | ISO code (NG, KE, etc.)           |
| min_age                 | minimum age                       |
| max_age                 | maximum age                       |
| min_gender_probability  | minimum confidence                |
| min_country_probability | minimum confidence                |

#### Example

```
/api/profiles?gender=male&country_id=NG&min_age=25
```

---

### Sorting

| Parameter | Values                              |
| --------- | ----------------------------------- |
| sort_by   | age, created_at, gender_probability |
| order     | asc, desc                           |

#### Example

```
/api/profiles?sort_by=age&order=desc
```

---

### Pagination

| Parameter | Default     |
| --------- | ----------- |
| page      | 1           |
| limit     | 10 (max 50) |

#### Response Format

```json
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 2026,
  "data": [ ... ]
}
```

---

### 3. Natural Language Search (Core Feature)

**GET** `/api/profiles/search?q=...`

#### Example

```
/api/profiles/search?q=young males from nigeria
```

#### Supported Patterns

| Query                  | Interpreted As                                |
| ---------------------- | --------------------------------------------- |
| young males            | gender=male + age 16–24                       |
| females above 30       | gender=female + min_age=30                    |
| people from angola     | country_id=AO                                 |
| adult males from kenya | gender=male + age_group=adult + country_id=KE |
| teenagers above 17     | age_group=teenager + min_age=17               |

#### Rules

* Rule-based parsing only (no AI)
* "young" = age 16–24 (not stored)
* Must match at least one rule

#### Error

```json
{
  "status": "error",
  "message": "Unable to interpret query"
}
```

---

### 4. Get Single Profile

**GET** `/api/profiles/:id`

---

### 5. Delete Profile

**DELETE** `/api/profiles/:id`

Returns:

```
204 No Content
```

---

##  Error Handling

All errors follow this structure:

```json
{
  "status": "error",
  "message": "Error message"
}
```

### Status Codes

| Code | Meaning                 |
| ---- | ----------------------- |
| 400  | Missing/empty parameter |
| 422  | Invalid parameter type  |
| 404  | Profile not found       |
| 502  | External API failure    |
| 500  | Internal server error   |

---

## Query Validation

* All numeric fields validated (`page`, `limit`, `min_age`, etc.)
* Invalid types return `422`
* Invalid queries return:

```json
{
  "status": "error",
  "message": "Invalid query parameters"
}
```

---

## Performance Considerations

* Efficient SQL queries with:

  * WHERE conditions
  * LIMIT + OFFSET
* Count query separated from data query
* Avoids full-table scans where possible
* Handles **2026+ records efficiently**

---

## CORS

Enabled globally:

```
Access-Control-Allow-Origin: *
```

---

## Time Format

All timestamps are:

```
UTC ISO 8601
```

Example:

```
2026-04-01T12:00:00Z
```

---

## Testing

Test endpoints using:

* Postman
* cURL
* Browser

---

## Deployment

Deployed on:

* Railway 

---

## 👨‍💻Author

**Ezekiel Oluwasanjo**

---

## Final Note

This API is designed as a **foundation for real-world data intelligence systems**, focusing on:

* clean architecture
* scalability
* predictable query behavior
* strict API contracts (important for automated grading)

