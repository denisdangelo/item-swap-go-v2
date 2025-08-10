import { ArrowRight, Shield, Star, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ModernFinalCTASectionProps {
  onGetStarted?: () => void;
  onExploreItems?: () => void;
}

export function ModernFinalCTASection({
  onGetStarted,
  onExploreItems,
}: ModernFinalCTASectionProps) {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Shield className="h-5 w-5 text-emerald-600" />,
      text: 'Transações Seguras',
    },
    {
      icon: <Star className="h-5 w-5 text-amber-500" />,
      text: 'Avaliações Reais',
    },
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      text: 'Comunidade Ativa',
    },
    {
      icon: <Zap className="h-5 w-5 text-purple-600" />,
      text: 'Processo Rápido',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/20" />
        <div className="absolute bottom-20 right-16 h-24 w-24 rounded-full bg-white/20" />
        <div className="absolute left-1/4 top-1/2 h-16 w-16 rounded-full bg-white/20" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Badge */}
        <Badge className="mb-6 border-white/30 bg-white/20 text-white">
          <Star className="mr-2 h-4 w-4 fill-current" />
          Junte-se à Comunidade
        </Badge>

        {/* Main Content */}
        <div className="mb-10 space-y-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Pronto para Começar?</h2>
          <p className="mx-auto max-w-2xl text-xl text-blue-100">
            Faça parte de uma comunidade que compartilha, economiza e constrói um futuro mais
            sustentável.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <CardContent className="p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  {benefit.icon}
                </div>
                <p className="text-sm font-medium text-white">{benefit.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="h-14 bg-white px-8 text-base font-semibold text-blue-700 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
          >
            Adicionar Meu Primeiro Item
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={onExploreItems}
            variant="outline"
            size="lg"
            className="h-14 border-2 border-white/30 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10"
          >
            Explorar Itens Disponíveis
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
          <div>
            <div className="text-2xl font-bold text-white">1000+</div>
            <div className="text-sm text-blue-200">Itens Cadastrados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-sm text-blue-200">Usuários Ativos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">4.8★</div>
            <div className="text-sm text-blue-200">Satisfação</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-blue-200">
            ✓ Plataforma segura e confiável • ✓ Suporte 24/7 • ✓ Sem taxas ocultas
          </p>
        </div>
      </div>
    </section>
  );
}
