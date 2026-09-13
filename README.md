# Course Planner

Course Planner is a full-stack web application designed to help all students organise their courses across different terms and academic years.

Students will be able to search for courses, build a personalised study plan across terms and academic years, and move or remove courses as their degree plan changes. The project also aims to build a reusable course catalogue so that course information does not need to be entered repeatedly.

## Project Status

The project is currently in early backend development.

Completed:

- Student registration with input validation
- Secure password hashing with bcrypt
- Student login and password verification
- Retrieval of authenticated student details
- Updating authenticated student details with input validation
- Secure student password updates with password history checks
- Student logout with session invalidation
- UUID-based authenticated sessions
- JSON file persistence for local development
- Complete authentication and session-management REST API
- Unit and HTTP integration tests for authentication

In progress:

- Planning the course catalogue and study-plan features

Planned next:

- Course catalogue and course search
- Personal study plans grouped by year and term
- Adding courses to a study plan
- Moving courses between terms
- Removing or replacing planned courses
- Frontend interface for viewing and editing a plan

## MVP Scope

The first usable version of Course Planner will allow a student to:

1. Register and log in.
2. Search or browse available courses.
3. Add a course to a year and term in their study plan.
4. Move a planned course to another term.
5. Remove a course from their plan.
6. Return later and retrieve the saved plan.

More advanced features, such as community-contributed course data, prerequisite checking, a relational database, CI/CD and deployment, will be considered after the MVP is complete.

## Tech Stack

### Backend

- Node.js
- TypeScript
- Express
- bcrypt for password hashing
- UUID for session identifiers
- Validator for email validation
- JSON file storage during early development

### Testing

- Vitest
- Node.js `fetch` for HTTP integration tests

### Frontend

Frontend development has not started yet. The intended frontend will provide a visual study-plan editor for courses, terms and academic years.

## Project Structure

```text
Course-Planner/
├── backend/
│   ├── src/
│   │   ├── auth.ts             # Authentication business logic
│   │   ├── dataStore.ts        # Data types and JSON persistence
│   │   ├── helper.ts           # Validation and ID helpers
│   │   ├── requestHelpers.ts   # HTTP helpers used by integration tests
│   │   └── server.ts           # Express server and API routes
│   ├── test/
│   │   └── auth.test.ts        # Authentication unit and HTTP tests
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Reserved for frontend development
└── README.md
```

## Getting Started

### Requirements

- Node.js 18 or later
- npm

### Install dependencies

```bash
cd backend
npm install
```

### Start the backend server

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3000
```

### Run tests

The HTTP integration tests require the backend server to be running. Keep `npm run dev` open in one terminal, then run the following in another terminal:

```bash
npm test
```

### Run the TypeScript check

```bash
npx tsc --noEmit
```

## API Endpoints

### Register a student

```http
POST /v1/admin/auth/register
Content-Type: application/json
```

Example request body:

```json
{
  "email": "z5678705@unsw.edu.au",
  "password": "abc123~!@",
  "nameFirst": "Alan",
  "nameLast": "Guo",
  "programName": "Computer Science",
  "age": 20
}
```

Successful response:

```json
{
  "controlUserSessionId": "generated-session-uuid"
}
```

### Log in

```http
POST /v1/admin/auth/login
Content-Type: application/json
```

Example request body:

```json
{
  "email": "z5678705@unsw.edu.au",
  "password": "abc123~!@"
}
```

Successful response:

```json
{
  "controlUserSessionId": "generated-session-uuid"
}
```

### Get student details

```http
GET /v1/admin/studentuser/details
controlUserSessionId: generated-session-uuid
```

Successful response:

```json
{
  "user": {
    "studentId": 1,
    "name": "Alan Guo",
    "age": 20,
    "email": "z5678705@unsw.edu.au",
    "programName": "Computer Science",
    "numSuccessfulLogins": 1,
    "numFailedPasswordsSinceLastLogin": 0
  }
}
```

### Update student details

```http
PUT /v1/admin/studentuser/details
Content-Type: application/json
controlUserSessionId: generated-session-uuid
```

Example request body:

```json
{
  "email": "z5567980@unsw.edu.au",
  "nameFirst": "Eric",
  "nameLast": "Wang",
  "age": 21,
  "programName": "Electrical Eng"
}
```

Successful response:

```json
{}
```

### Update student password

```http
PUT /v1/admin/studentuser/password
Content-Type: application/json
controlUserSessionId: generated-session-uuid
```

Example request body:

```json
{
  "oldPassword": "abc123~!@",
  "newPassword": "newPassword123!"
}
```

Successful response:

```json
{}
```

### Log out

```http
POST /v1/admin/auth/logout
controlUserSessionId: generated-session-uuid
```

Successful response:

```json
{}
```

Invalid authentication or student account requests return an error response with an appropriate HTTP status code:

```json
{
  "error": "Error description"
}
```

## Development Approach

Features are developed as complete vertical slices. Each feature should include:

1. DataStore types and persistence changes
2. Business logic
3. Unit tests
4. An Express route
5. A request helper
6. HTTP integration tests

This keeps each endpoint independently testable before development moves to the next feature.
