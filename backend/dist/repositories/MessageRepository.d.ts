import { Conversation, CreateMessageData, Message, MessageWithDetails } from '@/models/Message';
import { BaseRepository } from './BaseRepository';
export declare class MessageRepository extends BaseRepository<Message, CreateMessageData, never> {
    protected tableName: string;
    protected selectFields: string;
    create(data: CreateMessageData, senderId: string): Promise<Message>;
    findWithDetails(id: string): Promise<MessageWithDetails | null>;
    getConversation(userId1: string, userId2: string, limit?: number): Promise<MessageWithDetails[]>;
    getUserConversations(userId: string): Promise<Conversation[]>;
    markAsRead(senderId: string, recipientId: string): Promise<number>;
    markMessageAsRead(messageId: string): Promise<boolean>;
    getUnreadCount(userId: string): Promise<number>;
    findBySender(senderId: string): Promise<Message[]>;
    findByRecipient(recipientId: string): Promise<Message[]>;
    findByItem(itemId: string): Promise<Message[]>;
    findByLoan(loanId: string): Promise<Message[]>;
    searchMessages(userId: string, searchTerm: string, limit?: number): Promise<MessageWithDetails[]>;
}
