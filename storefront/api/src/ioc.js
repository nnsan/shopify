"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var inversify_1 = require("inversify");
var services_1 = require("./services");
var identifiers_1 = __importDefault(require("./constant/identifiers"));
var container = new inversify_1.Container();
container.bind(identifiers_1.default.PRODUCT).to(services_1.Product);
container.bind(identifiers_1.default.ROUTER).to(services_1.Router).inSingletonScope();
container.bind(identifiers_1.default.SHOP_PRODUCT).to(services_1.ShopProduct);
exports.default = container;
