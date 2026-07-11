Yes. This is actually the **best approach** for Antigravity.

Instead of giving it prompts every time, place a set of `.md` files in the project root. Antigravity will use them as the project's source of truth and generate code consistently.

## Recommended project structure

```text
owncart-web/
│
├── .antigravity/
│
├── docs/
│   ├── 00_PROJECT_OVERVIEW.md
│   ├── 01_ARCHITECTURE.md
│   ├── 02_TECH_STACK.md
│   ├── 03_FOLDER_STRUCTURE.md
│   ├── 04_API_RULES.md
│   ├── 05_AUTHENTICATION.md
│   ├── 06_STATE_MANAGEMENT.md
│   ├── 07_UI_DESIGN_SYSTEM.md
│   ├── 08_HOME_PAGE.md
│   ├── 09_PRODUCT_MODULE.md
│   ├── 10_CART_MODULE.md
│   ├── 11_ADDRESS_MODULE.md
│   ├── 12_CHECKOUT_MODULE.md
│   ├── 13_ORDER_MODULE.md
│   ├── 14_API_DOCUMENTATION.md
│   ├── 15_ERROR_HANDLING.md
│   ├── 16_IMPLEMENTATION_PHASES.md
│   └── README.md
│
└── src/
```


# Technology Stack

## Frontend Framework

- React 19
- Vite
- TypeScript

Reason:
- Fast development
- Type safety
- Excellent performance
- Modern React ecosystem

---

# UI Library

- shadcn/ui
- Radix UI (used internally by shadcn)
- Lucide React Icons

All UI components must be built using shadcn/ui.

Preferred Components

- Button
- Card
- Badge
- Avatar
- Dialog
- Drawer
- Sheet
- Dropdown Menu
- Navigation Menu
- Tabs
- Accordion
- Input
- Textarea
- Label
- Checkbox
- Radio Group
- Select
- Command
- Popover
- Calendar
- Table
- Pagination
- Skeleton
- Separator
- Alert
- Alert Dialog
- Toast (Sonner)

Avoid building custom components when shadcn already provides one.

---

# Styling

- Tailwind CSS v4
- CSS Variables
- Responsive Design
- Mobile First

Theme colors must come from the Organization API.

Never hardcode colors.

---

# Routing

React Router DOM

Routes

/

/login

/otp

/home

/product/:id

/cart

/address

/checkout

/orders

/profile

---

# API Layer

Axios

Requirements

- Base URL from .env
- Request Interceptor
- Response Interceptor
- Automatic JWT Authentication
- Error Handling
- Request Timeout

Never use fetch().

---

# Data Fetching

TanStack Query (React Query)

Use for

- Organization
- Settings
- Banner
- Categories
- Products
- Item Details
- Orders

Features

- Cache
- Retry
- Refetch
- Loading
- Error States

---

# Global State

Zustand

Stores

- Auth Store
- Organization Store
- Theme Store
- Outlet Store
- Cart Store
- Address Store

Only use Zustand for client state.

Never duplicate state.

---

# Forms

React Hook Form

Validation

Zod

Used for

- Login
- OTP
- Address
- Checkout

---

# Icons

Lucide React

Never use image icons.

---

# Notifications

Sonner

Use Toasts for

- Success
- Error
- Warning
- Information

Never use alert().

---

# Date Handling

date-fns

---

# Environment Variables

.env

VITE_API_BASE_URL

VITE_APP_NAME

Never hardcode API URLs.

---

# Authentication

JWT Authentication

Store token in localStorage.

Automatically attach

Authorization: Bearer <token>

using Axios Interceptors.

---

# Theme

Dynamic Theme

Theme must come from

POST /organization/get-org

Apply

- Primary Color
- Secondary Color
- Background Color
- Text Color

using CSS Variables.

---

# Folder Structure

src/

api/

components/

common/

layout/

banner/

product/

cart/

address/

orders/

pages/

services/

store/

hooks/

utils/

types/

assets/

styles/

---

# Code Standards

- TypeScript Strict Mode
- Functional Components
- React Hooks Only
- Reusable Components
- No Duplicate Code
- No Inline Styles
- No Hardcoded Data
- No Hardcoded URLs

---

# Responsive Design

Support

- Mobile
- Tablet
- Laptop
- Desktop

Use Tailwind Responsive Utilities.

---

# Loading States

Every API request must include

- Skeleton Loader
- Spinner
- Empty State

---

# Error Handling

Handle

401

403

404

500

Network Error

Display user-friendly messages using Toasts.

---

# Performance

- Code Splitting
- Lazy Loading
- React.memo where appropriate
- Image Lazy Loading
- Optimized Rendering

---

# Accessibility

Use shadcn/ui accessibility features.

Support

- Keyboard Navigation
- Focus Management
- Screen Readers
- Proper ARIA Labels

---

# Browser Support

Latest versions of

- Chrome
- Edge
- Firefox
- Safari

---

# Development Rules

- Never use mock data when API is available.
- Every API must have its own service file.
- Keep business logic out of UI components.
- Keep components small and reusable.
- Follow the backend API contract exactly.
- Build reusable layouts and components.
- Use shadcn/ui components wherever possible instead of creating custom UI elements.
---

# Phase-wise development

Don't ask Antigravity to build everything at once.

Use **phases**.

---

# Phase 1

```
00_PROJECT_OVERVIEW.md
01_ARCHITECTURE.md
02_TECH_STACK.md
03_FOLDER_STRUCTURE.md
```

Goal

```
Create React project

Setup

Folder structure

Routing

Axios

State Management

Theme

Providers
```

Expected output

```
Running project

No UI

Only architecture
```

---

# Phase 2

```
04_API_RULES.md

05_AUTHENTICATION.md

06_STATE_MANAGEMENT.md
```

Goal

```
Axios

JWT

Organization Context

Cart Context

API Layer

Protected Routes

Interceptors
```

---

# Phase 3

```
07_UI_DESIGN_SYSTEM.md

08_HOME_PAGE.md
```

Goal

```
Navbar

Hero

Banner

Categories

Products

Responsive

Dark Mode
```

---

# Phase 4

```
09_PRODUCT_MODULE.md
```

Goal

```
Product Details

Variation

Addon

Quantity

Price Calculation

Add To Cart
```

---

# Phase 5

```
10_CART_MODULE.md
```

Goal

```
Cart

Update

Delete

Coupon

Summary

Checkout
```

---

# Phase 6

```
11_ADDRESS_MODULE.md

12_CHECKOUT_MODULE.md
```

Goal

```
Saved Address

Current Location

Checkout

Payment
```

---

# Phase 7

```
13_ORDER_MODULE.md
```

Goal

```
Orders

Order History

Order Status
```

---

# Phase 8

```
14_API_DOCUMENTATION.md
```

Goal

```
Integrate every endpoint

Error handling

Validation

Loading

Retry

Caching
```

---

# Phase 9

```
15_ERROR_HANDLING.md
```

Goal

```
401

403

404

500

Retry

Toast

Skeleton

Empty States
```

---

# Phase 10

```
16_IMPLEMENTATION_PHASES.md
```

Goal

```
Verify every page

Verify every API

No mock data

Production ready
```

---

# API documentation file

This is the most important file.

Each API should look like this.

````md
# Get Organization

## Endpoint

POST /organization/get-org

## Purpose

Load organization configuration.

## Request

```json
{
  "domain":"ieyal"
}
```

## Response

```json
{
  "status":"success",
  "data":{
      ...
  }
}
```

## Frontend Usage

Home Page

Application Initialization

Theme

Logo

Delivery

Pickup

Store Status

## Store

organizationId

theme

logo

deliveryAvailable

pickupAvailable

## Errors

Network Error

Invalid Domain

Timeout
````

Repeat this format for **every API**.

---

# API rules

Create another file.

```
04_API_RULES.md
```

```md
# API Rules

Always use Axios.

Never use fetch.

All endpoints must be placed inside

services/

Every endpoint has its own function.

Use React Query.

Cache GET requests.

Retry GET requests.

Never retry POST requests.

Never hardcode URLs.

Store base URL in .env

Use interceptors.

JWT must automatically be attached.

401 should redirect Login.

All APIs should have loading state.

All APIs should have error state.

Never use mock data.
```

---

# Design system

```md
# UI Rules

Use

shadcn/ui

Tailwind CSS

Responsive

Mobile First

No inline CSS

Use CSS Variables

Use backend theme colors.

Use Skeleton loaders.

No alert()

Use toast notifications.

Accessibility required.

Keyboard navigation required.
```

---

# Implementation phases

```md
Phase 1

Application

↓

Organization

↓

Settings

↓

Theme

↓

Routing

--------------------------------

Phase 2

Authentication

↓

JWT

↓

Protected Routes

--------------------------------

Phase 3

Banner

↓

Categories

↓

Products

--------------------------------

Phase 4

Product Details

↓

Variation

↓

Addon

↓

Cart

--------------------------------

Phase 5

Address

↓

Checkout

↓

Orders
```

---

# Why this works

Instead of saying

```
Create an ecommerce website.
```

Antigravity will read

```
Project Overview

Architecture

Folder Structure

Coding Standards

Design System

API Documentation

Authentication

Cart Logic

Checkout Logic

Implementation Plan
```

It now knows **how** to build the project, not just **what** to build.

---
