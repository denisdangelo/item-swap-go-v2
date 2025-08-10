import {
  ArrowLeft,
  ChevronLeft,
  File,
  HelpCircle,
  Home,
  Menu,
  Search,
  Shield,
  SlidersHorizontal,
  User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import FilterSheet from '@/components/filters/FilterSheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useSearchFilters } from '@/contexts/SearchFiltersContext';
import { cn } from '@/lib/utils';
import { classes } from '@/styles/design-system';

import type { User } from '@/types';

interface AppHeaderProps {
  user?: User | null;
  onProfileClick?: () => void;
  showHelpButton?: boolean;
  showSearchIcon?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
  showSearchField?: boolean; // Nova prop para controlar se mostra o campo de busca
}

// Componente que representa o cabeçalho do aplicativo
export function AppHeader({
  user,
  onProfileClick,
  showHelpButton = true,
  showSearchIcon = false,
  showBackButton = false,
  onBack,
  title,
  showSearchField = false,
}: AppHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();



  // Usar estado centralizado de busca e filtros
  const {
    filters,
    activeFilterCount,
    setSearchQuery,
    setMaxDistance,
    setPriceRange,
    setPeriod,
    setOnlyAvailable,
    setOnlyVerified,
    setMinRating,
  } = useSearchFilters();

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full bg-gradient-to-r from-purple-700 to-purple-900 shadow-lg backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-4 py-2">
          {/* Linha superior: menu, logo/busca, avatar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton ? (
                <Button
                  aria-label="Voltar"
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-purple-600"
                  onClick={onBack || (() => navigate(-1))}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              ) : (
                <Button
                  aria-label="Menu"
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-purple-600"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              )}

              {/* Logo/título sempre visível */}
              {title ? (
                <div className="flex items-center">
                  <span className="text-xl font-bold tracking-tight text-white">{title}</span>
                </div>
              ) : (
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-bold tracking-tight text-white">
                    Empresta <span className="text-purple-300">aê</span>
                  </span>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <Button
                  aria-label="Perfil"
                  className="rounded-full bg-purple-600 hover:bg-purple-700"
                  size="icon"
                  variant="ghost"
                  onClick={onProfileClick ? onProfileClick : () => navigate('/profile')}
                >
                  <Avatar>
                    <AvatarImage alt={user.name || 'Avatar'} src={user.avatar} />
                    <AvatarFallback>{user.name?.[0] || <UserIcon />}</AvatarFallback>
                  </Avatar>
                </Button>
              )}
            </div>
          </div>

          {/* Campo de busca abaixo do header - sempre visível quando showSearchField for true */}
          {showSearchField && (
            <div className="mx-auto mt-3 w-full max-w-2xl">
              <div className="relative flex items-center rounded-full bg-white/90 px-3 py-2 shadow-md">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-purple-900 opacity-70">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="min-w-0 flex-grow rounded-full border-0 bg-transparent py-1 pl-9 pr-3 text-base text-purple-900 placeholder-purple-900/70 focus:bg-white focus:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="Buscar itens..."
                  value={filters.searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Buscar itens"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchQuery(filters.searchQuery);
                      navigate('/search');
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-purple-600 px-1.5 text-xs font-medium text-white">
                      {activeFilterCount}
                    </div>
                  )}
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button
                        aria-label="Filtros"
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-purple-900 hover:bg-purple-100"
                        onClick={() => setIsFilterOpen(true)}
                      >
                        <SlidersHorizontal size={16} className="mr-1" />
                        Filtros
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full max-w-md p-0" side="right">
                      <SheetHeader className="bg-purple-700 p-4 text-white">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-purple-600"
                            onClick={() => setIsFilterOpen(false)}
                            aria-label="Voltar"
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                          <SheetTitle className="text-white">Filtros</SheetTitle>
                        </div>
                        <SheetDescription className="text-purple-100">
                          Escolha os filtros para refinar sua busca.
                        </SheetDescription>
                      </SheetHeader>
                      <FilterSheet
                        maxDistance={filters.maxDistance}
                        priceRange={filters.priceRange}
                        period={filters.period}
                        onlyAvailable={filters.onlyAvailable}
                        onlyVerified={filters.onlyVerified}
                        minRating={filters.minRating}
                        activeFilterCount={activeFilterCount}
                        onMaxDistanceChange={setMaxDistance}
                        onPriceRangeChange={setPriceRange}
                        onPeriodChange={setPeriod}
                        onOnlyAvailableChange={setOnlyAvailable}
                        onOnlyVerifiedChange={setOnlyVerified}
                        onMinRatingChange={setMinRating}
                        onClose={() => setIsFilterOpen(false)}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar usando Sheet para mobile */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="w-80 bg-white p-0 [&>button>svg]:h-6 [&>button>svg]:w-6 [&>button]:text-white [&>button]:hover:text-white"
        >
          <SheetHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-700 to-purple-800 p-6">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <div className="mb-2 flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-purple-600"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex flex-1 items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  Empresta <span className="text-purple-300">aê</span>
                </span>
              </div>
            </div>
            <SheetDescription className="text-center text-purple-100">
              Navegue pelo aplicativo
            </SheetDescription>
          </SheetHeader>

          <div className="p-4">
            {user && (
              <div className="mb-6 flex flex-col items-center border-b border-gray-200 pb-4">
                <Avatar className="mb-2 h-16 w-16">
                  {user.avatar ? (
                    <AvatarImage alt={user.name || 'Avatar'} src={user.avatar} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {user.name?.[0] || <UserIcon />}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center">
                  <h3 className={cn(classes.text.primary, 'font-medium')}>
                    {user.name || 'Usuário'}
                  </h3>
                  <p className={classes.text.muted}>{user.email}</p>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground hover:bg-gray-50 hover:text-primary"
                onClick={() => {
                  navigate('/');
                  setIsSidebarOpen(false);
                }}
              >
                <Home className="h-5 w-5 text-primary" />
                <span>Início</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground hover:bg-gray-50 hover:text-primary"
                onClick={() => {
                  navigate('/profile');
                  setIsSidebarOpen(false);
                }}
              >
                <UserIcon className="h-5 w-5 text-primary" />
                <span>Meu Perfil</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground hover:bg-gray-50 hover:text-primary"
                onClick={() => {
                  navigate('/add-item');
                  setIsSidebarOpen(false);
                }}
              >
                <File className="h-5 w-5 text-primary" />
                <span>Adicionar Item</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground hover:bg-gray-50 hover:text-primary"
                onClick={() => {
                  navigate('/insurance');
                  setIsSidebarOpen(false);
                }}
              >
                <Shield className="h-5 w-5 text-primary" />
                <span>Seguros</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground hover:bg-gray-50 hover:text-primary"
                onClick={() => {
                  navigate('/faq');
                  setIsSidebarOpen(false);
                }}
              >
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>FAQ</span>
              </Button>
            </nav>

            <div className="mt-8 border-t border-gray-200 pt-4">
              <h4 className={cn('mb-2 px-2 text-sm font-medium', classes.text.muted)}>Suporte</h4>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground hover:bg-gray-50 hover:text-primary"
                onClick={() => {
                  navigate('/politica-privacidade');
                  setIsSidebarOpen(false);
                }}
              >
                <File className="h-5 w-5 text-primary" />
                <span>Política de Privacidade</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-foreground hover:bg-gray-50 hover:text-primary"
                onClick={() => {
                  navigate('/contato');
                  setIsSidebarOpen(false);
                }}
              >
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Contato</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default AppHeader;
