import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function PasswordChangeTest() {
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    console.log('Teste: handleChangePassword chamado com:', passwordData);
    
    if (!passwordData.current.trim()) {
      console.log('Teste: Senha atual vazia');
      toast({
        title: 'Senha atual obrigatória',
        description: 'Digite sua senha atual.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.new.length < 6) {
      console.log('Teste: Nova senha muito curta:', passwordData.new.length);
      toast({
        title: 'Senha muito curta',
        description: 'A nova senha deve ter pelo menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      console.log('Teste: Senhas não coincidem:', { new: passwordData.new, confirm: passwordData.confirm });
      toast({
        title: 'Senhas não coincidem',
        description: 'Verifique se as senhas são iguais.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Teste: Tentando alterar senha...');
    setIsLoading(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      console.log('Teste: Senha alterada com sucesso!');
      toast({
        title: 'Senha alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
      });
      
      setPasswordData({ current: '', new: '', confirm: '' });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-purple-600" />
          Teste - Alterar Senha
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-current-password">Senha Atual</Label>
          <div className="relative">
            <Input
              id="test-current-password"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.current}
              onChange={(e) => {
                console.log('Teste: Senha atual alterada para:', e.target.value);
                setPasswordData((prev) => ({ ...prev, current: e.target.value }));
              }}
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
          <Label htmlFor="test-new-password">Nova Senha</Label>
          <Input
            id="test-new-password"
            type="password"
            value={passwordData.new}
            onChange={(e) => {
              console.log('Teste: Nova senha alterada para:', e.target.value);
              setPasswordData((prev) => ({ ...prev, new: e.target.value }));
            }}
            className="h-12"
            placeholder="Digite sua nova senha"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="test-confirm-password">Confirmar Senha</Label>
          <Input
            id="test-confirm-password"
            type="password"
            value={passwordData.confirm}
            onChange={(e) => {
              console.log('Teste: Confirmação de senha alterada para:', e.target.value);
              setPasswordData((prev) => ({ ...prev, confirm: e.target.value }));
            }}
            className="h-12"
            placeholder="Confirme sua nova senha"
          />
        </div>

        <Button
          onClick={() => {
            console.log('Teste: Botão clicado! Estado atual:', {
              isLoading,
              current: passwordData.current,
              new: passwordData.new,
              confirm: passwordData.confirm,
              disabled: isLoading || !passwordData.current || !passwordData.new || !passwordData.confirm
            });
            handleChangePassword();
          }}
          disabled={
            isLoading || !passwordData.current || !passwordData.new || !passwordData.confirm
          }
          className="w-full"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Testando...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Testar Alteração de Senha
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500">
          <p>Estado atual:</p>
          <pre>{JSON.stringify(passwordData, null, 2)}</pre>
          <p>Botão desabilitado: {isLoading || !passwordData.current || !passwordData.new || !passwordData.confirm ? 'Sim' : 'Não'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
