# 🍽️ Restaurant RMS – Microservices Monorepo

This is a Node.js-based microservice architecture for a Restaurant Management System.  
It uses **PNPM Workspaces**, **TypeScript**, and **Express**, organized as separate services.

---

## 📦 Monorepo Structure

```bash
restaurant-rms/
├── auth-service/            # Handles authentication & user roles
├── item-service/            # Manages menu items and categories
├── order-service/           # Handles order creation and status updates
├── payment-service/         # Processes payments and refunds
├── notification-service/    # Sends email/SMS/push notifications
├── report-service/          # Generates sales and activity reports
├── pnpm-workspace.yaml      # Workspace config
├── package.json             # Root config with scripts
└── tsconfig.json            # Shared TypeScript config
