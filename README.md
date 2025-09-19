# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


### Admin Access Configuration

The backend now centralizes admin email authorization using environment variables:

- `ADMIN_EMAIL` (primary admin, e.g. `kidorabd@gmail.com`)
- `ADMIN_EMAILS` (optional comma-separated list for multiple admins)

Frontend admin identification uses `isAdminEmail` in `src/services/auth.js`, which:

1. Checks a dynamic global list `window.__ADMIN_EMAILS__` if injected (you can expose this via a small script tag in `index.html` or server-side templating if needed).
2. Falls back to the built-in primary admin (`kidorabd@gmail.com`).
3. Provides a legacy fallback for `admin@example.com` / `@admin` domains (scheduled for removal once migration is complete).

To add more admins without rebuilding the frontend, you can inject a script before the bundle:

```html
<script>
	window.__ADMIN_EMAILS__ = ['kidorabd@gmail.com','other.admin@yourdomain.com'];
</script>
<script type="module" src="/src/main.jsx"></script>
```

When deploying, ensure the backend env vars match the emails you expect to have admin rights. A mismatch will allow login but block access to protected admin endpoints.

#### Frontend Guarding

The admin route protection now relies on `AuthContext` providing an `isAdmin` boolean derived from either:
1. `user.role` (if returned by backend and in [`ADMIN`, `SUB_ADMIN`])
2. Fallback email check via `isAdminEmail()`

`AdminRoute` (in `App.jsx`) enforces this for `/admin` paths, and `AdminLayout` contains an internal defensive check that renders an Unauthorized screen if somehow reached without proper privileges.
