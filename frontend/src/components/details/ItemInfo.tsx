import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Shield,
  Star,
  Zap,
  TrendingUp,
  Users,
  Award,
  ThumbsUp,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import type { ItemWithDetails } from '@/types';

interface ItemInfoProps {
  item: ItemWithDetails;
}

const ItemInfo: React.FC<ItemInfoProps> = ({ item }) => {
  if (!item.owner) {
    return null; // Não renderiza se não houver proprietário
  }

  const features = [
    { icon: <Shield className="h-4 w-4" />, text: 'Item verificado', color: 'text-emerald-500' },
    { icon: <Clock className="h-4 w-4" />, text: 'Entrega rápida', color: 'text-blue-500' },
    { icon: <Star className="h-4 w-4" />, text: 'Altamente avaliado', color: 'text-amber-500' },
  ];

  const benefits = [
    { icon: <Zap className="h-4 w-4" />, text: 'Processo 100% digital', color: 'text-primary' },
    { icon: <Shield className="h-4 w-4" />, text: 'Seguro incluído', color: 'text-emerald-500' },
    { icon: <Clock className="h-4 w-4" />, text: 'Suporte 24/7', color: 'text-blue-500' },
  ];

  const trustSignals = [
    {
      icon: <Users className="h-4 w-4" />,
      text: 'Mais de 1000 usuários ativos',
      color: 'text-primary',
    },
    {
      icon: <ThumbsUp className="h-4 w-4" />,
      text: '98% de satisfação',
      color: 'text-emerald-500',
    },
    { icon: <Award className="h-4 w-4" />, text: 'Proprietário premium', color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cabeçalho Principal */}
      <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80 p-4 backdrop-blur-sm sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">{item.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className="touch-manipulation bg-primary/10 text-primary hover:bg-primary/20"
                  variant="secondary"
                >
                  {item.category?.name}
                </Badge>
                {item.featured && (
                  <Badge
                    className="touch-manipulation bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                    variant="secondary"
                  >
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Destaque
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              {item.price && (
                <div className="text-2xl font-bold text-primary sm:text-3xl">
                  R$ {item.price.toFixed(2)}
                  {item.period && (
                    <span className="text-sm font-normal text-muted-foreground sm:text-base">
                      /{item.period}
                    </span>
                  )}
                </div>
              )}
              {item.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-foreground">{item.rating}</span>
                  <span className="text-xs text-muted-foreground sm:text-sm">(23 avaliações)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center space-x-1.5 rounded-full bg-accent/50 px-2.5 py-1 sm:px-3 sm:py-1.5 ${feature.color}`}
              >
                {feature.icon}
                <span className="text-xs font-medium sm:text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Benefícios e Vantagens */}
      <Card className="shadow-soft border-0 bg-gradient-to-r from-primary/5 to-primary/10 p-4 backdrop-blur-sm sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
          <Zap className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          Por que escolher este item?
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 rounded-lg bg-background/50 p-3">
              <div className={benefit.color}>{benefit.icon}</div>
              <span className="text-sm font-medium text-foreground">{benefit.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Sinais de Confiança */}
      <Card className="shadow-soft border-0 bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 backdrop-blur-sm sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
          <Shield className="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5" />
          Confiança e Segurança
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {trustSignals.map((signal, index) => (
            <div key={index} className="flex items-center gap-2 rounded-lg bg-white/50 p-3">
              <div className={signal.color}>{signal.icon}</div>
              <span className="text-sm font-medium text-foreground">{signal.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Descrição e Especificações */}
      <div className="space-y-4 sm:space-y-6">
        {/* Descrição */}
        <Card className="shadow-soft border-0 bg-card/80 p-4 backdrop-blur-sm sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
            <CheckCircle2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            Sobre Este Item
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {item.description}
          </p>
        </Card>

        {/* Especificações */}
        <Card className="shadow-soft border-0 bg-card/80 p-4 backdrop-blur-sm sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground sm:mb-4 sm:text-lg">
            <AlertCircle className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            Especificações Técnicas
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {item.specifications?.map((spec, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-sm text-muted-foreground sm:text-base">{spec.label}</span>
                <span className="text-sm font-medium text-foreground sm:text-base">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Regras de Uso */}
      <Card className="shadow-soft border-0 bg-gradient-to-r from-blue-50 to-blue-100 p-6 backdrop-blur-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Clock className="h-5 w-5 text-blue-600" />
          Como Funciona
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Processo Simples</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  Reserve o item com apenas alguns cliques
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  Combine a retirada diretamente com o proprietário
                </span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Regras de Uso</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">
                  Uso responsável e cuidadoso do equipamento
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">Devolução no prazo acordado</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Informações do Proprietário */}
      <Card className="shadow-soft border-0 bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              alt={`Avatar de ${item.owner.first_name} ${item.owner.last_name}`}
              className="h-16 w-16 rounded-full border-2 border-primary/20"
              loading="lazy"
              src={item.owner.avatar_url || '/avatar-placeholder.png'}
            />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{item.owner.name}</h3>
                <div className="mt-1 flex items-center gap-4">
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-foreground">{item.rating}</span>
                    </div>
                  )}
                  {item.distance && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{item.distance} de distância</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className="bg-emerald-500/10 text-emerald-600" variant="secondary">
                  <Shield className="mr-1 h-3 w-3" />
                  Proprietário Verificado
                </Badge>
                <Badge className="bg-amber-500/10 text-amber-600" variant="secondary">
                  <Award className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ItemInfo;
