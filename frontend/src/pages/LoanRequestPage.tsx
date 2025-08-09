import { toast } from '@/components/ui/use-toast';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LoanRequestForm } from '@/components/loan/LoanRequestForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppHeader } from '@/components/ui/app-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { itemsApiService } from '@/services/api/index';

import type { ItemWithDetails } from '@/types';

export function LoanRequestPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<ItemWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) {
        setError('Item não encontrado');
        setLoading(false);
        return;
      }

      try {
        const data = await itemsApiService.getItemById(itemId);
        setItem(data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes do item');
        console.error('Erro ao carregar item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/items/${itemId}/loan` } });
    }
  }, [user, navigate, itemId]);

  // Verifica se o usuário é o proprietário do item
  useEffect(() => {
    if (item && user && item.owner?.id === 'temp-id') {
      // Mock comparison
      setError('Você não pode solicitar empréstimo do seu próprio item');
    }
  }, [item, user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatLocation = (location: {
    address?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    if (!location) return '';
    return location.address || `${location.latitude}, ${location.longitude}`;
  };

  const getPeriodLabel = (period?: string) => {
    const labels: Record<string, string> = {
      hora: 'hora',
      dia: 'dia',
      semana: 'semana',
      mes: 'mês',
    };
    return period ? `/${labels[period]}` : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <AppHeader
          showBackButton
          onBack={() => navigate(-1)}
          title="Solicitar Empréstimo"
          showSearchField={false}
        />

        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
          <Card className="glass-card w-full max-w-md animate-fade-in">
            <div className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-purple-100">
                <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
              </div>
              <h2 className="fluid-title mb-2 text-gray-900">Carregando detalhes</h2>
              <p className="fluid-body text-gray-600">
                Aguarde enquanto buscamos as informações do item...
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <AppHeader showBackButton onBack={() => navigate(-1)} title="Erro" />

        <div className="container mx-auto px-4 py-8">
          <Card className="glass-card mx-auto max-w-2xl animate-fade-in">
            <div className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="fluid-title mb-4 text-gray-900">Erro ao carregar</h1>
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => navigate(-1)} className="btn-primary shadow-lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o item
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="btn-secondary">
                  Ir para o início
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    // TODO: Implementar envio da solicitação
    console.log('Dados da solicitação:', data);
    toast({
      title: 'Solicitação enviada',
      description: 'O proprietário será notificado sobre seu interesse',
      variant: 'default',
    });
    navigate(-1);
  };

  const itemOwner = item.owner;
  const mainImage = item.images[0] || '/placeholder.png';
  const isAvailable = item.status === 'available';

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        showBackButton
        onBack={() => navigate(-1)}
        title="Solicitar Empréstimo"
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
        showSearchField={false}
      />

      <div className="mx-auto max-w-2xl px-4 pb-24 pt-20">
        {/* Informações do Item */}
        <div className="mb-6 flex gap-4 rounded-lg border bg-white p-4">
          <img src={mainImage} alt={item.title} className="h-20 w-20 rounded-lg object-cover" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">{item.title}</h1>
            <p className="text-sm text-muted-foreground">{item.category?.name}</p>
            <div className="mt-1 text-xl font-bold text-primary">
              {formatCurrency(item.price)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {getPeriodLabel(item.period)}
              </span>
            </div>
          </div>
        </div>

        {/* Formulário */}
        {isAvailable && (
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Detalhes do Empréstimo</h2>
            <LoanRequestForm item={item} onCancel={() => navigate(-1)} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}
