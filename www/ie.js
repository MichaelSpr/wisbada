jQuery(document).bind( "init_done", function() {
	var $board = jQuery("#board");
	var $main_ul = $board.children("ul");
	$board.width( $main_ul.width() );
	$main_ul.css("margin-left", 0);
} );