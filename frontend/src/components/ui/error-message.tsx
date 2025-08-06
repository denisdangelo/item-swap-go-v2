import { AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';

/**
 * Props for the ErrorMessage component
 * @interface ErrorMessageProps
 * @property {string} message - The error message to display
 * @property {string} [className] - Additional CSS classes to apply to the error message
 * @property {() => void} [onRetry] - Callback function to be called when the retry button is clicked
 */
interface ErrorMessageProps {
  /** The error message to display */
  message: string;
  /** Additional CSS classes to apply to the error message */
  className?: string;
  /** Callback function to be called when the retry button is clicked */
  onRetry?: () => void;
}

/**
 * A component that displays an error message with an optional retry button
 * @component
 * @example
 * ```tsx
 * <ErrorMessage
 *   message="Failed to load data"
 *   onRetry={() => refetch()}
 *   className="my-4"
 * />
 * ```
 */
export const ErrorMessage = ({ message, className, onRetry }: ErrorMessageProps) => {
  return (
    <Alert className={cn('my-4', className)} variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center gap-2">
        {message}
        {onRetry && (
          <Button className="ml-2" size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
