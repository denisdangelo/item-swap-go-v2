"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const categories_1 = __importDefault(require("./categories"));
const health_1 = __importDefault(require("./health"));
const items_1 = __importDefault(require("./items"));
const loans_1 = __importDefault(require("./loans"));
const messages_1 = __importDefault(require("./messages"));
const reviews_1 = __importDefault(require("./reviews"));
const upload_1 = __importDefault(require("./upload"));
const users_1 = __importDefault(require("./users"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/health', health_1.default);
router.use('/auth', auth_1.default);
router.use('/users', users_1.default);
router.use('/categories', categories_1.default);
router.use('/items', items_1.default);
router.use('/loans', loans_1.default);
router.use('/reviews', reviews_1.default);
router.use('/messages', messages_1.default);
router.use('/upload', upload_1.default);
exports.default = router;
