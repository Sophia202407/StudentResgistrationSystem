# Student Registration System

A full-stack web application for managing student registrations, built with React frontend and Spring Boot backend.

## Features

### Frontend (React + Vite)
- ✅ **Modern UI/UX**: Clean, responsive design with gradient backgrounds and smooth animations
- ✅ **CRUD Operations**: Create, Read, Update student records
- ✅ **Form Validation**: Client-side validation with real-time feedback
- ✅ **Error Handling**: Comprehensive error messages with user-friendly alerts
- ✅ **Loading States**: Visual feedback during API calls
- ✅ **Success Messages**: Confirmation notifications for successful operations
- ✅ **Responsive Design**: Mobile-friendly layout that works on all screen sizes
- ✅ **Edit Mode**: In-place editing with cancel functionality
- ✅ **Data Refresh**: Manual refresh button and automatic updates

### Backend (Spring Boot + H2 Database)
- ✅ **REST API**: RESTful endpoints for student management
- ✅ **H2 In-Memory Database**: Perfect for development and testing
- ✅ **Data Validation**: Server-side validation with custom exceptions
- ✅ **CORS Configuration**: Cross-origin support for frontend integration
- ✅ **Error Handling**: Global exception handling with meaningful error messages
- ✅ **JPA/Hibernate**: Object-relational mapping with automatic schema generation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Create a new student |
| PUT | `/api/students/{id}` | Update an existing student |

## Student Model

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "enrollmentDate": "2025-06-28"
}
```

## Technology Stack

### Frontend
- **React 19.1.0**: Modern UI library with hooks
- **Vite 7.0.0**: Fast build tool and development server
- **Axios 1.10.0**: HTTP client for API calls
- **CSS3**: Custom styling with Flexbox and Grid
- **ES6+**: Modern JavaScript features

### Backend
- **Spring Boot 2.7.18**: Java web framework
- **Spring Data JPA**: Object-relational mapping
- **H2 Database**: In-memory database for development
- **Maven**: Dependency management and build tool
- **Java 11+**: Programming language

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Java 11+ and Maven
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd registration
```

### 2. Start the Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/student-registration-0.0.1-SNAPSHOT.jar
```
The backend will start on `http://localhost:8080`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## Development

### Backend Development
- **Main Application**: `src/main/java/com/example/registration/RegistrationApplication.java`
- **Controller**: `src/main/java/com/example/registration/controller/StudentController.java`
- **Service**: `src/main/java/com/example/registration/service/StudentService.java`
- **Model**: `src/main/java/com/example/registration/model/Student.java`
- **Repository**: `src/main/java/com/example/registration/repository/StudentRepository.java`

### Frontend Development
- **Main Component**: `src/App.jsx`
- **Styles**: `src/App.css`
- **Index**: `src/main.jsx`

### Database Access
When the backend is running, you can access the H2 console at:
- **URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:devdb`
- **Username**: `sa`
- **Password**: (leave empty)

## Testing

### Run Backend Tests
```bash
cd backend
mvn test
```

### Run Frontend in Development Mode
```bash
cd frontend
npm run dev
```

## Building for Production

### Build Backend
```bash
cd backend
mvn clean package
```

### Build Frontend
```bash
cd frontend
npm run build
```

## Project Structure

```
registration/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/registration/
│   │   │   │   ├── controller/StudentController.java
│   │   │   │   ├── service/StudentService.java
│   │   │   │   ├── model/Student.java
│   │   │   │   ├── repository/StudentRepository.java
│   │   │   │   ├── exception/
│   │   │   │   └── RegistrationApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       ├── java/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── target/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## Features Implemented

### ✅ Frontend Improvements
1. **Professional UI Design**: Modern gradient headers, card-based layout
2. **Form Enhancement**: Proper labels, validation, and error states
3. **Table Improvements**: Hover effects, edit highlighting, responsive design
4. **User Experience**: Loading states, success messages, error handling
5. **Mobile Responsive**: Works seamlessly on all device sizes
6. **Edit Functionality**: Click edit to modify student records
7. **Real-time Feedback**: Immediate validation and error messages

### ✅ Backend Enhancements
1. **Database Configuration**: H2 in-memory database for easy development
2. **CORS Setup**: Proper cross-origin configuration for multiple ports
3. **Error Handling**: Custom exceptions with meaningful messages
4. **API Documentation**: Clear endpoint structure and responses
5. **Test Configuration**: Separate test database configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please create an issue in the repository.
