import mongoose from 'mongoose'

const ShopifyProductSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: String
});

const ShopProductSchema = new mongoose.Schema({
    shopOrigin: {
        type: String,
        unique: true,
        required: true
    },
    products: [ShopifyProductSchema]
}, {timestamps: true});

export const ShopProduct = mongoose.model('Shop_Product', ShopProductSchema);
