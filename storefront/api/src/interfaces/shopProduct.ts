export interface ShopProduct {
    defineRoutes(): void;
    getProducts(shop: string): Promise<any>;
}
