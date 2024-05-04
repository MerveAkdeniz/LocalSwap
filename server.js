const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB'ye bağlan
mongoose.connect('mongodb://localhost:27017/LocalSwapDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

// MongoDB'de kullanılacak User modeli
const User = mongoose.model('User', {
    email: String,
    name: String,
    surname: String,
    password: String
});

// Gelen isteklerin body kısmını işlemek için bodyParser kullanın
app.use(bodyParser.json());

// Giriş sayfasını servis et
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Login', 'Login.html'));
});

// Kaydolma sayfasını servis et
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Register', 'Register.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Home', 'Home.html'));
});
// Login endpoint'i
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kullanıcıyı veritabanında bul
        const user = await User.findOne({ email });

        // Kullanıcı bulunamadıysa veya şifre eşleşmiyorsa hata dön
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Girilen bilgiler hatalı' });
        }

        // Başarılı giriş yapılırsa Home.html sayfasına yönlendir
        res.status(200).json({ message: 'Giriş başarılı', user });
    } catch (error) {
        console.error('Giriş işlemi sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Giriş işlemi sırasında bir hata oluştu' });
    }
});

// Kaydolma endpoint'i
app.post('/register', async (req, res) => {
    const { email, name, surname, password } = req.body;

    try {
        // E-posta adresi veritabanında var mı kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı' });
        }

        // Yeni kullanıcı oluştur ve veritabanına ekle
        const newUser = new User({ email, name, surname, password });
        await newUser.save();

        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi' });
    } catch (error) {
        console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Kayıt işlemi sırasında bir hata oluştu' });
    }
});

// Statik dosyaları sunmak için Express'e public klasörünü kullanmasını söyleyin
app.use(express.static(path.join(__dirname, 'public')));

// Register ve Login klasörlerini sunucuya sağlamak için
app.use('/Register', express.static(path.join(__dirname, 'public', 'Register')));
app.use('/Login', express.static(path.join(__dirname, 'public', 'Login')));

// Web sunucusunu dinle
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
