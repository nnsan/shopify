"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var router = require('koa-router');
var Router = /** @class */ (function () {
    function Router() {
        this.router = new router();
    }
    Router.prototype.get = function (path, handle) {
        this.router.get(path, handle);
    };
    Router.prototype.post = function (path, handle) {
        this.router.post(path, handle);
    };
    Router.prototype.put = function (path, handle) {
        this.router.put(path, handle);
    };
    Router.prototype.delete = function (path, handle) {
        this.router.delete(path, handle);
    };
    Router = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], Router);
    return Router;
}());
exports.Router = Router;
