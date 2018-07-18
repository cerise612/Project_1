    // geolocation
    function writeAddressName(latLng) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "location": latLng
        },
          function (results, status) {
            if (status == google.maps.GeocoderStatus.OK)
              // document.getElementById("address").innerHTML = results[0].formatted_address;
              console.log(results[0].formatted_address);
            else
              document.getElementById("error").innerHTML += "Unable to retrieve your address" + "<br />";
          });
      }
  
      // multiple users
      var userLocations = [
      ];
      function multiUser(userLatLng) {
        userLocations.push(userLatLng)
  
        console.log("working " + userLatLng)
      };
  
      // location retrieved
      function geolocationSuccess(position) {
        var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // var userLatLng = {lat: position.coords.latitude, long: position.coords.latitude };
        console.log(position.coords.latitude)
        multiUser(userLatLng);
        // Write the formatted address
        writeAddressName(userLatLng);
  
        var myOptions = {
          zoom: 10,
          center: userLatLng,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#0294a5' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#263c3f' }]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b9a76' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#03353e' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1f2835' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#f3d19c' }]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#2f3948' }]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#515c6d' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#17263c' }]
            }
          ]
          
          
        };
        // Draw the map
        var mapObject = new google.maps.Map(document.getElementById("map"), myOptions, {

        });
        // Place the marker
        var marker, i;
  
        for (var i = 0; i < userLocations.length; i++) {
          marker = new google.maps.Marker({
            position: userLocations[i],
            map: mapObject,
            title: 'userMarker',
            zoom: 10,
            icon: {
              url: "assets/images/Flag_2.svg",
              scaledSize: new google.maps.Size(64, 64)
            }
            // fillColor: '#c1403d',
          });
          console.log("working " + userLocations[i]);
          google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
              infowindow.setContent(userLocations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
  
        //multi user cirle
        for (var j = 0; j < userLocations.length; j++) {
          circle = new google.maps.Circle({
            center: userLocations[j],
            radius: position.coords.accuracy,
            map: mapObject,
            fillColor: '#a79c93',
            fillOpacity: 0.5,
            strokeColor: '#c1403d',
            strokeOpacity: 1.0
          });
          mapObject.fitBounds(circle.getBounds());
          console.log("working " + userLocations[j]);
          google.maps.event.addListener(circle, 'click', (function (circle, j) {
            return function () {
              infowindow.setContent(userLocations[j][0]);
              infowindow.open(map, circle);
            }
          })(circle, j));
        };

        //central location
        var bound = new google.maps.LatLngBounds();
        for (k = 0; k < userLocations.length; k++) {
          bound.extend(new google.maps.LatLng(userLocations[k]));
          // OTHER CODE
        }
        console.log(bound.getCenter());
      }
  
      // Error
      function geolocationError(positionError) {
        document.getElementById("error").innerHTML += "Error: " + positionError.message + "<br />";
      }
  
      // geolocate user
      function geolocateUser() {
        // If the browser supports the Geolocation API
        if (navigator.geolocation) {
          var positionOptions = {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
          };
          navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
        }
        else
          document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
      }
  
      //load on window
      window.onload = geolocateUser;