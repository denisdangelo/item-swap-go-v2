import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the RadioGroup component
 * @interface RadioGroupProps
 * @extends {React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>}
 * @property {string} [className] - Additional CSS classes to apply to the radio group
 * @property {string} [aria-label] - Label for screen readers
 * @property {string} [aria-describedby] - ID of element that describes the radio group
 * @property {boolean} [required] - Whether the radio group is required
 * @property {string} [name] - Name of the radio group for form submission
 */
export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** Label for screen readers */
  'aria-label'?: string;
  /** ID of element that describes the radio group */
  'aria-describedby'?: string;
  /** Whether the radio group is required */
  required?: boolean;
  /** Name of the radio group for form submission */
  name?: string;
}

/**
 * Props for the RadioGroupItem component
 * @interface RadioGroupItemProps
 * @extends {React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>}
 * @property {string} [className] - Additional CSS classes to apply to the radio item
 * @property {string} value - Value of the radio option
 * @property {string} [aria-label] - Label for screen readers
 */
export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /** Value of the radio option */
  value: string;
  /** Label for screen readers */
  'aria-label'?: string;
}

/**
 * A styled radio group component that supports form controls and accessibility
 * @component
 * @example
 * ```tsx
 * <RadioGroup
 *   name="notification"
 *   required
 *   aria-label="Notification preferences"
 *   aria-describedby="notification-description"
 * >
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="all" id="all" aria-label="All notifications" />
 *     <Label htmlFor="all">All notifications</Label>
 *   </div>
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="important" id="important" aria-label="Important only" />
 *     <Label htmlFor="important">Important only</Label>
 *   </div>
 * </RadioGroup>
 * <span id="notification-description" className="sr-only">
 *   Choose your notification preferences
 * </span>
 * ```
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
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
  ) => {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        aria-describedby={ariaDescribedby}
        aria-label={ariaLabel}
        aria-required={required}
        className={cn('grid gap-2', className)}
        name={name}
        {...props}
      />
    );
  }
);
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, value, 'aria-label': ariaLabel, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      value={value}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
