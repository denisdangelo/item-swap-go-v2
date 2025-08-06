import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  fullWidth?: boolean;
}

/**
 * Componente para padronizar o espaçamento e layout das páginas
 * Garante um espaçamento consistente entre o header e o conteúdo
 */
export function PageContainer({
  children,
  className,
  noPadding = false,
  fullWidth = false,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        'mx-auto w-full',
        !fullWidth && 'container',
        !noPadding && 'px-4 pb-6 pt-20 md:pb-8 md:pt-24',
        className
      )}
    >
      {children}
    </main>
  );
}

export default PageContainer;
