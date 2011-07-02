<?php
	$host  = $_SERVER['HTTP_HOST'];
	$uri   = rtrim($_SERVER['PHP_SELF'], '/\\');
	
	$outputStyle = isset($_REQUEST['outputStyle'])?$_REQUEST['outputStyle']:'html';
	if ($outputStyle != 'svg' && $outputStyle!= 'html' && $outputStyle='xml') {
		$outputStyle = 'html'; // set a sane default
    }
	
	if ($this->getConfigValue("ModRewrite") && file_exists('../.htaccess') )
		header("Location: http://$host".dirname($uri)."/". toUpper($outputStyle) ."/". $this->getToken() );
	else
		header("Location: http://$host$uri?page=GET&outputStyle=$outputStyle&token=" . $this->getToken() );
?>