import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ValidationErrors {
  email?: string;
  password?: string;
  name?: string;
}

interface LoginFormProps {
  isSignUp: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  errors: ValidationErrors;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isSignUp,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  showPassword,
  setShowPassword,
  isLoading,
  errors,
  onSubmit,
}) => {
  return (
    <form noValidate className="mb-6 space-y-4" onSubmit={onSubmit}>
      {isSignUp && (
        <div className="space-y-2">
          <Label className="text-body-sm font-mobile-medium" htmlFor="name">
            Nome completo
          </Label>
          <Input
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`text-body transition-colors ${errors.name ? 'border-destructive focus:ring-destructive' : ''}`}
            disabled={isLoading}
            id="name"
            placeholder="Digite seu nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-caption text-destructive" id="name-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-body-sm font-mobile-medium" htmlFor="email">
          E-mail
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`text-body pl-10 transition-colors ${errors.email ? 'border-destructive focus:ring-destructive' : ''}`}
            disabled={isLoading}
            id="email"
            placeholder="seu@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {errors.email && (
          <p className="text-caption text-destructive" id="email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-body-sm font-mobile-medium" htmlFor="password">
          Senha
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={`text-body pl-10 pr-10 transition-colors ${errors.password ? 'border-destructive focus:ring-destructive' : ''}`}
            disabled={isLoading}
            id="password"
            placeholder="Digite sua senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="absolute right-3 top-3 rounded text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={isLoading}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-caption text-destructive" id="password-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <Button
        className="text-button font-mobile-medium shadow-medium hover-lift w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        disabled={isLoading}
        type="submit"
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
  );
};

export default LoginForm;
