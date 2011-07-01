/**
 * init namespace "Stammbaum"
 */
 
var STAMMBAUM = {};
STAMMBAUM.view = {};

/**
 * 
 */
STAMMBAUM.view.width = 150;
STAMMBAUM.view.init = function(elem) {
	var main_ul = elem.children("ul");
	STAMMBAUM.view.set_width(main_ul);
		
	var scale = Math.round(elem.innerWidth()/(main_ul.width())*1000)/1000;
	if(scale < 1) { //no upscaling
		main_ul.css("-moz-transform", "scale(" + scale + ")").css("-webkit-transform", "scale(" + scale + ")").css("transform", "scale(" + scale + ")").css("msTransform", "scale(" + scale + ")");
		main_ul.css("margin-left", "-" + ((1-scale)/2*main_ul.width()) + "px"); //nach links verschieben
	}
}
STAMMBAUM.view.set_width = function(elem) {
	var width = 0;

	var lis = elem.children("li");
						
	
	for(var i=0; i<lis.length; i++) {
		var li = jQuery(lis[i]); var li_width = 0; var ul_width = 0;

		/* get width of nested lists (recursive) */
		var uls = li.children("ul");
		if(uls.length > 0) {
			ul_width = STAMMBAUM.view.set_width( jQuery(uls[0]) );
		}
		
		/* get width of li element */
		li_width += STAMMBAUM.view.width;
		if(  li.hasClass("paar") ) {
			li_width += STAMMBAUM.view.width;
		}
		
		width += Math.max(li_width, ul_width);
	}
	
	elem.css("width", width + "px");
	return width;
}