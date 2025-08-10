import { MapPin } from 'lucide-react';

import { AppHeader } from '@/components/ui/app-header';
import { cn } from '@/lib/utils';

import type { Location, UserWithDetails } from '@/types';

export interface FeedHeaderProps {
  user: UserWithDetails | null;
  userLocation: Location | null;
  isAtTop: boolean;
  maxDistance: number;
  onProfileClick: () => void;
}

export function FeedHeader({
  user,
  userLocation,
  isAtTop,
  maxDistance,
  onProfileClick,
}: FeedHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-transparent bg-background/95 backdrop-blur-sm transition-all duration-200 ease-out',
        !isAtTop && 'border-border/40 shadow-sm'
      )}
    >
      <AppHeader
        showHelpButton
        showBackButton={false}
        showSearchIcon={false}
        user={
          user
            ? {
                id: 'temp-id',
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : undefined
        }
        onProfileClick={onProfileClick}
      />

      {/* Location Section - shown only when distance filter is active */}
      {userLocation && maxDistance > 0 && (
        <div className="animate-fade-in-down container mx-auto mb-4 px-4">
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
            <MapPin className="h-5 w-5" />
            <p>
              Mostrando itens a até <strong>{maxDistance} km</strong> de sua localização.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default FeedHeader;
