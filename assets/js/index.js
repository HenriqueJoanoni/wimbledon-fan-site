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

/** AMUSEMENT MODALS */
document.addEventListener('DOMContentLoaded', () => {
    const modalContent = document.querySelector('.modal-content');
    const wimbledonLocation = {lat: 51.4340, lng: -0.2143};
    let directionsService, directionsRenderer, modalMap;

    document.addEventListener('modalOpened', async (e) => {
        const modalType = e.detail?.modalType;

        if (modalType === 'transportation-info') {
            modalContent.innerHTML = `
                <div class="route-planner">
                    <h3>Plan Your Route to Wimbledon</h3>
                    <form id="routeForm">
                        <input type="text" 
                               id="startAddress" 
                               placeholder="Enter your starting address"
                               required>
                        <button type="submit" class="jh_button jh_buttonPrimary">Get Directions</button>
                    </form>
                    <div id="modalMap" style="height: 300px; width: 100%; margin-top: 20px;"></div>
                    <div id="directionsPanel"></div>
                </div>
            `;

            modalMap = new google.maps.Map(document.getElementById('modalMap'), {
                zoom: 12,
                center: wimbledonLocation
            });

            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer({
                map: modalMap,
                panel: document.getElementById('directionsPanel')
            });

            document.getElementById('routeForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const startAddress = document.getElementById('startAddress').value;

                ['DRIVING', 'WALKING', 'TRANSIT'].forEach(mode => {
                    calculateAndDisplayRoute(startAddress, mode);
                });
            });
        }

        document.addEventListener('modalOpened', async (e) => {
            const modalType = e.detail?.modalType;

            if (modalType === 'places-to-go') {
                modalContent.innerHTML = `
                <div class="places-container">
                    <h3>Interesting Places Around Wimbledon</h3>
                    <div id="placesMap" style="height: 400px; width: 100%;"></div>
                    <div id="placesList" style="margin-top: 20px;"></div>
                </div>
            `;

                const placesMap = new google.maps.Map(document.getElementById('placesMap'), {
                    center: wimbledonLocation,
                    zoom: 14
                });

                const placesService = new google.maps.places.PlacesService(placesMap);
                const placesList = document.getElementById('placesList');

                const request = {
                    location: wimbledonLocation,
                    radius: 2000, // 2km radius
                    types: ['restaurant', 'park', 'shopping_mall', 'cafe', 'museum']
                };

                placesService.nearbySearch(request, (results, status, pagination) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        results.forEach(place => {
                            // Add marker
                            const marker = new google.maps.Marker({
                                position: place.geometry.location,
                                map: placesMap,
                                title: place.name
                            });

                            // Add info window
                            const infoWindow = new google.maps.InfoWindow({
                                content: `
                                <h5>${place.name}</h5>
                                <p>${place.vicinity}</p>
                                ${place.rating ? `<p>Rating: ${place.rating}/5</p>` : ''}
                            `
                            });

                            marker.addListener('click', () => {
                                infoWindow.open(placesMap, marker);
                            });

                            // Add to list
                            const placeItem = document.createElement('div');
                            placeItem.className = 'place-item';
                            placeItem.innerHTML = `
                            <h4>${place.name}</h4>
                            <p>Address: ${place.vicinity}</p>
                            ${place.rating ? `<p>Rating: ${place.rating}/5</p>` : ''}
                            <hr>
                        `;
                            placesList.appendChild(placeItem);
                        });
                    } else {
                        console.error('Places request failed:', status);
                        modalContent.innerHTML += `<div class="error">Could not load places: ${status}</div>`;
                    }
                });
            }
        });
    });

    async function calculateAndDisplayRoute(startAddress, travelMode) {
        try {
            const response = await directionsService.route({
                origin: startAddress,
                destination: wimbledonLocation,
                travelMode: travelMode,
                provideRouteAlternatives: true
            });

            directionsRenderer.setDirections(response);

            const routeInfo = document.createElement('div');
            routeInfo.className = 'route-option';
            routeInfo.innerHTML = `
                <h4>By ${travelMode.toLowerCase()}</h4>
                <p>Distance: ${response.routes[0].legs[0].distance.text}</p>
                <p>Duration: ${response.routes[0].legs[0].duration.text}</p>
            `;
            document.getElementById('directionsPanel').appendChild(routeInfo);

        } catch (error) {
            console.error('Directions request failed:', error);
            modalContent.innerHTML += `
                <div class="error">Could not find route: ${error.message}</div>
            `;
        }
    }
});