import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      className={cn(
        'fixed z-50 h-12 w-12 rounded-full bg-gradient-to-br from-blue-900/90 via-blue-700/80 to-blue-500/80 p-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:from-blue-800 hover:to-blue-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-900 focus-visible:ring-offset-2',
        'bottom-6 right-4 sm:bottom-8',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
        'dark:bg-gradient-to-br dark:from-blue-400/80 dark:via-blue-700/80 dark:to-blue-900/90'
      )}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <ArrowUp
        className={cn(
          'h-6 w-6 text-white transition-transform duration-300',
          isVisible ? 'rotate-0 scale-100' : '-rotate-12 scale-75'
        )}
      />
    </Button>
  );
}
