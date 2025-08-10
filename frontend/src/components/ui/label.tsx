import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the Label component
 * @interface LabelProps
 * @extends {React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>}
 * @property {string} [className] - Additional CSS classes to apply to the label
 * @property {string} [htmlFor] - ID of the form control the label is associated with
 * @property {boolean} [required] - Whether the associated form control is required
 */
export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  /** ID of the form control the label is associated with */
  htmlFor?: string;
  /** Whether the associated form control is required */
  required?: boolean;
}

/**
 * A styled label component that supports form controls and accessibility
 * @component
 * @example
 * ```tsx
 * <div className="grid gap-2">
 *   <Label htmlFor="email" required>
 *     Email address
 *   </Label>
 *   <Input
 *     id="email"
 *     type="email"
 *     placeholder="Enter your email"
 *     required
 *   />
 * </div>
 * ```
 */
const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, htmlFor, required, children, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-destructive">*</span>}
    </LabelPrimitive.Root>
  )
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
