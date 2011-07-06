<?php header('Content-type: application/xml');

// <!--
	echo '<?xml version="1.0" encoding="UTF-8"?'.html_entity_decode('&gt;');
//	-->
?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
	
	<xsl:variable name="phpTest"><![CDATA[<?='XX' ?>]]></xsl:variable>
	<xsl:variable name="base"><![CDATA[<?=dirname($_SERVER["SCRIPT_URI"]).'/'; ?>]]></xsl:variable>
	
	<xsl:template match="//familie">
		<html>
			<head>
				<title>Stammbaum</title>
				<xsl:choose>
					<xsl:when test="'XX'=$phpTest"><base href="{$base}" /></xsl:when>
					<xsl:otherwise><base href="www/" /></xsl:otherwise>
				</xsl:choose>
				<meta charset="utf-8" />
				<link rel="icon" href="img/favicon.ico" type="image/x-icon" />
				<link rel="stylesheet" type="text/css" href="style.css"/>
				<script type="text/javascript" src="libs/jquery-1.6.1.min.js" ></script>
				<script type="text/javascript" src="libs/jquery.simplemodal.js"></script>
				<script type="text/javascript" src="stammbaum.js" ></script>
				<script type="text/javascript" src="editor.js" ></script>
				<script type="text/javascript"><![CDATA[
					jQuery(document).ready(function() {
						STAMMBAUM.view.init(jQuery("#board"));
					});
				]]>
				</script>
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
								<a id="lnknew">neuer Stammbaum</a>
							</li>
							<li>
								<a id="lnkviewsvg">Darstellung SVG</a>
							</li>
							<li>
								<a id="lnkviewhtml">Darstellung HTML</a>
							</li>
							<li>
								<a id="lnkexport">Export</a>
							</li>
							<li>
								<a id="lnkimport">Import</a>
							</li>
							<li>
								<a id="lnkperma">Permalink</a>
							</li>
							<li>
								<a id="lnkshare">Verteilen</a>
							</li>
						</ul>
					</div>
					<div id="board">
						<xsl:attribute name="data-id">
							<xsl:value-of select="$startId" />
						</xsl:attribute>
						<xsl:call-template name="stammbaum" />
					</div>
				</div>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>