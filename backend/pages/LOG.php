<?php

$this->Data->connect();

//Die letzten 20 Logs auslesen!
$a = $this->Data->execQuery("SELECT * FROM log ORDER BY ID DESC LIMIT 20 ");

//Logging deaktivieren
$this->setConfigValue("Logging", false);

//Jeden Eintrag ausgeben
while ($row = mysql_fetch_object($a)) {
    echo "<p><h1>" . $row->id . "</h1>";
    echo "<div style=width:100%;height:200px;border:1px solid black;><div style=height:200px;overflow:scroll;float:left;width:50%;>" . html_entity_decode($row->server, ENT_QUOTES) . "</div><div style=height:200px;overflow:scroll;float:left;width:50%;>" . html_entity_decode($row->data, ENT_QUOTES) . "</div>";
    echo "</p>";
}
?>
