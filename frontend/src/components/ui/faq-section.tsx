import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Shield, Zap, Award, Plus, Minus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'geral' | 'seguranca' | 'pagamento' | 'processo' | 'suporte';
  priority: number;
  hasCTA?: boolean;
  ctaText?: string;
  ctaAction?: () => void;
}

interface FAQSectionProps {
  className?: string;
  onContactClick?: () => void;
  onChatClick?: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ className, onContactClick, onChatClick }) => {
  // Permitir apenas um item aberto por vez
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqData: FAQItem[] = [
    {
      id: 'faq-1',
      question: 'Como funciona o processo de empréstimo de itens?',
      answer:
        'Escolha o item, solicite o empréstimo e combine a retirada com o proprietário pela plataforma.',
      category: 'processo',
      priority: 1,
    },
    {
      id: 'faq-2',
      question: 'É seguro emprestar itens com pessoas que não conheço?',
      answer: 'Sim. Todos os usuários são verificados e os empréstimos têm seguro.',
      category: 'seguranca',
      priority: 1,
    },
    {
      id: 'faq-3',
      question: 'Quais são as taxas e como funciona o pagamento?',
      answer:
        'Você paga o aluguel combinado e uma taxa de 5%. O pagamento é seguro pela plataforma.',
      category: 'pagamento',
      priority: 2,
    },
    {
      id: 'faq-4',
      question: 'O que acontece se o item for danificado durante o empréstimo?',
      answer: 'O seguro cobre danos acidentais. Avise pelo app se algo acontecer.',
      category: 'seguranca',
      priority: 2,
    },
    {
      id: 'faq-5',
      question: 'Como posso confiar na qualidade dos itens?',
      answer: 'Itens são avaliados por outros usuários e verificados por fotos e descrições.',
      category: 'geral',
      priority: 2,
    },
    {
      id: 'faq-6',
      question: 'Quanto tempo leva para aprovar minha solicitação de empréstimo?',
      answer: 'Normalmente menos de 2 horas. Se não houver resposta em 24h, cancele sem custo.',
      category: 'processo',
      priority: 3,
    },
    {
      id: 'faq-7',
      question: 'Posso cancelar um empréstimo após a reserva?',
      answer: 'Sim, até 24h antes da retirada sem custo. Após isso, pode haver taxa.',
      category: 'processo',
      priority: 3,
    },
    {
      id: 'faq-8',
      question: 'Como funciona o sistema de avaliações?',
      answer: 'Após cada empréstimo, usuários avaliam a experiência com notas e comentários.',
      category: 'geral',
      priority: 3,
    },
    {
      id: 'faq-9',
      question: 'Que tipos de itens posso encontrar na plataforma?',
      answer: 'Há itens de várias categorias: ferramentas, eletrônicos, esportes, roupas e mais.',
      category: 'geral',
      priority: 4,
    },
    {
      id: 'faq-10',
      question: 'Como posso entrar em contato com o suporte?',
      answer: 'Suporte disponível 24/7 pelo chat do app, e-mail ou telefone.',
      category: 'suporte',
      priority: 1,
    },
  ];

  // Filtro de categoria
  const categories = [
    { key: 'all', label: 'Todas', icon: <HelpCircle className="h-4 w-4" /> },
    { key: 'geral', label: 'Geral', icon: <HelpCircle className="h-4 w-4" /> },
    { key: 'seguranca', label: 'Segurança', icon: <Shield className="h-4 w-4" /> },
    { key: 'pagamento', label: 'Pagamento', icon: <Award className="h-4 w-4" /> },
    { key: 'processo', label: 'Processo', icon: <Zap className="h-4 w-4" /> },
    { key: 'suporte', label: 'Suporte', icon: <MessageCircle className="h-4 w-4" /> },
  ];

  // Filtrar FAQ por categoria, depois ordenar por prioridade
  const filteredFAQ = faqData
    .filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesCategory;
    })
    .sort((a, b) => a.priority - b.priority);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'seguranca':
        return <Shield className="h-5 w-5 text-primary" />;
      case 'processo':
        return <Zap className="h-5 w-5 text-primary" />;
      case 'pagamento':
        return <Award className="h-5 w-5 text-primary" />;
      case 'suporte':
        return <MessageCircle className="h-5 w-5 text-primary" />;
      default:
        return <HelpCircle className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className={cn('space-y-10', className)}>
      {/* Header do FAQ */}
      <div className="text-center">
        <p className="fluid-body text-muted-foreground">Tire suas dúvidas sobre a plataforma.</p>
      </div>

      {/* Filtros de categoria modernos */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={selectedCategory === cat.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105',
              selectedCategory === cat.key
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'border-muted-foreground/20 bg-background/50 hover:bg-muted/50'
            )}
          >
            {cat.icon}
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Lista de FAQs modernizada */}
      <div className="mx-auto max-w-4xl space-y-4">
        {filteredFAQ.length === 0 ? (
          <div className="rounded-3xl border border-muted/50 bg-muted/20 p-12 text-center">
            <div className="mx-auto max-w-sm space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <HelpCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="fluid-subtitle font-semibold">Nenhuma pergunta encontrada</h3>
              <p className="text-muted-foreground">
                Tente ajustar sua busca ou selecionar uma categoria diferente.
              </p>
            </div>
          </div>
        ) : (
          filteredFAQ.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'group overflow-hidden rounded-3xl border-2 transition-all duration-500 hover:shadow-lg',
                openItem === item.id
                  ? 'border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10 shadow-xl shadow-primary/10'
                  : 'border-primary/20 bg-background/80 backdrop-blur-sm hover:border-primary/30 hover:bg-background hover:shadow-primary/5'
              )}
            >
              <button
                className="w-full p-6 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
                onClick={() => setOpenItem(openItem === item.id ? null : item.id)}
                aria-expanded={openItem === item.id}
                aria-controls={`faq-content-${item.id}`}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300',
                          openItem === item.id
                            ? 'bg-primary/20 text-primary shadow-lg shadow-primary/20'
                            : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        )}
                      >
                        {getCategoryIcon(item.category)}
                      </div>
                    </div>
                    <h3 className="fluid-subtitle font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                      {item.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500',
                        openItem === item.id
                          ? 'rotate-180 bg-primary/20 text-primary'
                          : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      )}
                    >
                      {openItem === item.id ? (
                        <Minus className="h-5 w-5" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </div>
              </button>

              <div
                className={cn(
                  'overflow-hidden transition-all duration-500 ease-in-out',
                  openItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="border-t border-primary/10 px-6 pb-6 pt-4">
                  <div className="ml-16 animate-fade-in">
                    <p className="fluid-body leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQSection;
