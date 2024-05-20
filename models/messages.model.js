const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = require('./users.model');
const productSchema = require('./products.model');

const messageSchema = Schema({
  id: { type: Number, required: true, unique: true }, // primary key
  sender_id: { type: Schema.Types.ObjectId, ref: 'User' }, // foreign key
  receiver_id: { type: Schema.Types.ObjectId, ref: 'User' }, // foreign key
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' }, // foreign key
  message_text: { type: String, required: true },
  message_date: { type: Date, required: true }
});

module.exports = mongoose.model('Message', messageSchema);