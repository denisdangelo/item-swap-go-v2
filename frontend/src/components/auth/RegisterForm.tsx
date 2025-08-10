import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Check, Eye, EyeOff, Loader2, X } from 'lucide-react';
import React, { useState } from 'react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const { register, checkEmailAvailability, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [emailAvailability, setEmailAvailability] = useState<{
    checking: boolean;
    available: boolean | null;
  }>({ checking: false, available: null });

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push('Mínimo 8 caracteres');
    if (!/(?=.*[a-z])/.test(password)) errors.push('Uma letra minúscula');
    if (!/(?=.*[A-Z])/.test(password)) errors.push('Uma letra maiúscula');
    if (!/(?=.*\d)/.test(password)) errors.push('Um número');
    if (!/(?=.*[@$!%*?&])/.test(password)) errors.push('Um caractere especial');
    return errors;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.first_name) {
      errors.first_name = 'Nome é obrigatório';
    }

    if (!formData.last_name) {
      errors.last_name = 'Sobrenome é obrigatório';
    }

    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    } else if (emailAvailability.available === false) {
      errors.email = 'Este email já está em uso';
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors.join(', ');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem';
    }

    if (formData.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      errors.phone = 'Formato: (11) 99999-9999';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      onSuccess?.();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleEmailChange = async (email: string) => {
    handleInputChange('email', email);

    if (email && /\S+@\S+\.\S+/.test(email)) {
      setEmailAvailability({ checking: true, available: null });

      const result = await checkEmailAvailability(email);
      setEmailAvailability({
        checking: false,
        available: result.success ? result.available : null,
      });
    } else {
      setEmailAvailability({ checking: false, available: null });
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const passwordStrength = validatePassword(formData.password);
  const isPasswordStrong = passwordStrength.length === 0 && formData.password.length > 0;

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Criar conta</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Cadastre-se para começar a usar
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">Nome</Label>
            <Input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder="João"
              disabled={isLoading}
              className={validationErrors.first_name ? 'border-red-500' : ''}
            />
            {validationErrors.first_name && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.first_name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="last_name">Sobrenome</Label>
            <Input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              placeholder="Silva"
              disabled={isLoading}
              className={validationErrors.last_name ? 'border-red-500' : ''}
            />
            {validationErrors.last_name && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.last_name}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
              className={validationErrors.email ? 'border-red-500' : ''}
            />
            {emailAvailability.checking && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
            {!emailAvailability.checking && emailAvailability.available === true && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                <Check className="h-4 w-4 text-green-500" />
              </div>
            )}
            {!emailAvailability.checking && emailAvailability.available === false && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                <X className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
            placeholder="(11) 99999-9999"
            disabled={isLoading}
            className={validationErrors.phone ? 'border-red-500' : ''}
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Sua senha"
              disabled={isLoading}
              className={validationErrors.password ? 'border-red-500' : ''}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2 text-xs">
                <div
                  className={`h-2 w-2 rounded-full ${isPasswordStrong ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span className={isPasswordStrong ? 'text-green-600' : 'text-red-600'}>
                  {isPasswordStrong ? 'Senha forte' : 'Senha fraca'}
                </span>
              </div>
              {passwordStrength.length > 0 && (
                <p className="text-xs text-gray-500">Necessário: {passwordStrength.join(', ')}</p>
              )}
            </div>
          )}

          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirme sua senha"
              disabled={isLoading}
              className={validationErrors.confirmPassword ? 'border-red-500' : ''}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || emailAvailability.checking}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            disabled={isLoading}
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};
