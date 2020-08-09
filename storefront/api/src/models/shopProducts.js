"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var ShopifyProductSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true
    },
    title: String
});
var ShopProductSchema = new mongoose_1.default.Schema({
    shopOrigin: {
        type: String,
        unique: true,
        required: true
    },
    products: [ShopifyProductSchema]
}, { timestamps: true });
exports.ShopProduct = mongoose_1.default.model('Shop_Product', ShopProductSchema);
