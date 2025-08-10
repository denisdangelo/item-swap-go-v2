import { AppHeader } from '@/components/ui/app-header';
import PageContainer from '@/components/ui/page-container';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function PoliticaPrivacidade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <>
      <AppHeader showBackButton onBack={() => navigate(-1)} title="Política de Privacidade" />
      <PageContainer className="mx-auto max-w-2xl">
        <section className="rounded-xl bg-white/90 p-6 shadow-lg ring-1 ring-gray-200">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Política de Privacidade
          </h1>
          <p className="mb-6 text-base text-muted-foreground">
            Esta Política de Privacidade explica de forma clara e objetiva como coletamos, usamos e
            protegemos seus dados pessoais no Empresta aê, em conformidade com a LGPD (Lei Geral de
            Proteção de Dados - Lei 13.709/2018).
          </p>
          <ul className="mb-6 space-y-4 text-base text-foreground">
            <li>
              <strong>1. Coleta de Dados:</strong> Coletamos apenas os dados necessários para
              cadastro, uso do app e segurança, como nome, e-mail, localização e informações dos
              itens.
            </li>
            <li>
              <strong>2. Uso dos Dados:</strong> Utilizamos seus dados para viabilizar empréstimos,
              facilitar contato entre usuários, melhorar a experiência e garantir a segurança da
              plataforma.
            </li>
            <li>
              <strong>3. Compartilhamento:</strong> Não vendemos dados. Compartilhamos apenas o
              necessário para funcionamento do app, como exibir informações de contato entre
              usuários interessados em transações.
            </li>
            <li>
              <strong>4. Direitos do Titular:</strong> Você pode acessar, corrigir ou excluir seus
              dados a qualquer momento, bem como solicitar informações sobre o tratamento dos seus
              dados.
            </li>
            <li>
              <strong>5. Segurança:</strong> Adotamos medidas técnicas e administrativas para
              proteger seus dados contra acessos não autorizados, vazamentos ou usos indevidos.
            </li>
            <li>
              <strong>6. Cookies:</strong> Utilizamos cookies apenas para melhorar a navegação e
              funcionalidades essenciais do app.
            </li>
            <li>
              <strong>7. Retenção:</strong> Os dados são mantidos apenas pelo tempo necessário para
              cumprir as finalidades do app e obrigações legais.
            </li>
            <li>
              <strong>8. Contato:</strong> Em caso de dúvidas sobre privacidade ou para exercer seus
              direitos, entre em contato pelo e-mail suporte@emprestaae.com.
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </section>
      </PageContainer>
    </>
  );
}
