// Reference to Google Map Sample https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
var styles = [
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e0efef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
];

var marker;
var geocoder;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    styles: styles,
    scrollwheel: false
  });
  var geoloccontrol = new klokantech.GeolocationControl(map, 16);

  // Search Bar on Map reference https://google-developers.appspot.com/maps/documentation/javascript/examples/geocoding-simple
  geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  var input = (document.getElementById('location'));
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    localStorage.lat = place.geometry.location.lat();
    localStorage.lng = place.geometry.location.lng();
  });

  function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('location').value;
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    })
  }
  setPublicMarker(map)
  if (localStorage.myToto){
    setPrivateMarker(map)
  }
  function setPublicMarker(resultsMap){
    var addresses = JSON.parse(localStorage.publictoto)
    addresses.forEach((el)=>{
      var infowindow = new google.maps.InfoWindow;
      var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h3 id="firstHeading" class="firstHeading">'+el.name+'</h3>'+
      '<div id="bodyContent">'+
      '<ul class="list-group">' +
      '<li class="list-group-item">Location: '+el.location+ '</li><br>'+
      '<li class="list-group-item">Open Yearround: '+el.open_yearround+ '</li><br>'+
      '<li class="list-group-item">Handicap Accessible: '+el.handicap_accessible+ '</li><br>'+
      '<li class="list-group-item">Borough: '+el.borough+ '</li><br>'+
      '<li class="list-group-item">Comment: '+el.comments+ '</li><br>'+
      '</ul>'+
      '</div>'+
      '</div>';
      var latlng = new google.maps.LatLng(el.latitude, el.longitude);
      var pmarker = new google.maps.Marker({
        map: resultsMap,
        position: latlng,
        animation: google.maps.Animation.DROP,
        icon: '../img/bluemarker.png'
      })
      infowindow.setContent(contentString)
      pmarker.addListener('click', function() {
        infowindow.close()
        infowindow.open(map, pmarker);
      })
      resultsMap.addListener('click', function(){
        infowindow.close()
      })
    })
  }
  function setPrivateMarker(resultsMap){
    var addresses = JSON.parse(localStorage.myToto)
    addresses.forEach((el)=>{
      var infowindow = new google.maps.InfoWindow;
      var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h3 id="firstHeading" class="title full-width">'+el.name+'</h3>'+
      '<div id="bodyContent">'+
      '<ul class="list-group">' +
      '<li class="list-group-item">Location: '+el.location+ '</li><br>'+
      '<li class="list-group-item">Comment: '+el.comments+ '</li><br>'+
      '</ul>'+
      '</div>'+
      '</div>';
      var latlng = new google.maps.LatLng(el.latitude, el.longitude);
      var pmarker = new google.maps.Marker({
        map: resultsMap,
        position: latlng,
        animation: google.maps.Animation.DROP,
        icon: '../img/pinkmarker.png'
      })
      infowindow.setContent(contentString)
      pmarker.addListener('click', function() {
        infowindow.close()
        infowindow.open(map, pmarker);
      })
      resultsMap.addListener('click', function(){
        infowindow.close()
      })
    })
  }

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos)
      marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: pos,
        icon: 'https://www.google.com/support/enterprise/static/geo/cdate/art/dots/blue_dot.png'
      });
      marker.addListener('click', toggleBounce);
    }, function() {
      handleLocationError(true, marker, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, marker, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  marker.setPosition(pos);
  marker.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}


function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
