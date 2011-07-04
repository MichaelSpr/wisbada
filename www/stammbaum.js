/**
* init namespace "Stammbaum"
*/
 
var STAMMBAUM = {};
STAMMBAUM.view = {};
STAMMBAUM.helper = {};

/**
*
*/
STAMMBAUM.view.width = 150;
STAMMBAUM.view.init = function(elem) {
	var main_ul = elem.children("ul");
	STAMMBAUM.view.set_width(main_ul);
	STAMMBAUM.view.fillLines(main_ul);

	var scale = STAMMBAUM.helper.round(elem.innerWidth()/(main_ul.width()), 3);

	if(scale < 1) { //no upscaling
		main_ul.css("-moz-transform", "scale(" + scale + ")").css("-webkit-transform", "scale(" + scale + ")").css("transform", "scale(" + scale + ")").css("msTransform", "scale(" + scale + ")");
		main_ul.css("margin-left", "-" + ((1-scale)/2*main_ul.width()) + "px"); //nach links verschieben
	}
	
	STAMMBAUM.token = /token=(\d{1,10})/.exec(document.location)[1];
	
	hookEvents();
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

// Todo: Give the dialog the correct size
STAMMBAUM.dialog = function(inData, callback) {
	var dlg = $(inData).modal({
		closeHTML: "<a href='#' title='Close'></a>",
		overlayId: 'dialog-overlay',
		containerId: 'dialog-container',
		minWidth: '50%',
		onOpen: function (dialog) {
			dialog.overlay.fadeIn('slow', function () {
				dialog.data.show();
				dialog.container.fadeIn('slow');
				dialog.container.width( dialog.data.width() );
				dialog.container.height( dialog.data.height() );
			});
		},
		onShow: function(dialog) {
			$('#dialog-container input').click( function() {
				$.modal.close(); // must call this!
				if (callback != null) callback( dialog.data );
				return false;
			});
		},
		onClose: function (dialog) {
			dialog.container.fadeOut('slow', function () {
				dialog.overlay.fadeOut('slow', function () {
					$.modal.close(); // must call this!
					
				});
			});
		}
	});
	
}

function onLinkNew() {
	// TODO: Fix this. We need to determin the location somehow different
	document.location = (document.location.pathname)
}

function onLinkSVG() {
	// TODO: Fix this. We need to determin the location somehow different
	document.location = document.location.href.replace( /outputStyle=(svg|html)/g , 'outputStyle=svg').replace(/&*$/g,'');
}

function onLinkHTML() {
	// TODO: Fix this. We need to determin the location somehow different
	document.location = document.location.href.replace( /outputStyle=(svg|html)/g , 'outputStyle=html').replace(/&*$/g,'');
}

function onLinkExport() {
	$.post("../index.php", 
		{ page: "GET", token: STAMMBAUM.token, outputStyle: 'xml' },
		function(result) {
			var serializer = new XMLSerializer();
			var xml = serializer.serializeToString(result.documentElement);
			STAMMBAUM.dialog('<div><h1>EXPORT</h1><textarea cols="60" rows="8">'+ xml +'</textarea>' +
			'<br /></div>' );
				
		}
	);
	
}

function onLinkImport() {

	// Debug data; To be removed...
	var xmlData = '<?xml version="1.0" encoding="UTF-8" ?>' +
		'<familie xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" token="1" xsi:noNamespaceSchemaLocation="stammbaum.xsd">' +
		'    <personen>' +
		'        <person id="1">' +
		'            <name>Simpson</name>' +
		'            <vorname>Homer Jay</vorname>' +
		'            <geburtsort>Springfield</geburtsort>' +
		'            <geburtsdatum>1989-12-17</geburtsdatum>' +
		'            <sterbeort></sterbeort>' +
		'            <todesdatum>1900-01-01</todesdatum>' +
		'            <geschlecht>m</geschlecht>' +
		'            <bild/>' +
		'            <sonstiges/>' +
		'        </person>' +
		'        <person id="2">' +
		'            <name>Simpson</name>' +
		'            <vorname>Marjorie "Marge"</vorname>' +
		'            <geburtsort>Springfield</geburtsort>' +
		'            <geburtsdatum>1989-12-17</geburtsdatum>' +
		'            <sterbeort></sterbeort>' +
		'            <todesdatum>1900-01-01</todesdatum>' +
		'            <geschlecht>w</geschlecht>' +
		'            <bild/>' +
		'            <sonstiges/>' +
		'        </person>' +
		'        <person id="3">' +
		'            <name>Simpson</name>' +
		'            <vorname>Bartholomew JoJo "Bart"</vorname>' +
		'            <geburtsort>Springfield</geburtsort>' +
		'            <geburtsdatum>1989-12-17</geburtsdatum>' +
		'            <sterbeort></sterbeort>' +
		'            <todesdatum>1900-01-01</todesdatum>' +
		'            <geschlecht>m</geschlecht>' +
		'            <bild/>' +
		'            <sonstiges/>' +
		'        </person>' +
		'    </personen>' +
		'    <beziehungen>' +
		'        <partner id="1" partnerEins="1" partnerZwei="2"/>' +
		'        <kind id="2" elternteil="1" kind="3"/>' +
		'        <kind id="3" elternteil="2" kind="3"/>' +
		'    </beziehungen>' + 
		'</familie>';
		
	STAMMBAUM.dialog('<div><h1>Import</h1><textarea cols="60" rows="8">'+ xmlData +'</textarea>' +
		'<br /><input type="submit" value="import"/> </div>',
		function(data) {
			$.post("../index.php", 
				{ page: "SET", token: STAMMBAUM.token, xml: data.children('textarea').val() },
				function(result) {
					if (result == 1)
					{
						console.log('IMPORT: success');
						location.reload();
					}
					else
					{
						console.log('IMPORT: failed\n' + result);
						STAMMBAUM.dialog( '<div><h1>Import failed!</h1><p>'+result+'</p></div>');
					}
				}
			);
		});
}

function onLinkPerma() {
	console.log('onLinkPerma');
}

function onLinkShare() {
	$.modal("<h1>Share this!</h1><p>bla fasel</p>");
}

function onDeletePerson(personId) {
	console.log( 'Delete Person ID' + personId);
}
function onAddPerson(personId, where) {
	console.log( 'Add Person ID' + personId + ' ' + where );
}


// hook the events
function hookEvents() {
	$('#lnknew').click( onLinkNew );
	$('#lnkviewsvg').click( onLinkSVG );
	$('#lnkviewhtml').click( onLinkHTML );
	$('#lnkexport').click( onLinkExport );
	$('#lnkimport').click( onLinkImport );
	$('#lnkperma').click( onLinkPerma );
	$('#lnkshare').click( onLinkShare );
}
