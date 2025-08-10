import { Request, Response } from 'express';
export declare class MessageController {
    private messageService;
    constructor();
    sendMessage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMessageById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getConversation: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserConversations: (req: Request, res: Response, next: import("express").NextFunction) => void;
    markConversationAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
    markMessageAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUnreadCount: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchMessages: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMessagesByItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMessagesByLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteMessage: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const sendMessage: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMessageById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getConversation: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserConversations: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const markConversationAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const markMessageAsRead: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUnreadCount: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const searchMessages: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMessagesByItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMessagesByLoan: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteMessage: (req: Request, res: Response, next: import("express").NextFunction) => void;
