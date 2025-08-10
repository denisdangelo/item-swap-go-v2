import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Componente para touch targets maiores no mobile
export function MobileTouchTarget({
  children,
  className,
  minHeight = 44,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { minHeight?: number }) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'touch-manipulation',
        isMobile && `min-h-[${minHeight}px] min-w-[${minHeight}px]`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Componente para melhorar acessibilidade de botões no mobile
export function MobileButton({
  children,
  className,
  size = 'default',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: 'sm' | 'default' | 'lg' }) {
  const isMobile = useIsMobile();

  const sizeClasses = {
    sm: isMobile ? 'h-10 px-3 text-sm' : 'h-8 px-2 text-xs',
    default: isMobile ? 'h-12 px-4 text-base' : 'h-10 px-4 text-sm',
    lg: isMobile ? 'h-14 px-6 text-lg' : 'h-11 px-8 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex touch-manipulation items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Componente para melhorar acessibilidade de inputs no mobile
export function MobileInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const isMobile = useIsMobile();

  return (
    <input
      className={cn(
        'flex w-full touch-manipulation rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        isMobile ? 'h-12 text-base' : 'h-10 text-sm',
        className
      )}
      {...props}
    />
  );
}

// Componente para melhorar acessibilidade de textareas no mobile
export function MobileTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const isMobile = useIsMobile();

  return (
    <textarea
      className={cn(
        'flex w-full touch-manipulation rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        isMobile ? 'min-h-[120px] text-base' : 'min-h-[80px] text-sm',
        className
      )}
      {...props}
    />
  );
}

// Hook para melhorar scroll no mobile
export function useMobileScroll() {
  const isMobile = useIsMobile();

  const smoothScrollTo = (element: HTMLElement | null, offset = 0) => {
    if (!element) return;

    const elementPosition = element.offsetTop - offset;

    if (isMobile) {
      // Scroll mais suave no mobile
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    } else {
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return { smoothScrollTo };
}

// Componente para melhorar feedback tátil no mobile
export function MobileFeedback({
  children,
  className,
  feedback = 'tap',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { feedback?: 'tap' | 'long' | 'none' }) {
  const isMobile = useIsMobile();

  const feedbackClasses = {
    tap: isMobile ? 'active:scale-95 transition-transform' : '',
    long: isMobile ? 'active:scale-90 transition-transform' : '',
    none: '',
  };

  return (
    <div className={cn('touch-manipulation', feedbackClasses[feedback], className)} {...props}>
      {children}
    </div>
  );
}
