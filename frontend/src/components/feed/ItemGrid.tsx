import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { HorizontalItemCard } from './HorizontalItemCard';

import type { Item, ItemWithDetails } from '@/types';

interface ItemGridProps {
  items: ItemWithDetails[];
  className?: string;
  onItemSelect?: (item: Item) => void;
  variant?: 'default' | 'compact';
}

export const ItemGrid = ({
  items,
  className,
  onItemSelect,
  variant = 'default',
}: ItemGridProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/20 shadow-lg">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Nenhum item encontrado</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Tente ajustar sua busca ou filtrar por outra categoria. Você também pode adicionar um
              novo item para compartilhar.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)} role="grid" aria-label="Lista de itens disponíveis">
      {/* Todos os itens em layout horizontal */}
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          role="gridcell"
          aria-label={`Item ${index + 1} de ${items.length}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <HorizontalItemCard
            item={item}
            itemOwner={'verified' in (item.owner || {}) ? (item.owner as any) : undefined}
            onItemSelect={onItemSelect}
          />
        </motion.div>
      ))}
    </div>
  );
};
