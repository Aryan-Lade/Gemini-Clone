# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All endpoints except `/auth/*` require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### 1. Sign Up

**POST** `/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (201):**

```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://placehold.co/36x36/8a2be2/ffffff?text=A",
    "preferences": {
      "theme": "dark",
      "notifications": true
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error (400):**

```json
{
  "error": "Passwords do not match"
}
```

---

#### 2. Login

**POST** `/auth/login`

Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://placehold.co/36x36/8a2be2/ffffff?text=A",
    "preferences": {
      "theme": "dark",
      "notifications": true
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error (401):**

```json
{
  "error": "Invalid email or password"
}
```

---

#### 3. Logout

**POST** `/auth/logout`

Logout user (token is cleared on frontend).

**Response (200):**

```json
{
  "message": "Logout successful"
}
```

---

### Chat

#### 4. Send Message

**POST** `/chat/message`

Send a message and get AI response.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "message": "What is machine learning?",
  "conversationId": "conv-1234567890-abc123def456" // optional
}
```

**Response (200):**

```json
{
  "success": true,
  "conversationId": "conv-1234567890-abc123def456",
  "message": {
    "role": "assistant",
    "content": "Machine learning is a subset of artificial intelligence...",
    "timestamp": "2024-01-15T10:35:00.000Z"
  }
}
```

**Error (500):**

```json
{
  "error": "Failed to generate response",
  "details": "Gemini API error message"
}
```

---

#### 5. Get All Conversations

**GET** `/chat/conversations`

Get all conversations for the authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `limit` (optional): Number of conversations to return (default: 50)
- `skip` (optional): Number of conversations to skip for pagination (default: 0)

**Response (200):**

```json
{
  "success": true,
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "conversationId": "conv-1234567890-abc123def456",
      "title": "What is machine learning?",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z",
      "messages": [
        {
          "role": "user",
          "content": "What is machine learning?",
          "timestamp": "2024-01-15T10:30:00.000Z"
        },
        {
          "role": "assistant",
          "content": "Machine learning is...",
          "timestamp": "2024-01-15T10:30:30.000Z"
        }
      ]
    }
  ],
  "total": 15,
  "count": 15
}
```

---

#### 6. Get Specific Conversation

**GET** `/chat/conversations/:conversationId`

Get a specific conversation by ID.

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `conversationId`: The conversation ID

**Response (200):**

```json
{
  "success": true,
  "conversation": {
    "_id": "507f1f77bcf86cd799439011",
    "conversationId": "conv-1234567890-abc123def456",
    "title": "What is machine learning?",
    "messages": [
      {
        "role": "user",
        "content": "What is machine learning?",
        "timestamp": "2024-01-15T10:30:00.000Z"
      },
      {
        "role": "assistant",
        "content": "Machine learning is a subset of artificial intelligence...",
        "timestamp": "2024-01-15T10:30:30.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

#### 7. Delete Conversation

**DELETE** `/chat/conversations/:conversationId`

Delete a conversation (soft delete).

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `conversationId`: The conversation ID

**Response (200):**

```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

---

#### 8. Clear Conversation

**POST** `/chat/conversations/:conversationId/clear`

Clear all messages in a conversation.

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `conversationId`: The conversation ID

**Response (200):**

```json
{
  "success": true,
  "message": "Conversation cleared successfully"
}
```

---

### User

#### 9. Get Profile

**GET** `/user/profile`

Get current user profile.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://placehold.co/36x36/8a2be2/ffffff?text=A",
    "preferences": {
      "theme": "dark",
      "notifications": true
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 10. Update Profile

**PUT** `/user/profile`

Update user profile information.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "preferences": {
      "theme": "light",
      "notifications": false
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

#### 11. Change Password

**PUT** `/user/password`

Change user password.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error (401):**

```json
{
  "error": "Current password is incorrect"
}
```

---

### Health Check

#### 12. Health Status

**GET** `/health`

Check if the API is running.

**Response (200):**

```json
{
  "status": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Status Codes

| Code | Description                             |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Missing or invalid token |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Resource already exists      |
| 500  | Internal Server Error - Server error    |

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong",
  "details": "Optional detailed error information (only in development)"
}
```

## Rate Limiting

The API implements rate limiting:

- **Window**: 15 minutes
- **Limit**: 100 requests per IP per window

Exceeding the limit returns a 429 status code:

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

## Usage Examples

### Using cURL

**Sign Up:**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Send Message:**

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello Gemini!"
  }'
```

### Using JavaScript Fetch

**Login:**

```javascript
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "john@example.com",
    password: "password123",
  }),
});

const data = await response.json();
const token = data.token;
```

**Send Message:**

```javascript
const response = await fetch("http://localhost:5000/api/chat/message", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "What is AI?",
  }),
});

const data = await response.json();
console.log(data.message.content);
```
