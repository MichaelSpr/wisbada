<?php

require_once("class.LogProvider.php");
require_once("class.DataProvider.php");

class Context {

    /** @var Array */
    private $ConfigDB = Array();
    /** @var LogProvider */
    public $Log = null;
    /** @var DataProvider */
    public $Data = null;

    /**
     * Konstruktor
     */
    function __construct() {
        include("backend/config/config.php");
        $this->initClasses();

        if (true == isset($_GET['page'])) {
            include("backend/pages/" . $_GET["page"] . ".php");
        } else {
            include("backend/pages/NEW.php");
        }
    }

    /**
     * Initialisiert alle notwendigen Klassen.
     */
    private function initClasses() {
        $this->Log = new LogProvider($this);
        $this->Data = new DataProvider($this);

        $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Objekte erfolgreich initialisiert!");
    }

    /**
     * Destruktor
     */
    function __destruct() {

        if (true == $this->getConfigValue("Logging")) {
            if (false == $this->Data->isConnected())
                $this->Data->connect();
            
            
            $this->Data->execQuery("INSERT INTO log (server, data) VALUES (\"".htmlentities("<pre>" . print_r($_SERVER, TRUE) . "</pre>", ENT_QUOTES)."\", \"".htmlentities("<pre>" . $this->Log . "</pre>", ENT_QUOTES)."\");");
        }
        unset($this->Log);
        unset($this->Data);
    }

    /**
     * Gibt den Konfigurationswert des übergebenen Schlüssels zurück. Falls kein Schlüssel gefunden werden konnte wird stattdessen ein Leerstring zurückgegeben!
     * @param type $key String
     * @return type String
     */
    public function getConfigValue($key) {
        if (true == isset($this->ConfigDB[$key])) {
            return $this->ConfigDB[$key];
        } else {
            $this->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::WARNING, sprintf("Es konnte kein Schlüssel für \"%s\" gefunden werden!", $key));
            return "";
        }
    }

    public function setConfigValue($key, $value) {
        $this->ConfigDB[$key] = $value;
    }

}

?>
