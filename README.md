# Devices
Devices SPA

## Local development

Copy `dev/.env.example` to `dev/.env.development.local`, set `VITE_DEVICES_API_URL` to your local devices API base URL, and set `VITE_DEVICE_API_TOKEN` if the API requires a token. The example points to `http://localhost:3000/api/devices`; without an override, the fallback is `http://localhost:3000/devices/api/devices`. Start the app with `npm run dev`; Vite loads env files from `dev/`, uses the local URL, and adds the token as a bearer authorization header when configured. The header is omitted when the token is unset and from production builds.

Set `VITE_DEVICES_API_URL` in `dev/.env.production` or the production environment to override the hosted production default.

Development mode simulates a signed-in user without calling the SSO user-info, login, or logout endpoints. `VITE_DEV_AUTH_EMAIL` controls the mock user's email; the header's **Sign out (dev)** and **Sign in (dev)** buttons toggle local UI auth state. Production continues to use SSO.

Variables prefixed with `VITE_` are available to browser code and must not contain long-lived secrets. Use a server-side proxy or session-based authentication for credentials that must remain private.
