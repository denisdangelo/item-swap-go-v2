import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Props for the Slider component
 * @interface SliderProps
 * @extends {React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>}
 * @property {string} [className] - Additional CSS classes to apply to the slider
 * @property {string} [aria-label] - Label for screen readers
 * @property {string} [aria-describedby] - ID of element that describes the slider
 * @property {number} [min] - Minimum value of the slider
 * @property {number} [max] - Maximum value of the slider
 * @property {number} [step] - Step value of the slider
 * @property {number[]} [defaultValue] - Default value of the slider
 * @property {number[]} [value] - Controlled value of the slider
 * @property {(value: number[]) => void} [onValueChange] - Callback when value changes
 */
export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Label for screen readers */
  'aria-label'?: string;
  /** ID of element that describes the slider */
  'aria-describedby'?: string;
  /** Minimum value of the slider */
  min?: number;
  /** Maximum value of the slider */
  max?: number;
  /** Step value of the slider */
  step?: number;
  /** Default value of the slider */
  defaultValue?: number[];
  /** Controlled value of the slider */
  value?: number[];
  /** Callback when value changes */
  onValueChange?: (value: number[]) => void;
}

/**
 * A styled slider component that supports form controls and accessibility
 * @component
 * @example
 * ```tsx
 * <div className="space-y-2">
 *   <Label htmlFor="volume">Volume</Label>
 *   <Slider
 *     id="volume"
 *     name="volume"
 *     min={0}
 *     max={100}
 *     step={1}
 *     defaultValue={[50]}
 *     aria-label="Volume"
 *     aria-describedby="volume-description"
 *   />
 *   <span id="volume-description" className="sr-only">
 *     Adjust the volume level from 0 to 100
 *   </span>
 * </div>
 * ```
 */
const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      min,
      max,
      step,
      defaultValue,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      aria-describedby={ariaDescribedby}
      aria-label={ariaLabel}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      defaultValue={defaultValue}
      max={max}
      min={min}
      step={step}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
