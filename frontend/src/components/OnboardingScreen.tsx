import { ArrowLeft, ArrowRight, DollarSign, Home, Recycle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const OnboardingScreen = ({ onNext }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Home className="h-12 w-12 text-primary" />,
      title: 'Tem ferramentas paradas em casa?',
      description:
        'Transforme seus itens ociosos em uma fonte de renda extra alugando para pessoas próximas da sua região.',
      gradient: 'from-primary/10 to-primary/20',
      bgPattern: 'bg-gradient-to-br from-accent to-primary/5',
    },
    {
      icon: <DollarSign className="h-12 w-12 text-success" />,
      title: 'Ganhe dinheiro alugando',
      description:
        'Conecte-se com vizinhos que precisam dos seus itens e gere renda de forma sustentável e segura.',
      gradient: 'from-success/10 to-success/20',
      bgPattern: 'bg-gradient-to-br from-green-50 to-success/5',
    },
    {
      icon: <Recycle className="h-12 w-12 text-warning" />,
      title: 'Evite comprar, prefira alugar',
      description:
        'Encontre tudo que precisa por perto, economize dinheiro e contribua para um consumo mais consciente.',
      gradient: 'from-warning/10 to-warning/20',
      bgPattern: 'bg-gradient-to-br from-orange-50 to-warning/5',
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-accent/30 to-primary/5 p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <h2 className="text-lg font-bold text-primary">Empresta aê</h2>
          </div>
        </div>

        <Card className="shadow-large hover-lift border-0 bg-card/80 p-8 text-center backdrop-blur-sm">
          <div
            className={`mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-r ${slides[currentSlide].gradient} shadow-medium flex items-center justify-center transition-all duration-300`}
          >
            {slides[currentSlide].icon}
          </div>

          <h1 className="mb-4 text-2xl font-bold leading-tight text-foreground">
            {slides[currentSlide].title}
          </h1>

          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            {slides[currentSlide].description}
          </p>

          {/* Progress indicators */}
          <div
            aria-label="Progresso do onboarding"
            className="mb-8 flex justify-center space-x-2"
            role="tablist"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                aria-label={`Slide ${index + 1} de ${slides.length}`}
                aria-selected={index === currentSlide}
                className={`h-3 w-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  index === currentSlide
                    ? 'bg-primary shadow-sm'
                    : 'bg-muted hover:bg-muted-foreground/30'
                }`}
                role="tab"
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="mt-6 space-y-3">
          <Button
            aria-label={
              currentSlide === slides.length - 1 ? 'Começar a usar o app' : 'Próximo slide'
            }
            className="shadow-medium hover-lift flex w-full items-center justify-center space-x-2 bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
            onClick={nextSlide}
          >
            <span>{currentSlide === slides.length - 1 ? 'Começar' : 'Próximo'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            aria-label="Slide anterior"
            className="shadow-soft hover-lift flex w-full items-center justify-center space-x-2 px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentSlide === 0}
            variant="outline"
            onClick={prevSlide}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Anterior</span>
          </Button>
        </div>

        {/* Skip option */}
        <div className="mt-6 text-center">
          <Button
            aria-label="Pular onboarding"
            className="text-sm text-muted-foreground hover:text-foreground"
            variant="ghost"
            onClick={onNext}
          >
            Pular apresentação
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
