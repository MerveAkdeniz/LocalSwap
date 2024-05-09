document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Sunucudan kullanıcı bilgilerini al
        const response = await fetch('/user/profile');
        const data = await response.json();
        
        if (response.status === 200) {
            // Kullanıcı bilgilerini form alanlarına yerleştir
            document.getElementById('name').value = data.name;
            document.getElementById('surname').value = data.surname;
            document.getElementById('email').value = data.email;
        }
    } catch (error) {
        console.error('Kullanıcı bilgilerini alma hatası:', error);
    }

    // Profil bilgilerini güncelleme formunu dinle
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

        // Formdaki ad, soyad ve e-posta değerlerini al
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const surname = formData.get('surname');
        const email = formData.get('email');

        try {
            // Sunucuya güncelleme isteği gönder
            const response = await fetch('/user/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, surname, email })
            });

            const data = await response.json();
            alert(data.message);
            if (response.status === 200) {
                // Başarılı giriş yapıldıysa, kullanıcıyı Home.html sayfasına yönlendir
                window.location.href = '/Home/Home.html';
            }
        } catch (error) {
            console.error('Profil bilgilerini güncelleme hatası:', error);
            alert('Profil bilgilerini güncelleme sırasında bir hata oluştu');
        }
    });
});
//bir kez değiştirildi ctrl z yap eski hali oluyprdu 1.