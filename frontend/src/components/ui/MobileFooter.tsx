import { Link } from 'react-router-dom';
import { Home, HelpCircle, Shield, Mail, FileText, Heart, Star, Users } from 'lucide-react';

export function MobileFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: 'Início', icon: <Home className="h-4 w-4" /> },
    { to: '/faq', label: 'FAQ', icon: <HelpCircle className="h-4 w-4" /> },
    { to: '/insurance', label: 'Seguros', icon: <Shield className="h-4 w-4" /> },
    { to: '/contato', label: 'Contato', icon: <Mail className="h-4 w-4" /> },
  ];

  const legalLinks = [
    { to: '/politica-privacidade', label: 'Política de Privacidade' },
    { to: '/termos-uso', label: 'Termos de Uso' },
  ];

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      {/* Quick Links */}
      <div className="px-4 py-6">
        <div className="mb-6 grid grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
            >
              <div className="text-primary">{link.icon}</div>
              <span className="text-sm font-medium text-gray-700">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Heart className="h-4 w-4 fill-current text-white" />
            </div>
            <span className="text-lg font-bold text-primary">Empresta aê</span>
          </div>
          <p className="text-sm text-gray-600">Compartilhe, economize e conecte-se</p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-gray-900">1000+</div>
            <div className="text-xs text-gray-600">Itens</div>
          </div>
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-gray-900">500+</div>
            <div className="text-xs text-gray-600">Usuários</div>
          </div>
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center">
              <Star className="h-4 w-4 fill-current text-amber-500" />
            </div>
            <div className="text-lg font-bold text-gray-900">4.8</div>
            <div className="text-xs text-gray-600">Avaliação</div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mb-4 flex flex-col gap-2">
          {legalLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-center text-sm text-gray-600 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500">
            © {currentYear} Empresta aê. Todos os direitos reservados.
          </p>
          <p className="mt-1 text-xs text-gray-400">Feito com ❤️ para a comunidade</p>
        </div>
      </div>
    </footer>
  );
}
