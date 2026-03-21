# kafkaboard-ui

React frontend for the `kafkaboard` Spring Boot backend. It provides a single-page dashboard for Kafka cluster management, real-time consumer lag monitoring, topic operations, message browsing, and cluster health visibility.

## Screenshots
- `docs/screenshots/login.png` placeholder
- `docs/screenshots/dashboard.png` placeholder
- `docs/screenshots/consumer-groups.png` placeholder

## Features
- JWT login, register, refresh token, and logout flow
- Multi-cluster sidebar with persisted cluster records
- Cluster health overview and topic CRUD
- Real-time consumer group lag via WebSocket
- Lag history charts powered by Recharts
- Latest topic messages viewer
- Dark mode support

## Setup
1. Install dependencies:
```bash
npm install
```
2. Copy the environment file:
```bash
cp .env.example .env
```
3. Update `VITE_API_BASE_URL` if needed.
4. Start the development server:
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Docker
Build the image:
```bash
docker build -t kafkaboard-ui .
```

Run the container:
```bash
docker run -p 5173:80 kafkaboard-ui
```

You can also use:
```bash
docker-compose up --build
```

## Environment Variables
| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL of the Spring Boot backend | `http://localhost:8080` |

## Notes
- Nginx is configured for SPA routing with `try_files`.
- The Docker image serves the production build from Nginx on port `80`.
