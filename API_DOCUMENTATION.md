# Admin API Documentation

Complete reference for the TF2 Trading Bot Admin Panel API.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints (except `/auth/login` and `/health`) require JWT authentication.

### Login

**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Usage**: Include token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Statistics

#### Get Bot Statistics

**Endpoint**: `GET /stats`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "totalUsers": 150,
  "latestStats": {
    "_id": "507f1f77bcf86cd799439011",
    "date": "2024-11-16T10:00:00Z",
    "totalUsers": 150,
    "totalVolume": 125000,
    "totalRevenue": 1875,
    "totalTransactions": 456,
    "keysSold": 1200,
    "keysBought": 900,
    "currentKeyStock": 800,
    "avgTransactionValue": 274,
    "platformStats": {
      "discord": {
        "activeUsers": 145,
        "messages": 5230
      }
    }
  }
}
```

### Users

#### List All Users

**Endpoint**: `GET /users`

**Query Parameters**:
- `page` (default: 1) - Page number
- `limit` (default: 20) - Results per page

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "discordId": "123456789",
      "username": "trader123",
      "email": "user@example.com",
      "emailVerified": true,
      "language": "en",
      "tf2KeyBalance": 50,
      "riskScore": 15,
      "stats": {
        "totalBuys": 10,
        "totalSells": 5,
        "totalKeysPurchased": 75,
        "totalKeysSold": 25,
        "totalVolume": 5000,
        "averageTradeValue": 500
      },
      "createdAt": "2024-11-01T08:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "pages": 8
}
```

#### Get User Details

**Endpoint**: `GET /users/:id`

**Path Parameters**:
- `id` - User MongoDB ID

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "discordId": "123456789",
  "steamId": "76561198123456789",
  "steamTradeLink": "https://steamcommunity.com/tradeoffer/new/?partner=...",
  "email": "user@example.com",
  "emailVerified": true,
  "username": "trader123",
  "language": "en",
  "wallets": [
    {
      "cryptocurrency": "BTC",
      "address": "1A1z7agoat...",
      "balance": 0.5,
      "locked": 0.1
    }
  ],
  "tf2KeyBalance": 50,
  "riskScore": 15,
  "riskFlags": [
    {
      "type": "NEW_ACCOUNT",
      "reason": "Account created less than 1 day ago",
      "timestamp": "2024-11-15T10:00:00Z"
    }
  ],
  "stats": {
    "totalBuys": 10,
    "totalSells": 5,
    "totalKeysPurchased": 75,
    "totalKeysSold": 25,
    "totalVolume": 5000,
    "averageTradeValue": 500
  },
  "createdAt": "2024-11-01T08:00:00Z"
}
```

### Admin Management

#### Update Key Stock

**Endpoint**: `POST /admin/stock`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request**:
```json
{
  "newStock": 2500
}
```

**Response**:
```json
{
  "success": true,
  "newStock": 2500
}
```

#### Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-11-16T10:00:00Z"
}
```

## Error Responses

### 401 - Unauthorized

```json
{
  "error": "Access token required"
}
```

or

```json
{
  "error": "Invalid token"
}
```

### 403 - Forbidden

```json
{
  "error": "Invalid token"
}
```

### 404 - Not Found

```json
{
  "error": "User not found"
}
```

### 400 - Bad Request

```json
{
  "error": "Invalid stock value"
}
```

### 500 - Server Error

```json
{
  "error": "Failed to fetch statistics"
}
```

## Example Usage

### Using cURL

#### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Get Statistics

```bash
curl -X GET http://localhost:3000/api/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### List Users

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

#### Get User Details

```bash
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

#### Update Stock

```bash
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"newStock":2500}'
```

### Using JavaScript (Fetch API)

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});

const { token } = await loginResponse.json();

// Get statistics
const statsResponse = await fetch('http://localhost:3000/api/stats', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const stats = await statsResponse.json();
console.log(stats);

// Get users
const usersResponse = await fetch('http://localhost:3000/api/users?page=1&limit=20', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const users = await usersResponse.json();
console.log(users);
```

### Using Python (Requests)

```python
import requests

# Login
login_response = requests.post(
    'http://localhost:3000/api/auth/login',
    json={'username': 'admin', 'password': 'admin123'}
)
token = login_response.json()['token']

# Get statistics
headers = {'Authorization': f'Bearer {token}'}
stats_response = requests.get('http://localhost:3000/api/stats', headers=headers)
print(stats_response.json())

# List users
users_response = requests.get('http://localhost:3000/api/users?page=1&limit=20', headers=headers)
print(users_response.json())
```

## Response Time

- Authentication: < 100ms
- Statistics: < 500ms
- User list: < 1s (for 20 users)
- User details: < 500ms

## Rate Limiting

No built-in rate limiting yet, but can be configured via Express middleware.

## Authentication Token

- **Type**: JWT (JSON Web Token)
- **Duration**: 24 hours
- **Algorithm**: HS256
- **Payload**: `{ username: 'admin', role: 'admin' }`

## Future Enhancements

- [ ] Role-based access control (admin, moderator, viewer)
- [ ] Rate limiting per user
- [ ] API key authentication
- [ ] Webhook support for events
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and search
- [ ] Batch operations
- [ ] Export functionality

## Support

For API issues:
1. Check logs: `logs/error.log`
2. Verify authentication token is valid
3. Ensure MongoDB connection is working
4. Review endpoint documentation above

---

**API Version**: 1.0.0  
**Last Updated**: November 16, 2024
