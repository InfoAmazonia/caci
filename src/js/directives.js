(function(vindig, L, undefined) {

  L.mapbox.accessToken = "pk.eyJ1IjoiaW5mb2FtYXpvbmlhIiwiYSI6InItajRmMGsifQ.JnRnLDiUXSEpgn7bPDzp7g"

  module.exports = function(app) {

    app.directive('map', [
      '$rootScope',
      'Vindig',
      function($rootScope, Vindig) {
        return {
          restrict: 'E',
          scope: {
            'mapData': '=',
            'markers': '='
          },
          link: function(scope, element, attrs) {

            angular.element(element)
              .append('<div id="' + attrs.id + '"></div>')
              .attr('id', '');

            var map = L.map(attrs.id, {
              center: [0,0],
              zoom: 2,
              maxZoom: 18
            });

            // watch map invalidation
            $rootScope.$on('invalidateMap', function(ev, boundsOptions) {
              map.invalidateSize(true);
              map.fitBounds(map.getBounds(), boundsOptions || {});
            });

            /*
             * Map data
             */
            scope.$watch('mapData', function(mapData) {
              if(mapData) {
                map.setView(mapData.center, mapData.zoom);
                if(mapData.min_zoom)
                  map.options.minZoom = parseInt(mapData.min_zoom);
                if(mapData.max_zoom)
                  map.options.maxZoom = parseInt(mapData.max_zoom);
                scope.layers = mapData.layers;
              }
            }, true);

            /*
             * Markers
             */
            var icon = L.divIcon({
              className: 'pin',
              iconSize: [18,18],
              iconAnchor: [9, 18]
            });

            var markerLayer = L.markerClusterGroup({
              zIndex: 10,
              maxClusterRadius: 40,
              polygonOptions: {
                fillColor: '#000',
                color: '#000',
                opacity: .3,
                weight: 2
              },
              spiderLegPolylineOptions: {
                weight: 1,
                color: '#222',
                opacity: 0.4
              }
            });

            markerLayer.addTo(map);

            var markers = [];
            scope.$watch('markers', _.debounce(function(posts) {
              for(var key in markers) {
                markerLayer.removeLayer(markers[key]);
              }
              markers = [];
              for(var key in posts) {
                var post = posts[key];
                markers[key] = L.marker([post.lat,post.lng], {
                  icon: icon
                });
              }
              for(var key in markers) {
                markers[key].addTo(markerLayer);
              }
            }, 300), true);

            /*
             * Layers
             */

            scope.layers = [];

            var fixed = [];
            var swapable = [];
            var switchable = [];

            var layerMap = {};

            var layerControl = L.control.layers({}, {}, {
              collapsed: false,
              position: 'bottomright'
            }).addTo(map);

            scope.$watch('layers', function(layers, prevLayers) {

              if(layers !== prevLayers || _.isEmpty(layerMap)) {

                if(prevLayers && prevLayers.length) {
                  if(fixed.length) {
                    _.each(fixed, function(l) {
                      map.removeLayer(l.layer);
                    });
                    fixed = [];
                  }
                  if(swapable.length) {
                    _.each(swapable, function(l) {
                      layerControl.removeLayer(l.layer);
                    });
                    swapable = [];
                  }
                  if(switchable.length) {
                    _.each(switchable, function(l) {
                      layerControl.removeLayer(l.layer);
                    });
                    switchable = [];
                  }
                }

                if(layers && layers.length) {

                  _.each(layers, function(layer) {

                    layer.ID = layer.ID || 'base';

                    if(!layerMap[layer.ID] || layer.ID == 'base')
                      layerMap[layer.ID] = Vindig.getLayer(layer, map);

                    if(layer.filtering == 'fixed' || !layer.filtering) {
                      fixed.push(layerMap[layer.ID]);
                    } else if(layer.filtering == 'swap') {
                      swapable.push(layerMap[layer.ID]);
                    } else if(layer.filtering == 'switch') {
                      switchable.push(layerMap[layer.ID]);
                    }
                  });

                  _.each(fixed, function(layer) {
                    map.addLayer(layer.layer);
                  });

                  _.each(swapable, function(layer) {
                    layerControl.addBaseLayer(layer.layer, layer.name);
                  });

                  _.each(switchable, function(layer) {
                    layerControl.addOverlay(layer.layer, layer.name);
                  });

                }

              }

            });

          }
        }
      }
    ])

  };

})(window.vindig, window.L);
