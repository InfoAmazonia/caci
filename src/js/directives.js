(function(vindig, jQuery, L, undefined) {

  L.mapbox.accessToken = "pk.eyJ1IjoiaW5mb2FtYXpvbmlhIiwiYSI6InItajRmMGsifQ.JnRnLDiUXSEpgn7bPDzp7g"

  module.exports = function(app) {

    app.directive('tagExternal', [
      '$timeout',
      function($timeout) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            function isExternal(url) {
              var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
              if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
              if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"), "") !== location.host) return true;
              return false;
            }
            $timeout(function() {
              jQuery(element).find('a').each(function() {
                if(isExternal(jQuery(this).attr('href')))
                  jQuery(this).addClass('external').attr({
                    'rel': 'external',
                    'target': '_blank'
                  });
              });
            }, 200);
          }
        }
      }
    ])

    app.directive('forceOnclick', [
      function() {
        return {
          restrict: 'A',
          scope: {
            'forceOnclick': '=',
            'forceParent': '@'
          },
          link: function(scope, element, attrs) {
            var ms = scope.forceOnclick || 500;
            var el;
            if(scope.forceParent) {
              el = jQuery('#' + scope.forceParent);
            } else {
              el = jQuery(element);
            }
            jQuery(element).on('click', function() {
              el.addClass('force');
              setTimeout(function() {
                el.removeClass('force');
              }, ms);
            });
          }
        }
      }
    ])

    app.directive('map', [
      '$rootScope',
      '$state',
      'Vindig',
      function($rootScope, $state, Vindig) {
        return {
          restrict: 'E',
          scope: {
            'mapData': '=',
            'markers': '=',
            'heatMarker': '='
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
            $rootScope.$on('invalidateMap', function() {
              setTimeout(function() {
                map.invalidateSize(true);
              }, 15);
            });

            // watch focus map
            var calledFocus;
            $rootScope.$on('focusMap', function(ev, coordinates) {
              calledFocus = coordinates;
              map.fitBounds(L.latLngBounds([[coordinates[1], coordinates[0]]]));
            });

            /*
             * Map data
             */
            scope.mapData = false;
            var mapInit = false
            scope.$watch('mapData', function(mapData, prev) {
              if(mapData.ID !== prev.ID || !mapInit) {
                mapInit = true;
                scope.layers = mapData.layers;
                setTimeout(function() {

                  if(mapData.min_zoom)
                    map.options.minZoom = parseInt(mapData.min_zoom);
                  else
                    map.options.minZoom = 1;

                  if(mapData.max_zoom)
                    map.options.maxZoom = parseInt(mapData.max_zoom);
                  else
                    map.options.maxZoom = 18;

                  setTimeout(function() {
                    map.setView(mapData.center, mapData.zoom, {
                      reset: true
                    });
                    map.setZoom(mapData.zoom);
                    setTimeout(function() {
                      map.setView(mapData.center, mapData.zoom, {
                        reset: true
                      });
                      map.setZoom(mapData.zoom);
                    }, 100);
                  }, 200);

                  setTimeout(function() {
                    if(mapData.pan_limits) {
                      map.setMaxBounds(L.latLngBounds(
                        [
                          mapData.pan_limits.south,
                          mapData.pan_limits.west
                        ],
                        [
                          mapData.pan_limits.north,
                          mapData.pan_limits.east
                        ]
                      ));
                    }
                  }, 400);

                }, 200);
              }
            });

            /*
             * Markers
             */
            var icon = L.divIcon({
              className: 'pin',
              iconSize: [18,18],
              iconAnchor: [9, 18],
              popupAnchor: [0, -18]
            });

            var markerLayer = L.markerClusterGroup({
              zIndex: 100,
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
              },
              iconCreateFunction: function(cluster) {

                var childCount = cluster.getChildCount();

                var c = ' marker-cluster-';
                if (childCount < 10) {
                  c += 'small';
                } else if (childCount < 100) {
                  c += 'medium';
                } else {
                  c += 'large';
                }

                var icon = L.divIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });

                return icon;

              }
            });

            markerLayer.addTo(map);

            if(scope.heatMarker) {
              var heatLayer = L.heatLayer([], {
                blur: 30
              });
              heatLayer.addTo(map);
            }

            var markers = [];
            var latlngs = [];
            scope.$watch('markers', _.debounce(function(posts) {
              for(var key in markers) {
                markerLayer.removeLayer(markers[key]);
              }
              markers = [];
              latlngs = [];
              for(var key in posts) {
                var post = posts[key];
                latlngs.push([post.lat,post.lng]);
                markers[key] = L.marker([post.lat,post.lng], {
                  icon: icon
                });
                markers[key].post = post;
                markers[key].bindPopup(post.message);
                markers[key].on('mouseover', function(ev) {
                  ev.target.openPopup();
                });
                markers[key].on('mouseout', function(ev) {
                  ev.target.closePopup();
                });
                markers[key].on('click', function(ev) {
                  var params =  _.extend({
                    focus: false
                  }, ev.target.post.state.params);
                  $state.go(ev.target.post.state.name, params);
                });
              }
              for(var key in markers) {
                markers[key].addTo(markerLayer);
              }
              if(scope.heatMarker)
                heatLayer.setLatLngs(latlngs);
            }, 300), true);

            /*
             * Layers
             */

            scope.layers = [];

            var fixed = [];
            var swapable = [];
            var switchable = [];

            var layerMap = {};

            var collapsed = false;

            if(jQuery(window).width() <= 768) {
              collapsed = true;
            }

            var layerControl = L.control.layers({}, {}, {
              collapsed: collapsed,
              position: 'bottomright',
              autoZIndex: false
            }).addTo(map);

            var legendControl = L.mapbox.legendControl().addTo(map);

            layerControl.addOverlay(markerLayer, 'Casos');

            map.on('layeradd', function(ev) {
              if(ev.layer._vindig_id) {
                if(layerMap[ev.layer._vindig_id].control)
                  map.addControl(layerMap[ev.layer._vindig_id].control);
                if(layerMap[ev.layer._vindig_id].legend) {
                  legendControl.addLegend(layerMap[ev.layer._vindig_id].legend);
                }
              }
            });
            map.on('layerremove', function(ev) {
              if(ev.layer._vindig_id) {
                if(layerMap[ev.layer._vindig_id].control)
                  map.removeControl(layerMap[ev.layer._vindig_id].control);
                if(layerMap[ev.layer._vindig_id].legend) {
                  legendControl.removeLegend(layerMap[ev.layer._vindig_id].legend);
                }
              }
            });

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
                      if(map.hasLayer(l.layer))
                        map.removeLayer(l.layer);
                    });
                    swapable = [];
                  }
                  if(switchable.length) {
                    _.each(switchable, function(l) {
                      layerControl.removeLayer(l.layer);
                      if(map.hasLayer(l.layer))
                        map.removeLayer(l.layer);
                    });
                    switchable = [];
                  }
                }

                if(layers && layers.length) {
                  _.each(layers, function(layer, i) {
                    layer.zIndex = i+10;
                    layer.ID = layer.ID || 'base';
                    if(!layerMap[layer.ID] || layer.ID == 'base')
                      layerMap[layer.ID] = Vindig.getLayer(layer, map);
                    if(layer.filtering == 'fixed' || !layer.filtering) {
                      fixed.push(layerMap[layer.ID]);
                      map.addLayer(layerMap[layer.ID].layer);
                    } else if(layer.filtering == 'swap') {
                      if(layer.first_swap)
                        map.addLayer(layerMap[layer.ID].layer);
                      swapable.push(layerMap[layer.ID]);
                    } else if(layer.filtering == 'switch') {
                      if(!layer.hidden)
                        map.addLayer(layerMap[layer.ID].layer);
                      switchable.push(layerMap[layer.ID]);
                    }
                  });

                  swapable = swapable.reverse();
                  _.each(swapable, function(layer) {
                    layerControl.addBaseLayer(layer.layer, layer.name);
                  });

                  switchable = switchable.reverse();
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

})(window.vindig, window.jQuery, window.L);
