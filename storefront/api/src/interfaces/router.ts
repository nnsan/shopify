export interface Router {
    get(path: string, callback: (ctx, next) => any): void
    post(path: string, callback: (ctx, next) => any): void
    put(path: string, callback: (ctx, next) => any): void
    delete(path: string, callback: (ctx, next) => any): void
}
