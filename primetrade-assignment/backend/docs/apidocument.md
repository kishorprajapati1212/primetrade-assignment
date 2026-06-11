# Primetrade.ai Backend API Documentation

**Base URL:** `http://localhost:5000/api/v1`

---

## 🔐 1. Authentication Endpoints

### Register a New User
* **URL:** `/auth/register`
* **Method:** `POST`
* **Description:** Creates a new user account and returns a JWT token.
* **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER"  // Optional: defaults to USER. Can be ADMIN.
  }