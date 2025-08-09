"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const healthController_1 = require("@/controllers/healthController");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Basic health check
router.get('/', healthController_1.healthCheck);
// Detailed health check
router.get('/detailed', healthController_1.detailedHealthCheck);
exports.default = router;
