# Backend Wizards — Stage 1

# Profile Intelligence API

A RESTful API that builds and stores enriched user profiles by integrating multiple external data sources. The system processes a given name, derives demographic insights, persists the result, and exposes endpoints for retrieval, filtering, and deletion.

---

## Features
* Integrates with 3 external APIs:
  * Gender prediction
  * Age estimation
  * Nationality prediction

* Applies business logic:
  * Age group classification
  * Most probable nationality selection

* SQLite data persistence
* Idempotent profile creation (no duplicates)
* Filtering support (gender, country, age group)
* Optimized API calls using parallel requests
* Robust error handling with proper HTTP status codes

---
## Tech Stack
* Node.js
* Express.js
* SQLite
* Axios
* UUID (v7)
* CORS
---

## Project Structure
```
src/
│
├── controllers/       # Handles request & response
├── services/          # Business logic & API integration
├── database/          # SQLite connection & queries
├── routes/            # API route definitions
├── index.js           # App entry point
```
---

## 🌐 External APIs Used
* https://api.genderize.io
* https://api.agify.io
* https://api.nationalize.io

---
## Setup Instructions
### 1. Clone Repository
```bash
git clone https://github.com/Owaboye/Profile_Intelligence_API.git
cd YOUR_REPO
```
### 2. Install Dependencies

```bash
npm install
```

### 3. Start Server

```bash
node index.js
```

Server runs on:

```
http://localhost:4000
```
---

## API Endpoints

### 1. Create Profile

**POST** `/api/profiles`

#### Request Body

```json
{
  "name": "ella"
}
```

#### Response (201)

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "ella",
    "gender": "female",
    "gender_probability": 0.99,
    "sample_size": 1234,
    "age": 46,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85,
    "created_at": "2026-04-01T12:00:00Z"
  }
}
```

#### Duplicate Case (200)

```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": { ... }
}
```

---

### 2. Get All Profiles

**GET** `/api/profiles`

#### Optional Query Params

* `gender`
* `country_id`
* `age_group`

Example:

```
/api/profiles?gender=male&country_id=NG
```
---

### 3. Get Profile by ID

**GET** `/api/profiles/:id`

---

### 4. Delete Profile

**DELETE** `/api/profiles/:id`

Returns:

```
204 No Content
```

---

## ❗ Error Handling

All errors follow this structure:

```json
{
  "status": "error",
  "message": "Error message"
}
```

| Status Code | Description           |
| ----------- | --------------------- |
| 400         | Missing or empty name |
| 422         | Invalid data type     |
| 404         | Profile not found     |
| 502         | External API failure  |
| 500         | Internal server error |

---

##  Business Logic

#### Age Classification

| Age Range | Group    |
| --------- | -------- |
| 0–12      | Child    |
| 13–19     | Teenager |
| 20–59     | Adult    |
| 60+       | Senior   |

#### Nationality Selection

* Selects country with **highest probability**

---

## Idempotency

* The API prevents duplicate profiles
* Same name returns existing record instead of creating a new one

---

## CORS

Enabled for all origins:

```
Access-Control-Allow-Origin: *
```

---

## Testing

You can test using:
* Postman
* Thunder Client
* cURL

Example:
```bash
curl -X POST http://localhost:4000/api/profiles \
-H "Content-Type: application/json" \
-d '{"name": "john"}'
```

---

##  Deployment

This project can be deployed on:

* Railway (recommended)
* Vercel (serverless adaptation required)
* Heroku
* AWS

---

## Submission Details

* API Base URL: https://your-app-domain.com
* GitHub Repo: [https://github.com/Owaboye/Profile_Intelligence_API.git](https://github.com/Owaboye/Profile_Intelligence_API.git)

---

# 👨‍💻 Author

Developed as part of Backend Wizards Assessment (Stage 1)

---

# 🏁 Final Notes

This project demonstrates:

* Clean backend architecture
* Proper API design
* Real-world data processing
* Robust error handling
* Scalable coding practices

---
