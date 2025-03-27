/** LOCATION API CALL */
function initMap() {
    const wimbledonLocations = { lat: 51.4340, lng: -0.2143 };

    const map = new google.maps.Map(document.getElementById('jh_locations'), {
        zoom: 16,
        center: wimbledonLocations,
        mapId: 'WIMBLEDON_STYLED_MAP'
    });

    new google.maps.Marker({
        position: wimbledonLocations,
        map: map,
        title: 'All Wimbledon Locations',
    });
}

window.gm_authFailure = () => {
    console.error('Google Maps failed to load');
    document.getElementById('jh_locations').innerHTML =
        '<p>Map unavailable - Please check your internet connection</p>';
};

window.initMap = initMap;

/** HAMBURGER MENU */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    /** Close menu when clicking outside */
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
        }
    });

    /** Smooth scroll for navigation links */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

/**
 * Based on:
 * https://www.w3schools.com/js/js_timing.asp
 * https://css-tricks.com/snippets/css/typewriter-effect/
 * https://www.w3schools.com/howto/howto_js_typewriter.asp
 */
/** HERO BANNER TYPEWRITER EFFECT */
document.addEventListener('DOMContentLoaded', () => {
    class Typewriter {
        constructor(elementId, phrases) {
            this.element = document.getElementById(elementId);
            this.phrases = phrases;
            this.currentPhrase = 0;
            this.charIndex = 0;
            this.isDeleting = false;
            this.typeSpeed = 100;
            this.deleteSpeed = 50;
            this.pauseBetween = 2000;
        }

        type() {
            const currentText = this.phrases[this.currentPhrase];

            if (this.isDeleting) {
                this.element.textContent = currentText.substring(0, this.charIndex - 1);
                this.charIndex--;
            } else {
                this.element.textContent = currentText.substring(0, this.charIndex + 1);
                this.charIndex++;
            }

            if (!this.isDeleting && this.charIndex === currentText.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.pauseBetween);
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
                setTimeout(() => this.type(), this.typeSpeed);
            } else {
                const speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
                setTimeout(() => this.type(), speed);
            }
        }

        start() {
            setTimeout(() => this.type(), 500);
        }
    }

    const typewriter = new Typewriter('typewriter', [
        "Tradition Since 1877",
        "Home of Grass Court Tennis",
        "Wimbledon White & Purple",
        "The Queue Awaits...",
    ]);

    typewriter.start();
});

/** TRANSLATIONS */
document.querySelectorAll('.translation-button').forEach(button => {
    button.addEventListener('click', async function() {
        const targetLang = this.dataset.lang;
        const elements = document.querySelectorAll('h1, p, span, .jh_translatedString');

        for (const element of elements) {
            const response = await fetch('https://translation.googleapis.com/language/translate/v2?key=AIzaSyAi1Qow5DshGlDIDqe3Q0WESlHf2vkixDk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: element.innerText,
                    target: targetLang
                }),
            });
            const translatedData = await response.json();
            element.innerText = translatedData.data.translations[0].translatedText;
        }
    });
});