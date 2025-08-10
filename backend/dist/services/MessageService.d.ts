import { Conversation, CreateMessageData, Message, MessageWithDetails } from '@/models/Message';
export declare class MessageService {
    private messageRepository;
    private userRepository;
    private itemRepository;
    private loanRepository;
    constructor();
    sendMessage(messageData: CreateMessageData, senderId: string): Promise<MessageWithDetails>;
    getMessageById(id: string, userId: string): Promise<MessageWithDetails>;
    getConversation(userId: string, otherUserId: string, limit?: number): Promise<MessageWithDetails[]>;
    getUserConversations(userId: string): Promise<Conversation[]>;
    markConversationAsRead(userId: string, otherUserId: string): Promise<number>;
    markMessageAsRead(messageId: string, userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    searchMessages(userId: string, searchTerm: string, limit?: number): Promise<MessageWithDetails[]>;
    getMessagesByItem(itemId: string, userId: string): Promise<Message[]>;
    getMessagesByLoan(loanId: string, userId: string): Promise<Message[]>;
    deleteMessage(messageId: string, userId: string): Promise<void>;
    private validateMessageData;
}
