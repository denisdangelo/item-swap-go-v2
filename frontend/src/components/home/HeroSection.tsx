import { classes, typography } from '@/styles/design-system';
import { cn } from '@/lib/utils';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-background pt-12 md:pt-16">
      {/* Conteúdo do Hero */}
      <div className="container relative mx-auto px-3 py-3 sm:py-4">
        <div className="mx-auto max-w-md space-y-1 text-center">
          <div className="rounded-2xl border-2 border-purple-200/50 bg-white/15 px-6 py-4">
            <h1 className={cn(typography.heading.h4, 'leading-tight')}>
              Alugue e Empreste com <span className={classes.text.brand}>Segurança</span>
            </h1>
            <p className={cn(typography.body.small, 'mx-auto mt-1 max-w-xs')}>
              Itens para todos, de forma fácil, rápida e digital.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
