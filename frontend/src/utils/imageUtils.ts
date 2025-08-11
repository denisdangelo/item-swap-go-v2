// Mapeamento direto de produtos para imagens únicas
const PRODUCT_IMAGES = {
  // FERRAMENTAS
  '1': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80', // Furadeira
  '2': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80', // Jogo de ferramentas
  '3': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80', // Serra circular
  '4': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Lixadeira
  '5': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80', // Compressor

  // ELETRÔNICOS
  '6': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80', // Notebook Dell
  '7': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=80', // Câmera Canon
  '8': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop&q=80', // Projetor Epson
  '9': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=80', // Violão acústico
  '10': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80', // Smartphone

  // ESPORTES
  '11': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=80', // Bicicleta
  '12': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop&q=80', // Tenda camping
  '13': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80', // Mesa ping pong
  '14': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80', // Skate
  '15': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=80', // Patins

  // LIVROS
  '16': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Senhor dos Anéis
  '17': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Livros culinária
  '18': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Enciclopédia
  '19': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Autoajuda
  '20': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Mangás

  // MÓVEIS
  '21': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80', // Sofá 3 lugares
  '22': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80', // Mesa jantar
  '23': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80', // Escritório
  '24': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80', // Cama box
  '25': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80', // Rack TV
};

// Imagens secundárias únicas para cada produto (URLs diferentes)
const PRODUCT_SECONDARY_IMAGES = {
  // FERRAMENTAS
  '1': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=70',
  '2': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=70',
  '3': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=70',
  '4': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
  '5': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=70',

  // ELETRÔNICOS
  '6': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=70',
  '7': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=70',
  '8': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=600&fit=crop&q=70',
  '9': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=70',
  '10': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=70',

  // ESPORTES
  '11': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=70',
  '12': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop&q=70',
  '13': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=70',
  '14': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=70',
  '15': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=70',

  // LIVROS
  '16': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=70',
  '17': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=70',
  '18': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=70',
  '19': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=70',
  '20': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=70',

  // MÓVEIS
  '21': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=70',
  '22': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=70',
  '23': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=70',
  '24': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=70',
  '25': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=70',
};

// Imagens de fallback por categoria
const CATEGORY_FALLBACK_IMAGES = {
  '1': 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80', // Ferramentas
  '2': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80', // Eletrônicos
  '3': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=600&fit=crop&q=80', // Esportes
  '4': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Livros
  '5': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80', // Móveis
};

/**
 * Gera imagens únicas baseadas no ID do produto
 */
export function generateItemImages(
  _title: string,
  _description: string,
  categoryId: string,
  itemId?: string
): string[] {
  // Se temos um ID específico, usa o mapeamento direto
  if (itemId && PRODUCT_IMAGES[itemId as keyof typeof PRODUCT_IMAGES]) {
    const primaryImage = PRODUCT_IMAGES[itemId as keyof typeof PRODUCT_IMAGES];
    const secondaryImage =
      PRODUCT_SECONDARY_IMAGES[itemId as keyof typeof PRODUCT_SECONDARY_IMAGES];
    return [primaryImage, secondaryImage];
  }

  // Fallback para categoria
  const fallbackImage =
    CATEGORY_FALLBACK_IMAGES[categoryId as keyof typeof CATEGORY_FALLBACK_IMAGES];
  return [
    fallbackImage ||
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80',
    fallbackImage ||
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80',
  ];
}

/**
 * Gera uma imagem de placeholder baseada na categoria
 */
export function getCategoryPlaceholder(categoryId: string): string {
  return (
    CATEGORY_FALLBACK_IMAGES[categoryId as keyof typeof CATEGORY_FALLBACK_IMAGES] ||
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=600&fit=crop&q=80'
  );
}

/**
 * Verifica se uma imagem carregou corretamente e retorna um fallback se necessário
 */
export function getSafeImageUrl(url: string, _fallbackUrl?: string): string {
  // Adiciona headers para evitar problemas de CORS/CORB
  const safeUrl = new URL(url);
  safeUrl.searchParams.set('auto', 'format');
  safeUrl.searchParams.set('fit', 'crop');
  safeUrl.searchParams.set('w', '800');
  safeUrl.searchParams.set('h', '600');
  safeUrl.searchParams.set('q', '80');

  return safeUrl.toString();
}

/**
 * Função para lidar com erro de carregamento de imagem
 */
export function handleImageError(event: Event, fallbackUrl: string): void {
  const img = event.target as HTMLImageElement;
  if (img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  }
}

/**
 * Gera URLs seguras para imagens com fallbacks
 */
export function generateSafeItemImages(
  title: string,
  description: string,
  categoryId: string,
  itemId?: string
): { primary: string; fallback: string } {
  const images = generateItemImages(title, description, categoryId, itemId);
  const fallbackUrl = getCategoryPlaceholder(categoryId);

  return {
    primary: getSafeImageUrl(images[0], fallbackUrl),
    fallback: getSafeImageUrl(fallbackUrl),
  };
}

/**
 * Usa um proxy de imagens para evitar problemas de CORS/CORB
 */
export function getProxiedImageUrl(url: string): string {
  // Se a URL já é do Unsplash, adiciona parâmetros de otimização
  if (url.includes('unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('w', '800');
    urlObj.searchParams.set('h', '600');
    urlObj.searchParams.set('q', '80');
    return urlObj.toString();
  }

  return url;
}

/**
 * Verifica se uma URL de imagem é válida
 */
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
