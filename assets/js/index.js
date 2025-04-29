/** MAIN MAP WITH TOGGLEABLE POINTS OF INTEREST */
let map;
let placesService;
let infoWindow;
let currentMarkers = [];
const courtMarkers = [];
const wimbledonLocation = {lat: 51.4340, lng: -0.2143};

const courtLocations = [
    {lat: 51.4340, lng: -0.2143},
    {lat: 51.4332, lng: -0.2135},
    {lat: 51.4338, lng: -0.2151},
    {lat: 51.4345, lng: -0.2148},
    {lat: 51.4335, lng: -0.2160}
];

function initMap() {
    map = new google.maps.Map(document.getElementById('jh_locations'), {
        zoom: 15,
        center: wimbledonLocation,
        mapId: 'WIMBLEDON_STYLED_MAP',
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "hide_poi"]
        }
    });

    hideDefaultPOIs(map);

    courtLocations.forEach((court, index) => {
        const marker = new google.maps.Marker({
            position: court,
            map: map,
            title: getCourtName(index),
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/tennis.png',
                scaledSize: new google.maps.Size(32, 32)
            }
        });
        courtMarkers.push(marker);
    });

    placesService = new google.maps.places.PlacesService(map);
    infoWindow = new google.maps.InfoWindow();
}

function getCourtName(index) {
    const courtNames = [
        'Centre Court',
        'No.1 Court',
        'No.2 Court',
        'No.3 Court',
        'Court 12'
    ];
    return courtNames[index] || `Wimbledon Court ${index + 1}`;
}

function hideDefaultPOIs(map) {
    const styleRules = [
        {featureType: "poi", stylers: [{visibility: "off"}]},
        {featureType: "transit", stylers: [{visibility: "off"}]}
    ];

    const styledMap = new google.maps.StyledMapType(styleRules, {name: "Hide POI Wimbledon"});
    map.mapTypes.set('hide_poi', styledMap);
    map.setMapTypeId('hide_poi');
}

function showPointsOfInterest(type) {
    clearCurrentMarkers();
    courtMarkers.forEach(marker => marker.setMap(null));

    const request = {
        location: wimbledonLocation,
        radius: 1500,
        type: type
    };

    placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => createPOIMarker(place, type));
        }
    });
}

function createPOIMarker(place, type) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: {
            url: getIconForCategory(type),
            scaledSize: new google.maps.Size(32, 32)
        }
    });

    currentMarkers.push(marker);

    marker.addListener('click', () => {
        infoWindow.setContent(`
            <div class="poi-info">
                <h3>${place.name}</h3>
                <p>${place.vicinity}</p>
                ${place.rating ? `<p>⭐ ${place.rating}/5</p>` : ''}
                ${place.opening_hours?.open_now !== undefined ?
            `<p>${place.opening_hours.open_now ? '🟢 Open' : '🔴 Closed'}</p>` : ''}
            </div>
        `);
        infoWindow.open(map, marker);
    });
}

function getIconForCategory(category) {
    const icons = {
        restaurant: 'https://maps.google.com/mapfiles/ms/icons/restaurant.png',
        hotel: 'https://maps.google.com/mapfiles/ms/icons/lodging.png',
        parking: 'https://maps.google.com/mapfiles/ms/icons/parkinglot.png',
        cafe: 'https://maps.google.com/mapfiles/ms/icons/cafe.png',
        museum: 'https://maps.google.com/mapfiles/ms/icons/museum.png'
    };
    return icons[category] || 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
}

function clearCurrentMarkers() {
    currentMarkers.forEach(marker => marker.setMap(null));
    currentMarkers = [];

    courtMarkers.forEach(marker => marker.setMap(map));

    map.setCenter(wimbledonLocation);
    map.setZoom(16);
}

window.gm_authFailure = () => {
    document.getElementById('jh_locations').innerHTML =
        '<p>Map unavailable - Please check your internet connection</p>';
};

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

/** FAQ CONTROLLER */
document.querySelectorAll('.jh_faqQuestion').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.closest('.jh_faqItem');
        const answer = faqItem.querySelector('.jh_faqAnswer');
        const isActive = faqItem.classList.contains('jh_active');

        document.querySelectorAll('.jh_faqItem').forEach(item => {
            item.classList.remove('jh_active');
            item.querySelector('.jh_faqAnswer').classList.remove('jh_show');
        });

        if (!isActive) {
            faqItem.classList.add('jh_active');
            answer.classList.add('jh_show');
        }
    });
});