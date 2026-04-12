# Smart Notice Board - API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📌 AUTH MODULE

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "status": "SUCCESS",
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  }
}
```

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  }
}
```

---

## 📋 NOTICE MODULE

### 1. Create Notice
**Endpoint:** `POST /api/notices`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Exam Schedule Update",
  "description": "Final exams will be held from May 1st to May 15th",
  "category": "Academic",
  "priority": "HIGH",
  "status": "ACTIVE",
  "expiryDate": "2026-05-15"
}
```

**Response:** `201 Created`
```json
{
  "status": "SUCCESS",
  "message": "Notice created successfully",
  "data": {
    "id": "661234567890abcdef123456",
    "title": "Exam Schedule Update",
    "description": "Final exams will be held from May 1st to May 15th",
    "category": "Academic",
    "priority": "HIGH",
    "status": "ACTIVE",
    "expiryDate": "2026-05-15",
    "createdAt": "2026-04-12T10:30:00",
    "updatedAt": "2026-04-12T10:30:00"
  }
}
```

### 2. Update Notice
**Endpoint:** `PUT /api/notices/{id}`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "title": "Updated Exam Schedule",
  "description": "Final exams postponed to May 5th",
  "category": "Academic",
  "priority": "MEDIUM",
  "status": "ACTIVE",
  "expiryDate": "2026-05-20"
}
```

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Notice updated successfully",
  "data": { ... }
}
```

### 3. Delete Notice
**Endpoint:** `DELETE /api/notices/{id}`  
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Notice deleted successfully",
  "data": null
}
```

### 4. Get Notice by ID
**Endpoint:** `GET /api/notices/{id}`

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Notice retrieved successfully",
  "data": { ... }
}
```

### 5. Get All Notices
**Endpoint:** `GET /api/notices`

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Notices retrieved successfully",
  "data": [
    {
      "id": "661234567890abcdef123456",
      "title": "Exam Schedule Update",
      "description": "...",
      "category": "Academic",
      "priority": "HIGH",
      "status": "ACTIVE",
      "expiryDate": "2026-05-15",
      "createdAt": "2026-04-12T10:30:00",
      "updatedAt": "2026-04-12T10:30:00"
    }
  ]
}
```

### 6. Get Active Notices
**Endpoint:** `GET /api/notices/active`  
**Auth Required:** No (Public)

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Active notices retrieved successfully",
  "data": [ ... ]
}
```

### 7. Get Notices by Status
**Endpoint:** `GET /api/notices/status/{status}`  
**Status Values:** ACTIVE, INACTIVE, DRAFT, EXPIRED

**Response:** `200 OK`

### 8. Get Notices by Category
**Endpoint:** `GET /api/notices/category/{category}`

**Response:** `200 OK`

---

## 📁 CATEGORY MODULE

### 1. Create Category
**Endpoint:** `POST /api/categories`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "Academic",
  "icon": "fas fa-graduation-cap"
}
```

**Response:** `201 Created`
```json
{
  "status": "SUCCESS",
  "message": "Category created successfully",
  "data": {
    "id": "661234567890abcdef123456",
    "name": "Academic",
    "icon": "fas fa-graduation-cap",
    "count": 0,
    "createdAt": "2026-04-12T10:30:00",
    "updatedAt": "2026-04-12T10:30:00"
  }
}
```

### 2. Get All Categories
**Endpoint:** `GET /api/categories`

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "661234567890abcdef123456",
      "name": "Academic",
      "icon": "fas fa-graduation-cap",
      "count": 5,
      "createdAt": "2026-04-12T10:30:00",
      "updatedAt": "2026-04-12T10:30:00"
    }
  ]
}
```

### 3. Get Category by ID
**Endpoint:** `GET /api/categories/{id}`

**Response:** `200 OK`

### 4. Update Category
**Endpoint:** `PUT /api/categories/{id}`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "Updated Academic",
  "icon": "fas fa-book"
}
```

**Response:** `200 OK`

### 5. Delete Category
**Endpoint:** `DELETE /api/categories/{id}`  
**Auth Required:** Yes

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Category deleted successfully",
  "data": null
}
```

---

## 📊 DASHBOARD MODULE

### Get Dashboard Statistics
**Endpoint:** `GET /api/dashboard/stats`

**Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalNotices": 25,
    "activeNotices": 18,
    "expiredNotices": 7,
    "totalCategories": 5
  }
}
```

---

## ❌ Error Responses

### Validation Error (400)
```json
{
  "status": "ERROR",
  "message": "Validation failed",
  "data": {
    "title": "Title is required",
    "email": "Email should be valid"
  }
}
```

### Unauthorized (401)
```json
{
  "status": "ERROR",
  "message": "Invalid email or password",
  "data": null
}
```

### Not Found (404)
```json
{
  "status": "ERROR",
  "message": "Notice not found with ID: 123",
  "data": null
}
```

### Conflict (409)
```json
{
  "status": "ERROR",
  "message": "User with email john@example.com already exists",
  "data": null
}
```

### Internal Server Error (500)
```json
{
  "status": "ERROR",
  "message": "An unexpected error occurred",
  "data": null
}
```

---

## 🔑 Field Validations

### Notice Request
- `title`: Required, 3-200 characters
- `description`: Required, 10-2000 characters
- `category`: Required
- `priority`: Required (HIGH, MEDIUM, LOW)
- `status`: Required (ACTIVE, INACTIVE, DRAFT, EXPIRED)
- `expiryDate`: Optional (format: YYYY-MM-DD)

### Category Request
- `name`: Required, 2-50 characters
- `icon`: Optional

### Register Request
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

### Login Request
- `email`: Required, valid email format
- `password`: Required

---

## 🚀 Testing with Postman/cURL

### Example: Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Example: Create Notice (with JWT)
```bash
curl -X POST http://localhost:8080/api/notices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Notice",
    "description": "This is a test notice",
    "category": "General",
    "priority": "HIGH",
    "status": "ACTIVE",
    "expiryDate": "2026-05-01"
  }'
```

---

## 📝 Notes

1. **Auto-Expiry**: Notices with `expiryDate` in the past are automatically marked as EXPIRED
2. **Category Count**: Automatically updated when notices are created/deleted
3. **Sorting**: Notices are returned sorted by creation date (latest first)
4. **CORS**: Enabled for all origins (configure in production)
5. **JWT Expiration**: 24 hours (86400000 ms)
