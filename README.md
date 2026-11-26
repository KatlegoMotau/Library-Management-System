# Library Management System

A Library Management System built using **Java, Spring Boot, React, PostgreSQL, Redis, Apache Kafka, and a microservices architecture**.

The system manages library books, registered members, and borrowing activities through three independent microservices: **Member Service, Book Service, and Borrowing Service**.

An **API Gateway** acts as the single entry point for client requests and routes them to the appropriate microservice.

The application also integrates Redis for book-data caching and Apache Kafka for event-driven communication. When a successful borrowing operation occurs, Kafka distributes a borrowing event that is consumed by the Borrowing Service and forwarded to the administrator dashboard through WebSocket communication.

This project explores microservices architecture, CRUD operations, database relationships, REST API development, service-to-service communication, gRPC, authentication, authorization, input validation, caching, event-driven architecture, real-time notifications, and containerization using Docker.

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
- [Project Status](#project-status)

## Project Overview

The Library Management System consists of three independent microservices and an API Gateway. Each microservice is responsible for a specific business function and manages its own PostgreSQL database.

### 1. Member Service

The Member Service manages registered library members and their account information.

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
| `password` | Member's login credentials, stored securely as a password hash |
| `role` | Defines whether the account belongs to an administrator or a member |

### 2. Book Service

The Book Service manages the library's book inventory.

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

The Book Service also integrates **Redis caching** to improve the retrieval of book information. Frequently requested book details can be served from the cache, reducing repeated database queries and improving response times.

When book information changes, the cache is invalidated or refreshed so that subsequent requests can retrieve updated details.

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

The Borrowing Service also integrates **Apache Kafka** for event-driven communication.

When a book is successfully borrowed, the service publishes a borrowing event to the `book-borrowed` Kafka topic. A Kafka consumer processes the event and forwards it to the administrator dashboard using WebSocket communication.

### 4. API Gateway

The API Gateway acts as the single entry point between the React frontend and the backend microservices.

Instead of communicating directly with individual microservices for REST API requests, the frontend sends requests to the Gateway. The Gateway forwards each request to the appropriate service.

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
- Receive real-time notifications when a book is successfully borrowed.

### Security and Authentication

- Authentication using Spring Security.
- JWT-based authentication.
- Role-based authorization for administrators and members.
- Protected API endpoints.
- WebSocket authentication using JWT.
- Administrator-only access to live activity subscriptions.
- Request validation.
- Password hashing rather than storing plain-text passwords.

### Microservices and Communication

- Independent Member, Book, and Borrowing Services.
- Separate PostgreSQL databases for each service.
- REST API communication between services.
- gRPC communication for service-to-service operations.
- Centralized API routing through Spring Cloud Gateway.
- Redis caching for frequently requested book information.
- Apache Kafka for asynchronous event communication.
- Kafka consumer for processing borrowing events.
- WebSocket and STOMP communication for real-time administrator notifications.

### Real-Time Borrowing Notifications

The system provides live borrowing notifications through an event-driven workflow.

When a member successfully borrows a book:

1. The Borrowing Service processes the borrowing operation.
2. The service publishes a borrowing event to the `book-borrowed` Kafka topic.
3. The Kafka consumer receives the event.
4. The consumer forwards the event to the WebSocket message broker.
5. The administrator dashboard receives the notification through STOMP.
6. The live activity panel updates without requiring a page refresh.

The live activity panel is displayed only on the administrator dashboard.

### Caching with Redis

Redis is used to improve the performance of book-data retrieval.

- Frequently requested book information is cached.
- Cached book details can be retrieved faster than repeatedly querying PostgreSQL.
- Cache invalidation or refresh helps ensure that updated book information is reflected in subsequent requests.
- Redis reduces unnecessary database queries for cached data.

### Containerization

- Individual Docker containers for the backend services.
- Docker Compose for managing the backend services and supporting infrastructure.
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
| Redis | Caching book information |
| Apache Kafka | Event-driven communication |
| Spring Kafka | Kafka producer and consumer integration |
| WebSocket | Real-time communication |
| STOMP | Messaging protocol used for live notifications |
| React | Frontend development |
| Vite | Frontend development server and build tool |
| JavaScript | Frontend programming language |
| Docker | Application containerization |
| Docker Compose | Managing multiple containers |
| Maven | Backend dependency and build management |
| Git and GitHub | Version control and source code management |

## System Architecture

The application follows a microservices architecture in which each backend service is responsible for a specific business function.

The React frontend communicates with the backend through the API Gateway. The Gateway routes requests to the Member, Book, or Borrowing Service.

Each microservice manages its own PostgreSQL database, keeping its data separate from the other services.

The Borrowing Service communicates with the Member and Book Services through REST and gRPC when processing borrowing and returning operations.

Redis is used by the Book Service to cache book information and improve retrieval performance.

Apache Kafka supports asynchronous event communication. Borrowing events are published to Kafka and consumed by the Borrowing Service, which forwards notifications to the administrator dashboard through WebSocket and STOMP.

### Architecture Overview

```text
                         React Frontend
                               |
                               |
                         API Gateway
                         Port 8080
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
        Member Service    Book Service    Borrowing Service
              |                |                |
              v                v                v
          member_db          book_db        borrowing_db
                               |
                               v
                            Redis
                         Book Cache

        Borrowing Service
               |
               | Successful borrowing event
               v
        Kafka: book-borrowed
               |
               v
       Kafka Event Consumer
               |
               v
       WebSocket / STOMP
               |
               v
      Administrator Dashboard
        Live Activity Panel
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
│   ├── Dockerfile
│   └── pom.xml
│
├── book-service/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── borrowing-service/
│   ├── src/
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
- Maven.
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

Redis and Kafka are configured as part of the application's supporting infrastructure.

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

Add the required configuration values:

```env
DB_PASSWORD=your_postgresql_password
JWT_SECRET=your_jwt_secret
```

Replace the example values with your own configuration.

**Important:** Do not commit your `.env` file, database passwords, JWT secrets, or other sensitive configuration values to GitHub.

### 3. Prepare the Databases

Ensure PostgreSQL is running and that the three databases listed in the prerequisites section exist.

The current Docker Compose configuration connects to the PostgreSQL instance running on the host machine through:

```text
host.docker.internal:5432
```

Each service connects to its respective database.

## Running the Application

The backend services and supporting infrastructure are managed through Docker Compose, while the React frontend runs locally.

### 1. Build the Backend Services

Before building the Docker images, package each Spring Boot application.

Run the following commands from the project root.

**Member Service**

```powershell
cd member-service
mvn.cmd clean package -DskipTests
cd ..
```

**Book Service**

```powershell
cd book-service
mvn.cmd clean package -DskipTests
cd ..
```

**Borrowing Service**

```powershell
cd borrowing-service
mvn.cmd clean package -DskipTests
cd ..
```

**API Gateway**

```powershell
cd api-gateway
mvn.cmd clean package -DskipTests
cd ..
```

### 2. Start the Backend and Supporting Services

From the project root directory, run:

```bash
docker compose up -d --build
```

Docker Compose builds and starts the backend containers and the supporting infrastructure defined in the Compose configuration, including Redis and Kafka.

### 3. Verify the Containers

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

The frontend communicates with the backend REST APIs through the API Gateway at:

```text
http://localhost:8080
```

The administrator's live activity panel connects to the Borrowing Service WebSocket endpoint for real-time notifications.

### 5. Stop the Backend Services

To stop the Docker Compose containers:

```bash
docker compose down
```

This command stops and removes the Compose containers. Persistent data depends on the volumes configured in the Compose file.

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
| Borrowing Service (WebSocket) | `ws://localhost:8083/ws` |
| PostgreSQL | `localhost:5432` |

Redis and Kafka are used internally by the backend services through the Docker network. Their connection details are configured through Docker Compose and environment variables.

The frontend should use the API Gateway for REST API requests rather than calling individual microservices directly.

## Important Notes

- Each microservice is independently developed and packaged as a Spring Boot application.
- Each backend service has its own PostgreSQL database.
- The API Gateway is the main entry point for frontend REST requests.
- Protected endpoints require a valid JWT.
- Member and administrator accounts have different authorization permissions.
- Administrator live activity subscriptions require authenticated administrator access.
- Redis is used to cache book information and improve retrieval performance.
- Kafka is used to publish and consume successful borrowing events.
- PostgreSQL currently runs outside Docker on the host machine.
- The backend containers connect to PostgreSQL using `host.docker.internal`.
- Docker Compose manages the backend services and supporting infrastructure.
- The React frontend is started separately.
- To create an administrator account, register first and then update the account's role in the database from `MEMBER` to `ADMIN`, since newly registered accounts are assigned the member role by default.

## Project Status

The Library Management System has been developed using a microservices architecture and configured to run through Docker Compose.

The application includes:

- Member registration and authentication.
- Administrator and member role-based functionality.
- Book management and inventory tracking.
- Borrowing and returning workflows.
- REST and gRPC service-to-service communication.
- Redis caching for book information.
- Kafka-based borrowing event processing.
- WebSocket-based live borrowing notifications for administrators.
- JWT authentication and authorization.
- React frontend integration through the API Gateway.

The main application workflows have been tested, including member and administrator functionality, borrowing and returning operations, service communication, caching, and live borrowing notifications.
