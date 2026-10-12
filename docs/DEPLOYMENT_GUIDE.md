# DevNest Labs — Deployment & Production Guide

This guide details instructions for running DevNest Labs locally, building release artifacts, and deploying the application online (including configuring `devnestlabs.shop`).

---

## 1. Local Development Quickstart

### Prerequisites
- Java 21 LTS (`java -version`)
- Apache Maven 3.9+ (`mvn -v`)
- Node.js 20+ & npm 10+ (`node -v`, `npm -v`)
- Google Gemini API Key (`GEMINI_API_KEY`)

### Step 1: Start the Spring Boot Backend
```powershell
cd c:\Inflexion\devnestlabs\backend

# Set your Gemini API Key (Optional; defaults to configured key in application.yml or offline engine)
$env:GEMINI_API_KEY="AIzaSy..."

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

```powershell
# Build backend image
docker build -t devnest-backend:latest ./backend

# Build frontend image
docker build -t devnest-frontend:latest ./frontend
```
Run containers with environment variable:
```powershell
docker run -d -p 8080:8080 -e GEMINI_API_KEY="AIzaSy..." devnest-backend:latest
```

---

## 4. Database Migration: Switching from SQLite to MySQL

DevNest Labs uses Spring Data JPA entities, meaning switching from SQLite to a production MySQL instance requires **zero Java code changes**.

### Step 1: Add MySQL Driver Dependency to `backend/pom.xml`
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Step 2: Configure Environment Variables in `application.yml` or Production Shell
```powershell
# Set database environment variables:
$env:DB_URL="jdbc:mysql://<your-mysql-host>:3306/devnest_db?useSSL=true&serverTimezone=UTC"
$env:DB_DRIVER="com.mysql.cj.jdbc.Driver"
$env:DB_DIALECT="org.hibernate.dialect.MySQLDialect"
$env:SPRING_DATASOURCE_USERNAME="devnest_user"
$env:SPRING_DATASOURCE_PASSWORD="secure_mysql_password"
```

Spring Boot will automatically connect to MySQL, create/update the `users` table via Hibernate (`ddl-auto: update`), and use MySQL seamlessly.

