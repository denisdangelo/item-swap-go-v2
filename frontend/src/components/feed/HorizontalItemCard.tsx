import React, { useState } from 'react';
import { MapPin, Heart, Share2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getCategoryPlaceholder, handleImageError } from '@/utils/imageUtils';
import type { Item, UserWithDetails } from '@/types';

interface HorizontalItemCardProps {
  item: Item;
  itemOwner?: UserWithDetails;
  testImage?: string;
  onItemSelect?: (item: Item) => void;
}

export function HorizontalItemCard({
  item,
  itemOwner,
  testImage,
  onItemSelect,
}: HorizontalItemCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const mainImage =
    testImage ||
    (imageError
      ? getCategoryPlaceholder(item.categoryId)
      : item.images[0] || getCategoryPlaceholder(item.categoryId));

  const isAvailable = item.status === 'available';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPeriodLabel = (period?: string) => {
    const labels: Record<string, string> = {
      hora: 'h',
      dia: 'dia',
      semana: 'sem',
      mes: 'mês',
    };
    return period ? labels[period] || period : 'dia';
  };

  const handleCardClick = () => {
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      navigate(`/items/${item.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement share functionality
  };

  const onImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    const fallbackUrl = getCategoryPlaceholder(item.categoryId);
    handleImageError(event.nativeEvent, fallbackUrl);
  };

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden border-0 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        !isAvailable && 'opacity-60',
        'rounded-2xl shadow-sm'
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="flex min-h-[100px] sm:min-h-[115px]">
          {/* Imagem à esquerda - ocupa toda a altura */}
          <div className="relative w-32 flex-shrink-0 sm:w-40 md:w-48">
            <div className="absolute inset-0 overflow-hidden rounded-l-2xl">
              <img
                src={mainImage}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={onImageError}
                loading="lazy"
              />

              {/* Overlay gradiente sutil */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
            </div>

            {/* Status Badge - Apenas se indisponível */}
            {!isAvailable && (
              <div className="absolute left-2 top-2 z-10">
                <Badge className="border-0 bg-red-500 text-xs text-white shadow-lg">
                  Indisponível
                </Badge>
              </div>
            )}
          </div>

          {/* Conteúdo à direita */}
          <div className="flex flex-1 flex-col justify-between p-3">
            <div className="space-y-2">
              {/* Header com título e ações */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 flex-1 text-base font-semibold leading-tight text-foreground sm:text-lg">
                  {item.title}
                </h3>

                {/* Ações - Visíveis sempre em horizontal */}
                <div className="flex gap-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full hover:bg-gray-100"
                    onClick={handleFavoriteClick}
                  >
                    <Heart
                      className={cn('h-3.5 w-3.5', isFavorited && 'fill-red-500 text-red-500')}
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-full hover:bg-gray-100"
                    onClick={handleShareClick}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Descrição */}
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {item.description || 'Sem descrição disponível'}
              </p>

              {/* Localização */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-purple-600" />
                <span className="truncate font-medium">
                  {item.location?.city || item.location?.address || 'Localização não informada'}
                </span>
              </div>
            </div>

            {/* Footer com preço e status */}
            <div className="mt-3 flex items-end justify-between">
              {/* Preço */}
              <div className="flex flex-col">
                <div className="text-lg font-bold text-foreground sm:text-xl">
                  {formatPrice(item.price)}
                </div>
                <div className="-mt-1 text-xs text-muted-foreground">
                  por {getPeriodLabel(item.period)}
                </div>
              </div>

              {/* Status de disponibilidade */}
              {isAvailable && (
                <div className="flex items-center gap-1 text-xs text-green-600 sm:text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-600" />
                  <span className="font-medium">Disponível</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
