import {
  Star,
  X,
  Tag,
  MapPin,
  Calendar,
  CheckCircle,
  UserCheck,
  Filter,
  ArrowLeft,
  Zap,
  Clock,
  Loader2,
  Check,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useSearchFilters } from '@/contexts/SearchFiltersContext';
import { classes, typography } from '@/styles/design-system';

const MAX_PRICE = 1000;
const MAX_DISTANCE_KM = 100;

// TESTE: Se você está vendo este comentário, as mudanças estão sendo aplicadas

export const periodOptions: {
  value: 'hora' | 'dia' | 'semana' | 'mes';
  label: string;
}[] = [
  { value: 'hora', label: 'Hora' },
  { value: 'dia', label: 'Dia' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
];

export interface FilterSheetProps {
  maxDistance: number;
  priceRange: [number, number];
  period: 'hora' | 'dia' | 'semana' | 'mes' | null;
  onlyAvailable: boolean;
  onlyVerified: boolean;
  minRating: number;
  activeFilterCount?: number;
  onMaxDistanceChange: (value: number) => void;
  onPriceRangeChange: (value: [number, number]) => void;
  onPeriodChange: (value: 'hora' | 'dia' | 'semana' | 'mes' | null) => void;
  onOnlyAvailableChange: (value: boolean) => void;
  onOnlyVerifiedChange: (value: boolean) => void;
  onMinRatingChange: (value: number) => void;
  onClose?: () => void; // Nova prop para fechar o modal
}

export function FilterSheet({
  maxDistance,
  priceRange,
  period,
  onlyAvailable,
  onlyVerified,
  minRating,
  activeFilterCount,
  onMaxDistanceChange,
  onPriceRangeChange,
  onPeriodChange,
  onOnlyAvailableChange,
  onOnlyVerifiedChange,
  onMinRatingChange,
  onClose,
}: FilterSheetProps) {
  const { clearFilters } = useSearchFilters();

  // Estados para controle de UX
  const [isApplying, setIsApplying] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Local state for temporary changes
  const [localPriceRange, setLocalPriceRange] = React.useState(priceRange);
  const [localMaxDistance, setLocalMaxDistance] = React.useState(maxDistance);
  const [localPeriod, setLocalPeriod] = React.useState(period);
  const [localOnlyAvailable, setLocalOnlyAvailable] = React.useState(onlyAvailable);
  const [localOnlyVerified, setLocalOnlyVerified] = React.useState(onlyVerified);
  const [localMinRating, setLocalMinRating] = React.useState(minRating);

  // Sync local state with props
  React.useEffect(() => {
    setLocalPriceRange(priceRange);
    setLocalMaxDistance(maxDistance);
    setLocalPeriod(period);
    setLocalOnlyAvailable(onlyAvailable);
    setLocalOnlyVerified(onlyVerified);
    setLocalMinRating(minRating);
    setHasUnsavedChanges(false);
  }, [priceRange, maxDistance, period, onlyAvailable, onlyVerified, minRating]);

  // Detectar mudanças não salvas
  React.useEffect(() => {
    const hasChanges =
      localPriceRange[0] !== priceRange[0] ||
      localPriceRange[1] !== priceRange[1] ||
      localMaxDistance !== maxDistance ||
      localPeriod !== period ||
      localOnlyAvailable !== onlyAvailable ||
      localOnlyVerified !== onlyVerified ||
      localMinRating !== minRating;

    setHasUnsavedChanges(hasChanges);
  }, [
    localPriceRange,
    localMaxDistance,
    localPeriod,
    localOnlyAvailable,
    localOnlyVerified,
    localMinRating,
    priceRange,
    maxDistance,
    period,
    onlyAvailable,
    onlyVerified,
    minRating,
  ]);

  // Aplicação imediata para filtros simples (toggles)
  const handleQuickFilterChange = async (
    filterType: 'available' | 'verified' | 'rating',
    value: any
  ) => {
    setIsApplying(true);

    try {
      // Aplicar imediatamente
      switch (filterType) {
        case 'available':
          setLocalOnlyAvailable(value);
          onOnlyAvailableChange(value);
          break;
        case 'verified':
          setLocalOnlyVerified(value);
          onOnlyVerifiedChange(value);
          break;
        case 'rating':
          setLocalMinRating(value);
          onMinRatingChange(value);
          break;
      }

      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Feedback visual
      toast.success('Filtro aplicado!', {
        description: 'Os resultados foram atualizados.',
        duration: 2000,
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      });

      // Fechar automaticamente após aplicar filtro rápido
      setTimeout(() => {
        onClose?.();
      }, 500);
    } catch (error) {
      toast.error('Erro ao aplicar filtro', {
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyFilters = async () => {
    setIsApplying(true);

    try {
      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      onPriceRangeChange(localPriceRange);
      onMaxDistanceChange(localMaxDistance);
      onPeriodChange(localPeriod);
      onOnlyAvailableChange(localOnlyAvailable);
      onOnlyVerifiedChange(localOnlyVerified);
      onMinRatingChange(localMinRating);

      // Feedback de sucesso
      const activeCount = [
        localPriceRange[0] > 0 || localPriceRange[1] < MAX_PRICE,
        localMaxDistance > 0,
        localPeriod !== null,
        localOnlyAvailable,
        localOnlyVerified,
        localMinRating > 0,
      ].filter(Boolean).length;

      toast.success('Filtros aplicados!', {
        description: `${activeCount} filtro${activeCount !== 1 ? 's' : ''} ativo${activeCount !== 1 ? 's' : ''}`,
        duration: 3000,
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      });

      onClose?.();
    } catch (error) {
      toast.error('Erro ao aplicar filtros', {
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearFilters = async () => {
    setIsClearing(true);

    try {
      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 400));

      const defaultValues = {
        priceRange: [0, MAX_PRICE] as [number, number],
        maxDistance: 0,
        period: null,
        onlyAvailable: false,
        onlyVerified: false,
        minRating: 0,
      };

      // Update local state
      setLocalPriceRange(defaultValues.priceRange);
      setLocalMaxDistance(defaultValues.maxDistance);
      setLocalPeriod(defaultValues.period);
      setLocalOnlyAvailable(defaultValues.onlyAvailable);
      setLocalOnlyVerified(defaultValues.onlyVerified);
      setLocalMinRating(defaultValues.minRating);

      // Apply cleared filters
      onPriceRangeChange(defaultValues.priceRange);
      onMaxDistanceChange(defaultValues.maxDistance);
      onPeriodChange(defaultValues.period);
      onOnlyAvailableChange(defaultValues.onlyAvailable);
      onOnlyVerifiedChange(defaultValues.onlyVerified);
      onMinRatingChange(defaultValues.minRating);

      clearFilters();

      toast.success('Filtros limpos!', {
        description: 'Todos os filtros foram removidos.',
        duration: 2000,
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      });

      onClose?.();
    } catch (error) {
      toast.error('Erro ao limpar filtros', {
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Filtros rápidos modernos com aplicação imediata
  const FILTROS_RAPIDOS = [
    {
      id: 'disponivel-agora',
      label: 'Disponível agora',
      icon: <Zap className="h-4 w-4" />,
      active: localOnlyAvailable,
      onClick: () => handleQuickFilterChange('available', !localOnlyAvailable),
    },
    {
      id: 'verificados',
      label: 'Verificados',
      icon: <UserCheck className="h-4 w-4" />,
      active: localOnlyVerified,
      onClick: () => handleQuickFilterChange('verified', !localOnlyVerified),
    },
    {
      id: 'bem-avaliados',
      label: '4+ estrelas',
      icon: <Star className="h-4 w-4" />,
      active: localMinRating >= 4,
      onClick: () => handleQuickFilterChange('rating', localMinRating >= 4 ? 0 : 4),
    },
  ];

  const FAIXAS_PRECO = [
    { label: 'Até R$ 50', value: [0, 50] as [number, number] },
    { label: 'R$ 50 - R$ 150', value: [50, 150] as [number, number] },
    { label: 'R$ 150 - R$ 300', value: [150, 300] as [number, number] },
    { label: 'R$ 300+', value: [300, MAX_PRICE] as [number, number] },
  ];

  const OPCOES_DISTANCIA = [
    { label: 'Próximo (5km)', value: 5 },
    { label: 'Região (15km)', value: 15 },
    { label: 'Cidade (30km)', value: 30 },
    { label: 'Qualquer lugar', value: 0 },
  ];

  const PERIODOS_ALUGUEL = [
    { value: 'hora' as const, label: 'Por hora', icon: <Clock className="h-4 w-4" /> },
    { value: 'dia' as const, label: 'Por dia', icon: <Calendar className="h-4 w-4" /> },
    { value: 'semana' as const, label: 'Por semana', icon: <Calendar className="h-4 w-4" /> },
    { value: 'mes' as const, label: 'Por mês', icon: <Calendar className="h-4 w-4" /> },
  ];

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="flex h-full w-full flex-col bg-gray-50">
      {/* Header com resumo */}
      {hasActiveFilters && (
        <div className={cn(classes.border.default, 'border-b bg-white px-6 py-4')}>
          <div className="mb-2 flex items-center justify-between">
            <h3 className={cn(typography.body.small, 'font-medium')}>Filtros ativos</h3>
            <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
              {activeFilterCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {localPriceRange[0] > 0 || localPriceRange[1] < MAX_PRICE ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                <Tag className="h-3 w-3" />
                R$ {localPriceRange[0]} -{' '}
                {localPriceRange[1] === MAX_PRICE ? '∞' : localPriceRange[1]}
              </span>
            ) : null}
            {localMaxDistance > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">
                <MapPin className="h-3 w-3" />
                {localMaxDistance}km
              </span>
            )}
            {localPeriod && (
              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-xs text-purple-700">
                <Calendar className="h-3 w-3" />
                {PERIODOS_ALUGUEL.find((p) => p.value === localPeriod)?.label}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-8">
          {/* Filtros rápidos */}
          <div>
            <h3 className={cn(typography.heading.h5, 'mb-4')}>Filtros rápidos</h3>
            <div className="grid grid-cols-1 gap-3">
              {FILTROS_RAPIDOS.map((filtro) => (
                <button
                  key={filtro.id}
                  onClick={filtro.onClick}
                  className={cn(
                    'flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all duration-200',
                    filtro.active
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'rounded-lg p-2',
                        filtro.active
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {filtro.icon}
                    </div>
                    <span
                      className={cn(
                        'font-medium',
                        filtro.active ? classes.text.brand : classes.text.primary
                      )}
                    >
                      {filtro.label}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'h-5 w-5 rounded-full border-2 transition-colors',
                      filtro.active ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                    )}
                  >
                    {filtro.active && <CheckCircle className="h-full w-full text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Faixa de preço */}
          <div>
            <h3 className={cn(typography.heading.h5, 'mb-4 flex items-center gap-2')}>
              <Tag className={cn('h-5 w-5', classes.text.secondary)} />
              Faixa de preço
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {FAIXAS_PRECO.map((faixa, idx) => (
                <button
                  key={idx}
                  onClick={() => setLocalPriceRange(faixa.value)}
                  disabled={isApplying || isClearing}
                  className={cn(
                    'rounded-lg border-2 p-3 text-center text-sm font-medium transition-all duration-200',
                    localPriceRange[0] === faixa.value[0] && localPriceRange[1] === faixa.value[1]
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm',
                    (isApplying || isClearing) && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {faixa.label}
                </button>
              ))}
            </div>

            {/* Slider personalizado para preço */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>R$ {localPriceRange[0]}</span>
                <span>R$ {localPriceRange[1] === MAX_PRICE ? '1000+' : localPriceRange[1]}</span>
              </div>
              <Slider
                value={localPriceRange}
                onValueChange={(value) => setLocalPriceRange(value as [number, number])}
                max={MAX_PRICE}
                min={0}
                step={10}
                className="w-full"
                disabled={isApplying || isClearing}
              />
            </div>
          </div>

          {/* Distância */}
          <div>
            <h3 className={cn(typography.heading.h5, 'mb-4 flex items-center gap-2')}>
              <MapPin className={cn('h-5 w-5', classes.text.secondary)} />
              Distância
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {OPCOES_DISTANCIA.map((opcao, idx) => (
                <button
                  key={idx}
                  onClick={() => setLocalMaxDistance(opcao.value)}
                  className={cn(
                    'rounded-lg border-2 p-3 text-center text-sm font-medium transition-all duration-200',
                    localMaxDistance === opcao.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                  )}
                >
                  {opcao.label}
                </button>
              ))}
            </div>
          </div>

          {/* Período de aluguel */}
          <div>
            <h3 className={cn(typography.heading.h5, 'mb-4 flex items-center gap-2')}>
              <Calendar className={cn('h-5 w-5', classes.text.secondary)} />
              Período de aluguel
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PERIODOS_ALUGUEL.map((periodo) => (
                <button
                  key={periodo.value}
                  onClick={() =>
                    setLocalPeriod(localPeriod === periodo.value ? null : periodo.value)
                  }
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all duration-200',
                    localPeriod === periodo.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                  )}
                >
                  {periodo.icon}
                  {periodo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer com ações melhorado */}
      <div className="border-t bg-white px-6 py-4">
        {/* Indicador de mudanças não salvas */}
        {hasUnsavedChanges && !isApplying && (
          <div className="mb-3 flex items-center justify-center gap-2 text-sm text-amber-600">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <span>Você tem alterações não salvas</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="h-12 flex-1 font-medium"
            disabled={!hasActiveFilters || isApplying || isClearing}
          >
            {isClearing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Limpando...
              </>
            ) : (
              'Limpar tudo'
            )}
          </Button>

          <Button
            onClick={handleApplyFilters}
            className={cn(
              'h-12 flex-1 font-medium transition-all',
              hasUnsavedChanges
                ? 'bg-purple-600 shadow-lg hover:bg-purple-700'
                : 'bg-purple-500 hover:bg-purple-600'
            )}
            disabled={isApplying || isClearing}
          >
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aplicando...
              </>
            ) : (
              <>
                {hasUnsavedChanges && <Check className="mr-2 h-4 w-4" />}
                {hasUnsavedChanges ? 'Aplicar alterações' : 'Aplicar filtros'}
              </>
            )}
          </Button>
        </div>

        {/* Contador de resultados (simulado) */}
        {!isApplying && !isClearing && (
          <div className="mt-3 text-center text-xs text-gray-500">
            {hasActiveFilters
              ? `${activeFilterCount} filtro${activeFilterCount !== 1 ? 's' : ''} ativo${activeFilterCount !== 1 ? 's' : ''}`
              : 'Nenhum filtro aplicado'}
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterSheet;
