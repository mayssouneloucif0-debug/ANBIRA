# ANBIRA

## Products API (MySQL)

The products CRUD source of truth is MySQL. Configure the credentials in a local `.env` file (copy `.env.example`), start MySQL, then create the database and table once:

```powershell
Get-Content server/database/schema.sql | mysql -u root -p
```

Start the API with `npm run server`. The endpoints are GET/POST `/api/products` and GET/PUT/DELETE `/api/products/:id`.

`POST` and `PUT` accept `name`, `image`, `price`, `description`, `colors`, `sizes`, `productType` (`sale`, `rental`, or `both`) and `status` (`active`, `unavailable`, or `archived`). `name` is required when creating.

```json
{
  "name": "فستان سهرة ANBIRA",
  "price": 15000,
  "colors": ["أسود"],
  "sizes": ["M", "L"],
  "productType": "sale",
  "status": "active"
}
```

API responses place the returned product or list in `data`.

## Manager authentication

Set `AUTH_SECRET` and the `ADMIN_*` values in `.env`, run the schema, then create the first administrator once with `npm run seed:admin`.

`POST /api/auth/login` accepts `email` and `password`, returning an `accessToken`. Send it on protected requests as `Authorization: Bearer <accessToken>`. `GET /api/auth/me` returns the authenticated manager.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
