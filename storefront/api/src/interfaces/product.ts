export default interface Product {
    defineRoutes(): void;
    getAll(): Promise<any>;
}
