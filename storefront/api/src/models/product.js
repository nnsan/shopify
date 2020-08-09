"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var ProductImageSchema = new mongoose_1.default.Schema({
    src: {
        type: String,
        required: true
    },
    type: String
});
var ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    images: [ProductImageSchema]
}, { timestamps: true });
var Product = mongoose_1.default.model('Product', ProductSchema);
exports.default = Product;
