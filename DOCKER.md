# 🐳 Docker Deployment Guide

## Quick Start

### 1. Create Environment File

Create a `.env` file in the project root for docker-compose:

```bash
cat > .env << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_DEFAULT_TABLE_ID=TAKEAWAY
EOF
```

### 2. Build and Run with Docker Compose

```bash
# Build and start the container
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f pos-frontend

# Stop containers
docker-compose down
```

---

## Manual Docker Build

### Build Image

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080 \
  --build-arg NEXT_PUBLIC_DEFAULT_TABLE_ID=TAKEAWAY \
  -t pos-frontend:latest .
```

### Run Container

```bash
docker run -d \
  --name pos-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8080 \
  -e NEXT_PUBLIC_DEFAULT_TABLE_ID=TAKEAWAY \
  pos-frontend:latest
```

### View Logs

```bash
docker logs -f pos-frontend
```

### Stop Container

```bash
docker stop pos-frontend
docker rm pos-frontend
```

---

## Production Deployment

### 1. Create Production Environment File

```bash
cat > .env << EOF
NEXT_PUBLIC_API_URL=https://api.yourrestaurant.com
NEXT_PUBLIC_DEFAULT_TABLE_ID=TAKEAWAY
EOF
```

### 2. Build for Production

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.yourrestaurant.com \
  --build-arg NEXT_PUBLIC_DEFAULT_TABLE_ID=TAKEAWAY \
  -t pos-frontend:production .
```

### 3. Push to Registry (Optional)

```bash
# Tag for your registry
docker tag pos-frontend:production your-registry.com/pos-frontend:latest

# Push to registry
docker push your-registry.com/pos-frontend:latest
```

---

## Environment Variables

| Variable                       | Required       | Default                 | Description              |
| ------------------------------ | -------------- | ----------------------- | ------------------------ |
| `NEXT_PUBLIC_API_URL`          | ✅ Yes         | `http://localhost:8080` | Backend API base URL     |
| `NEXT_PUBLIC_DEFAULT_TABLE_ID` | ⚠️ Recommended | `TAKEAWAY`              | Default table for orders |
| `PORT`                         | ❌ No          | `3000`                  | Container port           |
| `NODE_ENV`                     | ❌ Auto        | `production`            | Node environment         |

---

## Troubleshooting

### Issue: Build fails with "pnpm-lock.yaml not found"

**Solution**: Make sure `.dockerignore` doesn't block lock files. Check that lines 6-7 are commented:

```dockerignore
# Note: Lock files are needed for Docker builds
# pnpm-lock.yaml
# package-lock.json
```

### Issue: Container starts but can't connect to backend

**Solution**:

- Use `host.docker.internal` instead of `localhost` on Mac/Windows
- Or use Docker network to connect containers

```bash
# For Mac/Windows
NEXT_PUBLIC_API_URL=http://host.docker.internal:8080

# Or use container name if backend is also in Docker
NEXT_PUBLIC_API_URL=http://pos-backend:8080
```

### Issue: Changes not reflected in build

**Solution**: Clear Docker cache and rebuild

```bash
docker-compose down
docker system prune -f
docker-compose up --build --force-recreate
```

---

## Multi-Container Setup (Frontend + Backend)

If you have both frontend and backend containerized:

```yaml
# docker-compose.yml
version: "3.8"

services:
  pos-backend:
    image: your-backend-image:latest
    container_name: pos-backend
    ports:
      - "8080:8080"
    networks:
      - pos-network

  pos-frontend:
    build:
      context: .
      args:
        NEXT_PUBLIC_API_URL: http://pos-backend:8080
    container_name: pos-frontend
    ports:
      - "3000:3000"
    depends_on:
      - pos-backend
    networks:
      - pos-network

networks:
  pos-network:
    driver: bridge
```

---

## Health Check

Add to `docker-compose.yml`:

```yaml
services:
  pos-frontend:
    # ... other config
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--quiet",
          "--tries=1",
          "--spider",
          "http://localhost:3000",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## Docker Commands Cheat Sheet

```bash
# Build
docker-compose build
docker-compose build --no-cache  # Force rebuild

# Start
docker-compose up
docker-compose up -d             # Background

# Stop
docker-compose stop
docker-compose down              # Remove containers
docker-compose down -v           # Remove containers + volumes

# Logs
docker-compose logs
docker-compose logs -f           # Follow logs
docker-compose logs -f pos-frontend  # Specific service

# Execute commands
docker-compose exec pos-frontend sh
docker-compose exec pos-frontend pnpm --version

# Rebuild specific service
docker-compose up -d --build pos-frontend
```

---

## Access Application

After starting the container:

- **Application**: http://localhost:3000
- **Menu**: http://localhost:3000/menu
- **Login**: http://localhost:3000/login

---

## Notes

- The Dockerfile uses **multi-stage builds** for optimal image size
- The final image runs as a **non-root user** for security
- **Standalone output** is enabled in `next.config.js` for optimal Docker performance
- Lock files are **required** and should not be in `.dockerignore`
