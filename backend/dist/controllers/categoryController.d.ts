import { Request, Response } from 'express';
export declare class CategoryController {
    private categoryService;
    constructor();
    getAllCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCategoriesWithItemCount: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPopularCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCategoryById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deactivateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    activateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCategoryStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export declare const getAllCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getCategoriesWithItemCount: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getPopularCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getCategoryById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const createCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deleteCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const deactivateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const activateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const searchCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getCategoryStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
