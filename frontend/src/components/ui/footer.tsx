import { Link } from 'react-router-dom';
import { Icons } from './icons';

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`w-full border-t border-blue-200 bg-gradient-to-b from-blue-50 via-white to-blue-100 px-4 pb-6 pt-8 shadow-inner ${className}`}
    >
      <div className="container mx-auto">
        {/* Logo centralizado */}
        <div className="mb-6 flex flex-col items-center">
          <Icons.logo className="mb-2 h-10 w-10" aria-label="Logo Empresta aê" />
          <span className="text-xl font-bold tracking-tight text-blue-900">Empresta aê</span>
        </div>

        {/* Links principais em grid/chips */}
        <nav aria-label="Mapa do site" className="mb-6">
          <ul className="flex flex-wrap justify-center gap-3">
            <li>
              <Link
                to="/"
                className="block rounded-full bg-blue-100 px-4 py-2 text-center text-sm font-medium text-blue-900 transition-all hover:bg-blue-200 focus-visible:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="Início"
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="block rounded-full bg-blue-100 px-4 py-2 text-center text-sm font-medium text-blue-900 transition-all hover:bg-blue-200 focus-visible:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="FAQ"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/categorias"
                className="block rounded-full bg-blue-100 px-4 py-2 text-center text-sm font-medium text-blue-900 transition-all hover:bg-blue-200 focus-visible:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="Categorias"
              >
                Categorias
              </Link>
            </li>
            <li>
              <Link
                to="/contato"
                className="block rounded-full bg-blue-100 px-4 py-2 text-center text-sm font-medium text-blue-900 transition-all hover:bg-blue-200 focus-visible:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="Contato"
              >
                Contato
              </Link>
            </li>
            <li>
              <Link
                to="/politica-privacidade"
                className="block rounded-full bg-blue-100 px-4 py-2 text-center text-sm font-medium text-blue-900 transition-all hover:bg-blue-200 focus-visible:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label="Política de Privacidade"
              >
                Política de Privacidade
              </Link>
            </li>
          </ul>
        </nav>

        {/* Redes sociais */}
        <div className="mb-6 flex justify-center gap-4">
          <a
            href="https://twitter.com/emprestaae"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="rounded-full bg-blue-100 p-2 transition-colors hover:bg-blue-200 focus-visible:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Icons.twitter className="h-5 w-5 text-blue-500" />
          </a>
          <a
            href="https://github.com/thiagogm/item-swap-go"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="rounded-full bg-blue-100 p-2 transition-colors hover:bg-blue-200 focus-visible:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <Icons.gitHub className="h-5 w-5 text-blue-900" />
          </a>
        </div>

        {/* Institucional */}
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm text-muted-foreground">
            Empresta aê &copy; {new Date().getFullYear()}
          </span>
          <span className="text-xs text-muted-foreground">Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
