"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categoryController_1 = require("@/controllers/categoryController");
const auth_1 = require("@/middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Public routes
router.get('/', categoryController_1.getAllCategories);
router.get('/with-count', categoryController_1.getCategoriesWithItemCount);
router.get('/popular', categoryController_1.getPopularCategories);
router.get('/search', categoryController_1.searchCategories);
router.get('/:id', categoryController_1.getCategoryById);
router.get('/:id/stats', categoryController_1.getCategoryStats);
// Protected routes (admin only - for now, any authenticated user can manage categories)
router.post('/', auth_1.authenticate, categoryController_1.createCategory);
router.put('/:id', auth_1.authenticate, categoryController_1.updateCategory);
router.delete('/:id', auth_1.authenticate, categoryController_1.deleteCategory);
router.post('/:id/deactivate', auth_1.authenticate, categoryController_1.deactivateCategory);
router.post('/:id/activate', auth_1.authenticate, categoryController_1.activateCategory);
exports.default = router;
