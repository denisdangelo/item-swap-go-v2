import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Variants for the Badge component
 * @typedef {Object} BadgeVariants
 * @property {string} default - Default style with primary background
 * @property {string} secondary - Secondary style with secondary background
 * @property {string} destructive - Destructive style with destructive background
 * @property {string} outline - Outline style with transparent background
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Props for the Badge component
 * @interface BadgeProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @extends {VariantProps<typeof badgeVariants>}
 * @property {string} [className] - Additional CSS classes to apply to the badge
 * @property {BadgeVariants['variant']} [variant] - The visual style of the badge
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * A badge component that displays a small label or status
 * @component
 * @example
 * ```tsx
 * <Badge variant="default">New</Badge>
 * <Badge variant="secondary">Draft</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline">Beta</Badge>
 * ```
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
