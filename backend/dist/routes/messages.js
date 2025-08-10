"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageController_1 = require("@/controllers/messageController");
const auth_1 = require("@/middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
// All message routes require authentication
router.use(auth_1.authenticate);
// Message operations
router.post('/', messageController_1.sendMessage);
router.get('/:id', messageController_1.getMessageById);
router.delete('/:id', messageController_1.deleteMessage);
// Conversation operations
router.get('/conversations/all', messageController_1.getUserConversations);
router.get('/conversations/:otherUserId', messageController_1.getConversation);
router.patch('/conversations/:otherUserId/read', messageController_1.markConversationAsRead);
// Message status operations
router.patch('/:id/read', messageController_1.markMessageAsRead);
router.get('/unread/count', messageController_1.getUnreadCount);
// Search and filter operations
router.get('/search/all', messageController_1.searchMessages);
router.get('/item/:itemId', messageController_1.getMessagesByItem);
router.get('/loan/:loanId', messageController_1.getMessagesByLoan);
exports.default = router;
