# Smart Bench Management System

A comprehensive system for managing workforce bench time, skill development, and project assignments.

## Features

- **Employee Management**
  - Track bench status and duration
  - Skill profile management
  - Project history
  - Training progress

- **Project Management**
  - Project requirements tracking
  - Team allocation
  - Skill matching
  - Resource utilization

- **Training Programs**
  - Skill development courses
  - Certification tracking
  - Progress monitoring
  - Personalized learning paths

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/smart-bench
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development

   # Email Configuration
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── models/          # Database models
├── controllers/     # Request handlers
├── routes/         # API routes
├── services/       # Business logic
├── middleware/     # Custom middleware
├── utils/          # Helper functions
└── config/         # Configuration files
```

## API Endpoints

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/bench` - List employees on bench
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee details

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project details
- `GET /api/projects/matching/:employeeId` - Get matching projects for employee

### Training Programs
- `GET /api/training` - List all training programs
- `POST /api/training` - Create new training program
- `GET /api/training/recommended/:employeeId` - Get recommended training for employee

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 