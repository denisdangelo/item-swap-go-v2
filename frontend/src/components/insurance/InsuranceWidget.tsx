import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Crown,
  CheckCircle2,
  Info,
  ArrowRight,
  X,
  AlertTriangle,
  Star,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface InsuranceOption {
  id: string;
  name: string;
  shortName: string;
  description: string;
  price: number;
  deductible: number;
  icon: React.ReactNode;
  color: string;
  recommended?: boolean;
  popular?: boolean;
}

const INSURANCE_OPTIONS: InsuranceOption[] = [
  {
    id: 'basic',
    name: 'Proteção Básica',
    shortName: 'Básica',
    description: 'Cobertura essencial',
    price: 5,
    deductible: 100,
    icon: <Shield className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    id: 'standard',
    name: 'Proteção Completa',
    shortName: 'Completa',
    description: 'Nossa recomendação',
    price: 10,
    deductible: 50,
    icon: <ShieldCheck className="h-4 w-4" />,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Proteção Total',
    shortName: 'Total',
    description: 'Zero preocupação',
    price: 15,
    deductible: 0,
    icon: <Crown className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    popular: true,
  },
];

interface InsuranceWidgetProps {
  itemPrice: number;
  itemId: string;
  variant?: 'compact' | 'expanded' | 'inline';
  showDismiss?: boolean;
  onDismiss?: () => void;
}

export function InsuranceWidget({
  itemPrice,
  itemId,
  variant = 'compact',
  showDismiss = false,
  onDismiss,
}: InsuranceWidgetProps) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<InsuranceOption | null>(null);
  const [isExpanded, setIsExpanded] = useState(variant === 'expanded');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateSavings = (insurancePrice: number) => {
    // Simula economia baseada no preço do item
    const potentialLoss = itemPrice * 0.3; // 30% do valor do item
    const insuranceCost = insurancePrice;
    return potentialLoss - insuranceCost;
  };

  const handleSelectInsurance = (option: InsuranceOption) => {
    setSelectedOption(option);
    toast({
      title: 'Proteção selecionada!',
      description: `${option.name} - ${formatCurrency(option.price)}/dia`,
    });
  };

  const handleContinueWithInsurance = () => {
    if (selectedOption) {
      navigate(`/items/${itemId}/loan`, {
        state: {
          preselectedInsurance: selectedOption,
          fromInsuranceWidget: true,
        },
      });
    }
  };

  const handleViewAllOptions = () => {
    navigate('/insurance', {
      state: {
        fromItemDetails: true,
        itemId,
        itemPrice,
      },
    });
  };

  if (variant === 'inline') {
    return (
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Proteja seu aluguel</h4>
              <p className="text-sm text-muted-foreground">A partir de {formatCurrency(5)}/dia</p>
            </div>
            <Button
              size="sm"
              onClick={handleViewAllOptions}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Ver opções
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'border-2 transition-all duration-300',
        selectedOption
          ? 'border-primary bg-primary/5 shadow-lg'
          : 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
      )}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                Proteja seu aluguel
                <Badge className="bg-amber-100 text-xs text-amber-700">Recomendado</Badge>
              </h3>
              <p className="text-sm text-muted-foreground">Alugue com tranquilidade e segurança</p>
            </div>
          </div>
          {showDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Benefício Principal */}
        <div className="mb-4 rounded-lg border border-amber-200 bg-white/80 p-3">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-foreground">
              Sem seguro, você pode pagar até {formatCurrency(itemPrice * 0.5)} em caso de danos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-muted-foreground">
              Com seguro, você economiza até {formatCurrency(calculateSavings(10))}
            </span>
          </div>
        </div>

        {/* Opções de Seguro */}
        {isExpanded ? (
          <div className="mb-4 space-y-3">
            {INSURANCE_OPTIONS.map((option) => {
              const isSelected = selectedOption?.id === option.id;
              return (
                <div
                  key={option.id}
                  className={cn(
                    'cursor-pointer rounded-lg border-2 p-3 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-white hover:border-primary/50'
                  )}
                  onClick={() => handleSelectInsurance(option)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn('rounded-lg p-2', option.color)}>{option.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{option.shortName}</span>
                          {option.recommended && (
                            <Badge className="bg-emerald-100 text-xs text-emerald-700">
                              Recomendado
                            </Badge>
                          )}
                          {option.popular && (
                            <Badge className="bg-purple-100 text-xs text-purple-700">Popular</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {formatCurrency(option.price)}
                        <span className="text-xs font-normal text-muted-foreground">/dia</span>
                      </div>
                      {option.deductible === 0 && (
                        <p className="text-xs text-emerald-600">Sem franquia</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-white/80 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-medium text-foreground">Proteção Completa</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-xs text-emerald-700">
                      Mais escolhida
                    </Badge>
                    <span className="text-xs text-muted-foreground">Cobertura ideal para você</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">
                  {formatCurrency(10)}
                  <span className="text-xs font-normal text-muted-foreground">/dia</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-amber-400" />
                  <span className="text-xs text-muted-foreground">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="space-y-2">
          {selectedOption ? (
            <Button
              onClick={handleContinueWithInsurance}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Zap className="mr-2 h-4 w-4" />
              Continuar com {selectedOption.shortName}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={
                isExpanded
                  ? () => handleSelectInsurance(INSURANCE_OPTIONS[1])
                  : () => setIsExpanded(true)
              }
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isExpanded ? (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Escolher Proteção Completa
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Ver opções de proteção
                </>
              )}
            </Button>
          )}

          <Button variant="outline" onClick={handleViewAllOptions} className="w-full">
            <Info className="mr-2 h-4 w-4" />
            Comparar todos os planos
          </Button>
        </div>

        {/* Informação de Confiança */}
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span>Ativação imediata</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-blue-500" />
              <span>Suporte 24h</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400" />
              <span>98% satisfação</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
