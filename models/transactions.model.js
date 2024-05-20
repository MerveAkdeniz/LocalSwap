const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = require('./users.model');
const productSchema = require('./products.model');

const transactionSchema = Schema({
  id: { type: Number, required: true, unique: true }, // primary key
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // foreign key
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' }, // foreign key
  transaction_type: { type: String, required: true },
  transaction_date: { type: Date, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);