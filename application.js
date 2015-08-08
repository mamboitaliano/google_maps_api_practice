var portrero = new google.maps.LatLng(37.750538,-122.4050346);

// Add a Home control that returns the user to London
function HomeControl(controlDiv, map) {
  controlDiv.style.padding = '5px';

  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'black';
  controlUI.style.color = 'orange';
  controlUI.style.border = '1px solid orange';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'current locaiton';
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial, sans-serif';
  controlText.style.fontSize='12px';
  controlText.style.paddingLeft = '4px';
  controlText.style.paddingRight = '4px';
  controlText.innerHTML = '<b>Home<b>'
  controlUI.appendChild(controlText);

  google.maps.event.addDomListener(controlUI, 'click', function() {
    map.setCenter(portrero);
  })
}

function initialize() {
  var mapProp = {
    center:portrero, // <- LatLng is where we want to send location data from phone
    zoom:15,
    mapTypeId:google.maps.MapTypeId.HYBRID,
    panControl:false,
    zoomControl:true,
    zoomControlOptions: {
      style:google.maps.ZoomControlStyle.SMALL,
      // position:google.maps.ControlPosition.BOTTOM_RIGHT
    },
    mapTypeControl:false,
    scaleControl:false,
    streetViewControl:true,
    overviewMapControl:false,
    rotateControl:false,
  };

  // builds map
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
  map.setTilt(0);
  // Grab radius of skatepark
  var skateparkRadius = new google.maps.Circle({
    center:portrero,
    radius:50,
    strokeColor:"#0000FF",
    strokeOpacity:1,
    strokeWeight:2,
    fillColor:"#0000FF",
    fillOpacity:0.4
  });
  skateparkRadius.setMap(map);

  // drop marker
  var portreroMarker = new google.maps.Marker({
    position:portrero,
    animation:google.maps.Animation.DROP,
  });
  portreroMarker.setMap(map);

  // add an event listener (setZoom()) to marker
  google.maps.event.addListener(portreroMarker, 'click', function() {
    map.setZoom(18);
    map.setCenter(portreroMarker.getPosition());
  });
  google.maps.event.addDomListener(window, 'load', initialize);

  // open up info window when we click on marker
  var infowindow = new google.maps.InfoWindow({
    content: "Badazz skate park fool"
  });

  google.maps.event.addListener(portreroMarker, 'click', function() {
    // infowindow.open(map, portreroMarker);
    var service = new google.maps.StreetViewService();
    service.getPanoramaByLocation(portreroMarker.getPosition(), 200, function(result, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var panorama = map.getStreetView();
        panorama.setPosition(result.location.latLng);
        panorama.setVisible(true);
      } else {
        alert("No street view is available within " + 200 + " meters");
        return;
      }
    });
    map.getStreetView();
  });

  // Set Markers and Open InfoWindow for Each Marker
  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng);
  });

  function  placeMarker(location) {
    var marker = new google.maps.Marker({
      position:location,
      map: map,
    });

    var infowindow = new google.maps.InfoWindow({
      content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
    });
    infowindow.open(map, marker);
  }

  var homeControlDiv = document.createElement('div');
  var homeControl = new HomeControl(homeControlDiv, map);
  // homeControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
}



google.maps.event.addDomListener(window, 'load', initialize);


