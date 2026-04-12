# Smart Notice Board - Backend Setup Guide

## 🏗️ Project Architecture

This project follows **Clean Layered Architecture** with proper separation of concerns:

```
com.noticeboard
│
├── controller/          # REST API Controllers
├── service/             # Business Logic Interfaces
├── service.impl/        # Business Logic Implementation
├── repository/          # MongoDB Repositories
├── dao/                 # Data Access Object Interfaces
├── dao.impl/            # DAO Implementation
├── model/               # Entity Classes (MongoDB Documents)
├── dto/                 # Data Transfer Objects
│   ├── request/         # Request DTOs
│   └── response/        # Response DTOs
├── exception/           # Custom Exceptions & Global Handler
├── util/                # Utility Classes (JWT, etc.)
└── config/              # Configuration Classes
    └── filter/          # Security Filters
```

---

## 🛠️ Technology Stack

- **Java 17**
- **Spring Boot 3.2.5**
- **Spring Data MongoDB**
- **Spring Security**
- **JWT (JSON Web Tokens)**
- **Lombok**
- **Maven**
- **MongoDB**

---

## 📋 Prerequisites

1. **Java 17** or higher
2. **Maven 3.6+**
3. **MongoDB 4.4+** (running on localhost:27017)
4. **IDE** (IntelliJ IDEA, Eclipse, or VS Code)

---

## 🚀 Setup Instructions

### Step 1: Install MongoDB

#### Windows:
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 2: Verify MongoDB is Running
```bash
mongosh
# or
mongo
```

### Step 3: Clone/Open Project
```bash
cd WebApp_Controlled_Notice_Board_Project
```

### Step 4: Build the Project
```bash
mvn clean install
```

### Step 5: Run the Application
```bash
mvn spring-boot:run
```

Or run from your IDE:
- Right-click on `WebAppControlledNoticeBoardProjectApplication.java`
- Select "Run"

### Step 6: Verify Application is Running
You should see:
```
🚀 Smart Notice Board API is running!
📍 Server: http://localhost:8080
📚 API Docs: http://localhost:8080/api
```

---

## 🧪 Testing the APIs

### Option 1: Using Postman

1. **Register a User**
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
   - Copy the `token` from response

2. **Create a Category**
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

3. **Create a Notice**
   - Method: POST
   - URL: `http://localhost:8080/api/notices`
   - Headers: `Authorization: Bearer YOUR_TOKEN`
   - Body (JSON):
   ```json
   {
     "title": "Exam Schedule",
     "description": "Final exams from May 1-15",
     "category": "Academic",
     "priority": "HIGH",
     "status": "ACTIVE",
     "expiryDate": "2026-05-15"
   }
   ```

4. **Get Dashboard Stats**
   - Method: GET
   - URL: `http://localhost:8080/api/dashboard/stats`

### Option 2: Using cURL

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"admin123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Get Active Notices (No auth required)
curl http://localhost:8080/api/notices/active
```

---

## 📊 Database Collections

MongoDB will automatically create these collections:

1. **users** - User accounts
2. **notices** - Notice board posts
3. **categories** - Notice categories

---

## 🔐 Security Configuration

- **JWT Secret**: Configured in `application.properties`
- **Token Expiration**: 24 hours
- **Password Encoding**: BCrypt
- **Public Endpoints**:
  - `/api/auth/**` (register, login)
  - `/api/notices/active` (public notice display)
  - Static resources (`/**`)

---

## 🎯 Key Features Implemented

### 1. Authentication & Authorization
- ✅ User registration with password encryption
- ✅ JWT-based authentication
- ✅ Secure endpoints with Bearer token

### 2. Notice Management (CRUD)
- ✅ Create notice
- ✅ Update notice
- ✅ Delete notice
- ✅ Get all notices (sorted by latest)
- ✅ Get active notices
- ✅ Filter by status
- ✅ Filter by category
- ✅ Auto-expire based on date

### 3. Category Management
- ✅ Create category
- ✅ Get all categories
- ✅ Update category
- ✅ Delete category
- ✅ Auto-update notice count

### 4. Dashboard
- ✅ Total notices count
- ✅ Active notices count
- ✅ Expired notices count
- ✅ Total categories count

### 5. Error Handling
- ✅ Global exception handler
- ✅ Custom exceptions
- ✅ Validation error responses
- ✅ Proper HTTP status codes

### 6. Response Format
All APIs return standardized response:
```json
{
  "status": "SUCCESS",
  "message": "Operation successful",
  "data": { ... }
}
```

---

## 📁 Important Files

- `pom.xml` - Maven dependencies
- `application.properties` - Configuration
- `API_DOCUMENTATION.md` - Complete API reference
- `SecurityConfig.java` - Security configuration
- `JwtUtil.java` - JWT token utility
- `GlobalExceptionHandler.java` - Exception handling

---

## 🔧 Configuration

### application.properties
```properties
# Server
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/notice_board_db
spring.data.mongodb.database=notice_board_db

# JWT
jwt.secret=YOUR_SECRET_KEY
jwt.expiration=86400000

# Logging
logging.level.com.noticeboard=DEBUG
```

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:** Ensure MongoDB is running
```bash
# Check MongoDB status
mongosh
```

### Issue: Port 8080 already in use
**Solution:** Change port in `application.properties`
```properties
server.port=8081
```

### Issue: JWT Token Invalid
**Solution:** 
1. Check token expiration (24 hours)
2. Re-login to get new token
3. Ensure "Bearer " prefix in Authorization header

### Issue: Validation Errors
**Solution:** Check request body matches validation rules:
- Title: 3-200 characters
- Description: 10-2000 characters
- Email: Valid format
- Password: Minimum 6 characters

---

## 📈 Flow Explanation

### 1. User Registration Flow
```
Client → AuthController → AuthService → UserDao → UserRepository → MongoDB
                                ↓
                            JwtUtil (Generate Token)
                                ↓
                            Return AuthResponse
```

### 2. Create Notice Flow
```
Client (with JWT) → JwtAuthenticationFilter → NoticeController 
                                                    ↓
                                              NoticeService
                                                    ↓
                                              NoticeDao → NoticeRepository → MongoDB
                                                    ↓
                                              Update Category Count
                                                    ↓
                                              Return Notice
```

### 3. Dashboard Stats Flow
```
Client → DashboardController → DashboardService
                                      ↓
                                NoticeDao (count queries)
                                      ↓
                                CategoryDao (count)
                                      ↓
                                Return DashboardResponse
```

---

## 🎨 Best Practices Followed

1. ✅ **Layered Architecture** - Clear separation of concerns
2. ✅ **Interface-based Design** - Service and DAO interfaces
3. ✅ **DTO Pattern** - Separate request/response objects
4. ✅ **Validation** - Input validation with annotations
5. ✅ **Exception Handling** - Global exception handler
6. ✅ **Logging** - SLF4J with Lombok
7. ✅ **Security** - JWT authentication
8. ✅ **Clean Code** - Proper naming conventions
9. ✅ **Documentation** - Comprehensive API docs
10. ✅ **CORS** - Enabled for frontend integration

---

## 🔄 Integration with Frontend

The backend is fully compatible with your existing frontend. Update the frontend API calls:

```javascript
// Example: Login
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
localStorage.setItem('token', data.data.token);

// Example: Create Notice
const response = await fetch('http://localhost:8080/api/notices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(noticeData)
});
```

---

## 📞 Support

For issues or questions:
1. Check `API_DOCUMENTATION.md` for API details
2. Review error messages in console
3. Check MongoDB connection
4. Verify JWT token validity

---

## ✅ Ready to Use!

Your backend is now complete and ready to integrate with the frontend. All CRUD operations, authentication, and dashboard features are fully functional!
