!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){!function(a){b.exports=function(a){a.controller("MainCtrl",["$scope","Vindig",function(a,b){a.initialized=!0,a.init=function(){a.initialized=!0},b.cases().then(function(c){a.casos=c.data;var d=c.headers("X-WP-TotalPages");console.log(a.casos[0]);for(var e=2;d>=e;e++)b.cases({page:e}).then(function(b){a.casos=a.casos.concat(b.data)})})}]),a.controller("HomeCtrl",["$scope",function(a){}])}}()},{}],2:[function(a,b,c){!function(a,c,d){c.mapbox.accessToken="pk.eyJ1IjoiaW5mb2FtYXpvbmlhIiwiYSI6InItajRmMGsifQ.JnRnLDiUXSEpgn7bPDzp7g",b.exports=function(a){a.directive("map",["Vindig",function(a){return{restrict:"E",scope:{markers:"="},link:function(b,d,e){a.maps().then(function(f){var g=f.data[0];console.log(g),angular.element(d).append('<div id="'+e.id+'"></div>').attr("id","");var h=c.map(e.id,{center:g.center,zoom:g.zoom,minZoom:parseInt(g.min_zoom),maxZoom:parseInt(g.max_zoom)}),i=[],j=[],k=[];g.base_layer.url&&i.push(g.base_layer),_.each(g.layers,function(b){"fixed"==b.filtering?i.push(a.getLayer(b,h)):"swap"==b.filtering?j.push(a.getLayer(b,h)):"switch"==b.filtering&&k.push(a.getLayer(b,h))}),_.each(i,function(a){h.addLayer(a.layer)});var l={};_.each(j,function(a){l[a.name]=a.layer});var m={};_.each(k,function(a){m[a.name]=a.layer}),c.control.layers(l,m,{collapsed:!1,position:"bottomright"}).addTo(h);var n=c.divIcon({className:"pin",iconSize:[18,18],iconAnchor:[9,18]}),o=c.markerClusterGroup({maxClusterRadius:40,polygonOptions:{fillColor:"#000",color:"#000",opacity:.3,weight:2},spiderLegPolylineOptions:{weight:1,color:"#222",opacity:.4}});o.addTo(h);var p=[];b.$watch("markers",_.debounce(function(a){for(var b in p)o.removeLayer(p[b]);p=[];for(var b in a){var d=a[b];p[b]=c.marker([d.lat,d.lng],{icon:n})}for(var b in p)p[b].addTo(o)},300),!0)})}}}])}}(window.vindig,window.L)},{}],3:[function(a,b,c){!function(a){b.exports=function(a){a.filter("casoName",[function(){return function(a){var b="";return a&&(a.nome?(b+=a.nome,a.apelido&&(b+=" ("+a.apelido+")")):b+=a.apelido?a.apelido:"Não identificado"),b}}]),a.filter("casoDate",["$sce",function(a){return function(b){var c="";return b.ano&&(c='<span class="ano">'+b.ano+"</span>"),b.mes&&(c+='<span class="mes">/'+b.mes+"</span>"),b.dia&&(c+='<span class="dia">/'+b.dia+"</span>"),a.trustAsHtml(c)}}]),a.filter("caseLocation",["$sce",function(a){return function(b){var c="";return b.terra_indigena&&(c='<span class="ti">'+b.terra_indigena+"</span>"),b.municipio&&(c+='<span class="mun">'+b.municipio+"</span>"),b.uf&&(c+='<span class="uf">'+b.uf+"</span>"),a.trustAsHtml(c)}}]),a.filter("postToMarker",[function(){return _.memoize(function(a){if(a&&a.length){var b={};return _.each(a,function(a){a.coordinates&&(b[a.ID]={lat:a.coordinates[1],lng:a.coordinates[0],message:"<h2>"+a.title+"</h2><p>"+a.formatted_address+"</p>"})}),b}return{}},function(){return JSON.stringify(arguments)})}])}}()},{}],4:[function(a,b,c){!function(b,c){var d=b.module("vindigena",["ui.router"]);d.config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,c,d,e){d.html5Mode({enabled:!1,requireBase:!1}),d.hashPrefix("!"),a.state("home",{url:"/",controller:"HomeCtrl"}),c.rule(function(a,c){var d,e=c.path(),f=c.search();if("/"!==e[e.length-1])return 0===Object.keys(f).length?e+"/":(d=[],b.forEach(f,function(a,b){d.push(b+"="+a)}),e+"/?"+d.join("&"))})}]),a("./services")(d),a("./filters")(d),a("./directives")(d),a("./controllers")(d),b.element(document).ready(function(){b.bootstrap(document,["vindigena"])})}(window.angular)},{"./controllers":1,"./directives":2,"./filters":3,"./services":5}],5:[function(a,b,c){!function(a,c,d){b.exports=function(b){b.config(["$httpProvider",function(a){a.defaults.paramSerializer="$httpParamSerializerJQLike"}]),b.factory("Vindig",["$http",function(b){return{maps:function(c,d){return c=c||{},c=_.extend({type:"map"},c),d=d||{},d=_.extend({posts_per_page:50},d),c.filter=d,b({method:"GET",url:a.api+"posts",params:c})},cases:function(c,d){return c=c||{},c=_.extend({type:"case"},c),d=d||{},d=_.extend({posts_per_page:80},d),c.filter=d,b({method:"GET",url:a.api+"posts",params:c})},dossiers:function(c,d){return c=c||{},c=_.extend({type:"dossier"},c),d=d||{},d=_.extend({posts_per_page:50},d),c.filter=d,b({method:"GET",url:a.api+"posts",params:c})},getLayer:function(a,b){var d={name:a.title};if("mapbox"==a.type){var e=c.mapbox.tileLayer(a.mapbox_id),f=c.mapbox.gridLayer(a.mapbox_id);d.layer=c.layerGroup([e,f]),b.addControl(c.mapbox.gridControl(f))}else"tilelayer"==a.type&&(d.layer=c.tileLayer(a.url));return d}}}])}}(window.vindig,window.L)},{}]},{},[4]);
//# sourceMappingURL=app.js.map