import { AppHeader } from '@/components/ui/app-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { typography } from '@/styles/design-system';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Image,
  Info,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
  };
  item: {
    id: string;
    title: string;
    image: string;
    price: number;
  };
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const conversations: Conversation[] = [
    {
      id: '1',
      user: {
        id: '2',
        name: 'Ana Silva',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        online: true,
      },
      item: {
        id: '1',
        title: 'Furadeira Bosch',
        image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&h=100&fit=crop',
        price: 25,
      },
      lastMessage: {
        id: '1',
        senderId: '2',
        content: 'Oi! A furadeira ainda está disponível?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        read: false,
      },
      unreadCount: 2,
      messages: [
        {
          id: '1',
          senderId: '2',
          content: 'Oi! A furadeira ainda está disponível?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false,
        },
        {
          id: '2',
          senderId: '2',
          content: 'Preciso para um projeto no fim de semana',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          read: false,
        },
      ],
    },
    {
      id: '2',
      user: {
        id: '3',
        name: 'Carlos Santos',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        online: false,
      },
      item: {
        id: '2',
        title: 'Bicicleta Mountain Bike',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
        price: 40,
      },
      lastMessage: {
        id: '3',
        senderId: '1',
        content: 'Perfeito! Combinado então para amanhã às 14h.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
        read: true,
      },
      unreadCount: 0,
      messages: [
        {
          id: '3',
          senderId: '1',
          content: 'Perfeito! Combinado então para amanhã às 14h.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true,
        },
      ],
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Aqui você implementaria o envio real da mensagem
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        showBackButton
        onBack={() => navigate(-1)}
        title="Mensagens"
        user={
          user
            ? {
                id: 'temp-id',
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : null
        }
      />

      <div className="flex h-[calc(100vh-8rem)] w-full max-w-full overflow-hidden pt-4">
        {/* Lista de Conversas */}
        <div
          className={cn(
            'flex flex-col border-r bg-muted/20',
            selectedConversation ? 'hidden md:flex md:w-80' : 'w-full md:w-80'
          )}
        >
          {/* Header */}
          <div className="border-b p-4">
            <h1 className={cn(typography.heading.h4, 'mb-4')}>Mensagens</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de Conversas */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-medium">Nenhuma conversa encontrada</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Tente buscar por outro termo' : 'Suas conversas aparecerão aqui'}
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-muted/50',
                        selectedConversation === conversation.id &&
                          'border-primary/20 bg-primary/10'
                      )}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conversation.user.avatar} />
                              <AvatarFallback>
                                {conversation.user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.user.online && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="truncate font-medium">{conversation.user.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(conversation.lastMessage.timestamp)}
                                </span>
                                {conversation.unreadCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="h-5 w-5 rounded-full p-0 text-xs"
                                  >
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="truncate text-sm text-muted-foreground">
                              {conversation.lastMessage.content}
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                              <img
                                src={conversation.item.image}
                                alt={conversation.item.title}
                                className="h-6 w-6 rounded object-cover"
                              />
                              <span className="truncate text-xs text-muted-foreground">
                                {conversation.item.title}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Área de Conversa */}
        <div className="flex flex-1 flex-col">
          {selectedConv ? (
            <>
              {/* Header da Conversa */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.user.avatar} />
                    <AvatarFallback>
                      {selectedConv.user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-medium">{selectedConv.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConv.user.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Item em Discussão */}
              <div className="border-b bg-muted/20 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedConv.item.image}
                    alt={selectedConv.item.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{selectedConv.item.title}</h4>
                    <p className="text-sm font-medium text-primary">
                      R$ {selectedConv.item.price}/dia
                    </p>
                  </div>
                  <Button size="sm">Ver Item</Button>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {selectedConv.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.senderId === '1' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-xs rounded-lg px-3 py-2',
                          message.senderId === '1'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={cn(
                            'mt-1 text-xs',
                            message.senderId === '1'
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground'
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input de Mensagem */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>

                  <div className="flex flex-1 gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Selecione uma conversa</h3>
                <p className="text-muted-foreground">
                  Escolha uma conversa da lista para começar a conversar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
