<?php
//Starte Session für die Token => Dadurch muss nicht bei jedem Zugriff die Token übergeben werden!
session_start();

//Header auf UTF8 setzen. Ihr wisst schon warum ;) 
//	-> Kein HTML, da evtl. auch XML übergeben wird, was zu Fehler führen würde!
header("Content-Type: text/html; charset=utf-8");

//Context einbinden
require_once("backend/core/class.Context.php");

//Fehler ausgeben anstatt mit HTTP Error 500!
error_reporting(E_ALL);
ini_set("display_errors", 'ON');

//Context initialisieren und das Ganze ins Rollen bringen!
/** @var core/class.Context.php */
$objContext = new Context();

?>
