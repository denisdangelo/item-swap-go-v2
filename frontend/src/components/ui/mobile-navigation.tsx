import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './button';

// Componente para navegação por gestos no mobile
export function MobileGestureNavigation({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}) {
  const isMobile = useIsMobile();
  const [touchStart, setTouchStart] = React.useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (distanceX < 0 && onSwipeRight) {
          onSwipeRight();
        }
      }
    } else {
      if (Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0 && onSwipeUp) {
          onSwipeUp();
        } else if (distanceY < 0 && onSwipeDown) {
          onSwipeDown();
        }
      }
    }
  };

  return (
    <div
      className={cn('touch-manipulation', isMobile && 'select-none', className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      {...props}
    >
      {children}
    </div>
  );
}

// Componente para botões de navegação mobile
export function MobileNavButton({
  children,
  variant = 'default',
  size = 'default',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}) {
  const isMobile = useIsMobile();

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizeClasses = {
    sm: isMobile ? 'h-10 w-10' : 'h-8 w-8',
    default: isMobile ? 'h-12 w-12' : 'h-10 w-10',
    lg: isMobile ? 'h-14 w-14' : 'h-11 w-11',
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'touch-manipulation rounded-full transition-all',
        variantClasses[variant],
        sizeClasses[size],
        isMobile && 'active:scale-95',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

// Componente para indicadores de navegação mobile
export function MobileNavIndicator({
  current,
  total,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  current: number;
  total: number;
}) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2',
        isMobile ? 'py-4' : 'py-2',
        className
      )}
      {...props}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            isMobile ? 'h-2 w-2' : 'h-1.5 w-1.5',
            i === current ? 'bg-primary' : 'bg-muted hover:bg-muted/80'
          )}
        />
      ))}
    </div>
  );
}

// Hook para navegação por teclado no mobile
export function useMobileKeyboardNavigation() {
  const isMobile = useIsMobile();

  const handleKeyDown = React.useCallback(
    (
      e: KeyboardEvent,
      handlers: {
        onArrowLeft?: () => void;
        onArrowRight?: () => void;
        onArrowUp?: () => void;
        onArrowDown?: () => void;
        onEnter?: () => void;
        onEscape?: () => void;
      }
    ) => {
      if (!isMobile) return;

      switch (e.key) {
        case 'ArrowLeft':
          handlers.onArrowLeft?.();
          break;
        case 'ArrowRight':
          handlers.onArrowRight?.();
          break;
        case 'ArrowUp':
          handlers.onArrowUp?.();
          break;
        case 'ArrowDown':
          handlers.onArrowDown?.();
          break;
        case 'Enter':
          handlers.onEnter?.();
          break;
        case 'Escape':
          handlers.onEscape?.();
          break;
      }
    },
    [isMobile]
  );

  return { handleKeyDown };
}

// Componente para scroll infinito mobile
export function MobileInfiniteScroll({
  children,
  onLoadMore,
  hasMore = true,
  loading = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  onLoadMore: () => void;
  hasMore?: boolean;
  loading?: boolean;
}) {
  const isMobile = useIsMobile();
  const observerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isMobile || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile, hasMore, loading, onLoadMore]);

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
      {hasMore && (
        <div ref={observerRef} className="py-4 text-center">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Carregando...</span>
            </div>
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}
    </div>
  );
}
