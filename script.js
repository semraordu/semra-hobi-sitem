const KDV_RATE = 0.20; // %20 KDV oranı
const cartCountElement = document.getElementById('cart-count');
const cartItemsBody = document.getElementById('cart-items-body');
const subtotalDisplay = document.getElementById('subtotal-display');
const kdvDisplay = document.getElementById('kdv-display');
const grandTotalDisplay = document.getElementById('grand-total-display');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartSummary = document.getElementById('cart-summary');
const cartTable = document.getElementById('cart-items-table');

document.addEventListener('DOMContentLoaded', () => {
    // Sayfa Yüklenince Sepeti Kontrol Et
    updateCartCount();
    // cart.html sayfasında olup olmadığımızı kontrol et
    if (document.title.includes('Sepetiniz')) { 
        renderCart();
    }
});

// --- YARDIMCI FONKSİYONLAR ---

// Sepeti Yerel Depolamadan (Local Storage) Yükler
function loadCart() {
    const cart = localStorage.getItem('semraHobiCart');
    return cart ? JSON.parse(cart) : [];
}

// Sepeti Yerel Depolamaya Kaydeder
function saveCart(cart) {
    localStorage.setItem('semraHobiCart', JSON.stringify(cart));
    updateCartCount();
}

// Sepet Sayısını Günceller
function updateCartCount() {
    const cart = loadCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Fiyatları Para Formatına Çevirir
function formatPrice(price) {
    return '₺' + price.toFixed(2).replace('.', ',');
}

// --- ANA E-TİCARET İŞLEVLERİ ---

// 1. Ürünü Sepete Ekler
window.addToCart = function(id, name, price) {
    const cart = loadCart();
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveCart(cart);
    
    // KRİTİK DÜZELTME: Sepet başarılı kaydedildikten sonra kullanıcıyı direkt sepet sayfasına yönlendir.
    window.location.href = 'cart.html'; 
};

// 2. Sepet İçeriğini Sayfaya Çizer (cart.html için)
function renderCart() {
    const cart = loadCart();

    // Sepet Boş Kontrolü
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        if (cartTable) cartTable.style.display = 'none';
        return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    if (cartTable) cartTable.style.display = 'table';
    
    if (!cartItemsBody) return; // Eğer body yoksa durdur

    cartItemsBody.innerHTML = ''; // Tabloyu temizle

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">
                ${item.quantity}
            </td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">${formatPrice(item.price)}</td>
            <td style="text-align: right; padding: 10px; border-bottom: 1px solid #eee;">${formatPrice(itemTotal)}</td>
            <td style="text-align: center; padding: 10px; border-bottom: 1px solid #eee;">
                <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: red; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cartItemsBody.appendChild(row);
    });

    // Toplamları Hesapla ve Güncelle
    const kdv = subtotal * KDV_RATE;
    const grandTotal = subtotal + kdv;

    if (subtotalDisplay) subtotalDisplay.textContent = formatPrice(subtotal);
    if (kdvDisplay) kdvDisplay.textContent = formatPrice(kdv);
    if (grandTotalDisplay) grandTotalDisplay.textContent = formatPrice(grandTotal);
}

// 3. Sepetten Ürün Çıkarır (Tekrar Çizimi Tetikler)
window.removeFromCart = function(id) {
    let cart = loadCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1); // Ürün adeti 1 ise tamamen kaldır
        }
    }
    
    saveCart(cart);
    // Eğer sepet sayfasındaysak, sayfayı tekrar çiz
    if (document.title.includes('Sepetiniz')) {
        renderCart();
    }
};


// 4. Slider Kodunun Kalıntıları (Index sayfasında çalışması için)
document.addEventListener('DOMContentLoaded', () => {
    // Eğer Sepet sayfasındaysak, Slider kodunu çalıştırma
    if (document.title.includes('Sepetiniz')) return; 

    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');

    function showSlides() {
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        slides[slideIndex - 1].classList.add('active');
        setTimeout(showSlides, 5000); 
    }

    if (slides.length > 0) {
        slides[0].classList.add('active');
        slideIndex = 0;
        setTimeout(showSlides, 5000); 
    }
});
