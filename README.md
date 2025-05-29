```markdown
# User Authentication and Profile Routes

This module contains the routes for user authentication and profile management in our Express.js application.

## Routes Overview

### 1. Home / Login Page
- **GET /** 
  - Renders the login page if the user is not authenticated.
  - Renders the user profile if the user is already logged in.

### 2. Login
- **POST /**
  - Handles user login.
  - Expects email and password in the request body.
  - On successful login, sets authentication cookies and renders the user profile.
  - On failure, re-renders the login page with an error message.

### 3. Signup Page
- **GET /signup**
  - Renders the signup page for new users.
  - If user is already logged in, redirects to the user profile.

### 4. User Registration
- **POST /signup**
  - Handles new user registration.
  - Expects fullname, email, date of birth, gender, and password in the request body.
  - Creates a new user account and redirects to the login page on success.
  - Re-renders the signup page with an error message if registration fails.

### 5. User Profile
- **GET /userprofile**
  - Renders the user's profile page.
  - Requires authentication.
  - Displays user details fetched from the database.

### 6. Logout
- **GET /logout**
  - Logs out the current user.
  - Clears authentication cookies and redirects to the home page.

## Authentication

Most routes require authentication. The application uses JSON Web Tokens (JWT) for authentication, stored in HTTP-only cookies.

## Error Handling

- All routes include error handling to provide appropriate feedback to users.
- 404 errors are handled by rendering a custom 404 page.

## Usage

To use these routes, ensure that the router is properly imported and used in your main Express application file:

```javascript
const router = require('./path/to/routes');
app.use('/', router);
```

## API Documentation

For detailed API documentation, including request/response formats and examples, refer to the Swagger documentation available at `/api-docs` when running the application.

```

This README provides a comprehensive overview of the routes in your application, their purposes, and how they should be used. It also includes information about authentication, error handling, and how to integrate the router into the main application.
