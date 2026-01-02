# URL Shortener

A full‑stack URL shortener that lets you create, update, delete, and track short links.  
Backend is built with Spring Boot and MongoDB; frontend is built with React, TypeScript, Vite, and Tailwind CSS.


## 🚀 Live Demo
🔗 **Live URL:** [https://url-shortner-ochre-six.vercel.app](https://url-shortner-ochre-six.vercel.app)


## Features

- Shorten long URLs into compact codes (e.g. `abc123`)
- Redirect from short URL (e.g. `http://your-app.com/abc123`) to the original URL
- Update the destination of an existing short URL
- Delete a short URL
- View access statistics (access count) for each short URL
- Modern UI with copy-to-clipboard and toast notifications
- CORS‑enabled backend for browser clients

---

## Project Structure

```text
URL_SHORTNER/
├─ URL_Shortner_backend/      # Spring Boot + MongoDB backend
│  ├─ pom.xml
│  └─ src/main/java/com/url/shortner/url_shortner/...
│
└─ URL_Shortner_frontend/     # React + TypeScript + Vite frontend
   ├─ package.json
   └─ src/...
```

---

## Tech Stack

**Backend**

- Java 17
- Spring Boot 3 (Web, Data MongoDB)
- MongoDB
- Lombok

**Frontend**

- React + TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Sonner (toast notifications)
- Lucide React icons

---

## Getting Started

### Prerequisites

- **Java 17+**
- **Maven** (for backend)
- **Node.js 18+** (recommended)
- **pnpm** (preferred, as `pnpm-lock.yaml` present)
- A running **MongoDB** instance

---

## Backend Setup (Spring Boot + MongoDB)

1. Go to the backend folder:

   ```bash
   cd URL_Shortner_backend
   ```

2. Configure environment variables:

   - `MONGODB_URL` – MongoDB connection string, e.g.:

     ```bash
     setx MONGODB_URL "mongodb://localhost:27017/url_shortner"
     ```

   - Optional CORS environment variables (used in `CorsConfigs` and `application.properties`):

     - `CORS_ALLOWED_ORIGINS` (default: `http://localhost:5173`)
     - `CORS_ALLOWED_METHODS` (default: `GET,POST,PUT,DELETE,OPTIONS`)

3. Run the backend:

   ```bash
   mvn spring-boot:run
   ```

   By default the app listens on port **8080** and uses a MongoDB collection named `url_info`.

---

## Frontend Setup (React + Vite)

1. Go to the frontend folder:

   ```bash
   cd URL_Shortner_frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure environment variable for the backend URL:

   Create a `.env` file in `URL_Shortner_frontend`:

   ```bash
   echo VITE_BACKEND_URL="http://localhost:8080" > .env
   ```

   The frontend uses this in `src/apiFetch/api.ts` as the Axios `baseURL`.

4. Run the frontend dev server:

   ```bash
   pnpm dev
   ```

   By default, Vite serves the app at `http://localhost:5173`.

---

## How It Works

### Backend Overview

Key backend classes:

- `UrlInfo` (entity): Represents a short URL document in MongoDB:
  - `shortCode` – generated short code, e.g. `abc123`
  - `url` – original URL
  - `accessCount` – how many times the short link was used
  - `createdAt`, `updatedAt` – timestamps (Mongo auditing)

- `UrlInfoDto`: DTO returned to the client (`short_code`, `url`, `createdAt`, `updatedAt`).

- `CodeGeneratorService`:
  - Generates a 6‑character code: 3 lowercase letters + 3 digits, e.g. `abc123`.

- `UrlInfoRepository`:
  - Spring Data MongoDB repository with:
    - `boolean existsByshortCode(String shortCode)`
    - `Optional<UrlInfo> findByshortCode(String shortCode)`

- `UrlInfoService`:
  - `creteUrl(String URL)` – creates a new short URL, ensures no shortCode collisions (retries up to 5 times).
  - `getUrl(String shortCode)` – fetches URL, increments `accessCount`.
  - `updateUrl(String shortCode, String newUrl)` – updates target URL.
  - `deleteUrl(String shortCode)` – deletes a short URL.
  - `getStatsOfUrl(String shortCode)` – returns full `UrlInfo` including `accessCount`.

- `UrlInfoController` (`/shorten`):
  - Validates URLs with `new URL(url).toURI()`.
  - Exposes REST endpoints (see **API Reference**).

- `CorsConfigs`:
  - Reads `app.cors.allowed-origins` and `app.cors.allowed-methods` from properties/env and configures CORS.

---

## API Reference

Base URL: `http://<backend-host>:8080`

### 1. Create Short URL

**POST** `/shorten`

**Request Body (JSON)**:

```json
{
  "url": "https://example.com/very/long/path"
}
```

**Responses:**

- `200 OK` – returns the created short URL details:

  ```json
  {
    "id": "6957802ddb517f06uic6477e",
    "short_code": "abc123",
    "url": "https://example.com/very/long/path",
    "createdAt": "2025-01-01T12:34:56Z",
    "updatedAt": "2025-01-01T12:34:56Z"
  }
  ```

- `400 Bad Request` – if URL is invalid (`"Invalid URL"`).
- `500 Internal Server Error` – on server-side error.

---

### 2. Get Original URL

**GET** `/shorten/{shortCode}`

**Example:**

`GET /shorten/abc123`

**Responses:**

- `200 OK` – returns `UrlInfoDto`:

  ```json
  {
    "id": "6957802ddb517f06uic6477e",
    "short_code": "abc123",
    "url": "https://example.com/very/long/path",
    "createdAt": "2025-01-01T12:34:56Z",
    "updatedAt": "2025-01-02T10:00:00Z"
  }
  ```

- `404 Not Found` – if shortCode does not exist.

> Note: Each successful call increments the `accessCount` for stats.

---

### 3. Update Original URL

**PUT** `/shorten/{shortCode}`

**Request Body (JSON):**

```json
{
  "url": "https://example.com/new/path"
}
```

**Responses:**

- `200 OK` – returns updated `UrlInfoDto`:

```json
  {
    "id": "6957802ddb517f06uic6477e",
    "short_code": "abc123",
    "url": "https://example.com/very/long/path",
    "createdAt": "2025-01-01T12:34:56Z",
    "updatedAt": "2025-01-01T12:34:56Z"
  }
  ```

- `400 Bad Request` – if URL is invalid.
- `404 Not Found` – if shortCode not found (`"Not found"`).

---

### 4. Delete Short URL

**DELETE** `/shorten/{shortCode}`

**Responses:**

- `204 No Content` – success.
- `404 Not Found` – if shortCode does not exist.

---

### 5. Get URL Stats

**GET** `/shorten/{shortCode}/stats`

**Responses:**

- `200 OK` – returns full `UrlInfo` including `accessCount`:

  ```json
  {
    "id": "6957802ddb517f06uic6477e",
    "short_code": "abc123",
    "url": "https://example.com/very/long/path",
    "accessCount": 42,
    "createdAt": "2025-01-01T12:34:56Z",
    "updatedAt": "2025-01-02T10:00:00Z"
  }
  ```

- `404 Not Found` – if shortCode does not exist.

---

## Frontend Behavior

The frontend is a single-page React app using React Router.

### Routes

- `/` – Main UI:
  - Shows a card with:
    - **Action selector** (`Create`, `Update`, `Stats`, `Delete`)
    - Inputs for URL / short URL
    - Primary action button (Get URL / Change / Get Stats / Delete)
    - Copyable short URL box
    - Optional stats display (access count)

- `/:code` – Redirect handler:
  - Extracts `{code}` from the URL.
  - Calls `GET /shorten/{code}` on the backend.
  - If found: `window.location.replace(<original-url>)`.
  - If not found: redirects to `/404`.

### Main Components

- `CardView`:
  - Handles form state and user actions.
  - Calls APIs from `src/apiFetch/api.ts`:
    - `createShortUrl`
    - `updateOriginaltUrl`
    - `deleteShortUrl`
    - `getShortUrlStats`
  - Uses `sonner` to show loading/success/error toasts.

- `CopyBox`:
  - Displays the generated short URL.
  - Copies the URL to clipboard on click, with a “Copy / Copied” label.

- `RedirectHandler`:
  - Handles redirection logic for `/:code` routes.

---

## Environment Variables Summary

**Backend (`URL_Shortner_backend/src/main/resources/application.properties`):**

- `spring.data.mongodb.uri=${MONGODB_URL}`
- `app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:5173}`
- `app.cors.allowed-methods=${CORS_ALLOWED_METHODS:GET,POST,PUT,DELETE,OPTIONS}`

**Frontend (`URL_Shortner_frontend/.env`):**

- `VITE_BACKEND_URL` – backend base URL, e.g. `http://localhost:8080`

---

## Typical Usage Flow

1. Open the frontend (e.g. `http://localhost:5173`).
2. Select **Create Short URL**, enter a long URL, and click **Get URL**.
3. Copy the generated short URL.
4. Share the short URL. When someone visits it, they’ll be redirected to the original URL, and `accessCount` will increment.
5. Use **URL Stats** to see how many times the link was accessed.
6. Use **Change redirect URL** or **Delete URL** to manage existing short links.

## License
- This project is licensed under the MIT License - see the LICENSE file for details.

## Inspiration
- This project was inspired by the URL Shortening Service guide from roadmap.sh.
