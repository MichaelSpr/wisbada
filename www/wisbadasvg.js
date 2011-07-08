function getElementsByClassName(string) {
	//noch nicht IE8
	var elements = document.getElementById("begin").getElementsByTagName("*"); 
	var elementArray = new Array();
	for (var i = 0; i <  elements.length; i++) {
		var thisElem = elements[i];
		if (thisElem.classList && thisElem.classList.toString() == string) {
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
		}
	}
	
	return maxLevel;
}

function checkColl(elements) {
	var collArray = new Array();
	var parent;
	for(var i = 0; i < elements.length; i++) {
		//get x value out of the transform attribute of the g.person
		var value1 = parseInt(elements[i].getElementsByTagName("g")[0].getAttribute("transform").match(/translate\((.*),.*\)/)[1]);
		
		
		//detect collision
		for(var a= 0; a < elements.length; a++) {
			
			if (i == a)
				continue;
				
			var value2 = parseInt(elements[a].getElementsByTagName("g")[0].getAttribute("transform").match(/translate\((.*),.*\)/)[1]);
			
			if(value1 == value2) {
				var isin = false;
				for( var b = 0; b < collArray.length; b++) {
					if(collArray[b] == value1)
						isin = true;
				}
				
				if(!isin)
					collArray[collArray.length] = value1;
			}
		}
		
		if(parent != elements[i].parentNode.parentNode) {
			parent = elements[i].parentNode.parentNode;
			
			var transform = document.createAttribute("transform");
			transform.nodeValue = "translate("+(200 * collArray.length) +")";
			parent.setAttributeNode(transform);
			
			if(collArray.length > 0)
				drawBar(parent,collArray.length);
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

function parseFile() {
	for(var i = getMaxLevel(); i >= 0 ; i--) {
		var elements = getElementsByClassName("level_"+i);
		checkColl(elements);
	}
}

window.onload = function() {parseFile();}

