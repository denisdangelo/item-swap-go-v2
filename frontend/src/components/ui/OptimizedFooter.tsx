import { Link } from 'react-router-dom';

export function OptimizedFooter() {
  const currentYear = new Date().getFullYear();

  const siteLinks = [
    { to: '/', label: 'Início' },
    { to: '/add-item', label: 'Adicionar Item' },
    { to: '/profile', label: 'Perfil' },
    { to: '/messages', label: 'Mensagens' },
  ];

  const supportLinks = [
    { to: '/faq', label: 'FAQ' },
    { to: '/contato', label: 'Contato' },
    { to: '/politica-privacidade', label: 'Privacidade' },
    { to: '/termos', label: 'Termos de Uso' },
  ];

  return (
    <footer className="mb-16 mt-auto border-t border-gray-200 bg-gray-50 md:mb-0">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Sitemap */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* App */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">App</h3>
            <ul className="space-y-2">
              {siteLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Suporte</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Empresta aê. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
