import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { typography } from '@/styles/design-system';
import type { User } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
  });

  const DEMO_USER: User = {
    id: 'demo-user-123',
    name: 'Usuário Demo',
    email: 'demo@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.5,
    location: {
      latitude: -23.55052,
      longitude: -46.633308,
      address: 'São Paulo, SP',
      city: 'São Paulo',
      state: 'SP',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      onLogin(DEMO_USER);
      setIsSuccess(true);

      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao Empresta aê!',
        variant: 'success',
      });

      await new Promise((resolve) => setTimeout(resolve, 600));
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSocialLogin = async (provider: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let userData: User;

      switch (provider.toLowerCase()) {
        case 'google':
          const googleToken = 'mock_google_token_' + Date.now();
          userData = await loginWithGoogle(googleToken);
          break;
        case 'facebook':
          const facebookToken = 'mock_facebook_token_' + Date.now();
          userData = await loginWithFacebook(facebookToken);
          break;
        case 'apple':
          const appleToken = 'mock_apple_token_' + Date.now();
          userData = await loginWithApple(appleToken);
          break;
        default:
          userData = DEMO_USER;
      }

      onLogin(userData);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao Empresta aê!',
        variant: 'success',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: `Erro ao fazer login com ${provider}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900"
      style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
    >
      {/* Layout otimizado com melhor espaçamento */}
      <div className="flex h-full max-h-screen flex-col justify-center py-4">
        {/* Header elegante */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex-shrink-0 text-center"
        >
          <h1 className={cn(typography.heading.h4, 'tracking-tight')}>
            <span className="text-white">Empresta</span>
            <span className="text-purple-300"> aê</span>
          </h1>
          <p className={cn(typography.body.xs, 'mt-1 text-white/80')}>
            {activeTab === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </motion.div>

        {/* Conteúdo principal com espaçamento adequado */}
        <div className="flex min-h-0 flex-1 items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-sm"
          >
            {/* Tabs com melhor espaçamento */}
            <div className="mb-6 flex rounded-xl bg-white/10 p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Registrar
              </button>
            </div>

            {/* Formulário com espaçamento respirável */}
            <AnimatePresence mode="wait">
              <motion.form
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'login' ? 20 : -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                {/* Nome (só no registro) */}
                {activeTab === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-white">
                      Nome completo
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-11 border-white/20 bg-white/10 text-sm text-white placeholder:text-white/80"
                      disabled={isLoading}
                    />
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-11 border-white/20 bg-white/10 text-sm text-white placeholder:text-white/80"
                    disabled={isLoading}
                  />
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-11 border-white/20 bg-white/10 pr-12 text-sm text-white placeholder:text-white/80"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 transition-colors hover:text-white"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Botão principal com destaque */}
                <Button
                  type="submit"
                  className="mt-6 h-11 w-full bg-primary text-sm font-semibold shadow-sm hover:bg-primary/90"
                  disabled={isLoading}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                        {activeTab === 'login' ? 'Entrando...' : 'Registrando...'}
                      </motion.div>
                    ) : isSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Sucesso!
                      </motion.div>
                    ) : (
                      <span>{activeTab === 'login' ? 'Entrar' : 'Registrar'}</span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.form>
            </AnimatePresence>

            {/* Divisor simplificado */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-purple-800 px-4 font-medium text-white/80">ou</span>
              </div>
            </div>

            {/* Botões sociais com ícones alinhados */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-start border-2 border-white/30 bg-white/10 pl-4 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20"
                disabled={isLoading}
                onClick={() => onSocialLogin('google')}
              >
                <div className="flex w-full items-center">
                  <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="-ml-5 flex-1 text-center">Continuar com Google</span>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-start border-2 border-white/30 bg-white/10 pl-4 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20"
                disabled={isLoading}
                onClick={() => onSocialLogin('facebook')}
              >
                <div className="flex w-full items-center">
                  <svg className="h-5 w-5 flex-shrink-0" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="-ml-5 flex-1 text-center">Continuar com Facebook</span>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-start border-2 border-white/30 bg-white/10 pl-4 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20"
                disabled={isLoading}
                onClick={() => onSocialLogin('apple')}
              >
                <div className="flex w-full items-center">
                  <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="-ml-5 flex-1 text-center">Continuar com Apple</span>
                </div>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Footer discreto */}
        <div className="mt-6 flex-shrink-0 text-center">
          <p className="px-6 text-xs leading-relaxed text-white/80">
            Ao continuar, você concorda com nossos{' '}
            <button
              onClick={() => navigate('/politica-privacidade')}
              className="font-medium text-purple-300 hover:text-white hover:underline"
            >
              Termos de Uso
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
