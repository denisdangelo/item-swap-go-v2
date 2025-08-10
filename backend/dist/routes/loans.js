"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loanController_1 = require("@/controllers/loanController");
const auth_1 = require("@/middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
// All loan routes require authentication
router.use(auth_1.authenticate);
// Loan CRUD operations
router.post('/', loanController_1.createLoan);
router.get('/:id', loanController_1.getLoanById);
router.patch('/:id/status', loanController_1.updateLoanStatus);
// User loan operations
router.get('/user/all', loanController_1.getUserLoans);
router.get('/user/as-borrower', loanController_1.getLoansAsBorrower);
router.get('/user/as-lender', loanController_1.getLoansAsLender);
router.get('/user/:userId/stats', loanController_1.getUserLoanStats);
// Item loans
router.get('/item/:itemId', loanController_1.getItemLoans);
// Loan actions
router.patch('/:id/cancel', loanController_1.cancelLoan);
router.patch('/:id/complete', loanController_1.completeLoan);
exports.default = router;
