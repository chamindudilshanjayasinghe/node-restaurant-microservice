# 🍽️ Restaurant RMS – Microservices Monorepo

A **Restaurant Management System (RMS)** built with **Node.js microservices**,  
designed for an **online ordering platform**.  

It integrates **Stripe** for payments, **MongoDB** for data storage, and follows the **Repository Pattern** for clean business logic separation.

---

## 🏗️ System Architecture

```text
                        ┌───────────────────┐
                        │   API Gateway     │  (future)
                        └─────────┬─────────┘
                                  │
              ┌───────────────────┼─────────────────────┐
              │                   │                     │
       ┌──────▼───────┐    ┌──────▼────────┐     ┌──────▼────────┐
       │ Auth Service │    │ Order Service │     │ Payment Service│
       │ (Users, JWT) │    │ (Orders CRUD) │     │ (Stripe, Audit)│
       └──────┬───────┘    └──────┬────────┘     └──────┬────────┘
              │                   │                     │
              │                   │                     │
       ┌──────▼───────┐    ┌──────▼────────┐     ┌──────▼────────┐
       │ Item Service │    │ Report Service│     │ Notification   │
       │ (Menu Mgmt)  │    │ (Sales, Stats)│     │ Service (Email │
       └──────────────┘    └───────────────┘     │  SMS, Push)    │
                                                 └───────────────┘

Shared across all services:
- MongoDB for persistence
- Common package (DTOs, validation, utils)
- Express + TypeScript

📦 Monorepo Structure

restaurant-rms/
├── auth-service/            # Authentication & user roles
├── item-service/            # Menu items & categories
├── order-service/           # Orders & order status updates
├── payment-service/         # Stripe payments & refunds
├── notification-service/    # Email, SMS & push notifications
├── report-service/          # Sales & activity reports
├── common/                  # Shared DTOs, middlewares, utils
├── pnpm-workspace.yaml      # Workspace config
├── package.json             # Root scripts & dependencies
└── tsconfig.json            # Shared TypeScript config

📐 Service Design Pattern

┌──────────────┐
│   Routes     │  → Maps endpoints to controllers
└──────┬───────┘
       │
┌──────▼───────┐
│ Controller   │  → Validates requests, calls repository
└──────┬───────┘
       │
┌──────▼───────┐
│ Repository   │  → Business logic & DB interaction
└──────┬───────┘
       │
┌──────▼───────┐
│  MongoDB     │  → Mongoose models per service
└──────────────┘
