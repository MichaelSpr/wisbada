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
    if ($_REQUEST && isset($_REQUEST["xml"])) {
        $dom = new DomDocument();
        /** @var DomDocument */
        $dom->loadXML($_REQUEST["xml"]);

        //Übergebene XML validieren
        if ($dom->schemaValidate($this->getConfigValue("XSDPath"))) {
            $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "XML erfolgreich validiert: " . htmlspecialchars($_REQUEST["xml"], ENT_QUOTES));
            $this->Data->connect();

            //Wurde als POST der Delete Flag gesetzt? Alle Einträge dieser Token werden gelöscht!
            if (true == isset($_REQUEST["delete"]) && $_REQUEST["delete"] == 1)
                $delete = true;
            else
                $delete = false;
            $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Delete Flag wurde auf " . print_r($delete) . " gesetzt");
            //Stammbaum existiert?
            $a = $this->Data->execQuery("SELECT count(*) AS Anzahl FROM stammbaum WHERE name = '" . $tokenid . "'");
            $row = mysql_fetch_object($a);
            if (1 == $row->Anzahl) {

                if ($delete == true) {
                    //Akke Beziehungen und Personen löschen!
                    $this->Data->execQuery("DELETE FROM beziehungen WHERE tid = '" . $tokenid . "'");
                    $this->Data->execQuery("DELETE FROM personen WHERE tid = '" . $tokenid . "'");
                    $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Alle Datensätze mit der TokenID wurden gelöscht");
                }

                $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Füge alle Personen hinzu.");
                //XML für jede Person durchgehen
                foreach ($dom->getElementsByTagName("person") as $item) {
                    $headline = array();

                    //Nodes in ein Array zwischenspeuichern und HTML usw. encoden
                    if ($item->childNodes->length) {
                        foreach ($item->childNodes as $i) {
                            if ($i->nodeName == "geschlecht") {
                                if ($i->nodeValue == "m") {
                                    $headline[$i->nodeName] = 0;
                                } else {
                                    $headline[$i->nodeName] = 1;
                                }
                            } else {
                                $headline[$i->nodeName] = htmlspecialchars($i->nodeValue, ENT_QUOTES);
                            }
                        }


                        if ($delete == true) {
                            //DELETE also INSERT
                            $this->Data->execQuery("INSERT INTO `personen` (`tid`, `pid`, `name`, `vorname`, `geburtsort`, `geburtsdatum`, `sterbeort`, `todesdatum`, `geschlecht`, `bild`, `sonstiges`) VALUES (\"" . $tokenid . "\", \"" . $item->getAttribute('id') . "\", \"" . $headline["name"] . "\",\"" . $headline["vorname"] . "\",\"" . $headline["geburtsort"] . "\",\"" . $headline["geburtsdatum"] . "\",\"" . $headline["sterbeort"] . "\",\"" . $headline["todesdatum"] . "\",\"" . $headline["geschlecht"] . "\",\"" . $headline["bild"] . "\",\"" . $headline["sonstiges"] . "\");");
                        } else {
                            //Personen ID überprüfen
                            $a = $this->Data->execQuery("SELECT count(*) AS Anzahl FROM personen WHERE pid = '" . $item->getAttribute('id') . "' AND tid = '" . $tokenid . "'");
                            $row = mysql_fetch_object($a);

                            if (1 == $row->Anzahl) {
                                //Vorhanden als UPDATE
                                $this->Data->execQuery("UPDATE personen SET name = \"" . $headline["name"] . "\", vorname = \"" . $headline["vorname"] . "\", geburtsort = \"" . $headline["geburtsort"] . "\", geburtsdatum = \"" . $headline["geburtsdatum"] . "\", sterbeort = \"" . $headline["sterbeort"] . "\", todesdatum = \"" . $headline["todesdatum"] . "\", geschlecht = \"" . $headline["geschlecht"] . "\", bild = \"" . $headline["bild"] . "\", sonstiges = \"" . $headline["sonstiges"] . "\" WHERE pid = " . $item->getAttribute('id') . " AND tid = " . $tokenid . ";");
                            } else {
                                //Nicht vorhanden also INSERT
                                $this->Data->execQuery("INSERT INTO `personen` (`tid`, `pid`, `name`, `vorname`, `geburtsort`, `geburtsdatum`, `sterbeort`, `todesdatum`, `geschlecht`, `bild`, `sonstiges`) VALUES (\"" . $tokenid . "\", \"" . $item->getAttribute('id') . "\", \"" . $headline["name"] . "\",\"" . $headline["vorname"] . "\",\"" . $headline["geburtsort"] . "\",\"" . $headline["geburtsdatum"] . "\",\"" . $headline["sterbeort"] . "\",\"" . $headline["todesdatum"] . "\",\"" . $headline["geschlecht"] . "\",\"" . $headline["bild"] . "\",\"" . $headline["sonstiges"] . "\");");
                            }
                        }
                    }
                }

                $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Füge alle KindBeziehungen hinzu.");
                //XML für jede KINDBeziehung durchgehen
                foreach ($dom->getElementsByTagName("kind") as $item) {

                    if ($delete == true) {
                        //DELETE also INSERT
                        $this->Data->execQuery("INSERT INTO `beziehungen` (`tid`, `bid`, `id_1`, `id_2`, `type`) VALUES (\"" . $tokenid . "\", \"" . $item->getAttribute('id') . "\",\"" . $item->getAttribute('elternteil') . "\",\"" . $item->getAttribute('kind') . "\",\"2\");");
                    } else {
                        //Beziehung vorhanden?
                        $a = $this->Data->execQuery("SELECT count(*) AS Anzahl FROM beziehungen WHERE bid = '" . $item->getAttribute('id') . "' AND tid = '" . $tokenid . "' AND type = 2");
                        $row = mysql_fetch_object($a);

                        if (1 == $row->Anzahl) {
                            //Ja, also UPDATE
                            $this->Data->execQuery("UPDATE beziehungen SET id_1 = " . $item->getAttribute('elternteil') . ", id_2 = " . $item->getAttribute('kind') . ", type = 2 WHERE bid = " . $item->getAttribute('id') . " AND tid = " . $tokenid . ";");
                        } else {
                            //Nein, also INSERT
                            $this->Data->execQuery("INSERT INTO `beziehungen` (`tid`, `bid`, `id_1`, `id_2`, `type`) VALUES (\"" . $tokenid . "\", \"" . $item->getAttribute('id') . "\",\"" . $item->getAttribute('elternteil') . "\",\"" . $item->getAttribute('kind') . "\",\"2\");");
                        }
                    }
                }

                $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Füge alle PartnerBeziehungen hinzu.");
                //XML für jede PARTNERBeziehung durchgehen
                foreach ($dom->getElementsByTagName("partner") as $item) {

                    if ($delete == true) {
                        //DELETE also INSERT
                        $this->Data->execQuery("INSERT INTO `beziehungen` (`tid`, `bid`, `id_1`, `id_2`, `type`) VALUES (\"" . $tokenid . "\", \"" . $item->getAttribute('id') . "\", \"" . $item->getAttribute('partnerEins') . "\",\"" . $item->getAttribute('partnerZwei') . "\",\"1\");");
                    } else {
                        //Beziehung vorhanden?
                        $a = $this->Data->execQuery("SELECT count(*) AS Anzahl FROM beziehungen WHERE bid = '" . $item->getAttribute('id') . "' AND tid = '" . $tokenid . "' AND type = 1");
                        $row = mysql_fetch_object($a);

                        if (1 == $row->Anzahl) {
                            //Ja, also UPDATE
                            $this->Data->execQuery("UPDATE beziehungen SET id_1 = " . $item->getAttribute('partnerEins') . ", id_2 = " . $item->getAttribute('partnerZwei') . ", type = 1 WHERE bid = " . $item->getAttribute('id') . " AND tid = " . $tokenid . ";");
                        } else {
                            //Nein, also INSERT
                            $this->Data->execQuery("INSERT INTO `beziehungen` (`tid`, `bid`, `id_1`, `id_2`, `type`) VALUES (\"" . $tokenid . "\", \"" . $item->getAttribute('id') . "\", \"" . $item->getAttribute('partnerEins') . "\",\"" . $item->getAttribute('partnerZwei') . "\",\"1\");");
                        }
                    }
                }

                $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "XML erfolgreich gespeichert!");
                echo 1;
            } else {
                //0 mit Fehlermeldung zurückgeben
                $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::WARNING, "Session abgelaufen oder Token nicht vorhanden!");
                echo "0;Session abgelaufen oder Token nicht vorhanden!";
            }
        } else {
            //0 mit Fehlermeldung zurückgeben
            $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::WARNING, "Validation der XML gegen die XSD ist fehlgeschlagen!");
            echo "0;Validation fehlgeschlagen!";
			libxml_display_errors();
        }
    } else {
        //0 mit Fehlermeldung zurückgeben
        $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::WARNING, "Aufruf ohne POST!");
        echo "0;Es wurden keine Daten übermittelt!";
    }
} else {
    //0 mit Fehlermeldung zurückgeben
    $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::WARNING, "Session abgelaufen!");
    echo "0;Session ist abgelaufen!";
}
?>
