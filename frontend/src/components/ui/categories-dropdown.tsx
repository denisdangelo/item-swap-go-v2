import { Grid3X3, Wrench, Laptop, Dumbbell, BookOpen, Sofa } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoriesDropdownProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  className?: string;
}

export function CategoriesDropdown({
  categories,
  selectedCategory,
  onCategorySelect,
  className,
}: CategoriesDropdownProps) {
  // Mapeamento de ícones para categorias
  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'ferramentas':
        return <Wrench className="h-4 w-4" />;
      case 'eletrônicos':
        return <Laptop className="h-4 w-4" />;
      case 'esportes':
        return <Dumbbell className="h-4 w-4" />;
      case 'livros':
        return <BookOpen className="h-4 w-4" />;
      case 'móveis':
        return <Sofa className="h-4 w-4" />;
      default:
        return <Grid3X3 className="h-4 w-4" />;
    }
  };

  // Cores para categorias
  const getCategoryColors = (index: number) => {
    const colors = [
      { color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
      { color: 'text-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
      { color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
      { color: 'text-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
      { color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {/* Opção "Todas as Categorias" */}
      <button
        onClick={() => onCategorySelect(null)}
        className={cn(
          'flex min-w-[110px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none',
          !selectedCategory
            ? 'translate-y-[-2px] scale-105 border-blue-700 bg-blue-700 text-white shadow-2xl ring-4 ring-blue-300'
            : 'border-blue-300 bg-white text-blue-900 shadow-sm hover:bg-blue-50 hover:shadow-md'
        )}
        aria-pressed={!selectedCategory}
        aria-label="Todas as Categorias"
        type="button"
      >
        <Grid3X3 className="mr-1 h-5 w-5" /> Todas
      </button>
      {/* Lista de Categorias */}
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              'flex min-w-[110px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none',
              isSelected
                ? 'translate-y-[-2px] scale-105 border-blue-700 bg-blue-700 text-white shadow-2xl ring-4 ring-blue-300'
                : 'border-blue-300 bg-white text-blue-900 shadow-sm hover:bg-blue-50 hover:shadow-md'
            )}
            aria-pressed={isSelected}
            aria-label={category.name}
            type="button"
          >
            <span className="flex items-center">{getCategoryIcon(category.name)}</span>
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

export default CategoriesDropdown;
