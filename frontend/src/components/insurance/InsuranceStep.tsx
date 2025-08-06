import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Crown,
  CheckCircle2,
  ArrowRight,
  Info,
  AlertTriangle,
  Star,
  X,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useInsuranceRecommendation } from '@/hooks/useInsuranceRecommendation';

interface InsuranceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  deductible: number;
  coverage: string[];
  icon: React.ReactNode;
  recommended?: boolean;
  popular?: boolean;
}

const INSURANCE_OPTIONS: InsuranceOption[] = [
  {
    id: 'basic',
    name: 'Proteção Básica',
    description: 'Cobertura essencial para sua tranquilidade',
    price: 5,
    deductible: 100,
    coverage: ['Danos acidentais', 'Roubo', 'Suporte 24h'],
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: 'standard',
    name: 'Proteção Completa',
    description: 'Nossa recomendação para você',
    price: 10,
    deductible: 50,
    coverage: ['Danos acidentais', 'Roubo', 'Suporte 24h', 'Mau uso', 'Franquia reduzida'],
    icon: <ShieldCheck className="h-5 w-5" />,
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Proteção Total',
    description: 'Cobertura máxima, zero preocupação',
    price: 15,
    deductible: 0,
    coverage: [
      'Cobertura total',
      'Zero franquia',
      'Suporte prioritário',
      'Substituição imediata',
      'Seguro estendido',
    ],
    icon: <Crown className="h-5 w-5" />,
    popular: true,
  },
];

interface InsuranceStepProps {
  itemPrice: number;
  itemCategory: string;
  ownerRating?: number;
  selectedInsurance: InsuranceOption | null;
  onInsuranceSelect: (insurance: InsuranceOption | null) => void;
  onContinue: () => void;
  totalDays?: number;
}

export function InsuranceStep({
  itemPrice,
  itemCategory,
  ownerRating,
  selectedInsurance,
  onInsuranceSelect,
  onContinue,
  totalDays = 1,
}: InsuranceStepProps) {
  const [showAllOptions, setShowAllOptions] = useState(false);

  const recommendation = useInsuranceRecommendation({
    itemPrice,
    itemCategory,
    ownerRating,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateTotalCost = (dailyPrice: number) => {
    return dailyPrice * totalDays;
  };

  const recommendedOption = INSURANCE_OPTIONS.find(
    (option) => option.id === recommendation.suggestedPlan
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Proteção do Aluguel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {recommendation.recommended
            ? recommendation.reason
            : 'Escolha uma proteção para seu aluguel (opcional)'}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recomendação Inteligente */}
        {recommendation.recommended && recommendedOption && (
          <div
            className={cn(
              'rounded-lg border-2 p-4',
              recommendation.urgency === 'high'
                ? 'border-red-200 bg-red-50'
                : recommendation.urgency === 'medium'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-blue-200 bg-blue-50'
            )}
          >
            <div className="mb-3 flex items-start gap-3">
              <div
                className={cn(
                  'rounded-full p-2',
                  recommendation.urgency === 'high'
                    ? 'bg-red-100 text-red-600'
                    : recommendation.urgency === 'medium'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-blue-100 text-blue-600'
                )}
              >
                {recommendation.urgency === 'high' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : recommendation.urgency === 'medium' ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="mb-1 font-semibold text-foreground">Recomendação Inteligente</h4>
                <p className="mb-2 text-sm text-muted-foreground">
                  Baseado no valor e categoria do item
                </p>
                {recommendation.potentialSavings > 0 && (
                  <div className="text-sm font-medium text-emerald-600">
                    💰 Economia de até {formatCurrency(recommendation.potentialSavings)}
                  </div>
                )}
              </div>
            </div>

            {/* Plano Recomendado */}
            <div
              className={cn(
                'cursor-pointer rounded-lg border-2 p-3 transition-all',
                selectedInsurance?.id === recommendedOption.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-white hover:border-primary/50'
              )}
              onClick={() => onInsuranceSelect(recommendedOption)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                    {recommendedOption.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{recommendedOption.name}</span>
                      <Badge className="bg-emerald-100 text-xs text-emerald-700">Recomendado</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{recommendedOption.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">
                    {formatCurrency(recommendedOption.price)}
                    <span className="text-xs font-normal text-muted-foreground">/dia</span>
                  </div>
                  {totalDays > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Total: {formatCurrency(calculateTotalCost(recommendedOption.price))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Opção "Sem Seguro" */}
        <div
          className={cn(
            'cursor-pointer rounded-lg border-2 p-3 transition-all',
            selectedInsurance === null
              ? 'border-primary bg-primary/10'
              : 'border-border bg-white hover:border-primary/50'
          )}
          onClick={() => onInsuranceSelect(null)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                <X className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium text-foreground">Sem proteção</span>
                <p className="text-xs text-muted-foreground">Continuar sem seguro</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-primary">{formatCurrency(0)}</div>
              <p className="text-xs text-red-600">Risco próprio</p>
            </div>
          </div>
        </div>

        {/* Mostrar todas as opções */}
        {showAllOptions && (
          <div className="space-y-3">
            <Separator />
            <h4 className="font-medium text-foreground">Todas as opções</h4>
            {INSURANCE_OPTIONS.map((option) => {
              const isSelected = selectedInsurance?.id === option.id;
              const isRecommended = option.id === recommendation.suggestedPlan;

              return (
                <div
                  key={option.id}
                  className={cn(
                    'cursor-pointer rounded-lg border-2 p-3 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-white hover:border-primary/50'
                  )}
                  onClick={() => onInsuranceSelect(option)}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'rounded-lg p-2',
                          option.id === 'basic' && 'bg-blue-100 text-blue-700',
                          option.id === 'standard' && 'bg-emerald-100 text-emerald-700',
                          option.id === 'premium' && 'bg-purple-100 text-purple-700'
                        )}
                      >
                        {option.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{option.name}</span>
                          {option.recommended && (
                            <Badge className="bg-emerald-100 text-xs text-emerald-700">
                              Recomendado
                            </Badge>
                          )}
                          {option.popular && (
                            <Badge className="bg-purple-100 text-xs text-purple-700">Popular</Badge>
                          )}
                          {isRecommended && !option.recommended && (
                            <Badge className="bg-blue-100 text-xs text-blue-700">Para você</Badge>
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
                      {totalDays > 1 && (
                        <p className="text-xs text-muted-foreground">
                          Total: {formatCurrency(calculateTotalCost(option.price))}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Coberturas */}
                  <div className="ml-11">
                    <div className="flex flex-wrap gap-1">
                      {option.coverage.slice(0, 3).map((coverage, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {coverage}
                        </Badge>
                      ))}
                      {option.coverage.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{option.coverage.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Botão para mostrar todas as opções */}
        {!showAllOptions && (
          <Button variant="outline" onClick={() => setShowAllOptions(true)} className="w-full">
            <Info className="mr-2 h-4 w-4" />
            Ver todas as opções de proteção
          </Button>
        )}

        {/* Informações do seguro selecionado */}
        {selectedInsurance && (
          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="mb-2 font-medium text-foreground">Detalhes da proteção selecionada</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Valor por dia:</span>
                <span className="font-medium">{formatCurrency(selectedInsurance.price)}</span>
              </div>
              {totalDays > 1 && (
                <div className="flex justify-between">
                  <span>Total ({totalDays} dias):</span>
                  <span className="font-medium">
                    {formatCurrency(calculateTotalCost(selectedInsurance.price))}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Franquia:</span>
                <span className="font-medium">
                  {selectedInsurance.deductible === 0
                    ? 'Sem franquia'
                    : formatCurrency(selectedInsurance.deductible)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Botão de continuar */}
        <Button onClick={onContinue} className="w-full">
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
