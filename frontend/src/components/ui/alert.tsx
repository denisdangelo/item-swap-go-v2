import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Variants for the Alert component
 * @typedef {Object} AlertVariants
 * @property {string} default - Default style with background color
 * @property {string} destructive - Destructive style with destructive colors
 */
const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Props for the Alert component
 * @interface AlertProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @extends {VariantProps<typeof alertVariants>}
 * @property {string} [className] - Additional CSS classes to apply to the alert
 * @property {AlertVariants['variant']} [variant] - The visual style of the alert
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

/**
 * Props for the AlertTitle component
 * @interface AlertTitleProps
 * @extends {React.HTMLAttributes<HTMLHeadingElement>}
 * @property {string} [className] - Additional CSS classes to apply to the alert title
 */
const AlertTitle = React.forwardRef<
  React.ElementRef<'h5'>,
  React.HTMLAttributes<React.ElementRef<'h5'>>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h5>
));
AlertTitle.displayName = 'AlertTitle';

/**
 * Props for the AlertDescription component
 * @interface AlertDescriptionProps
 * @extends {React.HTMLAttributes<HTMLParagraphElement>}
 * @property {string} [className] - Additional CSS classes to apply to the alert description
 */
const AlertDescription = React.forwardRef<
  React.ElementRef<'div'>,
  React.HTMLAttributes<React.ElementRef<'div'>>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

/**
 * An alert component that displays a message with an optional title and description
 * @component
 * @example
 * ```tsx
 * <Alert>
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>
 *     You can add components to your app using the cli.
 *   </AlertDescription>
 * </Alert>
 *
 * <Alert variant="destructive">
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>
 *     Your session has expired. Please log in again.
 *   </AlertDescription>
 * </Alert>
 * ```
 */
export { Alert, AlertTitle, AlertDescription };
