/**
 * Design System - Empresta aê
 * Paleta de cores, tipografia e componentes padronizados
 */

export const designSystem = {
  // Paleta de Cores Principal
  colors: {
    // Roxo - Branding e Navegação
    primary: {
      50: 'rgb(250, 245, 255)', // purple-50
      100: 'rgb(243, 232, 255)', // purple-100
      200: 'rgb(233, 213, 255)', // purple-200
      300: 'rgb(216, 180, 254)', // purple-300
      400: 'rgb(196, 144, 254)', // purple-400
      500: 'rgb(168, 85, 247)', // purple-500
      600: 'rgb(147, 51, 234)', // purple-600
      700: 'rgb(126, 34, 206)', // purple-700
      800: 'rgb(107, 33, 168)', // purple-800
      900: 'rgb(88, 28, 135)', // purple-900
      950: 'rgb(59, 7, 100)', // purple-950
    },

    // Cinza - Textos e Conteúdo
    neutral: {
      50: 'rgb(249, 250, 251)', // gray-50
      100: 'rgb(243, 244, 246)', // gray-100
      200: 'rgb(229, 231, 235)', // gray-200
      300: 'rgb(209, 213, 219)', // gray-300
      400: 'rgb(156, 163, 175)', // gray-400
      500: 'rgb(107, 114, 128)', // gray-500
      600: 'rgb(75, 85, 99)', // gray-600
      700: 'rgb(55, 65, 81)', // gray-700
      800: 'rgb(31, 41, 55)', // gray-800
      900: 'rgb(17, 24, 39)', // gray-900
      950: 'rgb(3, 7, 18)', // gray-950
    },

    // Slate - Textos Sofisticados
    slate: {
      50: 'rgb(248, 250, 252)', // slate-50
      100: 'rgb(241, 245, 249)', // slate-100
      200: 'rgb(226, 232, 240)', // slate-200
      300: 'rgb(203, 213, 225)', // slate-300
      400: 'rgb(148, 163, 184)', // slate-400
      500: 'rgb(100, 116, 139)', // slate-500
      600: 'rgb(71, 85, 105)', // slate-600
      700: 'rgb(51, 65, 85)', // slate-700
      800: 'rgb(30, 41, 59)', // slate-800
      900: 'rgb(15, 23, 42)', // slate-900
      950: 'rgb(2, 6, 23)', // slate-950
    },

    // Cores de Estado
    success: {
      50: 'rgb(240, 253, 244)', // green-50
      500: 'rgb(34, 197, 94)', // green-500
      600: 'rgb(22, 163, 74)', // green-600
      700: 'rgb(21, 128, 61)', // green-700
    },

    warning: {
      50: 'rgb(255, 251, 235)', // yellow-50
      500: 'rgb(234, 179, 8)', // yellow-500
      600: 'rgb(202, 138, 4)', // yellow-600
    },

    error: {
      50: 'rgb(254, 242, 242)', // red-50
      500: 'rgb(239, 68, 68)', // red-500
      600: 'rgb(220, 38, 38)', // red-600
      700: 'rgb(185, 28, 28)', // red-700
    },

    info: {
      50: 'rgb(239, 246, 255)', // blue-50
      500: 'rgb(59, 130, 246)', // blue-500
      600: 'rgb(37, 99, 235)', // blue-600
    },
  },

  // Classes CSS Padronizadas
  classes: {
    // Textos
    text: {
      primary: 'text-gray-900', // Textos principais
      secondary: 'text-gray-700', // Textos secundários
      muted: 'text-gray-500', // Textos auxiliares
      placeholder: 'text-gray-400', // Placeholders
      inverse: 'text-white', // Texto em fundos escuros
      brand: 'text-purple-700', // Texto da marca
      link: 'text-purple-600 hover:text-purple-700', // Links
    },

    // Backgrounds
    background: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      muted: 'bg-gray-100',
      brand: 'bg-gradient-to-r from-purple-700 to-purple-900',
      brandLight: 'bg-purple-50',
      success: 'bg-green-50',
      warning: 'bg-yellow-50',
      error: 'bg-red-50',
      info: 'bg-blue-50',
    },

    // Bordas
    border: {
      default: 'border-gray-200',
      muted: 'border-gray-100',
      strong: 'border-gray-300',
      brand: 'border-purple-200',
      focus: 'focus:ring-2 focus:ring-purple-200 focus:border-purple-500',
    },

    // Botões
    button: {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
      ghost: 'hover:bg-gray-100 text-gray-700',
      brandGhost: 'hover:bg-purple-50 text-purple-700',
    },

    // Estados
    state: {
      success: 'text-green-700 bg-green-50 border-green-200',
      warning: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      error: 'text-red-700 bg-red-50 border-red-200',
      info: 'text-blue-700 bg-blue-50 border-blue-200',
    },
  },

  // Tipografia
  typography: {
    // Títulos
    heading: {
      h1: 'text-3xl md:text-4xl font-bold text-gray-900',
      h2: 'text-2xl md:text-3xl font-bold text-gray-900',
      h3: 'text-xl md:text-2xl font-semibold text-gray-900',
      h4: 'text-lg md:text-xl font-semibold text-gray-900',
      h5: 'text-base md:text-lg font-semibold text-gray-900',
      h6: 'text-sm md:text-base font-semibold text-gray-900',
    },

    // Corpo de texto
    body: {
      large: 'text-lg text-gray-700',
      default: 'text-base text-gray-700',
      small: 'text-sm text-gray-600',
      xs: 'text-xs text-gray-500',
    },

    // Texto especial
    special: {
      lead: 'text-xl text-gray-600 font-light',
      caption: 'text-sm text-gray-500',
      overline: 'text-xs text-gray-500 uppercase tracking-wide font-medium',
    },
  },

  // Espaçamentos
  spacing: {
    section: 'py-12 md:py-16',
    container: 'px-4 md:px-6 lg:px-8',
    card: 'p-6 md:p-8',
    button: 'px-4 py-2 md:px-6 md:py-3',
  },

  // Sombras
  shadow: {
    sm: 'shadow-sm',
    default: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    brand: 'shadow-lg shadow-purple-500/10',
  },

  // Animações
  animation: {
    transition: 'transition-all duration-200 ease-in-out',
    hover: 'hover:scale-105 transition-transform duration-200',
    focus: 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
  },
} as const;

// Utilitários para usar no código
export const { colors, classes, typography, spacing, shadow, animation } = designSystem;

// Função helper para combinar classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
