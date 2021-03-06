// autoTour gui

function updateAutoTourMap(lat,lon){

  //make the container visible
  $('#autoTourContainer').show();

  var radiusOrg = $.trim($("input#markerRadius").val());
  if (isNaN(radiusOrg) || radiusOrg == "") {// please break if radius is no number
    return;
  }

  var meterMiles = $("select#markerRadiusUnit").prop("selectedIndex");
  // 0: meter, 1: miles
  var radiusMiles = parseFloat(radiusOrg) * ((meterMiles == 1) ? 1 : 0.621371);

  if (radiusMiles == "") {
    return;
  }

  var staticGMap = $('div#staticGMap');
  staticGMap.html("");

  // create new static map with changed coordinates
  var SM = new StaticMap(staticGMap, {
    'lat': lat,
    'lon': lon,
    radius: radiusMiles,
    width: 570
  });

  var url = "http://www.geocaching.com/seek/nearest.aspx?lat=" + lat + "&lng=" + lon + "&dist=" + radiusMiles;
  log("url: " + url);

  $('b#markerCoordsPreview').empty().append(
    $("<a>",{
      href: url,
      title: url,
      text: new LatLon(lat,lon).toString()
    })
    .click(function(){
      window.open(this.href);
      return false;
    })
   );

  $('b#markerRadiusPreview').html(radiusOrg + " " + ((meterMiles == 1) ? "mi" : "km"));

  $("b#markerCoordsPreview, b#markerRadiusPreview")
    .css("background-color", "#FFE000")
    .animate({"background-color": "transparent"}, 2000);

  // get how many caches are in this area

  loadingTime1 = new Date();

  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    onload: function(responseDetails) {
      var dummyDiv = $(responseDetails.responseText),
          color,
          pagesSpan = $("td.PageBuilderWidget", dummyDiv).first();

      if (pagesSpan.length > 0) {
        var cacheCount = $("b", pagesSpan).first().text(),
            pageCount  = $("b", pagesSpan).last().text();

        color = "#FFE000";

        var miliseconds = new Date() - loadingTime1;
        var seconds = Math.floor((miliseconds * parseFloat(pageCount) ) / 1000);
        seconds = seconds + parseFloat(pageCount) * 2;

        var secondsMod = seconds % 60;
        var minutes = (seconds - secondsMod) / 60;

        $("b#markerCountPreview").html(cacheCount);
        $("b#markerDurationMin").html(minutes);
        $("b#markerDurationSec").html(secondsMod);
      } else {
        $("b#markerCountPreview, b#markerDurationMin, b#markerDurationSec").html("0");
        color = "#FF0000";
      }

      $("b#markerCountPreview")
        .css("background-color", color)
        .animate({"background-color": "transparent"}, 2000);
    }
  });

  // last, save the values
  $('input#coordsDivLat').val(lat);
  $('input#coordsDivLon').val(lon);
  $('input#coordsDivRadius').val(radiusMiles);
  $('b#markerCountPreview, b#markerDurationMin, b#markerDurationSec').html("<img src='http://madd.in/ajax-loader3.gif'>");

  // enable the startQuery button
  $('button#startQuery').removeAttr('disabled').css("opacity", 1);
}

function startAutoTour() {
  var i,
    typeFilter = {},
    sizeFilter = {},
    difficultyFilter = {},
    terrainFilter = {},
    specialFilter = {},
    ele = $("#autoTourContainer"),
    lat, lon, radius, url;

  ele.find("input[name='type']").each(function(index) {
    typeFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("input[name='size']").each(function(index) {
    sizeFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("input[name='Difficulty']").each(function(index) {
    difficultyFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("input[name='Terrain']").each(function(index) {
    terrainFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("input[name='special']").each(function(index) {
    specialFilter[$(this).val()] = $(this).is(':checked');
  });

  ele.find("select[id^='special_']").each(function(index) {
    var p = $(this).attr('id').replace("special_", "");
    specialFilter[p] = $(this).val();
  });

  specialFilter['minFavorites'] = ele.find("input[id='special_favorites']").val();

  lat    = ele.find("input#coordsDivLat").val();
  lon    = ele.find("input#coordsDivLon").val();
  radius = ele.find("input#coordsDivRadius").val();
  url    = "http://www.geocaching.com/seek/nearest.aspx?lat=" + lat + "&lon=" + lon + "&dist=" + radius;

  if (specialFilter["I haven't found "]) {
    url += "&f=1";
  }

  specialFilter["minFavorites"] = specialFilter["minFavorites"] || 0;

  GM_setValue('tq_url',           url);
  GM_setValue('tq_typeFilter',    JSON.stringify(typeFilter));
  GM_setValue('tq_sizeFilter',    JSON.stringify(sizeFilter));
  GM_setValue('tq_dFilter',       JSON.stringify(difficultyFilter));
  GM_setValue('tq_tFilter',       JSON.stringify(terrainFilter));
  GM_setValue('tq_specialFilter', JSON.stringify(specialFilter));
  GM_setValue('tq_StartUrl',      document.location.href);

  debug("fn startAutoTour GM_setValue: " +
    "\n\tq_url:" + url +
    "\n\tq_typeFilter:" + JSON.stringify(typeFilter) +
    "\n\tq_sizeFilter:" + JSON.stringify(sizeFilter) +
    "\n\tq_dFilter:" + JSON.stringify(difficultyFilter) +
    "\n\tq_tFilter:" + JSON.stringify(terrainFilter) +
    "\n\tq_specialFilter:" + JSON.stringify(specialFilter) +
    "\n\tq_StartUrl:" + document.location.href
  );

  document.location.href = url;
}

function getMarkerCoord() {
  var markerCoords = $("input#markerCoords").val();
  var coords = parseCoordinates(markerCoords, true);
  if (coords) {
    updateAutoTourMap(coords._lat, coords._lon);
  } else { // Sehr seltener Fall wenn auch die google geolocate API versagt.
    alert("'" + markerCoords + "' is not an address!");
  }
}

function getSpecialFilter(){
  var $div, $checkbox, $selectbox, $favorites, opt, attributs,
    select_specials = $.gctour.lang('autoTour.filter.special.pm'),
    checkbox_specials = {
      'I haven\'t found ' : $.gctour.lang('autoTour.filter.special.notfound'),
      'is Active' : $.gctour.lang('autoTour.filter.special.isActive')
    },
    tq_filter = JSON.parse(GM_getValue('tq_specialFilter', '{}'));

// Begin, f�r Umstellung des Filters
// => Kann bei �bern�chster Version wieder entfernt werden
  if (tq_filter["is not a PM cache"]) {
    tq_filter["pm"] = "not";
  }
// End

  $div = $('<div>')
    .html("<b>" + $.gctour.lang('autoTour.filter.special.caption') + "</b><br/>")
    .css({
      "text-align": "left",
      "padding-left": "10px",
      "padding-right": "10px",
      "float": "left",
      "background-color": "#ffe"
    });

   //begin PM
    $selectbox = $('<select/>', {id: "special_pm"})
      .css({
        "margin": "0 0 6px 0",
        "width": "160px"
      });

    $.each(select_specials, function(key, value) {
      opt = $('<option value="' + key + '">' + value + '</option>');
      if (tq_filter["pm"] == key) {
        opt.prop('selected', true);
      }
      $selectbox.append(opt);
    });

    $div.append(
      $selectbox,
      $('<br>')
    );
   //end PM

  $.each(checkbox_specials, function(key, value) {

    attributs = {
      type: 'checkbox',
      name: "special",
      id: "special" + key,
      value: key,
      checked: tq_filter[key] ? 'checked' : false
    };

    $checkbox = $('<span>')
      .css({
        "margin": "2px",
        "vertical-align": "middle"
      })
      .append(
        $('<input/>', attributs).css("margin", '0 4px 0 0'),
        $('<label>')
          .attr("for", "special" + key)
          .text(value)
      );

    $div.append(
      $checkbox,
      $('<br>')
    );

  });

  $favorites = $('<input>',{
    type: 'text',
    id: 'special_favorites',
    value: tq_filter['minFavorites']
  }).css({
    'margin': '4px 0 0 4px',
    'width': '30px'
  });

  $div.append(
    $('<span>').text($.gctour.lang('autoTour.filter.special.minFavorites')),
    $favorites,
    $('<br>')
  );

  return $div;
}

function getDtFiler(boxName){
  var $div, $checkbox, attributs, tq_filter, title;

  if (boxName == 'Difficulty') {
    tq_filter = JSON.parse(GM_getValue('tq_dFilter', '{}'));
    title = $.gctour.lang('autoTour.filter.difficulty');
  } else {  // terrain
    tq_filter = JSON.parse(GM_getValue('tq_tFilter', '{}'));
    title = $.gctour.lang('autoTour.filter.terrain');
  }

  $div = $('<div>')
    .html("<b>" + title + "</b><br/>")
    .css({
      "text-align": "left",
      "padding-left": "10px",
      "padding-right": "10px",
      "float": "left",
      "background-color": "#ffe"
    });

  for( var i = 1; i <= 5; i = i + 0.5 ){

    attributs = {
      type: 'checkbox',
      name: boxName,
      id: boxName + "" + i,
      value: i,
      checked: tq_filter[""+i] ? 'checked' : false
    };

    $checkbox = $('<span>')
      .css({
        "margin": "2px",
        "vertical-align": "middle"
      })
      .append(
        $('<input/>', attributs).css("margin", '0 2px 0 0'),
        $('<label>').attr("for", boxName + "" + i)
          .append(
            $('<img>').attr("src", "http://www.geocaching.com/images/stars/stars" + (""+i).replace(/\./g, "_") + ".gif")
          )
      );

    $div.append(
      $checkbox,
      $('<br>')
    );

  }

  return $div;
}

function getSizeFilter(){
  var $div, $checkbox, attributs,
    tq_filter = JSON.parse(GM_getValue('tq_sizeFilter', '{}'));

  $div = $('<div>')
    .html("<b>" + $.gctour.lang('autoTour.filter.size') + "</b><br/>")
    .css({
      "text-align": "left",
      "padding-left": "10px",
      "padding-right": "10px",
      "float": "left",
      "background-color": "#ffe"
    });

  $.each(sizesArray, function(index, size) {

    attributs = {
      type: 'checkbox',
      name: "size",
      id: "size" + size.sizeTypeId,
      value: size.sizeTypeId,
      checked: tq_filter[size.sizeTypeId] ? 'checked' : false
    };

    $checkbox = $('<span>')
      .css({
        "margin": "2px",
        "vertical-align": "middle"
      })
      .append(
        $('<input/>', attributs).css("margin", '0 2px 0 0'),
        $('<label>').attr("for", "size" + size.sizeTypeId)
          .append(
            $('<img>').attr("src", 'http://www.geocaching.com/images/icons/container/' + size.sizeTypeId + '.gif')
          )
      );

    $div.append(
      $checkbox,
      $('<br>')
    );

  });

  return $div;
}

function getTypeFilter(){
  var $div, $checkbox, attributs, boo,
    tq_filter = JSON.parse(GM_getValue('tq_typeFilter', '{}'));

  $div = $('<div>')
    .html("<b>" + $.gctour.lang('autoTour.filter.type') + "</b><br/>")
    .css({
      "text-align": "left",
      "padding-left": "10px",
      "padding-right": "10px",
      "float": "left",
      "background-color": "#ffe"
    });

  $.each(wptArray, function(index, wpt) {

    attributs = {
      type: 'checkbox',
      name: "type",
      id: "type" + wpt.wptTypeId,
      value: wpt.wptTypeId,
      checked: tq_filter[wpt.wptTypeId] ? 'checked' : false
    };

    boo = ((index + 1) % 2 === 0); // letzter in seiner Spalte ?

    $checkbox = $('<span>')
      .css("padding-left", boo ? "10px" : "0px" )
      .append(
        $('<input/>', attributs).css("margin", '0 2px 0 0'),
        $('<label>').attr("for", "type" + wpt.wptTypeId)
          .append(
            $('<img>').attr("src", 'http://www.geocaching.com/images/WptTypes/sm/' + wpt.wptTypeId + '.gif')
          )
      );

    $div.append(
      $checkbox,
      (boo ? $('<br>') : "")
    );

  });

  return $div;
}

function getLocateMeButton() {
  var button = $("<button>", {
    css: {
      "margin-left": 10,
      "font-size": 12
    },
    html: "<img id='locateImage' src='" + $.gctour.img.locateMe + "'><span style='vertical-align:top;margin-left:3px;font-weight:bold'>" + $.gctour.lang('findMe') + "</span>"
  })

  .click(function() {
    if (navigator.geolocation) {
      $('locateImage').attr("src","http://madd.in/ajax-loader3.gif");
      navigator.geolocation.getCurrentPosition(
        function(position){
          $('locateImage').attr("src", $.gctour.img.locateMe);
          var latitude  = position.coords.latitude;
          var longitude = position.coords.longitude;

          $("input#markerCoords").val(latitude + ' ' + longitude);
          $("input#markerRadius").val(2);
          getMarkerCoord();
        },

        function(error){
          $('locateImage').attr("src", $.gctour.img.locateMe);
          log('Unable to get current location: ' + error);
        }, { timeout:10000 }
      );
    } else {
      alert("Firefox 3.5? Please update to use this!");
    }
  });

  return button;
}

function getCoordinatesTab() {
  var coordsDiv = $("<div>", {
    id: "coordsDiv",
    css: {
      "clear": "both",
      "align": "left"
    }
  });

  var findMeButton = getLocateMeButton();
  findMeButton.css("cssFloat", "right");
  coordsDiv.append(findMeButton);

  var divEbene = createElement('div', {className: 'ebene'});

  divEbene.innerHTML = '<b>'+$.gctour.lang('autoTour.center')+'</b>&nbsp;&nbsp;&nbsp;&nbsp;'+
    '<input type="text" id="markerCoords" style="width:350px;"><br/>'+
    '<small>'+$.gctour.lang('autoTour.help')+'</small>';

  coordsDiv.append(divEbene);

  divEbene = createElement('div', {className: 'ebene'});
  divEbene.innerHTML = '<b>' +
    $.gctour.lang('autoTour.radius') +
    '</b>&nbsp;&nbsp;&nbsp;&nbsp;' +
    '<input type="text" id="markerRadius" maxlength="4" value="2" style="width:40px;margin-right:5px">' +
    '<select id="markerRadiusUnit">' +
      '<option value="km" selected="selected">' + $.gctour.lang('units.km') + '</option>' +
      '<option value="sm">' + $.gctour.lang('units.mi') + '</option>' +
    '</select>';
  coordsDiv.append(divEbene);

  divEbene = createElement('div');
  divEbene.setAttribute('class','dialogFooter');

  var useButton = createElement('input',{type:"button",value:$.gctour.lang('autoTour.refresh'),style:"background-image:url("+$.gctour.img.autoTour+");margin-top:-24px;"});append(useButton,divEbene);
  useButton.addEventListener('click',getMarkerCoord ,false);

  coordsDiv.append(divEbene);

  return coordsDiv;
}

function getMapPreviewTab(){
  var coordsDiv = createElement('div');
  coordsDiv.align = "left";
  coordsDiv.style.clear = "both";

  var cordsInputLat = createElement('input', {type: 'hidden', id: "coordsDivLat"});
  coordsDiv.appendChild(cordsInputLat);

  var cordsInputLon = createElement('input', {type: 'hidden', id: "coordsDivLon"});
  coordsDiv.appendChild(cordsInputLon);

  var cordsInputRadius = createElement('input', {type: 'hidden', id: "coordsDivRadius"});
  coordsDiv.appendChild(cordsInputRadius);

  var coordsLabel = createElement('div');append(coordsLabel, coordsDiv);
  coordsLabel.innerHTML = $.gctour.lang('markerCoordinate')+": <b id='markerCoordsPreview'>???</b>&nbsp;&nbsp;&nbsp;"+$.gctour.lang('autoTour.radius')+": <b id='markerRadiusPreview'>???km</b>";

  // previewMap
  var staticGMap = createElement('div');
  staticGMap.id = 'staticGMap';

  //~ staticGMap.style.border = '2px solid gray';
  //~ staticGMap.style.backgroundImage = "url("+$.gctour.img.preview+")";
  //~ staticGMap.style.backgroundPosition = "center";
  //~ staticGMap.style.backgroundRepeat = "no-repeat";
//~
  //~ staticGMap.style.height = '200px';
  //~ staticGMap.style.width = '400px';
  //~ staticGMap.style.backgroundRepeat = 'no-repeat';

  coordsDiv.appendChild(staticGMap);

  var cacheCountLabel = createElement('div');append(cacheCountLabel, coordsDiv);
  cacheCountLabel.innerHTML = $.gctour.lang('autoTour.cacheCounts')+" <b id='markerCountPreview'>???</b>";
  var tourDurationLabel = createElement('div');append(tourDurationLabel, coordsDiv);
  tourDurationLabel.innerHTML = $.gctour.lang('autoTour.duration') + " <b id='markerDurationMin'>???</b> min <b id='markerDurationSec'>???</b> sec";

  return coordsDiv;
}

function getAutoTourSubmit(){
  var $submit = $("<div>").append(
    $("<button>",{
      id: "startQuery",
      css: {
        "margin": "15px 0 0 15px",
        "opacity": "0.4"
      },
      "disabled": "disabled",
      html: "<img src ='" + $.gctour.img.startAutoTour + "'>"
    })
    .on('click', startAutoTour)
  );

  return $submit;
}

// waypoint projecting
function CalcPrjWP(lat,lon, dist, angle){
  var B1 = parseFloat(lat);
  var L1 = parseFloat(lon);
  var Dist = parseFloat(dist);
  var Angle = parseFloat(angle);
  var a, b, c, g, q, B2, L2;

  while (Angle > 360) {
    Angle = Angle - 360;
  }
  while (Angle < 0) {
    Angle = Angle + 360;
  }

  //var c = Dist / 6371.0; // KM
  c = Dist /  3958.75587; // miles
  if (B1 >= 0) {
    a = (90 - B1) * Math.PI / 180;
  } else {
    a = B1 * Math.PI / 180;
  }
  q = (360 - Angle) * Math.PI / 180;
  b = Math.acos(Math.cos(q) * Math.sin(a) * Math.sin(c) + Math.cos(a) * Math.cos(c));
  B2 = 90 - (b * 180 / Math.PI);
  if (B2 > 90) {
    B2 = B2 - 180; //Suedhalbkugel
  }
  if ((a + b) === 0) {
    g = 0; //Nenner unendlich
  } else {
    g = Math.acos( (Math.cos(c) - Math.cos(a) * Math.cos(b)) / (Math.sin(a) * Math.sin(b)) );
  }
  if (Angle <= 180) {
    g = (-1) * g;
  }
  L2 = (L1 - g * 180 / Math.PI);

  return [Math.round(B2 * 100000) / 100000,Math.round(L2 * 100000) / 100000];
}

function showAutoTourDialog(center, radius) {

  //if (!isLogedIn()) { return; }

  var overLay = getOverlay({
        caption: $.gctour.lang('autoTour.title'),
        minimized: true
      });

  $(overLay).append(
    getCoordinatesTab(),
    $("<div>", {
      id: "autoTourContainer",
      css: {
        "display": "none",
        "clear": "both",
        "border-top": "2px dashed #B2D4F3",
        "margin-top": 12
      }
    }).append(
      getMapPreviewTab(),
      $('<div>').append(
        getTypeFilter(),
        getSizeFilter(),
        getDtFiler('Difficulty'),
        getDtFiler('Terrain'),
        getSpecialFilter()
      ),
      getAutoTourSubmit()
    )
  );

  if (center && radius) {
    $("input#markerCoords").val(center.lat.toFixed(5) + ' ' + center.lng.toFixed(5));
    $("input#markerRadius").val(radius);
    getMarkerCoord();
  } else {
    $("input#markerRadius").val(2);
    $('input#markerCoords')
      .val(
        $('span#uxLatLon').text() ||                                   // /seek/cache_details.aspx und auch /geocache/
        $('span#ctl00_ContentBody_LocationPanel1_OriginLabel').text()  // /seek/nearest.aspx
      )
      .focus()
      .select();
  }

}
