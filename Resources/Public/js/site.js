$(document).ready(function() {
  var offsetCenter = function(map, latlng,offsetx,offsety) {
    var scale = Math.pow(2, map.getZoom());
    var nw = new google.maps.LatLng(
        map.getBounds().getNorthEast().lat(),
        map.getBounds().getSouthWest().lng()
    );

    var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
    var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

    var worldCoordinateNewCenter = new google.maps.Point(
        worldCoordinateCenter.x - pixelOffset.x,
        worldCoordinateCenter.y + pixelOffset.y
    );

    var newCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

    map.setCenter(newCenter);
  }

  var markAndZoomToLocation = function(map, element) {
    var location = element.data("location");

    geocoder.geocode( { 'address': location}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var offsetX = $(".photo").width() / 4;
        var offsetY = $(window).height() /4;

        offsetCenter(map, results[0].geometry.location, -offsetX, -offsetY);

        if(marker !== undefined) {
          marker.setMap(undefined);
        }

        marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      }
    });
  };

  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var marker;
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);
  var geocoder = new google.maps.Geocoder();

  $('#fullpage').fullpage({
    normalScrollElements: '.preview',
    afterLoad: function(anchorLink, index){
      markAndZoomToLocation(map, $(this));
    }
  });

  $(".preview img").on("click", function(e) {
    $(e.target).closest(".photos").find(".photo img").attr("src", $(e.target).attr("src"));
    e.preventDefault();
  });

  google.maps.event.addListenerOnce(map, "bounds_changed", function() {
    markAndZoomToLocation(map, $(".section:first"));
  });
});
