document.addEventListener('DOMContentLoaded', function () {
    const AdminLoginForm = document.getElementById('AdminLoginForm');
    if (AdminLoginForm) {
        AdminLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Formun otomatik olarak gönderilmesini engelle
            // Formdan admin adı ve şifreyi al
            const adminName = $('#adminName').val();
            const adminPassword = $('#adminPassword').val();

            // Admin adı ve şifresini kontrol et
            if (adminName === 'admin' && adminPassword === 'admin1234') {
                // Başarılı giriş durumunda admin paneline yönlendir
                window.location.href = '/admin/home';
            } else {
                // Hatalı giriş durumunda mesajı göster
                alert('Admin adı veya şifre hatalı');
            }
        });
    }

});