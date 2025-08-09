import { Request, Response } from 'express';
export declare class UploadController {
    private imageService;
    private itemService;
    private userService;
    constructor();
    uploadSingle: (req: Request, res: Response, next: import("express").NextFunction) => void;
    uploadMultiple: (req: Request, res: Response, next: import("express").NextFunction) => void;
    uploadItemImages: (req: Request, res: Response, next: import("express").NextFunction) => void;
    uploadAvatar: (req: Request, res: Response, next: import("express").NextFunction) => void;
    uploadWithSizes: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getImageInfo: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const uploadSingle: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const uploadMultiple: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const uploadItemImages: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const uploadAvatar: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const uploadWithSizes: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getImageInfo: (req: Request, res: Response, next: import("express").NextFunction) => void;
