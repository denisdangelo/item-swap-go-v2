import { Request, Response } from 'express';
export declare class UserController {
    private userService;
    constructor();
    getProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateLocation: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateAvatar: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getNearbyUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    verifyEmail: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deactivateAccount: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteAccount: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const getProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateProfile: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateLocation: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateAvatar: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const searchUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getNearbyUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getUserStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const verifyEmail: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deactivateAccount: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteAccount: (req: Request, res: Response, next: import("express").NextFunction) => void;
