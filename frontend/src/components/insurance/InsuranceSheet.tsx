import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Info,
  Star,
  Zap,
  Crown,
} from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface InsuranceOption {
  id: string;
  name: string;
  description: string;
  coverage: string[];
  price: number;
  deductible: number;
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
  recommended?: boolean;
}

const INSURANCE_OPTIONS: InsuranceOption[] = [
  {
    id: 'basic',
    name: 'Seguro Essencial',
    description: 'Cobertura essencial para danos acidentais',
    coverage: ['Danos acidentais', 'Roubo e furto', 'Suporte 24h'],
    price: 5,
    deductible: 100,
    icon: <Shield className="h-5 w-5" />,
    color: 'border-gray-200 bg-white',
  },
  {
    id: 'standard',
    name: 'Seguro Completo',
    description: 'Cobertura completa com franquia reduzida',
    coverage: ['Tudo do Essencial', 'Mau uso coberto', 'Franquia reduzida', 'Suporte prioritário'],
    price: 10,
    deductible: 50,
    icon: <ShieldCheck className="h-5 w-5" />,
    color: 'border-purple-200 bg-purple-50',
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Seguro Total',
    description: 'Máxima proteção, zero preocupação',
    coverage: [
      'Tudo da Completa',
      'Zero franquia',
      'Substituição imediata',
      'Seguro estendido',
      'Concierge 24h',
    ],
    price: 15,
    deductible: 0,
    icon: <Crown className="h-5 w-5" />,
    color: 'border-purple-200 bg-purple-50',
    popular: true,
  },
];

interface InsuranceSheetProps {
  itemValue: number;
  rentalPeriod: number;
  rentalUnit: 'hora' | 'dia' | 'semana' | 'mes';
  onSelect: (option: InsuranceOption | null) => void;
  selectedOption: InsuranceOption | null;
}

export function InsuranceSheet({
  itemValue,
  rentalPeriod,
  rentalUnit,
  onSelect,
  selectedOption,
}: InsuranceSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const calculateTotalPrice = (option: InsuranceOption) => {
    let multiplier = 1;
    switch (rentalUnit) {
      case 'hora':
        multiplier = rentalPeriod / 24;
        break;
      case 'semana':
        multiplier = rentalPeriod * 7;
        break;
      case 'mes':
        multiplier = rentalPeriod * 30;
        break;
      default:
        multiplier = rentalPeriod;
    }
    return option.price * multiplier;
  };

  const handleSelect = (option: InsuranceOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'relative gap-2 bg-background/80 shadow-sm transition-all duration-200 hover:bg-muted',
            selectedOption && 'border-primary/50 bg-primary/5'
          )}
          aria-label={
            selectedOption ? `Seguro selecionado: ${selectedOption.name}` : 'Adicionar seguro'
          }
        >
          <Shield className="h-4 w-4" />
          {selectedOption ? 'Seguro selecionado' : 'Adicionar seguro'}
          {selectedOption && (
            <Badge className="ml-2 bg-primary px-2 py-0.5 text-xs font-medium">
              {selectedOption.name}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="flex-shrink-0 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-gray-900">
                Escolha seu seguro
              </SheetTitle>
              <SheetDescription className="text-base text-gray-600">
                Proteja seu aluguel com um dos nossos planos de seguro
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto py-6">
          {/* Alert de Informação */}
          <Alert className="border-purple-200 bg-purple-50">
            <Info className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              O seguro é <strong>altamente recomendado</strong> para sua tranquilidade e proteção
              financeira.
            </AlertDescription>
          </Alert>

          {/* Opções de Seguro */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Planos disponíveis</h3>
            <RadioGroup
              value={selectedOption?.id || ''}
              onValueChange={(value) => {
                const option = INSURANCE_OPTIONS.find((opt) => opt.id === value);
                if (option) handleSelect(option);
              }}
              className="space-y-4"
            >
              {INSURANCE_OPTIONS.map((option) => {
                const totalPrice = calculateTotalPrice(option);
                const isSelected = selectedOption?.id === option.id;

                return (
                  <Card
                    key={option.id}
                    className={cn(
                      'relative cursor-pointer transition-all duration-200 hover:shadow-md',
                      isSelected
                        ? 'border-purple-200 bg-purple-50 shadow-lg ring-2 ring-purple-500/20'
                        : 'border-gray-200 bg-white hover:border-purple-200'
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1 h-5 w-5"
                          />
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg',
                                isSelected
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              )}
                            >
                              {option.icon}
                            </div>
                            <div>
                              <Label
                                htmlFor={option.id}
                                className="cursor-pointer text-lg font-semibold text-gray-900"
                              >
                                {option.name}
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(totalPrice)}
                          </div>
                          <div className="text-sm text-gray-500">
                            por {rentalPeriod} {rentalUnit}
                            {rentalPeriod > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      <p className="ml-8 mt-3 text-sm text-gray-600">{option.description}</p>
                    </CardHeader>

                    <CardContent className="card-content-flex pt-0">
                      <div className="card-section-flex ml-8 space-y-3">
                        <div className="card-section-flex space-y-2">
                          <h4 className="text-sm font-semibold text-foreground">
                            Coberturas incluídas:
                          </h4>
                          <div className="grid gap-2">
                            {option.coverage.map((item, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                <span className="text-align-consistent text-foreground">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator className="card-section-fixed" />

                        <div className="card-section-fixed flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-foreground">
                              Franquia: {formatCurrency(option.deductible)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Valor que você paga em caso de sinistro
                            </div>
                          </div>

                          <Button
                            size="sm"
                            variant={isSelected ? 'default' : 'outline'}
                            className={cn(
                              'card-section-fixed w-full font-medium sm:w-auto',
                              isSelected && 'shadow-md'
                            )}
                            onClick={() => handleSelect(option)}
                            aria-label={`Selecionar ${option.name}`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Selecionado
                              </>
                            ) : (
                              'Selecionar'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </RadioGroup>
          </div>

          {/* Informações Importantes */}
          <Card className="border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Info className="h-5 w-5 text-gray-600" />
                Informações importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  <span>O valor do seguro é calculado com base no período de locação</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  <span>A franquia é o valor que você paga em caso de sinistro</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  <span>O seguro pode ser cancelado até 24h antes da locação</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                  <span>Cobertura válida em todo o território nacional</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação - Agora no final do conteúdo */}
        <div className="flex flex-shrink-0 gap-3 border-t border-gray-200 bg-white p-4">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 font-medium text-gray-600 hover:bg-gray-50"
            onClick={() => {
              onSelect(null);
              setIsOpen(false);
            }}
            aria-label="Continuar sem seguro"
          >
            Continuar sem seguro
          </Button>
          <Button
            className="flex-1 bg-purple-600 font-medium text-white hover:bg-purple-700"
            onClick={() => setIsOpen(false)}
            disabled={!selectedOption}
            aria-label={
              selectedOption ? 'Confirmar seguro selecionado' : 'Selecione um seguro primeiro'
            }
          >
            {selectedOption ? 'Confirmar seguro' : 'Selecione um plano'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
