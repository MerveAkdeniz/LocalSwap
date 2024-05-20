const express = require('express');
const crypto = require("crypto-js");
const Web3 = require('web3');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session= require('express-session');   
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;



// Express uygulamasına oturum kullanımını ayarla
app.use(session({
    secret: 'gizlianahtar', // Oturum bilgisini şifrelemek için kullanılan gizli anahtar
    resave: false,
    saveUninitialized: true
}));
mongoose.set('strictQuery', true);
// MongoDB'ye bağlan
mongoose.connect('mongodb://localhost:27017/LocalSwapDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch((err) => console.error('MongoDB bağlantı hatası:', err));

// MongoDB'de kullanılacak modeller
const User = require('./models/users.model');
const Location = require('./models/locations.model');
const Product = require('./models/products.model');
const Message = require('./models/messages.model'); 
const Review = require('./models/reviews.model');   
const Transaction = require('./models/transactions.model'); 

// Gelen isteklerin body kısmını işlemek için bodyParser kullanın
app.use(bodyParser.json());

// Giriş sayfasını servis et
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Login', 'Login.html'));
});
app.get('/admin/login', (req, res) => {
     // Yetkilendirme kontrolü yap
     if (req.session.user && req.session.user.role === 'admin') {
        // Yetkilendirilmiş kullanıcıyı admin paneline yönlendir
        res.sendFile(path.join(__dirname, 'public', 'AdminPanel','AdminLogin', 'AdminLogin.html'));
    } else {
        // Yetkilendirilmemiş kullanıcıya yetkilendirme hatası ver
        res.status(403).send('Yetkisiz erişim');
    }
});
// Kaydolma sayfasını servis et
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Register', 'Register.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Home', 'Home.html'));
});
app.get('/admin/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/AdminPanel/AdminHome', 'AdminHome.html'));
});
// Kullanıcı giriş yaptıktan sonra oturumda kullanıcı bilgilerini sakla
app.post('/login', async (req, res) => {
    // Kullanıcı bilgilerini al
    const { email, password } = req.body;
    
    try {
        // Kullanıcıyı veritabanında bul
        const user = await User.findOne({ email });

        // Kullanıcı bulunamadıysa veya şifre eşleşmiyorsa hata dön
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Girilen bilgiler hatalı' });
        }
        
        // Kullanıcıyı oturumda sakla
        req.session.user = user;

        // Başarılı giriş yapılırsa Home.html sayfasına yönlendir
        res.status(200).json({ message: 'Giriş başarılı', user });
    } catch (error) {
        console.error('Giriş işlemi sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Giriş işlemi sırasında bir hata oluştu' });
    }
});
// Admin giriş isteğini işle
app.post('/admin/login', async (req, res) => {
    // Kullanıcı bilgilerini al
    const { adminName, adminPassword } = req.body;

    try {
        // Admin adı ve şifresini kontrol et
        if(adminName === 'admin' && adminPassword === 'admin1234') {
            // Admin olarak oturumda sakla
            req.session.user = { email: adminName, role: 'admin' };
            // Başarılı giriş yapılırsa Admin Paneline yönlendir
            res.status(200).json({ message: 'Admin Paneline giriş başarılı', user: { email: adminName, role: 'admin' } });
        } else {
            // Hatalı giriş durumunda hata dön
            res.status(401).json({ message: 'Admin adı veya şifre hatalı' });
        }
    } catch (error) {
        console.error('Admin giriş işlemi sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Admin giriş işlemi sırasında bir hata oluştu' });
    }
});

// Kaydolma endpoint'i
app.post('/register', async (req, res) => {
    const { email, name, surname, phoneNumber, password} = req.body;

    try {
        // E-posta adresi veritabanında var mı kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı' });
        }

        // Yeni kullanıcı oluştur ve veritabanına ekle
        const newUser = new User({ email, name, surname, phoneNumber, password });
        await newUser.save();

        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi' });
    } catch (error) {
        console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
        res.status(500).json({ message: 'Kayıt işlemi sırasında bir hata oluştu' });
    }
});
// Profil güncelleme endpoint'i
app.post('/user/location/update', async (req, res) => {
    const {  city, district, neighborhood } = req.body;
    
    try {
        
        const newLocation= new Location({city, district, neighborhood });
        await newLocation.save();

        res.status(200).json({ message: 'Profil bilgileri güncellendi' });
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({ message: 'Profil bilgilerini güncelleme sırasında bir hata oluştu' });
    }
});

// Kullanıcı profil bilgilerini sağlayan endpoint
app.get('/user/location', (req, res) => {
    // Oturumda saklanan kullanıcı bilgilerini döndür
    res.status(200).json(req.session.user);
});

// Kullanıcı profil bilgilerini güncelleyen endpoint
app.put('/user/location', async (req, res) => {
    // Oturumda saklanan konum bilgilerini al
    const location = req.session.user;
    
    // Güncellenecek bilgileri al
    const { city, district, neighborhood } = req.body;

    try {
        // Konum bilgilerini güncelle
        location.city=city;
        location.district=district;
        location.neighborhood=neighborhood;
        await location.save();

        // Başarılı bir yanıt gönder
        res.status(200).json({ message: 'Profil bilgileri güncellendi' });
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({ message: 'Profil bilgileri güncelleme sırasında bir hata oluştu' });
    }
});

// Statik dosyaları sunmak için Express'e public klasörünü kullanmasını söyleyin
app.use(express.static(path.join(__dirname, 'public')));

// Register ve Login klasörlerini sunucuya sağlamak için
app.use('/Register', express.static(path.join(__dirname, 'public', 'Register')));
app.use('/Login', express.static(path.join(__dirname, 'public', 'Login')));
app.use('/AdminLogin', express.static(path.join(__dirname, 'public', 'AdminPanel','AdminLogin')));
// Web sunucusunu dinle
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});