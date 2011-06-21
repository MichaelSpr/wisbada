<?php

//Erlaube Logging? Es wird zusätzlich ein SQL Eintrag pro Aufruf gespeichert!!
$this->ConfigDB["Logging"] = true;

//ModRewrite // Kurze URLs erlauben?
$this->ConfigDB["ModRewrite"] = true;

//Pfad zur XSD um die Validierung der XML zu gewährleisten
$this->ConfigDB["XSDPath"] = "backend/docs/stammbaum.xsd";


/** Stuffe des Loggings
 * 0 = All
 * 1 = Warnings
 * 2 = Errors
 */
$this->ConfigDB["LogLevel"] = 0;

//SQL Benutzerdaten sowie Datenbank
$this->ConfigDB["DBServer"] = "localhost";
$this->ConfigDB["DBUser"] = "";
$this->ConfigDB["DBPass"] = "";
$this->ConfigDB["DBName"] = "";
?>
