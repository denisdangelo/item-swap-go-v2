import {
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Globe,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Save,
  Settings,
  Shield,
  Smartphone,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@/components/ui/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store';

export function UserProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useStore();
  const { updateProfile, changePassword, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: isDarkMode,
  });

  // Atualizar profileData quando o usuário mudar
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Sync dark mode with store and load notification settings
  useEffect(() => {
    setSettings((prev) => ({ ...prev, darkMode: isDarkMode }));

    // Load notification settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, [isDarkMode]);

  const handleAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you would upload the file to a server
        // For now, we'll just show a toast
        toast({
          title: 'Upload de avatar',
          description: 'Funcionalidade em desenvolvimento. Em breve você poderá alterar sua foto.',
        });
      }
    };
    input.click();
  };

  const handleLanguageChange = () => {
    toast({
      title: 'Alterar idioma',
      description: 'Funcionalidade em desenvolvimento. Em breve você poderá alterar o idioma.',
    });
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Nome e e-mail são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Separar nome completo em first_name e last_name
      const nameParts = profileData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        email: profileData.email.trim(),
      });

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description:
          error instanceof Error ? error.message : 'Não foi possível atualizar seu perfil.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current.trim()) {
      toast({
        title: 'Senha atual obrigatória',
        description: 'Digite sua senha atual.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.new.length < 6) {
      toast({
        title: 'Senha muito curta',
        description: 'A nova senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: 'Senhas não coincidem',
        description: 'Verifique se as senhas são iguais.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        current_password: passwordData.current,
        new_password: passwordData.new,
      });

      toast({
        title: 'Senha alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
      });

      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast({
        title: 'Erro ao alterar senha',
        description: error instanceof Error ? error.message : 'Verifique sua senha atual.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    // Handle dark mode toggle
    if (key === 'darkMode') {
      toggleDarkMode();
    }

    // Save notification preferences to localStorage
    if (key === 'emailNotifications' || key === 'pushNotifications') {
      const notificationSettings = {
        ...settings,
        [key]: value,
      };
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    }

    toast({
      title: 'Configuração atualizada',
      description: `${key === 'emailNotifications' ? 'Notificações por e-mail' : key === 'pushNotifications' ? 'Notificações push' : 'Tema escuro'} ${value ? 'ativado' : 'desativado'}.`,
    });
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();

      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });

      navigate('/auth');
    } catch (error) {
      toast({
        title: 'Erro ao sair',
        description: error instanceof Error ? error.message : 'Não foi possível fazer logout.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">Usuário não encontrado</h2>
          <Button onClick={() => navigate('/auth')} className="mt-4">
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        showBackButton
        onBack={() => navigate(-1)}
        title="Meu Perfil"
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

      <div className="mx-auto max-w-2xl px-4 pb-24 pt-20">
        {/* Header do Perfil */}
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-4 h-24 w-24">
            <img
              src={user.avatar || '/avatar-placeholder.png'}
              alt={user.name}
              className="h-full w-full rounded-full border-4 border-purple-200 object-cover"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
              onClick={handleAvatarUpload}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Membro desde Jan 2024</span>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Verificado
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
          </TabsList>

          {/* Aba Perfil */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-purple-600" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="h-12"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleSaveProfile} disabled={isLoading} className="flex-1">
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">Nome</p>
                        <p className="text-sm text-muted-foreground">{user.name}</p>
                      </div>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">E-mail</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                      <div>
                        <p className="font-medium text-foreground">Localização</p>
                        <p className="text-sm text-muted-foreground">São Paulo, SP</p>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <Button onClick={() => setIsEditing(true)} className="w-full">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-600" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-foreground">E-mail</p>
                      <p className="text-sm text-muted-foreground">Receber por e-mail</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange('emailNotifications', checked)
                    }
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-foreground">Push</p>
                      <p className="text-sm text-muted-foreground">Notificações no app</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-foreground">Tema Escuro</p>
                      <p className="text-sm text-muted-foreground">Aparência do app</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-foreground">Idioma</p>
                      <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLanguageChange}>
                    Alterar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Segurança */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                  Alterar Senha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.current}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, current: e.target.value }))
                      }
                      className="h-12 pr-10"
                      placeholder="Digite sua senha atual"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, new: e.target.value }))}
                    className="h-12"
                    placeholder="Digite sua nova senha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, confirm: e.target.value }))
                    }
                    className="h-12"
                    placeholder="Confirme sua nova senha"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={
                    isLoading || !passwordData.current || !passwordData.new || !passwordData.confirm
                  }
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Alterando...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Alterar Senha
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-foreground">E-mail Verificado</p>
                      <p className="text-sm text-muted-foreground">Sua conta está verificada</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Ativo
                  </Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-foreground">Autenticação em Dois Fatores</p>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: 'Em desenvolvimento',
                        description: 'Funcionalidade de 2FA será implementada em breve.',
                      })
                    }
                  >
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-5 w-5" />
                  Sair da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Ao sair, você será redirecionado para a tela de login e precisará fazer login
                  novamente.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saindo...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair da Conta
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
