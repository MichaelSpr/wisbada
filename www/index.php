<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Stammbaum</title>
		<script type="text/javascript" src="libs/jquery-1.6.1.min.js"></script>
		<script type="text/javascript" src="libs/ext-4.0.1/bootstrap.js"></script>
		<script type="text/javascript" src="www/stammbaum.js"></script>
		<script type="text/javascript">/* Das Script */
			var rootPerson = null;
			var board = null;
			
			// Die Zeichen-Funktion beim Laden der Seite aufrufen
			Ext.onReady(function() {
				board = Ext.get('board');
				board.setHeight( Ext.core.Element.getDocumentHeight() -  Ext.get('menu').getHeight() - 80);
				
				// init the persons....
				setRootPerson(new Person("Peter", "Steinberg"));
				//rootPerson.setFather(new Person("Franz", "Müller"));
				//rootPerson.setMother(new Person("Petra", "Maier"));
			});
		</script>
		<link type="text/css" rel="stylesheet" href="www/style.css" />
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
					<a href="#">Darstellung SVG</a>
				</li>
				<li>
					<a href="#">Darstellung HTML</a>
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
