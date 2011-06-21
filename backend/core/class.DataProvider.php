<?php

class DataProvider {

    /** @var DBConnection */
    private $m_DBConnection = null;
    /** @var Context */
    private $Context = null;
    /** @var int */
    private $queryCounts = 0;
    private $isConnected = false;

    /**
     * Konstruktor
     * @param type $Context Context
     */
    function __construct($Context) {
        $this->Context = $Context;
    }

    /**
     * Baut eine Verbindund zur Datenbank auf.
     */
    public function connect() {
        $this->m_DBConnection = mysql_connect($this->Context->getConfigValue("DBServer"), $this->Context->getConfigValue("DBUser"), $this->Context->getConfigValue("DBPass"));
        mysql_select_db($this->Context->getConfigValue("DBName"));
        $this->Context->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Verbindung mit der Datenbank geöffnet!");
        $this->isConnected = true;
    }

    /**
     * Schließt die Verbindund zur Datenbank.
     */
    public function disconnect() {
        if (true == isset($this->m_DBConnection))
            mysql_close($this->m_DBConnection);
        $this->Context->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, "Verbindung mit der Datenbank geschlossen!");
    }

    /**
     * Führt einen SQL-Query aus und gibt diesen zurück!
     * @param type $Query String
     * @return type MySQL_Query
     */
    public function execQuery($Query) {
        $this->queryCounts++;
        $this->Context->Log->addMessage(get_class($this), __FUNCTION__, LogMessage::NOTIFY, sprintf("Ausführen des Queries: %s", $Query));
        return mysql_query($Query);
    }

    /**
     * Gibt die letzte hinzugefügte ID zurück!
     * @return type Integer
     */
    public function getLastInsertedId() {
        return mysql_insert_id();
    }

    /**
     * Destruktor
     */
    function __destruct() {
        if ($this->isConnected)
            mysql_close($this->m_DBConnection);
    }

    /**
     * Gibt die Anzahl der ausgeführten Queries zurück!
     * @return type Integer
     */
    public function getQueryCounts() {
        return $this->queryCounts;
    }

    /**
     * Gibt zurück, ob eine Verbindung bereits aufgebaut wurde!
     * @return type bool
     */
    public function isConnected() {
        return $this->isConnected;
    }

    /**
     * Gibt einen Leerstring zurück!
     * @return type String
     */
    public function __toString() {
        return "";
    }

}

?>
