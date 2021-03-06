function update(force) {
  var ver_i, chg_i; // for
  var updateDate = new Date(GM_getValue('updateDate'));

  if (!updateDate || updateDate == "Invalid Date") {
    updateDate = new Date();
    GM_setValue('updateDate', updateDate.toString());
  }

  var currentDate = new Date();
  // if the last updateDate is more than 86 400 000 msec (1 day) ago - check for updates
  if ((currentDate.getTime() - updateDate.getTime() > 86400000) || (force === true)) {
    debug("GCTour checked of update");
    //~ if (true) { // ATTENTION!!
    // set the new updateDate
    GM_setValue('updateDate', currentDate.toString());
    var update_request = {'script':SCRIPTID,'version':VERSION,'build':BUILD};

    post(GCTOUR_HOST+'/update', 'update='+JSON.stringify(update_request),
      function(text){
//        alert(text);
        var update_obj = JSON.parse(text);
        log("update check: returns "+text);
        
        if(update_obj.message === "no updates"){
          log("update check: version "+VERSION+" build:"+BUILD+" is up to date");
          if (force === true) {
            alert($.gctour.lang('updateCurrently'));
          }
          return;
        }

        var overlayBody = getOverlay({caption:$.gctour.lang('dlg.newVersion.caption'),minimized:true});

        var versions_string = "";
        for(ver_i = 0 ; ver_i<update_obj.changes.length; ver_i++){
          var version_obj = update_obj.changes[ver_i];
          versions_string += "<div style='margin-top: 0.75em;'><strong>v"+version_obj.version+"."+version_obj.build+"</strong></div>";
          versions_string += "<ul>";
          for(chg_i = 0 ; chg_i<version_obj.changes.length; chg_i++){
            versions_string += "<li>";
            versions_string += version_obj.changes[chg_i];
            versions_string += "</li>";
          }
          versions_string += "</ul>";
        }

        var updateMapping = [
          ['VERSION_OLD',VERSION+"."+BUILD],
          ['VERSION_NEW',update_obj.version+"."+update_obj.build],
          ['VERSION_HISTORY',versions_string]
        ];

        //{"update":"http:\/\/userscripts.org\/scripts\/source\/36273.user.js","build":12345,"script":"gctour","changes":[{"build":12345,"changes":["1.98 test1","1.98 test4","1.98 test6"],"version":1.98},{"build":12343,"changes":["1.97 test1","1.97test2","1.97 test3"],"version":1.97}],"version":1.98}

        var confirmString = $.gctour.lang('updateDialog');

        var update_dom = fillTemplate(updateMapping,confirmString);
        var footer = update_dom.getElementsByTagName('div')[update_dom.getElementsByTagName('div').length-1];

        // if install is pressed set the document.location to the url given by the update object
        var install_button = document.createElement('input');
        install_button.type = "button";
        install_button.value = $.gctour.lang('install');
        install_button.style.backgroundImage = "url("+$.gctour.img.userscript+")";
        install_button.addEventListener('click', function() {
          setTimeout(closeOverlay, 500);
          document.location = update_obj.update;
        }, true);

        var close_button = document.createElement('input');
        close_button.type = "button";
        close_button.value = $.gctour.lang('cancel');
        close_button.style.backgroundImage = "url("+$.gctour.img.closebutton+")";
        close_button.addEventListener('click', closeOverlay, false);

        footer.appendChild(close_button);
        footer.appendChild(install_button);

        overlayBody.appendChild(update_dom);

      }
    );
  }
}

function parseUpdateXMLResponse(xmlString) {
  var i, j; // for
  var updateNode;
  var xmlDoc = (new DOMParser()).parseFromString(xmlString, "application/xml");
  var string = '';

  var scriptElements = xmlDoc.getElementsByTagName('script');

  for(i = 0;i< scriptElements.length;i++) {
    if (scriptElements[i].getAttribute('id') === SCRIPTID) {
      var versions = scriptElements[i].getElementsByTagName('version');
      var currentVersion = 0;
      var currentVersionIndex;
      for(j = 0;j< versions.length;j++) {
        if (versions[j].getAttribute('number') > currentVersion) {
          currentVersion = versions[j].getAttribute('number');
          currentVersionIndex = j;
        }
      }

      if (currentVersion > VERSION) {
        updateNode = versions[currentVersionIndex];
      }
    }
  }

  if (updateNode) {
    var confirmString = 'There is a new version of GcTour.\n\t'+ VERSION +' -> '+ updateNode.getAttribute('number') +'\nChanges:\n';

    var changes = updateNode.getElementsByTagName('change');
    for(j = 0;j< changes.length;j++) {
      confirmString += '\t+ '+ changes[j].textContent +'\n';
    }
    confirmString += '\nDo you want to update?';
    if (confirm(confirmString)) {
      GM_openInTab('http://gc.madd.in/gm/update.php?scriptId='+SCRIPTID+'&fromVersion='+VERSION+'&toVersion='+updateNode.getAttribute('number'));
    }
  }
}
