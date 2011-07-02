<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">

	<xsl:template match="//familie">
		<html>
			<head>
				<title>Stammbaum</title>
				<base href="www/" />
				<meta charset="utf-8" />
				<link rel="icon" href="img/favicon.ico" type="image/x-icon" />
				<link rel="stylesheet" type="text/css" href="style.css"/>
				<script type="text/javascript" src="libs/jquery-1.6.1.min.js" ></script>
				<script type='text/javascript' src='libs/jquery.simplemodal.js'></script>
				<script type="text/javascript" src="stammbaum.js" ></script>
				<script type="text/javascript"><![CDATA[
					jQuery(document).ready(function() {
						STAMMBAUM.view.init(jQuery("#board"));
					});
				]]>
				</script>
				<style type="text/css"><![CDATA[
					.clearfix { display: block; }
				]]></style>
			</head>
			<body>
				<div id="wrap">
					<div id="menu" class="mainmenu">
						<ul class="clearfix">
							<li class="logo">
								<a>
									<img src="img/logo.png" alt="wisbada - Dein Stammbaum im Internet" width="167" height="42"/>
								</a>
							</li>
							<li>
								<a>neuer Stammbaum</a>
							</li>
							<li>
								<a id="lnkviewsvg">Darstellung SVG</a>
							</li>
							<li>
								<a id="lnkviewhtml">Darstellung HTML</a>
							</li>
							<li>
								<a id='lnkexport'>Export</a>
							</li>
							<li>
								<a id='lnkimport'>Import</a>
							</li>
							<li>
								<a id='lnkperma'>Permalink</a>
							</li>
							<li>
								<a id='lnkshare'>Verteilen</a>
							</li>
						</ul>
					</div>
					<div id="board">
						<xsl:variable name="startId" select="startid"/>
						<xsl:call-template name="stammbaum" />
					</div>
				</div>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>