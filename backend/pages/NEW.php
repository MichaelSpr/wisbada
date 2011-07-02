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
	// Neue session bzw. noch nicht in der DB
	$_SESSION["hash"] = crc32(time());
	$_SESSION['startat'] = 1;
    $this->Data->execQuery("INSERT INTO `stammbaum` (`name`) VALUES (\"" . $_SESSION["hash"] . "\");");
    $_SESSION["token"] = $this->Data->getLastInsertedId();
	$host  = $_SERVER['HTTP_HOST'];
	$uri   = rtrim($_SERVER['PHP_SELF'], '/\\');
	if ($this->getConfigValue("ModRewrite") && file_exists('../.htaccess') )
		header("Location: http://$host".dirname($uri)."/".$_SESSION["hash"] . "/GET/html/1");
	else
		header("Location: http://$host$uri?page=GET&outputStyle=html&startat=1&token=".$_SESSION["hash"]);
		
}else{
	$a = $this->Data->execQuery("SELECT * FROM stammbaum WHERE name = \"" . $_SESSION["hash"] . "\";");
	$row = mysql_fetch_object($a);
	$_SESSION["token"] = $row->id;
	include("backend/pages/OUTPUT.php");
}


	
?>
