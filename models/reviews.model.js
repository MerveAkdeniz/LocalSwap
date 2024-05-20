const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = require('./users.model');
const productSchema = require('./products.model');
const transactionSchema = require('./transactions.model');

const reviewSchema = Schema({
  id: { type: Number, required: true, unique: true }, // primary key
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // foreign key
  product_id:{ type: Schema.Types.ObjectId, ref: 'Product' }, // foreign key
  transaction_id: { type: Schema.Types.ObjectId, ref: 'Transaction' }, // foreign key
  review_text: { type: String, required: true },
  rating: { type: Number, required: true },
  review_date: { type: Date, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);