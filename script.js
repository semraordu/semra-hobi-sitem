// Görsel Slider (Carousel) Fonksiyonu
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

    // 5 saniye sonra tekrar çalıştır
    setTimeout(showSlides, 5000); 
}

// Sayfa yüklendiğinde slider'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    if (slides.length > 0) {
        slides[0].classList.add('active');
        slideIndex = 0;
        setTimeout(showSlides, 5000); 
    }
});
