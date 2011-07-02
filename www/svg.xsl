<?xml version="1.0" encoding="UTF-8" ?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.w3.org/2000/svg">
	<xsl:include href="commonHead.xsl"/> 
	
	<xsl:variable name="startId" select="startid"/>
	
<xsl:template match="/familie">
	<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" >
		
		<style type="text/css"> 
		g 
			width: 400;
			height: 400;
			overflow: auto;
		}
		
		<!--
		  div.header{

		background:black;
		background-color: #ededed; 
		margin-top: 0px;
		position: fixed;
		top: 0px;
		//width:100%;
		width:1100px;
		height: 500px;
		   }

		 -->
		 </style>
		
		
		<!-- alternativ fruehestes Geburtsdatum??? -->
		<xsl:variable name="startID" select="personen/startid" />
		<!-- ID des Partners-->
		
		
		<g id="1">
		
			<xsl:call-template name="rek">
				<xsl:with-param name="personID" select="$startID"/>
				<xsl:with-param name="xCor" select="700"/>
				<xsl:with-param name="yCor" select="100"/>
				<xsl:with-param name="level" select="1"/>
				<xsl:with-param name="nextGen" select="2"/>
			</xsl:call-template>
		
		</g>
	</svg>
</xsl:template>

<xsl:template name="rek">
	<xsl:param name="personID" />
	<xsl:param name="xCor" />
	<xsl:param name="yCor" />
	<xsl:param name="level" />
	<xsl:param name="nextGen" />
	
	<xsl:variable name="partnerID" >
			<xsl:for-each select="/familie/beziehungen/partner">
				<xsl:choose>
					<xsl:when test="@partnerEins = $personID">
						<text x="200" y="200">
							<xsl:value-of select="@partnerZwei" />
						</text>
					</xsl:when>
					<xsl:when test="@partnerZwei = $personID">
						<text x="200" y="200">
							<xsl:value-of select="@partnerEins" />
						</text>
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</xsl:variable>
		
		<!-- Beide Darstellen -->
		<xsl:for-each select="/familie/personen/person/@id">
			<xsl:choose>
				<xsl:when test="../@id=$personID">
					<!--<circle cx="{$xCor}" cy="{$yCor}" r="40" stroke="black" stroke-width="2" fill="red"/>-->
					<xsl:if test="$level &gt;= 2"> 
						<line x1= "{$xCor}" y1="{$yCor - 15}" x2= "{$xCor}" y2="{$yCor - 50}" style="stroke:rgb(00,100,00);stroke-width:2"/>
					</xsl:if>
					<text x="{$xCor - 30}" y="{$yCor}"><xsl:value-of select="../name" />,</text>
					<text x="{$xCor - 30}" y="{$yCor+13}"><xsl:value-of select="../vorname"/></text>
					<text x="{$xCor - 30}" y="{$yCor+26}"><xsl:value-of select="../@id"/></text>
				</xsl:when>
				<xsl:when test="../@id=$partnerID">
					<!--<circle cx="{$xCor+100}" cy="{$yCor}" r="40" stroke="black" stroke-width="2" fill="red"/>-->
					<line x1="{$xCor+40}" y1="{$yCor}" x2="{$xCor+60}" y2="{$yCor}" style="stroke:rgb(0,0,99);stroke-width:2"/>
					<text x="{$xCor +70}" y="{$yCor}"><xsl:value-of select="../name" />,</text>
					<text x="{$xCor +70}" y="{$yCor+13}"><xsl:value-of select="../vorname"/></text>
					<text x="{$xCor +70}" y="{$yCor+26}"><xsl:value-of select="../@id"/></text>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
		
		
		<!--Abstand der Kinder -->
		<xsl:variable name="xPadKid2">
			<xsl:for-each select="/familie/beziehungen/kind[@elternteil=$personID]">
				<xsl:variable name="kid" select="@kind" />
				<xsl:variable name="subCount1" select="count(/familie/beziehungen/kind[@elternteil=$kid])"/>
				<xsl:value-of select="$subCount1" />
			</xsl:for-each>)
		</xsl:variable>
		<!--<xsl:variable name="xPadKid3" select="sum('$xPadKid2')" />
		<text x="20" y="20"><xsl:value-of select="$xPadKid3"/></text>
		Abstand der Kinder -->
		
		<xsl:variable name="xPadKid">
			<xsl:choose>
				<xsl:when test="$level = 1">
					200
				</xsl:when>
				<xsl:when test="$level = 3">
					200
				</xsl:when>
				<xsl:otherwise>
					200
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		
		
		<!--Anzahl der Kinder-->
		<xsl:variable name="kidCount" select="count(/familie/beziehungen/kind[@elternteil=$personID])"/>
		<xsl:if test="$kidCount &gt;= 1" >
			<line x1= "{$xCor + 50}" y1="{$yCor}" x2= "{$xCor + 50}" y2="{$yCor +50}" style="stroke:rgb(00,100,00);stroke-width:2"/>
			<line x1="{$xCor + 50 - (($kidCount - 1)* $xPadKid*0.5)}" y1="{$yCor+50}" x2="{$xCor +50 + (($kidCount - 1)* $xPadKid*0.5)}" y2="{$yCor+50}" style="stroke:rgb(00,100,00);stroke-width:2"/>
		</xsl:if>
		<!--alle Kinder darstellen mit rekursion;-) -->
		<xsl:for-each select="/familie/beziehungen/kind[@elternteil=$personID]">
			<xsl:call-template name="rek">
				<xsl:with-param name="personID" select="@kind"/>
				<xsl:with-param name="xCor" select="$xCor +50 - (($kidCount - 1)* ($xPadKid *0.5))+((position() - 1) * $xPadKid)"/>
				<xsl:with-param name="yCor" select="$yCor +100"/>
				<xsl:with-param name="level" select="$level + 1"/>
				<xsl:with-param name="nextGen" select="2"/>
				<!-- {$xCor-(($kidCount*100)+200)+(position()*200)}-->
			</xsl:call-template>
		</xsl:for-each>
		
		<!--
		<text x="150" y="50">
			<xsl:value-of select="$personID" /> " " 
			<xsl:value-of select="$partnerID" /> " kidCount
			<xsl:value-of select="$kidCount" />
		</text>
		-->
</xsl:template>


</xsl:stylesheet>