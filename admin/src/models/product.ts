import mongoose from 'mongoose'

const ProductImageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true
  },
  type: String
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  images: [ProductImageSchema]
}, {timestamps: true});

const Product = mongoose.model('Product', ProductSchema);
export default Product
