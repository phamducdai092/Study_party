# Study Party | Integrated Online Collaborative Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Study Party** is a comprehensive web-based ecosystem designed to facilitate real-time academic collaboration. It integrates high-concurrency communication tools with structured project management features, providing a seamless environment for remote study groups, virtual classrooms, and peer-to-peer mentoring.

---

## Key Features

* **Advanced Video Conferencing:** Low-latency, multi-user video and audio streams powered by **Agora SDK**.
* **Real-time Messaging:** Persistent group and private chat functionality utilizing **WebSocket (STOMP)** for instant data synchronization.
* **Event-Driven Notifications:** High-performance notification system built on **Apache Kafka** to handle asynchronous alerts and system events.
* **Academic Management:** Centralized dashboard for creating study groups, managing shared assignments, and tracking collaborative milestones.
* **Secure Authentication:** Robust Identity and Access Management (IAM) implementation using **Spring Security** and **JSON Web Tokens (JWT)**.
* **Performance Optimization:** Strategic data caching with **Redis** to minimize database load and ensure sub-second response times.

---

## Technical Architecture

### **Backend (Micro-monolith Architecture)**
* **Core:** Java 17+, Spring Boot 3.x
* **Database:** MySQL (Relational persistence), Redis (Distributed caching)
* **Middleware:** Apache Kafka (Message Broker), WebSocket/STOMP (Bidirectional communication)
* **Security:** Spring Security, JWT

### **Frontend (Modern Reactive UI)**
* **Core:** React 19, TypeScript
* **State Management:** Zustand (Client-side state), TanStack Query (Server-side state/caching)
* **Styling:** Tailwind CSS / CSS Modules
* **Media Handling:** Agora Web SDK NG

---

## Project Structure

```bash
tieu_luan/
├── party/               # Java Spring Boot Backend Service
│   ├── src/main/java    # Business logic, Controllers, Entities
│   └── src/main/resources # Application configurations
└── study-party-fe/      # React TypeScript Frontend Application
    ├── src/components   # Modular UI components
    ├── src/hooks        # Custom hooks for API/State logic
    └── src/services     # API abstraction and SDK integrations
```

---
## Installation & Setup
Before running the application, ensure you have the following installed:
### **Prerequisites**
* **Core:** Java 17+, Spring Boot 3.x
* **Database:** MySQL (Relational persistence), Redis (Distributed caching)
* **Middleware:** Apache Kafka (Message Broker), WebSocket/STOMP (Bidirectional communication)
* **Security:** Spring Security, JWT

### **Backend Setup**
* **1.** Navigate to the /party directory:
```bash
cd party
```
* **2.** Configure your environment variables in src/main/resources/application.properties (Database credentials, Kafka brokers, Redis host, etc.).
* **3.** Build and run the service:
```bash
./mvnw clean install
./mvnw spring-boot:run
```
### **Frontend Setup**
* **1.** Navigate to the /study-party-fe directory:
```bash
cd study-party-fe
```
* **2.** Install the necessary dependencies:
```bash
npm i
```

* **3.** Start the development server:
```bash
npm run dev
```
---
## Author
### Pham Duc Dai
Student at NLU( Đại học Nông Lâm tp.HCM)
GitHub: @phamducdai092

---
Developed as a formal Bachelor's Thesis (Tieu Luan) to demonstrate scalable real-time architectures.
