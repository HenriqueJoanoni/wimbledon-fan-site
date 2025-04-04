/** LOCATION API CALL */
function initMap() {
    const wimbledonLocations = {lat: 51.4340, lng: -0.2143};

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

const mapsScript = document.createElement('script');
mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${window.API_KEYS.maps}&callback=initMap`;
mapsScript.async = true;
mapsScript.defer = true;
document.head.appendChild(mapsScript);

/** HAMBURGER MENU */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.jh_hamburger');
    const navLinks = document.querySelector('.jh_navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('jh_active');
    });

    /** Close menu when clicking outside */
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.jh_navContainer')) {
            navLinks.classList.remove('jh_active');
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

    const typewriter = new Typewriter('jh_typewriter', [
        "Tradition Since 1877",
        "Home of Grass Court Tennis",
        "Wimbledon White & Purple",
        "The Queue Awaits...",
    ]);

    typewriter.start();
});

/** TRANSLATIONS */
document.querySelectorAll('.jh_translationButton').forEach(button => {
    button.addEventListener('click', async function () {
        const targetLang = this.dataset.lang;
        const elements = document.querySelectorAll('h1, p, span, .jh_translatedString');

        for (const element of elements) {
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${window.API_KEYS.translation}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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