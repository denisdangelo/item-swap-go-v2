import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-md px-4 text-center">
        <h1 className="fluid-hero mb-4 text-gray-900">404</h1>
        <h2 className="fluid-title mb-2 text-gray-800">Página não encontrada</h2>
        <p className="fluid-body mb-8 text-gray-600">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>
        <Button className="fluid-body px-8 py-3" onClick={() => navigate('/')}>
          Voltar para Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
