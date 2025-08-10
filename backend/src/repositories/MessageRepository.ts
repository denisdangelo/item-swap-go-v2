import { executeQuery } from '@/config/database';
import { Conversation, CreateMessageData, Message, MessageWithDetails } from '@/models/Message';
import { BaseRepository } from './BaseRepository';

export class MessageRepository extends BaseRepository<Message, CreateMessageData, never> {
  protected tableName = 'messages';
  protected selectFields = `
    id, sender_id, recipient_id, item_id, loan_id, content, is_read, created_at, updated_at
  `;

  // Create message with sender_id
  async create(data: CreateMessageData, senderId: string): Promise<Message> {
    const messageData = { ...data, sender_id: senderId };
    return super.create(messageData as any);
  }

  // Get message with full details
  async findWithDetails(id: string): Promise<MessageWithDetails | null> {
    const query = `
      SELECT 
        m.id, m.sender_id, m.recipient_id, m.item_id, m.loan_id, m.content, m.is_read,
        m.created_at, m.updated_at,
        
        sender.first_name as sender_first_name, sender.last_name as sender_last_name,
        sender.avatar_url as sender_avatar_url,
        
        recipient.first_name as recipient_first_name, recipient.last_name as recipient_last_name,
        recipient.avatar_url as recipient_avatar_url,
        
        i.id as item_id, i.title as item_title,
        
        l.id as loan_id, l.status as loan_status
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      LEFT JOIN items i ON m.item_id = i.id
      LEFT JOIN loans l ON m.loan_id = l.id
      WHERE m.id = ?
    `;

    const rows = await executeQuery<any[]>(query, [id]);
    if (rows.length === 0) return null;

    const row = rows[0];

    return {
      id: row.id,
      sender_id: row.sender_id,
      recipient_id: row.recipient_id,
      item_id: row.item_id,
      loan_id: row.loan_id,
      content: row.content,
      is_read: row.is_read,
      created_at: row.created_at,
      updated_at: row.updated_at,
      sender: {
        id: row.sender_id,
        first_name: row.sender_first_name,
        last_name: row.sender_last_name,
        avatar_url: row.sender_avatar_url,
      },
      recipient: {
        id: row.recipient_id,
        first_name: row.recipient_first_name,
        last_name: row.recipient_last_name,
        avatar_url: row.recipient_avatar_url,
      },
      item: row.item_id
        ? {
            id: row.item_id,
            title: row.item_title,
          }
        : undefined,
      loan: row.loan_id
        ? {
            id: row.loan_id,
            status: row.loan_status,
          }
        : undefined,
    };
  }

  // Get conversation between two users
  async getConversation(
    userId1: string,
    userId2: string,
    limit: number = 50
  ): Promise<MessageWithDetails[]> {
    const query = `
      SELECT 
        m.id, m.sender_id, m.recipient_id, m.item_id, m.loan_id, m.content, m.is_read,
        m.created_at, m.updated_at,
        
        sender.first_name as sender_first_name, sender.last_name as sender_last_name,
        sender.avatar_url as sender_avatar_url,
        
        recipient.first_name as recipient_first_name, recipient.last_name as recipient_last_name,
        recipient.avatar_url as recipient_avatar_url,
        
        i.id as item_id, i.title as item_title,
        
        l.id as loan_id, l.status as loan_status
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      LEFT JOIN items i ON m.item_id = i.id
      LEFT JOIN loans l ON m.loan_id = l.id
      WHERE (m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?)
      ORDER BY m.created_at DESC
      LIMIT ?
    `;

    const rows = await executeQuery<any[]>(query, [userId1, userId2, userId2, userId1, limit]);

    return rows
      .map((row) => ({
        id: row.id,
        sender_id: row.sender_id,
        recipient_id: row.recipient_id,
        item_id: row.item_id,
        loan_id: row.loan_id,
        content: row.content,
        is_read: row.is_read,
        created_at: row.created_at,
        updated_at: row.updated_at,
        sender: {
          id: row.sender_id,
          first_name: row.sender_first_name,
          last_name: row.sender_last_name,
          avatar_url: row.sender_avatar_url,
        },
        recipient: {
          id: row.recipient_id,
          first_name: row.recipient_first_name,
          last_name: row.recipient_last_name,
          avatar_url: row.recipient_avatar_url,
        },
        item: row.item_id
          ? {
              id: row.item_id,
              title: row.item_title,
            }
          : undefined,
        loan: row.loan_id
          ? {
              id: row.loan_id,
              status: row.loan_status,
            }
          : undefined,
      }))
      .reverse(); // Reverse to show oldest first
  }

  // Get user conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    const query = `
      SELECT DISTINCT
        CASE 
          WHEN m.sender_id = ? THEN m.recipient_id 
          ELSE m.sender_id 
        END as participant_id,
        
        participant.first_name as participant_first_name,
        participant.last_name as participant_last_name,
        participant.avatar_url as participant_avatar_url,
        
        last_msg.content as last_message_content,
        last_msg.created_at as last_message_created_at,
        last_msg.is_read as last_message_is_read,
        last_msg.sender_id as last_message_sender_id,
        
        unread_count.count as unread_count
      FROM messages m
      JOIN users participant ON (
        (m.sender_id = ? AND participant.id = m.recipient_id) OR
        (m.recipient_id = ? AND participant.id = m.sender_id)
      )
      JOIN (
        SELECT 
          CASE 
            WHEN sender_id = ? THEN recipient_id 
            ELSE sender_id 
          END as other_user_id,
          content,
          created_at,
          is_read,
          sender_id,
          ROW_NUMBER() OVER (
            PARTITION BY CASE 
              WHEN sender_id = ? THEN recipient_id 
              ELSE sender_id 
            END 
            ORDER BY created_at DESC
          ) as rn
        FROM messages
        WHERE sender_id = ? OR recipient_id = ?
      ) last_msg ON last_msg.other_user_id = participant.id AND last_msg.rn = 1
      LEFT JOIN (
        SELECT 
          sender_id,
          COUNT(*) as count
        FROM messages
        WHERE recipient_id = ? AND is_read = false
        GROUP BY sender_id
      ) unread_count ON unread_count.sender_id = participant.id
      WHERE m.sender_id = ? OR m.recipient_id = ?
      ORDER BY last_msg.created_at DESC
    `;

    const rows = await executeQuery<any[]>(query, [
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
      userId,
    ]);

    return rows.map((row) => ({
      participant: {
        id: row.participant_id,
        first_name: row.participant_first_name,
        last_name: row.participant_last_name,
        avatar_url: row.participant_avatar_url,
      },
      last_message: {
        content: row.last_message_content,
        created_at: row.last_message_created_at,
        is_read: row.last_message_is_read,
        sender_id: row.last_message_sender_id,
      },
      unread_count: row.unread_count || 0,
    }));
  }

  // Mark messages as read
  async markAsRead(senderId: string, recipientId: string): Promise<number> {
    const query =
      'UPDATE messages SET is_read = true WHERE sender_id = ? AND recipient_id = ? AND is_read = false';
    const result = await executeQuery<any>(query, [senderId, recipientId]);
    return result.affectedRows;
  }

  // Mark specific message as read
  async markMessageAsRead(messageId: string): Promise<boolean> {
    const query = 'UPDATE messages SET is_read = true WHERE id = ?';
    const result = await executeQuery<any>(query, [messageId]);
    return result.affectedRows > 0;
  }

  // Get unread message count for user
  async getUnreadCount(userId: string): Promise<number> {
    const query =
      'SELECT COUNT(*) as count FROM messages WHERE recipient_id = ? AND is_read = false';
    const result = await executeQuery<Array<{ count: number }>>(query, [userId]);
    return result[0].count;
  }

  // Find messages by sender
  async findBySender(senderId: string): Promise<Message[]> {
    return this.findAll({ sender_id: senderId });
  }

  // Find messages by recipient
  async findByRecipient(recipientId: string): Promise<Message[]> {
    return this.findAll({ recipient_id: recipientId });
  }

  // Find messages by item
  async findByItem(itemId: string): Promise<Message[]> {
    return this.findAll({ item_id: itemId });
  }

  // Find messages by loan
  async findByLoan(loanId: string): Promise<Message[]> {
    return this.findAll({ loan_id: loanId });
  }

  // Search messages by content
  async searchMessages(
    userId: string,
    searchTerm: string,
    limit: number = 20
  ): Promise<MessageWithDetails[]> {
    const query = `
      SELECT 
        m.id, m.sender_id, m.recipient_id, m.item_id, m.loan_id, m.content, m.is_read,
        m.created_at, m.updated_at,
        
        sender.first_name as sender_first_name, sender.last_name as sender_last_name,
        sender.avatar_url as sender_avatar_url,
        
        recipient.first_name as recipient_first_name, recipient.last_name as recipient_last_name,
        recipient.avatar_url as recipient_avatar_url,
        
        i.id as item_id, i.title as item_title,
        
        l.id as loan_id, l.status as loan_status
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users recipient ON m.recipient_id = recipient.id
      LEFT JOIN items i ON m.item_id = i.id
      LEFT JOIN loans l ON m.loan_id = l.id
      WHERE (m.sender_id = ? OR m.recipient_id = ?) 
        AND m.content LIKE ?
      ORDER BY m.created_at DESC
      LIMIT ?
    `;

    const searchPattern = `%${searchTerm}%`;
    const rows = await executeQuery<any[]>(query, [userId, userId, searchPattern, limit]);

    return rows.map((row) => ({
      id: row.id,
      sender_id: row.sender_id,
      recipient_id: row.recipient_id,
      item_id: row.item_id,
      loan_id: row.loan_id,
      content: row.content,
      is_read: row.is_read,
      created_at: row.created_at,
      updated_at: row.updated_at,
      sender: {
        id: row.sender_id,
        first_name: row.sender_first_name,
        last_name: row.sender_last_name,
        avatar_url: row.sender_avatar_url,
      },
      recipient: {
        id: row.recipient_id,
        first_name: row.recipient_first_name,
        last_name: row.recipient_last_name,
        avatar_url: row.recipient_avatar_url,
      },
      item: row.item_id
        ? {
            id: row.item_id,
            title: row.item_title,
          }
        : undefined,
      loan: row.loan_id
        ? {
            id: row.loan_id,
            status: row.loan_status,
          }
        : undefined,
    }));
  }
}
