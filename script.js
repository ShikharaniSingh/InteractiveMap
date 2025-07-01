// 🌍 Initialize world view
const map = L.map('map').setView([0, 0], 2);

// 🗺️ Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 🧷 Custom marker icon
const customIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 45],
    iconAnchor: [17, 42],
    popupAnchor: [0, -40],
});

// 📍 Locations around the world
const locations = [
    {
        name: "Taj Mahal",
        lat: 27.1751,
        lng: 78.0421,
        description: "Iconic white marble mausoleum in Agra, India.",
        category: "monument"
    },
    {
        name: "Eiffel Tower",
        lat: 48.8584,
        lng: 2.2945,
        description: "Famous iron tower in Paris, France.",
        category: "monument"
    },
    {
        name: "Statue of Liberty",
        lat: 40.6892,
        lng: -74.0445,
        description: "Iconic symbol of freedom in New York, USA.",
        category: "monument"
    },
    {
        name: "Tokyo Tower",
        lat: 35.6586,
        lng: 139.7454,
        description: "Red and white tower in Tokyo, Japan.",
        category: "monument"
    },
    {
        name: "Sydney Opera House",
        lat: -33.8568,
        lng: 151.2153,
        description: "Iconic performing arts center in Australia.",
        category: "heritage"
    },
    {
        name: "Kaziranga National Park",
        lat: 26.5775,
        lng: 93.1711,
        description: "Home to one-horned rhinoceroses in India.",
        category: "park"
    }
];

const markers = [];

// 📌 Add markers
locations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b><br>${loc.description}`);
    markers.push({ marker, name: loc.name.toLowerCase(), category: loc.category.toLowerCase() });
});

// 🔎 Search
document.getElementById('searchInput').addEventListener('input', function () {
    const search = this.value.toLowerCase();
    const found = markers.find(m =>
        m.name.includes(search) || m.category.includes(search)
    );
    if (found) {
        map.setView(found.marker.getLatLng(), 13);
        found.marker.openPopup();
    }
});

// 🎛️ Category filter
document.getElementById('categoryFilter').addEventListener('change', function () {
    const selected = this.value.toLowerCase();
    markers.forEach(({ marker, category }) => {
        if (!selected || category === selected) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });
});

// 📍 Geolocation
document.getElementById('geoBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("📍 You are here!")
                    .openPopup();
                map.setView([lat, lng], 13);
            },
            () => {
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// 🧭 Auto-fit to all markers
const markerGroup = L.featureGroup(markers.map(m => m.marker));
map.fitBounds(markerGroup.getBounds());
