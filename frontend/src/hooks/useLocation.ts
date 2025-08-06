import { useState, useCallback, useEffect } from 'react';
import { useStore } from '@/store';

export const useLocation = () => {
  const { userLocation, setUserLocation } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: '',
      };

      setUserLocation(location);
      return location;
    } catch (err) {
      const error = err as GeolocationPositionError;
      let errorMessage = 'Erro ao obter localização';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permissão de localização negada';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Informação de localização indisponível';
          break;
        case error.TIMEOUT:
          errorMessage = 'Tempo limite excedido ao obter localização';
          break;
      }

      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUserLocation]);

  // Limpar localização quando o componente for desmontado
  useEffect(() => {
    return () => {
      setUserLocation(null);
    };
  }, [setUserLocation]);

  return {
    userLocation,
    requestLocation,
    isLoading,
    error,
  };
};
