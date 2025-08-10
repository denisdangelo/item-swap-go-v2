import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Send,
  Camera,
  User,
  MapPin,
  Clock,
  Shield,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  FileText,
  Star,
  Phone,
  MoreVertical,
} from 'lucide-react';
import { ItemWithDetails } from '@/types';

interface MessageAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

interface Message {
  id: number;
  sender: 'me' | 'other' | 'system';
  text: string;
  time: string;
  avatar?: string;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'action' | 'info';
  actions?: MessageAction[];
}

interface ChatScreenProps {
  item: ItemWithDetails;
  onBack: () => void;
}

const getPeriodLabel = (period?: string) => {
  const labels: Record<string, string> = {
    hora: 'hora',
    dia: 'dia',
    semana: 'semana',
    mes: 'mês',
  };

  return labels[period || 'dia'] || period;
};

const ChatScreen = ({ item, onBack }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mensagens automáticas variadas para simular conversa real
  const automaticResponses = [
    'Oi! Tudo bem? 😊',
    'Que legal que você se interessou!',
    'Posso te ajudar com qualquer dúvida',
    'O item está em ótimo estado',
    'Quando você gostaria de ver?',
    'Fico à disposição para mais informações',
    'Tem alguma pergunta específica?',
    'Posso mandar mais fotos se quiser',
    'O preço é negociável 💰',
    'Estou online agora se quiser conversar',
  ];

  const scrollToTop = () => {
    scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll para o topo quando o componente é montado
  useEffect(() => {
    setTimeout(() => {
      scrollToTop();
    }, 100);
  }, []);

  useEffect(() => {
    // Mensagens iniciais do chat com português correto
    const initialMessages: Message[] = [
      {
        id: 1,
        sender: 'other',
        text: `Olá! 👋 Você tem interesse no ${item.title}? Posso te ajudar com todas as informações sobre o aluguel!`,
        time: '09:15',
        avatar: item.owner?.avatar,
        status: 'read',
        type: 'text',
      },
      {
        id: 2,
        sender: 'other',
        text: 'O item está disponível e em perfeito estado de conservação ✨',
        time: '09:16',
        avatar: item.owner?.avatar,
        status: 'read',
        type: 'text',
      },
      {
        id: 3,
        sender: 'system',
        text: 'Informações principais do item:',
        time: '09:17',
        type: 'info',
        actions: [
          {
            id: 'price',
            label: `R$ ${item.price.toFixed(2)}/${getPeriodLabel(item.period)}`,
            type: 'secondary',
            icon: <DollarSign className="h-4 w-4" />,
          },
          {
            id: 'availability',
            label: 'Disponível agora',
            type: 'secondary',
            icon: <CheckCircle2 className="h-4 w-4" />,
          },
          {
            id: 'location',
            label: 'Ver localização',
            type: 'secondary',
            icon: <MapPin className="h-4 w-4" />,
          },
        ],
      },
      {
        id: 4,
        sender: 'other',
        text: 'Qualquer dúvida, é só perguntar! Estou aqui para ajudar 😊',
        time: '09:18',
        avatar: item.owner?.avatar,
        status: 'read',
        type: 'text',
      },
    ];

    setMessages(initialMessages);
  }, [item]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        sender: 'me',
        text: newMessage,
        time: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'sent',
        type: 'text',
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage('');

      // Mostrar indicador de digitação
      setIsTyping(true);

      // Simular resposta automática variada
      setTimeout(
        () => {
          setIsTyping(false);
          const randomResponse =
            automaticResponses[Math.floor(Math.random() * automaticResponses.length)];

          const response: Message = {
            id: Date.now() + 1,
            sender: 'other',
            text: randomResponse,
            time: new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            avatar: item.owner?.avatar,
            status: 'delivered',
            type: 'text',
          };
          setMessages((prev) => [...prev, response]);

          // Scroll para a nova mensagem
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        },
        1500 + Math.random() * 1000
      ); // Tempo variável para parecer mais natural
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Componente para indicador de digitação
  const TypingIndicator = () => (
    <div className="mb-4 flex justify-start">
      <div className="flex max-w-[70%] gap-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={item.owner?.avatar} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <div className="rounded-lg bg-muted px-4 py-3">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
            </div>
          </div>
          <span className="mt-1 text-xs text-muted-foreground">digitando...</span>
        </div>
      </div>
    </div>
  );

  const renderMessage = (message: Message) => {
    const isMe = message.sender === 'me';
    const isSystem = message.sender === 'system';

    if (isSystem) {
      return (
        <div key={message.id} className="mb-6 flex justify-center">
          <Card className="max-w-sm border-dashed bg-muted/50 p-4 text-center shadow-none">
            <p className="fluid-caption mb-3 text-muted-foreground">{message.text}</p>
            {message.actions && (
              <div className="flex flex-wrap justify-center gap-2">
                {message.actions.map((action) => (
                  <Badge
                    key={action.id}
                    variant={action.type === 'primary' ? 'default' : 'secondary'}
                    className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 transition-all hover:scale-105 hover:shadow-sm"
                  >
                    {action.icon}
                    <span className="fluid-caption">{action.label}</span>
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        </div>
      );
    }

    return (
      <div key={message.id} className={cn('mb-4 flex', isMe ? 'justify-end' : 'justify-start')}>
        <div className={cn('flex max-w-[75%] gap-3', isMe ? 'flex-row-reverse' : 'flex-row')}>
          {!isMe && (
            <Avatar className="h-8 w-8 flex-shrink-0 shadow-sm ring-2 ring-background">
              <AvatarImage src={message.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          )}

          <div className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
            <div
              className={cn(
                'break-words rounded-2xl px-4 py-2.5 shadow-sm transition-all',
                isMe
                  ? 'bg-primary text-primary-foreground shadow-primary/20'
                  : 'border bg-card shadow-sm'
              )}
            >
              <p className="fluid-body text-mobile-optimized leading-relaxed">{message.text}</p>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="fluid-caption text-muted-foreground">{message.time}</span>
              {isMe && message.status && (
                <div className="flex items-center">
                  {message.status === 'sent' && (
                    <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                  )}
                  {message.status === 'delivered' && (
                    <div className="flex">
                      <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                      <CheckCircle2 className="-ml-1 h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                  {message.status === 'read' && (
                    <div className="flex">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      <CheckCircle2 className="-ml-1 h-3 w-3 text-primary" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-card/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <Button
          variant="ghost"
          size={isMobile ? 'mobile-icon' : 'icon'}
          onClick={onBack}
          className="flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10 shadow-sm ring-2 ring-background">
          <AvatarImage src={item.owner?.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="fluid-body text-spacing-tight truncate font-semibold">
            {item.owner?.name || 'Proprietário'}
          </h3>
          <p className="fluid-caption truncate text-muted-foreground">{item.title}</p>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size={isMobile ? 'mobile-icon' : 'icon'}>
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ligar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size={isMobile ? 'mobile-icon' : 'icon'}>
                  <Camera className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Enviar foto</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size={isMobile ? 'mobile-icon' : 'icon'}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mais opções</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map(renderMessage)}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="fluid-body min-h-[44px] resize-none rounded-2xl border-2 px-4 py-3 focus:border-primary"
              disabled={isTyping}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            size={isMobile ? 'mobile-icon' : 'icon'}
            className="h-[44px] w-[44px] rounded-full shadow-md transition-all hover:scale-105 disabled:scale-100"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
