import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock4,
  Command,
  CreditCard,
  File,
  FileText,
  Filter,
  Grid,
  Handshake,
  Heart,
  HelpCircle,
  Image,
  Laptop,
  List,
  Loader2,
  Map,
  MapPin,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Phone,
  Pizza,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Share,
  SlidersHorizontal,
  SunMedium,
  Tag,
  Trash,
  Twitter,
  User,
  X,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface IconProps extends LucideProps {
  className?: string;
}

const createIcon = (Icon: LucideIcon) => {
  return ({ className, ...props }: IconProps) => (
    <Icon className={cn('h-4 w-4', className)} {...props} />
  );
};

export type Icon = LucideIcon;

// Logo personalizado para o app "Empresta aê" usando Handshake
const AppLogo = ({ className, ...props }: IconProps) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('h-8 w-8', className)}
    {...props}
  >
    {/* Círculo de fundo */}
    <circle cx="24" cy="24" r="22" fill="#3B82F6" />

    {/* Mão esquerda */}
    <path
      d="M16 28C16 28 18 26 20 26C22 26 24 28 24 30C24 32 22 34 20 34C18 34 16 32 16 30V28Z"
      fill="white"
    />
    <path
      d="M16 30C16 30 17 32 19 32C21 32 22 30 22 28C22 26 21 24 19 24C17 24 16 26 16 28V30Z"
      fill="white"
    />

    {/* Mão direita */}
    <path
      d="M32 28C32 28 30 26 28 26C26 26 24 28 24 30C24 32 26 34 28 34C30 34 32 32 32 30V28Z"
      fill="white"
    />
    <path
      d="M32 30C32 30 31 32 29 32C27 32 26 30 26 28C26 26 27 24 29 24C31 24 32 26 32 28V30Z"
      fill="white"
    />

    {/* Aperto de mãos - área central */}
    <path
      d="M22 28C22 28 23 29 24 29C25 29 26 28 26 28C26 28 25 27 24 27C23 27 22 28 22 28Z"
      fill="white"
    />
  </svg>
);

export const Icons = {
  alertCircle: createIcon(AlertCircle),
  arrowLeft: createIcon(ArrowLeft),
  arrowRight: createIcon(ArrowRight),
  calendar: createIcon(Calendar),
  camera: createIcon(Camera),
  check: createIcon(Check),
  checkCircle: createIcon(CheckCircle2),
  chevronDown: createIcon(ChevronDown),
  chevronLeft: createIcon(ChevronLeft),
  chevronRight: createIcon(ChevronRight),
  chevronUp: createIcon(ChevronUp),
  clock: createIcon(Clock4),
  close: createIcon(X),
  command: Command,
  creditCard: createIcon(CreditCard),
  ellipsis: createIcon(MoreVertical),
  file: createIcon(File),
  fileText: createIcon(FileText),
  filter: createIcon(Filter),
  grid: createIcon(Grid),
  handshake: createIcon(Handshake),
  heart: createIcon(Heart),
  help: createIcon(HelpCircle),
  image: createIcon(Image),
  laptop: createIcon(Laptop),
  list: createIcon(List),
  loader: createIcon(Loader2),
  logo: AppLogo,
  map: createIcon(Map),
  mapPin: createIcon(MapPin),
  media: createIcon(Image),
  moreHorizontal: createIcon(MoreHorizontal),
  moreVertical: createIcon(MoreVertical),
  moon: createIcon(Moon),
  page: createIcon(File),
  phone: createIcon(Phone),
  plus: createIcon(Plus),
  post: createIcon(FileText),
  pizza: createIcon(Pizza),
  refresh: createIcon(RefreshCw),
  search: createIcon(Search),
  settings: createIcon(Settings),
  share: createIcon(Share),
  sliders: createIcon(SlidersHorizontal),
  spinner: createIcon(Loader2),
  sun: createIcon(SunMedium),
  tag: createIcon(Tag),
  trash: createIcon(Trash),
  twitter: createIcon(Twitter),
  user: createIcon(User),
  x: createIcon(X),
  billing: createIcon(CreditCard),
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
};
