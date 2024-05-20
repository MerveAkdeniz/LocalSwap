const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, required: true, default: 'user' } // default değeri kullanıcı rolü olarak ayarladık
});

const User = mongoose.model('User', userSchema);
module.exports = User;
