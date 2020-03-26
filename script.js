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