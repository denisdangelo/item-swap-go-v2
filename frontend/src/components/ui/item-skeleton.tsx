import { Skeleton } from '@/components/ui/skeleton';

export function ItemCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border-0 bg-white shadow-sm">
      <div className="flex min-h-[100px] sm:min-h-[115px]">
        {/* Imagem à esquerda */}
        <div className="w-32 flex-shrink-0 sm:w-40 md:w-48">
          <Skeleton className="h-full w-full rounded-l-2xl" />
        </div>

        {/* Conteúdo à direita */}
        <div className="flex flex-1 flex-col justify-between p-3">
          <div className="space-y-2">
            {/* Título */}
            <Skeleton className="h-5 w-3/4" />

            {/* Descrição */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />

            {/* Localização */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
          </div>

          {/* Footer com preço */}
          <div className="mt-3 flex items-end justify-between">
            <div className="flex flex-col">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="mt-1 h-3 w-12" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ItemDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Imagem principal */}
      <Skeleton className="aspect-video w-full rounded-lg" />

      {/* Título e preço */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
      </div>

      {/* Informações do proprietário */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ItemGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ItemCardSkeleton key={index} />
      ))}
    </div>
  );
}
