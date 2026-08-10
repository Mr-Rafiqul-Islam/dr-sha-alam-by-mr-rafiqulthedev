# Admin panel (Vite + React)

## Local development

1. **Start the API server** (from `server/`):

```bash
cd server
npm run dev
```

Note the server port in `server/.env` (`PORT`, commonly `5002`).

2. **Configure the admin app**:

```bash
cd admin
cp .env.example .env
```

Recommended dev settings in `admin/.env`:

```env
VITE_API_URL=
VITE_DEV_API_PROXY=http://localhost:5002
```

Leave `VITE_API_URL` **empty** so the admin calls `/api/...` on the Vite dev server, which proxies to the backend. This avoids wrong-port errors (e.g. `:5001`) and CORS issues.

If your server uses a different port, update `VITE_DEV_API_PROXY` only.

3. **Start the admin dev server**:

```bash
npm run dev
```

Open http://localhost:5173/

## Troubleshooting

- **`ERR_CONNECTION_REFUSED` on `/api/...`**: backend is not running, or `VITE_DEV_API_PROXY` points to the wrong port.
- **Vite HMR websocket failed**: restart `npm run dev` after pulling config changes; use http://localhost:5173 (not 127.0.0.1 vs localhost mismatch).
- **Invalid hook call / `useContext` is null**: usually a stale HMR session or duplicate React; restart the dev server. This repo dedupes `react` / `react-dom` in `vite.config.ts`.

## Production build

Set `VITE_API_URL` to your public API origin before building:

```bash
VITE_API_URL=https://your-api.example.com npm run build
```
