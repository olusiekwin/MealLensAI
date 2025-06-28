# Auth Service Migration & Cleanup

## What Changed
- All authentication logic is now handled by `context/AuthContext.tsx` using React Context and hooks.
- All screens/components should use `useAuth()` for login, registration, and logout.
- Backend error messages are now shown to users.
- Old service files are removed for clarity and maintainability.

## What To Do Next
- Update any screen/component that used `authService` or `auth.ts` to use the new context.
- Use `const { signIn, signUp, signOut, user, loading } = useAuth();` in your components.
- For login/register errors, display the `error` returned from `signIn`/`signUp`.

## Example Usage
```tsx
import { useAuth } from '@/context/AuthContext';

const { signIn, signUp, signOut, user, loading } = useAuth();

// Login
const handleLogin = async () => {
  const result = await signIn(email, password);
  if (!result.success) {
    setError(result.error); // Show error to user
  }
};
```
