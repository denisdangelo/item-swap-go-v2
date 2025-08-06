import {
  AlertCircle,
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Save,
  Settings,
  Shield,
  Smartphone,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AppHeader } from '@/components/ui/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageContainer from '@/components/ui/page-container';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

import type { User as UserType } from '@/types';

interface UserProfileProps {
  user: UserType;
  onBack: () => void;
}

interface ProfileFormData {
  name: string;
  email: string;
  avatar?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface AppPreferences {
  darkMode: boolean;
  language: string;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastAccess: string;
  isActive: boolean;
}

export default function UserProfile({ user, onBack }: UserProfileProps) {
  const { toast } = useToast();
  const { updateProfile, changePassword } = useAuth();

  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Settings states
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
  });

  const [appPreferences, setAppPreferences] = useState<AppPreferences>({
    darkMode: true,
    language: 'pt-BR',
  });

  // Active sessions state
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'Windows',
      browser: 'Chrome',
      location: 'São Paulo, SP',
      lastAccess: 'há 5 minutos',
      isActive: true,
    },
    {
      id: '2',
      device: 'iPhone',
      browser: 'Safari',
      location: 'São Paulo, SP',
      lastAccess: 'há 2 dias',
      isActive: true,
    },
  ]);

  // Form validation states
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Profile form
  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
    watch: watchProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });

  // Password form
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordFormErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<PasswordFormData>();

  const watchedPassword = watchPassword('newPassword');
  const watchedConfirmPassword = watchPassword('confirmPassword');

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
    const colors = [
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-blue-900',
      'text-green-500',
    ];

    return {
      score: Math.min(score, 4),
      label: labels[score],
      color: colors[score],
    };
  };

  const passwordStrength = getPasswordStrength(watchedPassword || '');

  // Handle profile update
  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsUpdatingProfile(true);
    try {
      await updateProfile(data);
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
        variant: 'default',
      });
      setIsEditing(false);
      resetProfile(data);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar suas informações. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle password update
  const onSubmitPassword = async (data: PasswordFormData) => {
    // Validate passwords
    const errors: typeof passwordErrors = {};

    if (!data.currentPassword) {
      errors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!data.newPassword) {
      errors.newPassword = 'Nova senha é obrigatória';
    } else if (data.newPassword.length < 8) {
      errors.newPassword = 'A senha deve ter pelo menos 8 caracteres';
    }

    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast({
        title: 'Senha alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
        variant: 'default',
      });
      resetPassword();
      setPasswordErrors({});
    } catch (error) {
      toast({
        title: 'Erro ao alterar senha',
        description: 'Verifique sua senha atual e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle notification settings update
  const handleNotificationChange = async (type: keyof NotificationSettings, value: boolean) => {
    setIsUpdatingSettings(true);
    try {
      const newSettings = { ...notificationSettings, [type]: value };
      setNotificationSettings(newSettings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: 'Configuração atualizada!',
        description: `Notificações por ${type === 'emailNotifications' ? 'e-mail' : 'push'} ${value ? 'ativadas' : 'desativadas'}.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar a configuração.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Handle app preferences update
  const handlePreferenceChange = async (type: keyof AppPreferences, value: boolean | string) => {
    setIsUpdatingSettings(true);
    try {
      const newPreferences = { ...appPreferences, [type]: value };
      setAppPreferences(newPreferences);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: 'Preferência atualizada!',
        description: `${type === 'darkMode' ? 'Tema' : 'Idioma'} atualizado com sucesso.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar a preferência.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Handle session termination
  const handleTerminateSession = async (sessionId: string) => {
    try {
      setActiveSessions((prev) => prev.filter((session) => session.id !== sessionId));
      toast({
        title: 'Sessão encerrada!',
        description: 'A sessão foi encerrada com sucesso.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Erro ao encerrar sessão',
        description: 'Não foi possível encerrar a sessão.',
        variant: 'destructive',
      });
    }
  };

  // Handle terminate all other sessions
  const handleTerminateAllSessions = async () => {
    try {
      setActiveSessions((prev) => prev.filter((session) => session.id === '1')); // Keep current session
      toast({
        title: 'Sessões encerradas!',
        description: 'Todas as outras sessões foram encerradas.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Erro ao encerrar sessões',
        description: 'Não foi possível encerrar as sessões.',
        variant: 'destructive',
      });
    }
  };

  // Reset forms when editing is cancelled
  const handleCancelEdit = () => {
    setIsEditing(false);
    resetProfile();
    setPasswordErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <AppHeader
        showBackButton
        onBack={onBack}
        title="Meu Perfil"
        user={
          user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              }
            : undefined
        }
      />

      <PageContainer className="space-y-6">
        {/* Tabs Navigation - Mobile Optimized */}
        <Tabs className="space-y-6" defaultValue="profile">
          <TabsList className="grid h-12 w-full grid-cols-3 border border-border/50 bg-card/60 shadow-sm backdrop-blur-sm">
            <TabsTrigger
              className="flex items-center gap-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="profile"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger
              className="flex items-center gap-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger
              className="flex items-center gap-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              value="security"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header Card */}
            <Card className="border-0 bg-card/80 shadow-lg backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  {/* Avatar Section */}
                  <div className="group relative">
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32">
                      <img
                        alt={`Foto de perfil de ${user.name}`}
                        className="h-full w-full rounded-full border-4 border-primary/20 object-cover shadow-lg transition-all duration-300 group-hover:border-primary/40"
                        src={user.avatar || '/placeholder.svg'}
                      />
                      <div className="absolute inset-0 rounded-full bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        title="Alterar foto de perfil"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          // Simulação de upload: use um serviço real no backend
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const base64 = reader.result as string;
                            // Aqui você pode fazer upload para um serviço real e obter a URL
                            // Exemplo: const url = await uploadProfileImage(file);
                            // Para demo, vamos usar o base64 diretamente
                            await onSubmitProfile({ ...user, avatar: base64 });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
                      aria-label="Alterar foto de perfil"
                      type="button"
                      onClick={() => {
                        // Foca no input de arquivo
                        const input = document.querySelector<HTMLInputElement>(
                          '.group input[type="file"]'
                        );
                        input?.click();
                      }}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* User Info */}
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      {user.name}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Membro desde Janeiro 2024</span>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {user.location
                        ? `${user.location.latitude}, ${user.location.longitude}`
                        : 'São Paulo, SP'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form Card */}
            <Card className="border-0 bg-card/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Edit3 className="h-5 w-5 text-primary" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Mantenha suas informações atualizadas para uma melhor experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <form className="space-y-6" onSubmit={handleProfileSubmit(onSubmitProfile)}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nome Completo
                        </Label>
                        <Input
                          id="name"
                          className="h-12 text-base"
                          placeholder="Digite seu nome completo"
                          {...profileRegister('name', {
                            required: 'Nome é obrigatório',
                            minLength: {
                              value: 2,
                              message: 'Nome deve ter pelo menos 2 caracteres',
                            },
                          })}
                          disabled={isUpdatingProfile}
                          autoComplete="name"
                        />
                        {profileErrors.name && (
                          <p className="flex items-center gap-1 text-sm text-destructive">
                            <X className="h-3 w-3" />
                            {profileErrors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          E-mail
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="h-12 text-base"
                          placeholder="seu@email.com"
                          {...profileRegister('email', {
                            required: 'E-mail é obrigatório',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'E-mail inválido',
                            },
                          })}
                          disabled={isUpdatingProfile}
                          autoComplete="email"
                        />
                        {profileErrors.email && (
                          <p className="flex items-center gap-1 text-sm text-destructive">
                            <X className="h-3 w-3" />
                            {profileErrors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button
                        type="submit"
                        className="h-12 w-full bg-primary text-base font-medium shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg"
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 w-full text-base font-medium"
                        onClick={handleCancelEdit}
                        disabled={isUpdatingProfile}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">Nome</p>
                          <p className="text-sm text-muted-foreground">{user.name}</p>
                        </div>
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">E-mail</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsEditing(true)}
                      className="h-12 w-full bg-primary text-base font-medium shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Notifications Card */}
            <Card className="border-0 bg-card/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Bell className="h-5 w-5 text-primary" />
                  Notificações
                </CardTitle>
                <CardDescription>Configure como você deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Notificações por E-mail
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Receba atualizações sobre seus itens e mensagens
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationChange('emailNotifications', checked)
                      }
                      disabled={isUpdatingSettings}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Notificações Push</p>
                        <p className="text-xs text-muted-foreground">
                          Receba alertas em tempo real no seu dispositivo
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        handleNotificationChange('pushNotifications', checked)
                      }
                      disabled={isUpdatingSettings}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card className="border-0 bg-card/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Settings className="h-5 w-5 text-primary" />
                  Preferências
                </CardTitle>
                <CardDescription>Personalize sua experiência no aplicativo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Moon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Tema Escuro</p>
                        <p className="text-xs text-muted-foreground">
                          Alterar aparência do aplicativo
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={appPreferences.darkMode}
                      onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                      disabled={isUpdatingSettings}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Idioma</p>
                        <p className="text-xs text-muted-foreground">Português (Brasil)</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      Alterar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Password Change Card */}
            <Card className="border-0 bg-card/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Lock className="h-5 w-5 text-primary" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-sm font-medium">
                      Senha Atual
                    </Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="h-12 pr-10 text-base"
                        placeholder="Digite sua senha atual"
                        {...passwordRegister('currentPassword')}
                        disabled={isUpdatingPassword}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <X className="h-3 w-3" />
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium">
                      Nova Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        className="h-12 pr-10 text-base"
                        placeholder="Digite sua nova senha"
                        {...passwordRegister('newPassword')}
                        disabled={isUpdatingPassword}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {watchedPassword && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={cn(
                                  'h-1 w-8 rounded-full transition-all duration-200',
                                  level <= passwordStrength.score
                                    ? passwordStrength.color.replace('text-', 'bg-')
                                    : 'bg-muted'
                                )}
                              />
                            ))}
                          </div>
                          <span className={cn('text-xs font-medium', passwordStrength.color)}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                    {passwordErrors.newPassword && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <X className="h-3 w-3" />
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirmar Nova Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="h-12 pr-10 text-base"
                        placeholder="Confirme sua nova senha"
                        {...passwordRegister('confirmPassword')}
                        disabled={isUpdatingPassword}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {watchedConfirmPassword && watchedPassword && (
                      <div className="flex items-center gap-2">
                        {watchedPassword === watchedConfirmPassword ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={cn(
                            'text-xs font-medium',
                            watchedPassword === watchedConfirmPassword
                              ? 'text-green-600'
                              : 'text-red-600'
                          )}
                        >
                          {watchedPassword === watchedConfirmPassword
                            ? 'Senhas coincidem'
                            : 'Senhas não coincidem'}
                        </span>
                      </div>
                    )}
                    {passwordErrors.confirmPassword && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <X className="h-3 w-3" />
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full bg-primary text-base font-medium shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg"
                    disabled={isUpdatingPassword}
                  >
                    {isUpdatingPassword ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Alterando...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Alterar Senha
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Active Sessions Card */}
            <Card className="border-0 bg-card/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Monitor className="h-5 w-5 text-primary" />
                  Sessões Ativas
                </CardTitle>
                <CardDescription>Gerencie os dispositivos conectados à sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full',
                            session.device === 'Windows' ? 'bg-emerald-100' : 'bg-blue-100'
                          )}
                        >
                          {session.device === 'Windows' ? (
                            <Monitor className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Smartphone className="h-5 w-5 text-blue-900" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {session.browser} - {session.device}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {session.location} • {session.lastAccess}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.isActive && (
                          <>
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-medium text-emerald-600">Ativa</span>
                          </>
                        )}
                        {session.id !== '1' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleTerminateSession(session.id)}
                            aria-label="Encerrar sessão"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {activeSessions.length > 1 && (
                  <Button
                    variant="outline"
                    className="h-12 w-full text-base font-medium"
                    onClick={handleTerminateAllSessions}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Encerrar Outras Sessões
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
}
