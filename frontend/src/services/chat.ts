import { apiService } from './api/ApiService';
import type { Chat, ChatMessage, PaginatedResponse } from '@/types';

export const chatService = {
  async getChats(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Chat>> {
    return apiService.getPaginated<Chat>('/chats', params);
  },

  async getChat(id: string): Promise<Chat> {
    return apiService.get<Chat>(`/chats/${id}`);
  },

  async getChatMessages(chatId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ChatMessage>> {
    return apiService.getPaginated<ChatMessage>(`/chats/${chatId}/messages`, params);
  },

  async sendMessage(chatId: string, content: string): Promise<ChatMessage> {
    return apiService.post<ChatMessage>(`/chats/${chatId}/messages`, { content });
  },

  async createChat(itemId: string, receiverId: string): Promise<Chat> {
    return apiService.post<Chat>('/chats', { itemId, receiverId });
  },

  async markChatAsRead(chatId: string): Promise<void> {
    await apiService.patch(`/chats/${chatId}/read`);
  },

  async deleteChat(chatId: string): Promise<void> {
    await apiService.delete(`/chats/${chatId}`);
  },

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    await apiService.delete(`/chats/${chatId}/messages/${messageId}`);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return apiService.get<{ count: number }>('/chats/unread-count');
  },
};
