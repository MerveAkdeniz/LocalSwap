// Form gönderildiğinde çağrılacak olan işlev
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

    // Formdaki e-posta, isim, soyisim ve şifre alanlarının değerlerini al
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value;
    const name = nameInput.value;
    const surname = surnameInput.value;
    const password = passwordInput.value;

    try {
        // Kullanıcıyı veritabanına kaydet
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, name, surname, password })
        });
        const data = await response.json();
        alert(data.message); // Kayıt işlemi hakkında kullanıcıya bilgi ver
        if (response.status === 201) {
            // Başarılı bir şekilde kayıt olunduysa, kullanıcıyı giriş sayfasına yönlendir
            window.location.href = '/login'; // Giriş sayfasına yönlendir
        }
    } catch (error) {
        console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
        alert('Kayıt işlemi sırasında bir hata oluştu');
    }
});
