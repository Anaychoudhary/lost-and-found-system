# Lost & Found Buddy

Lost & Found Buddy is a campus lost-and-found application. Students can report lost and found items, browse and filter listings, track item status, and review suggested matches.

## Features

- Dashboard with lost, found, and recovered item totals
- Create and browse lost and found item reports
- Filter reports by keyword, category, and status
- Update item status and remove reports
- Smart matching suggestions for lost and found items

## Tech stack

- **Frontend:** React, TypeScript, Vite, Bootstrap
- **Backend:** Java 21, Spring Boot, Spring Data JPA
- **Database:** MySQL

## Prerequisites

- Java 21
- Node.js and npm
- MySQL

## Run locally

### 1. Configure MySQL and the backend

Create the database used by the backend:

```sql
CREATE DATABASE lost_found_db2;
```

Copy the example configuration and replace its placeholder values with your local MySQL username and password. Keep this local file private; it is excluded from Git.

PowerShell:

```powershell
cd lostfound
Copy-Item application-local.properties.example application-local.properties
```

Edit `lostfound/application-local.properties`, then start the backend from the `lostfound` directory:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs at `http://localhost:8080`. The Maven Wrapper is included.

### 2. Start the frontend

In a second terminal:

```powershell
cd Frontend
npm ci
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The frontend uses `http://localhost:8080/api/v1` by default. To use a different backend URL, set `VITE_API_BASE_URL` before starting or building the frontend.

## Tests and production build

Run frontend tests and build:

```powershell
cd Frontend
npm test
npm run build
```

Run backend tests from the `lostfound` directory:

```powershell
.\mvnw.cmd test
```

## API

The backend API is rooted at `/api/v1` and provides dashboard statistics, lost-item reports, found-item reports, and smart matches.

## Project layout

```text
Frontend/   React and TypeScript application
lostfound/  Spring Boot REST API and MySQL persistence
```
