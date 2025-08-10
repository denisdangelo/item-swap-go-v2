import { useNavigate } from 'react-router-dom';

import FAQSection from '@/components/ui/faq-section';
import { AppHeader } from '@/components/ui/app-header';
import PageContainer from '@/components/ui/page-container';
import { toast } from '@/components/ui/use-toast';

function FAQPage() {
  const navigate = useNavigate();

  const handleContactClick = () => {
    toast({
      title: 'Contato de Suporte',
      description: 'Em breve você receberá uma ligação de nossa equipe de suporte.',
      variant: 'default',
    });
    // Aqui você pode integrar com um sistema de telefonia real
    setTimeout(() => {
      toast({
        title: 'Ligação Realizada',
        description: 'Nossa equipe está tentando entrar em contato. Verifique seu telefone.',
        variant: 'success',
      });
    }, 2000);
  };

  const handleChatClick = () => {
    toast({
      title: 'Chat Iniciado',
      description: 'Conectando você com nossa equipe de suporte...',
      variant: 'default',
    });
    // Aqui você pode integrar com um sistema de chat real
    setTimeout(() => {
      navigate('/chat/support');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showBackButton onBack={() => navigate(-1)} title="Perguntas Frequentes" />

      <PageContainer className="py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="fluid-hero text-foreground">Perguntas Frequentes</h1>
            <p className="fluid-body mx-auto max-w-2xl text-muted-foreground">
              Encontre respostas rápidas para as dúvidas mais comuns sobre nossa plataforma
            </p>
          </div>

          <FAQSection onContactClick={handleContactClick} onChatClick={handleChatClick} />
        </div>
      </PageContainer>
    </div>
  );
}

export default FAQPage;
