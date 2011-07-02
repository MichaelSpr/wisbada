<?php
	$host  = $_SERVER['HTTP_HOST'];
	$uri   = rtrim($_SERVER['PHP_SELF'], '/\\');
	
	$outputStyle = strtolower(isset($_REQUEST['outputStyle'])?$_REQUEST['outputStyle']:'html');
	if ($outputStyle != 'svg' && $outputStyle!= 'html' && $outputStyle='xml') {
		$outputStyle = 'html'; // set a sane default
    }
	
	if ($this->getConfigValue("ModRewrite") && file_exists('../.htaccess') )
		header("Location: http://$host".dirname($uri)."/".$_SESSION["hash"] ."/GET/html/1/" );
	else
		header("Location: http://$host$uri?page=GET&startat=1&outputStyle=$outputStyle&token=" . $_SESSION["hash"]  );
?>