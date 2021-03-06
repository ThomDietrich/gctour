/* ----- utilities ------*/

// Read a GET URL variables and return them as an associative array.
function getUrlVars(url) {
  var vars = [], hash;
  var hashes = url.slice( url.indexOf('?') + 1 ).split('&');
  for(var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

/* USAGE: createElement('table',{style:"border-collapse:seperate;"});append(image_table,dummy_images); */
function createElement(type, attributes) {
  var node = document.createElement(type), attr;
  for (attr in attributes) {
    if (attributes.hasOwnProperty(attr)){
      node.setAttribute(attr, attributes[attr]);
    }
  }
  return node;
}

function append(thisElement, toThis) {
  return toThis.appendChild(thisElement);
}

function parseXml(str, typ) {
  // typ z.B. 'text/xml'
  return (new DOMParser()).parseFromString(str, typ);
}

function fillTemplate(mapping, template){
  var j, dummy;
  for(j = 0 ; j<mapping.length ; j++){
    template = template.replace(new RegExp("###"+mapping[j][0]+"###","g"),mapping[j][1]);
  }

  dummy = createElement('div');
  dummy.innerHTML = template;
  return dummy.firstChild;
}

// rot13.js from gc.com
function createROT13array() {
  var A = 0,
      C = [],
      D = "abcdefghijklmnopqrstuvwxyz",
      B = D.length;
  for (A = 0; A < B; A++) {
    C[D.charAt(A)] = D.charAt((A + 13) % 26);
  }
  for (A = 0; A < B; A++) {
    C[D.charAt(A).toUpperCase()] = D.charAt((A + 13) % 26).toUpperCase();
  }
  return C;
}

function convertROT13Char(A) {
  return (A >= "A" && A <= "Z" || A >= "a" && A <= "z" ? rot13array[A] : A);
}

function convertROT13String(C) {
  var A = 0,
      B = C.length,
      D = "";
  if (!rot13array) {
    rot13array = createROT13array();
  }
  for (A = 0; A < B; A++) {
    D += convertROT13Char(C.charAt(A));
  }
  return D;
}

function convertROTStringWithBrackets(C) {
  var F = "",
      D = "",
      E = true,
      A = 0,
      B = C.length;

  if (!rot13array) {
    rot13array = createROT13array();
  }

  for (A = 0; A < B; A++) {
    F = C.charAt(A);

    if (A < (B - 4)) {
      if (C.toLowerCase().substr(A, 4) == "<br/>") {
        D += "<br/>";
        A += 3;
        continue;
      }
    }

    if (F == "[" || F == "<") {
      E = false;
    } else {
      if (F == "]" || F == ">") {
        E = true;
      } else {
        if ((F === " ") || (F === "&dhbg;")) {
        } else {
          if (E) {
            F = convertROT13Char(F);
          }
        }
      }
    }

    D += F;
  }
  return D;
}

/* Replace all  &,< and > with there HTML tag */
function encodeHtml(htmlString) {
  return (!htmlString) ? "" : htmlString.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function xsdDateTime(date) {
  function pad(n) {
   var s = n.toString();
   return (s.length < 2) ? '0'+s : s;
  }

  var yyyy = date.getFullYear(),
      mm1  = pad(date.getMonth()+1),
      dd   = pad(date.getDate()),
      hh   = pad(date.getHours()),
      mm2  = pad(date.getMinutes()),
      ss   = pad(date.getSeconds());

  return yyyy +'-' +mm1 +'-' +dd +'T' +hh +':' +mm2 +':' +ss+'Z';
}

function get(url, cb) {
  log([
    "---GET---",
    "\turl: " + url,
    "---/GET/---"
  ].join("\n"));

  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    onload: function(xhr) {
      responseInfo(xhr);
      cb(xhr.responseText);
    }
  });
}

function postSync(url, data){
    log([
    "---POST SYNCHRON---",
    "\turl: " + url,
    "\tdata: " + data,
    "---/POST SYNCHRON/---"
  ].join("\n"));

  var result = GM_xmlhttpRequest({
    method: "POST",
    url: url,
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    data:encodeURI(data),
    synchronous:true
  }).responseText;

  return result;
}

function post(url, data, cb) {
  log([
    "---POST---",
    "\turl: " + url,
    "\tdata: " + data,
    "---/POST/---"
  ].join("\n"));

  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    headers:{'Content-type':'application/x-www-form-urlencoded'},
    data:encodeURI(data),
    onload: function(xhr) {
      responseInfo(xhr);
      cb(xhr.responseText);
    }
  });
}

// inspiration: dojo.date.difference
// http://jsfiddle.net/fr4Na/
function DateDiff(date1, date2, einheit) {
  var ms = date1.getTime() - date2.getTime(); // milliseconds
  var diff;

  switch (einheit) {
   case "second":
     diff = ms / 1000;
     break;
   case "minute":
     diff = ms / 60000;     // 1000 * 60
     break;
   case "hour":
     diff = ms / 3600000;   // 1000 * 60 * 60
     break;
   case "day":
     diff = ms / 86400000;  // 1000 * 60 * 60 * 24
     break;
   case "week":
     diff = ms / 604800000; // 1000 * 60 * 60 * 24 * 7
     break;
   default:
     diff = ms;
     break;
  }

  return diff;
}

function getDateFormat(force){
  var date_format_update = new Date(GM_getValue('date_format_update')),
      current_date = new Date(),
      req = new XMLHttpRequest(),
      myUrl = 'http://www.geocaching.com/account/ManagePreferences.aspx',
      response_div,
      date_format;

  // get date format every 30 minutes
  if (force || !date_format_update || Math.round(DateDiff(current_date, date_format_update, "minute")) > 30) {
    //replace updatedate
    GM_setValue('date_format_update', current_date.toString());

	var response = GM_xmlhttpRequest({
	  method: "GET",
	  url: myUrl,
	  synchronous: true
	});
  
    response_div = createElement('div');
    response_div.innerHTML = response.responseText;
    // parse date format
    date_format = $('select#ctl00_ContentBody_uxDateTimeFormat option:selected', response_div).val();
    if (date_format !== "undefined") {
      // and save the selected option
      GM_setValue('date_format', date_format);
      debug("fn getDateFormat - GM_setValue: 'date_format' = " + date_format);
    } else {
      error("fn getDateFormat - select#ctl00_ContentBody_uxDateTimeFormat is undefined");
    }
  }

  // allways set! otherwise something went wrong...
  return GM_getValue('date_format');
}

/* Test code for all date pattern
  http://jsfiddle.net/rmpyL/
*/
// GC dateformat to jQuery ui datepicker dateformat
function dateFormatConversion(format, force){
  force = force || false;
  var conversions = {
      "yyyy-MM-dd" : "yy-mm-dd",
      "yyyy/MM/dd" : "yy/mm/dd",
      "MM/dd/yyyy" : "mm/dd/yy",
      "dd/MM/yyyy" : "dd/mm/yy",
      "dd/MMM/yyyy": "dd/M/yy",
      "MMM/dd/yyyy": "M/dd/yy",
      "dd MMM yy"  : "dd M y"
  },
  jqui_format = conversions[format];

  if (!jqui_format) {
    if (force) {
      return dateFormatConversion(getDateFormat(true));
    } else {
      throw "fn dateFormatConversion: no dateformat found: '" + format + "'";
    }
  }

  return jqui_format;
}

function parseDate(date_string){
  var orig_date_format = getDateFormat(),
      jqui_date_format = dateFormatConversion(orig_date_format, true),
      date,
      debugStr = "Parse Datestring: '" + date_string + "'\nOrig-Format: '" + orig_date_format + "'\njqui-Format: '" + jqui_date_format;

  try {
    date = $.datepicker.parseDate(jqui_date_format, date_string);
    debug(debugStr + "'\nDate: " + date + "'");
  } catch(e) {
    throw e + ", " + debugStr;
  }

  return date;
}

function formatDate(date){
  var orig_date_format = getDateFormat(),
      jqui_date_format = dateFormatConversion(orig_date_format),
      date_string      = $.datepicker.formatDate(jqui_date_format, date);

  debug("format Date: '" + date + "'\nOrig-Format: '" + orig_date_format + "'\njqui-Format: '" + jqui_date_format + "'\nDatestring: '" + date_string + "'");

  return date_string;
}

