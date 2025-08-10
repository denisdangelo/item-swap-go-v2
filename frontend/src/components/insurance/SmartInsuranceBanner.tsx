import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInsuranceRecommendation } from '@/hooks/useInsuranceRecommendation';
import { cn } from '@/lib/utils';

interface SmartInsuranceBannerProps {
  itemPrice: number;
  itemCategory: string;
  itemId: string;
  ownerRating?: number;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

export function SmartInsuranceBanner({
  itemPrice,
  itemCategory,
  itemId,
  ownerRating,
  onDismiss,
  showDismiss = true,
}: SmartInsuranceBannerProps) {
  const navigate = useNavigate();
  const [isDismissed, setIsDismissed] = useState(false);

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

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleViewInsurance = () => {
    navigate('/insurance', {
      state: {
        fromItemDetails: true,
        itemId,
        itemPrice,
        recommendedPlan: recommendation.suggestedPlan,
      },
    });
  };

  const handleQuickSelect = () => {
    navigate(`/items/${itemId}/loan`, {
      state: {
        preselectedInsurance: recommendation.suggestedPlan,
        fromSmartBanner: true,
      },
    });
  };

  if (isDismissed || !recommendation.recommended) {
    return null;
  }

  const urgencyConfig = {
    high: {
      bgColor: 'bg-gradient-to-r from-red-50 to-orange-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      badgeColor: 'bg-red-100 text-red-700',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      icon: <AlertTriangle className="h-6 w-6" />,
      badge: 'Urgente',
      pulseAnimation: true,
    },
    medium: {
      bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      badgeColor: 'bg-amber-100 text-amber-700',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
      icon: <Shield className="h-6 w-6" />,
      badge: 'Recomendado',
      pulseAnimation: false,
    },
    low: {
      bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      icon: <CheckCircle2 className="h-6 w-6" />,
      badge: 'Sugerido',
      pulseAnimation: false,
    },
  };

  const config = urgencyConfig[recommendation.urgency];

  return (
    <Card
      className={cn(
        'border-2 transition-all duration-300',
        config.bgColor,
        config.borderColor,
        config.pulseAnimation && 'animate-pulse'
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('rounded-full bg-white/80 p-2', config.iconColor)}>
              {config.icon}
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h4 className="font-semibold text-foreground">Proteção Inteligente</h4>
                <Badge className={config.badgeColor}>{config.badge}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
            </div>
          </div>
          {showDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Economia Destacada */}
        {recommendation.potentialSavings > 0 && (
          <div className="mb-3 rounded-lg border border-white/50 bg-white/80 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-foreground">
                  Economia de até {formatCurrency(recommendation.potentialSavings)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">vs. custo sem proteção</div>
            </div>
          </div>
        )}

        {/* Fatores de Risco */}
        {recommendation.riskFactors.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {recommendation.riskFactors.slice(0, 2).map((factor, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {factor}
                </Badge>
              ))}
              {recommendation.riskFactors.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{recommendation.riskFactors.length - 2} mais
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Plano Recomendado */}
        <div className="mb-4 rounded-lg bg-white/90 p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-foreground">
                Proteção{' '}
                {recommendation.suggestedPlan === 'basic'
                  ? 'Básica'
                  : recommendation.suggestedPlan === 'standard'
                    ? 'Completa'
                    : 'Total'}
              </span>
              <p className="text-xs text-muted-foreground">Ideal para este item</p>
            </div>
            <div className="text-right">
              <div className="font-semibold text-primary">
                {formatCurrency(
                  recommendation.suggestedPlan === 'basic'
                    ? 5
                    : recommendation.suggestedPlan === 'standard'
                      ? 10
                      : 15
                )}
                <span className="text-xs font-normal text-muted-foreground">/dia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button onClick={handleQuickSelect} className={cn('text-white', config.buttonColor)}>
            <Shield className="mr-2 h-4 w-4" />
            Proteger Agora
          </Button>
          <Button onClick={handleViewInsurance} variant="outline" className="border-current">
            Ver Opções
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Urgência para Alto Risco */}
        {recommendation.urgency === 'high' && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-red-600">
            <Clock className="h-3 w-3" />
            <span>Proteção altamente recomendada para este tipo de item</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
