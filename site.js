---
---
;{% include js/jquery.min.js %}

;(function(context) {

    var mapkibera = {}

    mapkibera.global = function() {
        function scroll(el){
            $('html, body').animate({
                scrollTop: $(el).offset().top
            }, 500);
        }

        $('a[data-scroll]').click(function() {
            var to = $(this).attr('href');
            scroll(to);
            return false;
        });
    };
    mapkibera.slideShow = function(context) {
        var slideIndex = 1,
            $slide = $('[data-index]', context),
            slides = $slide.length;

        $('a.slide-control').click(function() {
            $slide.removeClass('active');
            if ($(this).hasClass('next')) {
                if (slideIndex >= slides) {
                    slideIndex = 1;
                } else {
                    slideIndex++;
                }
            } else {
                if (slideIndex <= 1) {
                    slideIndex = slides;
                } else {
                    slideIndex--;
                }
            }

           $('[data-index="slide-' + slideIndex + '"]', context).addClass('active');
            return false;
        });
    };

    mapkibera.map = function(context) {
      if (context.mapbox_styleId) {
        mapkibera.mapbox_map(context);
      } else {
        mapkibera.leaflet_map(context);
      }
    };

   mapkibera.mapbox_map = function(context) {

     mapboxgl.accessToken = 'pk.eyJ1IjoibWFwa2liZXJhIiwiYSI6ImNrMWdxdmd0cTE3a3czY3Mxc3Z5NDdpZmMifQ.c-CWCSx8UzZFVEDlDSJmag';
     var map = new mapboxgl.Map({
         container: 'map',
         style: context.mapbox_styleId,
         zoom: Number(context.zoom),
         center: [Number(context.lon), Number(context.lat)]
     });
     map.scrollZoom.disable();
     map.addControl(new mapboxgl.NavigationControl());

     var toggleableLayerIds = context.mapbox_layerIds.split(',');
     var toggleableLayerLabels = context.mapbox_layerLabels.split(',');

     for (var i = 0; i < toggleableLayerIds.length; i++) {
         var id = toggleableLayerIds[i];
         var label = toggleableLayerLabels[i];

         var link = document.createElement('a');
         link.id = id;
         link.href = '#';
         link.className = '';
         link.textContent = label;

         link.onclick = function (e) {
             var clickedLayer = this.id;
             e.preventDefault();
             e.stopPropagation();

             toggleableLayerIds.forEach((layerId) => {
                 var opacity = clickedLayer === layerId ? 1 : 0;
                 var className = clickedLayer === layerId ? 'active' : '';
                 document.getElementById(layerId).className = className;
                 //map.setPaintProperty(layerId, 'raster-opacity', opacity);
                 layerId.split(':').forEach((clickedId) => {
                   map.setPaintProperty(clickedId, 'raster-opacity', opacity);
                 });
             });
         };

         var layers = document.getElementById('mapbox-menu');
         layers.appendChild(link);
     }

   };

   mapkibera.leaflet_map = function(context) {
     if (context.zoom_control == 'hide') {
       var map = L.map(context.id, {zoomControl:false}).setView([parseFloat(context.lat), parseFloat(context.lon)], parseInt(context.zoom));
       map.attributionControl.setPrefix(false);
     } else {
       var map = L.map(context.id).setView([parseFloat(context.lat), parseFloat(context.lon)], parseInt(context.zoom));
       map.attributionControl.setPrefix(false).addAttribution("&copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, Map Kibera");
     }

     if (context.layer_control == 'show') {
       //var layer_control = L.control.layers().addTo(map);
       var layers = {};
     }
     var tileservers = context.tileserver.split(',');
     for (var i=0; i< tileservers.length; i++) {
       if (context.layer_control == 'show') {
         layer_name_array = tileservers[i].split('/');
         layer_name = layer_name_array[ layer_name_array.length -2 ];
         layers[ layer_name ] = L.tileLayer(tileservers[i] + '{z}/{x}/{y}.png', { });
         if (i == 0) {
           layers[ layer_name ].addTo(map);
         }
       } else {
         L.tileLayer(tileservers[i] + '{z}/{x}/{y}.png', {
         }).addTo(map);
       }
     }
     if (context.layer_control == 'show') {
       L.control.layers(layers).addTo(map);
     }

     map.scrollWheelZoom.disable();
   };

   window.mapkibera = mapkibera;
})(window);
