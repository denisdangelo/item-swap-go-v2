import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/ui/app-header';

import ImageCarousel from './details/ImageCarousel';
import ItemInfo from './details/ItemInfo';
import ReviewsList from './details/ReviewsList';

import type { Item } from '@/types';

interface ItemDetailsProps {
  item: Item;
  onBack: () => void;
  onChat: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onBack, onChat }) => {
  if (!item) return null;

  const mockImages = ['/placeholder.png', '/placeholder.png', '/placeholder.png'];

  const mockReviews = [
    {
      id: '1',
      user: {
        name: 'João Silva',
        avatar: '/avatar-placeholder.png',
      },
      rating: 5,
      comment: 'Ótimo item, muito bem cuidado!',
      date: '2024-02-20',
    },
    {
      id: '2',
      user: {
        name: 'Maria Santos',
        avatar: '/avatar-placeholder.png',
      },
      rating: 4,
      comment: 'Bom atendimento e item em ótimo estado.',
      date: '2024-02-19',
    },
  ];

  return (
    <div className="min-h-screen">
      <AppHeader showBackButton onBack={onBack} title="Detalhes do Item" />

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4 p-3 sm:space-y-6 sm:p-4">
          <ImageCarousel
            available={item.is_available}
            currentIndex={0}
            images={mockImages}
            setCurrentIndex={(index) => {}}
            title={item.title}
          />

          <ItemInfo item={item} />

          <ReviewsList reviews={mockReviews} />

          {/* Action Buttons */}
          <div className="space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="space-y-3">
              <Button
                aria-label="Iniciar conversa"
                className="hover-lift w-full items-center justify-center gap-2 bg-background px-4 py-3 text-sm"
                variant="outline"
                onClick={onChat}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Iniciar Conversa</span>
              </Button>
              <Button
                aria-label="Solicitar empréstimo do item"
                className="hover-lift w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-sm text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                disabled={!item.is_available}
              >
                <Calendar className="h-4 w-4" />
                <span>{item.is_available ? 'Solicitar Empréstimo' : 'Indisponível'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
