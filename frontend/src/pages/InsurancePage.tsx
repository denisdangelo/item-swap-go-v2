import { ArrowRight, CheckCircle2, Crown, Shield, ShieldCheck, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface InsuranceOption {
  id: string;
  name: string;
  description: string;
  coverage: string[];
  price: number;
  deductible: number;
  icon: React.ReactNode;
  popular?: boolean;
  recommended?: boolean;
  savings?: string;
}

const INSURANCE_OPTIONS: InsuranceOption[] = [
  {
    id: 'basic',
    name: 'Essencial',
    description: 'Proteção básica para começar',
    coverage: ['Danos acidentais', 'Roubo e furto', 'Suporte 24h'],
    price: 5,
    deductible: 100,
    icon: <Shield className="h-7 w-7" />,
  },
  {
    id: 'standard',
    name: 'Completa',
    description: 'Equilibrio perfeito entre proteção e preço',
    coverage: ['Tudo do Essencial', 'Mau uso coberto', 'Franquia reduzida', 'Suporte prioritário'],
    price: 10,
    deductible: 50,
    icon: <ShieldCheck className="h-7 w-7" />,
    recommended: true,
    savings: '89% escolhem',
  },
  {
    id: 'premium',
    name: 'Total',
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
    icon: <Crown className="h-7 w-7" />,
    popular: true,
    savings: 'Sem franquia',
  },
];

export function InsurancePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<InsuranceOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Verificar se veio de um fluxo de empréstimo
  const fromLoanFlow = location.state?.fromLoanFlow;
  const loanData = location.state?.loanData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleSelect = (option: InsuranceOption) => {
    setSelectedOption(option);
    toast({
      title: 'Seguro selecionado!',
      description: `${option.name} - ${formatCurrency(option.price)}/dia`,
    });
  };

  const handleContinue = async () => {
    if (!selectedOption) {
      toast({
        title: 'Selecione um seguro',
        description: 'Escolha um plano para continuar.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Mostrar feedback inicial
      toast({
        title: 'Ativando proteção...',
        description: `Processando ${selectedOption.name}`,
      });

      // Simular processamento da ativação do seguro
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Feedback de sucesso
      toast({
        title: 'Proteção ativada com sucesso!',
        description: `${selectedOption.name} está ativo. Você está protegido!`,
      });

      // Pequeno delay para mostrar o feedback antes de navegar
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Criar uma versão serializable do selectedOption (sem elementos React)
      const serializableInsurance = {
        id: selectedOption.id,
        name: selectedOption.name,
        description: selectedOption.description,
        coverage: selectedOption.coverage,
        price: selectedOption.price,
        deductible: selectedOption.deductible,
        popular: selectedOption.popular,
        recommended: selectedOption.recommended,
        savings: selectedOption.savings,
      };

      // Redirecionar baseado no fluxo
      if (fromLoanFlow && loanData) {
        navigate('/loan-confirmation', {
          state: {
            ...loanData,
            insurance: serializableInsurance,
          },
        });
      } else {
        navigate('/insurance-success', {
          state: {
            insurance: serializableInsurance,
            fromHome: true,
          },
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao ativar proteção',
        description: 'Não foi possível ativar o seguro. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    if (fromLoanFlow && loanData) {
      navigate('/loan-confirmation', {
        state: {
          ...loanData,
          insurance: null,
        },
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        showBackButton
        onBack={() => navigate(-1)}
        title="Seguros"
        user={
          user
            ? {
                id: 'temp-id',
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : null
        }
      />

      <div className="mx-auto max-w-lg px-4 pb-safe-bottom pt-20">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-purple-700 to-purple-900 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Alugue com
            <span className="text-purple-700"> segurança</span>
          </h1>
          <p className="text-base leading-relaxed text-gray-600">
            Escolha sua proteção e tenha tranquilidade total durante o aluguel
          </p>
        </div>

        {/* Insurance Options */}
        <div className="mb-8 space-y-4">
          {INSURANCE_OPTIONS.map((option, index) => {
            const isSelected = selectedOption?.id === option.id;

            return (
              <Card
                key={option.id}
                className={cn(
                  'relative cursor-pointer transition-all duration-200 hover:shadow-lg',
                  isSelected
                    ? 'border-purple-200 bg-purple-50 ring-2 ring-purple-500/20'
                    : 'border-gray-200 bg-white hover:border-purple-200'
                )}
                onClick={() => handleSelect(option)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Ícone padronizado */}
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                        {option.icon}
                      </div>
                    </div>

                    {/* Conteúdo principal */}
                    <div className="flex-1 space-y-3">
                      {/* Header do card */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Seguro {option.name}
                        </h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>

                      {/* Preço */}
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(option.price)}
                        </span>
                        <span className="text-sm text-gray-500">/dia</span>
                        {option.savings && (
                          <span className="ml-2 text-xs font-medium text-green-600">
                            {option.savings}
                          </span>
                        )}
                      </div>

                      {/* Coverage Preview */}
                      <div className="space-y-1">
                        {option.coverage.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                        {option.coverage.length > 3 && (
                          <p className="ml-6 text-xs text-gray-500">
                            +{option.coverage.length - 3} benefícios adicionais
                          </p>
                        )}
                      </div>

                      {/* Badge sem franquia */}
                      {option.deductible === 0 && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Sem franquia</span>
                        </div>
                      )}

                      {/* Botão de seleção */}
                      <div className="pt-2">
                        <Button
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className={cn(
                            'w-full transition-all duration-200',
                            isSelected && 'bg-purple-600 hover:bg-purple-700'
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(option);
                          }}
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mb-8 space-y-3">
          <Button
            onClick={handleContinue}
            disabled={!selectedOption || isProcessing}
            className="w-full bg-purple-600 py-3 text-white hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <Zap className="mr-2 h-5 w-5 animate-spin" />
                Ativando proteção...
              </>
            ) : (
              <>
                Ativar Proteção
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <Button
            onClick={handleSkip}
            variant="ghost"
            className="w-full py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            {fromLoanFlow ? 'Continuar sem proteção' : 'Talvez depois'}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Por que nossa proteção é essencial?
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Suporte especializado 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Resolução rápida de problemas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
                  <span>Tranquilidade total durante o aluguel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
