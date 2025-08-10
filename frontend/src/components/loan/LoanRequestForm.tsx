import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calculator, Calendar as CalendarIcon, Clock, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import type { ItemWithDetails } from '@/types';

interface LoanRequestFormProps {
  item: ItemWithDetails;
  onCancel: () => void;
  onSubmit: (data: Record<string, unknown>) => void;
}

export function LoanRequestForm({ item, onCancel, onSubmit }: LoanRequestFormProps) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia inicial
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    return days * item.price;
  };

  // Função para lidar com a seleção da data de início
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      // Fechar o calendário da data de início
      setStartDateOpen(false);
      // Abrir automaticamente o calendário da data de devolução após um pequeno delay
      setTimeout(() => {
        setEndDateOpen(true);
      }, 200);
    }
  };

  // Função para lidar com a seleção da data de devolução
  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      // Fechar o calendário da data de devolução
      setEndDateOpen(false);
      // Pequeno scroll suave para mostrar o valor calculado (opcional)
      setTimeout(() => {
        const valueCard = document.querySelector('[data-value-card]');
        if (valueCard) {
          valueCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const formData = {
        itemId: item.id,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        totalDays: calculateTotalDays(),
        totalPrice: calculateTotalPrice(),
        reason: reason.trim(),
        submittedAt: new Date().toISOString(),
      };

      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = startDate && endDate && reason.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Seleção de Datas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Período do Empréstimo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Data de Início */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data de Retirada</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-11 w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? format(startDate, 'dd/MM/yyyy', { locale: ptBR })
                      : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data de Fim */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data de Devolução</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-11 w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Valor */}
      <Card
        data-value-card
        className={cn(
          'border-2 transition-all duration-200',
          startDate && endDate
            ? 'border-success bg-success/5'
            : 'border-dashed border-muted-foreground/30 bg-muted/20'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                <span className="font-medium">Valor Total</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {startDate && endDate
                  ? `${calculateTotalDays()} ${calculateTotalDays() === 1 ? 'dia' : 'dias'} × ${formatCurrency(item.price)}`
                  : 'Selecione as datas para calcular'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {startDate && endDate ? formatCurrency(calculateTotalPrice()) : '--'}
              </p>
              {startDate && endDate && (
                <p className="text-xs text-success">✓ Calculado automaticamente</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivo do Empréstimo */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Finalidade do Empréstimo</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Descreva brevemente como pretende usar o item..."
            className="min-h-[100px] resize-none"
            required
          />
        </CardContent>
      </Card>

      {/* Dica sobre Seguro */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="font-medium text-amber-900">Proteção Recomendada</p>
              <p className="text-sm text-amber-800">
                Considere contratar um seguro para proteger você e o proprietário.{' '}
                <button
                  type="button"
                  onClick={() => navigate('/insurance')}
                  className="cursor-pointer font-medium text-amber-900 underline transition-colors hover:text-amber-700"
                >
                  Ver opções de seguro →
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-12 flex-1"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="h-12 flex-1"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Solicitação'
          )}
        </Button>
      </div>
    </div>
  );
}
