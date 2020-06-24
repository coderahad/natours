/*eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiYWhhZGhvc3NhaW4iLCJhIjoiY2tidDBjdDk1MDU4YjJxbnN6aTQ4N3JtZiJ9.eK0gnNWh8Xq2j1WyYpVyZQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ahadhossain/ckbt1bkr00gev1iohohavw2hw',
    // center: [ -118.214010,33.981452],
    // zoom: 10,
    // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // 1) Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // 2) Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);
    
    // 3) Extend map bounds to include current location
    bounds.extend(loc.coordinates);
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});