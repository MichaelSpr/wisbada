<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
	<xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
	<xsl:variable name="startId" select="//startat/@id"/>
	<xsl:include href="commonHead.xsl.php"/> 
	<xsl:template name="stammbaum">
		<ul>
			<xsl:choose>
				<xsl:when test="//partner[@partnerEins=$startId or @partnerZwei=$startId]">
					<xsl:apply-templates select="//partner[@partnerEins=$startId or @partnerZwei=$startId]" />
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="singleperson" >
						<xsl:with-param name="pid" select="$startId"/>
						<xsl:with-param name="position">1</xsl:with-param>
						<xsl:with-param name="last">1</xsl:with-param>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</ul>
	</xsl:template>

	<xsl:template match="person">
		<xsl:call-template name="editor" >
			<xsl:with-param name="personID" select="./@id"/>
		</xsl:call-template>
		<xsl:if test="./bild!=''">
			<img>
				<xsl:attribute name="src"><xsl:value-of select="./bild" /></xsl:attribute>
				<xsl:attribute name="alt"><xsl:value-of select="./vorname" /><xsl:text><![CDATA[ ]]></xsl:text><xsl:value-of select="./name"/></xsl:attribute>
			</img>
		</xsl:if>
		<h4>
			<xsl:value-of select="./vorname"/>
			<xsl:text><![CDATA[]]>
			</xsl:text>
			<xsl:value-of select="./name"/>
		</h4>
	</xsl:template>
	
	<xsl:template name="editor">
		<xsl:param name="personID" />
		<a data-id="{$personID}" class="action edit" title="Bearbeiten"><span>Bearbeiten</span></a>
		<a data-id="{$personID}" class="action del" title="Löschen"><span>Löschen</span></a>
		<a data-id="{$personID}" class="action addParent" title="Elternteil hinzufügen"><span>Elternteil hinzufügen</span></a>
		<a data-id="{$personID}" class="action addPartner" title="Partner hinzufügen"><span>Partner hinzufügen</span></a>
		<a data-id="{$personID}" class="action addChild" title="Kind hinzufügen"><span>Kind hinzufügen</span></a>
	</xsl:template>
	
	<xsl:template name="singleperson">
		<xsl:param name="pid" />
		<xsl:param name="position">0</xsl:param>
		<xsl:param name="last">0</xsl:param>
		
		<xsl:variable name="has_children" select="//kind[@elternteil=$pid][1]/@kind"/>
		
		<li>
			<xsl:attribute name="class">
				person
				<xsl:if test="$has_children"> parent</xsl:if>				
			</xsl:attribute>
			
			<div class="wrap clearfix">
			
				<div>
					<xsl:attribute name="class">
						person
						<xsl:if test="$position=1"> first</xsl:if>
						<xsl:if test="$position=$last"> last</xsl:if>
						<xsl:choose><xsl:when test="//person[@id=$pid]/geschlecht='m'"> male</xsl:when><xsl:otherwise> female</xsl:otherwise></xsl:choose>	
					</xsl:attribute>
					<xsl:attribute name="data-id">
						<xsl:value-of select="$pid" />
					</xsl:attribute>
					
					<div>
						<xsl:apply-templates select="//person[@id=$pid]"/>
					</div>
			
				</div>
				
			</div>
			
			<xsl:if test="$has_children">
				<xsl:call-template name="children">
					<xsl:with-param name="p1id"><xsl:value-of select="$pid" /></xsl:with-param>
				</xsl:call-template>
			</xsl:if>
		</li>
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
						<xsl:choose><xsl:when test="//person[@id=$p1id]/geschlecht='m'"> male</xsl:when><xsl:otherwise> female</xsl:otherwise></xsl:choose>
					</xsl:attribute>
					<xsl:attribute name="data-id">
						<xsl:value-of select="$p1id" />
					</xsl:attribute>
					<div>
						<xsl:apply-templates select="//person[@id=$p1id]"/>
					</div>
				</div>
				<div>
					<xsl:attribute name="class">
						person last
						<xsl:if test="$pkid!=$p2id"> noconnection</xsl:if>
						<xsl:choose><xsl:when test="//person[@id=$p2id]/geschlecht='m'"> male</xsl:when><xsl:otherwise> female</xsl:otherwise></xsl:choose>
					</xsl:attribute>
					<xsl:attribute name="data-id">
						<xsl:value-of select="$p2id" />
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
		<xsl:param name="p2id" >0</xsl:param>
		
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
						<xsl:call-template name="singleperson" >
							<xsl:with-param name="pid" select="$pkid"/>
							<xsl:with-param name="position" select="$position" />
							<xsl:with-param name="last" select="$last" />
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
		
			</xsl:for-each>
		</ul>

	</xsl:template>
	
</xsl:stylesheet>
