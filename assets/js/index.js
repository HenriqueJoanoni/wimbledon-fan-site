/** COMPONENTS */
class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wimbledon API</title>
            <link rel="stylesheet" href="assets/css/main.css">
            <link rel="shortcut icon" href="assets/img/tennis.png" type="image/x-icon">
        </head>`;
    }
}

class NavBarComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="jh_mainNavbar">
            <div class="jh_navContainer">
                <div class="jh_logoTitleContainer">
                    <a href="index.html">
                        <img class="jh_logo" src="assets/img/tennis.png" alt="Wimbledon API">
                        <div class="jh_navTitle">Wimbledon Fan Site</div>
                    </a>
                </div>
                <div class="jh_navLinks">
                    <a href="index.html" class="jh_translatedString">Home</a>
                    <a href="wimbledon-locations.html" class="jh_translatedString">What to do?</a>
                    <a href="contact-page.html" class="jh_translatedString">Contact</a>
                    <a target="_blank" href="https://www.wimbledon.com/en_GB/atoz/ticket_prices.html"
                       class="jh_button jh_buttonCta jh_translatedString">Tickets</a>
                    <a class="jh_translationButton" data-lang="pt-BR">
                        <img src="assets/img/brazil-.png" alt="Translate pt-br">
                    </a>
                    <a class="jh_translationButton" data-lang="es">
                        <img src="assets/img/spain.png" alt="Translate es">
                    </a>
                    <a class="jh_translationButton" data-lang="en-GB">
                        <img src="assets/img/united-kingdom.png" alt="Translate en-gb">
                    </a>
                </div>
                <button class="jh_hamburger">
                  <svg viewBox="0 0 24 24" width="32" height="32">
                    <path class="jh_hamburgerLine" fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                  </svg>
                </button>
            </div>
        </nav>`;
    }
}

class FooterComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<footer>
                            <span class="jh_footerCopyright">Jose Henrique Pinto Joanoni @ 2025</span>
                        </footer>`;
    }
}

customElements.define('main-header', HeaderComponent);
customElements.define('nav-bar', NavBarComponent);
customElements.define('footer-page', FooterComponent);

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

window.initMap = initMap;

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
            const response = await fetch('https://translation.googleapis.com/language/translate/v2?key={}', {
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