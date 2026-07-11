# Project Rules

- Never hardcode colors.
- Never hardcode API URLs.
- Never call Axios directly inside React components.
- Every API must have a dedicated service.
- Every GET request must use TanStack Query.
- Every POST request must use a custom mutation hook.
- Every page must include Loading, Error, and Empty states.
- Use shadcn/ui components whenever possible.
- Follow the backend API contract exactly.
- Keep business logic in hooks/services, not in UI components.