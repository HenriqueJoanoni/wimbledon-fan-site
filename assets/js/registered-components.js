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

class CardComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="card">
                    <img src="assets/img/gettyimages-1502975896-2048x2048.jpg" alt="Avatar" style="width:100%">
                    <div class="container">
                        <h4><b>Events and activities</b></h4>
                        <p>Check the events and activities happening around Wimbledon</p>
                    </div>
                </div>`
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
customElements.define('activity-card', CardComponent);
customElements.define('footer-page', FooterComponent);