import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';
import { classes } from '@/styles/design-system';

/**
 * Variants for the Button component
 * @typedef {Object} ButtonVariants
 * @property {string} default - Default style with primary background
 * @property {string} destructive - Destructive style with destructive background
 * @property {string} outline - Outline style with border
 * @property {string} secondary - Secondary style with secondary background
 * @property {string} ghost - Ghost style with transparent background
 * @property {string} link - Link style with underline on hover
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation',
  {
    variants: {
      variant: {
        default: 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        outline:
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
        link: 'text-purple-600 underline-offset-4 hover:underline hover:text-purple-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        'mobile-sm': 'h-12 px-4 py-3 text-base',
        'mobile-lg': 'h-14 px-6 py-4 text-lg',
        'mobile-icon': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Props for the Button component
 * @interface ButtonProps
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 * @extends {VariantProps<typeof buttonVariants>}
 * @property {string} [className] - Additional CSS classes to apply to the button
 * @property {ButtonVariants['variant']} [variant] - The visual style of the button
 * @property {ButtonVariants['size']} [size] - The size of the button
 * @property {boolean} [asChild] - Whether to render as a child component using Radix UI Slot
 * @property {boolean} [loading] - Whether the button is in a loading state
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Whether to render as a child component using Radix UI Slot */
  asChild?: boolean;
  /** Whether the button is in a loading state */
  loading?: boolean;
}

/**
 * A button component that supports various styles and sizes
 * @component
 * @example
 * ```tsx
 * <Button variant="default" size="default">Click me</Button>
 * <Button variant="destructive" size="sm">Delete</Button>
 * <Button variant="outline" size="lg">Cancel</Button>
 * <Button variant="secondary" size="icon"><Plus /></Button>
 * <Button variant="ghost">Ghost</Button>
 * <Button variant="link">Link</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props}>
        {loading ? 'Carregando...' : props.children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
