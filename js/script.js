/* ===== Hamburguesa ===== */
var hamburger = document.getElementById('hamburger');
var menu = document.getElementById('menu');
var overlay = document.getElementById('overlay');
var navLinks = menu.querySelectorAll('.header__link');

function toggleMenu() {
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
}

if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (overlay) overlay.addEventListener('click', toggleMenu);

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        if (menu.classList.contains('active')) toggleMenu();
    });
});

/* ===== Slider dots ===== */
var sliderDots = document.querySelectorAll('.header__slider_dot');
var currentSlide = 0;

if (sliderDots.length > 0) {
    setInterval(function () {
        sliderDots.forEach(dot => dot.classList.remove('active'));
        sliderDots[currentSlide].classList.add('active');
        currentSlide = (currentSlide + 1) % sliderDots.length;
    }, 5800);
}

/* ===== Inicializar bordes SVG ===== */
var borderSvgs = document.querySelectorAll('[data-border]');
borderSvgs.forEach(svg => {
    var shapes = svg.querySelectorAll('circle, rect');
    shapes.forEach(shape => {
        try {
            var len = shape.getTotalLength();
            if (len > 0) {
                shape.style.strokeDasharray = len;
                shape.style.strokeDashoffset = len;
            }
        } catch (e) { }
    });
});

/* ===== Inicializar iconos SVG para draw ===== */
var iconContainers = document.querySelectorAll('[data-icon]');
iconContainers.forEach(container => {
    var svg = container.querySelector('svg');
    if (!svg) return;
    var paths = svg.querySelectorAll('path, circle, line, rect, polyline, polygon');
    paths.forEach(path => {
        try {
            var len = path.getTotalLength();
            if (len > 0) {
                path.style.strokeDasharray = len;
                path.style.strokeDashoffset = len;
                path.style.transition = 'stroke-dashoffset 0.9s ease';
            }
        } catch (e) { }
    });
});

/* ===== Mapeo de animaciones por tipo ===== */
var animMap = {
    pulse: 'icon_anim_pulse',
    rotate: 'icon_anim_rotate',
    bounce: 'icon_anim_bounce',
    swing: 'icon_anim_swing',
    glow: 'icon_anim_glow',
    morph: 'icon_anim_morph'
};

/* ===== Scroll animations ===== */
var animEls = document.querySelectorAll('.anim, .anim_l, .anim_r, .deco__line, .deco__corner');

function checkAnim() {
    var trigger = window.innerHeight * 0.88;
    animEls.forEach(el => {
        if (el.classList.contains('vis')) return;
        var rect = el.getBoundingClientRect();
        if (rect.top < trigger) {
            el.classList.add('vis');

            /* Dibujar iconos */
            var icons = el.querySelectorAll('[data-icon]');
            icons.forEach((icon, index) => {
                setTimeout(function () {
                    var svgPaths = icon.querySelectorAll('svg path, svg circle, svg line, svg rect, svg polyline, svg polygon');
                    svgPaths.forEach(path => path.style.strokeDashoffset = '0');
                    
                    var animType = icon.getAttribute('data-icon-anim');
                    if (animType && animMap[animType]) {
                        setTimeout(() => icon.classList.add(animMap[animType]), 950);
                    }
                }, index * 150);
            });

            /* Dibujar bordes */
            var borders = el.querySelectorAll('[data-border]');
            borders.forEach(bord => {
                setTimeout(function () {
                    bord.classList.add('drawn');
                    var shapes = bord.querySelectorAll('circle, rect');
                    shapes.forEach(shape => shape.style.strokeDashoffset = '0');
                }, 600);
            });
        }
    });
}

window.addEventListener('scroll', checkAnim, { passive: true });
checkAnim();

/* ===== Galería lightbox ===== */
var galItems = document.querySelectorAll('[data-gal]');
var lightbox = document.getElementById('lightbox');
var lbImg = document.getElementById('lbImg');
var lbClose = document.getElementById('lbClose');
var lbPrev = document.getElementById('lbPrev');
var lbNext = document.getElementById('lbNext');
var currentIndex = 0;

function openLb(index) {
    currentIndex = index;
    var img = galItems[currentIndex].querySelector('.gal__img');
    if (img && lbImg && lightbox) {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLb() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function prevLb() {
    currentIndex = (currentIndex - 1 + galItems.length) % galItems.length;
    var img = galItems[currentIndex].querySelector('.gal__img');
    if (img && lbImg) {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
    }
}

function nextLb() {
    currentIndex = (currentIndex + 1) % galItems.length;
    var img = galItems[currentIndex].querySelector('.gal__img');
    if (img && lbImg) {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
    }
}

galItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
        openLb(index);
    });
});

if (lbClose) lbClose.addEventListener('click', closeLb);
if (lbPrev) lbPrev.addEventListener('click', prevLb);
if (lbNext) lbNext.addEventListener('click', nextLb);
if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });

document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') prevLb();
    if (e.key === 'ArrowRight') nextLb();
});

/* ===== Swipe táctil ===== */
var touchStartX = 0;
var touchEndX = 0;

lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) nextLb();
    if (touchEndX > touchStartX + 50) prevLb();
}, { passive: true });

/* ===== Formulario WhatsApp ===== */
const WHATSAPP_NUMBER = "543816509409";
var form = document.getElementById('form');
var toast = document.getElementById('toast');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nombre = document.getElementById('nombre').value.trim();
        var mensaje = document.getElementById('mensaje').value.trim();
        
        if (!nombre || !mensaje) return;

        var text = "Hola, mi nombre es " + nombre + ", y mi consulta es:\n" + mensaje;
        var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

        window.open(url, '_blank');

        form.reset();
        if (toast) {
            toast.innerText = "Abriendo WhatsApp...";
            toast.classList.add('show');
            setTimeout(function () { toast.classList.remove('show'); }, 2800);
        }
    });
}

/* ===================== SISTEMA DE PARTICULAS CANVAS ===================== */
function initParticles() {
    const canvas = document.getElementById('canvas-particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    const PARTICLE_COLOR = '#c9a84c';
    const PARTICLE_COUNT = 15;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(isInitial = false) {
            this.x = Math.random() * width;
            this.y = isInitial ? (Math.random() * height) : -10;
            this.size = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 1.2 + 0.4;
            this.opacity = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y > height) this.reset(false);
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.globalAlpha = this.opacity;
            ctx.shadowBlur = 4;
            ctx.shadowColor = PARTICLE_COLOR;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
});