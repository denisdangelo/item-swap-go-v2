import { AlertCircle, ExternalLink } from 'lucide-react';
import React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { geolocationService } from '@/services/geolocation';
import type { Item, Location } from '@/types';

interface MapFallbackProps {
  status: 'missing' | 'invalid';
  items: Item[];
  userLocation: Location | null;
  onItemSelect?: (item: Item) => void;
  className?: string;
}

export const MapFallback: React.FC<MapFallbackProps> = ({
  status,
  items,
  userLocation,
  onItemSelect,
  className,
}) => {
  const title =
    status === 'missing'
      ? 'Chave da API do Google Maps não configurada'
      : 'Chave da API do Google Maps inválida';

  return (
    <div className={`relative ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Google Maps não configurado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-medium">{title}</p>
                <div className="space-y-2 text-sm">
                  <p>Para usar o mapa interativo, siga os passos no nosso guia:</p>
                  <Button
                    className="h-auto p-0 text-primary"
                    size="sm"
                    variant="link"
                    onClick={() =>
                      window.open(
                        'https://github.com/your-repo/item-swap-go/blob/main/TROUBLESHOOTING.md',
                        '_blank'
                      )
                    }
                  >
                    Acessar Guia de Solução de Problemas <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    O guia detalha como obter e configurar sua chave de API.
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Fallback: Lista de itens com localização */}
          {items.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Itens disponíveis na sua região:</h4>
              <div className="grid max-h-60 gap-2 overflow-y-auto">
                {items.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                    role="button"
                    tabIndex={0}
                    onClick={() => onItemSelect?.(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onItemSelect?.(item);
                      }
                    }}
                  >
                    <div className="flex-1">
                      <h5 className="font-medium">{item.title}</h5>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {userLocation && item.location && (
                        <p className="text-xs text-muted-foreground">
                          {geolocationService
                            .calculateDistance(
                              userLocation.latitude,
                              userLocation.longitude,
                              item.location.latitude,
                              item.location.longitude
                            )
                            .toFixed(1)}
                          km de distância
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="ghost" className="flex items-center justify-center">
                      Ver detalhes
                    </Button>
                  </div>
                ))}
              </div>
              {items.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  E mais {items.length - 5} itens disponíveis...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
