# DevNest Labs — REST API Specification

**Base URL:** `/api/v1`  
**Content-Type:** `application/json`  
**Authentication:** Server-side proxy (Client authentication optional for future multi-tenant workspace)

---

## 1. System Health Check

### `GET /health`
Returns the status of the DevNest Labs backend service and Gemini API configuration.

**Response `200 OK`:**
```json
{
  "status": "UP",
  "application": "DevNest Labs Backend",
  "version": "1.0.0",
  "timestamp": "2026-10-12T17:30:00Z",
  "details": {
    "geminiApiConfigured": true,
    "activeModel": "gemini-3.8-flash",
    "javaVersion": "21.0.12.1",
    "uptimeMillis": 128450
  }
}
```

---

## 2. Authentication & User Management

### `POST /auth/signup`
Registers a new developer account into the SQLite database, hashes the password using BCrypt, and returns a signed session JWT token.

**Request Payload:**
```json
{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```
*Constraints:*
- `name`: Required, 2 to 50 characters.
- `email`: Required, valid email format, unique.
- `password`: Required, minimum 6 characters.

**Response `201 Created`:**
```json
{
  "success": true,
  "feature": "auth",
  "message": "Account created successfully",
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Jane Developer",
      "email": "jane@example.com",
      "createdAt": "2026-10-12T17:40:00Z"
    }
  }
}
```

### `POST /auth/login`
Authenticates existing credentials against the SQLite database and returns a signed session JWT token.

**Request Payload:**
```json
{
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "feature": "auth",
  "message": "Signed in successfully",
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Jane Developer",
      "email": "jane@example.com",
      "createdAt": "2026-10-12T17:40:00Z"
    }
  }
}
```

### `GET /auth/me`
Fetches the authenticated user profile using the JWT Bearer token in the request header.

**Headers:**
- `Authorization: Bearer <token>`

**Response `200 OK`:**
```json
{
  "success": true,
  "feature": "auth",
  "message": "User profile retrieved",
  "result": {
    "id": 1,
    "name": "Jane Developer",
    "email": "jane@example.com",
    "createdAt": "2026-10-12T17:40:00Z"
  }
}
```

---

## 3. Explain Code

### `POST /ai/explain`
Analyzes provided source code and returns a structured explanation.

**Request Payload:**
```json
{
  "code": "public int add(int a, int b) { return a + b; }",
  "language": "java",
  "level": "intermediate"
}
```
*Constraints:*
- `code`: Required, 1 to 12,000 characters.
- `language`: String (e.g. `java`, `python`, `javascript`, `go`, `cpp`).
- `level`: `beginner` | `intermediate` | `advanced` (defaults to `intermediate`).

**Response `200 OK`:**
```json
{
  "success": true,
  "feature": "explain",
  "message": "Code explained successfully",
  "result": {
    "summary": "This method computes the arithmetic sum of two integer inputs and returns the result.",
    "steps": [
      "Accepts two integer arguments a and b.",
      "Performs addition using the + operator.",
      "Returns the evaluated integer sum to caller."
    ],
    "keyComponents": [
      "a (int): First addend",
      "b (int): Second addend",
      "return a + b: Computes deterministic addition"
    ],
    "example": "Invocation: add(5, 7)\nReturns: 12",
    "potentialIssues": [
      "Integer overflow if adding values whose sum exceeds Integer.MAX_VALUE"
    ]
  }
}
```

---

## 3. Diagnose & Debug Error

### `POST /ai/debug`
Diagnoses errors, ranks probable causes, and generates corrected code snippets.

**Request Payload:**
```json
{
  "error": "NullPointerException: Cannot invoke 'String.length()' because 'str' is null",
  "code": "public int getLength(String str) { return str.length(); }",
  "language": "java",
  "expectedBehavior": "Should return 0 for null inputs instead of throwing an exception"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "feature": "debug",
  "message": "Error analyzed successfully",
  "result": {
    "errorMeaning": "A NullPointerException occurs when attempting to invoke an instance method on a null reference.",
    "likelyCauses": [
      "1. Parameter 'str' passed as null into getLength()",
      "2. Absence of defensive null checks before dereferencing"
    ],
    "suggestedSolution": "Add a null check returning 0 or default fallback before calling length().",
    "correctedCode": "public int getLength(String str) {\n    if (str == null) return 0;\n    return str.length();\n}",
    "verificationSteps": [
      "Run unit test passing null argument.",
      "Confirm return value is 0 without throwing an exception."
    ],
    "confidenceLevel": "High"
  }
}
```

---

## 4. Generate Documentation

### `POST /ai/document`
Generates structured API documentation (Javadoc, Docstring, or Markdown).

**Request Payload:**
```json
{
  "code": "public int multiply(int a, int b) { return a * b; }",
  "language": "java",
  "format": "javadoc"
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "feature": "document",
  "message": "Documentation generated successfully",
  "result": {
    "summary": "Multiplies two numbers and returns the evaluated product.",
    "parameters": [
      "a (int): The multiplicand",
      "b (int): The multiplier"
    ],
    "returnValue": "int: Product of a and b",
    "exceptions": [
      "ArithmeticException: In case of unhandled overflow"
    ],
    "exampleUsage": "int result = multiply(4, 5); // 20",
    "generatedDocumentation": "/**\n * Multiplies two numbers.\n *\n * @param a The multiplicand\n * @param b The multiplier\n * @return The product of a and b\n */"
  }
}
```
