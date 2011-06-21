DROP TABLE IF EXISTS beziehungen;
CREATE TABLE beziehungen (
  tid int(11) NOT NULL,
  bid int(11) NOT NULL,
  type int(1) NOT NULL,
  id_1 int(11) NOT NULL,
  id_2 int(11) NOT NULL,
  PRIMARY KEY (bid, tid)
);
DROP TABLE IF EXISTS personen;
CREATE TABLE personen (
  tid int(11) NOT NULL,
  pid int(11) NOT NULL,
  name varchar(255) DEFAULT NULL,
  vorname varchar(255) DEFAULT NULL,
  geburtsort varchar(255) DEFAULT NULL,
  geburtsdatum date DEFAULT NULL,
  sterbeort varchar(255) DEFAULT NULL,
  todesdatum date DEFAULT NULL,
  geschlecht int(1) DEFAULT NULL,
  bild varchar(255) DEFAULT NULL,
  sonstiges text,
  PRIMARY KEY (pid, tid)
);
DROP TABLE IF EXISTS stammbaum;
CREATE TABLE stammbaum (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
);
DROP TABLE IF EXISTS log;
CREATE TABLE log (
  id int(11) NOT NULL AUTO_INCREMENT,
  timestamp timestamp NOT NULL,
  server text,
   data text,
  PRIMARY KEY (id)
);
INSERT INTO stammbaum VALUES (1,'Example');
INSERT INTO beziehungen VALUES (1,2,2,1,3),(1,3,2,2,3),(1,1,1,1,2);
INSERT INTO personen VALUES (1,1,'Simpson','Homer Jay','Springfield','1989-12-17','','1900-01-01',0,'',''),(1,2,'Simpson','Marjorie (Marge)','Springfield','1989-12-17','','1900-01-01',1,'',''),(1,3,'Simpson','Bartholomew JoJo (Bart)','Springfield','1989-12-17','','1900-01-01',0,'','');