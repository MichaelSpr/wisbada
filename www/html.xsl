<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
	<xsl:include href="commonHead.xsl"/> 
	<xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
	<xsl:variable name="startId" select="startid"/>
	<xsl:template match="person">
		<h4>
			<strong style="color: red;"><xsl:attribute name="title">ID: <xsl:value-of select="./@id"/></xsl:attribute><xsl:value-of select="./@id"/>: </strong>
			<xsl:value-of select="./vorname"/>
			<xsl:text><![CDATA[]]>
			</xsl:text>
			<xsl:value-of select="./name"/>
		</h4>
	</xsl:template>
	
	<xsl:template name="partner" match="partner">
		
		<xsl:param name="pkid">-1</xsl:param><!--Welcher der Partner ist blutsverwandt???-->
		<xsl:param name="position">-1</xsl:param>
		<xsl:param name="last">0</xsl:param>
		
		<xsl:variable name="p1id" select="@partnerEins"/>
		<xsl:variable name="p2id" select="@partnerZwei"/>
		<xsl:variable name="has_children" select="//kind[@elternteil=$p1id or @elternteil=$p2id][1]/@kind"/>
		
		<li>
			<xsl:attribute name="class">
				paar
				<xsl:if test="$position=1"> first</xsl:if>
				<xsl:if test="$position=$last"> last</xsl:if>
				<xsl:if test="$has_children"> parent</xsl:if>
			</xsl:attribute>
					
			<div class="wrap clearfix">
				<div>
					<xsl:attribute name="class">
						person first
						<xsl:if test="$pkid!=$p1id"> noconnection</xsl:if>
					</xsl:attribute>
					<div>
						<xsl:apply-templates select="//person[@id=$p1id]"/>
					</div>
				</div>
				<div>
					<xsl:attribute name="class">
						person last
						<xsl:if test="$pkid!=$p2id"> noconnection</xsl:if>
					</xsl:attribute>
					<div>
						<xsl:apply-templates select="//person[@id=$p2id]"/>
					</div>
				</div>
			</div>
		
			<xsl:if test="$has_children">
				<xsl:call-template name="children">
					<xsl:with-param name="p1id"><xsl:value-of select="$p1id" /></xsl:with-param>
					<xsl:with-param name="p2id"><xsl:value-of select="$p2id" /></xsl:with-param>
				</xsl:call-template>
			</xsl:if>
			
		</li>
		
	</xsl:template>
	
	<xsl:template name="children">
		<xsl:param name="p1id" />
		<xsl:param name="p2id" />
		
		<ul class="clearfix">
			<xsl:for-each select="//kind[@elternteil=$p1id]">
				<xsl:variable name="pkid" select="@kind"/>
				<xsl:variable name="has_partner" select="//partner[@partnerEins=$pkid or @partnerZwei=$pkid]" />
				<xsl:variable name="position" select="position()" />
				<xsl:variable name="last" select="last()" />
				
				<xsl:choose>
					<xsl:when test="$has_partner">
						<xsl:apply-templates select="//partner[@partnerEins=$pkid or @partnerZwei=$pkid]">
							<xsl:with-param name="pkid"><xsl:value-of select="$pkid" /></xsl:with-param>
							<xsl:with-param name="position"><xsl:value-of select="$position" /></xsl:with-param>
							<xsl:with-param name="last"><xsl:value-of select="$last" /></xsl:with-param>
						</xsl:apply-templates>
					</xsl:when>
					<xsl:otherwise>
						<li>
							<xsl:attribute name="class">
								person
								<xsl:if test="$position=1"> first</xsl:if>
								<xsl:if test="$position=$last"> last</xsl:if>
							</xsl:attribute>
							<div>
								<xsl:apply-templates select="//person[@id=$pkid]"/>
							</div>
						</li>
					</xsl:otherwise>
				</xsl:choose>
		
			</xsl:for-each>
		</ul>

	</xsl:template>
	
	<xsl:template match="kind">
		<li class="person first">
			<div>
				<xsl:variable name="p1id" select="@kind"/>
				<xsl:apply-templates select="//person[@id=$p1id]"/>
			</div>
		</li>
	</xsl:template>
</xsl:stylesheet>
