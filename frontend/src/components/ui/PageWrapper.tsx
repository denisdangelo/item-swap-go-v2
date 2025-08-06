import React, { ReactNode } from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { cn } from '@/lib/utils';
import { PageTransition } from './page-transition';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
  noAnimation?: boolean;
}

/**
 * Componente wrapper que garante que a página seja carregada no topo
 * e fornece um layout consistente para todas as páginas
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = '',
  fullWidth = false,
  noPadding = false,
  noAnimation = false,
}) => {
  // Hook que garante scroll to top automaticamente
  useScrollToTop();

  const content = (
    <div className={cn('min-h-screen bg-background', className)}>
      <div
        className={cn(
          'mx-auto w-full',
          !fullWidth && 'container',
          !noPadding && 'px-4 py-6 pt-20 md:py-8 md:pt-28'
        )}
      >
        {children}
      </div>
    </div>
  );

  // Se noAnimation for true, retorna o conteúdo sem animação
  if (noAnimation) {
    return content;
  }

  // Caso contrário, envolve o conteúdo com a animação de transição
  return <PageTransition>{content}</PageTransition>;
};
