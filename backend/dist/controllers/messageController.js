"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getMessagesByLoan = exports.getMessagesByItem = exports.searchMessages = exports.getUnreadCount = exports.markMessageAsRead = exports.markConversationAsRead = exports.getUserConversations = exports.getConversation = exports.getMessageById = exports.sendMessage = exports.MessageController = void 0;
const errorHandler_1 = require("@/middleware/errorHandler");
const MessageService_1 = require("@/services/MessageService");
const response_1 = require("@/utils/response");
const zod_1 = require("zod");
// Validation schemas
const sendMessageSchema = zod_1.z.object({
    recipient_id: zod_1.z.string().min(1, 'Recipient ID is required'),
    content: zod_1.z.string().min(1, 'Message content is required').max(1000, 'Message too long'),
    item_id: zod_1.z.string().optional(),
    loan_id: zod_1.z.string().optional(),
});
class MessageController {
    constructor() {
        // Send new message
        this.sendMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const validatedData = sendMessageSchema.parse(req.body);
            const message = await this.messageService.sendMessage(validatedData, userId);
            (0, response_1.sendCreated)(res, message, 'Message sent successfully');
        });
        // Get message by ID
        this.getMessageById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const message = await this.messageService.getMessageById(id, userId);
            (0, response_1.sendSuccess)(res, message, 'Message retrieved successfully');
        });
        // Get conversation between two users
        this.getConversation = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { otherUserId } = req.params;
            const userId = req.user?.userId;
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const messages = await this.messageService.getConversation(userId, otherUserId, limit);
            (0, response_1.sendSuccess)(res, messages, 'Conversation retrieved successfully');
        });
        // Get user conversations
        this.getUserConversations = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const conversations = await this.messageService.getUserConversations(userId);
            (0, response_1.sendSuccess)(res, conversations, 'Conversations retrieved successfully');
        });
        // Mark conversation as read
        this.markConversationAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { otherUserId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const markedCount = await this.messageService.markConversationAsRead(userId, otherUserId);
            (0, response_1.sendSuccess)(res, { marked_count: markedCount }, 'Conversation marked as read');
        });
        // Mark specific message as read
        this.markMessageAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.messageService.markMessageAsRead(id, userId);
            (0, response_1.sendSuccess)(res, null, 'Message marked as read');
        });
        // Get unread message count
        this.getUnreadCount = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const count = await this.messageService.getUnreadCount(userId);
            (0, response_1.sendSuccess)(res, { unread_count: count }, 'Unread count retrieved successfully');
        });
        // Search messages
        this.searchMessages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.user?.userId;
            const searchTerm = req.query.q;
            const limit = req.query.limit ? parseInt(req.query.limit) : 20;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            if (!searchTerm) {
                throw new Error('Search term (q) is required');
            }
            const messages = await this.messageService.searchMessages(userId, searchTerm, limit);
            (0, response_1.sendSuccess)(res, messages, 'Message search completed successfully');
        });
        // Get messages by item
        this.getMessagesByItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { itemId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const messages = await this.messageService.getMessagesByItem(itemId, userId);
            (0, response_1.sendSuccess)(res, messages, 'Item messages retrieved successfully');
        });
        // Get messages by loan
        this.getMessagesByLoan = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { loanId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            const messages = await this.messageService.getMessagesByLoan(loanId, userId);
            (0, response_1.sendSuccess)(res, messages, 'Loan messages retrieved successfully');
        });
        // Delete message
        this.deleteMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in request');
            }
            await this.messageService.deleteMessage(id, userId);
            (0, response_1.sendSuccess)(res, null, 'Message deleted successfully');
        });
        this.messageService = new MessageService_1.MessageService();
    }
}
exports.MessageController = MessageController;
// Create controller instance
const messageController = new MessageController();
// Export controller methods
exports.sendMessage = messageController.sendMessage;
exports.getMessageById = messageController.getMessageById;
exports.getConversation = messageController.getConversation;
exports.getUserConversations = messageController.getUserConversations;
exports.markConversationAsRead = messageController.markConversationAsRead;
exports.markMessageAsRead = messageController.markMessageAsRead;
exports.getUnreadCount = messageController.getUnreadCount;
exports.searchMessages = messageController.searchMessages;
exports.getMessagesByItem = messageController.getMessagesByItem;
exports.getMessagesByLoan = messageController.getMessagesByLoan;
exports.deleteMessage = messageController.deleteMessage;
