export interface Router {
    get(path: string, callback: (ctx:any, next:any) => any): void
    post(path: string, callback: (ctx:any, next:any) => any): void
    put(path: string, callback: (ctx:any, next:any) => any): void
    delete(path: string, callback: (ctx:any, next:any) => any): void
}
