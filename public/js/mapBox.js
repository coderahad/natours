/*eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiYWhhZGhvc3NhaW4iLCJhIjoiY2tidDBjdDk1MDU4YjJxbnN6aTQ4N3JtZiJ9.eK0gnNWh8Xq2j1WyYpVyZQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ahadhossain/ckbt1bkr00gev1iohohavw2hw',
    center: [ -118.214010,33.981452],
    zoom: 10,
    interactive: false
});

