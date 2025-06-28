# Deduplication & Cleanup Plan

## What Was Done
- All authentication logic is now unified in `context/AuthContext.tsx`.
- All screens should use the context, not direct service imports.
- No legacy, mock, or test files remain in the codebase.

## Checklist
- [x] Remove `services/authService.ts`
- [x] Remove `services/auth.ts`
- [x] Update all screens to use `useAuth()`
- [x] Standardize all login/register navigation to `/auth`
- [x] Show backend errors to users
- [x] Test login, registration, logout, and error handling
