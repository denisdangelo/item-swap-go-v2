import React from 'react';
import { PasswordChangeTest } from '@/components/PasswordChangeTest';

export function TestPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center">Página de Teste</h1>
        <PasswordChangeTest />
      </div>
    </div>
  );
}
