<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:lang="de">
	<head>
		<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8">
		<title>Stammbaum</title>
		<script type="text/javascript" src="libs/jquery-1.6.1.min.js"></script>
		<script type="text/javascript" src="libs/xslt.js-3.2/jquery.xslt.pack.js"></script>
		<!-- <script type="text/javascript" src="stammbaum.js"></script>-->
		<script type="text/javascript">/* Das Script */
			var rootPerson = null;
			var board = null;
			
			function loadHTMLView() {
				$('#board').slideUp( function() {
					$('#board').text('html');
					$('#board').slideDown();
				});
				
			}
			function loadSVGView() {
				$('#board').slideUp(function() {
					$.get('svg.xml', function(xml) {
						$.get('svg.xsl', function(xsl) {
					 		$('#board').xslt(xml , xsl ).slideDown( function() {							
								$('#board > svg').attr('width', ($('#board').innerWidth() - 20));
								$('#board > svg').attr('height', ($('#board').innerHeight() - 20));
					 		});
					 	}, 'text');
					}, 'text');
				});
			}
			
			// Die Zeichen-Funktion beim Laden der Seite aufrufen
			$(document).ready(function(){
				$('#board').hide();
				$('#board').css('height', ($(document).height() - $('#menu').height() -80) + 'px' );
				loadHTMLView();
				
			});
		</script>
		<link type="text/css" rel="stylesheet" href="style.css" />
		<style type="text/css">		
		/* das Style */
		</style>
	</head>
	<body>
		<div id="menu" class="mainmenu">
			<ul>
				<li>
					<a href="#">neuer Stammbaum</a>
				</li>
				<li>
					<a href="#" onclick="javascript:loadSVGView();">Darstellung SVG</a>
				</li>
				<li>
					<a href="#" onclick="javascript:loadHTMLView();">Darstellung HTML</a>
				</li>
				<li>
					<a href="#">Export</a>
				</li>
				<li>
					<a href="#">Import</a>
				</li>
				<li>
					<a href="#">Permalink</a>
				</li>
				<li>
					<a href="#">Verteilen</a>
				</li>
			</ul>
		</div>
		<div id="board">
			&nbsp;
		</div>
		<div id="copyleft">
			&copy;2011 wisbada team
			<a href="http://www.dh-karlsruhe.de/">DH-Karlsruhe</a>
		</div>
	</body>
</html>
