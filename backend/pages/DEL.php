<?php

//TokenID vorhande?
$tokenid = $this->getToken();
if (!empty($tokenid)) {
    $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Aufruf mit der TokenID: " . $tokenid);
    //Daten übermittelt?
    if ($_REQUEST && (isset($_REQUEST["pid"]) || isset($_REQUEST["bid"]))) {
		$this->Data->connect();
	
		if(isset($_REQUEST["bid"]) && $_REQUEST["bid"] != ""){
			$this->Data->execQuery("DELETE FROM beziehungen WHERE tid = '" . $tokenid . "' AND bid = '". $_REQUEST["bid"] . "';");	
			echo "1;Beziehung gelöscht<br/>";
		}      
		if(isset($_REQUEST["pid"]) && $_REQUEST["pid"] != ""){
			//Anzahl der Beziehungen prüfen
			$objCountChilds = $this->Data->execQuery("SELECT count(distinct(type)) AS Anzahl FROM beziehungen WHERE type = '2' AND tid = '" . $tokenid . "' AND id_2 = '".$_REQUEST["pid"]."';");
			$countChilds = mysql_fetch_object($objCountChilds);
			
			$objCountParents = $this->Data->execQuery("SELECT count(distinct(type)) AS Anzahl FROM beziehungen WHERE  type = '2' AND tid = '" . $tokenid . "' AND id_1 = '".$_REQUEST["pid"]."';");
			$countParents = mysql_fetch_object($objCountParents);
			
			$objCountPer = $this->Data->execQuery("SELECT count(*) AS Anzahl FROM personen WHERE tid = '" . $tokenid . "';");
			$countPers = mysql_fetch_object($objCountPer);	
	
			if ( $countPers->Anzahl > 1 && ($countParents->Anzahl == 0 || $countChilds->Anzahl == 0)) {
				$this->Data->execQuery("DELETE FROM personen WHERE tid = '" . $tokenid . "' AND pid = '".$_REQUEST["pid"]."';");
				$this->Data->execQuery("DELETE FROM beziehungen WHERE tid = '" . $tokenid . "' AND id_1 = '".$_REQUEST["pid"]."';");
				$this->Data->execQuery("DELETE FROM beziehungen WHERE tid = '" . $tokenid . "' AND id_2 = '".$_REQUEST["pid"]."';");
				echo "1;Person und Beziehungen gelöscht<br/>";
			}else{
				echo "0;Person besitzt zu viele Beziehungen oder ist die einzige Person<br/>";
			}			
		}
		
    } else {
        //0 mit Fehlermeldung zurückgeben
        $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::WARNING, "Aufruf ohne GET!");
        echo "0;Es wurden keine Daten übermittelt!";
    }
} else {
    //0 mit Fehlermeldung zurückgeben
    $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::WARNING, "Session abgelaufen!");
    echo "0;Session ist abgelaufen!";
}
?>
