document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

            // Formdaki email ve şifrenin değerlerini al
            const formData = new FormData(event.target);
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                alert(data.message);
                if (response.status === 200) {
                    // Başarılı giriş yapıldıysa, kullanıcıyı Home.html sayfasına yönlendir
                    window.location.href = 'Home/Home.html';
                }
            } catch (error) {
                console.error('Giriş işlemi sırasında bir hata oluştu:', error);
                alert('Giriş işlemi sırasında bir hata oluştu');
            }
        });
    } else {
        console.error('loginForm bulunamadı!');
    }
});
