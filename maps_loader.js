function makeAJAXRequest(url,callback) {
    var xhttp;
    xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        callback(this);
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function gotDistances(xhttp) {
    console.log(xhttp.responseText)
  }

  function loadDistances() {
    var distanceMatrixAPI_KEY="AIzaSyBLB5vutmVUgj8ziYMz62vbdbRvr9UL7Z4"
    var start = encodeURI("1023 Sheridan Ave, Charlottesville, VA 22901") // | delineated locations!
    var end = encodeURI("13009 3rd St, Bowie, MD 20720")
    var distanceMatrixURL="https://maps.googleapis.com/maps/api/distancematrix/xml?origins="+start+"&destinations="+end+"&mode=driving&language=en-EN&key="+distanceMatrixAPI_KEY
    loadDistances(distanceMatrixURL, gotDistances)
  }

  function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      loadDistances();
      map.fitBounds(bounds);
    });
  }