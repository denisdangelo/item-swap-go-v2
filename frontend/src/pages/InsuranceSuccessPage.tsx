import { CheckCircle2, Shield } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/ui/page-container';
import { useAuth } from '@/hooks/useAuth';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export function InsuranceSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollToTop } = useScrollToTop();
  const { user } = useAuth();

  const insurance = location.state?.insurance;
  const fromHome = location.state?.fromHome;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (!insurance) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      <AppHeader
        showBackButton
        onBack={() => navigate('/')}
        title="Seguro"
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
            : undefined
        }
      />
      <PageContainer className="flex flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header de Sucesso */}
          <div className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-800">Pronto! Seguro ativo.</h1>
            <p className="text-base text-muted-foreground">
              Você está protegido durante o aluguel.
            </p>
          </div>

          {/* Card do Seguro */}
          <Card className="border-green-200 bg-white shadow-md">
            <CardHeader className="pb-2 text-center">
              <div className="mb-2 flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Shield className="h-5 w-5 text-purple-700" />
                </div>
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">{insurance.name}</CardTitle>
              <p className="text-sm text-gray-600">{insurance.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(insurance.price)}
                </div>
                <div className="text-xs text-gray-500">por dia</div>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">Coberturas:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  {insurance.coverage.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-purple-50 p-2 text-center text-xs text-purple-700">
                Franquia:{' '}
                <span className="font-semibold">{formatCurrency(insurance.deductible)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Próximos passos */}
          <div className="space-y-2 rounded-xl bg-white p-4 shadow">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Próximos passos</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700">1</Badge>
              <span className="text-sm text-gray-700">Escolha um item para alugar</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700">2</Badge>
              <span className="text-sm text-gray-700">Solicite o empréstimo</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700">3</Badge>
              <span className="text-sm text-gray-700">Aguarde aprovação</span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-2 flex flex-col gap-2">
            <Button size="lg" className="w-full" onClick={() => navigate('/')}>
              Voltar para Home
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/profile')}
            >
              Meu Perfil
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
