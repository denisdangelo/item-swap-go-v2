import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ItemCardSkeletonProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function ItemCardSkeleton({ variant = 'default', className }: ItemCardSkeletonProps) {
  return (
    <Card
      className={cn(
        'group overflow-hidden rounded-2xl border-0 bg-white shadow-sm transition-all duration-300',
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex min-h-[100px] sm:min-h-[115px]">
          {/* Imagem à esquerda */}
          <div className="w-32 flex-shrink-0 sm:w-40 md:w-48">
            <div className="h-full w-full animate-pulse rounded-l-2xl bg-gradient-to-br from-muted via-muted/80 to-muted/60" />
          </div>

          {/* Conteúdo à direita */}
          <div className="flex flex-1 flex-col justify-between p-3">
            <div className="space-y-2">
              {/* Título */}
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />

              {/* Descrição */}
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />

              {/* Localização */}
              <div className="flex items-center gap-1">
                <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-muted" />
                <div className="h-3.5 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>

            {/* Footer com preço */}
            <div className="mt-3 flex items-end justify-between">
              <div className="flex flex-col">
                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                <div className="mt-1 h-3 w-12 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ItemGridSkeleton({
  count = 8,
  variant = 'default',
}: {
  count?: number;
  variant?: 'default' | 'compact';
}) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ItemCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}
