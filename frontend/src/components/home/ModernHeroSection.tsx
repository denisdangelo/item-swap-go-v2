import { ArrowRight, Search, Plus, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ModernHeroSectionProps {
  onExploreItems?: () => void;
  onGetStarted?: () => void;
}

export function ModernHeroSection({ onExploreItems, onGetStarted }: ModernHeroSectionProps) {
  const navigate = useNavigate();

  const handleExploreItems = () => {
    onExploreItems?.();
  };

  const handleGetStarted = () => {
    onGetStarted?.();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-blue-200/50" />
        <div className="absolute right-16 top-32 h-16 w-16 rounded-full bg-purple-200/50" />
        <div className="absolute bottom-20 left-20 h-12 w-12 rounded-full bg-emerald-200/50" />
        <div className="absolute bottom-32 right-10 h-24 w-24 rounded-full bg-amber-200/50" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Conteúdo Principal */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex justify-center lg:justify-start">
              <Badge className="border-emerald-200 bg-emerald-100 px-4 py-2 text-emerald-700">
                <Star className="mr-2 h-4 w-4 fill-current" />
                Plataforma Confiável
              </Badge>
            </div>

            {/* Título Principal */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Alugue e Empreste
                <span className="block text-primary">com Segurança</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-gray-600">
                Conecte-se com pessoas próximas para alugar itens do dia a dia. Economize dinheiro e
                contribua para um consumo mais consciente.
              </p>
            </div>

            {/* CTAs Principais */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                onClick={handleExploreItems}
                size="lg"
                className="h-14 bg-primary px-8 text-base font-semibold shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
              >
                <Search className="mr-2 h-5 w-5" />
                Explorar Itens
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleGetStarted}
                variant="outline"
                size="lg"
                className="h-14 border-2 px-8 text-base font-semibold hover:bg-gray-50"
              >
                <Plus className="mr-2 h-5 w-5" />
                Adicionar Item
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 border-t border-gray-200 pt-8">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Itens Disponíveis</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Usuários Ativos</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-gray-900">4.8★</div>
                <div className="text-sm text-gray-600">Avaliação Média</div>
              </div>
            </div>
          </div>

          {/* Visual/Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 */}
              <Card className="transform bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Furadeira</div>
                    <div className="text-sm text-gray-600">R$ 25/dia</div>
                  </div>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200" />
              </Card>

              {/* Card 2 */}
              <Card className="mt-8 transform bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Bicicleta</div>
                    <div className="text-sm text-gray-600">R$ 15/dia</div>
                  </div>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200" />
              </Card>

              {/* Card 3 */}
              <Card className="transform bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Câmera</div>
                    <div className="text-sm text-gray-600">R$ 40/dia</div>
                  </div>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200" />
              </Card>

              {/* Card 4 */}
              <Card className="mt-8 transform bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Plus className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Guitarra</div>
                    <div className="text-sm text-gray-600">R$ 30/dia</div>
                  </div>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200" />
              </Card>
            </div>

            {/* Floating Badge */}
            <div className="absolute -right-4 -top-4 rounded-full bg-white p-3 shadow-lg">
              <Shield className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
