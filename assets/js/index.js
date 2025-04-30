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
function initTranslations() {
    const observer = new MutationObserver((mutations) => {
        const buttons = document.querySelectorAll('.jh_translationButton');
        if (buttons.length > 0) {
            observer.disconnect();
            console.log('Translation buttons found:', buttons.length);
            setupTranslationListeners(buttons);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function setupTranslationListeners(buttons) {
    buttons.forEach(button => {
        // console.log('Adding listener to:', button);

        button.addEventListener('click', async function () {
            console.log('Translation button clicked!');
            let originalHTML = this.innerHTML;
            // console.log('API Key:', window.API_KEYS?.translation);

            try {
                const targetLang = this.dataset.lang;
                const elements = document.querySelectorAll('[data-translate]');

                if (!window.API_KEYS?.translation) {
                    throw new Error('API key not configured');
                }

                this.innerHTML = `<span class="loading">Translating...</span>`;

                const translations = await Promise.all(
                    Array.from(elements).map(async element => {
                        try {
                            const isCardComponent = element.hasAttribute('data-translate-title');
                            const text = element.textContent.trim();

                            if (!isCardComponent && text) {
                                const response = await fetch(
                                    `https://translation.googleapis.com/language/translate/v2?key=${window.API_KEYS.translation}`,
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            q: text,
                                            target: targetLang,
                                            format: 'text'
                                        }),
                                    }
                                );

                                if (!response.ok) {
                                    const error = await response.json();
                                    throw new Error(error.error.message);
                                }

                                const data = await response.json();
                                return {
                                    element,
                                    translation: data.data.translations[0].translatedText
                                };
                            }

                            else if (isCardComponent) {
                                const titleText = element.getAttribute('data-translate-title') || '';
                                const descText = element.getAttribute('data-translate-description') || '';

                                const titleResponse = await fetch(
                                    `https://translation.googleapis.com/language/translate/v2?key=${window.API_KEYS.translation}`,
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            q: titleText,
                                            target: targetLang,
                                            format: 'text'
                                        }),
                                    }
                                );

                                const descResponse = await fetch(
                                    `https://translation.googleapis.com/language/translate/v2?key=${window.API_KEYS.translation}`,
                                    {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            q: descText,
                                            target: targetLang,
                                            format: 'text'
                                        }),
                                    }
                                );

                                if (!titleResponse.ok || !descResponse.ok) {
                                    const error = await titleResponse.json().catch(() => descResponse.json());
                                    throw new Error(error.error.message);
                                }

                                const titleData = await titleResponse.json();
                                const descData = await descResponse.json();

                                return {
                                    element,
                                    translation: {
                                        title: titleData.data.translations[0].translatedText,
                                        description: descData.data.translations[0].translatedText
                                    }
                                };
                            }

                            return { element, translation: null };

                        } catch (error) {
                            console.error('Translation error for element:', element, error);
                            return { element, translation: null };
                        }
                    })
                );

                translations.forEach(({ element, translation }) => {
                    if (element && translation) {
                        if (typeof translation === 'string') {
                            element.textContent = translation;
                            element.setAttribute('data-translated', 'true');
                        } else if (typeof translation === 'object') {
                            element.setAttribute('data-translate-title', translation.title);
                            element.setAttribute('data-translate-description', translation.description);
                            element.setAttribute('data-translated', 'true');
                        }
                    }
                });

            } catch (error) {
                console.error('Translation error:', error);
                alert(`Translation failed: ${error.message}`);
            } finally {
                this.innerHTML = originalHTML;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initTranslations);

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
                            <div id="waypointsContainer">
                                <div class="waypoint-group">
                                    <input type="text" 
                                           class="waypoint-input" 
                                           placeholder="Enter starting address"
                                           required>
                                    <button type="button" 
                                            class="jh_button jh_buttonSecondary add-waypoint"
                                            id="addWaypointBtn">+ Add Stop</button>
                                </div>
                            </div>
                            <div class="travel-modes">
                                <label><input type="radio" name="travelMode" value="DRIVING" checked> Driving</label>
                                <label><input type="radio" name="travelMode" value="WALKING"> Walking</label>
                                <label><input type="radio" name="travelMode" value="TRANSIT"> Transit</label>
                            </div>
                            <button type="submit" class="jh_button jh_buttonPrimary">Get Directions</button>
                        </form>
                        <div id="modalMap" style="height: 300px; width: 100%; margin-top: 20px;"></div>
                        <div id="directionsPanel"></div>
                    </div>`;

            modalMap = new google.maps.Map(document.getElementById('modalMap'), {
                zoom: 12,
                center: wimbledonLocation
            });

            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer({
                map: modalMap,
                panel: document.getElementById('directionsPanel'),
                suppressMarkers: false
            });

            const addWaypointBtn = document.getElementById('addWaypointBtn');

            function updateAddButtonState() {
                const waypointCount = document.querySelectorAll('.waypoint-group').length - 1;
                addWaypointBtn.disabled = waypointCount >= 3;
                if (waypointCount >= 3) {
                    addWaypointBtn.textContent = 'Max 3 stops';
                    addWaypointBtn.classList.add('jh_buttonDisabled');
                } else {
                    addWaypointBtn.textContent = '+ Add Stop';
                    addWaypointBtn.classList.remove('jh_buttonDisabled');
                }
            }

            addWaypointBtn.addEventListener('click', () => {
                const waypointCount = document.querySelectorAll('.waypoint-group').length - 1;
                if (waypointCount < 3) {
                    addWaypointField();
                    updateAddButtonState();
                }
            });

            document.getElementById('routeForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                calculateAndDisplayRoute();
            });

            updateAddButtonState();
        }
    });

    function addWaypointField() {
        const container = document.getElementById('waypointsContainer');
        const waypointGroup = document.createElement('div');
        waypointGroup.className = 'waypoint-group';
        waypointGroup.innerHTML = `
                <input type="text" 
                       class="waypoint-input" 
                       placeholder="Enter stop address">
                <button type="button" class="jh_button jh_buttonDanger remove-waypoint">x</button>`;
        container.appendChild(waypointGroup);

        waypointGroup.querySelector('.remove-waypoint').addEventListener('click', function() {
            container.removeChild(waypointGroup);
            updateAddButtonState();
        });
    }

    async function calculateAndDisplayRoute() {
        try {
            const startAddress = document.querySelector('.waypoint-input').value;
            const travelMode = document.querySelector('input[name="travelMode"]:checked').value;

            const waypointInputs = Array.from(document.querySelectorAll('.waypoint-input')).slice(1);
            const waypoints = waypointInputs
                .filter(input => input.value.trim() !== '')
                .map(input => ({
                    location: input.value,
                    stopover: true
                }));

            const request = {
                origin: startAddress,
                destination: wimbledonLocation,
                waypoints: waypoints,
                travelMode: travelMode,
                optimizeWaypoints: true,
                provideRouteAlternatives: false
            };

            const response = await directionsService.route(request);
            directionsRenderer.setDirections(response);

            const directionsPanel = document.getElementById('directionsPanel');
            directionsPanel.innerHTML = '';

            const summary = document.createElement('div');
            summary.className = 'route-summary';

            const legs = response.routes[0].legs;
            let totalDistance = 0;
            let totalDuration = 0;

            legs.forEach(leg => {
                totalDistance += leg.distance.value;
                totalDuration += leg.duration.value;
            });

            summary.innerHTML = `
                    <h4>Route Summary (${travelMode.toLowerCase()})</h4>
                    <p>Total Distance: ${(totalDistance / 1000).toFixed(1)} km</p>
                    <p>Total Duration: ${Math.floor(totalDuration / 60)} minutes</p>
                    <p>Number of stops: ${waypoints.length}</p>`;

            directionsPanel.appendChild(summary);

        } catch (error) {
            console.error('Directions request failed:', error);
            modalContent.innerHTML += `<div class="error">Could not find route: ${error.message}</div>`;
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

/** PWA REGISTERING */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installButton = document.createElement('button');
    installButton.className = 'pwa-install-btn';
    installButton.textContent = 'Install App';
    installButton.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted install');
            }
            deferredPrompt = null;
        });
    };

    document.body.appendChild(installButton);
});