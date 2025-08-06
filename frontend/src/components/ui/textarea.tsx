import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the Textarea component
 * @interface TextareaProps
 * @extends {React.ComponentPropsWithoutRef<'textarea'>}
 * @property {string} [className] - Additional CSS classes to apply to the textarea
 * @property {string} [aria-label] - Label for screen readers
 * @property {string} [aria-describedby] - ID of element that describes the textarea
 * @property {boolean} [required] - Whether the textarea is required
 * @property {string} [name] - Name of the textarea field
 * @property {string} [placeholder] - Placeholder text
 * @property {number} [rows] - Number of visible text lines
 * @property {number} [maxLength] - Maximum number of characters allowed
 * @property {boolean} [disabled] - Whether the textarea is disabled
 * @property {boolean} [readOnly] - Whether the textarea is read-only
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label for screen readers */
  'aria-label'?: string;
  /** ID of element that describes the textarea */
  'aria-describedby'?: string;
  /** Whether the textarea is required */
  required?: boolean;
  /** Name of the textarea field */
  name?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Number of visible text lines */
  rows?: number;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether the textarea is read-only */
  readOnly?: boolean;
}

/**
 * A styled textarea component that supports form controls and accessibility
 * @component
 * @example
 * ```tsx
 * <div className="space-y-2">
 *   <Label htmlFor="description">Description</Label>
 *   <Textarea
 *     id="description"
 *     name="description"
 *     placeholder="Enter a description..."
 *     rows={4}
 *     maxLength={500}
 *     required
 *     aria-label="Description"
 *     aria-describedby="description-description"
 *   />
 *   <span id="description-description" className="sr-only">
 *     Enter a detailed description of the item (maximum 500 characters)
 *   </span>
 * </div>
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full touch-manipulation rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          // Mobile optimizations
          'md:min-h-[80px] md:text-sm',
          'min-h-[120px] text-base', // Default mobile size
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
