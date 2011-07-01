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
		if(  $li.hasClass("paar") ) {
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