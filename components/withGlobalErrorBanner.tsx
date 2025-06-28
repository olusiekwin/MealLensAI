import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { GlobalErrorBanner } from './GlobalErrorBanner';

export function withGlobalErrorBanner<P>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const { loginError, clearLoginMessages } = useAuth();
    return (
      <>
        <GlobalErrorBanner message={loginError} />
        <Component {...props} />
      </>
    );
  };
}
