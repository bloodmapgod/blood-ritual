/* global Vue */

let nightStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
];

let redStyle = [
  {
    "stylers": [
      {
        "hue": "#B61530"
      },
      {
        "saturation": 60
      },
      {
        "lightness": -40
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#B61530"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "color": "#B61530"
      },
      {}
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "color": "#B61530"
      },
      {
        "lightness": 6
      }
    ]
  },
  {
    "featureType": "road.highway",
    "stylers": [
      {
        "color": "#B61530"
      },
      {
        "lightness": -25
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "stylers": [
      {
        "color": "#B61530"
      },
      {
        "lightness": -10
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "color": "#B61530"
      },
      {
        "lightness": 70
      }
    ]
  },
  {
    "featureType": "transit.line",
    "stylers": [
      {
        "color": "#B61530"
      },
      {
        "lightness": 90
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  }
];

let sv = new google.maps.StreetViewService();

function getRandomPanorama(callback, attempt = 0) {
  // https://developers.google.com/maps/documentation/javascript/examples/streetview-service
  let city = _.sample(cities);
  let pop = city[2];
  let radius = 2000; // m // @TODO By pop
  // 54.9006982,23.8650929

  let latDegPerM = 90 / 20000000;
  let lngDegPerM = 180 / 20000000; // 20M KM

  let lat = city[0] + Math.random() * latDegPerM * radius * (Math.random() > 0.5 ? 1 : -1); // [E/W] [-90,+90]
  let lng = city[1] + Math.random() * lngDegPerM * radius * (Math.random() > 0.5 ? 1 : -1); // [N/S] [-180,180]

  let randPoint = new google.maps.LatLng(lat, lng);

  // https://developers.google.com/maps/documentation/javascript/reference/3/#street-view
  let panoRequest = {
    location: randPoint,
    preference: google.maps.StreetViewPreference.BEST,
    radius: 5000,
    source: google.maps.StreetViewSource.OUTDOOR
  };

  sv.getPanoramaByLocation(panoRequest, (data, status) => {
    console.log('getPanoramaByLocation', data, status);
    if (status === 'OK') {
      callback(data.location.latLng, pop);
    } else if (attempt < 10) {
      getRandomPanorama(callback, attempt + 1);
    }
  });
}

// https://developers.google.com/maps/documentation/javascript/examples/streetview-embed
Vue.component('journey-circle', {
  data: function () {
    return {
      panoramaLatLng: null,
      population: null,
      marker: null,
      elSubmit: null,
      map: null,
      panorama: null,
      submitted: false
    };
  },
  created: function () {
  },
  mounted: function () {
    // https://developers.google.com/maps/documentation/javascript/examples/streetview-service

    getRandomPanorama((panoramaLatLng, pop) => {
      this.panoramaLatLng = panoramaLatLng;
      this.population = pop;
      this.renderPanorama(panoramaLatLng);
      this.renderMap();
    });
  },
  methods: {
    submitMarker: function () {
      let successRadius = 1000000; // 1000km

      let distance = getDistance( this.panoramaLatLng, this.marker.position);
      let success = distance < successRadius;
      console.log(distance);

      if (this.submitted) {
        let success = true; // @TODO calc score on country + distance
        this.$emit('close', success);
        return;
      }

      new google.maps.Marker({position: this.panoramaLatLng, map: this.map});
      let linePoints = [
        this.panoramaLatLng,
        this.marker.position
      ];

      let line = new google.maps.Polyline({
        path: linePoints,
        geodesic: true,
        strokeColor: '#000fff',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      line.setMap(this.map);

      let cityCircle = new google.maps.Circle({
        strokeColor: '#00ff77',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#004307',
        fillOpacity: 0.35,
        map: this.map,
        center: this.panoramaLatLng,
        radius: successRadius
      });

      let icon = success ?
          '<img class="inline-image" src="img/ez_small.png" alt="">'
        : '<img class="inline-image" src="img/feelsbadman_small.png" alt="">';

      this.submitted = true;
      this.elSubmit.innerHTML = 'CLOSE ' + icon;
      this.elSubmit.title = success ? 'Great Success' : 'You Failure';
    },
    toggleToMap: function () {
      this.panorama.setVisible(false);
    },
    toggleToPanorama: function () {
      this.panorama.setVisible(true);
    },
    renderPanorama: function (panoramaLatLng) {
      // https://developers.google.com/maps/documentation/javascript/reference/street-view?hl=en#StreetViewPanoramaOptions
      let panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
          fullscreenControl: false, // toggling between street/map view in fullscreen not resolved
          // fullscreenControlOptions don't work, using CSS override
          linksControl: false,
          addressControl: false,
          position: panoramaLatLng,
          pov: {heading: 165, pitch: 0},
          zoom: 1,
          showRoadLabels: false
        }
      );

      window.pan = panorama;

      // https://developers.google.com/maps/documentation/javascript/examples/control-custom
      // https://developers.google.com/maps/documentation/javascript/controls
      let toggleControl = document.createElement('div');
      toggleControl.id = 'show-map-control';
      toggleControl.title = 'Show Map';
      toggleControl.addEventListener('click', this.toggleToMap);

      //showMapControl.index = 1;
      panorama.controls[google.maps.ControlPosition.TOP_CENTER].push(toggleControl);

      this.panorama = panorama;
    },
    renderMap: function () {
      let map = new google.maps.Map(document.getElementById('map-view'), {
        fullscreenControl: false, // toggling between street/map view in fullscreen not resolved
        zoom: 4,
        center: {lat: 39.0445613, lng: 125.7526908},
        styles: redStyle,
        backgroundColor: '#AC1B31', // night:1B253C
        draggableCursor: 'crosshair'
        // disableDefaultUI: true
      });

      let toggleControl = document.createElement('div');
      toggleControl.id = 'show-panorama-control';
      toggleControl.title = 'Show Street View';
      toggleControl.addEventListener('click', this.toggleToPanorama);

      this.elSubmit = document.createElement('div');
      this.elSubmit.id = 'submit-market-control';
      this.elSubmit.innerText = 'SUBMIT';
      this.elSubmit.addEventListener('click', this.submitMarker);
      this.elSubmit.style.display = 'none';

      map.controls[google.maps.ControlPosition.TOP_CENTER].push(toggleControl);
      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(this.elSubmit);

      map.addListener('click', (e) => {
        if (!this.marker) {
          this.marker = new google.maps.Marker({position: e.latLng, map: map});
        } else {
          this.marker.setPosition(e.latLng);
        }
        this.elSubmit.style.display = 'block';
      });

      this.map = map;
    }
  },
  template: `
    <div id="journey-circle">
      <div id="street-view" style="height: 800px; width: 800px; border-radius: 50%"></div>
      <div id="map-view" style="height: 800px; width: 800px; border-radius: 50%"></div>
    </div>
  `
});
