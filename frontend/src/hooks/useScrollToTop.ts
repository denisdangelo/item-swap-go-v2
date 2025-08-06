import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para garantir que a página seja carregada no topo
 * Executa automaticamente quando a rota muda
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll suave para o topo
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    // Fallback para navegadores que não suportam smooth scroll
    if (!('scrollBehavior' in document.documentElement.style)) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Função manual para scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  return { scrollToTop };
};
