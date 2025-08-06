import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: 'login' | 'onboarding';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = 'login',
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { setCurrentScreen } = useStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setCurrentScreen(redirectTo);
    }
  }, [isLoading, isAuthenticated, setCurrentScreen, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Show fallback or redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Redirecionando para login...</p>
          </div>
        </div>
      )
    );
  }

  // Render protected content
  return <>{children}</>;
};
