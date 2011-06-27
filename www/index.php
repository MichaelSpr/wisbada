<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:lang="de">
	<head>
		<meta charset="utf-8" />
		<title>Stammbaum</title>
		
		<!--Zur lokalen Entwicklung: <base href="../" />-->
		<link rel="icon" href="www/img/favicon.ico" type="image/x-icon" />
		
		<script type="text/javascript" src="www/libs/jquery-1.6.1.min.js"></script>
		<script type="text/javascript" src="www/libs/xslt.js-3.2/jquery.xslt.pack.js"></script>
		<script type="text/javascript" src="www/libs/xslt.js-3.2/xslt.js"></script>
		<script type="text/javascript" src="www/stammbaum.js"></script>
		<script type="text/javascript">/* Das Script */
			var rootPerson = null;
			var board = null;

			function loadHTMLView() {
				var board = $('#board');
				
				board.slideUp(function() {		
					board.children().remove();
					board.html( jQuery('#tmp').html() );
					board.slideDown();
				});
			}

			function loadSVGView() {
				$('#board').slideUp(function() {
					$('#board').children().remove();
					$.get('www/svg.xml', function(xml) {
						$.get('www/svg.xsl', function(xsl) {
							$('#board').xslt(xml , xsl ).slideDown(function() {
								$('#board > svg').attr('width', ($('#board').innerWidth() - 20));
								$('#board > svg').attr('height', ($('#board').innerHeight() - 20));
							});
						}, 'text');
					}, 'text');
				});
			}

			// Die Zeichen-Funktion beim Laden der Seite aufrufen
			$(document).ready(function() {
				$('#board').hide();
				$('#board').css('height', ($(document).height() -  $('#menu').height() - 80) + 'px');

				loadHTMLView();

			});
</script>
		<link type="text/css" rel="stylesheet" href="www/style.css" />
		<style type="text/css">		/* das Style */
</style>
	</head>
	<body>
		<div id="wrap">
		
		<div id="menu" class="mainmenu">
			<ul class="clearfix">
				<li class="logo">
					<a><img src="www/img/logo.png" alt="wisbada - Dein Stammbaum im Internet" width="167" height="42" /></a>
				</li>
				<li>
					<a>neuer Stammbaum</a>
				</li>
				<li>
					<a onclick="javascript:loadSVGView();">Darstellung SVG</a>
				</li>
				<li>
					<a onclick="javascript:loadHTMLView();">Darstellung HTML</a>
				</li>
				<li>
					<a>Export</a>
				</li>
				<li>
					<a>Import</a>
				</li>
				<li>
					<a>Permalink</a>
				</li>
				<li>
					<a>Verteilen</a>
				</li>
			</ul>
		</div>
		<div id="board">
		</div>
		<div id="copyleft">
			&#169; 2011 wisbada team
			<a href="http://www.dhbw-karlsruhe.de/">DHBW Karlsruhe</a>
		</div>
		
		</div>
		
		<div id="tmp" style="display: none;">
			<ul class="clearfix" style="width: 1040px; margin: 0 auto;">
				<li class="paar parent">
					<div class="wrap clearfix">
						<div class="person first root">
							<div class="top"><div class="bottom">
								<div>
									<h4>Homer Simpson</h4>
								</div>
							</div></div>
						</div>
						<div class="person last root">
							<div class="top"><div class="bottom">
								<div>
									<h4>Marge Simpson <em>(geb. Bouvier)</em></h4>
								</div>
							</div></div>
						</div>
					</div>
					<ul class="clearfix" style="width: 1040px;">
						<li class="person first">
							<div class="top"><div class="bottom">
								<div>
									<h4>Bart Simpson</h4>
								</div>
							</div></div>
						</li>
						<li class="paar parent">
							<div class="wrap clearfix">
								<div class="person">
									<div class="top"><div class="bottom">
										<div>
											<h4>Lisa Simpson</h4>
										</div>
									</div></div>
								</div>
								<div class="person noconnection">
									<div class="top"><div class="bottom">
										<div>
											<h4><em>Lisas zuknüftiger Mann</em></h4>
										</div>
									</div></div>
								</div>
							</div>
							<ul class="clearfix" style="width: 260px;">
								<li class="person first last">
									<div class="top"><div class="bottom">
										<div>
											<h4><em>Lisas Kind</em></h4>
										</div>
									</div></div>
								</li>
							</ul>
						</li>
						<li class="person last">
							<div class="top"><div class="bottom">
								<div>
									<h4>Margaret "Maggie" Simpson</h4>
								</div>
							</div></div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</body>
</html>
