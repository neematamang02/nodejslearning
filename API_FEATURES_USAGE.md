# APIFeatures Usage Guide

## Overview
The `APIFeatures` class provides a professional, chainable API for handling common query operations in your REST API.

## Features Implemented

### 1. **Filtering**
Filter by any field with advanced operators.

**Examples:**
```
GET /api/users?role=admin
GET /api/users?age[gte]=18&age[lte]=65
GET /api/users?isActive=true
```

**Operators:**
- `gte` - Greater than or equal
- `gt` - Greater than
- `lte` - Less than or equal
- `lt` - Less than

---

### 2. **Search**
Search across multiple fields (case-insensitive).

**Examples:**
```
GET /api/users?search=john
GET /api/users?search=gmail.com
```

Searches in: `name`, `email` (configurable in service)

---

### 3. **Sorting**
Sort by one or multiple fields.

**Examples:**
```
GET /api/users?sort=name           # Ascending
GET /api/users?sort=-createdAt     # Descending (- prefix)
GET /api/users?sort=name,-age      # Multiple fields
```

**Default:** `-createdAt` (newest first)

---

### 4. **Field Selection**
Limit which fields are returned (reduces payload size).

**Examples:**
```
GET /api/users?fields=name,email
GET /api/users?fields=name,email,role
GET /api/users?fields=-password,-__v  # Exclude fields
```

**Default:** Excludes `__v` field

---

### 5. **Pagination**
Paginate results with metadata.

**Examples:**
```
GET /api/users?page=1&limit=10
GET /api/users?page=2&limit=20
```

**Default:** `page=1`, `limit=10`

**Response includes:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "skip": 0,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

## Combined Examples

### Example 1: Search + Sort + Paginate
```
GET /api/users?search=john&sort=-createdAt&page=1&limit=5
```
- Search for "john" in name/email
- Sort by newest first
- Return first 5 results

### Example 2: Filter + Field Selection
```
GET /api/users?role=admin&isActive=true&fields=name,email,role
```
- Get active admins
- Only return name, email, role fields

### Example 3: Advanced Filtering
```
GET /api/users?age[gte]=18&age[lte]=65&sort=age&page=1&limit=20
```
- Users aged 18-65
- Sort by age ascending
- 20 per page

---

## How It Works (Code Flow)

### 1. Controller Layer
```javascript
export const getUser = asyncHandler(async (req, res) => {
    const { users, pagination } = await Listuserservice(req.query);
    sendResponse(res, 200, "Users retrieved successfully", { users, pagination });
});
```

### 2. Service Layer
```javascript
export const Listuserservice = async (queryString) => {
    const features = new APIFeatures(User.find(), queryString)
        .filter()           // Apply filters
        .search(["name", "email"])  // Search in these fields
        .sort()             // Apply sorting
        .limitFields()      // Select fields
        .paginate();        // Apply pagination

    const { results, pagination } = await features.executeWithCount(User);
    
    return {
        users: results,
        pagination,
    };
};
```

### 3. APIFeatures Class
```javascript
// Chainable methods
const features = new APIFeatures(query, queryString)
    .filter()       // Returns 'this'
    .search(fields) // Returns 'this'
    .sort()         // Returns 'this'
    .limitFields()  // Returns 'this'
    .paginate();    // Returns 'this'

// Execute query
const { results, pagination } = await features.executeWithCount(Model);
```

---

## Key Improvements Over Original

### ✅ Fixed Bugs
- Fixed `this.queryObj` → `queryObj` bug
- Removed unused `zod` import
- Fixed undefined `queryString` parameter

### ✅ Added Features
- **Sort**: Order results by any field
- **Field Selection**: Reduce payload size
- **Total Count**: Pagination metadata
- **Advanced Filtering**: Support for `gte`, `gt`, `lte`, `lt`

### ✅ Professional Patterns
- **Chainable API**: Clean, readable code
- **Separation of Concerns**: Controller → Service → Utility
- **Consistent Responses**: Structured pagination data
- **Default Values**: Sensible defaults for all options

---

## Testing Examples

### Test 1: Basic Pagination
```bash
curl "http://localhost:3000/api/users?page=1&limit=5"
```

### Test 2: Search
```bash
curl "http://localhost:3000/api/users?search=john"
```

### Test 3: Complex Query
```bash
curl "http://localhost:3000/api/users?role=admin&search=john&sort=-createdAt&fields=name,email&page=1&limit=10"
```

---

## Senior Developer Best Practices Applied

1. **Chainable Methods**: Fluent interface pattern
2. **Single Responsibility**: Each method does one thing
3. **Immutability**: Returns `this` for chaining
4. **Error Handling**: Proper parseInt with radix
5. **Default Values**: Sensible fallbacks
6. **Metadata**: Pagination info for frontend
7. **Performance**: Field selection reduces data transfer
8. **Flexibility**: All features are optional
9. **Documentation**: Clear examples and usage
10. **Consistency**: Follows REST API conventions
