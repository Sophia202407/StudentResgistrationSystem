# Enhanced Student Registration API Documentation

## Overview
The Student Registration System now provides a comprehensive REST API with full CRUD operations, search functionality, pagination, statistics, and bulk operations.

## Base URL
```
http://localhost:8080/api/students
```

## API Endpoints

### 📝 **CREATE Operations**

#### 1. Add Single Student
- **Endpoint**: `POST /api/students`
- **Description**: Create a new student
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "enrollmentDate": "2025-06-28"
}
```
- **Response**: `201 Created` + Student object with generated ID

#### 2. Add Multiple Students (Bulk)
- **Endpoint**: `POST /api/students/bulk`
- **Description**: Create multiple students at once
- **Request Body**: Array of student objects
- **Response**: `201 Created` + Array of created students

### 📖 **READ Operations**

#### 3. Get All Students
- **Endpoint**: `GET /api/students`
- **Description**: Retrieve all students (sorted by ID descending)
- **Response**: `200 OK` + Array of students

#### 4. Get Students with Pagination
- **Endpoint**: `GET /api/students/paginated`
- **Parameters**:
  - `page` (default: 0) - Page number
  - `size` (default: 10) - Page size
  - `sortBy` (default: "id") - Sort field
  - `sortDir` (default: "desc") - Sort direction (asc/desc)
- **Example**: `/api/students/paginated?page=0&size=5&sortBy=name&sortDir=asc`

#### 5. Get Student by ID
- **Endpoint**: `GET /api/students/{id}`
- **Response**: `200 OK` + Student object or `404 Not Found`

#### 6. Get Student by Email
- **Endpoint**: `GET /api/students/email/{email}`
- **Response**: `200 OK` + Student object or `404 Not Found`

### ✏️ **UPDATE Operations**

#### 7. Update Student
- **Endpoint**: `PUT /api/students/{id}`
- **Description**: Update an existing student
- **Request Body**: Updated student object
- **Response**: `200 OK` + Updated student or `404 Not Found`

### 🗑️ **DELETE Operations**

#### 8. Delete Student
- **Endpoint**: `DELETE /api/students/{id}`
- **Response**: `200 OK` + Success message
```json
{
  "message": "Student deleted successfully",
  "deletedId": "1"
}
```

#### 9. Delete Multiple Students
- **Endpoint**: `DELETE /api/students/bulk`
- **Request Body**: Array of student IDs
```json
[1, 2, 3]
```
- **Response**: `200 OK` + Success message with count

### 🔍 **SEARCH Operations**

#### 10. General Search
- **Endpoint**: `GET /api/students/search?keyword={keyword}`
- **Description**: Search by name or email (case-insensitive)
- **Example**: `/api/students/search?keyword=john`

#### 11. Search by Name
- **Endpoint**: `GET /api/students/search/name?name={name}`
- **Description**: Search by name containing the keyword
- **Example**: `/api/students/search/name?name=doe`

#### 12. Search by Email
- **Endpoint**: `GET /api/students/search/email?email={email}`
- **Description**: Search by email containing the keyword
- **Example**: `/api/students/search/email?email=gmail`

#### 13. Get Students by Enrollment Date
- **Endpoint**: `GET /api/students/enrollment-date/{date}`
- **Description**: Get students enrolled on specific date
- **Example**: `/api/students/enrollment-date/2025-06-28`

#### 14. Get Students by Date Range
- **Endpoint**: `GET /api/students/enrollment-date-range?startDate={start}&endDate={end}`
- **Description**: Get students enrolled within date range
- **Example**: `/api/students/enrollment-date-range?startDate=2025-06-01&endDate=2025-06-30`

### 📊 **STATISTICS Operations**

#### 15. Get Total Student Count
- **Endpoint**: `GET /api/students/count`
- **Response**:
```json
{
  "totalCount": 25
}
```

#### 16. Get Count by Date
- **Endpoint**: `GET /api/students/count/date/{date}`
- **Description**: Count students enrolled on specific date
- **Example**: `/api/students/count/date/2025-06-28`

#### 17. Get Count by Date Range
- **Endpoint**: `GET /api/students/count/date-range?startDate={start}&endDate={end}`
- **Description**: Count students enrolled within date range

### 🔧 **UTILITY Operations**

#### 18. Check Email Exists
- **Endpoint**: `GET /api/students/exists/email/{email}`
- **Response**:
```json
{
  "exists": true
}
```

#### 19. Check Student Exists by ID
- **Endpoint**: `GET /api/students/exists/{id}`
- **Response**:
```json
{
  "exists": false
}
```

## Student Model

### Properties
- **id**: `Long` (auto-generated)
- **name**: `String` (2-100 characters, required)
- **email**: `String` (valid email format, unique, required)
- **enrollmentDate**: `LocalDate` (ISO format: YYYY-MM-DD, cannot be future, required)

### Validation Rules
- Name: 2-100 characters, not blank
- Email: Valid email format, unique across all students
- Enrollment Date: Must be today or in the past

### Example Student Object
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "enrollmentDate": "2025-06-28"
}
```

## Error Handling

### Error Response Format
```json
{
  "timestamp": "2025-06-28T11:55:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid input data",
  "path": "/api/students",
  "validationErrors": [
    "name: Name is required",
    "email: Email should be valid"
  ]
}
```

### HTTP Status Codes
- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input or validation error
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate email or data conflict
- `500 Internal Server Error` - Unexpected server error

## Features

### ✅ **Enhanced Features**
1. **Input Validation**: Comprehensive validation with meaningful error messages
2. **Search Functionality**: Multiple search options (name, email, date, general keyword)
3. **Pagination**: Server-side pagination with sorting
4. **Bulk Operations**: Add/delete multiple students
5. **Statistics**: Count operations for analytics
6. **Utility Methods**: Check existence without retrieving full data
7. **Error Handling**: Structured error responses with details
8. **Transaction Support**: All operations are transactional
9. **Data Integrity**: Prevents duplicate emails and maintains consistency
10. **Date Validation**: Enrollment dates cannot be in the future

### 🔄 **CORS Configuration**
The API supports cross-origin requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)

## Usage Examples

### 1. Create a Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "enrollmentDate": "2025-06-28"
  }'
```

### 2. Search Students
```bash
curl "http://localhost:8080/api/students/search?keyword=alice"
```

### 3. Get Paginated Results
```bash
curl "http://localhost:8080/api/students/paginated?page=0&size=5&sortBy=name&sortDir=asc"
```

### 4. Delete a Student
```bash
curl -X DELETE http://localhost:8080/api/students/1
```

### 5. Get Statistics
```bash
curl http://localhost:8080/api/students/count
```

This enhanced API provides a complete foundation for a robust student management system with enterprise-level features!
