import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies (usando a mesma chave do localStorage)
    const cookieConsent = localStorage.getItem('cookie_consent_given');
    if (!cookieConsent) {
      // Pequeno delay para melhorar UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem('cookie_consent_given', 'true');
      setIsVisible(false);
      setIsClosing(false);
    }, 500);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem('cookie_consent_given', 'dismissed');
      setIsVisible(false);
      setIsClosing(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-16 left-0 right-0 z-[100] bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:bottom-0 ${
        isClosing ? 'animate-slide-down' : 'animate-slide-up'
      }`}
    >
      <div className="container relative mx-auto max-w-4xl">
        <button
          onClick={handleClose}
          className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
        <p className="mb-3 pr-8 text-sm text-gray-700">
          Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa{' '}
          <Link to="/politica-privacidade" className="font-semibold text-primary hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <button
          onClick={handleAccept}
          className="w-full rounded-lg bg-primary px-4 py-2 font-bold text-white transition-colors duration-300 hover:bg-primary/90"
        >
          Ok, entendi
        </button>
      </div>
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        @keyframes slide-down {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
