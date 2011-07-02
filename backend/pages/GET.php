<?php

//Token vorhanden?
if (true == isset($_REQUEST['token'])) {
    
    //Ja, TokenID zwischenspeichern
    $tokenid = $_REQUEST['token'];
	$outputStyle = isset($_REQUEST['outputStyle'])?$_REQUEST['outputStyle']:'html';
	if ($outputStyle != 'svg' && $outputStyle!= 'html' && $outputStyle='xml') {
		$outputStyle = 'html'; // set a sane default
    }
     
    $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Aufruf mit der TokenID: " . $tokenid);
    $this->Data->connect();

    //Ist ein Stammbaum mit diesem Token vorhanden?
    $a = $this->Data->execQuery("SELECT count(*) AS Anzahl FROM stammbaum WHERE id = '" . $tokenid . "'");
    $row = mysql_fetch_object($a);

    if (1 == $row->Anzahl || 0 == $row->Anzahl) {

        //XML Header erstellen
        $xmlString = "";
        $xmlString.= "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>";
		if ($outputStyle != 'xml')
			$xmlString.= '<?xml-stylesheet href="www/' .  $outputStyle . '.xsl" type="text/xsl"?>';
        $xmlString.="<familie token=\"" . $tokenid . "\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"http://dh.ramon-roessler.de/ProjektStammbaum/3_Entwicklung/Datenverwaltung/docs/stammbaum.xsd\">";
        $xmlString.="<personen>";

        //Für jede Person XML Tag erstellen
        $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Durchlaufe die Personen. Anzahl: " . mysql_num_rows($a));
        $a = $this->Data->execQuery("SELECT * FROM personen WHERE tid = '" . $tokenid . "' ORDER BY pid");
        while ($row = mysql_fetch_object($a)) {
            $xmlString.="<person id=\"" . $row->pid . "\">";
            $xmlString.="<name>" . $row->name . "</name>";
            $xmlString.="<vorname>" . $row->vorname . "</vorname>";
            $xmlString.="<geburtsort>" . $row->geburtsort . "</geburtsort>";
            $xmlString.="<geburtsdatum>" . $row->geburtsdatum . "</geburtsdatum>";
            $xmlString.="<sterbeort>" . $row->sterbeort . "</sterbeort>";
            $xmlString.="<todesdatum>" . $row->todesdatum . "</todesdatum>";
            if (1 == $row->geschlecht)
                $xmlString.="<geschlecht>w</geschlecht>";
            else
                $xmlString.="<geschlecht>m</geschlecht>";
            $xmlString.="<bild>" . $row->bild . "</bild>";
            $xmlString.="<sonstiges>" . $row->sonstiges . "</sonstiges>";
            $xmlString.="</person>";
        }

        $xmlString.="</personen>";
        $xmlString.="<beziehungen>";

        //Für jede Beziehung XML Tag erstellen!
        $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Durchlaufe die Beziehungen. Anzahl: " . mysql_num_rows($a));
        $a = $this->Data->execQuery("SELECT * FROM beziehungen WHERE tid = '" . $tokenid . "' ORDER BY type, bid");
        
        while ($row = mysql_fetch_object($a)) {
            if (1 == $row->type)
                $xmlString.="<partner id=\"" . $row->bid . "\" partnerEins=\"" . $row->id_1 . "\" partnerZwei=\"" . $row->id_2 . "\" />";
            else
                $xmlString.="<kind id=\"" . $row->bid . "\" elternteil=\"" . $row->id_1 . "\" kind=\"" . $row->id_2 . "\" />";
        }
        $xmlString.="</beziehungen>";
		
		if($_REQUEST && isset($_REQUEST["startat"]))
			$xmlString.="<startat id=\"".$_REQUEST["startat"]."\" />";
			
        $xmlString.="</familie>";

        //DomDocument mit dem XML String initialisieren und gegen XSD prüfen!
        $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "XML Dokument generiert. Validiere gegen XSD!");
        $dom = new DomDocument();
        $dom->loadXML($xmlString);

        if ($dom->schemaValidate($this->getConfigValue("XSDPath"))) {
            //XML ist valide
            $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "XML wurde erfolgreich validiert!");
            header('Content-type: application/xml');
            print_r($xmlString);
        } else {
            //XML ist invalide
            echo "0;Unbekannter Fehler!";
            $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::ERROR, "XML konnte nicht validiert werden!");
        }
    } else {
        echo "0;Token ist nicht vorhanden!";
    }
} else {
    echo "0;Ihre Session ist abgelaufen!";
    $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Session abgelaufen!");
}
?>
