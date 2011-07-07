jQuery(document).bind( "init_done", function() {
	var $board = jQuery("#board");
	var $main_ul = $board.children("ul");
	
	var old_width = $board.width(); var new_width = $main_ul.width();
	
	if( new_width > old_width ) {
		jQuery("#wrap").width( new_width );
	}
	
	$main_ul.css("margin-left", 0);
} );