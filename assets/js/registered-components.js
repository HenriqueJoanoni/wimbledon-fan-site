/** COMPONENTS */
class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            
            <!-- TAGS FOR PWA -->
            <link rel="manifest" href="/manifest.json">
            <meta name="theme-color" content="#347928">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
            <link rel="apple-touch-icon" href="/assets/icons/icon-192x192.png">
            
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title data-translate>Wimbledon Tourism Guide</title>
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
                    <a href="index.html" class="jh_translatedString" data-translate>Home</a>
                    <a href="wimbledon-locations.html" class="jh_translatedString" data-translate>What to do?</a>
                    <a href="contact-page.html" class="jh_translatedString" data-translate>Contact</a>
                    <a target="_blank" href="https://www.wimbledon.com/en_GB/atoz/ticket_prices.html"
                       class="jh_button jh_buttonCta jh_translatedString" data-translate>Tickets</a>
                    <a class="jh_translationButton" data-lang="pt">
                        <img src="assets/img/brazil-.png" alt="Portuguese" data-translate-alt="Portuguese language">
                    </a>
                    <a class="jh_translationButton" data-lang="es">
                        <img src="assets/img/spain.png" alt="Spanish" data-translate-alt="Spanish language">
                    </a>
                    <a class="jh_translationButton" data-lang="en">
                        <img src="assets/img/united-kingdom.png" alt="English" data-translate-alt="English language">
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

class CardComponent extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'description', 'img-src', 'data-translate-title', 'data-translate-description'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        const translatedTitle = this.getAttribute('data-translate-title') || this.getAttribute('title') || 'Events and activities';
        const translatedDesc = this.getAttribute('data-translate-description') || this.getAttribute('description') || 'Check activities around Wimbledon';
        const imgSrc = this.getAttribute('img-src') || 'assets/img/gettyimages-1502975896-2048x2048.jpg';

        this.innerHTML = `
            <div class="jh_card">
                <img src="${imgSrc}" alt="${translatedTitle}" data-translate-alt="${translatedTitle}">
                <div class="jh_cardContainer">
                    <h4 data-translate><b>${translatedTitle}</b></h4>
                    <p data-translate>${translatedDesc}</p>
                </div>
            </div>
        `;
    }
}

class FooterComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<footer>
                            <span class="jh_footerCopyright" data-translate>Jose Henrique Pinto Joanoni @ 2025</span>
                        </footer>`;
    }
}

class ModalComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="overlay hidden"></div>
            <section class="modal hidden">
                <div class="flex">
                    <button class="btn-close" aria-label="Close modal">x</button>
                </div>
                <div class="modal-content"></div>
            </section>`;
    }
}

customElements.define('main-header', HeaderComponent);
customElements.define('nav-bar', NavBarComponent);
customElements.define('activity-card', CardComponent);
customElements.define('footer-page', FooterComponent);
customElements.define('modal-component', ModalComponent);