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
    static get observedAttributes() {
        return ['title', 'description', 'img-src'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('title') || 'Events and activities';
        const description = this.getAttribute('description') || 'Check activities around Wimbledon';
        const imgSrc = this.getAttribute('img-src') || 'assets/img/gettyimages-1502975896-2048x2048.jpg';

        this.innerHTML = `
            <div class="jh_card">
                <img src="${imgSrc}" alt="${title}" style="width:100%">
                <div class="jh_cardContainer">
                    <h4><b>${title}</b></h4>
                    <p>${description}</p>
                </div>
            </div>
        `;
    }
}

class FooterComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<footer>
                            <span class="jh_footerCopyright">Jose Henrique Pinto Joanoni @ 2025</span>
                        </footer>`;
    }
}

class ModalComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="overlay hidden"></div>
            <section class="modal hidden">
                <div class="flex">
                    <img src="https://avatars.githubusercontent.com/u/62628408?s=96&v=4" 
                         width="50" 
                         height="50" 
                         alt="user">
                    <button class="btn-close" aria-label="Close modal">x</button>
                </div>
                <div class="modal-content">
                    <h3>Stay in touch</h3>
                    <p>This is a dummy newsletter form...</p>
                    <input type="email" id="email" placeholder="brendaneich@js.com" />
                    <button class="btn">Do Something</button>
                </div>
            </section>`;
    }
}

customElements.define('main-header', HeaderComponent);
customElements.define('nav-bar', NavBarComponent);
customElements.define('activity-card', CardComponent);
customElements.define('footer-page', FooterComponent);
customElements.define('modal-component', ModalComponent);