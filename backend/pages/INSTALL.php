<?php

$this->Data->connect();

//SQL Structur splitten und jeweils durchlaufen!
$sql = explode(";", file_get_contents('docs/structure.sql'));

foreach ($sql as $query) {
    if ($query != "") {
        $a = $this->Data->execQuery($query);
    }
}

//Login deaktivieren!
$this->setConfigValue("Logging", false);

//Error vorhanden, dann ausgeben. Ansonsten weiterleiten
if (mysql_errno() != 0)
    echo mysql_error();
else {
    $_SESSION["token"] = 1;
	$_SESSION["hash"] = "3552043194";
    if ($this->getConfigValue("ModRewrite"))
        header("Location: http://dh.ramon-roessler.de/ProjektStammbaum/9_AktuelleVersionAusDemGit/".$_SESSION["hash"]);
    else
        header("Location: http://dh.ramon-roessler.de/ProjektStammbaum/9_AktuelleVersionAusDemGit/".$_SESSION["hash"]);
}
?>
