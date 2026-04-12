# 🧪 Complete Testing Guide - Smart Notice Board Backend

## 📋 Table of Contents
1. [Setup for Testing](#setup-for-testing)
2. [Test Data](#test-data)
3. [API Testing Scenarios](#api-testing-scenarios)
4. [Expected Results](#expected-results)
5. [Error Scenarios](#error-scenarios)

---

## 🛠️ Setup for Testing

### Prerequisites
1. MongoDB running on `localhost:27017`
2. Application running on `http://localhost:8080`
3. Postman or cURL installed

### Start Application
```bash
./mvnw spring-boot:run
```

---

## 📊 Test Data

### Sample Users
```json
{
  "name": "Admin User",
  "email": "admin@noticeboard.com",
  "password": "admin123"
}

{
  "name": "Test User",
  "email": "test@noticeboard.com",
  "password": "test123"
}
```

### Sample Categories
```json
[
  { "name": "Academic", "icon": "fas fa-graduation-cap" },
  { "name": "General", "icon": "fas fa-bullhorn" },
  { "name": "Events", "icon": "fas fa-calendar-alt" },
  { "name": "Administrative", "icon": "fas fa-building" },
  { "name": "Urgent", "icon": "fas fa-exclamation-triangle" }
]
```

### Sample Notices
```json
[
  {
    "title": "Exam Schedule Update",
    "description": "Final exams will be held from May 1st to May 15th. All students must report to their respective examination halls 30 minutes before the scheduled time.",
    "category": "Academic",
    "priority": "HIGH",
    "status": "ACTIVE",
    "expiryDate": "2026-05-15"
  },
  {
    "title": "Holiday Announcement",
    "description": "Campus will remain closed on April 20th for the annual celebration. Regular classes will resume on April 21st.",
    "category": "General",
    "priority": "MEDIUM",
    "status": "ACTIVE",
    "expiryDate": "2026-04-20"
  },
  {
    "title": "Tech Fest 2026",
    "description": "Annual tech fest will be organized on May 5th. Students interested in participating should register before April 25th.",
    "category": "Events",
    "priority": "HIGH",
    "status": "ACTIVE",
    "expiryDate": "2026-05-05"
  },
  {
    "title": "Library Timings Changed",
    "description": "Library will now be open from 8 AM to 10 PM starting from April 15th. Students can access digital resources 24/7.",
    "category": "Administrative",
    "priority": "MEDIUM",
    "status": "ACTIVE",
    "expiryDate": "2026-06-30"
  },
  {
    "title": "Sports Day Registration",
    "description": "Annual sports day will be held on May 10th. Register your team before April 30th. Multiple sports events will be organized.",
    "category": "Events",
    "priority": "LOW",
    "status": "ACTIVE",
    "expiryDate": "2026-05-10"
  }
]
```

---

## 🧪 API Testing Scenarios

### Test 1: User Registration

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@noticeboard.com",
    "password": "admin123"
  }'
```

**Expected Response (201 Created):**
```json
{
  "status": "SUCCESS",
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "email": "admin@noticeboard.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

**✅ Verification:**
- Status code: 201
- Token is present
- Email matches
- Role is ADMIN

---

### Test 2: User Login

**Request:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@noticeboard.com",
    "password": "admin123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "email": "admin@noticeboard.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

**✅ Verification:**
- Status code: 200
- Token is present
- User details match

**💾 Save the token for subsequent requests!**

---

### Test 3: Create Categories

**Request (Repeat for each category):**
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Academic",
    "icon": "fas fa-graduation-cap"
  }'
```

**Expected Response (201 Created):**
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

**✅ Verification:**
- Status code: 201
- Category has ID
- Count is 0
- Timestamps are present

**📝 Create all 5 categories from test data**

---

### Test 4: Get All Categories

**Request:**
```bash
curl http://localhost:8080/api/categories
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "661234567890abcdef123456",
      "name": "Academic",
      "icon": "fas fa-graduation-cap",
      "count": 0,
      "createdAt": "2026-04-12T10:30:00",
      "updatedAt": "2026-04-12T10:30:00"
    },
    ...
  ]
}
```

**✅ Verification:**
- Status code: 200
- All 5 categories present
- Each has ID and timestamps

---

### Test 5: Create Notices

**Request (Repeat for each notice):**
```bash
curl -X POST http://localhost:8080/api/notices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Exam Schedule Update",
    "description": "Final exams will be held from May 1st to May 15th. All students must report to their respective examination halls 30 minutes before the scheduled time.",
    "category": "Academic",
    "priority": "HIGH",
    "status": "ACTIVE",
    "expiryDate": "2026-05-15"
  }'
```

**Expected Response (201 Created):**
```json
{
  "status": "SUCCESS",
  "message": "Notice created successfully",
  "data": {
    "id": "661234567890abcdef789012",
    "title": "Exam Schedule Update",
    "description": "Final exams will be held from May 1st to May 15th...",
    "category": "Academic",
    "priority": "HIGH",
    "status": "ACTIVE",
    "expiryDate": "2026-05-15",
    "createdAt": "2026-04-12T10:35:00",
    "updatedAt": "2026-04-12T10:35:00"
  }
}
```

**✅ Verification:**
- Status code: 201
- Notice has ID
- All fields match
- Timestamps present

**📝 Create all 5 notices from test data**

---

### Test 6: Verify Category Count Updated

**Request:**
```bash
curl http://localhost:8080/api/categories
```

**Expected Result:**
- Academic category count: 1
- General category count: 1
- Events category count: 2
- Administrative category count: 1
- Urgent category count: 0

**✅ Verification:**
- Category counts automatically updated
- Matches number of notices per category

---

### Test 7: Get All Notices

**Request:**
```bash
curl http://localhost:8080/api/notices
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Notices retrieved successfully",
  "data": [
    {
      "id": "...",
      "title": "Sports Day Registration",
      "description": "...",
      "category": "Events",
      "priority": "LOW",
      "status": "ACTIVE",
      "expiryDate": "2026-05-10",
      "createdAt": "2026-04-12T10:40:00",
      "updatedAt": "2026-04-12T10:40:00"
    },
    ...
  ]
}
```

**✅ Verification:**
- Status code: 200
- All 5 notices present
- Sorted by latest first (newest at top)

---

### Test 8: Get Active Notices (Public Endpoint)

**Request:**
```bash
curl http://localhost:8080/api/notices/active
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Active notices retrieved successfully",
  "data": [...]
}
```

**✅ Verification:**
- Status code: 200
- Only ACTIVE notices returned
- No authentication required

---

### Test 9: Filter Notices by Status

**Request:**
```bash
curl http://localhost:8080/api/notices/status/ACTIVE
```

**Expected Response (200 OK):**
- Only notices with status "ACTIVE"

**✅ Verification:**
- All returned notices have status: ACTIVE

---

### Test 10: Filter Notices by Category

**Request:**
```bash
curl http://localhost:8080/api/notices/category/Events
```

**Expected Response (200 OK):**
- Only notices with category "Events"

**✅ Verification:**
- Should return 2 notices (Tech Fest and Sports Day)
- All have category: Events

---

### Test 11: Get Dashboard Statistics

**Request:**
```bash
curl http://localhost:8080/api/dashboard/stats
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalNotices": 5,
    "activeNotices": 5,
    "expiredNotices": 0,
    "totalCategories": 5
  }
}
```

**✅ Verification:**
- Total notices: 5
- Active notices: 5
- Expired notices: 0
- Total categories: 5

---

### Test 12: Update Notice

**Request:**
```bash
curl -X PUT http://localhost:8080/api/notices/{NOTICE_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Exam Schedule",
    "description": "Exams postponed to May 5th",
    "category": "Academic",
    "priority": "MEDIUM",
    "status": "ACTIVE",
    "expiryDate": "2026-05-20"
  }'
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Notice updated successfully",
  "data": {
    "id": "...",
    "title": "Updated Exam Schedule",
    "description": "Exams postponed to May 5th",
    "category": "Academic",
    "priority": "MEDIUM",
    "status": "ACTIVE",
    "expiryDate": "2026-05-20",
    "createdAt": "2026-04-12T10:35:00",
    "updatedAt": "2026-04-12T11:00:00"
  }
}
```

**✅ Verification:**
- Status code: 200
- Title updated
- updatedAt timestamp changed
- createdAt remains same

---

### Test 13: Delete Notice

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/notices/{NOTICE_ID} \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Notice deleted successfully",
  "data": null
}
```

**✅ Verification:**
- Status code: 200
- Notice removed from database
- Category count decreased by 1

---

### Test 14: Update Category

**Request:**
```bash
curl -X PUT http://localhost:8080/api/categories/{CATEGORY_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Academic Affairs",
    "icon": "fas fa-book"
  }'
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Category updated successfully",
  "data": {
    "id": "...",
    "name": "Academic Affairs",
    "icon": "fas fa-book",
    "count": 1,
    "createdAt": "2026-04-12T10:30:00",
    "updatedAt": "2026-04-12T11:15:00"
  }
}
```

**✅ Verification:**
- Name and icon updated
- Count preserved
- updatedAt changed

---

### Test 15: Delete Category

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/categories/{CATEGORY_ID} \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "message": "Category deleted successfully",
  "data": null
}
```

**✅ Verification:**
- Status code: 200
- Category removed
- Notices in that category still exist

---

## ❌ Error Scenarios Testing

### Error 1: Validation Error

**Request (Missing required field):**
```bash
curl -X POST http://localhost:8080/api/notices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "AB",
    "description": "Short"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "status": "ERROR",
  "message": "Validation failed",
  "data": {
    "title": "Title must be between 3 and 200 characters",
    "description": "Description must be between 10 and 2000 characters",
    "category": "Category is required",
    "priority": "Priority is required",
    "status": "Status is required"
  }
}
```

---

### Error 2: Unauthorized Access

**Request (No token):**
```bash
curl -X POST http://localhost:8080/api/notices \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notice",
    "description": "This should fail",
    "category": "General",
    "priority": "HIGH",
    "status": "ACTIVE"
  }'
```

**Expected Response (403 Forbidden):**
- Access denied without token

---

### Error 3: Resource Not Found

**Request (Invalid ID):**
```bash
curl http://localhost:8080/api/notices/invalid_id_12345
```

**Expected Response (404 Not Found):**
```json
{
  "status": "ERROR",
  "message": "Notice not found with ID: invalid_id_12345",
  "data": null
}
```

---

### Error 4: Duplicate Resource

**Request (Register with existing email):**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "admin@noticeboard.com",
    "password": "password123"
  }'
```

**Expected Response (409 Conflict):**
```json
{
  "status": "ERROR",
  "message": "User with email admin@noticeboard.com already exists",
  "data": null
}
```

---

### Error 5: Invalid Credentials

**Request (Wrong password):**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@noticeboard.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "status": "ERROR",
  "message": "Invalid email or password",
  "data": null
}
```

---

## ✅ Complete Test Checklist

### Authentication
- [ ] Register new user successfully
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Duplicate email registration fails
- [ ] JWT token is generated
- [ ] Token validation works

### Categories
- [ ] Create category successfully
- [ ] Get all categories
- [ ] Get category by ID
- [ ] Update category
- [ ] Delete category
- [ ] Duplicate category name fails
- [ ] Category count updates automatically

### Notices
- [ ] Create notice successfully
- [ ] Get all notices (sorted by latest)
- [ ] Get notice by ID
- [ ] Get active notices
- [ ] Filter by status
- [ ] Filter by category
- [ ] Update notice
- [ ] Delete notice
- [ ] Auto-expire past date notices
- [ ] Category count updates on create/delete

### Dashboard
- [ ] Get dashboard stats
- [ ] Stats are accurate

### Error Handling
- [ ] Validation errors return 400
- [ ] Unauthorized returns 401/403
- [ ] Not found returns 404
- [ ] Duplicate returns 409
- [ ] Server errors return 500

### Security
- [ ] Protected endpoints require token
- [ ] Public endpoints work without token
- [ ] Invalid token is rejected
- [ ] Expired token is rejected

---

## 📊 Performance Testing

### Load Test Scenarios

1. **Create 100 notices**
   - Should complete in < 10 seconds
   - No errors

2. **Get all notices (100 records)**
   - Response time < 1 second
   - Proper sorting

3. **Concurrent requests**
   - 10 simultaneous requests
   - All succeed

---

## 🎯 Final Verification

After completing all tests:

1. **Check MongoDB:**
```bash
mongosh
use notice_board_db
db.users.count()      # Should be 1
db.categories.count() # Should be 5
db.notices.count()    # Should be 4 (if 1 deleted)
```

2. **Check Dashboard:**
```bash
curl http://localhost:8080/api/dashboard/stats
```

3. **Check Logs:**
- No errors in console
- All requests logged
- Proper debug information

---

## 🎉 Success Criteria

✅ All API endpoints working
✅ Authentication & authorization working
✅ CRUD operations successful
✅ Validation working correctly
✅ Error handling proper
✅ Auto-updates working (category count, expiry)
✅ Sorting and filtering working
✅ Dashboard stats accurate

---

**Testing Complete! Your backend is production-ready! 🚀**
