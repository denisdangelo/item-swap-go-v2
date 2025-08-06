import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the Switch component
 * @interface SwitchProps
 * @extends {React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>}
 * @property {string} [className] - Additional CSS classes to apply to the switch
 * @property {string} [aria-label] - Label for screen readers
 * @property {string} [aria-describedby] - ID of element that describes the switch
 * @property {boolean} [required] - Whether the switch is required
 * @property {string} [name] - Name of the switch for form submission
 */
export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  /** Label for screen readers */
  'aria-label'?: string;
  /** ID of element that describes the switch */
  'aria-describedby'?: string;
  /** Whether the switch is required */
  required?: boolean;
  /** Name of the switch for form submission */
  name?: string;
}

/**
 * A styled switch component that supports form controls and accessibility
 * @component
 * @example
 * ```tsx
 * <div className="flex items-center space-x-2">
 *   <Switch
 *     id="airplane-mode"
 *     name="airplane-mode"
 *     aria-label="Airplane mode"
 *     aria-describedby="airplane-mode-description"
 *   />
 *   <Label htmlFor="airplane-mode">Airplane mode</Label>
 * </div>
 * <span id="airplane-mode-description" className="sr-only">
 *   Toggle airplane mode on or off
 * </span>
 * ```
 */
const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
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
    <SwitchPrimitives.Root
      ref={ref}
      aria-describedby={ariaDescribedby}
      aria-label={ariaLabel}
      aria-required={required}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-input',
        className
      )}
      name={name}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  )
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
