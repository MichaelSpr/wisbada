/**
* init namespace "Stammbaum"
*/

var STAMMBAUM = {};
STAMMBAUM.view = {};
STAMMBAUM.helper = {};
STAMMBAUM.params = {};
STAMMBAUM.events = {};
STAMMBAUM.config = {};

/**
*
*/
STAMMBAUM.view.width = 150;
STAMMBAUM.view.init = function(elem) {

	STAMMBAUM.params.startId = parseInt(elem.attr('data-id'));
	STAMMBAUM.params.lastPersonId = parseInt(elem.attr('data-lastpersonid'));
	STAMMBAUM.params.lastBeziehungsId = parseInt((elem.attr('data-lastbeziehungsid') == '')?'0':elem.attr('data-lastbeziehungsid'))+1;
	STAMMBAUM.params.shorturl = document.location.href;
	
	STAMMBAUM.events.hookEvents();
	
	if (STAMMBAUM.view.loadSVG!=null)
		STAMMBAUM.view.loadSVG();
	else if (STAMMBAUM.view.loadHTML != null)
		STAMMBAUM.view.loadHTML(elem);
	
	jQuery(document).trigger("init_done");
}

STAMMBAUM.view.loadHTML = function(elem) {
	var main_ul = elem.children("ul");
	STAMMBAUM.view.set_width(main_ul);
	STAMMBAUM.view.fillLines(main_ul);
	STAMMBAUM.view.disableForbiddenActions(main_ul);
	
	jQuery("div.person").hover(STAMMBAUM.events.onPersonHoverIn, STAMMBAUM.events.onPersonHoverOut);
	
	var scale = STAMMBAUM.helper.round(elem.width()/(main_ul.width()), 3);
	if(scale < 1) { //no upscaling
		main_ul.css("-moz-transform", "scale(" + scale + ")").css("-webkit-transform", "scale(" + scale + ")").css("-o-transform", "scale(" + scale + ")").css("transform", "scale(" + scale + ")").css("msTransform", "scale(" + scale + ")");
		main_ul.css("margin-left", "-" + ((1-scale)/2*main_ul.width()) + "px"); //nach links verschieben
	}
}
STAMMBAUM.view.set_width = function(elem) {
	var width = 0;

	var lis = elem.children("li");


	for(var i=0; i<lis.length; i++) {
		var $li = jQuery(lis[i]); var li_width = 0; var ul_width = 0;

		/* get width of nested lists (recursive) */
		var uls = $li.children("ul");
		if(uls.length > 0) {
			ul_width = STAMMBAUM.view.set_width( jQuery(uls[0]) );
		}

		/* get width of li element */
		li_width += STAMMBAUM.view.width;
		if( $li.hasClass("paar") ) {
			li_width += STAMMBAUM.view.width;
		}

		/* element width = max. width */
		width += Math.max(li_width, ul_width);
	}

	elem.css("width", width + "px");
	return width;
}

STAMMBAUM.view.fillLines = function(elem) {
	var lis = elem.children("li");
	for(var i=0; i<lis.length; i++) {
		var j=i+1; var $li1 = jQuery(lis[i]);

		if(j<lis.length) { //has brother/sister
			var $li2 = jQuery(lis[j]);
			var $li1person = jQuery($li1.children("div")[0]);
			var $li2person = jQuery($li2.children("div")[0]);

			/* get outer right coordinate of left element */
			var x1 = STAMMBAUM.helper.getPersonCoordinates($li1person)[1];
			/* get outer left coordinate of right element */
			var x2 = STAMMBAUM.helper.getPersonCoordinates($li2person)[0];

			if( x1 < x2 ) { //gap in line between li1 and li2 => fill with span
				var span = jQuery("<span></span>");
				span.addClass("line");
				span.css("width", (x2-x1) + "px");
				span.css("left", x1 + "px");
				// inject <span> into li1
				$li1.prepend(span);
			}

		}

		// start recursion
		var uls = $li1.children("ul");
		if(uls.length > 0) {
			STAMMBAUM.view.fillLines( jQuery(uls[0]) );
		}
	}
}

STAMMBAUM.view.disableForbiddenActions = function(elem) {
	/* Remove "addPartner"-button if person has already a partner */
	elem.find("li.paar > div > div > div .addPartner").remove();
	
	/* Remove "addParent"-button if person has already two parents */
	elem.find("li.paar > ul > li > div > div > div .addParent").remove();                

	/* Remove "del"-button if person is not deletable */
	elem.find("li:has(ul) > div > div > div .del").remove();
	
	/* Remove the "del"-button for the root person */
	elem.find('.person[data-id="'+STAMMBAUM.params.startId+'"] > div > .del').remove();
}

/**
* Helper
*/
STAMMBAUM.helper.getPersonCoordinates = function(elem) {
	var left = STAMMBAUM.helper.round(elem.position().left, 2);
	var right = STAMMBAUM.helper.round(elem.position().left + elem.outerWidth(true),2);
	return [left, right];
}

STAMMBAUM.helper.round = function(number, precision) {
	var verschiebung = Math.pow(10, precision);
	return Math.round(number*verschiebung)/verschiebung;
}

STAMMBAUM.helper.log = function(msg) {
	if ( typeof console == 'object' ) { console.log ( msg ); }
}

/**
* Configuration
*/
STAMMBAUM.config.socialmedia = {
	'facebook': { 'name': 'Facebook', 'share': { 'url': 'http://www.facebook.com/sharer.php?u=%URL%', 'popup': true, 'width': 600, 'height': 250 } },
	'twitter': { 'name': 'Twitter', 'share': { 'url': 'http://www.twitter.com/share?url=%URL%', 'popup': true, 'width': 600, 'height': 250 } },
	'xing': { 'name': 'Xing', 'share': { 'url': 'https://www.xing.com/app/user?op=share;url=%URL%', 'popup': false } },
	'vz': { 'name': 'VZ Netzwerke', 'share': { 'url': 'http://platform-redirect.vz-modules.net/r/Link/Share/?url=%URL%', 'popup': true, 'width': 600, 'height': 400 } }
}

// Todo: Give the dialog the correct size
STAMMBAUM.view.dialog = function(data, options) {
	var opts = jQuery.extend({ 'title': '', 'buttons' : [], 'onShow': null }, options);
	var cnt = jQuery("<div></div>").prepend(data);
	if(opts.title != '') cnt.prepend("<h3>" + opts.title + "</h3>");
	
	var dialog = cnt.modal({
		closeHTML: "<a href='#' title='Close'></a>",
		overlayId: 'dialog-overlay',
		containerId: 'dialog-container',
		minWidth: '50%',
		overlayClose: true,
		onOpen: function (dialog) {
			dialog.overlay.fadeIn('slow', function () {
				dialog.data.show();
				dialog.container.fadeIn('fast');
				dialog.container.width( dialog.data.width() );
				dialog.container.height( dialog.data.height() );
			});
		},
		onClose: function (dialog) {
			dialog.container.fadeOut('fast', function () {
				dialog.overlay.fadeOut('fast', function () {
					$.modal.close(); // must call this!
				});
			});
		},
		onShow: function(dialog) {
			if(opts.buttons.length > 0) {
				var btns = jQuery("<div class=\"buttons\"></div>");
				for(var i=0; i<opts.buttons.length; i++) {
					var btn = jQuery.extend({ 'title': '', 'primary': false, 'close': true, 'callback': null }, opts.buttons[i]);
					var tmp = jQuery("<a class=\"btn\">" + btn.title + "</a>");
					
					if(btn.primary) tmp.addClass("primary");
					tmp.click( (function(btn) { 
						return function() { 
							if(btn.callback != null) {
								btn.close = btn.callback(dialog); 
							}
							if(btn.close) { jQuery.modal.close(); } 
							return false; 
						} 
					} )(btn) );
						

					btns.append(tmp);
				}
				cnt.append(btns);
			}
			if(opts.onShow != null) {
				opts.onShow(dialog);
			}
		}
	});
	
	
}

STAMMBAUM.events.onLinkNew = function() {
	// TODO: Fix this. We need to determin the location somehow different
	document.location = (document.location.pathname)
}

STAMMBAUM.events.onLinkSVG = function() {
	// TODO: Fix this. We need to determin the location somehow different
	var loc = "";
	if (document.location.href.match(/outputStyle/))
		loc = document.location.href.replace( /outputStyle=(svg|html)/g , 'outputStyle=svg').replace(/&*$/g,'');
	else
		loc = document.location.href + '&outputStyle=svg';
	window.open(loc);
}

STAMMBAUM.events.onLinkHTML = function() {
	// TODO: Fix this. We need to determin the location somehow different
	document.location = document.location.href.replace( /outputStyle=(svg|html)/g , 'outputStyle=html').replace(/&*$/g,'');
}

STAMMBAUM.events.onLinkExport = function() {
	$.post("../index.php", 
		{ page: "GET", outputStyle: 'xml' },
		function(result) {
			var serializer = new XMLSerializer();
			var xml = serializer.serializeToString(result.documentElement);
			STAMMBAUM.view.dialog('<textarea style="width: 100%; height: 200px;">'+ xml +'</textarea>', { 'title': 'Export', 'buttons': [{'title': 'Abbrechen'}] } );
				
		}
	);
	
}

STAMMBAUM.events.onLinkImport = function() {

	// Debug data; To be removed...
	var xmlData = '<familie token="1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://dh.ramon-roessler.de/ProjektStammbaum/3_Entwicklung/Datenverwaltung/docs/stammbaum.xsd"><personen><person id="1"><name>Müller</name><vorname>Heinrich</vorname><geburtsort>Hamburg</geburtsort><geburtsdatum>1870-12-17</geburtsdatum><sterbeort>München</sterbeort><todesdatum>1950-07-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="2"><name>Müller</name><vorname>Bertada</vorname><geburtsort>Hamburg</geburtsort><geburtsdatum>1872-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1955-08-01</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="3"><name>Müller</name><vorname>Henry</vorname><geburtsort>Dortmund</geburtsort><geburtsdatum>1893-12-17</geburtsdatum><sterbeort>Paris</sterbeort><todesdatum>1990-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="4"><name>Mandorf</name><vorname>Agnes</vorname><geburtsort>Dortmund</geburtsort><geburtsdatum>1897-12-17</geburtsdatum><sterbeort>Dortmund</sterbeort><todesdatum>2000-01-01</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="5"><name>Müller</name><vorname>Gerda</vorname><geburtsort>Köln</geburtsort><geburtsdatum>1895-12-17</geburtsdatum><sterbeort>Paris</sterbeort><todesdatum>2000-01-01</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="6"><name>Müller</name><vorname>Kurt</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1910-12-17</geburtsdatum><sterbeort>Frankfurt</sterbeort><todesdatum>1990-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="7"><name>Müller</name><vorname>Heinrich</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1913-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1942-05-05</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges>Im Krieg gefallen</sonstiges></person><person id="8"><name>Müller</name><vorname>Anna</vorname><geburtsort>Gießen</geburtsort><geburtsdatum>1912-12-17</geburtsdatum><sterbeort>Frankfurt</sterbeort><todesdatum>1992-05-05</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="9"><name>Müller</name><vorname>Johann</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1942-12-17</geburtsdatum><sterbeort>Frankfurt</sterbeort><todesdatum>2008-05-05</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="10"><name>Müller</name><vorname>Johanna</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1945-12-17</geburtsdatum><sterbeort>Frankfurt</sterbeort><todesdatum>2008-05-05</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="11"><name>Müller</name><vorname>Charles</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1970-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="12"><name>Müller</name><vorname>Mathias</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1972-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="13"><name>Müller</name><vorname>Theodor</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1975-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="14"><name>Müller</name><vorname>Phillipp</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1978-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="15"><name>Müller</name><vorname>Charlotta</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1971-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="16"><name>Müller</name><vorname>Thorsten</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1993-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="17"><name>Müller</name><vorname>Tim</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1995-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="18"><name>Müller</name><vorname>Jan</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1998-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="19"><name>Böhmen</name><vorname>Gertrud</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1945-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="20"><name>Böhmen</name><vorname>Wilhelm</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1943-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="21"><name>Schwarz</name><vorname>Gisa</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1973-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="22"><name>Schwarz</name><vorname>Thorsten</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1971-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="24"><name>Habsburg</name><vorname>Lisa</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1975-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>w</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="25"><name>Habsburg</name><vorname>Reiner</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1971-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person><person id="23"><name>Habsburg</name><vorname>Peter</vorname><geburtsort>Frankfurt</geburtsort><geburtsdatum>1971-12-17</geburtsdatum><sterbeort></sterbeort><todesdatum>1000-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person></personen><beziehungen><partner id="1" partnerEins="1" partnerZwei="2"></partner><partner id="6" partnerEins="3" partnerZwei="5"></partner><partner id="11" partnerEins="6" partnerZwei="8"></partner><partner id="14" partnerEins="9" partnerZwei="10"></partner><partner id="23" partnerEins="11" partnerZwei="15"></partner><partner id="32" partnerEins="19" partnerZwei="20"></partner><partner id="35" partnerEins="21" partnerZwei="22"></partner><partner id="40" partnerEins="24" partnerZwei="25"></partner><kind id="2" elternteil="1" kind="3"></kind><kind id="3" elternteil="2" kind="3"></kind><kind id="4" elternteil="1" kind="4"></kind><kind id="5" elternteil="2" kind="4"></kind><kind id="7" elternteil="3" kind="6"></kind><kind id="9" elternteil="5" kind="7"></kind><kind id="12" elternteil="6" kind="9"></kind><kind id="13" elternteil="8" kind="9"></kind><kind id="15" elternteil="9" kind="11"></kind><kind id="16" elternteil="9" kind="12"></kind><kind id="17" elternteil="9" kind="13"></kind><kind id="18" elternteil="9" kind="14"></kind><kind id="19" elternteil="10" kind="11"></kind><kind id="20" elternteil="10" kind="12"></kind><kind id="21" elternteil="10" kind="13"></kind><kind id="22" elternteil="10" kind="14"></kind><kind id="24" elternteil="11" kind="18"></kind><kind id="25" elternteil="11" kind="17"></kind><kind id="26" elternteil="11" kind="16"></kind><kind id="27" elternteil="15" kind="16"></kind><kind id="28" elternteil="15" kind="17"></kind><kind id="29" elternteil="15" kind="18"></kind><kind id="30" elternteil="6" kind="19"></kind><kind id="31" elternteil="8" kind="19"></kind><kind id="33" elternteil="19" kind="21"></kind><kind id="34" elternteil="20" kind="21"></kind><kind id="36" elternteil="21" kind="23"></kind><kind id="37" elternteil="22" kind="23"></kind><kind id="38" elternteil="19" kind="24"></kind><kind id="39" elternteil="20" kind="24"></kind></beziehungen></familie>';
		
	STAMMBAUM.view.dialog('<textarea style="width: 100%; height: 200px;">'+ xmlData +'</textarea>',
						{'title': "Import",
						 'buttons': [
							{'title': 'Abbrechen'},
							{'title': 'Importieren',
							 'primary': true,
							 'callback': function(dialog) {
								$.post("../index.php", 
									{ page: "SET", xml: dialog.data.find('textarea').val() },
									function(result) {
										if (result == 1)
										{
											STAMMBAUM.events.loadWithRootPerson();
										}
										else
										{
											STAMMBAUM.helper.log('IMPORT: failed\n' + result);
											STAMMBAUM.view.dialog( '<p>'+result+'</p>', {'title': 'Fehler beim Importvorgang!'});
										}
									}
								);

							 }
							}]
						});
}

STAMMBAUM.events.onLinkShare = function() {
	var shareDialog = '<h4>Permalink</h4>';
	shareDialog += '<p>Um diese Seite Ihren Freunden und Verwandten zu zeigen, nutzen Sie bitte diese URL:</p><input type="text" name="permalink" class="permalink" value="' + STAMMBAUM.params.shorturl + '" />';
	shareDialog += '<h4>Teile diesen Stammbaum auf...</h4><ul class="share clearfix"></ul>';
	shareDialog = jQuery('<div>' + shareDialog + '</div>');
	
	var $ul = shareDialog.children("ul");
	
	for(var nname in STAMMBAUM.config.socialmedia) {
		var network = STAMMBAUM.config.socialmedia[nname];
		var $li = jQuery('<li><a href="' + network.share.url.replace('%URL%', escape(STAMMBAUM.params.shorturl)) + '" target="_blank" title="' + network.name + '" class="' + nname + '"><span>' + network.name + '</span></a></li>');
		if(network.share.popup) {
			$li.children("a").click( (function(network) { return function() { window.open( jQuery(this).attr('href'), '', 'width=' + network.share.width + ',height=' + network.share.height ); return false; } })(network) );
		}
		$ul.append($li);
	}
	
	STAMMBAUM.view.dialog(shareDialog, {'title': 'Verteilen' });
}

STAMMBAUM.events.onLinkQuickstart = function() {
	STAMMBAUM.view.dialog("<p>&hellip;</p>", {'title': 'Anleitung' });
}

STAMMBAUM.events.onDeletePerson = function(personId) {
	$.get("../index.php", { page: "DEL", pid: personId},
		function(result){
			if (result.match(/^1;/))
			{
				if (personId == STAMMBAUM.params.startId)
					STAMMBAUM.events.loadWithRootPerson(STAMMBAUM.params.startId++); // TODO: pretty ugly. Try to find a better solution...
				else
					STAMMBAUM.events.loadWithRootPerson();
			}
			else
			{
				STAMMBAUM.helper.log('Delete: failed\n' + result);
				result = result.replace(/^\d*;/,'');
				STAMMBAUM.view.dialog( '<p>'+result+'</p>', {'title': 'Fehler beim L&ouml;schen!'});
			}
		}
	);
	return false;
}
STAMMBAUM.events.onAddPerson = function(personId, where) {
		
	newId = parseInt(STAMMBAUM.params.lastPersonId) + 1;
	var relationship = '';
	if (where == 'child')
	{
		relationship = '<kind id="'+(STAMMBAUM.params.lastBeziehungsId++) +'" elternteil="'+personId+'" kind="'+newId+'" />';
		var personElem = $('.person[data-id="'+ personId +'"]');
		if (personElem != null && personElem.attr('data-partnerid') !== undefined)
		{
			var partnerId = personElem.attr('data-partnerid');
			relationship += '<kind id="'+(STAMMBAUM.params.lastBeziehungsId++) +'" elternteil="'+partnerId+'" kind="'+newId+'" />';
		}
	}
	if (where == 'parent')
	{
		try {
			parentElem = $('.person[data-id="2"]').parents('li.parent').children('div').children('div.person');
			parentsId = parentElem.attr('data-id');
			parentsPartnerId = parentElem.attr('data-partnerid');
			if (parentsPartnerId != null)
			{ //abort! There is already an partner for his parent
				STAMMBAUM.helper.log('WARNING: more than two parents are not supported!');
				STAMMBAUM.view.dialog( '<p>Diese Version unterstützt nur zwei Elternteile</p>', {'title': 'Fehler beim Hinzufügen!'});
				return false;
			}
			relationship += '<partner id="'+(STAMMBAUM.params.lastBeziehungsId++) +'" partnerEins="'+newId+'" partnerZwei="'+parentsId+'" />';
		}
		catch(e){}
		relationship += '<kind id="'+(STAMMBAUM.params.lastBeziehungsId++) +'" elternteil="'+newId+'" kind="'+personId+'" />';
	}
	if (where == 'partner')
	{
		if ($('.person[data-partnerid="'+personId+'"]').length>0)
		{
			STAMMBAUM.helper.log('WARNING: more than two partners are not supported!');
			STAMMBAUM.view.dialog( '<p>Diese Version unterstützt nur zwei Elternteile</p>', {'title': 'Fehler beim Hinzufügen!'});
			return false;
		}
		relationship = '<partner id="'+(STAMMBAUM.params.lastBeziehungsId++) +'" partnerEins="'+personId+'" partnerZwei="'+newId+'" />';
		var partnerElem = $('.person[data-id="'+ personId +'"]');
		if (partnerElem != null && partnerElem.attr('data-children') !== undefined)
		{
			var children = partnerElem.attr('data-children').trim().split(',');
			if (children!=null && children.length>0)
			{
				$.each( children, function(index,child) {
					child = child.trim();
					if (child == '')
						return;
					relationship += '<kind id="'+(STAMMBAUM.params.lastBeziehungsId++) +'" elternteil="'+newId+'" kind="'+child+'" />';
				});
			}
		}
	}
		
	if (relationship == null)
		return false;
		
	preparedXML = '<familie xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"	xsi:noNamespaceSchemaLocation="http://dh.ramon-roessler.de/ProjektStammbaum/3_Entwicklung/Datenverwaltung/docs/stammbaum.xsd"><personen><person id="'+newId+ '"><name>Mustermann</name><vorname>Max</vorname><geburtsort></geburtsort><geburtsdatum>1900-01-01</geburtsdatum><sterbeort> </sterbeort><todesdatum>1900-01-01</todesdatum><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person></personen><beziehungen>'+relationship+'</beziehungen></familie>';
	
	$.post("../index.php", 
		{ page: "SET", xml: preparedXML },
		function(result) {
			if (result.match('^1'))
			{
				STAMMBAUM.events.loadWithRootPerson();
			}
			else
			{
				STAMMBAUM.helper.log('ADD: failed\n' + result);
				STAMMBAUM.helper.log('xml: '+ preparedXML);
				STAMMBAUM.view.dialog( '<p>'+result+'</p>', {'title': 'Fehler beim Hinzufügen einer Person!'});
			}
		}
	);
	return false;
}
STAMMBAUM.events.loadWithRootPerson = function(personId) {

	// Todo / Remark:
	// 		Intended behavior is not implemented yet!
	//		This function has to do some rather complex calculations to find the
	//		correct startperson.
	//		startId != rootId != personId
	if (personId == STAMMBAUM.params.startId)
		return; // Nothing to do
	if(personId==0 || personId==null)
		personId = STAMMBAUM.params.startId;
	if (personId==null)
		personId=1;
		
	STAMMBAUM.helper.log( 'RELOAD: ../index.php?page=GET&startat=' + personId );
	location.reload();
	return false; // TODO: FIX THIS FUNCTION!
	document.location = '../index.php?page=GET&startat=' + personId;
	return false;
}

STAMMBAUM.events.onPersonHoverIn = function() {
	var $detailbox = jQuery("div.detailbox");
	var $elem = jQuery(this);
	$detailbox.html($elem.find(".details").html());
	$detailbox.show();
}

STAMMBAUM.events.onPersonHoverOut = function() {
	var $detailbox = jQuery("div.detailbox");
	$detailbox.hide();
	$detailbox.html("");
}

// hook the events
STAMMBAUM.events.hookEvents = function() {
	$('#lnknew').click( STAMMBAUM.events.onLinkNew );
	$('#lnkviewsvg').click( STAMMBAUM.events.onLinkSVG );
	$('#lnkviewhtml').click( STAMMBAUM.events.onLinkHTML );
	$('#lnkexport').click( STAMMBAUM.events.onLinkExport );
	$('#lnkimport').click( STAMMBAUM.events.onLinkImport );
	$('#lnkshare').click( STAMMBAUM.events.onLinkShare );
	$('#lnkquickstart').click( STAMMBAUM.events.onLinkQuickstart );
	
	$('.action.edit').click( function() { STAMMBAUM.events.onEditPerson($(this).attr('data-id')); return false; } );
	$('.action.del').click( function() { STAMMBAUM.events.onDeletePerson($(this).attr('data-id')); return false; } );
	$('.action.addParent').click( function() { STAMMBAUM.events.onAddPerson($(this).attr('data-id'),'parent'); return false; } );
	$('.action.addPartner').click( function() { STAMMBAUM.events.onAddPerson($(this).attr('data-id'),'partner'); return false; } );
	$('.action.addChild').click( function() { STAMMBAUM.events.onAddPerson($(this).attr('data-id'),'child'); return false; } );
	$('.person>div').click( function() { STAMMBAUM.events.loadWithRootPerson($(this).parent().attr('data-id')); return false; } );
}
