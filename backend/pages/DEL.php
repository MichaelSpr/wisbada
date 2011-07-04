<?php
//Funktion die die Errorausgabe abändert. Dadurch wird sie nicht von der Funktion schemaValidate als Exception ausgegeben, sondern abgefangen!
function libxml_display_error($error)
{
    $return = "<br/>\n";
    switch ($error->level) {
        case LIBXML_ERR_WARNING:
            $return .= "<b>Warning $error->code</b>: ";
            break;
        case LIBXML_ERR_ERROR:
            $return .= "<b>Error $error->code</b>: ";
            break;
        case LIBXML_ERR_FATAL:
            $return .= "<b>Fatal Error $error->code</b>: ";
            break;
    }
    $return .= trim($error->message);
    if ($error->file) {
        $return .=    " in <b>$error->file</b>";
    }
    $return .= " on line <b>$error->line</b>\n";

    return $return;
}
//Funktion die die Errorausgabe abändert. Dadurch wird sie nicht von der Funktion schemaValidate als Exception ausgegeben, sondern abgefangen!
function libxml_display_errors() {
    $errors = libxml_get_errors();
    foreach ($errors as $error) {
        print libxml_display_error($error);
    }
    libxml_clear_errors();
}

// User Error Handling erlauben
libxml_use_internal_errors(true);

//TokenID vorhande?
$tokenid = $this->getToken();
if (!empty($tokenid)) {
    $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Aufruf mit der TokenID: " . $tokenid);
    //Daten übermittelt?
    if ($_REQUEST && (isset($_REQUEST["pid"]) || isset($_REQUEST["bid"]))) {
		$this->Data->connect();
	
		if(isset($_REQUEST["pid"]) && $_REQUEST["pid"] != ""){
			$this->Data->execQuery("DELETE FROM personen WHERE tid = '" . $tokenid . "' AND pid = '".$_REQUEST["pid"]."';");
			$this->Data->execQuery("DELETE FROM beziehungen WHERE tid = '" . $tokenid . "' AND id_1 = '".$_REQUEST["pid"]."';");
			$this->Data->execQuery("DELETE FROM beziehungen WHERE tid = '" . $tokenid . "' AND id_2 = '".$_REQUEST["pid"]."';");
			echo "Person und Beziehungen gelöscht<br/>";
		}
		
		if(isset($_REQUEST["bid"]) && $_REQUEST["bid"] != ""){
			$this->Data->execQuery("DELETE FROM beziehungen WHERE tid = '" . $tokenid . "' AND bid = '". $_REQUEST["bid"] . "';");	
			echo "Beziehung gelöscht<br/>";
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
