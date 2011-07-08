
STAMMBAUM.events.onEditPerson = function ( pid )
{
    $.get('../index.php', {page: 'GET', pid : pid }, 
		function (data) {
			person = splitXML(data.documentElement);
			var geburt = 'geburtsdatum';
			var todes = 'todesdatum';
	
			STAMMBAUM.view.dialog('<div id="inputcontainer"><form method="post" action="./backend/core/upload.php" enctype="multipart/form-data"'+
				'id="inputForm"  target="upload_target" onsubmit="return chkForm()">' +
				'<table border="0" cell-padding="0" cell-spacing="0"><tr>' +
				'<td class="inputBezeichner"><label for="name">Name</label></td><td><input type="text" name="name" id="name" value="'+person.name+'"/></td>' +
				'<td class="inputBezeichner"><label for="vorname">Vorname</label></td><td><input type="text" name="vorname" id="vorname" value="'+person.vorname+'" /></td>' +
				'</tr><tr><td class="inputBezeichner"><label for="geschlecht">Geschlecht</label></td><td><select name="geschlecht" id="geschlecht" size="1">'+
					'<option value="m" '+ ((person.geschlecht=='m')?'selected':'') +'>M&auml;nnlich</option>'+
					'<option value="w" '+ ((person.geschlecht=='w')?'selected':'') +'>Weiblich</option></select>' +
				'</td><td class="inputBezeichner"></td><td></td>' +
						'	</tr>' +
						'	<tr>' +
						'		<td class="inputBezeichner">Geburtsdatum</td><td><input type="text" name="geburtsdatum" id="geburtsdatum"  value="'+person.geburtsdatum+'" /></td>' + //onblur="PruefeDatum("geburtsdatum");"
						'		<td class="inputBezeichner">Geburtsort</td><td><input type="text" name="geburtsort" id="geburtsort" value="'+person.geburtsort+'" /></td>' +
						'	</tr>' +
						'	<tr>' +
						'		<td class="inputBezeichner"><label for="todesdatum">Todesdatum</label></td><td><input type="text" name="todesdatum" id="todesdatum"  value="'+person.todesdatum+'" /></td>' + //onblur="PruefeDatum("todesdatum")"
						'		<td class="inputBezeichner"><label for="sterbeort">Sterbeort</label></td><td><input type="text" name="sterbeort" id="sterbeort" value="'+person.sterbeort+'" /></td>'+
						'	</tr>' +
						'	<tr>' +
						'		<td class="inputBezeichner"><label for="sonstiges">Sonstiges</label></td><td colspan="3"><textarea rows="2" cols="" id="sonstiges">'+person.sonstiges+'" </textarea></td>' +
						'	</tr>' +
						'	<tr>' +
						'		<td class="inputBezeichner">Bild</td><td colspan="3"><input type="file" name="bild" id="bild"/>' +
						'		<br/>' +
						'		<span  id="result"></span>' +
						'		<iframe id="upload_target" name="upload_target" src="#" style="width:0;height:0;border:0px solid #fff;"></iframe>' +
						'		</td>' +
						'	</tr>' +
						'	<tr>' +
						'		<td colspan="4" class="inputSenden"><input type="submit" name="senden" value="senden" id="button" /></td>' +
						'	</tr>' +
						'</table>' +
					'</form>' +
				'</div> ' , 
				{ 	'title' : 'Person bearbeiten',
					'buttons' : [ {'title': 'Abbrechen'},
						{'title' : 'senden', 
						'primary' : true,
						'callback' : function(dlg){
							// commit
							var xmlstring = '<?xml version="1.0" encoding="UTF-8" ?><familie xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="stammbaum.xsd"><personen><person id="'+pid+'"><name>' + document.getElementById("name").value +  '</name><vorname>' + document.getElementById('vorname').value + '</vorname><geburtsort>' + document.getElementById('geburtsort').value + '</geburtsort><geburtsdatum>' + document.getElementById('geburtsdatum').value + '</geburtsdatum><sterbeort>' + document.getElementById('sterbeort').value + '</sterbeort><todesdatum>' + document.getElementById('todesdatum').value + '</todesdatum><geschlecht>' + document.getElementById('geschlecht').value + '</geschlecht><bild/><sonstiges/></person></personen><beziehungen></beziehungen></familie>';
							$.post("../index.php",
								{ page: "SET", token: STAMMBAUM.token, xml: xmlstring },
								function(result) {
									if (result == 1)
									{
										console.log('IMPORT: success');
										location.reload();
									}
									else
									{
										console.log('IMPORT: failed\n' + result);
										STAMMBAUM.dialog( '<div><h1>Importfailed!</h1><p>'+result+'</p></div>');
									}
								});
						}
					} ]
				}
			);
		}
	);
	return false;
}

function splitXML(xmlDoc) {
	var pers = xmlDoc.firstChild.firstChild;
	
	var person = {
		'vorname' : (pers.getElementsByTagName('vorname').length>0)?pers.getElementsByTagName('vorname')[0].textContent:'',
		'name'	:	(pers.getElementsByTagName('name').length>0)?pers.getElementsByTagName('name')[0].textContent:'',
		'geschlecht'	:	(pers.getElementsByTagName('geschlecht').length>0)?pers.getElementsByTagName('geschlecht')[0].textContent:'',
		'geburtsdatum'	:	(pers.getElementsByTagName('geburtsdatum').length>0)?pers.getElementsByTagName('geburtsdatum')[0].textContent:'',
		'todesdatum'	:	(pers.getElementsByTagName('todesdatum').length>0)?pers.getElementsByTagName('todesdatum')[0].textContent:'',
		'geburtsort'	:	(pers.getElementsByTagName('geburtsort').length>0)?pers.getElementsByTagName('geburtsort')[0].textContent:'',
		'sterbeort'	:	(pers.getElementsByTagName('sterbeort').length>0)?pers.getElementsByTagName('sterbeort')[0].textContent:'',
		'sonstiges'	:	(pers.getElementsByTagName('sonstiges').length>0)?pers.getElementsByTagName('sonstiges')[0].textContent:'',
		'bild'	:	(pers.getElementsByTagName('bild').length>0)?pers.getElementsByTagName('bild')[0].textContent:''
	};
	console.log(person);
	return person;		
}

//<!-- File-Upload Versuch geht noch nicht -->

function startUpload(){
      document.getElementById("result").innerHTML = "Test";
	  //$("result").html("Upload started...");
      return true;
}

function stopUpload(success){
	if (success == 1){
	         document.getElementById("result").innerHTML = "The file was uploaded successfully!";
			//$("result").html("The file was uploaded successfully!");
	}
	else {
		document.getElementById("result").innerHTML = "There was an error during file upload!";
		//$("result").html("There was an error during file upload!");
	}
	return true;   
}


//<!--  ################# Validierung ###################### -->
    function chkForm () {
      if (document.inputForm.name.value == "") {
	  //if ($('#name').val() == "") {
        alert("Bitte Ihren Namen eingeben!");
        document.inputForm.name.focus();
		//$('#name').get().focus();
        return false;
      }
        if (document.inputForm.vorname.value == "") {
	  // if ($('#vorname').val() == "") {
        alert("Bitte Ihren Vornamen eingeben!");
        document.inputForm.vorname.focus();
		//$('#vorname').get().focus();
        return false;
      }
    }
      
    //  <!-- http://www.web-toolbox.net/webtoolbox/datum/datum-gueltig.htm -->
      function PruefeDatum(datumFeld)
  {
  
      //  Datum = document.getElementById(datumFeld).value;
	//	Laenge = document.getElementById(datumFeld).value.length;
		Datum = $(datumFeld).val();
		Laenge = $(datumFeld).val().length;
        // alert zur Kontrolle (Länge)
        // alert("Länge ist " + Laenge);
  
        var JetztDatum = new Date();
        var DiesesJahr = JetztDatum.getYear();
        var DieserMonat = JetztDatum.getMonth()+1;
        var DieserTag = JetztDatum.getDate();
  
  
  
        if (Datum == "")
        {
        Fehlermeldung00(datumFeld);
        return false;
        }
  
  
        // Eingabeformat ist OK (10 Zeichen) dann Prüfung ob Trennzeichen ein Punkt ist
  
        if (Laenge==10 && Datum.substring(2,3)=="." && Datum.substring(5,6)==".")
        {
        Tag = parseInt(Datum.substring(0,2),10);
        Monat = parseInt(Datum.substring(3,5),10);
        Jahr = parseInt(Datum.substring(6,10),10);
  
        // alert zur Kontrolle Trennzeichen
        // alert("Trennzeichen OK");
  
        }
        else
        {
        Datum = "  .  .  ";
        Fehlermeldung01(datumFeld);
        return false;
        }
  
  
        // TageMonat festlegen, größter Eintrag für den entsprechenden Monat (auch Schaltjahr)
  
        if (Monat==4 || Monat==6 || Monat==9 || Monat==11)
        {
        tageMonat=30;
        }
  
        if (Monat==1 || Monat==3 || Monat==5 || Monat==7 || Monat==8 || Monat==10 || Monat==12)
        {
        tageMonat=31;
        }
  
  
        if(Monat==2 && Jahr%4==0 && Jahr%100!=0 || Jahr%400==0)
        {
        tageMonat=29;
        }
        else if(Monat==2 && Jahr%4!=0 || Jahr%100==0 && Jahr%400!=0)
        {
        tageMonat=28;
        }
  
  
        if ((Tag>=1 && Tag <= tageMonat) && (Monat >= 1 && Monat <= 12) )
        {
        // alert zur Kontrolle Werte
        // alert("Jedes gültige Datum erlaubt. Werte - OK");
        }
        else
        {
        Fehlermeldung02(datumFeld);
        return false;
        }
  
  }
  
  
  
        function Fehlermeldung00(datumFeld)
        {
        alert("Bitte Datum eintragen!");
       // document.getElementById(datumFeld).value = "";
       // document.getElementById(datumFeld).focus();
		$(datumFeld).val("");
        $(datumFeld).focus();
       
        return false;
        }
  
        function Fehlermeldung01(datumFeld)
        {
        alert("Eingetragener Datumswert ist ungültig - Eingabeformat!");
      //  document.getElementById(datumFeld).value = "";
      //  document.getElementById(datumFeld).focus();
		$(datumFeld).val("");
        $(datumFeld).focus();
        
        return false;
        }
  
  
        function Fehlermeldung02(datumFeld)
        {
        alert("Eingetragener Datumswert ist ungültig - Eingabewerte!");
       // document.getElementById(datumFeld).value = "";
       // document.getElementById(datumFeld).focus();
		$(datumFeld).val("");
        $(datumFeld).focus();
      
        return false;
        }

