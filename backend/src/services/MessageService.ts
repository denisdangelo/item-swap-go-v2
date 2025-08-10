import { AuthorizationError, NotFoundError, ValidationError } from '@/middleware/errorHandler';
import { Conversation, CreateMessageData, Message, MessageWithDetails } from '@/models/Message';
import { ItemRepository } from '@/repositories/ItemRepository';
import { LoanRepository } from '@/repositories/LoanRepository';
import { MessageRepository } from '@/repositories/MessageRepository';
import { UserRepository } from '@/repositories/UserRepository';

export class MessageService {
  private messageRepository: MessageRepository;
  private userRepository: UserRepository;
  private itemRepository: ItemRepository;
  private loanRepository: LoanRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.userRepository = new UserRepository();
    this.itemRepository = new ItemRepository();
    this.loanRepository = new LoanRepository();
  }

  // Send new message
  async sendMessage(messageData: CreateMessageData, senderId: string): Promise<MessageWithDetails> {
    // Validate message data
    await this.validateMessageData(messageData, senderId);

    // Check if recipient exists
    const recipient = await this.userRepository.findById(messageData.recipient_id);
    if (!recipient) {
      throw new NotFoundError('Recipient not found');
    }

    // Check if sender is not the same as recipient
    if (senderId === messageData.recipient_id) {
      throw new ValidationError('Cannot send message to yourself');
    }

    // Validate item if provided
    if (messageData.item_id) {
      const item = await this.itemRepository.findById(messageData.item_id);
      if (!item) {
        throw new NotFoundError('Item not found');
      }
    }

    // Validate loan if provided
    if (messageData.loan_id) {
      const loan = await this.loanRepository.findById(messageData.loan_id);
      if (!loan) {
        throw new NotFoundError('Loan not found');
      }

      // Check if sender is part of the loan
      if (loan.borrower_id !== senderId && loan.lender_id !== senderId) {
        throw new AuthorizationError('You can only send messages related to your loans');
      }

      // Check if recipient is the other party in the loan
      const expectedRecipientId = loan.borrower_id === senderId ? loan.lender_id : loan.borrower_id;
      if (messageData.recipient_id !== expectedRecipientId) {
        throw new ValidationError('Message recipient must be the other party in the loan');
      }
    }

    // Create message
    const message = await this.messageRepository.create(messageData, senderId);

    // Return message with details
    const messageWithDetails = await this.messageRepository.findWithDetails(message.id);
    if (!messageWithDetails) {
      throw new Error('Failed to retrieve created message');
    }

    return messageWithDetails;
  }

  // Get message by ID
  async getMessageById(id: string, userId: string): Promise<MessageWithDetails> {
    const message = await this.messageRepository.findWithDetails(id);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // Check if user is part of the conversation
    if (message.sender_id !== userId && message.recipient_id !== userId) {
      throw new AuthorizationError('You can only view messages you are part of');
    }

    return message;
  }

  // Get conversation between two users
  async getConversation(
    userId: string,
    otherUserId: string,
    limit: number = 50
  ): Promise<MessageWithDetails[]> {
    // Check if other user exists
    const otherUser = await this.userRepository.findById(otherUserId);
    if (!otherUser) {
      throw new NotFoundError('User not found');
    }

    if (limit < 1 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    const messages = await this.messageRepository.getConversation(userId, otherUserId, limit);

    // Mark messages from other user as read
    await this.messageRepository.markAsRead(otherUserId, userId);

    return messages;
  }

  // Get user conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.messageRepository.getUserConversations(userId);
  }

  // Mark conversation as read
  async markConversationAsRead(userId: string, otherUserId: string): Promise<number> {
    // Check if other user exists
    const otherUser = await this.userRepository.findById(otherUserId);
    if (!otherUser) {
      throw new NotFoundError('User not found');
    }

    return this.messageRepository.markAsRead(otherUserId, userId);
  }

  // Mark specific message as read
  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    // Get message to check authorization
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // Check if user is the recipient
    if (message.recipient_id !== userId) {
      throw new AuthorizationError('You can only mark messages sent to you as read');
    }

    const success = await this.messageRepository.markMessageAsRead(messageId);
    if (!success) {
      throw new Error('Failed to mark message as read');
    }
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.getUnreadCount(userId);
  }

  // Search messages
  async searchMessages(
    userId: string,
    searchTerm: string,
    limit: number = 20
  ): Promise<MessageWithDetails[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new ValidationError('Search term is required');
    }

    if (searchTerm.trim().length < 2) {
      throw new ValidationError('Search term must be at least 2 characters');
    }

    if (limit < 1 || limit > 50) {
      throw new ValidationError('Limit must be between 1 and 50');
    }

    return this.messageRepository.searchMessages(userId, searchTerm.trim(), limit);
  }

  // Get messages by item
  async getMessagesByItem(itemId: string, userId: string): Promise<Message[]> {
    // Check if item exists
    const item = await this.itemRepository.findById(itemId);
    if (!item) {
      throw new NotFoundError('Item not found');
    }

    // Check if user is the owner or has interacted with the item
    const messages = await this.messageRepository.findByItem(itemId);

    // Filter messages to only show those the user is part of
    return messages.filter(
      (message) => message.sender_id === userId || message.recipient_id === userId
    );
  }

  // Get messages by loan
  async getMessagesByLoan(loanId: string, userId: string): Promise<Message[]> {
    // Check if loan exists
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    // Check if user is part of the loan
    if (loan.borrower_id !== userId && loan.lender_id !== userId) {
      throw new AuthorizationError('You can only view messages for your loans');
    }

    return this.messageRepository.findByLoan(loanId);
  }

  // Delete message
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    // Get message to check authorization
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message not found');
    }

    // Check if user is the sender
    if (message.sender_id !== userId) {
      throw new AuthorizationError('You can only delete messages you sent');
    }

    // Note: In a real implementation, you might want to implement soft delete
    // or only allow deletion within a certain time frame
    const success = await this.messageRepository.delete(messageId);
    if (!success) {
      throw new Error('Failed to delete message');
    }
  }

  // Validate message data
  private async validateMessageData(data: CreateMessageData, senderId: string): Promise<void> {
    // Validate content
    if (!data.content || data.content.trim().length === 0) {
      throw new ValidationError('Message content is required');
    }

    if (data.content.trim().length > 1000) {
      throw new ValidationError('Message content cannot exceed 1000 characters');
    }

    // Basic content validation (no spam, etc.)
    const content = data.content.toLowerCase();
    const spamWords = ['spam', 'scam', 'fake'];

    for (const word of spamWords) {
      if (content.includes(word)) {
        throw new ValidationError('Message contains inappropriate content');
      }
    }

    // Validate recipient exists
    if (!data.recipient_id) {
      throw new ValidationError('Recipient ID is required');
    }

    // Check rate limiting (simplified - in production, use Redis)
    const recentMessages = await this.messageRepository.findBySender(senderId);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentCount = recentMessages.filter(
      (msg) => new Date(msg.created_at) > fiveMinutesAgo
    ).length;

    if (recentCount > 10) {
      throw new ValidationError(
        'Too many messages sent recently. Please wait before sending more.'
      );
    }
  }
}
