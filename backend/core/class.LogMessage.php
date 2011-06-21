<?php

class LogMessage {
    const NOTIFY = 0;
    const WARNING = 1;
    const ERROR = 2;

    private $Class;
    private $Function;
    private $Type;
    private $Message;
    private $timestamp;

    /**
     * Konstruktor der eine neue LogMessage aufbaut!
     * @param type $class String
     * @param type $function String
     * @param type $type String
     * @param type $message String
     */
    function __construct($class, $function, $type, $message) {
        $this->Class = $class;
        $this->Function = $function;
        $this->Type = $type;
        $this->Message = $message;

        $time = microtime(true);
        $this->timestamp = $time;
    }

    /**
     * Destruktor
     */
    function __destruct() {
        
    }

    /**
     * Gibt den Timestamp der LogMessage zurück!
     * @return type Timestamp
     */
    public function getTimestamp() {
        return $this->timestamp;
    }

    /**
     * Gibt eine relativ schöne Zeile der LogMessage zurück!
     * @return type String
     */
    public function __toString() {
        return $this->timestamp . " - " . $this->Type . " : " . $this->Class . " -> " . $this->Function . " -> " . $this->Message;
    }

}

?>
