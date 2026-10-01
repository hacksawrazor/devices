# Devices
Devices SPA

## Local development

Copy `.env.example` to `.env.development.local` and set `VITE_DEVICE_API_TOKEN` to the token used by your local development API. Start the app with `npm run dev`; Vite loads the development env file and adds the token as a bearer authorization header to device API calls. The header is omitted when the token is unset and from production builds.

Variables prefixed with `VITE_` are available to browser code and must not contain long-lived secrets. Use a server-side proxy or session-based authentication for credentials that must remain private.
