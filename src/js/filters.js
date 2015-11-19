(function(undefined) {

  module.exports = function(app) {

    app.filter('casoName', [
      function() {
        return function(input) {
          var name = '';
          if(input) {
            if(input.nome) {
              name += input.nome;
              if(input.apelido) {
                name += ' (' + input.apelido + ')';
              }
            } else if(input.apelido) {
              name += input.apelido;
            } else {
              name += 'Não identificado';
            }
            if(input.idade) {
              name += ', ' + input.idade + ' anos';
            }
          }
          return name;
        }
      }
    ]);

    app.filter('casoDate', [
      '$sce',
      function($sce) {
        return function(input) {
          var date = '';
          if(input.ano) {
            date = '<span class="ano">' + input.ano + '</span>';
          }
          if(input.mes) {
            date += '<span class="mes">/' + input.mes + '</span>';
          }
          if(input.dia) {
            date += '<span class="dia">/' + input.dia + '</span>';
          }
          return $sce.trustAsHtml(date);
        }
      }
    ]);

    app.filter('caseLocation', [
      '$sce',
      function($sce) {
        return function(input) {
          var location = '';
          if(input.terra_indigena) {
            location = '<span class="ti">' + input.terra_indigena + '</span>';
          }
          if(input.municipio) {
            location += '<span class="mun">' + input.municipio + '</span>';
          }
          if(input.uf) {
            location += '<span class="uf">' + input.uf + '</span>';
          }
          return $sce.trustAsHtml(location);
        }
      }
    ])

    app.filter('postToMarker', [
      function() {
        return _.memoize(function(input) {

          if(input && input.length) {

            var markers = {};

            _.each(input, function(post) {

              if(post.coordinates) {
                markers[post.ID] = {
                  lat: post.coordinates[1],
                  lng: post.coordinates[0],
                  message: '<h2>' + post.title + '</h2>' + '<p>' + post.formatted_address + '</p>'
                };
              }

            });

            return markers;

          }

          return {};

        }, function() {
          return JSON.stringify(arguments);
        });
      }
    ]);

  }

})();
