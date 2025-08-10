import { Eye, EyeOff, Loader2, Lock, Mail, User as UserIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { LoginCredentials, RegisterData, User } from '@/types';

// Usuário de demonstração
const DEMO_USER: User = {
  id: '1',
  name: 'Usuário Demo',
  email: 'demo@example.com',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  rating: 4.8,
  location: {
    latitude: -23.55052,
    longitude: -46.633308,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register, user } = useAuth();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Adiciona classe ao body para forçar background branco
  React.useEffect(() => {
    document.body.classList.add('login-active');
    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.backgroundColor = '#ffffff';

    return () => {
      document.body.classList.remove('login-active');
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<LoginCredentials & RegisterData>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: LoginCredentials & RegisterData) => {
    setIsLoading(true);
    clearErrors();
    try {
      if (isSignUp) {
        if (data.password !== data.confirmPassword) {
          setError('confirmPassword', { message: 'As senhas não coincidem' });
          setIsLoading(false);
          return;
        }
        await register({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        });
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Você já pode fazer login.',
          variant: 'success',
        });
        setIsSignUp(false);
      } else {
        // Usar o usuário de demonstração ao invés de fazer login real
        onLogin(DEMO_USER);
        toast({
          title: 'Login realizado com sucesso!',
          variant: 'success',
        });
        navigate('/');
      }
    } catch (error: any) {
      setError('email', { message: error.message || 'Erro ao autenticar' });
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao autenticar',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Simular um pequeno delay para feedback visual
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Usar o usuário de demonstração
      onLogin(DEMO_USER);

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao Item Swap!',
        variant: 'success',
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao fazer login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-screen-container flex min-h-screen items-center justify-center p-4"
      style={{
        backgroundColor: '#ffffff !important',
        background: '#ffffff !important',
        backgroundImage: 'none !important',
        colorScheme: 'light',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
      data-theme="light"
    >
      <Card className="w-full max-w-md space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-spacing-tight text-base font-bold sm:text-lg lg:text-xl">
            Bem-vindo ao Item Swap
          </h1>
          <p className="text-subtitle text-mobile-optimized mt-2 text-muted-foreground">
            {isSignUp ? 'Crie sua conta' : 'Faça login para continuar'}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-body-sm font-mobile-medium">
                Nome completo
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  className="text-body pl-9"
                  placeholder="Digite seu nome"
                  {...formRegister('name')}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-body-sm font-mobile-medium">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="text-body pl-9"
                placeholder="seu@email.com"
                {...formRegister('email')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-body-sm font-mobile-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="text-body pl-9 pr-9"
                placeholder="Digite sua senha"
                {...formRegister('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-body-sm font-mobile-medium">
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="text-body pl-9"
                  placeholder="Confirme sua senha"
                  {...formRegister('confirmPassword')}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="text-button w-full font-mobile-medium"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? 'Criando conta...' : 'Entrando...'}
              </>
            ) : isSignUp ? (
              'Criar conta'
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            className="text-body-sm text-muted-foreground hover:text-foreground"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginScreen;
