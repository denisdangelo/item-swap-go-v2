import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MessageCircle,
  Handshake,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { classes, typography } from '@/styles/design-system';
import { cn } from '@/lib/utils';

export function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/20 py-4 pt-6 sm:pt-4">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="mb-6 space-y-2 text-center">
          <h2 className={cn(typography.body.default, 'font-medium')}>Como Funciona?</h2>
          <p className={cn(typography.body.small, 'mx-auto max-w-2xl text-muted-foreground')}>
            Alugue em poucos passos, de forma rápida e segura.
          </p>
        </div>
        {/* Carrossel ocupa toda a largura */}
        <ModernHowItWorksCarousel />
      </div>
    </section>
  );
}

function ModernHowItWorksCarousel() {
  const steps = [
    {
      icon: <Search className="h-10 w-10 text-purple-700" />,
      title: 'Encontre o Item',
      description: 'Busque por categoria, localização ou palavra-chave.',
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-purple-700" />,
      title: 'Entre em Contato',
      description: 'Converse com o dono ou reserve direto pelo app.',
    },
    {
      icon: <Handshake className="h-10 w-10 text-purple-700" />,
      title: 'Retire e Use',
      description: 'Combine a retirada, pegue o item e aproveite.',
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-purple-700" />,
      title: 'Devolva e Avalie',
      description: 'Devolva no prazo e avalie sua experiência.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<any>(null);

  // Autoplay com tempo maior para melhor leitura
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearTimeout(timeoutRef.current);
  }, [activeIndex, steps.length]);

  // Swipe gestures
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    } else if (isRightSwipe) {
      setActiveIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToPrevious = () => {
    setActiveIndex(activeIndex === 0 ? steps.length - 1 : activeIndex - 1);
  };

  const goToNext = () => {
    setActiveIndex(activeIndex === steps.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <div className="relative w-full">
      {/* Card ocupando toda a largura horizontal */}
      <div
        className="relative w-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Card className="relative flex h-[200px] w-full flex-col justify-center rounded-none bg-gradient-to-br from-purple-50 to-purple-100/80 px-6 shadow-xl backdrop-blur-sm md:h-[220px] md:px-10 lg:px-16">
          {/* Botões de navegação dentro do card */}
          <button
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 md:h-12 md:w-12"
            onClick={goToPrevious}
            aria-label="Passo anterior"
          >
            <ChevronLeft
              className={cn('h-5 w-5 md:h-6 md:w-6', classes.text.secondary, 'opacity-80')}
            />
          </button>

          <button
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 md:h-12 md:w-12"
            onClick={goToNext}
            aria-label="Próximo passo"
          >
            <ChevronRight
              className={cn('h-5 w-5 md:h-6 md:w-6', classes.text.secondary, 'opacity-80')}
            />
          </button>

          {/* Indicador de passo discreto */}
          <div className="mb-4 flex items-center justify-center">
            <span className="text-xs text-purple-700">
              Passo {activeIndex + 1} de {steps.length}
            </span>
          </div>

          {/* Conteúdo do card */}
          <div className="flex flex-col items-center text-center">
            {/* Ícone com altura fixa */}
            <div className="mb-4 flex h-12 items-center justify-center">
              {steps[activeIndex].icon}
            </div>

            {/* Título com altura fixa */}
            <h3 className={cn(typography.heading.h6, 'mb-3 flex h-7 items-center justify-center')}>
              {steps[activeIndex].title}
            </h3>

            {/* Descrição com altura fixa */}
            <div className="flex h-12 items-center justify-center">
              <p className={cn(typography.body.small, 'mx-auto max-w-2xl leading-relaxed')}>
                {steps[activeIndex].description}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Indicadores de progresso */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 ${
              idx === activeIndex
                ? 'w-8 bg-purple-600 shadow-md'
                : 'w-2 bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={`Ir para passo ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
