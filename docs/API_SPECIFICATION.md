# DevNest Labs — REST API Specification

**Base URL:** `/api/v1`  
**Content-Type:** `application/json`  
**Authentication:** Server-side proxy (Client authentication optional for future multi-tenant workspace)

---

## 1. System Health Check

### `GET /health`
Returns the status of the DevNest Labs backend service and Claude API configuration.

**Response `200 OK`:**
```json
{
  "status": "UP",
  "application": "DevNest Labs Backend",
  "version": "1.0.0",
  "timestamp": "2026-10-11T17:30:00Z",
  "details": {
    "claudeApiConfigured": true,
    "activeModel": "claude-3-5-sonnet-20241022",
    "javaVersion": "21.0.12.1",
    "uptimeMillis": 128450
  }
}
```

---

## 2. Explain Code

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
      "Accepts two integer arguments `a` and `b`.",
      "Performs addition using the `+` operator.",
      "Returns the sum to the caller without mutating inputs."
    ],
    "keyComponents": [
      "Parameters: `a` and `b` are primitive 32-bit signed integers.",
      "Return: primitive int value representing the sum."
    ],
    "example": "add(2, 3) returns 5",
    "potentialIssues": [
      "Integer overflow if the sum exceeds Integer.MAX_VALUE (2,147,483,647)."
    ],
    "markdownContent": "### Summary\n..."
  },
  "timestamp": 1791740000000
}
```

---

## 3. Debug Error

### `POST /ai/debug`
Diagnoses an error stack trace or exception and generates fixes.

**Request Payload:**
```json
{
  "error": "java.lang.NullPointerException: Cannot invoke \"String.length()\" because \"str\" is null",
  "code": "public int getLength(String str) { return str.length(); }",
  "language": "java",
  "expectedBehavior": "Return 0 when string is null"
}
```
*Constraints:*
- `error`: Required, 1 to 6,000 characters.
- `code`: Optional, up to 12,000 characters.
- `language`: String.
- `expectedBehavior`: Optional, up to 2,000 characters.

**Response `200 OK`:**
```json
{
  "success": true,
  "feature": "debug",
  "message": "Error analyzed successfully",
  "result": {
    "errorMeaning": "A NullPointerException occurred because length() was invoked on a null reference.",
    "likelyCauses": [
      "1. (Most likely) `str` parameter passed to getLength was null.",
      "2. Upstream caller did not validate object existence."
    ],
    "suggestedSolution": "Add a defensive check for null before invoking String.length().",
    "correctedCode": "public int getLength(String str) {\n    return str != null ? str.length() : 0;\n}",
    "verificationSteps": [
      "Pass null to getLength and assert return value is 0.",
      "Pass valid strings and verify expected character lengths."
    ],
    "confidenceLevel": "High",
    "markdownContent": "..."
  },
  "timestamp": 1791740000000
}
```

---

## 4. Generate Documentation

### `POST /ai/document`
Generates comprehensive doc blocks in Javadoc, Markdown, or Docstring format.

**Request Payload:**
```json
{
  "code": "public int multiply(int a, int b) { return a * b; }",
  "language": "java",
  "format": "javadoc"
}
```
*Constraints:*
- `code`: Required, 1 to 12,000 characters.
- `language`: String.
- `format`: `javadoc` | `markdown` | `docstring` | `jsdoc`.

**Response `200 OK`:**
```json
{
  "success": true,
  "feature": "document",
  "message": "Documentation generated successfully",
  "result": {
    "summary": "Computes the product of two integers.",
    "parameters": [
      "a (int): The multiplicand",
      "b (int): The multiplier"
    ],
    "returnValue": "int: Product of a and b",
    "exceptions": [],
    "exampleUsage": "int result = multiply(4, 5); // Returns 20",
    "generatedDocumentation": "/**\n * Computes the product of two integers.\n *\n * @param a The multiplicand\n * @param b The multiplier\n * @return Product of a and b\n */",
    "markdownContent": "..."
  },
  "timestamp": 1791740000000
}
```
