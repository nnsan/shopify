export interface Server {
    get(path: string, callback: (req, res) => any): void
    post(path: string, callback: (req, res) => any): void
    put(path: string, callback: (req, res) => any): void
    delete(path: string, callback: (req, res) => any): void
}
