<?php

$this->Data->connect();
$count = 0;
//Token übergeben? Wenn ja in Session schreiben
if (true == isset($_GET["token"])) {
	$_SESSION["hash"] = $_GET["token"];
	$a = $this->Data->execQuery("SELECT count(*) AS Anzahl FROM stammbaum WHERE name = \"" . $_SESSION["hash"] . "\";");
	$row = mysql_fetch_object($a);
	$count = $row->Anzahl;
}

if (0 == $count) {
	$_SESSION["hash"] = crc32(time());
    $this->Data->execQuery("INSERT INTO `stammbaum` (`name`) VALUES (\"" . $_SESSION["hash"] . "\");");
    $_SESSION["token"] = $this->Data->getLastInsertedId();
	if ($this->getConfigValue("ModRewrite"))
		header("Location: http://dh.ramon-roessler.de/ProjektStammbaum/9_AktuelleVersionAusDemGit/".$_SESSION["hash"]);
	else
		header("Location: http://dh.ramon-roessler.de/ProjektStammbaum/9_AktuelleVersionAusDemGit/".$_SESSION["hash"]);
		
}else{
	$a = $this->Data->execQuery("SELECT * FROM stammbaum WHERE name = \"" . $_SESSION["hash"] . "\";");
	$row = mysql_fetch_object($a);
	$_SESSION["token"] = $row->id;
	include("backend/pages/INDEX.php");
}


//Und weiterleiten zum SVG bzw. HTML Team

	
?>
