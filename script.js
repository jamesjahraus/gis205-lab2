mapboxgl.accessToken = 'pk.eyJ1IjoiamphaHJhdXMiLCJhIjoiY2p5cGhqeW80MWZxajNtbG14ODdmcW93byJ9.xCZhD8JM5Joey43b-Wi__A';

// Add the map from stylesheet location.
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/jjahraus/ck87tapl41eg81im9pbtjrkhi', // stylesheet location
  center: [-105, 39.753], // starting position [lng, lat]
  hash: true, // If true , the map's position (zoom, center latitude, center longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL.
  zoom: 13, // starting zoom
  minZoom: 10, // minimum zoom
  maxZoom: 19 // maximum zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Add basemap.
map.on('load', function () {

  map.addLayer({
    'id': 'openstreetmap-basemap',
    'type': 'raster',
    'source': {
      'type': 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
      ]
    }
  }, 'denver-buildings')

})

// Add layer toggles

var toggleableLayerIds = ['denver-food-stores', 'denver-buildings'];

for (var i = 0; i < toggleableLayerIds.length; i++) {
  var id = toggleableLayerIds[i];

  var link = document.createElement('a');
  link.href = '#';
  link.className = 'active';
  link.textContent = id;

  link.onclick = function (e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();

    var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

    if (visibility === 'visible') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      this.className = '';
    } else {
      this.className = 'active';
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    }
  };

  var layers = document.getElementById('menu');
  layers.appendChild(link);
}

// Add buildings popup, and find closest food store to this building.
map.on('click', 'denver-buildings', function (e) {
  map.getCanvas().style.cursor = 'crosshair';
  var buildingType = e.features[0].properties.type;
  var buildingID = e.features[0].properties.id;

  // Find selected buildings turf point coordinates.
  var coordinates = [e.lngLat.lng, e.lngLat.lat]
  console.log("The coordinates:")
  console.log(coordinates)

  // Query all rendered features from a single layer
  var features = map.queryRenderedFeatures({ layers: ['denver-food-stores'] });
  console.log("The features:")
  console.log(features)

  // Create the feature collection from the features.
  var stores = turf.featureCollection(features);
  console.log("The stores:")
  console.log(stores)

  // Find the nearest store.
  var nearestStore = turf.nearestPoint(coordinates, stores);
  console.log("The nearest store:")
  console.log(nearestStore)

  // Find the stores coordinates.
  var coordStore = turf.getCoord(nearestStore);
  console.log("The nearest store's coordinates:")
  console.log(coordStore)

  // Find the store's LngLat.
  var lnglatStore = mapboxgl.LngLat.convert(coordStore);
  console.log("The nearest store's LngLat:")
  console.log(lnglatStore)

  // Find distance to store in meters.
  var options = { units: 'meters' };
  var distance = turf.distance(coordinates, coordStore, options);

  // Create a popup for building.
  var popupHTML = `<p>Building ID: ${buildingID} <br> Building Type: ${buildingType}</p>`;

  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(popupHTML)
    .addTo(map);

  // Create a popup for nearest store.
  var storeHTML = `<p>Nearest Store: ${coordStore} <br> Distance: ${distance} meters</p>`;

  new mapboxgl.Popup()
    .setLngLat(lnglatStore)
    .setHTML(storeHTML)
    .addTo(map);
})


// Reset cursor on zoom
map.on('zoom', function () {
  map.getCanvas().style.cursor = '';
})
