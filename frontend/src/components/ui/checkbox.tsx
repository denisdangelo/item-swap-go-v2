import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the Checkbox component
 * @interface CheckboxProps
 * @extends {React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>}
 * @property {string} [className] - Additional CSS classes to apply to the checkbox
 * @property {string} [aria-label] - Label for screen readers
 * @property {string} [aria-describedby] - ID of element that describes the checkbox
 * @property {boolean} [required] - Whether the checkbox is required
 * @property {string} [name] - Name of the checkbox for form submission
 */
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Label for screen readers */
  'aria-label'?: string;
  /** ID of element that describes the checkbox */
  'aria-describedby'?: string;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Name of the checkbox for form submission */
  name?: string;
}

/**
 * A styled checkbox component that supports form controls and accessibility
 * @component
 * @example
 * ```tsx
 * <div className="flex items-center space-x-2">
 *   <Checkbox
 *     id="terms"
 *     name="terms"
 *     required
 *     aria-label="Accept terms and conditions"
 *     aria-describedby="terms-description"
 *   />
 *   <Label htmlFor="terms">Accept terms and conditions</Label>
 * </div>
 * <span id="terms-description" className="sr-only">
 *   You must accept the terms and conditions to continue
 * </span>
 * ```
 */
const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  (
    {
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      required,
      name,
      ...props
    },
    ref
  ) => (
    <CheckboxPrimitive.Root
      ref={ref}
      aria-describedby={ariaDescribedby}
      aria-label={ariaLabel}
      aria-required={required}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        className
      )}
      name={name}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
