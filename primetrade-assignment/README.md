# Primetrade.ai Intern Assignment - Scalable Backend API

This repository contains a full-stack, scalable REST API ecosystem built with Node.js, Express, MongoDB, and React, designed to meet the core requirements of the Primetrade.ai Backend Developer Intern assignment.

---

## 🐳 Full-Stack Local Deployment via Docker

This entire application (MongoDB, Node.js Backend, and React Frontend) is fully containerized. The Docker Compose configuration seamlessly orchestrates all three services for a consistent development and deployment environment.

> ⚠️ **IMPORTANT EVALUATION NOTE**
> This application utilizes an internal Vite Dev Server Proxy configured specifically for Docker container-to-container networking (`http://backend:5000`) to completely eliminate cross-origin resource sharing (CORS) issues in cloud environments. 
> 
> **You MUST spin up the application using Docker Compose for the network routing to function correctly.**

### Prerequisites
* Docker and Docker Compose installed on your host machine.
* Ensure the following local ports are available and not occupied by other services:
  * `5173` (Frontend UI Client)
  * `5000` (Backend REST API)
  * `27017` (MongoDB Instance)

### Running the Application

1. Open your terminal and navigate to the root project directory containing the `docker-compose.yml` file.
2. Build the images and launch the container ecosystem in detached mode by running:
   ```Bash
   docker-compose up -d --build 
   ```

### System Observability & Logging
Real-time system observability is integrated directly into the backend using morgan HTTP middleware configured for dev stream tracking. This outputs automated, color-coded records of server events directly into the container logs.

To view live API traffic streams, incoming requests, response payloads, status codes, and latency measurements, execute:

```Bash
docker-compose logs -f backend
```
### Access the Application:

* Frontend UI: Open your browser and go to  http://localhost:5173

* Backend API: Live and accessible at http://localhost:5000

* MongoDB: Running locally on mongodb://localhost:27017

## Scalability & Deployment Readiness

To ensure this application can handle increasing traffic and data loads, the following architectural choices and future roadmap items have been considered:

1.  **Stateless Authentication (JWT):** By using JWTs, the backend is strictly stateless. This allows for horizontal scaling (Load Balancing) across multiple server instances without worrying about sticky sessions.
2.  **Database Indexing:** Ensure fields queried frequently (like `user` in the Task schema or `email` in the User schema) are indexed in MongoDB.
3.  **Future Caching Layer (Redis):** For heavily read endpoints (like user dashboards), implementing a Redis cache layer would significantly reduce database hit rates.
4.  **Rate Limiting:** Integrating `express-rate-limit` would protect APIs against brute force and DDoS attacks.
5.  **Microservices Readiness:** The current monolithic architecture is heavily modularized (`controllers`, `routes`, `models`). If the "Task" entity grows into a massive service, it can be seamlessly decoupled into its own microservice interacting via event buses or API gateways.