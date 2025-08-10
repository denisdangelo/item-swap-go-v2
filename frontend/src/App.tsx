import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import AddItemScreen from '@/components/AddItemScreen';
import ChatScreen from '@/components/ChatScreen';
import { MainFeedNew } from '@/components/MainFeedNew';
import { ScrollToTop } from '@/components/ScrollToTop';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/pages/AuthPage';
import FAQPage from '@/pages/FAQPage';
import { InsurancePage } from '@/pages/InsurancePage';
import { InsuranceSuccessPage } from '@/pages/InsuranceSuccessPage';
import ItemDetailsPage from '@/pages/ItemDetailsPage';
import { LoanConfirmationPage } from '@/pages/LoanConfirmationPage';
import { LoanRequestPage } from '@/pages/LoanRequestPage';
import SettingsPage from '@/pages/SettingsPage';
import { UserProfilePage } from '@/pages/UserProfilePage';
import { itemsApiService } from '@/services/api/index';
import { logEnvironmentStatus } from '@/utils/env-checker';

import { SearchFiltersProvider } from '@/contexts/SearchFiltersContext';
import { BottomNav } from './components/ui/bottom-nav';
import { OfflineBanner } from './components/ui/OfflineBanner';
import { OptimizedFooter } from './components/ui/OptimizedFooter';

import Index from '@/pages/Index';

import { AppHeader } from '@/components/ui/app-header';
import { CookieBanner } from '@/components/ui/CookieBanner';
import ContatoPage from '@/pages/ContatoPage';
import MessagesPage from '@/pages/MessagesPage';
import PoliticaPrivacidade from '@/pages/PoliticaPrivacidade';
import TermosUsoPage from '@/pages/TermosUsoPage';
import type { AddItemData, Item } from '@/types';

const queryClient = new QueryClient();

// Add ChatScreenWrapper component to handle item fetching
const ChatScreenWrapper = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) return;
      try {
        const fetchedItem = await itemsApiService.getItemById(itemId);
        setItem(fetchedItem as any);
      } catch (error) {
        console.error('Error fetching item:', error);
        navigate('/');
      }
    };
    fetchItem();
  }, [itemId, navigate]);

  if (!item) return null;

  return (
    <PageWrapper>
      <ChatScreen item={item} onBack={() => navigate(-1)} />
    </PageWrapper>
  );
};

// Update ProtectedRoute to use user instead of isAuthenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Check if current route is auth page
  const isAuthRoute = location.pathname === '/auth';

  // Redirect to auth if no user and not on auth page
  useEffect(() => {
    if (!user && !isAuthRoute) {
      navigate('/auth', { replace: true });
    }
  }, [user, isAuthRoute, navigate]);

  // login navega automaticamente via store/useAuth

  // If no user, only show auth route
  if (!user) {
    return (
      <Routes>
          <Route element={<PageWrapper><AuthPage /></PageWrapper>} path="/auth" />
        <Route element={<Navigate replace to="/auth" />} path="*" />
      </Routes>
    );
  }

  // Protected routes (only rendered if user exists)
  return (
    <div className="flex min-h-screen flex-col">
      <OfflineBanner />
      <AppHeader
        user={user}
        onProfileClick={() => navigate('/profile')}
        showSearchField={location.pathname === '/'}
        showBackButton={location.pathname === '/search'}
        title={location.pathname === '/search' ? 'Resultados da Busca' : undefined}
      />

      {/* Main content area that grows to fill available space */}
      <div className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route
            element={
              <PageWrapper>
                <Index />
              </PageWrapper>
            }
            path="/"
          />
          <Route
            element={
              <PageWrapper>
                <ItemDetailsPage />
              </PageWrapper>
            }
            path="/items/:itemId"
          />
          <Route
            element={
              <PageWrapper>
                <LoanRequestPage />
              </PageWrapper>
            }
            path="/items/:itemId/loan"
          />
          <Route
            element={
              <PageWrapper>
                <LoanConfirmationPage />
              </PageWrapper>
            }
            path="/loan-confirmation"
          />
          <Route
            element={
              <PageWrapper>
                <InsurancePage />
              </PageWrapper>
            }
            path="/insurance"
          />
          <Route
            element={
              <PageWrapper>
                <InsuranceSuccessPage />
              </PageWrapper>
            }
            path="/insurance-success"
          />
          <Route
            element={
              <PageWrapper>
                <FAQPage />
              </PageWrapper>
            }
            path="/faq"
          />
          <Route
            element={
              <PageWrapper>
                <MainFeedNew />
              </PageWrapper>
            }
            path="/search"
          />
          <Route
            element={
              <ProtectedRoute>
                <ChatScreenWrapper />
              </ProtectedRoute>
            }
            path="/chat/:itemId"
          />
          <Route
            element={
              <PageWrapper>
                <UserProfilePage />
              </PageWrapper>
            }
            path="/profile"
          />
          <Route
            element={
              <PageWrapper>
                <AddItemScreen
                  onSave={async (data: AddItemData) => {
                    try {
                        // Preparar dados para o serviço
                          const createData = {
                            category_id: data.categoryId,
                            title: data.title,
                            description: data.description,
                            condition_rating: 5,
                            estimated_value: parseFloat(data.price),
                            daily_rate: parseFloat(data.price),
                            location_lat: data.latitude ?? 0,
                            location_lng: data.longitude ?? 0,
                            location_address: data.address,
                          } as const;

                        // Criar o item
                        const createdItem = await itemsApiService.createItem(createData as any);
                        
                        // Upload das imagens se houver
                        if (data.images && data.images.length > 0) {
                          try {
                            // Converter base64 para File objects
                            const imageFiles: File[] = [];
                            for (let i = 0; i < data.images.length; i++) {
                              const base64Data = data.images[i];
                              const response = await fetch(base64Data);
                              const blob = await response.blob();
                              const file = new File([blob], `image-${i}.jpg`, { type: 'image/jpeg' });
                              imageFiles.push(file);
                            }
                            
                            // Upload das imagens
                            await itemsApiService.uploadItemImages(createdItem.id, imageFiles);
                          } catch (imageError) {
                            console.error('Error uploading images:', imageError);
                            // Não falhar se o upload de imagens falhar
                          }
                        }
                        
                        navigate('/');
                      } catch (error) {
                        console.error('Error creating item:', error);
                        throw error;
                      }
                    }}
                />
              </PageWrapper>
            }
            path="/add-item"
          />
          <Route
            element={
              <PageWrapper>
                <PoliticaPrivacidade />
              </PageWrapper>
            }
            path="/politica-privacidade"
          />
          <Route
            element={
              <PageWrapper>
                <SettingsPage />
              </PageWrapper>
            }
            path="/settings"
          />
          <Route
            element={
              <PageWrapper>
                <ContatoPage />
              </PageWrapper>
            }
            path="/contato"
          />
          <Route
            element={
              <PageWrapper>
                <TermosUsoPage />
              </PageWrapper>
            }
            path="/termos"
          />
          <Route
            element={
              <PageWrapper>
                <TermosUsoPage />
              </PageWrapper>
            }
            path="/termos-uso"
          />
          <Route
            element={
              <ProtectedRoute>
                <PageWrapper>
                  <MessagesPage />
                </PageWrapper>
              </ProtectedRoute>
            }
            path="/messages"
          />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </div>

      {/* Bottom Navigation para mobile */}
      <BottomNav />

      {/* Footer otimizado mobile-first */}
      <OptimizedFooter />

      {/* Banner de cookies - apenas para usuários logados */}
      <CookieBanner />
    </div>
  );
}

function App() {
  // Log environment status on app startup
  useEffect(() => {
    logEnvironmentStatus();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SearchFiltersProvider>
          <Router>
            <TooltipProvider delayDuration={0}>
              <ScrollToTop />
              <AppRoutes />
              <Toaster />
            </TooltipProvider>
          </Router>
        </SearchFiltersProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
