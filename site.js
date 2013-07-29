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
      var map = L.map(context.id).setView([parseFloat(context.lat), parseFloat(context.lon)], parseInt(context.zoom));
      L.tileLayer(context.tileserver + '{z}/{x}/{y}.png', {
      }).addTo(map);
      map.attributionControl.setPrefix(false).addAttribution("&copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, Map Kibera");
    };


   window.mapkibera = mapkibera;
})(window);

