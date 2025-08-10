import { AppHeader } from '@/components/ui/app-header';
import { BottomNav } from '@/components/ui/bottom-nav';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PageContainer from '@/components/ui/page-container';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ChevronRight, Globe, HelpCircle, LogOut, Shield } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Exemplo de estado para as configurações
  const [notifications, setNotifications] = React.useState(true);
  const [locationServices, setLocationServices] = React.useState(true);

  return (
    <>
      <AppHeader
        showBackButton
        onBack={() => navigate(-1)}
        title="Configurações"
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

      <PageContainer>
        <div>
          <h1 className="mb-6 text-2xl font-bold text-foreground">Configurações</h1>

          <div className="space-y-6">
            {/* Seção de Preferências */}
            <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Preferências</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                    <Label htmlFor="notifications" className="text-sm font-medium text-foreground">
                      Notificações
                    </Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <Label htmlFor="location" className="text-sm font-medium text-foreground">
                      Serviços de localização
                    </Label>
                  </div>
                  <Switch
                    id="location"
                    checked={locationServices}
                    onCheckedChange={setLocationServices}
                  />
                </div>
              </div>
            </section>

            {/* Seção de Conta e Segurança */}
            <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Conta e Segurança</h2>

              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between py-3 text-left font-normal hover:bg-muted"
                  onClick={() => {
                    /* Navegar para alterar senha */
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span className="text-foreground">Alterar senha</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>

                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between py-3 text-left font-normal hover:bg-muted"
                  onClick={() => {
                    /* Navegar para privacidade */
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span className="text-foreground">Privacidade</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </section>

            {/* Seção de Suporte */}
            <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Suporte</h2>

              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between py-3 text-left font-normal hover:bg-muted"
                  onClick={() => navigate('/faq')}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-foreground">Perguntas frequentes</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>

                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between py-3 text-left font-normal hover:bg-muted"
                  onClick={() => {
                    /* Navegar para contato */
                  }}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                    <span className="text-foreground">Contato</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </section>

            {/* Botão de Logout */}
            <Button
              variant="destructive"
              className="flex h-12 w-full items-center justify-center gap-2"
              onClick={() => {
                /* Implementar logout */
              }}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair da conta</span>
            </Button>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>Versão 1.0.0</p>
              <p className="mt-1">© 2025 Empresta aê. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </PageContainer>

      <BottomNav />
    </>
  );
};

export default SettingsPage;
