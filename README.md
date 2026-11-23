# Library Management System

A Library Management System built using **Spring Boot, Java, React, PostgreSQL, and a microservices architecture**. The system manages library books, registered members, and borrowing activities through three independent microservices: Member Service, Book Service, and Borrowing Service.

An API Gateway acts as the single entry point for client requests and routes them to the appropriate microservice.

This project explores microservices architecture, CRUD operations, database relationships, REST API development, service-to-service communication, gRPC, authentication, authorization, input validation, and containerization using Docker.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Application URLs and Ports](#application-urls-and-ports)
- [Important Notes](#important-notes)

## Project Overview

The Library Management System consists of three independent microservices and an API Gateway. Each microservice has its own responsibility and database.

### 1. Member Service

The Member Service is responsible for managing registered library members and their account information.

It handles member registration, authentication, member details, and account status management.

Each member record contains the following attributes:

| Attribute | Description |
|---|---|
| `id` | Unique member identifier |
| `firstName` | Member's first name |
| `lastName` | Member's last name |
| `email` | Member's email address |
| `contact` | Member's contact number |
| `memberNumber` | Unique membership number |
| `status` | Indicates whether the member account is active |
| `password` | Member's login credentials (stored securely as a password hash) |
| `role` | Defines whether the account belongs to an administrator or a member |

### 2. Book Service

The Book Service is responsible for managing the library's book inventory.

It provides functionality for adding, retrieving, updating, and managing books, as well as tracking the number of available copies.

Each book record contains the following attributes:

| Attribute | Description |
|---|---|
| `id` | Unique book identifier |
| `title` | Book title |
| `author` | Book author |
| `isbn` | International Standard Book Number |
| `category` | Category the book belongs to |
| `totalCopies` | Total number of copies owned by the library |
| `availableCopies` | Number of copies currently available for borrowing |

### 3. Borrowing Service

The Borrowing Service manages the borrowing and returning of books.

It coordinates borrowing activities between the Member Service and Book Service. It communicates with these services to validate member information and check or update book availability.

Each borrowing record contains the following attributes:

| Attribute | Description |
|---|---|
| `id` | Unique borrowing identifier |
| `memberId` | Identifier of the member borrowing the book |
| `bookId` | Identifier of the borrowed book |
| `borrowingDate` | Date the book was borrowed |
| `dueDate` | Date the book should be returned |
| `returnDate` | Date the book was returned |
| `status` | Current status of the borrowing record |

### 4. API Gateway

The API Gateway acts as the single entry point between the React frontend and the backend microservices.

Instead of communicating directly with individual microservices, the frontend sends requests to the Gateway. The Gateway forwards each request to the appropriate service.

The Gateway handles routing for:

- `/api/members/**` → Member Service
- `/api/books/**` → Book Service
- `/api/borrowings/**` → Borrowing Service

This approach provides a central point for handling client requests and simplifies communication between the frontend and backend.

## Features

### Member Features

- Register a library member account.
- Log in using registered credentials.
- View personal account information.
- Browse available books.
- View borrowing history.
- Borrow books.
- Return borrowed books.

### Administrator Features

- Log in using an administrator account.
- View registered library members.
- View member account information.
- Activate and deactivate member accounts.
- View borrowing records and borrowing history.
- Add new books to the library.
- Manage existing book records.
- Monitor book availability.

### Security and Authentication

- Authentication using Spring Security.
- JWT-based authentication.
- Role-based authorization for administrators and members.
- Protected API endpoints.
- Request validation.
- Password hashing rather than storing plain-text passwords.

### Microservices and Communication

- Independent Member, Book, and Borrowing Services.
- Separate PostgreSQL databases for each service.
- REST API communication between services.
- gRPC communication for book and member operations.
- Centralized API routing through Spring Cloud Gateway.

### Containerization

- Individual Docker containers for each backend service.
- Docker Compose for managing the backend services.
- Shared Docker network for inter-service communication.
- Environment variables for application configuration and sensitive values.

## Technologies Used

| Technology | Purpose |
|---|---|
| Java | Backend programming language |
| Spring Boot | Backend application development |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database operations |
| Hibernate | Object-relational mapping |
| Spring Cloud Gateway | API Gateway and request routing |
| REST APIs | Communication between services |
| gRPC | Service-to-service communication |
| Protocol Buffers | gRPC service definitions and messages |
| PostgreSQL | Relational database management |
| React | Frontend development |
| Vite | Frontend development server and build tool |
| JavaScript | Frontend programming language |
| Docker | Application containerization |
| Docker Compose | Managing multiple backend containers |
| Maven | Backend dependency and build management |
| Git and GitHub | Version control and source code management |

## System Architecture

The application follows a microservices architecture in which each backend service is responsible for a specific business function.

The React frontend communicates with the backend through the API Gateway. The Gateway routes requests to the Member, Book, or Borrowing Service.

Each microservice manages its own database, keeping its data separate from the other services.

The Borrowing Service communicates with the Member and Book Services through REST and gRPC when processing borrowing and returning operations.

### Architecture Overview

```text
                  React Frontend
                        |
                        |
                  API Gateway
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
     Member Service  Book Service  Borrowing Service
          |             |             |
          v             v             v
      member_db       book_db      borrowing_db

                 Service-to-Service
                 REST and gRPC
```

### Database Architecture

Each microservice uses a separate PostgreSQL database:

- `member_db` – Stores library member information.
- `book_db` – Stores book and inventory information.
- `borrowing_db` – Stores borrowing and return records.

This separation allows each service to manage its own data independently.

## Project Structure

The repository is organized into separate directories for the frontend, API Gateway, and backend microservices.

```text
Library-Management-System/
│
├── api-gateway/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── member-service/
│   ├── src/
│   ├── target/
│   ├── Dockerfile
│   └── pom.xml
│
├── book-service/
│   ├── src/
│   ├── target/
│   ├── Dockerfile
│   └── pom.xml
│
├── borrowing-service/
│   ├── src/
│   ├── target/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .env
├── .gitignore
└── docker-compose.yml
```

Each backend service is an independent Spring Boot application with its own Maven configuration and Dockerfile.

## Prerequisites

Before running the application, ensure the following tools are installed:

- Java Development Kit (JDK).
- Maven (the project also includes Maven Wrapper scripts).
- Node.js and npm.
- PostgreSQL.
- Docker Desktop.
- Git.

You should also have the following PostgreSQL databases created:

```text
member_db
book_db
borrowing_db
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KatlegoMotau/Library-Management-System.git
```

Navigate into the project directory:

```bash
cd Library-Management-System
```

### 2. Configure Environment Variables

Create a `.env` file in the project root directory.

Add the required configuration:

```env
DB_PASSWORD=your_postgresql_password
JWT_SECRET=your_jwt_secret
```

Replace the example values with your own configuration.


### 3. Prepare the Databases

Ensure PostgreSQL is running and that the three databases listed in the prerequisites section exist.

The current Docker Compose configuration connects to the PostgreSQL instance running on the host machine through:

```text
host.docker.internal:5432
```

Each service connects to its respective database.

## Running the Application

The backend services are managed through Docker Compose, while the React frontend runs locally.

### 1. Build the Backend Services

Before building the Docker images, package each Spring Boot application.

Run the following commands from the project root:

**Member Service**

```powershell
cd member-service
.\mvnw.cmd clean package -DskipTests
cd ..
```

**Book Service**

```powershell
cd book-service
.\mvnw.cmd clean package -DskipTests
cd ..
```

**Borrowing Service**

```powershell
cd borrowing-service
.\mvnw.cmd clean package -DskipTests
cd ..
```

**API Gateway**

```powershell
cd api-gateway
.\mvnw.cmd clean package -DskipTests
cd ..
```

### 2. Start the Backend Using Docker Compose

From the project root directory, run:

```bash
docker compose up -d --build
```

Docker Compose builds the backend images and starts the four containers.

### 3. Verify the Backend Containers

Run:

```bash
docker compose ps
```

To view application logs:

```bash
docker compose logs -f
```


### 4. Start the React Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

The frontend communicates with the backend through the API Gateway at `http://localhost:8080`.

### 5. Stop the Backend Services

To stop the Docker Compose containers:

```bash
docker compose down
```


## Application URLs and Ports

| Application / Service | URL / Port |
|---|---|
| React Frontend | `http://localhost:5173` |
| API Gateway | `http://localhost:8080` |
| Member Service (HTTP) | `http://localhost:8081` |
| Member Service (gRPC) | `localhost:9091` |
| Book Service (HTTP) | `http://localhost:8082` |
| Book Service (gRPC) | `localhost:9092` |
| Borrowing Service (HTTP) | `http://localhost:8083` |
| PostgreSQL | `localhost:5432` |

The frontend should use the API Gateway rather than calling the individual microservices directly.

## Important Notes

- Each microservice is independently developed and packaged as a Spring Boot application.
- Each backend service has its own PostgreSQL database.
- The API Gateway is the main entry point for frontend requests.
- Protected endpoints require a valid JWT.
- Member and administrator accounts have different authorization permissions.
- PostgreSQL currently runs outside Docker on the host machine. The backend containers connect to it using `host.docker.internal`.
- Docker Compose manages the four backend services; the React frontend is started separately.
- To create an Admin account, you need to register first then go the database and **update the role from MEMBER to ADMIN** as all registered accounts are MEMBER by default.

## Project Status

The backend microservices have been containerized and configured to run together using Docker Compose. The React frontend continues to run locally and communicates with the backend through the API Gateway.

The application has been tested with member and administrator login workflows, book management, and borrowing operations.

