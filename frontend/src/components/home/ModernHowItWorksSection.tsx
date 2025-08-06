import { Search, MessageCircle, Handshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ModernHowItWorksSection() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: 'Encontre o Item',
      description:
        'Busque por categoria, localização ou palavra-chave para encontrar exatamente o que precisa.',
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-emerald-600" />,
      title: 'Entre em Contato',
      description: 'Converse com o proprietário ou faça a reserva diretamente pelo aplicativo.',
      color: 'bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-100',
    },
    {
      icon: <Handshake className="h-8 w-8 text-purple-600" />,
      title: 'Retire e Use',
      description: 'Combine a retirada, pegue o item e aproveite com total segurança.',
      color: 'bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-100',
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-amber-600" />,
      title: 'Devolva e Avalie',
      description:
        'Devolva no prazo combinado e avalie sua experiência para ajudar outros usuários.',
      color: 'bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-100',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 border-blue-200 bg-blue-100 text-blue-700">Processo Simples</Badge>
          <h2 className="mb-4 text-3xl font-bold text-gray-900">Como Funciona?</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Alugue em poucos passos, de forma rápida, segura e descomplicada.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card
                className={`${step.color} h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <CardContent className="p-6 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
                      <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`${step.iconBg} mx-auto mb-4 mt-2 flex h-16 w-16 items-center justify-center rounded-full`}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
                </CardContent>
              </Card>

              {/* Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 transform lg:block">
                  <div className="rounded-full bg-white p-2 shadow-md">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">Pronto para começar?</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Card className="cursor-pointer border-2 border-blue-200 bg-white p-4 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Procurar Itens</div>
                  <div className="text-sm text-gray-600">Encontre o que precisa</div>
                </div>
              </div>
            </Card>

            <Card className="cursor-pointer border-2 border-emerald-200 bg-white p-4 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Adicionar Item</div>
                  <div className="text-sm text-gray-600">Comece a ganhar dinheiro</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
