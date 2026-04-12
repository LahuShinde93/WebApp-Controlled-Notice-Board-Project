# 🚀 Quick Start Guide - Smart Notice Board Backend

## ✅ Prerequisites Checklist

- [x] Java 17 installed
- [ ] MongoDB installed and running
- [x] Project compiled successfully

---

## 📝 Step-by-Step Setup (5 Minutes)

### Step 1: Start MongoDB

Open a new terminal and run:

```bash
# Windows
mongod

# Or if MongoDB is installed as a service, it should already be running
# Check with:
mongosh
```

If MongoDB is not installed:
- Download from: https://www.mongodb.com/try/download/community
- Install and start the service

### Step 2: Run the Application

```bash
# Using Maven Wrapper (Recommended)
./mvnw spring-boot:run

# Or if you have Maven installed
mvn spring-boot:run
```

You should see:
```
🚀 Smart Notice Board API is running!
📍 Server: http://localhost:8080
📚 API Docs: http://localhost:8080/api
```

### Step 3: Test the API

Open a new terminal or use Postman:

#### 1. Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Admin User\",\"email\":\"admin@noticeboard.com\",\"password\":\"admin123\"}"
```

**Copy the token from the response!**

#### 2. Create a Category
```bash
curl -X POST http://localhost:8080/api/categories ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"name\":\"Academic\",\"icon\":\"fas fa-graduation-cap\"}"
```

#### 3. Create a Notice
```bash
curl -X POST http://localhost:8080/api/notices ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"title\":\"Exam Schedule\",\"description\":\"Final exams from May 1-15\",\"category\":\"Academic\",\"priority\":\"HIGH\",\"status\":\"ACTIVE\",\"expiryDate\":\"2026-05-15\"}"
```

#### 4. Get Dashboard Stats
```bash
curl http://localhost:8080/api/dashboard/stats
```

#### 5. Get All Notices
```bash
curl http://localhost:8080/api/notices
```

---

## 🎯 Testing with Postman

### Import this collection:

1. Open Postman
2. Create a new collection "Smart Notice Board"
3. Add these requests:

**1. Register**
- Method: POST
- URL: `http://localhost:8080/api/auth/register`
- Body (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@noticeboard.com",
  "password": "admin123"
}
```

**2. Login**
- Method: POST
- URL: `http://localhost:8080/api/auth/login`
- Body (JSON):
```json
{
  "email": "admin@noticeboard.com",
  "password": "admin123"
}
```

**3. Create Category**
- Method: POST
- URL: `http://localhost:8080/api/categories`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
```json
{
  "name": "Academic",
  "icon": "fas fa-graduation-cap"
}
```

**4. Create Notice**
- Method: POST
- URL: `http://localhost:8080/api/notices`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
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

**5. Get Dashboard Stats**
- Method: GET
- URL: `http://localhost:8080/api/dashboard/stats`

**6. Get All Notices**
- Method: GET
- URL: `http://localhost:8080/api/notices`

**7. Get Active Notices (Public)**
- Method: GET
- URL: `http://localhost:8080/api/notices/active`

---

## 🌐 Frontend Integration

Update your frontend `app.js` to use the backend:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';

// Login
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.status === 'SUCCESS') {
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('userName', data.data.name);
    window.location.href = 'index.html';
  }
}

// Get Dashboard Stats
async function getDashboardStats() {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  const data = await response.json();
  if (data.status === 'SUCCESS') {
    document.getElementById('totalNotices').textContent = data.data.totalNotices;
    document.getElementById('activeNotices').textContent = data.data.activeNotices;
    document.getElementById('expiredNotices').textContent = data.data.expiredNotices;
    document.getElementById('totalCategories').textContent = data.data.totalCategories;
  }
}

// Create Notice
async function createNotice(noticeData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/notices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(noticeData)
  });
  const data = await response.json();
  return data;
}

// Get All Notices
async function getAllNotices() {
  const response = await fetch(`${API_BASE_URL}/notices`);
  const data = await response.json();
  return data.data;
}

// Get Categories
async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const data = await response.json();
  return data.data;
}
```

---

## 📊 Verify MongoDB Data

Open MongoDB Compass or mongosh:

```bash
mongosh

use notice_board_db

# View collections
show collections

# View users
db.users.find().pretty()

# View notices
db.notices.find().pretty()

# View categories
db.categories.find().pretty()
```

---

## 🔍 Common Issues & Solutions

### Issue: "Connection refused" error
**Solution:** MongoDB is not running. Start MongoDB service.

### Issue: "Port 8080 already in use"
**Solution:** Change port in `application.properties`:
```properties
server.port=8081
```

### Issue: "Unauthorized" error
**Solution:** 
1. Make sure you're logged in
2. Copy the token from login response
3. Add header: `Authorization: Bearer YOUR_TOKEN`

### Issue: "Validation failed"
**Solution:** Check your request body matches the validation rules:
- Title: 3-200 characters
- Description: 10-2000 characters
- Email: Valid format
- Password: Minimum 6 characters

---

## 📚 API Endpoints Summary

### Auth (No token required)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Notices (Token required except /active)
- `POST /api/notices` - Create notice
- `PUT /api/notices/{id}` - Update notice
- `DELETE /api/notices/{id}` - Delete notice
- `GET /api/notices` - Get all notices
- `GET /api/notices/active` - Get active notices (Public)
- `GET /api/notices/{id}` - Get notice by ID
- `GET /api/notices/status/{status}` - Get by status
- `GET /api/notices/category/{category}` - Get by category

### Categories (Token required)
- `POST /api/categories` - Create category
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

---

## 🎉 You're All Set!

Your backend is now running and ready to use. Check:
- ✅ MongoDB is running
- ✅ Application started successfully
- ✅ APIs are responding
- ✅ Frontend can connect

For detailed API documentation, see `API_DOCUMENTATION.md`
For setup details, see `BACKEND_SETUP.md`

Happy coding! 🚀
