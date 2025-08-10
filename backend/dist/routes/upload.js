"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = require("@/config/upload");
const uploadController_1 = require("@/controllers/uploadController");
const auth_1 = require("@/middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
// All upload routes require authentication
router.use(auth_1.authenticate);
// Single image upload
router.post('/single', (0, upload_1.uploadSingle)('image'), upload_1.handleUploadError, uploadController_1.uploadSingle);
// Multiple images upload
router.post('/multiple', (0, upload_1.uploadMultiple)('images', 5), upload_1.handleUploadError, uploadController_1.uploadMultiple);
// Upload with multiple sizes
router.post('/sizes', (0, upload_1.uploadSingle)('image'), upload_1.handleUploadError, uploadController_1.uploadWithSizes);
// Item images upload
router.post('/item/:itemId', (0, upload_1.uploadMultiple)('images', 5), upload_1.handleUploadError, uploadController_1.uploadItemImages);
// Avatar upload
router.post('/avatar', (0, upload_1.uploadSingle)('avatar'), upload_1.handleUploadError, uploadController_1.uploadAvatar);
// Image management
router.delete('/:filename', uploadController_1.deleteImage);
router.get('/info/:filename', uploadController_1.getImageInfo);
exports.default = router;
