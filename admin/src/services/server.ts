import { injectable } from 'inversify';
import express from 'express';

import { Server as IServer } from '../interfaces';

@injectable()
export class Server implements IServer {

    private server: express.Application;

    constructor() {
        this.server = express();
    }

    get(path: string, handle: (req, res) => void) {
        this.server.get(path, handle);
    }

    post(path: string, handle: (req, res) => void) {
        this.server.get(path, handle);
    }

    put(path: string, handle: (req, res) => void) {
        this.server.get(path, handle);
    }

    delete(path: string, handle: (req, res) => void) {
        this.server.get(path, handle);
    }

    listen(port: number, callback: () => any) {
        this.server.listen(port, () => {
            console.log(`Server listen on ${port}`);
            callback();
        });
    }
}
