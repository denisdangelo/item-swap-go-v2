import { Request, Response } from 'express';
export declare class ItemController {
    private itemService;
    constructor();
    createItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getItemById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchItems: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getItemsByOwner: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getItemsByCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getNearbyItems: (req: Request, res: Response, next: import("express").NextFunction) => void;
    setItemAvailability: (req: Request, res: Response, next: import("express").NextFunction) => void;
    addItemImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    removeItemImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getItemImages: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const createItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getItemById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteItem: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const searchItems: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getItemsByOwner: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getItemsByCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getNearbyItems: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const setItemAvailability: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const addItemImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const removeItemImage: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getItemImages: (req: Request, res: Response, next: import("express").NextFunction) => void;
