import { useState, useEffect } from 'react';

/**
 * Hook para detectar se a viewport está no topo da página.
 * Utiliza um IntersectionObserver para uma detecção performática.
 *
 * @returns {boolean} - Retorna `true` se a página estiver no topo.
 */
export function useIsAtTop(): boolean {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    // Um elemento "sentinela" é colocado no topo do body para ser observado.
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.height = '1px';
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // O observer é acionado quando o sentinela entra ou sai da viewport.
        // `isIntersecting` será true quando o sentinela estiver visível (ou seja, no topo).
        setIsAtTop(entry.isIntersecting);
      },
      { threshold: 1.0 } // Observa quando 100% do elemento está visível.
    );

    observer.observe(sentinel);

    // Função de limpeza para remover o observer e o elemento sentinela.
    return () => {
      observer.disconnect();
      if (document.body.contains(sentinel)) {
        document.body.removeChild(sentinel);
      }
    };
  }, []); // O array de dependências vazio garante que o efeito rode apenas uma vez.

  return isAtTop;
}
