import { Card, CardContent, CardHeader, CardTitle } from './card';

/**
 * Componente de exemplo demonstrando o uso das novas classes de tipografia mobile-first
 * Este componente mostra a hierarquia de texto e como ela se adapta a diferentes tamanhos de tela
 */
export function TypographyExample() {
  return (
    <div className="space-y-8 p-6">
      {/* Títulos Principais */}
      <section className="space-y-4">
        <h1 className="fluid-hero text-mobile-optimized text-spacing-tight">
          Título Principal (Hero)
        </h1>
        <p className="text-caption text-muted-foreground">
          Classe: <code>fluid-hero</code> - Responsivo: 36px → 56px
        </p>
      </section>

      {/* Títulos de Seção */}
      <section className="space-y-4">
        <h2 className="fluid-title text-spacing-tight">Título de Seção</h2>
        <p className="text-caption text-muted-foreground">
          Classe: <code>fluid-title</code> - Responsivo: 24px → 40px
        </p>
      </section>

      {/* Subtítulos */}
      <section className="space-y-4">
        <h3 className="fluid-subtitle">Subtítulo ou Texto de Destaque</h3>
        <p className="text-caption text-muted-foreground">
          Classe: <code>fluid-subtitle</code> - Responsivo: 18px → 24px
        </p>
      </section>

      {/* Texto Principal */}
      <section className="space-y-4">
        <p className="fluid-body text-mobile-optimized">
          Este é o texto principal do aplicativo. Deve ser usado para parágrafos e conteúdo
          principal. A legibilidade é otimizada para dispositivos móveis com espaçamento de linha
          adequado e tamanho de fonte confortável para leitura.
        </p>
        <p className="text-caption text-muted-foreground">
          Classe: <code>fluid-body</code> - Responsivo: 16px → 18px
        </p>
      </section>

      {/* Texto Secundário */}
      <section className="space-y-4">
        <p className="fluid-body">
          Este é o texto secundário, usado para informações complementares, descrições curtas e
          conteúdo que não é o foco principal.
        </p>
        <p className="text-caption text-muted-foreground">
          Classe: <code>fluid-body</code> - Responsivo: 16px → 18px
        </p>
      </section>

      {/* Legendas */}
      <section className="space-y-4">
        <span className="fluid-caption text-muted-foreground">Legenda ou informação adicional</span>
        <p className="text-caption text-muted-foreground">
          Classe: <code>fluid-caption</code> - Responsivo: 14px → 16px
        </p>
      </section>

      {/* Botões */}
      <section className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button className="fluid-body rounded-lg bg-primary px-6 py-3 font-mobile-medium text-white shadow-md transition-all hover:shadow-lg">
            Botão Principal
          </button>
          <button className="fluid-caption rounded-lg border border-border bg-background px-4 py-2 font-mobile-medium shadow-sm transition-all hover:bg-accent">
            Botão Secundário
          </button>
        </div>
        <p className="text-caption text-muted-foreground">
          Classes: <code>fluid-body</code> e <code>fluid-caption</code>
        </p>
      </section>

      {/* Exemplo de Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="fluid-title text-spacing-tight">Exemplo de Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="fluid-body text-mobile-optimized">
            Este card demonstra como as classes de tipografia funcionam em conjunto com outros
            componentes do design system.
          </p>
          <div className="flex items-center justify-between">
            <span className="fluid-body font-mobile-medium text-muted-foreground">
              Informação adicional
            </span>
            <span className="fluid-caption text-primary">Status</span>
          </div>
        </CardContent>
      </Card>

      {/* Comparação Mobile vs Desktop */}
      <section className="space-y-4">
        <h3 className="fluid-subtitle">Comparação Mobile vs Desktop</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h4 className="fluid-caption mb-2 font-mobile-semibold">Mobile (375px)</h4>
            <div className="space-y-2 text-xs">
              <p>
                <strong>Hero:</strong> 30px (1.875rem)
              </p>
              <p>
                <strong>Title:</strong> 22px (1.375rem)
              </p>
              <p>
                <strong>Body:</strong> 15px (0.9375rem)
              </p>
              <p>
                <strong>Caption:</strong> 11px (0.6875rem)
              </p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="fluid-caption mb-2 font-mobile-semibold">Desktop (1024px+)</h4>
            <div className="space-y-2 text-xs">
              <p>
                <strong>Hero:</strong> 60px (3.75rem)
              </p>
              <p>
                <strong>Title:</strong> 36px (2.25rem)
              </p>
              <p>
                <strong>Body:</strong> 18px (1.125rem)
              </p>
              <p>
                <strong>Caption:</strong> 14px (0.875rem)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Otimizações de Legibilidade */}
      <section className="space-y-4">
        <h3 className="fluid-subtitle">Otimizações de Legibilidade</h3>
        <div className="space-y-2">
          <p className="fluid-body text-mobile-optimized">
            Este texto usa <code>fluid-body</code> para melhor renderização em dispositivos móveis
            com antialiasing e otimizações de legibilidade.
          </p>
          <p className="fluid-body text-spacing-tight">
            Este texto usa <code>fluid-body</code> para espaçamento de letras mais compacto, ideal
            para títulos.
          </p>
          <p className="fluid-body text-spacing-wide">
            Este texto usa <code>fluid-body</code> para espaçamento de letras mais amplo, ideal para
            destaque.
          </p>
        </div>
      </section>
    </div>
  );
}

export default TypographyExample;
