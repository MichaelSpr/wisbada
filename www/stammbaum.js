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

	STAMMBAUM.params.get = STAMMBAUM.helper.parseURL(window.location.search);
	STAMMBAUM.params.startId = parseInt(elem.attr('data-id'));
	STAMMBAUM.params.lastPersonId = parseInt(elem.attr('data-lastpersonid'));
	STAMMBAUM.params.lastBeziehungsId = parseInt((elem.attr('data-lastbeziehungsid') == '')?'0':elem.attr('data-lastbeziehungsid'))+1;
	
	if(STAMMBAUM.params.get.token) {
		var shorturl = document.location.href.replace(document.location.search, "");
		shorturl += "?token=" + STAMMBAUM.params.get.token;
		STAMMBAUM.params.shorturl = shorturl;
	} else {
		STAMMBAUM.params.shorturl = document.location.href;
	}
	
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

STAMMBAUM.helper.toXML = function (xml) {
	var str = "";
    if (xml.xml) {
        str = xml.xml;
    } else if (window.XMLSerializer) {
		try {
			str = (new window.XMLSerializer()).serializeToString(xml);
		} catch(e) {}
    }
    return str;
}

STAMMBAUM.helper.parseURL = function(queryStr) {
	var a = queryStr.substr(1).split('&');
	if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
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
					var btn = jQuery.extend({ 'title': '', 'primary': false, 'close': true, 'callback': null, 'align': 'right' }, opts.buttons[i]);
					var tmp = jQuery("<a class=\"btn\">" + btn.title + "</a>");
					
					if(btn.primary) tmp.addClass("primary");
					if(btn.align != 'right') tmp.css('float',btn.align);
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

STAMMBAUM.view.ajaxDialog = function(url, options) {
	var cnt = jQuery("<div></div>").load(url, function() { STAMMBAUM.view.dialog(cnt, options); });
	return false;
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
			var xml = STAMMBAUM.helper.toXML(result.documentElement);
			STAMMBAUM.view.dialog('<textarea style="width: 100%; height: 200px;">'+ xml +'</textarea>', { 'title': 'Export', 'buttons': [{'title': 'Abbrechen'}] } );
				
		}
	);
	
}

STAMMBAUM.events.onLinkImport = function() {
	
	var tHeight;
	STAMMBAUM.view.dialog('<textarea style="width: 100%; height: 200px;"></textarea><p class="errormsg" style="display: none;"></p>',
						{'title': "Import",
						 'buttons': [
							{'title': 'Abbrechen'},
							{'title': 'Beispiel',
								'align' : 'left',
								'callback': function(dlg) {
									$.ajax( { url: "../backend/docs/example_big.xml",
										dataType : 'text',
										success: function(result) {
											dlg.data.find('textarea').val(result);
										}
									});
								}
							},
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
											var s = $('#simplemodal-data');
											t = dialog.data.find('textarea');
											var p = dialog.data.find('p');
											var b = dialog.data.find('.buttons');
											var h = dialog.data.find('h3')
											if (tHeight==null) tHeight = t.height() + p.height();
											p.html(result).show();
											t.height( (tHeight - p.outerHeight()) );
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
	return STAMMBAUM.view.ajaxDialog("static/quickstart.html", {'title': 'Anleitung' });
}

STAMMBAUM.events.onLinkImpressum = function() {
	return STAMMBAUM.view.ajaxDialog("static/impressum.html", {'title': 'Impressum' });
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
		
	preparedXML = '<familie xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"	xsi:noNamespaceSchemaLocation="http://dh.ramon-roessler.de/ProjektStammbaum/3_Entwicklung/Datenverwaltung/docs/stammbaum.xsd"><personen><person id="'+newId+ '"><name>Mustermann</name><vorname>Max</vorname><geburtsort></geburtsort><geburtsdatum>1900-01-01</geburtsdatum><sterbeort> </sterbeort><todesdatum xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/><geschlecht>m</geschlecht><bild></bild><sonstiges></sonstiges></person></personen><beziehungen>'+relationship+'</beziehungen></familie>';
	
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
	$('#lnkquickstart').click( function() { return STAMMBAUM.events.onLinkQuickstart(); } );
	$('#lnkimpressum').click( function() { return STAMMBAUM.events.onLinkImpressum(); } );
	
	$('.action.edit').click( function() { STAMMBAUM.events.onEditPerson($(this).attr('data-id')); return false; } );
	$('.action.del').click( function() { STAMMBAUM.events.onDeletePerson($(this).attr('data-id')); return false; } );
	$('.action.addParent').click( function() { STAMMBAUM.events.onAddPerson($(this).attr('data-id'),'parent'); return false; } );
	$('.action.addPartner').click( function() { STAMMBAUM.events.onAddPerson($(this).attr('data-id'),'partner'); return false; } );
	$('.action.addChild').click( function() { STAMMBAUM.events.onAddPerson($(this).attr('data-id'),'child'); return false; } );
	$('.person>div').click( function() { STAMMBAUM.events.loadWithRootPerson($(this).parent().attr('data-id')); return false; } );
}
