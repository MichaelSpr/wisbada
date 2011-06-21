<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/2000/svg">

<xsl:template match="/person">
	<svg width="200" height="100">
		<rect x="0" y="0" width="200" height="200" rx="50" ry="50" fill="#FF0000" />
		<text x="50" y="40"><xsl:value-of select="name/lastname" />, <xsl:value-of select="name/firstname" /></text>
	</svg>
</xsl:template>
</xsl:stylesheet>