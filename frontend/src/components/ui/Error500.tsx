
interface Error500Props {
  onRetry?: () => void;
}

export function Error500({ onRetry }: Error500Props) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
      <div className="mb-6 flex items-center justify-center">
        <span role="img" aria-label="Erro interno" className="text-6xl">
          💥
        </span>
      </div>
      <h1 className="fluid-title mb-2 text-destructive">Erro Interno do Servidor</h1>
      <p className="fluid-body mx-auto mb-6 max-w-md text-muted-foreground">
        Ocorreu um erro inesperado em nossos servidores. Por favor, tente novamente em alguns
        instantes.
        <br />
        Se o problema persistir, entre em contato com o suporte.
      </p>
      {onRetry && (
        <button className="btn-primary fluid-body rounded-lg px-6 py-3" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
