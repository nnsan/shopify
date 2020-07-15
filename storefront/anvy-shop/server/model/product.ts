import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);
export default Product;
