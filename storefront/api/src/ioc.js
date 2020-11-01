"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var inversify_1 = require("inversify");
var services_1 = require("./services");
var identifiers_1 = __importDefault(require("./constant/identifiers"));
var productMock_1 = require("./services/productMock");
var shopProductMock_1 = require("./services/shopProductMock");
var container = new inversify_1.Container();
container.bind(identifiers_1.default.ROUTER).to(services_1.Router).inSingletonScope();
container.bind(identifiers_1.default.PRODUCT).toDynamicValue(function (context) {
    if (process.env.DATABASE) {
        return new services_1.Product(context.container.get(identifiers_1.default.ROUTER));
    }
    else {
        return new productMock_1.ProductMock(context.container.get(identifiers_1.default.ROUTER));
    }
});
container.bind(identifiers_1.default.SHOP_PRODUCT).toDynamicValue(function (context) {
    if (process.env.DATABASE) {
        return new services_1.ShopProduct(context.container.get(identifiers_1.default.ROUTER));
    }
    else {
        return new shopProductMock_1.ShopProductMock(context.container.get(identifiers_1.default.ROUTER));
    }
});
exports.default = container;
