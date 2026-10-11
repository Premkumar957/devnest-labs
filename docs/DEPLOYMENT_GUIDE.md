# DevNest Labs — Deployment & Production Guide

This guide details instructions for running DevNest Labs locally, building release artifacts, and deploying the application online (including configuring `devnestlabs.shop`).

---

## 1. Local Development Quickstart

### Prerequisites
- Java 21 LTS (`java -version`)
- Apache Maven 3.9+ (`mvn -v`)
- Node.js 20+ & npm 10+ (`node -v`, `npm -v`)
- Optional: Anthropic Claude API Key (`ANTHROPIC_API_KEY`)

### Step 1: Start the Spring Boot Backend
```powershell
cd c:\Inflexion\devnestlabs\backend

# Set your Anthropic API Key (Optional; offline engine runs if omitted)
$env:ANTHROPIC_API_KEY="sk-ant-api03-..."

# Run Spring Boot
mvn spring-boot:run
```
The backend starts at: `http://localhost:8080` (Verify with `GET http://localhost:8080/api/v1/health`).

### Step 2: Start the React Vite Frontend
In a new terminal window:
```powershell
cd c:\Inflexion\devnestlabs\frontend
npm run dev
```
The frontend starts at: `http://localhost:5173`. Open in your browser!

---

## 2. Production Artifact Build

### Backend JAR Packaging
```powershell
cd c:\Inflexion\devnestlabs\backend
mvn clean package -DskipTests=false
```
Produces: `backend/target/devnest-backend-1.0.0.jar`.
Run production JAR:
```powershell
java -jar backend/target/devnest-backend-1.0.0.jar
```

### Frontend Production Build
```powershell
cd c:\Inflexion\devnestlabs\frontend
npm run build
```
Produces production bundle in: `frontend/dist/`.

---

## 3. Containerized Deployment (Docker)

### Dockerfile for Backend (`backend/Dockerfile`)
```dockerfile
FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
ARG JAR_FILE=target/devnest-backend-1.0.0.jar
COPY ${JAR_FILE} app.jar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
```

### Dockerfile for Frontend (`frontend/Dockerfile`)
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 4. Deploying Online & Domain Setup (`devnestlabs.shop`)

### Architecture on Cloud (e.g. Railway / Render / AWS)
1. **Frontend Hosting:** Host `frontend/dist` on Vercel, Netlify, or Cloudflare Pages.
   - Environment Variable: `VITE_API_URL=https://api.devnestlabs.shop/api/v1`
2. **Backend Hosting:** Deploy Spring Boot JAR or Docker container to Render, Railway, or AWS Elastic Beanstalk.
   - Environment Variables:
     - `ANTHROPIC_API_KEY=sk-ant-...`
     - `CLAUDE_MODEL=claude-3-5-sonnet-20241022`
     - `devnest.cors.allowed-origins=https://devnestlabs.shop,https://www.devnestlabs.shop`
3. **DNS Configuration for `devnestlabs.shop`:**
   - CNAME `www` -> Points to Vercel/Netlify host
   - A Record `@` -> Points to frontend hosting IP
   - CNAME `api` -> Points to backend service host (e.g. `devnest-backend.up.railway.app`)
4. **SSL / HTTPS:** Enable automatic Let's Encrypt certificates on Vercel/Render.
