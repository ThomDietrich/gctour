function update() {
	var updateDate = eval(GM_getValue('updateDate'));
	if (!updateDate) {
		updateDate = new Date();
		GM_setValue('updateDate', uneval(updateDate));
	}
	var currentDate = new Date();

	var update_request = {'script':scriptId,'version':version,'build':build};

	post('http://gctour-spot.appspot.com/update', 'update='+JSON.stringify(update_request),
		function(text){
			//alert(text);
			var update_obj = JSON.parse(text);
			
			var overlayBody = getOverlay("new version available");
		

			var versions_string = ""
			for(var ver_i =0 ; ver_i<update_obj.changes.length; ver_i++){
				var version_obj = update_obj.changes[ver_i]; // TODO: remaind, that in latest gae code  changes is here versions!!
				versions_string += "<div style='margin-top: 0.75em;'><strong>v"+version_obj.version+"."+version_obj.build+"</strong></div>";
				versions_string += "<ul>";
				for(var chg_i =0 ; chg_i<version_obj.changes.length; chg_i++){
					versions_string += "<li>";
					versions_string += version_obj.changes[chg_i];
					versions_string += "</li>";
				}
				versions_string += "</ul>";
			}

			var updateMapping = new Array(
				new Array('VERSION_OLD',version+"."+build),
				new Array('VERSION_NEW',update_obj.version+"."+update_obj.build),
				new Array('VERSION_HISTORY',versions_string)
			);	

			//{"update":"http:\/\/userscripts.org\/scripts\/source\/36273.user.js","build":12345,"script":"gctour","changes":[{"build":12345,"changes":["1.98 test1","1.98 test4","1.98 test6"],"version":1.98},{"build":12343,"changes":["1.97 test1","1.97test2","1.97 test3"],"version":1.97}],"version":1.98}
			
			var confirmString = '<div><img src="http://gctour.madd.in/images/antenna.gif" style="float:right"><p>There is a new version of&nbsp;&nbsp;&nbsp;<a target="_blank" href="http://userscripts.org/scripts/show/36273"><b>GcTour</b></a>&nbsp;&nbsp;&nbsp;available for installation.</p>';
			confirmString += "<p>You currently have version <b>###VERSION_OLD###</b> installed. The latest version is <b>###VERSION_NEW###</b></p>";
			confirmString += "<p><b>Version History:</b></p>";
			confirmString += "<div class='dialogHistory'>";
			confirmString += "###VERSION_HISTORY###";			
			confirmString += "</div>";
			confirmString += "<div class='dialogFooter'></div>";			

			
			var update_dom = fillTemplate(updateMapping,confirmString);
			var footer = update_dom.getElementsByTagName('div')[3];
			
			// if install is pressed set the document.location to the url given by the update object
			var install_button = document.createElement('input');
			install_button.type = "button";
			install_button.value = lang['install'] ;
			install_button.style.backgroundImage = "url("+userscript_image+")";
			install_button.addEventListener('click', function() {
				setTimeout(closeOverlay, 500);
				document.location = update_obj.update;
			}, true);
			
			
			var close_button = document.createElement('input');
			close_button.type = "button";
			close_button.value = lang['cancel'] ;
			close_button.style.backgroundImage = "url("+closebuttonImage+")";
			close_button.addEventListener('click', closeOverlay, false);
			
			footer.appendChild(close_button);
			footer.appendChild(install_button);
				
			
			
			
			
						
			overlayBody.appendChild(update_dom);			
		
		}
	);
	
	
	
	// if the last updateDate is more than 86 400 000 msec (1 day) ago - check for updates
	if (currentDate.getTime() - updateDate.getTime() > 86400000) {
		// set the new updateDate
		GM_setValue('updateDate', uneval(currentDate));
		// make the version request
		var details = {};
		details.method = 'GET';
		details.url = 'http://gc.madd.in/gm/updates.xml';
		details.onload = function (response) { parseUpdateXMLResponse(response.responseText); };
		details.onerror = function (response) { alert('An update error occour - please send an EMail to geocaching@madd.in!');};
		GM_xmlhttpRequest(details);
	}
}

function parseUpdateXMLResponse(xmlString) {
	var updateNode;
	var xmlDoc = (new DOMParser()).parseFromString(xmlString, "application/xml");
	var string = '';

	var scriptElements = xmlDoc.getElementsByTagName('script');

	for(var i = 0;i< scriptElements.length;i++) {
		if (scriptElements[i].getAttribute('id') == scriptId) {
			var versions = scriptElements[i].getElementsByTagName('version');
			var currentVersion = 0; 
			var currentVersionIndex; 
			for(var j = 0;j< versions.length;j++) {
				if (versions[j].getAttribute('number') > currentVersion) {
					currentVersion = versions[j].getAttribute('number');
					currentVersionIndex = j;
				}
			}

			if (currentVersion > version) {
				updateNode = versions[currentVersionIndex];
			}			
		}		
	}




	if (updateNode) {
		var confirmString = 'There is a new version of GcTour.\n\t'+ version +' -> '+ updateNode.getAttribute('number') +'\nChanges:\n';

		var changes = updateNode.getElementsByTagName('change');
		for(var j = 0;j< changes.length;j++) {
			confirmString += '\t+ '+ changes[j].textContent +'\n';
		}
		confirmString += '\nDo you want to update?';
		if (confirm(confirmString)) {
			GM_openInTab('http://gc.madd.in/gm/update.php?scriptId='+scriptId+'&fromVersion='+version+'&toVersion='+updateNode.getAttribute('number'));
		}
	}
}
