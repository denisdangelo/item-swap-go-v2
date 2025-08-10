"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const itemController_1 = require("@/controllers/itemController");
const auth_1 = require("@/middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Public routes
router.get('/search', auth_1.optionalAuthenticate, itemController_1.searchItems);
router.get('/nearby', itemController_1.getNearbyItems);
router.get('/category/:categoryId', itemController_1.getItemsByCategory);
router.get('/:id', auth_1.optionalAuthenticate, itemController_1.getItemById);
router.get('/:id/images', itemController_1.getItemImages);
// Simplify: allow creating without auth for demo
router.post('/', itemController_1.createItem);
router.put('/:id', auth_1.authenticate, itemController_1.updateItem);
router.delete('/:id', auth_1.authenticate, itemController_1.deleteItem);
router.patch('/:id/availability', auth_1.authenticate, itemController_1.setItemAvailability);
router.post('/:id/images', auth_1.authenticate, itemController_1.addItemImage);
router.delete('/images/:imageId', auth_1.authenticate, itemController_1.removeItemImage);
// Owner-specific routes
router.get('/owner/:ownerId', itemController_1.getItemsByOwner);
exports.default = router;
