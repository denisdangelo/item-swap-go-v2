import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Shield, PlusCircle, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  className?: string;
  onOpenMenu?: () => void;
}

export function BottomNav({ className, onOpenMenu }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white py-2 md:hidden',
        className
      )}
      aria-label="Navegação principal mobile"
    >
      <div className="container mx-auto flex items-center justify-around">
        <button
          onClick={() => navigate('/')}
          className={cn(
            'flex flex-col items-center justify-center px-3 py-1 transition-colors duration-200',
            isActive('/') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-500'
          )}
          aria-label="Página inicial"
          aria-current={isActive('/') ? 'page' : undefined}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-xs font-medium">Início</span>
        </button>

        <button
          onClick={() => navigate('/insurance')}
          className={cn(
            'flex flex-col items-center justify-center px-3 py-1 transition-colors duration-200',
            isActive('/insurance') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-500'
          )}
          aria-label="Seguros"
          aria-current={isActive('/insurance') ? 'page' : undefined}
        >
          <Shield className="h-5 w-5" />
          <span className="mt-1 text-xs font-medium">Seguros</span>
        </button>

        <button
          onClick={() => navigate('/add-item')}
          className="flex flex-col items-center justify-center px-3 py-1 transition-transform duration-200 hover:scale-105"
          aria-label="Adicionar novo item"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-purple-800">
            <PlusCircle className="h-6 w-6" />
          </div>
        </button>

        <button
          onClick={() => navigate('/profile')}
          className={cn(
            'flex flex-col items-center justify-center px-3 py-1 transition-colors duration-200',
            isActive('/profile') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-500'
          )}
          aria-label="Perfil do usuário"
          aria-current={isActive('/profile') ? 'page' : undefined}
        >
          <User className="h-5 w-5" />
          <span className="mt-1 text-xs font-medium">Perfil</span>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className={cn(
            'flex flex-col items-center justify-center px-3 py-1 transition-colors duration-200',
            isActive('/settings') ? 'text-purple-600' : 'text-gray-600 hover:text-purple-500'
          )}
          aria-label="Configurações"
          aria-current={isActive('/settings') ? 'page' : undefined}
        >
          <Settings className="h-5 w-5" />
          <span className="mt-1 text-xs font-medium">Ajustes</span>
        </button>
      </div>
    </nav>
  );
}
