function printPageFunction(currentTour){
  return function(){
    var i, tr, td;
    if(isLogedIn() && isNotEmptyList()){

      var minimal = GM_getValue('printMinimal',false);

      var cacheDetailTemplate =
        '<div class="cacheDetail" id="###GUID###">'+
        '  <div class="geocache_count ###HIDDENSTYLE###"><span>###CACHECOUNT###</span></div>'+
        '  <div class="geocache_id">###GCID###</div>'+
        '  <div>'+
        '    <img src="http://www.geocaching.com/images/WptTypes/sm/###TYPE###.gif">'+
        '    <span style="font-weight: bold;">###CACHENAME###</span>'+
        '    <span style="margin-right: 3px;"> (###OWNER### - ###HIDDEN###)</span>'+
        '  </div>'+
        '  <div class="details">'+
        '    <span><img src="http://www.geocaching.com/images/icons/coord_update.gif" heigth="12px" class="###COORDINATESISEDIT###"/> ###COORDINATES###</span>'+
        '    <span><img src="http://www.geocaching.com/images/icons/compass/###BEARING###.gif"/>###DISTANCE###&nbsp;</span>'+
        '    <span>D:<img src="http://www.geocaching.com/images/stars/stars###DIFFICULTY###.gif"/></span>'+
        '    <span>T:<img src="http://www.geocaching.com/images/stars/stars###TERRAIN###.gif"/></span>'+
        '    <span>S:<img src="http://www.geocaching.com/images/icons/container/###SIZE###.gif"/></span>'+
        '  </div>'+
        '  <div>'+
        '    <span>###ATTRIBUTES###</span>'+
        '    <span><img alt="Inventory" src="http://www.geocaching.com/images/WptTypes/sm/tb_coin.gif"/>Inventory:</span>'+
        '    <span>###INVENTORY###</span>'+
        '  </div>'+
        '  <div class="content">'+
        '    <div class="short ###HIDDENSTYLE###">###SHORT_DESCRIPTION###</div>'+
        '    <div class="long ###HIDDENSTYLE###">###LONG_DESCRIPTION###</div>'+
        '    <div>###GCCOMMENT###</div>'+
        '    <div>###CACHENOTE###</div>'+
        '    <div><b>Hint:</b> ###HINT###</div>'+
        '    <div class="waypoints ###HIDDENSTYLE###">###ADDITIONAL_WAYPOINTS###</div>'+
        '    <div class="images">###IMAGES###</div>'+
        '    <div id = "###MAPID###" class="map ###HIDDENSTYLE###">###MAP###</div>'+
        '    <div class="removable ###HIDDENSTYLE###">###LOGCOUNTER###</div>'+
        '    <div class="logs ###HIDDENSTYLE###">###LOGS###</div>'+
        '    <div style="clear:both">&nbsp;</span>'+
        '  </div>'+
        '</div>';
      var ownMarkerTemplate =
        '<div class="cacheDetail">'+
        '  <div class="geocache_count ###HIDDENSTYLE###" style="padding:5px !important"><span>###CACHECOUNT###</span></div>'+
        '  <div class="wpt_id">###GCID###</div>'+
        '  <div>'+
        '    <img src="###TYPE###">'+
        '    <span style="font-weight: bold;">###NAME###</span><br/>'+
        '    <span>###COORDINATES###</span>'+
        '  </div>'+
        '  <div>'+
        '    <div class="long">###CONTENT###</div>'+
        '  </div>'+
        '</div>';

      var costumMarker = (typeof(currentTour.geocaches[0].latitude) != "undefined");

      var url_guid = (!costumMarker) ? currentTour.geocaches[0].guid : "39eedff9-69ea-4a18-97b0-bde6bfbccfb7";
      //var newwindow2 = window.open('http://www.geocaching.com/seek/cdpf.aspx?guid=' + url_guid, null, 'fullscreen=yes,scrollbars=yes,toolbar=yes,menubar=yes');
      

			$('html').html("");


		  //var bodyTag = document.getElementsByTagName('body')[0];
		 var bodyTag =  document.createElement('body');
		  $('html').append(bodyTag);
		  
		  bodyTag.style.background='none';
		  bodyTag.style.backgroundColor="white"; 
		 // set the title of the print view
          var now = new Date();
          var Jahresmonat = now.getMonth();
          var Monat = $.gctour.lang('months');
          var Std = now.getHours();
          var Min = now.getMinutes();
          var StdAusgabe = ((Std < 10) ? "0" + Std : Std);
          var MinAusgabe = ((Min < 10) ? "0" + Min : Min);
         
          bodyTag.innerHTML = '';
          
          
          
          var body = document.createElement('div');
          $(body).width("648px");
          $( body ).css( "margin", "30px auto" );
      
          
          bodyTag.appendChild(body);
          
          addProgressbar({_document:document,closeCallback:function(_document){return function(){GM_setValue("stopTask",true);_document.defaultView.close();};}});

          var head = document.getElementsByTagName('head')[0];
          var jqCss = $('<link/>').attr("href", "http://www.geocaching.com/css/jqueryui1104/jqUI").attr("rel","stylesheet").appendTo($(head));
          
          
          var style = document.createElement('style');
          style.type = 'text/css';
          //~ style.innerHTML = 'font {font-size:x-small !important}  td {font-size:x-small !important} span {font-size:x-small !important}'+
                    //~ 'div {font-size:x-small !important} p {font-size:x-small !important}';
          //~ style.innerHTML = 'font,td,th,span,div, p {font-size:'+GM_getValue("printFontSize","x-small")+'!important} ';
          style.innerHTML = '*{ font-size:'+GM_getValue("printFontSize","x-small")+' } .cacheDetail{ border: 1px solid lightgray; width: 100%; text-align: left;padding:5px; -moz-box-sizing: border-box; } .wpt_id{ position:relative; padding:5px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_id{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; }  .content{ clear:both; border-top:2px dashed lightgray; margin-top:10px; padding-top:10px; }  img{ vertical-align:middle; }  #details span{ margin-left: 10px } .images{clear:both;height:auto}';
          style.innerHTML += '.map{clear:both} .logs{clear:both} .hidden{display:none} .highlight{background-color:pink}';
          style.innerHTML += '.geocache_count{ position:relative; padding:20px !important; float:right;  font-size:medium; font-weight:bold; } .geocache_count span{padding: 5px; font-weight: bold; font-size: 18px; -moz-border-radius: 5px; border-radius: 5px; border:2px dotted black;}';
          style.innerHTML += 'sup {vertical-align:baseline;font-size:77%;position:relative;top:-5px;}';
          style.innerHTML += '.dialogMask {background-image:url('+$.gctour.img.dialogMask+');height:100%;left:0;opacity:0.7;position:fixed;top:0;width:100%;z-index:1100;}'+
                    '.dialogBody{-moz-border-radius:5px; border-radius:5px; background:none repeat scroll 0 0 #fff;border:1px solid #333333;color:#333333;cursor:default;font-family:Arial;font-size:12px;left:50%;margin-left:-250px;margin-top:20px;padding:0 0 1em;position:fixed;text-align:left;top:0;width:500px;z-index:1101;max-height:85%;min-height:370px;overflow:auto;}'+
                    '.dialogBody p {font-size:12px;font-weight:normal;margin:1em 0em;}'+
                    '.dialogBody h1{background-color:#B2D4F3;font-size:110%;font-family:Helvetica Neue,Arial,Helvetica,sans-serif;margin-bottom:0.2em;padding:0.5em;-moz-border-radius:5px 5px 0px 0px;border-radius:5px 5px 0px 0px;color:#333333;background-image:url("'+$.gctour.img.tabBg+'");margin:0px;}'+
                    '.dialogHistory {border:1px inset #999999;margin:0 1em 1em;height:200px;overflow-y:auto;width:448px;padding-left:1em;}'+
                    '.dialogHistory ul{margin-left:2em;}'+
                    '.dialogHistory li{list-style-type:circle;}'+
                    '.dialogFooter input{-moz-border-radius:3px;border-radius:3px;background:none no-repeat scroll 4px center #EEEEEE;border:1px outset #666666;cursor:pointer;float:right;margin-left:0.5em;padding:3px 5px 5px 20px;min-width:100px;}'+
                    '.dialogFooter input:hover { background-color:#f9f9f9; }'+
                    '.dialogContent {padding:0px 10px 0px 10px;}'+
                    '.dialogMin {min-height:0px !important}'+
                    '.noprint {padding:2px;border: 1px solid #c0cee3;z-index: 10000;background-color: #eff4f9; text-align: left;margin-top:10px} .noprint>div {margin-top:2px} '+
                    '.noprint>input {border: 1px outset #666666;cursor: pointer;margin:5px;padding: 3px 5px 5px 25px;background: none no-repeat scroll 4px center #eeeeee;float:left;clear:both;} '+
                    '.noprint>input:hover {background-color:#f9f9f9}';

          head.appendChild(style);

          style = document.createElement('style');
          style.media = 'print';
          style.type = 'text/css';
          //hide the map control in print
          style.innerHTML = '.noprint   { display: none; } body {margin: 0;padding: 0;color: black;background: transparent;width:99%}';

          head.appendChild(style);

          var printInfo = document.createElement('div');
          printInfo.className = 'noprint';
          printInfo.innerHTML = $.gctour.lang('dontPrintHint');

          body.appendChild(printInfo);
          
          
          
          $("<fieldset/>",{
        'class': 'noprint'
        })
           .css('right','50px')
      .css('position','fixed')
        
        .append(
        $("<legend/>").html($.gctour.lang('printview'))
        .css('background',"url(\""+$.gctour.img.gctourLogoSmall+"\") no-repeat scroll 0 0 transparent")
        .css('padding-left','20px')
        ,
        
        $("<input/>").attr("type","input").attr("value",$.gctour.lang('print')).css("background-image","url("+$.gctour.img.printer+")").click(function(){self.print()}),
        $("<input/>").attr("type","input").attr("value",$.gctour.lang('close')).css("background-image","url("+$.gctour.img.closebutton+")").click(function(){location.reload();})
        
        
        ).appendTo($(body));

          // front page
          if(GM_getValue('printFrontpage',true) && !minimal){
            var title = $('<div>',{
              id: 'printTitle',
              css: {
                width: "100%",
                textAlign: 'center',
                "page-break-after": ((GM_getValue('printPageBreakAfterMap', true)) ? 'always' : 'never')
              },
              html: "<h1>" + currentTour.name + "</h1>"
            });
            $(body).append(title);

            var coverTable = document.createElement('table');
            coverTable.style.width = "100%";
            //~ coverTable.style.textAlign = 'left';
            //~ coverTable.style.marginLeft = 'auto';
            //~ coverTable.style.marginRight = 'auto';
            coverTable.style.border = '1px solid lightgray';

            coverTable.innerHTML =
              '<thead><tr>           '+
              '  <th colspan="2" style="border-bottom:1px solid lightgray;"><b>'+$.gctour.lang('printviewCache')+'</b></th>    '+
              '  <th style="border-bottom:1px solid lightgray;">&nbsp;</th>    '+
              '  <th style="border-bottom:1px solid lightgray;">&nbsp;</th>    '+
              '  <th style="border-bottom:1px solid lightgray;" align="center"><b>D</b></th>    '+
              '  <th style="border-bottom:1px solid lightgray;" align="center"><b>T</b></th>    '+
              '  <th style="border-bottom:1px solid lightgray;" align="center"><b>S</b></th>    '+
              '  <th style="border-bottom:1px solid lightgray;" align="center"><b>L4L</b>&nbsp;</th>    '+
              '  <th style="border-bottom:1px solid lightgray;"><b>'+$.gctour.lang('markerCoordinate')+'</b></th>    '+
              '  <th style="border-bottom:1px solid lightgray;"><b>'+$.gctour.lang('printviewFound')+'</b></th>    '+
              '  <th style="border-bottom:1px solid lightgray;">&nbsp;&nbsp;<b>'+$.gctour.lang('printviewNote')+'</b></th>    '+
              '</tr><thead>';

            var tbody = createElement('tbody');append(tbody,coverTable);

            var isCostumMarker = false;
            for (i = 0; i < currentTour.geocaches.length; ++i){
              var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");

              if(!costumMarker){

                tr = document.createElement('tr');tbody.appendChild(tr);
                td = document.createElement('td');tr.appendChild(td);
                td.innerHTML = "<b style='margin:0 6px'>"+(i+1)+"</b>";

                td = createElement('td',{style:"border-bottom:1px solid lightgray;"});tr.appendChild(td);
                td.innerHTML = "<img src='"+currentTour.geocaches[i].image+"'>";

                td = createElement('td',{style:"border-bottom:1px solid lightgray;white-space:nowrap;"});tr.appendChild(td);
                //~ td.style.width = "100%";
                td.innerHTML = "<a style='color:#000000;text-decoration: none'  target='_blank' href='http://www.geocaching.com/geocache/"+currentTour.geocaches[i].id+"'>"+currentTour.geocaches[i].name + "</a>";

                td = createElement('td',{style:"border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"});tr.appendChild(td);
                td.innerHTML = "<span style='margin:0 2px'>"+currentTour.geocaches[i].id+"</span>";

                td = createElement('td',{style:"border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"});tr.appendChild(td);
                td.innerHTML = "<span style='margin:0 2px' id='d_" + currentTour.geocaches[i].id + "'></span>";

                td = createElement('td',{style:"border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"});tr.appendChild(td);
                td.innerHTML = "<span style='margin:0 2px' id='t_" + currentTour.geocaches[i].id + "'></span>";

                td = createElement('td',{style:"border-bottom:1px solid lightgray;border-right:1px dashed lightgray;"});tr.appendChild(td);
                td.innerHTML = "<span style='margin:0 2px' id='s_" + currentTour.geocaches[i].id + "'></span>";

                td = createElement('td',{style:"border-bottom:1px solid lightgray;white-space:nowrap;"});tr.appendChild(td);
                td.innerHTML = "<canvas id='l4l_"+currentTour.geocaches[i].id+"' width='17' height='17' style='margin-left: 2px;position: relative;top: 2px;'/>";


                td = createElement('td',{style:"border-bottom:1px solid lightgray;white-space:nowrap;"});tr.appendChild(td);
                td.innerHTML = "<span style='margin:0 2px' id='coords_"+currentTour.geocaches[i].id+"'></span>";

                td = document.createElement('td');tr.appendChild(td);
                td.style.verticalAlign = "middle";
                //~ td.style.border = '1px solid lightgray';
                // ToDo: if "Found" is (GPX)sym = "Geocache Found" => Print Found = true, or Property = ignore my founds by print
                td.innerHTML = "<div style='margin-left:auto;margin-right:auto;width:10px;height:10px;border:1px solid lightgray;'>&nbsp;</div>";

                td = createElement('td',{style:"border-bottom:1px solid lightgray;"});tr.appendChild(td);
                td.style.verticalAlign = "middle";
                td.style.width = "100%";
                td.innerHTML = "&nbsp;";
              } else {
                isCostumMarker = costumMarker;
              }
            }

            if(isCostumMarker){
              tbody.innerHTML +=
              '<tr>           '+
              '  <td colspan="11" style="border-bottom:1px solid lightgray;"><b>'+$.gctour.lang('printviewMarker')+'</b></td>    '+
              '</tr>';

              for (i = 0; i < currentTour.geocaches.length; ++i){
                var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");

                if(costumMarker){
                  tr = document.createElement('tr');tbody.appendChild(tr);
                  td = document.createElement('td');tr.appendChild(td);

                  td.innerHTML = "<b style='margin:0 10px'>"+(i+1)+"</b>";

                  td = document.createElement('td');tr.appendChild(td);
                  td.innerHTML = "<img src='"+currentTour.geocaches[i].image+"'>";

                  td = document.createElement('td');tr.appendChild(td);
                  td.style.verticalAlign = "middle";
                  td.style.width = "30%";
                  td.colSpan = "9";
                  td.style.borderBottom = '1px solid lightgray';
                  td.innerHTML = currentTour.geocaches[i].name;
                  td.innerHTML += " - "+new LatLon(currentTour.geocaches[i].latitude,currentTour.geocaches[i].longitude).toString();
                }
              }

            }

            $(title).append($(coverTable));

            var overview_map = createElement('div',{id:"overview_map"});
            $(title).append($(overview_map));
          }

          /* map array */
          var geocaches = [];
          var costumMarkers = [];

          for (i = 0; i < currentTour.geocaches.length; ++i){

            if(GM_getValue("stopTask",false) && i !== 0){
              GM_setValue("stopTask",false);
              alert("aktualisiere dich!");
            } else if (GM_getValue("stopTask",false) && i === 0 ) {
              GM_setValue("stopTask",false);
            }

            var costumMarker = (typeof(currentTour.geocaches[i].latitude) != "undefined");

            if(!costumMarker){

              var geocache = getGeocache(currentTour.geocaches[i].id);

              if(geocache == "pm only"){
                var pmOnlyDiv = createElement('div');
                pmOnlyDiv.setAttribute('class','cacheDetail');
                pmOnlyDiv.innerHTML = "<b><img src='"+currentTour.geocaches[i].image+"'>"+currentTour.geocaches[i].name+" ("+currentTour.geocaches[i].id+") is PM ONLY!</b>";
                body.appendChild(pmOnlyDiv);
                body.appendChild(document.createElement('br'));
              } else {

                //log
                var logs_div = createElement('div');


                var logs = geocache.logs;
                var maxPrintLogs = parseInt(GM_getValue('maxPrintLogs',3), 10);
                // if maxprintlogs is <= -1, export all logs to the print overview
                if(maxPrintLogs <= -1) {
                  maxPrintLogs = logs.length;
                }
                maxPrintLogs = maxPrintLogs;
                for (var log_i = 0; (log_i < logs.length && (log_i < maxPrintLogs)); log_i++){
                  var log_div = createElement('div', {style:"width:100%;page-break-inside:avoid;"});
                  log_div.setAttribute("class", "removable");

                  var log_type_img = createElement('img', {src:'http://www.geocaching.com/images/logtypes/'+logs[log_i].LogTypeImage});
                  log_div.appendChild(log_type_img);
                  log_div.innerHTML += " " + logs[log_i].Created +" - "+ logs[log_i].UserName +" ("+logs[log_i].GeocacheFindCount+")<br/>";
                  log_div.innerHTML += logs[log_i].LogText;
                  
                  log_div.style.borderBottom = "1px dashed lightgray";
                  append(log_div, logs_div);
                }

                var dummy_additional_waypoints = createElement('div');
                if (GM_getValue('printAdditionalWaypoints',true)){
                  var wpts_table = createElement('table', {style:"width:100%;border-collapse:separate;"} );append(wpts_table,dummy_additional_waypoints);
                  wpts_table.setAttribute("class", "removable");
                  var content = "<tr>";
                  for(var waypoints_i = 0; waypoints_i < geocache.additional_waypoints.length; waypoints_i++){

                  if(waypoints_i % 2 === 0 || waypoints_i == geocache.additional_waypoints.length-1){
                      if(waypoints_i !== 0 && waypoints_i != 1){
                        content += "</tr>";
                      }
                      if(waypoints_i == geocache.additional_waypoints.length-1 && waypoints_i !== 1){
                        content += "<tr>";
                      }
                    }

                    content += "<td style='width:50%;'>";
                    content +="<img src='"+geocache.additional_waypoints[waypoints_i].symbol+"'>";
                    content +="<b>"+geocache.additional_waypoints[waypoints_i].name+"</b>";
                    content +=" | "+geocache.additional_waypoints[waypoints_i].coordinates + "<br/>";
                    content += "<i>"+geocache.additional_waypoints[waypoints_i].note + "</i><br/>";
                  }
                  content += "</tr>";

                  wpts_table.innerHTML = content;
                }

                //images
                var dummy_images = createElement('div');
                if (GM_getValue('printSpoilerImages',true)){
                  var image_table = createElement('table',{style:"border-collapse:seperate;border-spacing:2px;width:100%"});append(image_table,dummy_images);
                  var content = "<tr>";
                  for(var images_i = 0; images_i < geocache.images.length; images_i++){
                    if(images_i % 2 === 0 || images_i == geocache.images.length-1){
                      if(images_i !== 0 && images_i !== 1){
                        content += "</tr>";
                      }
                      if(images_i == geocache.images.length-1 && images_i != 1){
                        content += "<tr>";
                      }
                    }
                    content += "<td class='removable'>";
                    content += "<img style='max-width:8cm;' src='"+geocache.images[images_i].href+"'><br/>";
                    content += "<b>"+geocache.images[images_i].textContent+"</b>";
                    content += "</td>";
                  }
                  content += "</tr>";
                  image_table.innerHTML = content;
                }

                // inventory
                var inventory = createElement('span');
                for (var inventory_i = 0; inventory_i < geocache.inventory.length; inventory_i++){
                  var image = createElement('img');
                  image.src = geocache.inventory[inventory_i].src;
                  append(image,inventory);
                }
                if(geocache.inventory.length === 0){
                  var empty_inventory = createElement('span');
                  empty_inventory.innerHTML = "empty";
                  append(empty_inventory,inventory);
                }

                //attributes
                var attributes = createElement('span');
                for (var attributes_i = 0; attributes_i < geocache.attributes.length; attributes_i++){
                  var attribute = geocache.attributes[attributes_i];
                  attribute.style.width = "16px";
                  attribute.style.height = "16px";
                  attribute.style.marginRight = "3px";
                  //~ attribute.style.opacity = "0.5";
                  if(attribute.src != "http://www.geocaching.com/images/attributes/attribute-blank.gif") {
                    append(attribute, attributes);
                  }
                }

                var map_element_dummy = createElement('div');
                var map_element = createElement('div');append(map_element, map_element_dummy);

                // map the geocache to uploadable version
                var mapCache = {};
                mapCache.gcid = geocache.gcid;
                mapCache.guid = geocache.guid;
                mapCache.image = geocache.image;
                mapCache.name = geocache.name;
                mapCache.difficulty = geocache.difficulty;
                mapCache.terrain = geocache.terrain;
                mapCache.latitude = geocache.lat;
                mapCache.longitude = geocache.lon;

                // save additional waypoints
                var additional_waypoints = geocache.additional_waypoints;
                for(waypoint_i = 0 ; waypoint_i < additional_waypoints.length; waypoint_i++){
                  additional_waypoints[waypoint_i].note = "";
                }
                mapCache.additional_waypoints = additional_waypoints;
                geocaches.push(mapCache);
                // map the geocache to uploadable version - END -

                var gcComment = "";

                if(geocache.comment){
                  gcComment = "<b><u>GCComment:</u></b><br/>";
                  if(geocache.comment.lat){
                    var parsedCoords = new LatLon(geocache.comment.lat,geocache.comment.lng).toString();
                    gcComment += "<b>Final Coordinates:</b> "+parsedCoords+"<br/>";
                  }
                  gcComment += "<b>Comment:</b> ("+geocache.comment.state+") "+geocache.comment.commentValue;
                }

                var cache_note = "";
                if(geocache.cache_note){
                  cache_note = "<b><u>Cache Note:</u></b><br/>";
                  cache_note += geocache.cache_note;
                }

                if(GM_getValue('printFrontpage',true) && !minimal){

                  $(document)
                    // setting real coordinates on titlepage
                    .find("span#coords_" + geocache.gcid)
                      .html(geocache.coordinates)
                      .css({'border-bottom': (geocache.coordinatesisedit === true ? '2px solid gray' : 'none') })
                      .end()
                    // setting D, T and size on titlepage
                    .find("span#d_"+geocache.gcid).html(geocache.difficulty).end()
                    .find("span#t_"+geocache.gcid).html(geocache.terrain).end()
                    .find("span#s_"+geocache.gcid).html(geocache.size.substring(0,1)).end();

                   // set the last 4 logs icon:
                   getLast4Logs(geocache.logs, $("canvas#l4l_" + geocache.gcid, document));
                   //~ $("span#l4l_"+geocache.gcid,document)[0].html(getLast4Logs(geocache.logs));
                }

                var geocacheMapping = [
                  ['GCID',geocache.gcid],
                  ['CACHECOUNT',i+1],
                  ['GUID',geocache.guid],
                  ['TYPE',geocache.type],
                  ['CACHENAME',(geocache.available)?geocache.name:"<span style='text-decoration: line-through !important;'>"+geocache.name+"</span>"],
                  ['CACHESYM',geocache.cacheSym],
                  ['OWNER',geocache.owner],
                  ['HIDDEN',formatDate(geocache.hidden)],
                  ['ATTRIBUTES',attributes.innerHTML],
                  ['BEARING',geocache.bearing],
                  ['DISTANCE',geocache.distance],
                  ['INVENTORY',inventory.innerHTML],
                  ['COORDINATESISEDIT',(geocache.coordinatesisedit===true)?'':'hidden'],
                  ['COORDINATES',geocache.coordinates],
                  ['DIFFICULTY',geocache.difficulty.replace(/\./,"_")],
                  ['TERRAIN',geocache.terrain.replace(/\./,"_")],
                  ['SIZE',geocache.size.toLowerCase().replace(/ /,"_")],
                  ['SHORT_DESCRIPTION',(geocache.short_description.length === 1) ? geocache.short_description.html() : ""],
                  ['LONG_DESCRIPTION',(geocache.long_description.length === 1) ? geocache.long_description.html() : ""],
                  ['GCCOMMENT',gcComment],
                  ['CACHENOTE',cache_note],
                  ['HINT',(GM_getValue('decryptPrintHints',true))?geocache.hint:convertROTStringWithBrackets(geocache.hint)],
                  ['ADDITIONAL_WAYPOINTS',dummy_additional_waypoints.innerHTML],
                  ['IMAGES',dummy_images.innerHTML],
                  ['MAP', map_element_dummy.innerHTML],
                  ['MAPID', "MAP_"+geocache.gcid],
                  ['LOGCOUNTER',(GM_getValue('printLoggedVisits',false))? geocache.find_counts.html() : ""],
                  ['LOGS',logs_div.innerHTML]
                ];

                if(minimal){
                  geocacheMapping.push(['HIDDENSTYLE',"hidden"]);
                } else {
                  geocacheMapping.push(['HIDDENSTYLE',""]);
                }

                var cacheDetailTemp = fillTemplate(geocacheMapping,cacheDetailTemplate);

                // class "removable" elements and removable images in description
                $(".removable, div[class*='long'] img", cacheDetailTemp)
                  .click(function(e){
                    e.stopPropagation();
                    $(this).remove();
                  })
                  .hover(
                    function(){
                      $(this).css({
                        "opacity": "0.5",
                        "cursor": "url('" + $.gctour.img.del + "'),pointer"
                      });
                    },
                    function(){
                      $(this).css({
                        "opacity": 1
                      });
                    }
                  );

                // remove href attribute from links in "*=long" class
                $("div[class*='long'] a", cacheDetailTemp).removeAttr("href");

                // add editable mode
                if (GM_getValue('printEditMode', false)) {
                  $("div[class*='long'], div[class*='short']",cacheDetailTemp).attr('contenteditable','true');
                }

                if(GM_getValue('printPageBreak',false)){
                  if(i < currentTour.geocaches.length-1) {
                    cacheDetailTemp.style.pageBreakAfter = 'always';
                  }
                }

                body.appendChild(cacheDetailTemp);
                body.appendChild(document.createElement('br'));

              }

            } else {

              // map costum marker to uploadable version
              var cm = currentTour.geocaches[i];
              cm.index = i;
              costumMarkers.push(cm);
              // map costum marker to uploadable version - END -

              var markerMapping = [
                ['GCID',$.gctour.lang('printviewMarker')],
                ['CACHECOUNT',(i+1)],
                ['TYPE',currentTour.geocaches[i].image],
                ['NAME',currentTour.geocaches[i].name],
                ['COORDINATES',new LatLon(currentTour.geocaches[i].latitude,currentTour.geocaches[i].longitude).toString()],
                ['CONTENT',currentTour.geocaches[i].content.replace(/\n/g, "<br />")]
              ];

              if(minimal){
                markerMapping.push(['HIDDENSTYLE',"hidden"]);
              } else {
                markerMapping.push(['HIDDENSTYLE',""]);
              }

              var cacheDetailTemp = fillTemplate(markerMapping,ownMarkerTemplate);
              body.appendChild(cacheDetailTemp);
              body.appendChild(document.createElement('br'));

                //~ geocaches.push(currentTour.geocaches[i]);
            }

            // set the progress
            setProgress(i,currentTour.geocaches.length,document);
          }

          closeOverlayRemote(document)();// close old ovleray (scraping data)
          addProgressbar({caption:$.gctour.lang('makeMapWait'),_document:document,closeCallback:function(_document){return function(){GM_setValue("stopTask",true);_document.defaultView.close();};}}); // new overlay - getting maps
          var cacheObject = {};
          cacheObject.geocaches = geocaches;
          cacheObject.costumMarkers = costumMarkers;
          uploadMap(cacheObject,
            function(result){
              try{
                var overviewMapQuery = "";
                var geocacheCodes = [];

                for (var i = 0; i < currentTour.geocaches.length; ++i){
                  var marker = currentTour.geocaches[i];

                  if(marker.wptcode){
                    overviewMapQuery += marker.wptcode;
                  } else {
                    overviewMapQuery += (marker.id)?marker.id:marker.gcid;
                    geocacheCodes.push((marker.id)?marker.id:marker.gcid);
                  }

                  if(i < currentTour.geocaches.length-1){
                    overviewMapQuery += ",";
                  }
                }

                var boo_OutlineMap = (
                   GM_getValue('printOutlineMap', true) &&
                   GM_getValue('printFrontpage', true) &&
                  !GM_getValue('printMinimal', false)
                );

                // overview map
                var mapCount = (boo_OutlineMap) ? 1 : 0;

                mapCount += (GM_getValue('printOutlineMapSingle', true)) ? geocacheCodes.length : 0;

                if (boo_OutlineMap) {
                  $("div#overview_map", document).first().append( getMapElement(overviewMapQuery, document));
                  setProgress(1, mapCount, document);
                }

                // map for each geocache
                if(GM_getValue('printOutlineMapSingle',true)){
                  for (var i = 0; i < geocacheCodes.length; ++i){
                    var geocacheCode = geocacheCodes[i];
                    var mapElement = $("div#MAP_" + geocacheCode, document).first();

                    if(mapElement){
                      mapElement.append(getMapElement(geocacheCode, document));
                    }
                    setProgress(i+1, mapCount, document);
                  }
                }
                closeOverlayRemote(document)();
              } catch (e) {
                addErrorDialog({caption:"Print error maps", _document:document, _exception:e,closeCallback:function(_document){return function(){GM_setValue("stopTask",true);_document.defaultView.close();};}});
              }

            }
          );
	
    }
  };
}

// funktion ähnlich http://www.gsak.net/help/hs11980.htm
function getLast4Logs(logs, canvas_element){

  var getColor = function(log4Logs){
    if ((typeof (log4Logs)) === 'undefined') { return "LightGray"; }
    switch (log4Logs.LogType) {
      case "Found it":
        return "green";
      case "Didn't find it":
        return "red";
      case "Needs Maintenance":
        return "blue";
      case "Temporarily Disable Listing":
        return "black";
      case "Needs Archived":
        return "yellow";
      default:
        return "LightGray";
    }
  };

  var ctx = canvas_element.get(0).getContext('2d');
  ctx.fillStyle = "black";
  //~ ctx.fillRect(0,0,17,17);
  ctx.clearRect(1,1,15,15);

  var pos = [[2,2],[9,2],[2,9],[9,9]];
  var dim = [6,6];
  for (var i = 0; i < pos.length; i++) {
    ctx.fillStyle = getColor(logs[i]);
    ctx.fillRect (pos[i][0], pos[i][1], dim[0], dim[1]);
  }

}

