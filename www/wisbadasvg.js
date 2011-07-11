function getElementsByClassName(string) {
	var elements = document.getElementById("begin").getElementsByTagName("*"); 
	var elementArray = new Array();
	for (var i = 0; i <  elements.length; i++) {
		var thisElem = elements[i];
		if (thisElem.classList && thisElem.classList.toString() == string) {
			elementArray[elementArray.length] = thisElem;
		} else if (thisElem.className && thisElem.className.toString() == string) {
			elementArray[elementArray.length] = thisElem;
		}
	}
	return elementArray;
}

function getMaxLevel() {
	var elements = document.getElementById("begin").getElementsByTagName("*"); 
	var maxLevel = -1;
	
	for (var i = 0; i <  elements.length; i++) {
		var thisElem = elements[i];
		if (thisElem.classList && thisElem.classList.toString().match(/level_.*/)) {
			var value = parseInt(thisElem.classList.toString().match(/level_(.*)/)[1]);
			if( maxLevel < value)
				maxLevel = value;
		} else if (thisElem.className && thisElem.className.toString().match(/level_.*/)) {
			var value = parseInt(thisElem.className.toString().match(/level_(.*)/)[1]);
			if( maxLevel < value)
				maxLevel = value;
		}
	}
	
	return maxLevel;
}

function checkColl(elements,parentElements) {
	var parent;
	var parentChange;
	var parentCount=0;
	var transform;
	transform = document.createAttribute("transform");
	transform.nodeValue = "translate(0)"; 
	var elementsPadCount=0;
	var deleteFlag = false;
	var waitFlag = false;
	var saveA = 0;
	
	for(var i = 0; i < (elements.length -1); i++) {
		var collArray = new Array();
		//get x value out of the transform attribute of the g.person
		var value1 = parseInt(elements[i].getElementsByTagName("g")[0].getAttribute("transform").match(/translate\((.*),.*\)/)[1]);
		//console.log(value1);
		//detect collision
		
		for(var a= saveA; a < elements.length; a++) {
			
			if (i == a)
				break;
				
			var value2 = parseInt(elements[a].getElementsByTagName("g")[0].getAttribute("transform").match(/translate\((.*),.*\)/)[1]);
			//+translate der parents
			
			//Bereich absuchen
			//if(value1 < (value2 +100) && value1 > (value2 -10)) {
			
			if((value1 > value2 -10 )&& (value1 <= value2 +50)) {
				for(var m=0;m<(i-a); m++){
					collArray[collArray.length] = value1;
					//console.log("minus: " + (i-a));
					/*
					var isin = false;
					for( var b = 0; b < collArray.length; b++) {
						if(collArray[b] == value1){
							isin = true;
							collArray[b] = 1;
						}
					}
					if(!isin)
						collArray[collArray.length] = value1;
				*/
				}
				break;
			}
		}
		//console.log("arraySame: " + collArray);
		//console.log("array: " + collArray);
		
		//Zum verschieben des obersten Parent
		elementsPadCount += collArray.length; 
		
		if(parent != elements[i].parentNode.parentNode) {
			//console.log("In translate");
			var lastParent = parent;
			var parentTranslate = elements[i].parentNode.parentNode;
			parent = elements[i].parentNode.parentNode;

			//wenn jemand keine Kinder hat, wird er übersprungen!!!
			while((parentElements[parentCount] != elements[i].parentNode.parentNode) && (parentElements[(parentCount)] != null)){
				var clone = transform.cloneNode(true);
				parentElements[parentCount].setAttributeNode(clone);
				parentCount++;
			}
			
			/*
			//Für den Fall das bereits ein translate vorhanden ist
			var translateOldVal = 0;
			var translateOld = parent.getAttribute("transform");
			if (translateOld != null){
				translateOld = translateOld.match(/translate\((.*)\)/);
				if (translateOld != null){
					translateOldVal = parseInt(translateOld[1]);
				}else
					translateOldVal = 0;
			}else
				translateOldVal=0;
			//console.log(translateOldVal);
			*/
			
			//Der höchste parent der gewechselt wird bekommt das translate
			var translateFlag = true;
			var tempLastParent = lastParent;
			var tempParentTranslate = parentTranslate;
			var translateOldVal=0;
			// den höchsten suchen und auf dem weg die translate addieren
			while((tempLastParent != null && translateFlag)){
				if((tempLastParent != tempParentTranslate) && (tempLastParent != null)){
					saveA = i;
					lastParent = tempLastParent;
					parentTranslate = tempParentTranslate;
					
					tempLastParent = tempLastParent.parentNode;
					tempParentTranslate = tempParentTranslate.parentNode;
				}else{
					var translateOld = tempParentTranslate.getAttribute("transform");
					
					if(translateOld != null){
						//ende von dokument?
						if(translateOld.match(/scale/)){
							translateFlag = false;
						}
						else{
							//werte addieren
							translateOld = translateOld.match(/translate\((.*)\)/);
							if (translateOld != null){
								translateOldVal += parseInt(translateOld[1]);
							}
						}
					}
					
					tempLastParent = tempLastParent.parentNode;
					tempParentTranslate = tempParentTranslate.parentNode;
				}
			}
			//console.log("translateVal: " +translateVal);
			//console.log("minus: "+translateOldVal)
			//translateVal -= translateOldVal;
			
			//Für den Fall das bereits ein translate vorhanden ist
			var translateOldVal = 0;
			var translateOld = parentTranslate.getAttribute("transform");
			if (translateOld != null){
				translateOld = translateOld.match(/translate\((.*)\)/);
				if (translateOld != null){
					translateOldVal = parseInt(translateOld[1]);
				}else
					translateOldVal = 0;
			}else
				translateOldVal=0;
			//console.log(translateOldVal);
			var translateVal = (200 * collArray.length);
			//auch die nachfolgenden und höheren verschieben wenn nicht direktes Elternattribut verändert wird
			
			
				transform = document.createAttribute("transform");
				transform.nodeValue = "translate("+(translateVal +translateOldVal) +")";
				parentTranslate.setAttributeNode(transform);
				//console.log(parentTranslate);
				//console.log(parentElements[parentCount]);
				if(collArray.length > 0)
					drawBar(parentTranslate,((translateVal +translateOldVal)/200));
				
				var className = parentTranslate.getAttribute("class");
				var elementsWalkThrough = getElementsByClassName(className);
				var z = 0;
				while(parentTranslate != elementsWalkThrough[z] && elementsWalkThrough[z] != null){
				z++;}
				z++;
				var UltimateParentCounter =0;
				var elementWTChangeOld = elementsWalkThrough[z-1];;
				//Gibt noch probleme wenns eins höher muss
				//addition!!!
				while(elementsWalkThrough[z] != null){
					var elementWTChange = elementsWalkThrough[z];
					for(var hase=0; hase < UltimateParentCounter; hase++){
						elementWTChange = elementWTChange.parentNode;
						//console.log("ULT " +UltimateParentCounter);
						//elementWTChangeOld = elementWTChangeOld.parentNode;
					}
					while((elementWTChange != null) && (elementWTChange.parentNode != elementWTChangeOld.parentNode)){
						UltimateParentCounter++;
						elementWTChange = elementWTChange.parentNode;
						elementWTChangeOld = elementWTChangeOld.parentNode;
					}
					if(elementWTChange == elementWTChangeOld){
						z++;
						elementWTChangeOld = elementWTChange;
						continue;
					}
						
					//Für den Fall das bereits ein translate vorhanden ist
					var translateOldVal = 0;
					var translateOld = elementWTChange.getAttribute("transform");
					if (translateOld != null){
						translateOld = translateOld.match(/translate\((.*)\)/);
						if (translateOld != null){
							translateOldVal = parseInt(translateOld[1]);
						}else
							translateOldVal = 0;
					}else
						translateOldVal=0;
					//console.log("add::" +translateVal);
					var translate = document.createAttribute("transform");
					translate.nodeValue = "translate("+(translateVal + translateOldVal) +")";
					elementWTChange.setAttributeNode(translate);
					if(collArray.length > 0)
						drawBar(elementWTChange,((translateVal + translateOldVal) /200 ));
					
					z++;
					elementWTChangeOld = elementWTChange;
				}
				//console.log("el==" + elementsWalkThrough);
				
			
			if(deleteFlag){
				if(waitFlag){
					//console.log("delete");
					//collArray.splice((collArray.length -1),1);
					deletFlag = false;
					watiFlag = false;
				}
				else{waitFlag = true;}
			}			
			parentCount++;
		}else{
			deleteFlag = true;
		}
		
		
		//am ende werden auch alle übersprungen
		if (elements.length > 1){
			var flag=false;
			while(i == (elements.length-1) && parentElements[parentCount] != null){
				var clone = document.createAttribute("transform");
				clone.nodeValue = "translate("+(translateVal) +")";
				//console.log(elementsPadCount);
				if(flag||(parentElements[parentCount] != parentElements[parentCount -1])){
					parentElements[parentCount].parentNode.setAttributeNode(clone);
					flag=true;
					//console.log(parentElements[parentCount].parentNode)
				}
				else{
					parentElements[parentCount].setAttributeNode(clone);
				}
				parentCount++;
			}
			//console.log(parentElements[parentCount]);	
		}
	
	}
	
}

function generateBar(node, x, y) {
	var bar = document.createElementNS("http://www.w3.org/2000/svg","use");
	
	var bar_x = document.createAttribute("x");
	var bar_y = document.createAttribute("y");
	var href = document.createAttributeNS("http://www.w3.org/1999/xlink","xlink:href");
	 
	bar_x.nodeValue = parseInt(x);
	bar_y.nodeValue = parseInt(y);
	href.nodeValue = "#svgBalken";
	 
	bar.setAttributeNode(bar_x);
	bar.setAttributeNode(bar_y);
	bar.setAttributeNodeNS(href);
	
	node.appendChild(bar);
}

function drawBar(parent, count) {
	var x;
	var y;
	var bar;
	parent = parent.parentNode;
	
	//get first Element with balken and then the x and y values
	for(var a = 0; a < parent.childNodes.length; a++) {
		var thisElem = parent.childNodes[a];
		if (thisElem.classList && thisElem.classList.toString() == "balken") {
			bar = thisElem;
			x = parseInt(bar.getAttribute("x"));
			y = parseInt(bar.getAttribute("y"));
			break;
		}
	}
	
	//draw the new bars
	for(var i = (count*2); i >= -1; i--) {
		generateBar(parent,x+(i*100),y);
	}
}

function center(elements){
//Zentrierung der Parents
}
function parseFile() {
	var maxLev = getMaxLevel();
	for(var i = maxLev; i >= 2 ; i--) {
		var elements = getElementsByClassName("level_"+i);
		var parentElements = getElementsByClassName("parent_"+(i-1));
		checkColl(elements,parentElements);
	}
	for(var i = 0; i < maxLev ; i++) {
		var elements = getElementsByClassName("level_"+i);
		center(elements);
	}
	maxLev = maxLev * 100 +100;
	var svg = document.getElementById("begin")
	var height = document.createAttribute("height");
	height.nodeValue = (maxLev);
	//console.log(height);
	//console.log(svg);
	svg.parentNode.setAttributeNode(height);
}

window.onload = function() {parseFile();}
