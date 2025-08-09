import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { typography } from '@/styles/design-system';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Tab = 'login' | 'register';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    try {
      if (activeTab === 'login') {
        console.debug('[AuthPage] Submitting login for', formData.email);
        const res = await login({ email: formData.email, password: formData.password });
        if (!res.success) throw new Error(res.error || 'Falha no login');
      } else {
        console.debug('[AuthPage] Submitting register for', formData.email);
        const res = await register({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        } as any);
        if (!res.success) throw new Error(res.error || 'Falha no registro');
      }

      setIsSuccess(true);
      toast({
        title: 'Sucesso!',
        description: activeTab === 'login' ? 'Login realizado.' : 'Conta criada.',
        variant: 'success',
      });
      await new Promise((r) => setTimeout(r, 400));
      navigate('/');
    } catch (error: any) {
      console.error('[AuthPage] submit error', error);
      toast({
        title: 'Erro',
        description: error?.message || 'Ocorreu um erro',
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

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div className="flex h-full max-h-screen flex-col justify-center py-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 flex-shrink-0 text-center">
          <h1 className={cn(typography.heading.h4, 'tracking-tight')}>
            <span className="text-white">Empresta</span>
            <span className="text-purple-300"> aê</span>
          </h1>
          <p className={cn(typography.body.xs, 'mt-1 text-white/80')}>
            {activeTab === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </motion.div>

        <div className="flex min-h-0 flex-1 items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-sm">
            <div className="mb-6 flex rounded-xl bg-white/10 p-1">
              <button onClick={() => setActiveTab('login')} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${activeTab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/80 hover:text-white'}`}>
                Entrar
              </button>
              <button onClick={() => setActiveTab('register')} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${activeTab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/80 hover:text-white'}`}>
                Registrar
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form key={activeTab} initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: activeTab === 'login' ? 20 : -20 }} transition={{ duration: 0.3 }} onSubmit={handleSubmit} className="space-y-4" noValidate>
                {activeTab === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-sm font-medium text-white">
                        Nome
                      </Label>
                      <Input id="first_name" name="first_name" type="text" placeholder="Seu nome" value={formData.first_name} onChange={handleInputChange} className="h-11 border-white/20 bg-white/10 text-sm text-white placeholder:text-white/80" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-sm font-medium text-white">
                        Sobrenome
                      </Label>
                      <Input id="last_name" name="last_name" type="text" placeholder="Seu sobrenome" value={formData.last_name} onChange={handleInputChange} className="h-11 border-white/20 bg-white/10 text-sm text-white placeholder:text-white/80" disabled={isLoading} />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-white">
                    Email
                  </Label>
                  <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} className="h-11 border-white/20 bg-white/10 text-sm text-white placeholder:text-white/80" disabled={isLoading} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleInputChange} className="h-11 border-white/20 bg-white/10 pr-12 text-sm text-white placeholder:text-white/80" disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/80 transition-colors hover:text-white" disabled={isLoading}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="mt-6 h-11 w-full bg-primary text-sm font-semibold shadow-sm hover:bg-primary/90" disabled={isLoading}>
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center">
                        <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                        {activeTab === 'login' ? 'Entrando...' : 'Registrando...'}
                      </motion.div>
                    ) : isSuccess ? (
                      <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center">
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-purple-800 px-4 font-medium text-white/80">ou</span>
              </div>
            </div>

            {/* Social auth: por ora desativado (sem mock) */}
            <div className="space-y-3 opacity-50">
              <Button type="button" variant="outline" className="h-11 w-full justify-start border-2 border-white/30 bg-white/10 pl-4 text-sm font-medium text-white" disabled>
                <div className="flex w-full items-center">
                  <span className="-ml-5 flex-1 text-center">Google (em breve)</span>
                </div>
              </Button>
              <Button type="button" variant="outline" className="h-11 w-full justify-start border-2 border-white/30 bg-white/10 pl-4 text-sm font-medium text-white" disabled>
                <div className="flex w-full items-center">
                  <span className="-ml-5 flex-1 text-center">Facebook (em breve)</span>
                </div>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex-shrink-0 text-center">
          <p className="px-6 text-xs leading-relaxed text-white/80">
            Ao continuar, você concorda com nossos{' '}
            <button onClick={() => navigate('/politica-privacidade')} className="font-medium text-purple-300 hover:text-white hover:underline">
              Termos de Uso
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
