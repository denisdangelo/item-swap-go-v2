import { GoogleMap as GoogleMapComponent, InfoWindow, LoadScript } from '@react-google-maps/api';
import { AlertCircle, ExternalLink, Loader2, MapPin } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { geolocationService } from '@/services/geolocation';
import { MapFallback } from './MapFallback';

import type { Item } from '@/types';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Bibliotecas adicionais necessárias para o AdvancedMarkerElement
const libraries: ('places' | 'drawing' | 'geometry' | 'visualization' | 'marker')[] = ['marker'];

interface GoogleMapProps {
  items: Item[]; // Assumindo que Item tem `location` opcional
  userLocation: { latitude: number; longitude: number; city?: string } | null;
  onItemSelect?: (item: Item) => void;
  className?: string;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -23.55052, // São Paulo
  lng: -46.633308,
};

const GoogleMap: React.FC<GoogleMapProps> = ({
  items,
  userLocation,
  onItemSelect,
  className = '',
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [map, setMap] = useState<any>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);

  const apiKeyStatus = useMemo(() => {
    if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.trim() === '') {
      return 'missing';
    }
    // Adicionando uma verificação para chaves de placeholder comuns
    if (GOOGLE_MAPS_API_KEY.includes('your_') || GOOGLE_MAPS_API_KEY.includes('_here')) {
      return 'invalid';
    }
    return 'valid';
  }, []);

  const center = userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : defaultCenter;

  const onLoad = useCallback((map: any) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  const handleMarkerClick = (item: Item) => {
    setSelectedItem(item);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  const handleCenterMap = () => {
    if (map && userLocation) {
      map.panTo({ lat: userLocation.latitude, lng: userLocation.longitude });
    }
  };

  // Criar marcadores quando o mapa ou os itens mudarem
  useEffect(() => {
    if (!map || !window.google?.maps?.marker) return;

    const newMarkers: any[] = [];
    const { AdvancedMarkerElement } = window.google.maps.marker;

    // Criar marcador para localização do usuário
    if (userLocation) {
      const userMarker = new (window as any).google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: userLocation.latitude, lng: userLocation.longitude },
        title: 'Sua localização',
        // O AdvancedMarkerElement pode receber um elemento customizado via 'content', mas para círculo simples, pode-se usar o default
      });
      newMarkers.push(userMarker);
    }

    // Criar marcadores para os itens
    items.forEach((item) => {
      if (!item.location) return;

      const marker = new AdvancedMarkerElement({
        map,
        position: { lat: item.location.latitude, lng: item.location.longitude },
        title: item.title,
        // Para custom marker, pode-se usar 'content', mas aqui usamos o default
      });
      marker.addListener('click', () => handleMarkerClick(item));
      newMarkers.push(marker);
    });

    // Retorna uma função de limpeza que será chamada quando o efeito for re-executado ou o componente desmontado
    return () => {
      newMarkers.forEach((marker) => {
        marker.map = null; // A forma correta de remover AdvancedMarkerElement
      });
    };
  }, [map, items, userLocation]);

  // Renderizar fallback quando API key não está configurada
  if (apiKeyStatus !== 'valid') {
    return (
      <MapFallback
        status={apiKeyStatus}
        items={items}
        userLocation={userLocation}
        onItemSelect={onItemSelect}
        className={className}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onError={(error) => {
          console.error('Google Maps LoadScript error:', error);
          setScriptError(error.message);
        }}
      >
        {scriptError ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Erro ao carregar o Google Maps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <p className="font-medium">{scriptError}</p>

                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Possíveis soluções:</p>
                      <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                        <li>Verifique se a chave da API está correta</li>
                        <li>Confirme se as APIs necessárias estão habilitadas</li>
                        <li>Verifique as restrições de domínio da chave</li>
                        <li>Certifique-se de que a chave tem permissões adequadas</li>
                        <li>Verifique se a faturação está ativada no Google Cloud</li>
                      </ul>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          'https://developers.google.com/maps/documentation/javascript/error-messages',
                          '_blank'
                        )
                      }
                    >
                      Ver documentação de erros <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ) : (
          <GoogleMapComponent
            center={center}
            mapContainerStyle={containerStyle}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {selectedItem && selectedItem.location && (
              <InfoWindow
                position={{
                  lat: selectedItem.location.latitude,
                  lng: selectedItem.location.longitude,
                }}
                onCloseClick={() => setSelectedItem(null)}
              >
                <div className="p-2">
                  <h3 className="font-medium">{selectedItem.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                  {userLocation && selectedItem.location && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {geolocationService
                        .calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          selectedItem.location.latitude,
                          selectedItem.location.longitude
                        )
                        .toFixed(1)}
                      km de distância
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMapComponent>
        )}
      </LoadScript>

      {userLocation && (
        <Button
          className="absolute bottom-4 right-4 z-10"
          size="icon"
          title="Centralizar no mapa"
          variant="secondary"
          onClick={handleCenterMap}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      )}

      {!map && !scriptError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
