const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = require('./users.model');
const locationSchema = require('./locations.model');

const productSchema = Schema({
  id: { type: Number, required: true, unique: true }, // primary key
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }, // foreign key
  location_id: { type: Schema.Types.ObjectId, ref: 'Location' }, // foreign key
  transaction_type: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);