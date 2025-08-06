import {
  deleteMessage,
  getConversation,
  getMessageById,
  getMessagesByItem,
  getMessagesByLoan,
  getUnreadCount,
  getUserConversations,
  markConversationAsRead,
  markMessageAsRead,
  searchMessages,
  sendMessage,
} from '@/controllers/messageController';
import { authenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// All message routes require authentication
router.use(authenticate);

// Message operations
router.post('/', sendMessage);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

// Conversation operations
router.get('/conversations/all', getUserConversations);
router.get('/conversations/:otherUserId', getConversation);
router.patch('/conversations/:otherUserId/read', markConversationAsRead);

// Message status operations
router.patch('/:id/read', markMessageAsRead);
router.get('/unread/count', getUnreadCount);

// Search and filter operations
router.get('/search/all', searchMessages);
router.get('/item/:itemId', getMessagesByItem);
router.get('/loan/:loanId', getMessagesByLoan);

export default router;
