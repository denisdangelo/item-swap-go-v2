import { Shield, AlertTriangle, CheckCircle2, TrendingUp, Users, Star } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InsuranceEducationProps {
  itemPrice: number;
  itemCategory: string;
}

export function InsuranceEducation({ itemPrice, itemCategory }: InsuranceEducationProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calcula riscos baseados na categoria e preço
  const getRiskLevel = (category: string, price: number) => {
    const highRiskCategories = ['eletrônicos', 'ferramentas', 'equipamentos'];
    const isHighRisk = highRiskCategories.some((cat) => category.toLowerCase().includes(cat));

    if (isHighRisk && price > 200) return 'alto';
    if (price > 100) return 'médio';
    return 'baixo';
  };

  const riskLevel = getRiskLevel(itemCategory, itemPrice);
  const potentialLoss = itemPrice * 0.4; // 40% do valor em caso de dano total
  const insuranceCost = 10; // Custo médio do seguro
  const savings = potentialLoss - insuranceCost;

  const riskData = {
    alto: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      message: 'Item de alto valor com maior risco de danos',
      stats: '73% dos usuários contratam seguro para itens similares',
    },
    médio: {
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: <Shield className="h-5 w-5 text-amber-600" />,
      message: 'Proteção recomendada para sua tranquilidade',
      stats: '58% dos usuários escolhem proteção para itens similares',
    },
    baixo: {
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
      message: 'Proteção básica já oferece boa cobertura',
      stats: '42% dos usuários optam por proteção básica',
    },
  };

  const currentRisk = riskData[riskLevel];

  return (
    <Card className={`${currentRisk.bgColor} ${currentRisk.borderColor} border-2`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          {currentRisk.icon}
          <div>
            <h4 className="font-semibold text-foreground">Por que proteger este aluguel?</h4>
            <p className="text-sm text-muted-foreground">{currentRisk.message}</p>
          </div>
        </div>

        {/* Comparação de Custos */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/80 p-3 text-center">
            <div className="text-lg font-bold text-red-600">{formatCurrency(potentialLoss)}</div>
            <p className="text-xs text-muted-foreground">Custo potencial sem seguro</p>
          </div>
          <div className="rounded-lg bg-white/80 p-3 text-center">
            <div className="text-lg font-bold text-emerald-600">
              {formatCurrency(insuranceCost)}
            </div>
            <p className="text-xs text-muted-foreground">Custo do seguro/dia</p>
          </div>
        </div>

        {/* Economia */}
        <div className="mb-4 rounded-lg bg-emerald-100 p-3 text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-emerald-800">
              Economia de até {formatCurrency(savings)}
            </span>
          </div>
          <p className="text-xs text-emerald-700">Protegendo-se contra imprevistos</p>
        </div>

        {/* Estatísticas Sociais */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{currentRisk.stats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-400" />
            <span>4.8/5 satisfação</span>
          </div>
        </div>

        {/* Badge de Urgência para Alto Risco */}
        {riskLevel === 'alto' && (
          <div className="mt-3 text-center">
            <Badge className="bg-red-100 text-red-700">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Proteção altamente recomendada
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
