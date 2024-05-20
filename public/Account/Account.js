document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Sunucudan kullanıcı bilgilerini al
        const response = await fetch('/user/location');
        const data = await response.json();
        
        
        if (response.status === 200) {
            // Kullanıcı bilgilerini form alanlarına yerleştir
            document.getElementById('city').value = data.location.city;
            document.getElementById('district').value = data.location.district;
            document.getElementById('neighborhood').value = data.location.neighborhood;
        }
    } catch (error) {
        console.error('Kullanıcının konum bilgilerini alma hatası:', error);
    }

    // Profil bilgilerini güncelleme formunu dinle
    const locationForm = document.getElementById('locationForm');
    locationForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

        // Formdaki ad, soyad ve e-posta değerlerini al
        const city = formData.get('city');
        const district = formData.get('district');
        const neighborhood = formData.get('neighborhood');

        try {
            // Sunucuya güncelleme isteği gönder
            const response = await fetch('/user/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({  city, district, neighborhood })
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