# Production-Grade API Response Format

## Overview
Your API now follows industry-standard response formats used by companies like Stripe, Google, and Twilio.

---

## Response Structure

### ✅ Success Response
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...]
  },
  "meta": {
    "timestamp": "2026-02-06T10:30:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### ❌ Error Response
```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "NOT_FOUND",
    "statusCode": 404,
    "stack": "..." // Only in development
  },
  "meta": {
    "timestamp": "2026-02-06T10:30:00.000Z"
  }
}
```

---

## Field Definitions

### `success` (boolean)
- `true` for successful operations (2xx status codes)
- `false` for errors (4xx, 5xx status codes)
- Automatically determined by status code

### `message` (string)
- Human-readable description of the result
- Examples: "User created successfully", "Invalid credentials"

### `data` (object | array | null)
- The actual response payload
- Only present in success responses
- Can be object, array, or omitted if no data

### `meta` (object)
- Metadata about the response
- Always includes `timestamp`
- Can include pagination, rate limits, etc.

### `error` (object)
- Only present in error responses
- Contains structured error information

---

## Usage Examples

### 1. Simple Success (No Data)
```javascript
sendResponse(res, 200, "Logged out successfully");
```
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "meta": {
    "timestamp": "2026-02-06T10:30:00.000Z"
  }
}
```

### 2. Success with Data
```javascript
sendResponse(res, 201, "User created successfully", user);
```
**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2026-02-06T10:30:00.000Z"
  }
}
```

### 3. Success with Pagination
```javascript
sendResponse(res, 200, "Users retrieved successfully", 
  { users }, 
  { pagination }
);
```
**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...]
  },
  "meta": {
    "timestamp": "2026-02-06T10:30:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

### 4. Error Response
```javascript
throw new ApiError(404, "User not found");
```
**Response:**
```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "NOT_FOUND",
    "statusCode": 404
  },
  "meta": {
    "timestamp": "2026-02-06T10:30:00.000Z"
  }
}
```

### 5. Error with Custom Code
```javascript
throw new ApiError(401, "Invalid credentials", "INVALID_LOGIN");
```
**Response:**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_LOGIN",
    "statusCode": 401
  },
  "meta": {
    "timestamp": "2026-02-06T10:30:00.000Z"
  }
}
```

### 6. Error with Details
```javascript
throw new ApiError(422, "Validation failed", "VALIDATION_ERROR", {
  fields: {
    email: "Invalid email format",
    password: "Password too short"
  }
});
```
**Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "statusCode": 422,
    "details": {
      "fields": {
        "email": "Invalid email format",
        "password": "Password too short"
      }
    }
  },
  "meta": {
    "timestamp": "2026-02-06T10:30:00.000Z"
  }
}
```

---

## API Signatures

### sendResponse
```javascript
sendResponse(res, statusCode, message, data?, meta?)
```

**Parameters:**
- `res` - Express response object
- `statusCode` - HTTP status code (200, 201, 400, etc.)
- `message` - Human-readable message
- `data` - (Optional) Response payload
- `meta` - (Optional) Additional metadata

**Examples:**
```javascript
// No data
sendResponse(res, 200, "Success");

// With data
sendResponse(res, 200, "User found", user);

// With data and meta
sendResponse(res, 200, "Users found", { users }, { pagination });
```

### ApiError
```javascript
new ApiError(statusCode, message, code?, details?)
```

**Parameters:**
- `statusCode` - HTTP status code (400, 401, 404, etc.)
- `message` - Human-readable error message
- `code` - (Optional) Machine-readable error code
- `details` - (Optional) Additional error details

**Examples:**
```javascript
// Simple error
throw new ApiError(404, "User not found");

// With custom code
throw new ApiError(401, "Invalid token", "TOKEN_EXPIRED");

// With details
throw new ApiError(422, "Validation failed", "VALIDATION_ERROR", {
  fields: { email: "Required" }
});
```

---

## Default Error Codes

The system automatically assigns error codes based on status codes:

| Status Code | Default Code | Description |
|-------------|--------------|-------------|
| 400 | BAD_REQUEST | Invalid request format |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict |
| 422 | VALIDATION_ERROR | Validation failed |
| 500 | INTERNAL_SERVER_ERROR | Server error |

You can override these by providing a custom code:
```javascript
throw new ApiError(404, "User not found", "USER_NOT_FOUND");
```

---

## Best Practices

### ✅ DO

1. **Use Consistent Messages**
   ```javascript
   sendResponse(res, 200, "User created successfully", user);
   sendResponse(res, 200, "User updated successfully", user);
   ```

2. **Provide Meaningful Error Codes**
   ```javascript
   throw new ApiError(401, "Invalid credentials", "INVALID_LOGIN");
   throw new ApiError(401, "Token expired", "TOKEN_EXPIRED");
   ```

3. **Include Pagination in Meta**
   ```javascript
   sendResponse(res, 200, "Users retrieved", { users }, { pagination });
   ```

4. **Add Details for Validation Errors**
   ```javascript
   throw new ApiError(422, "Validation failed", "VALIDATION_ERROR", {
     fields: errors
   });
   ```

### ❌ DON'T

1. **Don't Mix Data and Meta**
   ```javascript
   // ❌ Bad
   sendResponse(res, 200, "Success", { users, pagination });
   
   // ✅ Good
   sendResponse(res, 200, "Success", { users }, { pagination });
   ```

2. **Don't Use Generic Messages**
   ```javascript
   // ❌ Bad
   throw new ApiError(404, "Not found");
   
   // ✅ Good
   throw new ApiError(404, "User not found");
   ```

3. **Don't Expose Sensitive Info in Production**
   ```javascript
   // Stack traces are automatically hidden in production
   // Don't manually add sensitive data to error details
   ```

---

## Frontend Integration

### JavaScript/TypeScript
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    timestamp: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: {
    code: string;
    statusCode: number;
    details?: any;
    stack?: string;
  };
}

// Usage
const response = await fetch('/api/users');
const result: ApiResponse<{ users: User[] }> = await response.json();

if (result.success) {
  console.log('Users:', result.data.users);
  console.log('Page:', result.meta.pagination.page);
} else {
  console.error('Error:', result.error.code);
}
```

### React Example
```jsx
const [users, setUsers] = useState([]);
const [error, setError] = useState(null);

const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users?page=1&limit=10');
    const result = await response.json();
    
    if (result.success) {
      setUsers(result.data.users);
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Network error');
  }
};
```

---

## Comparison with Industry Standards

### Your Format vs Others

| Feature | Your API | Stripe | Google | Twitter |
|---------|----------|--------|--------|---------|
| Success field | ✅ | ❌ | ❌ | ✅ |
| Message field | ✅ | ❌ | ✅ | ❌ |
| Data wrapper | ✅ | ✅ | ✅ | ✅ |
| Meta field | ✅ | ✅ | ✅ | ✅ |
| Error codes | ✅ | ✅ | ✅ | ✅ |
| Timestamp | ✅ | ✅ | ❌ | ✅ |

Your format combines the best practices from multiple industry leaders!

---

## Testing

### Success Response Test
```javascript
const response = await request(app)
  .get('/api/users')
  .expect(200);

expect(response.body).toMatchObject({
  success: true,
  message: expect.any(String),
  data: expect.any(Object),
  meta: {
    timestamp: expect.any(String)
  }
});
```

### Error Response Test
```javascript
const response = await request(app)
  .get('/api/users/invalid-id')
  .expect(404);

expect(response.body).toMatchObject({
  success: false,
  message: expect.any(String),
  error: {
    code: expect.any(String),
    statusCode: 404
  },
  meta: {
    timestamp: expect.any(String)
  }
});
```

---

## Summary

Your API response format is now **production-grade** and follows industry best practices:

✅ Consistent structure across all endpoints
✅ Clear success/error distinction
✅ Structured error information with codes
✅ Metadata support for pagination, timestamps, etc.
✅ Automatic timestamp tracking
✅ Development-only stack traces
✅ Flexible data and meta fields
✅ Type-safe and predictable

This format makes your API easy to consume, debug, and maintain!
