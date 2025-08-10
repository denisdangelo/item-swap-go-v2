import { Calendar, CheckCircle2, Clock, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/ui/page-container';
import { useAuth } from '@/hooks/useAuth';

import type { ItemWithDetails } from '@/types';

interface LoanConfirmationData {
  item: ItemWithDetails;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  insurance?: {
    name: string;
    price: number;
  };
}

export function LoanConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const data = location.state as LoanConfirmationData;

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader
          showBackButton
          onBack={() => navigate('/')}
          title="Confirmação"
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

        <PageContainer className="max-w-2xl">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Dados não encontrados. Volte e tente novamente.</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Voltar ao início
              </Button>
            </CardContent>
          </Card>
        </PageContainer>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateDays = () => {
    return Math.ceil(
      (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const formatLocation = (location: {
    address?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    if (!location) return '';
    return location.address || `${location.latitude}, ${location.longitude}`;
  };

  const handleViewItem = () => {
    navigate(`/item/${data.item.id}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewRequests = () => {
    navigate('/requests');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        showBackButton
        onBack={() => navigate('/')}
        title="Confirmação"
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

      <PageContainer className="max-w-2xl">
        {/* Header de Sucesso */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Empréstimo Confirmado!</h1>
          <p className="text-gray-600">
            Seu pedido foi processado com sucesso. Aguarde a confirmação do proprietário.
          </p>
        </div>

        {/* Detalhes do Item */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-700" />
              Detalhes do Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img
                src={data.item.images[0] || '/placeholder.svg'}
                alt={data.item.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{data.item.title}</h3>
                <p className="text-sm text-gray-600">{data.item.description}</p>
                <Badge variant="outline" className="mt-1">
                  {formatCurrency(data.item.price)}/dia
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do Aluguel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-700" />
              Detalhes do Aluguel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Data de Início</p>
                <p className="text-lg font-semibold">{formatDate(data.startDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Data de Fim</p>
                <p className="text-lg font-semibold">{formatDate(data.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{data.totalDays} dias de aluguel</span>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Aluguel ({data.totalDays} dias)</span>
              <span>{formatCurrency(data.totalPrice)}</span>
            </div>
            {data.insurance && (
              <div className="flex justify-between">
                <span>Seguro ({data.insurance.name})</span>
                <span>{formatCurrency(data.insurance.price)}</span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(data.totalPrice + (data.insurance?.price || 0))}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
              <div>
                <p className="font-medium">Aguarde a confirmação</p>
                <p className="text-sm text-gray-600">
                  O proprietário será notificado e deve confirmar o empréstimo
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
              <div>
                <p className="font-medium">Comunicação</p>
                <p className="text-sm text-gray-600">
                  Você receberá uma notificação quando o empréstimo for confirmado
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
              <div>
                <p className="font-medium">Pagamento</p>
                <p className="text-sm text-gray-600">
                  O pagamento será processado após a confirmação do proprietário
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="mt-8 flex gap-4">
          <Button variant="outline" className="flex-1" onClick={() => navigate('/')}>
            Voltar ao Início
          </Button>
          <Button className="flex-1" onClick={() => navigate('/profile')}>
            Meus Empréstimos
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}
