<?php

//Token übergeben? Wenn ja in Session schreiben
if (true == isset($_GET["token"])) {
    $_SESSION["token"] = $_GET["token"];
}

$this->Data->connect();

//Token vorhanden? Wenn nein, ein Token erstellen
$a = $this->Data->execQuery("SELECT count(*) AS Anzahl FROM stammbaum WHERE id = " . $_SESSION["token"] . ";");
$row = mysql_fetch_object($a);

if (0 == $row->Anzahl) {
    $this->Data->execQuery("INSERT INTO `stammbaum` (`name`) VALUES (\"" . $_SERVER["REMOTE_ADDR"] . "\");");
    $_SESSION["token"] = $this->Data->getLastInsertedId();
}

//Und weiterleiten zum SVG bzw. HTML Team
if ($this->getConfigValue("ModRewrite"))
    header("Location: http://dh.ramon-roessler.de/beta/INDEX");
else
    header("Location: http://dh.ramon-roessler.de/beta/?page=INDEX");
?>
