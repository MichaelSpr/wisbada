<?php

require_once("class.LogMessage.php");

class LogProvider {

    /** @var Array */
    private $m_arrLogMessages = Array();
    /** @var Context */
    private $Context;
    /** @var Bool */
    public $m_bActive = false;
    public $m_tStart;
    public $m_Type;

    /**
     * Fügt eine neue Message zum Array hinzu!
     * @param type $Class String
     * @param type $Function String
     * @param type $Type String
     * @param type $Message String
     */
    public function addMessage($Class, $Function, $Type, $Message) {
        if (true == $this->m_bActive &&
                $Type >= $this->m_Type) {
            $LogMess = new LogMessage($Class, $Function, $Type, $Message);
            array_push($this->m_arrLogMessages, $LogMess);
        }
    }

    /**
     * Konstruktor
     * @param type $Context Context
     */
    function __construct($Context) {
        $this->Context = $Context;
        $this->m_tStart = microtime(true);
        if (true == $this->Context->getConfigValue("Logging")) {
            $this->m_Type = $this->Context->getConfigValue("LogLevel");
            $this->m_bActive = true;
            $this->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, sprintf("Logging mit der Stufe: %s aktiviert!", $this->m_Type));
        } else {
            $this->m_bActive = false;
        }
    }

    /**
     * Destruktor
     */
    function __destruct() {
        
    }

    /**
     * Gibt alle Einträge als Array zurück!
     * @return type Array
     */
    public function getMessages() {
        return $this->m_arrLogMessages;
    }

    /**
     * Gibt die Einträge als PRE zurück und zusätzlich die benötigte Zeit bis zu diesem Aufruf!
     * @return type String
     */
    public function __toString() {
        if (false == $this->m_bActive) {
            return "";
        } else {
            return "<pre>" . sprintf("<pre>%s</pre>Ausgeführt in %s Sekunden!", print_r($this->getMessages(), TRUE), $this->getExecuteTime());
        }
    }

    /**
     * Gibt die Ausführungszeit in Millisekunden zurück!
     * @return type Double
     */
    public function getExecuteTime() {
        $time = (microtime(true) - $this->m_tStart);
        return $time;
    }

}

?>
