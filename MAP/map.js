const STOPS = [
  { name: "Tunis",   latlng: [36.8190, 10.1658] },
  { name: "Sousse",  latlng: [35.8264, 10.6368] }
];
const ANIMATION_SPEED = 0.008; // lower = slower

// Map init
const map = L.map('map', { zoomControl: true }).setView([36.3, 10.4], 8);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CARTO',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// Icons
function makeCircle(color) {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 0 0 2px ${color};"></div>`,
    iconSize: [14,14], iconAnchor: [7,7], className: ''
  });
}

const carIcon = L.divIcon({
  html: `<div id="car-emoji" style="font-size:26px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));transform-origin:center;transition:transform 0.1s;">🚗</div>`,
  iconSize: [26,26], iconAnchor: [13,13], className: ''
});

STOPS.forEach((s, i) => {
  const color = i === 0 ? '#3b9edd' : '#e24b4a';
  L.marker(s.latlng, { icon: makeCircle(color) }).addTo(map)
    .bindPopup(`<b>${s.name}</b><br>${i === 0 ? 'Departure' : 'Destination'}`);
});

// Polylines
const ghostLine = L.polyline([], { color: '#333', weight: 3, dashArray: '5,5' }).addTo(map);
const drivenLine = L.polyline([], { color: '#3b9edd', weight: 5, lineCap: 'round', lineJoin: 'round' }).addTo(map);
const carMarker = L.marker(STOPS[0].latlng, { icon: carIcon }).addTo(map);

// Animation state
let routeCoords = [];
let animFrame = null;
let pointIdx = 0;
let paused = false;

async function fetchRoute() {
  const coords = STOPS.map(s => `${s.latlng[1]},${s.latlng[0]}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.code !== 'Ok') throw new Error('OSRM error: ' + data.code);

    const route = data.routes[0];
    routeCoords = route.geometry.coordinates.map(c => [c[1], c[0]]); // GeoJSON is [lng,lat]

    const distKm = (route.distance / 1000).toFixed(1);
    const durMin = Math.round(route.duration / 60);
    const hours = Math.floor(durMin / 60);
    const mins = durMin % 60;

    document.getElementById('distVal').textContent = distKm + ' km';
    document.getElementById('durVal').textContent = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

    ghostLine.setLatLngs(routeCoords);
    map.fitBounds(ghostLine.getBounds(), { padding: [50, 50] });
    carMarker.setLatLng(routeCoords[0]);

    document.getElementById('btnPlay').disabled = false;

  } catch (err) {
    console.error(err);
  }
}

function startAnimation() {
  if (routeCoords.length === 0) return;
  if (animFrame) return;
  paused = false;
  document.getElementById('btnPause').disabled = false;
  document.getElementById('btnPlay').disabled = true;
  animate();
}

function togglePause() {
  if (paused) {
    paused = false;
    document.getElementById('btnPause').textContent = '⏸ Pause';
    animate();
  } else {
    paused = true;
    document.getElementById('btnPause').textContent = '▶ Resume';
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  }
}

function resetAnimation() {
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  pointIdx = 0; paused = false;
  drivenLine.setLatLngs([]);
  if (routeCoords.length) carMarker.setLatLng(routeCoords[0]);
  document.getElementById('progVal').textContent = '0%';
  document.getElementById('btnPlay').disabled = false;
  document.getElementById('btnPause').disabled = true;
  document.getElementById('btnPause').textContent = '⏸ Pause';
}

let subProgress = 0;

function animate() {
  if (paused) return;
  if (pointIdx >= routeCoords.length - 1) {
    carMarker.setLatLng(routeCoords[routeCoords.length - 1]);
    drivenLine.setLatLngs(routeCoords);
    document.getElementById('progVal').textContent = '100%';
    document.getElementById('btnPause').disabled = true;
    animFrame = null;
    return;
  }

  const a = routeCoords[pointIdx];
  const b = routeCoords[pointIdx + 1];
  const lat = a[0] + (b[0] - a[0]) * subProgress;
  const lng = a[1] + (b[1] - a[1]) * subProgress;
  const pos = [lat, lng];

  carMarker.setLatLng(pos);
  drivenLine.setLatLngs(routeCoords.slice(0, pointIdx + 1).concat([pos]));

  const pct = Math.round(((pointIdx + subProgress) / (routeCoords.length - 1)) * 100);
  document.getElementById('progVal').textContent = pct + '%';

  subProgress += ANIMATION_SPEED;
  if (subProgress >= 1) { subProgress = 0; pointIdx++; }

  animFrame = requestAnimationFrame(animate);
}

// Boot
document.getElementById('btnPlay').disabled = true;
fetchRoute();
