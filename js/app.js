!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){!function(a,c){b.exports=function(b){b.controller("TourCtrl",["$scope",function(a){a.total=7,a.step=1,a.nextStep=function(){a.step<a.total&&a.step++},a.prevStep=function(){a.step>1&&a.step--},a.isStep=function(b){return a.step==b}}]),b.controller("MainCtrl",["$q","$rootScope","$scope","$state","$timeout","$cookies","Vindig",function(b,c,d,e,f,g,h){d.base=vindig.base,d.dialogs={},d.showDialog=function(a){return d.dialogs[a]?!0:!1},d.toggleDialog=function(a){d.dialogs[a]?d.dialogs[a]=!1:d.dialogs[a]=!0},document.onkeydown=function(a){a=a||window.event,27==a.keyCode&&d.$apply(function(){for(var a in d.dialogs)d.dialogs[a]=!1})},h.pages().then(function(a){d.pages=a.data}),d.toggleNav=function(){d.showNav?d.showNav=!1:d.showNav=!0},c.$on("$stateChangeStart",function(){d.showNav=!1}),c.$on("$stateChangeSuccess",function(){d.embedUrl=e.href(e.current.name||"home",e.params,{absolute:!0})}),d.getEmbedUrl=function(){return encodeURIComponent(d.embedUrl)},d.toggleDossiers=function(){d.showDossiers?d.showDossiers=!1:d.showDossiers=!0},c.$on("$stateChangeStart",function(){d.showDossiers=!1}),d.toggleAdvFilters=function(){d.showAdvFilters?d.showAdvFilters=!1:d.showAdvFilters=!0},c.$on("$stateChangeStart",function(){d.showAdvFilters=!1}),d.home=function(){"home"==e.current.name&&(d.initialized=!1)},d.init=function(){d.initialized=!0,d.showList=!0},d.$watch("initialized",function(){f(function(){c.$broadcast("invalidateMap")},200)}),"home.dossier"==e.current.name||"home.dossier.case"==e.current.name?d.isDossier=!0:d.isDossier=!1,"home.case"==e.current.name?d.isCase=!0:d.isCase=!1,c.$on("dossierCases",function(a,b){d.dossierCases=b}),g.get("accessed_tour")||g.put("accessed_tour",0),d.accessedTour=g.get("accessed_tour"),d.disableTour=function(){g.put("accessed_tour",1),d.accessedTour=1},c.$on("$stateChangeSuccess",function(a,b,e,f,h){"home"!==b.name&&(d.initialized=!0),"home.tour"==b.name&&(d.showList=!0,g.put("accessed_tour",1),d.accessedTour=1),"home.case"==f.name&&c.$broadcast("invalidateMap")}),c.$on("$stateChangeStart",function(a,b,c,e){"home.dossier"!==b.name&&"home.dossier.case"!==b.name&&(d.dossierCases=!1),"home.dossier"==b.name||"home.dossier.case"==b.name?d.isDossier=!0:d.isDossier=!1,"home.case"==b.name?d.isCase=!0:d.isCase=!1,"home.dossier"==e.name&&(d.filter.strict={})}),d.$watch("isDossier",function(a,b){a!==b&&c.$broadcast("invalidateMap")}),d.filtered=[],d.casos=[],d.loading=!0,h.cases().then(function(a){var c=[];d.casos=a.data;for(var e=a.headers("X-WP-TotalPages"),f=2;e>=f;f++)c.push(h.cases({page:f})),c[f-2].then(function(a){d.casos=d.casos.concat(a.data)});b.all(c).then(function(){d.loading=!1})}),d.itemsPerPage=20,d.currentPage=0,d.prevPage=function(){d.currentPage>0&&d.currentPage--},d.prevPageDisabled=function(){return 0===d.currentPage?"disabled":""},d.pageCount=function(){return Math.ceil(d.filtered.length/d.itemsPerPage)-1},d.nextPage=function(){d.currentPage<d.pageCount()&&d.currentPage++},d.nextPageDisabled=function(){return d.currentPage===d.pageCount()?"disabled":""},c.$on("nextCase",function(b,c){var f;a.each(d.filtered,function(a,b){a.ID==c.ID&&(f=b)}),f>=0&&d.filtered[f+1]&&e.go("home.case",{caseId:d.filtered[f+1].ID})}),c.$on("prevCase",function(b,c){var f;a.each(d.filtered,function(a,b){a.ID==c.ID&&(f=b)}),f>=0&&d.filtered[f-1]&&e.go("home.case",{caseId:d.filtered[f-1].ID})}),h.dossiers().then(function(a){d.dossiers=a.data}),d.filter={text:"",strict:{},date:{min:0,max:0}},d.dateFilters=[0,0],d.dropdownFilters={};var i=function(b){var c=a.sortBy(h.getUniq(b,"ano"),function(a){return parseInt(a)});c.length&&((!d.dateFilters[0]||parseInt(a.min(c))<d.dateFilters[0])&&(d.dateFilters[0]=parseInt(a.min(c)),d.filter.date.min=parseInt(a.min(c))),(!d.dateFilters[1]||parseInt(a.max(c))>d.dateFilters[1])&&(d.dateFilters[1]=parseInt(a.max(c)),d.filter.date.max=parseInt(a.max(c))),d.filter.strict.uf||(d.dropdownFilters.uf=a.sortBy(h.getUniq(b,"uf"),function(a){return a})),d.filter.strict.relatorio||(d.dropdownFilters.relatorio=a.sortBy(h.getUniq(b,"relatorio"),function(a){return a})),d.filter.strict.povo||(d.dropdownFilters.povo=a.sortBy(h.getUniq(b,"povo"),function(a){return a})))};d.$watch("casos",i);var j="casos | filter:filter.text | exact:filter.strict | dateFilter:filter.date | caseIds:dossierCases";c.$on("caseQuery",function(a,b){d.filter.strict=b},!0),d.$watch(j,function(a){d.filtered=a,i(a)},!0);var k=["aldeia","ano","apelido","cod_funai","cod_ibge","coordinates","descricao","dia","mes","ano","fonte_cimi","idade","municipio","uf","nome","povo","relatorio","terra_indigena"];d.downloadCasos=function(b){var c=[];a.each(b,function(b){var d={};a.each(k,function(a){d[a]=b[a],"string"==typeof d[a]&&(d[a]=d[a].replace(/"/g,'""'))}),c.push(d)}),JSONToCSV(c,"casos",!0)},d.clearFilters=function(){d.filter.text="","undefined"!=typeof anos&&anos&&anos.length&&(d.filter.date.min=parseInt(a.min(anos)),d.filter.date.max=parseInt(a.max(anos))),d.filter.strict={}},d.$on("$stateChangeSuccess",function(a,b){"home.dossier"==b.name&&d.clearFilters()}),d.focusMap=function(a){c.$broadcast("focusMap",a.coordinates)},d.showList=!1,d.toggleCasos=function(){d.showList?d.showList=!1:d.showList=!0},d.$watch("showList",function(){f(function(){c.$broadcast("invalidateMap")},300)})}]),b.controller("HomeCtrl",["$scope","$rootScope","$timeout","Map",function(a,b,c,d){a.$on("$stateChangeSuccess",function(b,c){("home"==c.name||"home.tour"==c.name||"home.case"==c.name||"home.page"==c.name)&&(a.mapData=d)}),a.$on("dossierMap",function(b,c){a.mapData=c})}]),b.controller("DossierCtrl",["$rootScope","$timeout","$scope","$sce","Dossier","DossierMap","$state",function(b,c,d,e,f,g,h){if(d.url=h.href("home.dossier",{id:f.data.ID},{absolute:!0}),d.dossier=f.data,d.dossier.content=e.trustAsHtml(d.dossier.content),d.$emit("dossierMap",g),c(function(){b.$broadcast("invalidateMap")},300),d.dossier.casos&&d.dossier.casos.length)b.$broadcast("dossierCases",d.dossier.casos);else if(d.dossier.casos_query){var i=d.dossier.casos_query.split(";"),j={};a.each(i,function(a){a&&(kv=a.split("="),kv.length&&(j[kv[0].trim()]=kv[1].replace(/"/g,"")))}),b.$broadcast("caseQuery",j)}d.whatsapp="whatsapp://send?text="+encodeURIComponent(d.dossier.title+" "+d.url),d.base=vindig.base,d.hiddenContent=!1,d.toggleContent=function(){d.hiddenContent?d.hiddenContent=!1:d.hiddenContent=!0}}]),b.controller("CaseCtrl",["$rootScope","$state","$stateParams","$scope","$sce","Case","Vindig",function(a,b,c,d,e,f,g){d.caso=f.data,d.caso.content=e.trustAsHtml(d.caso.content),0!=c.focus&&a.$broadcast("focusMap",d.caso.coordinates),a.$broadcast("invalidateMap"),d.report=function(a){g.report(d.caso.ID,a).success(function(a){d.reported=!0}).error(function(a){console.log(a)})},d.close=function(){-1!==b.current.name.indexOf("dossier")?b.go("home.dossier",b.current.params):b.go("home")},d.next=function(){a.$broadcast("nextCase",d.caso)},d.prev=function(){a.$broadcast("prevCase",d.caso)}}]),b.controller("PageCtrl",["$scope","$sce","Page",function(a,b,c){a.page=c.data,a.page.content=b.trustAsHtml(a.page.content)}])}}(window._)},{}],2:[function(a,b,c){!function(a,c,d,e){d.mapbox.accessToken="pk.eyJ1IjoiaW5mb2FtYXpvbmlhIiwiYSI6InItajRmMGsifQ.JnRnLDiUXSEpgn7bPDzp7g",b.exports=function(a){a.directive("tourFocus",[function(){return{restrict:"A",scope:{sel:"=tourFocus",direction:"=",active:"="},link:function(a,b,d){function e(a){return max=c(window).width()-k.innerWidth(),0>a?0:a>max?max:a}var f,g,h,i=c(a.sel),j=c(b),k=j.find(".step-description"),l=j.find(".arrow");j.addClass(a.direction);var m=function(){f=i.innerWidth(),g=i.innerHeight(),h=i.offset(),j.css({width:f,height:g,top:h.top,left:h.left}),"right"==a.direction?(k.css({top:h.top-10,left:h.left,"margin-left":-320}),l.css({top:h.top,left:h.left,"margin-top":10,"margin-left":-40})):"left"==a.direction?(k.css({top:h.top-10,left:f,"margin-left":30}),l.css({top:h.top,left:f,"margin-top":10,"margin-left":20})):"top"==a.direction?(k.css({bottom:c(window).height()-h.top+30,left:e(h.left+f/2-145)}),l.css({bottom:c(window).height()-h.top,left:h.left+f/2,"margin-bottom":20,"margin-left":-10})):"bottom"==a.direction&&(k.css({top:h.top+g,left:e(h.left+f/2-145),"margin-top":30}),l.css({top:h.top+g,left:h.left+f/2,"margin-top":20,"margin-left":-10}))};m(),a.$watch("active",_.debounce(function(){m()},400)),c(window).resize(m)}}}]),a.directive("scrollUp",[function(){return{restrict:"A",scope:{scrollUp:"="},link:function(a,b,d){var e=c(a.scrollUp);c(b).on("click",function(){e.scrollTop(0)})}}}]),a.directive("attachToContent",[function(){return{restrict:"A",scope:{sel:"=attachToContent"},link:function(a,b,d){var e=c(a.sel||".single");c(window).resize(function(){c(b).css({left:e.offset().left+e.width()+"px"})}),c(window).resize()}}}]),a.directive("tagExternal",["$timeout",function(a){return{restrict:"A",link:function(b,d,e){function f(a){var b=a.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);return"string"==typeof b[1]&&b[1].length>0&&b[1].toLowerCase()!==location.protocol?!0:"string"==typeof b[2]&&b[2].length>0&&b[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location.protocol]+")?$"),"")!==location.host?!0:!1}a(function(){c(d).find("a").each(function(){c(this).parents(".share").length||f(c(this).attr("href"))&&c(this).addClass("external").attr({rel:"external",target:"_blank"})})},200)}}}]),a.directive("forceOnclick",[function(){return{restrict:"A",scope:{forceOnclick:"=",forceParent:"@"},link:function(a,b,d){var e,f=a.forceOnclick||500;e=c(a.forceParent?"#"+a.forceParent:b);var g=function(a){e.removeClass("force"),a.type&&"mousemove"==a.type&&c(document).unbind("mousemove",g)};c(b).on("click",function(){e.addClass("force"),"move"==f?c(document).on("mousemove",g):setTimeout(g,f)})}}}]),a.directive("map",["$rootScope","$state","Vindig",function(a,b,e){return{restrict:"E",scope:{mapData:"=",markers:"=",heatMarker:"="},link:function(f,g,h){function i(){var a=o.getCenter(),b=o.getZoom(),c=[];return c.push(a.lat),c.push(a.lng),c.push(b),c.join(",")}function j(){return b.params.loc?b.params.loc.split(","):[]}angular.element(g).append('<div id="'+h.id+'"></div>').attr("id","");var k=j(),l=[0,0],m=2;k.length&&(l=[k[0],k[1]],m=k[2]);var n,o=d.map(h.id,{center:l,zoom:m,maxZoom:18});o.on("move",_.debounce(function(){f.$apply(function(){var a=i();a!=n&&b.go(b.current.name,{loc:i()},{notify:!1}),n=i()})},1e3)),a.$on("invalidateMap",function(){setTimeout(function(){o.invalidateSize(!0)},15)});var p;a.$on("focusMap",function(a,b){p=b,o.fitBounds(d.latLngBounds([[b[1],b[0]]]))}),f.mapData=!1;var q=!1;f.$watch("mapData",function(a,b){a.ID===b.ID&&q||(q=!0,f.layers=a.layers,setTimeout(function(){a.min_zoom?o.options.minZoom=parseInt(a.min_zoom):o.options.minZoom=1,a.max_zoom?o.options.maxZoom=parseInt(a.max_zoom):o.options.maxZoom=18,k.length||a.ID===b.ID||setTimeout(function(){o.setView(a.center,a.zoom,{reset:!0}),o.setZoom(a.zoom),setTimeout(function(){o.setView(a.center,a.zoom,{reset:!0}),o.setZoom(a.zoom)},100)},200),setTimeout(function(){a.pan_limits&&o.setMaxBounds(d.latLngBounds([a.pan_limits.south,a.pan_limits.west],[a.pan_limits.north,a.pan_limits.east]))},400)},200))});var r=d.divIcon({className:"pin",iconSize:[18,18],iconAnchor:[9,18],popupAnchor:[0,-18]}),s=d.markerClusterGroup({zIndex:100,maxClusterRadius:40,polygonOptions:{fillColor:"#000",color:"#000",opacity:.3,weight:2},spiderLegPolylineOptions:{weight:1,color:"#222",opacity:.4},iconCreateFunction:function(a){var b=a.getChildCount(),c=" marker-cluster-";c+=10>b?"small":100>b?"medium":"large";var e=d.divIcon({html:"<div><span>"+b+"</span></div>",className:"marker-cluster"+c,iconSize:new d.Point(40,40)});return e}});if(s.addTo(o),f.heatMarker){var t=d.heatLayer([],{blur:30});t.addTo(o)}var u=[],v=[];f.$watch("markers",_.debounce(function(a){for(var c in u)s.removeLayer(u[c]);u=[],v=[];for(var c in a){var e=a[c];v.push([e.lat,e.lng]),u[c]=d.marker([e.lat,e.lng],{icon:r}),u[c].post=e,u[c].bindPopup(e.message),u[c].on("mouseover",function(a){a.target.openPopup()}),u[c].on("mouseout",function(a){a.target.closePopup()}),u[c].on("click",function(a){var c=_.extend({focus:!1},a.target.post.state.params);b.go(a.target.post.state.name,c)})}for(var c in u)u[c].addTo(s);f.heatMarker&&t.setLatLngs(v)},300),!0),f.layers=[];var w=[],x=[],y=[],z={},A=!1;c(window).width()<=768&&(A=!0);var B=d.control.layers({},{},{collapsed:A,position:"bottomright",autoZIndex:!1}).addTo(o),C=d.mapbox.legendControl().addTo(o);B.addOverlay(s,"Casos"),o.on("layeradd",function(a){a.layer._vindig_id&&(z[a.layer._vindig_id].control&&o.addControl(z[a.layer._vindig_id].control),z[a.layer._vindig_id].legend&&C.addLegend(z[a.layer._vindig_id].legend))}),o.on("layerremove",function(a){a.layer._vindig_id&&(z[a.layer._vindig_id].control&&o.removeControl(z[a.layer._vindig_id].control),z[a.layer._vindig_id].legend&&C.removeLegend(z[a.layer._vindig_id].legend))}),f.$watch("layers",function(a,b){(a!==b||_.isEmpty(z))&&(b&&b.length&&(w.length&&(_.each(w,function(a){o.removeLayer(a.layer)}),w=[]),x.length&&(_.each(x,function(a){B.removeLayer(a.layer),o.hasLayer(a.layer)&&o.removeLayer(a.layer)}),x=[]),y.length&&(_.each(y,function(a){B.removeLayer(a.layer),o.hasLayer(a.layer)&&o.removeLayer(a.layer)}),y=[])),a&&a.length&&(_.each(a,function(a,b){a.zIndex=b+10,a.ID=a.ID||"base",z[a.ID]&&"base"!=a.ID||(z[a.ID]=e.getLayer(a,o)),"fixed"!=a.filtering&&a.filtering?"swap"==a.filtering?(a.first_swap&&o.addLayer(z[a.ID].layer),x.push(z[a.ID])):"switch"==a.filtering&&(a.hidden||o.addLayer(z[a.ID].layer),y.push(z[a.ID])):(w.push(z[a.ID]),o.addLayer(z[a.ID].layer))}),x=x.reverse(),_.each(x,function(a){B.addBaseLayer(a.layer,a.name)}),y=y.reverse(),_.each(y,function(a){B.addOverlay(a.layer,a.name)})))})}}}])}}(window.vindig,window.jQuery,window.L)},{}],3:[function(a,b,c){!function(a,c){b.exports=function(b){b.filter("emptyToEnd",function(){return function(a,b){if(angular.isArray(a)){var c=a.filter(function(a){return a[b]}),d=a.filter(function(a){return!a[b]});return c.concat(d)}}}),b.filter("offset",function(){return function(a,b){return b=parseInt(b,10),a.slice(b)}}),b.filter("exact",function(){return function(a,b){var c,d=[],e=!0;return angular.forEach(b,function(a,b){e=e&&!a}),e?a:(angular.forEach(a,function(a){c=!0,angular.forEach(b,function(b,d){b&&(c=c&&a[d]===b)}),c&&d.push(a)}),d)}}),b.filter("caseIds",function(){return function(b,c){return c&&c.length&&(b=a.filter(b,function(a){return-1!=c.indexOf(a.ID)})),b}}),b.filter("casoName",[function(){return function(a){var b="";return a&&(a.nome?(b+=a.nome,a.apelido&&(b+=" ("+a.apelido+")")):b+=a.apelido?a.apelido:"Não identificado"),b}}]),b.filter("casoDate",["$sce",function(a){return function(b){var c="";return b.ano&&(c='<span class="ano">'+b.ano+"</span>"),b.mes&&(c+='<span class="mes">/'+b.mes+"</span>"),b.dia&&(c+='<span class="dia">/'+b.dia+"</span>"),a.trustAsHtml(c)}}]),b.filter("caseLocation",["$sce",function(a){return function(b,c){var d="";return b.terra_indigena&&(d=c?'<span class="ti"><span class="label">Terra indígena</span> '+b.terra_indigena+"</span>":'<span class="ti">'+b.terra_indigena+"</span>"),b.municipio&&(d+=c?'<span class="mun"><span class="label">Município</span> '+b.municipio+"</span>":'<span class="mun">'+b.municipio+"</span>"),b.uf&&(d+=c?'<span class="uf"><span class="label">Estado</span> '+b.uf+"</span>":'<span class="uf">'+b.uf+"</span>"),a.trustAsHtml(d)}}]),b.filter("dateFilter",[function(){return function(b,c){return b&&b.length&&(b=a.filter(b,function(a){var b=parseInt(a.ano);return b>=c.min&&b<=c.max})),b}}]),b.filter("postToMarker",["casoNameFilter","$state",function(b,c){return a.memoize(function(d,e,f){var g="";if(c.current.name==f?g+=f+".":e&&(g+=e+"."),d&&d.length){var h={};return a.each(d,function(a){a.coordinates&&(params={},params[a.type+"Id"]=a.ID,h[a.ID]={lat:a.coordinates[1],lng:a.coordinates[0],message:"<h2>"+b(a)+"</h2>",state:{name:g+a.type,params:params}})}),h}return{}},function(){return JSON.stringify(arguments)})}])}}(window._)},{}],4:[function(a,b,c){a("./util"),function(b,c,d){var e=b.module("vindigena",["ui.router","ngCookies","djds4rce.angular-socialshare","ui-rangeSlider","fitVids"],["$compileProvider",function(a){a.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|whatsapp|file):/)}]);e.config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,d,e,f){e.html5Mode({enabled:!1,requireBase:!1}),e.hashPrefix("!"),a.state("home",{url:"/?loc",controller:"HomeCtrl",templateUrl:c.base+"/views/index.html",reloadOnSearch:!1,resolve:{Map:["$q","Vindig",function(a,b){var d=a.defer();return c.featured_map?b.getPost(c.featured_map).then(function(a){d.resolve(a.data)}):b.maps().then(function(a){d.resolve(a.data[0])}),d.promise}]}}).state("home.tour",{url:"tour/",controller:"TourCtrl",templateUrl:c.base+"/views/tour.html",reloadOnSearch:!1}).state("home.page",{url:"p/:id/",controller:"PageCtrl",templateUrl:c.base+"/views/page.html",reloadOnSearch:!1,resolve:{Page:["$stateParams","Vindig",function(a,b){return b.getPost(a.id)}]}}).state("home.case",{url:"caso/:caseId/",controller:"CaseCtrl",templateUrl:c.base+"/views/case.html",reloadOnSearch:!1,params:{focus:!0},resolve:{Case:["$stateParams","Vindig",function(a,b){return b.getPost(a.caseId)}]}}).state("home.dossier",{url:"dossie/:dossierId/",controller:"DossierCtrl",templateUrl:c.base+"/views/dossier.html",reloadOnSearch:!1,resolve:{Dossier:["$stateParams","Vindig",function(a,b){return b.getPost(a.dossierId)}],DossierMap:["$q","Dossier","Vindig",function(a,b,d){var e=b.data.maps.length?b.data.maps[0]:c.featured_map,f=a.defer();return d.getPost(e).then(function(a){f.resolve(a.data)}),f.promise}]}}).state("home.dossier.case",{url:":caseId/",controller:"CaseCtrl",templateUrl:c.base+"/views/case.html",params:{focus:!0},reloadOnSearch:!1,resolve:{Case:["$stateParams","Vindig",function(a,b){return b.getPost(a.caseId)}]}}),d.rule(function(a,c){var d,e=c.path(),f=c.search();if("/"!==e[e.length-1])return 0===Object.keys(f).length?e+"/":(d=[],b.forEach(f,function(a,b){d.push(b+"="+a)}),e+"/?"+d.join("&"))})}]).run(["$rootScope","$FB",function(a,b){b.init("1496777703986386"),a.$on("$stateChangeSuccess",function(a,b,c,d,e){d.name&&jQuery("html,body").animate({scrollTop:0},400)})}]),a("./services")(e),a("./filters")(e),a("./directives")(e),a("./controllers")(e),b.element(document).ready(function(){b.bootstrap(document,["vindigena"])})}(window.angular,window.vindig)},{"./controllers":1,"./directives":2,"./filters":3,"./services":5,"./util":6}],5:[function(a,b,c){!function(a,c,d){b.exports=function(b){b.config(["$httpProvider",function(a){a.defaults.paramSerializer="$httpParamSerializerJQLike"}]),b.factory("Vindig",["$http",function(b){return{pages:function(c,d){return c=c||{},c=_.extend({type:"page"},c),d=d||{},d=_.extend({posts_per_page:50,orderby:"menu_order",order:"ASC"},d),c.filter=d,b({method:"GET",url:a.api+"/posts",params:c})},maps:function(c,d){return c=c||{},c=_.extend({type:"map"},c),d=d||{},d=_.extend({posts_per_page:50},d),c.filter=d,b({method:"GET",url:a.api+"/posts",params:c})},cases:function(c,d){return c=c||{},c=_.extend({type:"case"},c),d=d||{},d=_.extend({posts_per_page:80,without_map_query:1},d),c.filter=d,b({method:"GET",url:a.api+"/posts",params:c})},report:function(c,d){return b({method:"POST",url:a.api+"/posts/"+c+"/denuncia",data:{message:d}})},dossiers:function(c,d){return c=c||{},c=_.extend({type:"dossier"},c),d=d||{},d=_.extend({posts_per_page:50,without_map_query:1},d),c.filter=d,b({method:"GET",url:a.api+"/posts",params:c})},getLayer:function(a,b){var d={name:a.title||""};if("mapbox"==a.type){var e=c.mapbox.tileLayer(a.mapbox_id),f=c.mapbox.gridLayer(a.mapbox_id);d.layer=c.layerGroup([e,f]),d.control=c.mapbox.gridControl(f)}else"tilelayer"==a.type&&(d.layer=c.tileLayer(a.tile_url));return a.legend&&(d.legend=a.legend),d.layer&&(a.zIndex&&d.layer.setZIndex(a.zIndex),d.layer._vindig_id=a.ID),d},getPost:function(c){return b.get(a.api+"/posts/"+c)},getUniq:function(a,b,c){var d=[];if(_.each(a,function(a){a[b]&&(angular.isArray(a[b])?a[b].length&&(d=d.concat(a[b])):d.push(a[b]))}),d.length){var e=_.uniq(d,function(a,b){return"undefined"!=typeof c&&a[c]?a[c]:a});return _.compact(e)}return[]}}}])}}(window.vindig,window.L)},{}],6:[function(a,b,c){window.JSONToCSV=function(a,b,c){var d="object"!=typeof a?JSON.parse(a):a,e="";if(c){var f="";for(var g in d[0])f+=g+",";f=f.slice(0,-1),e+=f+"\r\n"}for(var h=0;h<d.length;h++){var f="";for(var g in d[h])f+='"'+d[h][g]+'",';f.slice(0,f.length-1),e+=f+"\r\n"}if(""==e)return void alert("Invalid data");var i=b.replace(/ /g,"_"),j="data:text/csv;charset=iso-8859-1,"+escape(e),k=document.createElement("a");k.href=j,k.style="visibility:hidden",k.download=i+".csv",document.body.appendChild(k),k.click(),document.body.removeChild(k)}},{}]},{},[4]);
//# sourceMappingURL=app.js.map