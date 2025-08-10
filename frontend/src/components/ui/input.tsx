import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the Input component
 * @interface InputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 * @property {string} [className] - Additional CSS classes to apply to the input
 * @property {string} [type] - The type of input (text, email, password, etc.)
 * @property {string} [aria-label] - Label for screen readers
 * @property {string} [aria-describedby] - ID of element that describes the input
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label for screen readers */
  'aria-label'?: string;
  /** ID of element that describes the input */
  'aria-describedby'?: string;
}

/**
 * A styled input component that supports all HTML input attributes
 * @component
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   aria-label="Email address"
 *   aria-describedby="email-description"
 * />
 * <span id="email-description" className="sr-only">
 *   Enter your email address to receive updates
 * </span>
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby, ...props },
    ref
  ) => {
    return (
      <input
        ref={ref}
        aria-describedby={ariaDescribedby}
        aria-label={ariaLabel}
        className={cn(
          'flex h-10 w-full touch-manipulation rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:border-purple-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50',
          // Mobile optimizations
          'md:h-10 md:text-sm',
          'h-12 text-base', // Default mobile size
          className
        )}
        type={type}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
