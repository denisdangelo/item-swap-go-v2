import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Search, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { itemsApiService } from '@/services/api/index';
import { useIsMobile } from '@/hooks/use-mobile';

import type { Item } from '@/types';

interface SearchCommandProps {
  onItemSelect?: (item: Item) => void;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  searchQuery?: string;
  className?: string;
}

export function SearchCommand({
  onItemSelect,
  onSearchChange,
  onSearchSubmit,
  searchQuery = '',
  className,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Sync with external search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const searchItems = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await itemsApiService.getItems({
          search: query,
          limit: isMobile ? 3 : 5, // Menos resultados no mobile
          page: 1,
        });
        setSuggestions((response as any).items ?? (response as any).data ?? []);
      } catch (error) {
        console.error('Error searching items:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isMobile]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      searchItems(localSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchItems]);

  const handleInputChange = (value: string) => {
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleSelect = (item: Item) => {
    setOpen(false);
    setLocalSearchQuery('');
    if (onItemSelect) {
      onItemSelect(item);
    } else {
      navigate(`/items/${item.id}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(localSearchQuery);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-start border-none bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80',
            'touch-manipulation hover:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0',
            isMobile ? 'h-14 text-base' : 'h-12 text-sm', // Altura maior no mobile
            className
          )}
        >
          <div className="flex items-center gap-3">
            <Search className={cn('shrink-0 opacity-70', isMobile ? 'h-5 w-5' : 'h-4 w-4')} />
            <span className="truncate text-foreground/90">
              {localSearchQuery || 'Buscar itens...'}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-[--radix-popover-trigger-width] p-0',
          isMobile ? 'max-h-[60vh]' : 'max-h-[50vh]'
        )}
        align="start"
        sideOffset={4}
      >
        <Command className="rounded-lg border border-border/50 bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <form onSubmit={handleSubmit}>
            <CommandInput
              placeholder="Buscar itens..."
              value={localSearchQuery}
              onValueChange={handleInputChange}
              className={cn(
                'border-none focus:ring-0',
                isMobile ? 'h-14 text-base' : 'h-10 text-sm'
              )}
            />
          </form>
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando...
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum item encontrado.
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {suggestions.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item)}
                  className={cn(
                    'flex touch-manipulation items-center gap-3 px-3 hover:bg-muted/50',
                    isMobile ? 'py-4' : 'py-2'
                  )}
                >
                  <Check
                    className={cn(
                      'shrink-0 text-primary',
                      localSearchQuery === item.title ? 'opacity-100' : 'opacity-0',
                      isMobile ? 'h-5 w-5' : 'h-4 w-4'
                    )}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-foreground/90">{item.title}</span>
                    {isMobile && (item as any).category && (
                      <span className="truncate text-xs text-muted-foreground">
                        {(item as any).category?.name || item.categoryId}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
