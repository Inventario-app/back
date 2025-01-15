# Inventario - Backend

## Description

Inventario is a backend API for managing inventory, built with Node.js,
Hapi.js, Sequelize, and MySQL. This project is part of a full-stack application
to help track inventory items, transactions, and users in a kitchen.

## Dependencies

- Hapi.js: Web framework for building the server and routes.
- Sequelize: ORM for interacting with MySQL databases.
- MySQL2: MySQL database driver for Node.js.
- jsonwebtoken (JWT): Authentication mechanism for securing routes.
- Argon2: For hashing passwords.
- Joi: Schema-based validation for request data.

## Features

- **User Management**: Create, read, update, and delete user profiles.
- **Location Management**: Manage kitchen locations and their associated items.
- **Item Management**: Track items across various locations with detailed information.
- **Transaction Processing**: Record and manage inventory transactions, including additions and deductions.
- **Role-Based Access Control**: Implement role-based access to ensure appropriate permissions for different user roles.

## Data Schema Visualization:

### 1.Location Table

- Tracks physical or logical storage places.

| `id` | `name`       |
| ---- | ------------ |
| 1    | Main Kitchen |
| 2    | Pantry       |

### 2.Users Table

- Tracks users and their roles.

| `id` | `name`  | `email`             | `password` | `role`  | `locationId` |
| ---- | ------- | ------------------- | ---------- | ------- | ------------ |
| 1    | Alice   | alice@example.com   | hashed_pw  | manager | 1            |
| 2    | Bob     | bob@example.com     | hashed_pw  | staff   | 1            |
| 3    | Charlie | charlie@example.com | hashed_pw  | manager | 2            |

**Explanation**:

- Alice and Bob belong to the Main Kitchen.
- Charlie belongs to the Pantry.

### 3.Items Table

| `id` | `name` | `totalQuantity` |
| ---- | ------ | --------------- |
| 1    | Rice   | 50              |
| 2    | Sugar  | 30              |

-Track all items and their total quantities

### 4. Items Location Table

| `id` | `itemId` | `locationId` | `quantity` |
| ---- | -------- | ------------ | ---------- |
| 1    | 1        | 1            | 20         |
| 2    | 1        | 2            | 30         |
| 3    | 2        | 1            | 15         |
| 4    | 2        | 2            | 15         |

- Tracks item quantities at specific locations (Many-to-Many).
  **Explanation**:
- Rice (ID: 1) has:
  - 20 units in the Main Kitchen (ID: 1).
  - 30 units in the Pantry (ID: 2).
- Sugar (ID: 2) has:

  - 15 units in both locations.

  ### 5. Transactions Table

  | `id` | `itemId` | `userId` | `locationId` | `quantityChanged` | `transactionType` | `timestamp`         |
  | ---- | -------- | -------- | ------------ | ----------------- | ----------------- | ------------------- |
  | 1    | 1        | 1        | 1            | 10                | add               | 2025-01-13 12:00:00 |
  | 2    | 2        | 2        | 1            | -5                | remove            | 2025-01-13 12:30:00 |

  - Tracks changes made to item quantities, associated with users and locations.

**Explanation**:

- Transaction 1: Alice added 10 units of Rice in the Main Kitchen.
- Transaction 2: Bob removed 5 units of Sugar in the Main Kitchen.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Inventario-app/back.git
   cd back
   ```

2. **Install Dependencies**:

```bash
    npm install
```

3. **Configure MySQL Database** :

Create a MySQL database for the project.

```
Set up your .env file with the following variables:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=inventario
JWT_SECRET=your_jwt_secret_ke
PORT=3000
```

4. ** Start Server**:
   ```bash
   npm start
   ```

- The server will start on the specified port (default is 3000).

## API Usage

The API provides the following endpoints:

### User Management

**GET /users**: Retrieve a list of all users.

- Response:

```json
[
  {
    "id": 1,
    "userName": "john_doe",
    "email": "john@example.com",
    "role": "manager",
    "locationId": 2
  },
  {
    "id": 2,
    "userName": "jane_smith",
    "email": "jane@example.com",
    "role": "staff",
    "locationId": 1
  }
]
```

**POST /users**: Create a new user.

- Request Body:

```json
{
  "userName": "new_user",
  "email": "newuser@example.com",
  "password": "securepassword",
  "role": "staff",
  "locationId": 1
}
```

- Response:

```json
{
  "id": 3,
  "userName": "new_user",
  "email": "newuser@example.com",
  "role": "staff",
  "locationId": 1
}
```

**PUT /users/{id}**: Update an existing user.

- Request Body:

```json
{
  "username": "updated_user",
  "email": "updateduser@example.com",
  "role": "manager",
  "locationId": 2
}
```

- Response:

```json
{
  "id": 3,
  "username": "updated_user",
  "email": "updateduser@example.com",
  "role": "manager",
  "locationId": 2
}
```

- **DELETE /users/{id}**: Delete a user.

- Response:

```json
{
  "message": "User deleted successfully"
}
```

### Location Management

**GET /locations**: Retrieve a list of all locations.

- Response:

```json
[
  {
    "id": 1,
    "name": "Main Kitchen"
  },
  {
    "id": 2,
    "name": "Storage Room"
  }
]
```

**POST /locations**: Create a new location.

- Request Body:

```json
{
  "name": "New Location"
}
```

- Response:

```json
{
  "id": 3,
  "name": "New Location"
}
```

**PUT /locations/{id}**: Update an existing location.

- Request Body:

```json
{
  "name": "Updated Location"
}
```

- Response:

```json
{
  "id": 3,
  "name": "Updated Location"
}
```

**DELETE /locations/{id}:** Delete a location.

- Response:

```json
{
  "message": "Location deleted successfully"
}
```

### Item Management

**GET /items:** Retrieve a list of all items.
Response:

```json
[
  {
    "id": 1,
    "name": "Tomato",
    "description": "Fresh red tomatoes",
    "locations": [
      {
        "locationId": 1,
        "quantity": 100
      },
      {
        "locationId": 2,
        "quantity": 50
      }
    ]
  },
  {
    "id": 2,
    "name": "Onion",
    "description": "Yellow onions",
    "locations": [
      {
        "locationId": 1,
        "quantity": 200
      }
    ]
  }
]
```

**POST /items:** Create a new item.

- Request Body:

```json
{
  "name": "Garlic",
  "description": "Fresh garlic cloves"
}
```

- Response:

```json
{
  "id": 3,
  "name": "Garlic",
  "description": "Fresh garlic cloves"
}
```

**PUT /items/{id}**: Update an existing item.

- Request Body:

```json
{
  "name": "Updated Garlic",
  "description": "Organic garlic cloves"
}
```

- Response:

```json
{
  "id": 3,
  "name": "Updated Garlic",
  "description": "Organic garlic cloves"
}
```

**DELETE /items/{id}:** Delete an item.

- Response:

```json
{
  "message": "Item deleted successfully"
}
```

### Transaction Processing

**GET /transactions**: Retrieve a list of all transactions.

- Response:

```json
[
  {
    "id": 1,
    "itemId": 1,
    "userId": 2,
    "locationId": 1,
    "quantityChanged": 10,
    "transactionType": "addition",
    "timestamp": "2025-01-15T15:22:12Z"
  },
  {
    "id": 2,
    "itemId": 2,
    "userId": 1,
    "locationId": 2,
    "quantityChanged": 5,
    "transactionType": "deduction",
    "timestamp": "2025-01-14T14:20:10Z"
  }
]
```

**POST /transactions:** Create a new transaction.

- Request Body:

```json
{
  "itemId": 1,
  "userId": 2,
  "locationId": 1,
  "quantityChanged": 10,
  "transactionType": "addition"
}
```

Response:

```json
{
  "id": 3,
  "itemId": 1,
  "userId": 2,
  "locationId": 1,
  "quantityChanged": 10,
  "transactionType": "addition",
  "timestamp": "2025-01-15T15:22:12Z"
}
```
