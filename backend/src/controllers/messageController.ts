import { asyncHandler } from '@/middleware/errorHandler';
import { MessageService } from '@/services/MessageService';
import { sendCreated, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';
import { z } from 'zod';

// Validation schemas
const sendMessageSchema = z.object({
  recipient_id: z.string().min(1, 'Recipient ID is required'),
  content: z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
  item_id: z.string().optional(),
  loan_id: z.string().optional(),
});

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  // Send new message
  sendMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const validatedData = sendMessageSchema.parse(req.body);

    const message = await this.messageService.sendMessage(validatedData, userId);

    sendCreated(res, message, 'Message sent successfully');
  });

  // Get message by ID
  getMessageById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const message = await this.messageService.getMessageById(id, userId);

    sendSuccess(res, message, 'Message retrieved successfully');
  });

  // Get conversation between two users
  getConversation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { otherUserId } = req.params;
    const userId = req.user?.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const messages = await this.messageService.getConversation(userId, otherUserId, limit);

    sendSuccess(res, messages, 'Conversation retrieved successfully');
  });

  // Get user conversations
  getUserConversations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const conversations = await this.messageService.getUserConversations(userId);

    sendSuccess(res, conversations, 'Conversations retrieved successfully');
  });

  // Mark conversation as read
  markConversationAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { otherUserId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const markedCount = await this.messageService.markConversationAsRead(userId, otherUserId);

    sendSuccess(res, { marked_count: markedCount }, 'Conversation marked as read');
  });

  // Mark specific message as read
  markMessageAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.messageService.markMessageAsRead(id, userId);

    sendSuccess(res, null, 'Message marked as read');
  });

  // Get unread message count
  getUnreadCount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const count = await this.messageService.getUnreadCount(userId);

    sendSuccess(res, { unread_count: count }, 'Unread count retrieved successfully');
  });

  // Search messages
  searchMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const searchTerm = req.query.q as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    if (!searchTerm) {
      throw new Error('Search term (q) is required');
    }

    const messages = await this.messageService.searchMessages(userId, searchTerm, limit);

    sendSuccess(res, messages, 'Message search completed successfully');
  });

  // Get messages by item
  getMessagesByItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { itemId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const messages = await this.messageService.getMessagesByItem(itemId, userId);

    sendSuccess(res, messages, 'Item messages retrieved successfully');
  });

  // Get messages by loan
  getMessagesByLoan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { loanId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    const messages = await this.messageService.getMessagesByLoan(loanId, userId);

    sendSuccess(res, messages, 'Loan messages retrieved successfully');
  });

  // Delete message
  deleteMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('User ID not found in request');
    }

    await this.messageService.deleteMessage(id, userId);

    sendSuccess(res, null, 'Message deleted successfully');
  });
}

// Create controller instance
const messageController = new MessageController();

// Export controller methods
export const sendMessage = messageController.sendMessage;
export const getMessageById = messageController.getMessageById;
export const getConversation = messageController.getConversation;
export const getUserConversations = messageController.getUserConversations;
export const markConversationAsRead = messageController.markConversationAsRead;
export const markMessageAsRead = messageController.markMessageAsRead;
export const getUnreadCount = messageController.getUnreadCount;
export const searchMessages = messageController.searchMessages;
export const getMessagesByItem = messageController.getMessagesByItem;
export const getMessagesByLoan = messageController.getMessagesByLoan;
export const deleteMessage = messageController.deleteMessage;
