import { Application } from 'express';
declare class App {
    app: Application;
    constructor();
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeErrorHandling;
    listen(): void;
}
export default App;
