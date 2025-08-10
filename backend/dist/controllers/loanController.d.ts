import { Request, Response } from 'express';
export declare class LoanController {
    private loanService;
    constructor();
    createLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getLoanById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateLoanStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserLoans: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getLoansAsBorrower: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getLoansAsLender: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getItemLoans: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserLoanStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    cancelLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    completeLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const createLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getLoanById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateLoanStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserLoans: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getLoansAsBorrower: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getLoansAsLender: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getItemLoans: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserLoanStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const cancelLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const completeLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
