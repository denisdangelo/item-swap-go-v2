import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Componente que oculta visualmente o conteúdo, mas mantém acessível para leitores de tela.
 * Útil para fornecer contexto adicional para usuários de tecnologias assistivas
 * sem afetar o layout visual.
 */
export const VisuallyHidden = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0',
        'clip-[rect(0,0,0,0)]',
        className
      )}
      {...props}
    />
  );
};
