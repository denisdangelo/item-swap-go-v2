import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  title: string;
  available: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  currentIndex = 0,
  setCurrentIndex,
  title,
  available,
}) => {
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const safeIndex = Math.min(Math.max(0, currentIndex), images.length - 1);

  const nextImage = () => {
    setCurrentIndex((safeIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((safeIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
      {/* Imagem atual */}
      <img
        alt={`${title} - Imagem ${safeIndex + 1}`}
        className="w-full h-full object-cover"
        src={images[safeIndex]}
      />

      {/* Overlay de navegação */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        {/* Botões de navegação */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            aria-label="Imagem anterior"
            className="h-full rounded-none bg-black/30 hover:bg-black/50 text-white"
            size="icon"
            variant="ghost"
            onClick={prevImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            aria-label="Próxima imagem"
            className="h-full rounded-none bg-black/30 hover:bg-black/50 text-white"
            size="icon"
            variant="ghost"
            onClick={nextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              aria-label={`Ir para imagem ${index + 1}`}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === safeIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Badge de disponibilidade */}
      {!available && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-red-600/90 text-white" variant="destructive">
            Indisponível
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
