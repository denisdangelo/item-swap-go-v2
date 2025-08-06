import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Props for the LoadingSpinner component
 * @interface LoadingSpinnerProps
 * @property {string} [className] - Additional CSS classes to apply to the spinner
 * @property {16 | 20 | 24 | 32 | 40 | 48} [size=24] - Size of the spinner in pixels
 */
interface LoadingSpinnerProps {
  /** Additional CSS classes to apply to the spinner */
  className?: string;
  /** Size of the spinner in pixels */
  size?: 16 | 20 | 24 | 32 | 40 | 48;
}

/**
 * A loading spinner component that displays a rotating icon
 * @component
 * @example
 * ```tsx
 * <LoadingSpinner size={24} className="text-primary" />
 * ```
 */
export const LoadingSpinner = ({ className, size = 24 }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className={cn('animate-spin text-primary', className)} size={size} />
    </div>
  );
};
