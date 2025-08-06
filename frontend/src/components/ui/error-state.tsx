import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = 'Algo deu errado',
  message = 'Não foi possível carregar os dados. Por favor, tente novamente.',
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50 p-6 text-center',
        compact ? 'p-4' : 'p-6',
        className
      )}
    >
      <AlertCircle className={cn('text-red-500', compact ? 'mb-2 h-8 w-8' : 'mb-4 h-12 w-12')} />
      <h3 className={cn('font-medium text-gray-900', compact ? 'text-base' : 'text-lg')}>
        {title}
      </h3>
      <p className={cn('mt-1 text-gray-600', compact ? 'text-sm' : 'text-base')}>{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className={cn('mt-4 border-red-200 hover:bg-red-100', compact && 'mt-3 text-sm')}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title = 'Nenhum resultado encontrado',
  message = 'Não encontramos nenhum item correspondente à sua busca.',
  className,
  compact = false,
  children,
}: Omit<ErrorStateProps, 'onRetry'> & { children?: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center',
        compact ? 'p-4' : 'p-6',
        className
      )}
    >
      <div className={cn('mb-4 animate-pulse rounded-full bg-gray-100 p-3', compact && 'mb-2 p-2')}>
        <AlertCircle className={cn('text-gray-400', compact ? 'h-6 w-6' : 'h-8 w-8')} />
      </div>
      <h3 className={cn('font-medium text-gray-900', compact ? 'text-base' : 'text-lg')}>
        {title}
      </h3>
      <p className={cn('mt-1 text-gray-600', compact ? 'text-sm' : 'text-base')}>{message}</p>
      {children}
    </div>
  );
}
