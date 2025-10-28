# Fresh Find Finder

A Vite + React + TypeScript web app for a hyperlocal grocery marketplace. It supports multiple roles (Customer, Shopkeeper, Coordinator, Admin, Maint) and integrates with a Spring Boot backend.

## Features

- **Customer**
  - Sign up and sign in
  - Auto-load nearby shops by pincode
  - View products of a selected shop
- **Shopkeeper**
  - Shop registration and login
  - Preload shop details after login
  - Add new products with images
  - View/manage products
- **Coordinator/Admin/Maint**
  - Dashboards and invitation/registration flows (scaffolded)

## Tech Stack

- React 18, TypeScript, Vite
- React Router v6
- shadcn/ui + Radix UI + Tailwind CSS
- TanStack Query (for query client provider)

See exact versions in `package.json`.

## Prerequisites

- Node.js 18+ and npm (or bun) installed
- Backend API running locally at `http://localhost:8080`

## Getting Started

```bash
# 1. Install dependencies
npm i

# 2. Start the dev server
npm run dev

# 3. Lint (optional)
npm run lint
```

Open http://localhost:5173 in your browser (Vite will print the actual URL/port).

## Environment / Backend

The app expects a Spring Boot backend on `http://localhost:8080` with the following endpoints used so far:

- Auth & Users
  - `POST /api/v1/user/signin` — Login, stores user in `localStorage["user"]`
  - `POST /api/v1/customer/signup` — Customer signup

- Shops
  - `GET /api/v1/shop/get/shopkeeper/{id}` — Load shop by shopkeeper user id (stored in `localStorage["shop"]`)
  - `GET /api/v1/shop/pincode/{pincode}` — Load shops by pincode (stored in `localStorage["shops"]`)

- Products
  - `POST /api/v1/shop/product/add` — Add product
  - `GET /api/v1/shop/{shopId}/products` — List shop products

If your backend host/port differs, update the fetch URLs in the relevant pages under `src/pages/`.

## Routing Overview

- Public
  - `/` — Landing
  - `/login` — Login
  - `/signup` — Customer signup
  - `/shop-registration` — Shopkeeper+Shop registration

- Customer
  - `/customer/dashboard` — Loads shops by pincode (via `CustomerDashboardLoader`)
  - `/customer/shops/:id/products` — View products for a selected shop

- Shopkeeper
  - `/shopkeeper/dashboard` — Preloads shop by shopkeeper id (via `ShopkeeperDashboardLoader`)
  - `/shopkeeper/products` — Shopkeeper products list
  - `/shopkeeper/products/add` — Add product form

## Local Storage Keys

- `user` — Set after login; includes `userType`, `id`, `pincode`, etc.
- `shop` — Loaded for shopkeeper (shop details)
- `shops` — Loaded for customer (shops by pincode)

## Project Structure

```text
src/
  components/
    layouts/           # Common layouts for roles
    ui/                # shadcn/ui components
  hooks/               # Toast, etc.
  pages/
    customer/
      Dashboard.tsx
      DashboardLoader.tsx
      ShopProducts.tsx
    shopkeeper/
      Dashboard.tsx
      DashboardLoader.tsx
      Products.tsx
      AddProduct.tsx
    admin/, coordinator/, maint/
  App.tsx              # Routes
```

## Development Notes

- API base URLs are currently inlined in components (e.g., `fetch("http://localhost:8080/...`)`). Consider moving to a config file or environment variables.
- `localStorage` is used as a simple store for user/shop/shop lists. For larger features, consider React Context or a state library.
- When integrating new endpoints, keep DTOs aligned with the backend contract.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run preview` — Preview built app
- `npm run lint` — Lint the project

## Contributing

1. Create a feature branch from `main`
2. Commit with clear messages
3. Open a PR and describe changes, screenshots, and testing steps

## License

This project is licensed under your organization’s preferred license. Update this section as needed.
