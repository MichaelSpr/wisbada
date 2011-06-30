/**
 * @author wisbada team
 *
 */

/**
 * init namespace "Stammbaum"
 */
 
var STAMMBAUM = {};
STAMMBAUM.view = {};

/**
 * init namespace "Stammbaum"
 */
STAMMBAUM.view.width = 150;
STAMMBAUM.view.init = function(elem) {
	STAMMBAUM.view.set_width(elem);
}
STAMMBAUM.view.set_width = function(elem) {
	var width = 0;

	var lis = elem.children("li");
						
	
	for(var i=0; i<lis.length; i++) {
		var li = jQuery(lis[i]); var li_width = 0; var ul_width = 0;

		/* get width of nested lists (recursive) */
		var uls = li.children("ul");
		if(uls.length > 0) {
			ul_width = STAMMBAUM.view.set_width( jQuery(uls[0]) );
		}
		
		/* get width of li element */
		li_width += STAMMBAUM.view.width;
		if(  li.hasClass("paar") ) {
			li_width += STAMMBAUM.view.width;
		}
		
		width += Math.max(li_width, ul_width);
	}
	
	elem.css("width", width + "px");
	return width;
}

/** Die Klasse Person stellt einen Knoten im Stammbaum dar und
 * bietet Methoden an, um die Person zu bearbeiten.
 */
function Person(vname, nname) {
	this.firstname = vname;
	this.lastname = nname;
	this.container = $('<div class="person"><img src="img/person.png" width="40" height="40" />'+
	'<span>'+ this.displayName() +'</span></div>').appendTo('#board');

	this.container.click( {"self": this} , function(e) {
		setRootPerson(e.data.self);
	} );
	this.container.mouseenter( this.expand );
	this.container.mouseleave( this.collapse );
	this.center(0);
	this.collapse();
};
Person.prototype.firstname = "";
Person.prototype.lastname = "";
Person.prototype.mother = null;
Person.prototype.father = null;
Person.prototype.isCollapsed = false;
Person.prototype.self = this;
Person.prototype.children = [];
Person.prototype.container = null;


Person.prototype.collapse = function() {
	if(this == rootPerson) {
		// don't collapse the root instead show the edit tools
		return;
	}
	this.container.children('img').hide();
	this.container.width(50);
	this.isCollapsed = true;
};
Person.prototype.expand = function() {
	if(this == rootPerson && !this.isCollapsed) {
		// don't collapse the root instead hide the edit tools
		return;
	}
	this.container.width(200);
	this.container.children('img').show();
	this.isCollapsed = false;
};
/** Centers the person and returns the new position */
Person.prototype.center = function(anim) {
	pos = {
		"x" : ($('#board').innerWidth() / 2) - (this.dimension().width),
		"y" : ($('#board').innerHeight() / 2) - (this.dimension().height /2)
	};
	this.move(pos.x , pos.y, anim);
	return pos;
};
Person.prototype.move = function(x, y, anim) {
	if(anim == null)
		anim = 1000;
	this.container.animate({ left: x, top: y}, anim);
};
Person.prototype.hide = function() {
	this.container.hide();
};
Person.prototype.show = function() {
	this.container.show();
};
Person.prototype.displayName = function() {
	return this.firstname + ', ' + this.lastname
};
Person.prototype.position = function() {
	return this.container.position();
};
Person.prototype.dimension = function() {
	return {
		"width" : this.container.width(),
		"height" : this.container.height()
	}
};
Person.prototype.setFather = function(f) {
	this.father = f;
	f.children.push(this);
	//this.alignRelatives('up');
};
Person.prototype.setMother = function(m) {
	this.mother = m;
	m.children.push(this);
	//this.alignRelatives('up');
};
Person.prototype.appendChild = function(c) {
	this.children.insert(c);
	this.alignRelatives('down');
};
Person.prototype.hideRelatives = function(upOrDown) {
	this.hide();
	if(upOrDown == null || upOrDown == 'up') {
		if(this.mother != null)
			this.mother.hideRelatives('up');
		if(this.father != null)
			this.father.hideRelatives('up');
	}
	if(upOrDown == null || upOrDown == 'down') {
		$.each(this.children, function(c) {
			c.hideRelatives('down');
		});
	}
};
Person.prototype.showRelatives = function(upOrDown) {
	this.show();
	if(upOrDown == null || upOrDown == 'up') {
		if(this.mother != null)
			this.mother.showRelatives('up');
		if(this.father != null)
			this.father.showRelatives('up');
	}
	if(upOrDown == null || upOrDown == 'down') {
		$.each(this.children, function(c) {
			c.showRelatives('down');
		});
	};
	return this;
};
Person.prototype.alignRelatives = function(referencePerson, x, y, listOfMovedPersons) {
	if(listOfMovedPersons == null)
		listOfMovedPersons = [];
	if($.contains(listOfMovedPersons, this))
		return;
	listOfMovedPersons.push(this);
	if(this == rootPerson) {
		var pos = this.center();
		// be the center
		if(this.father != null)
			this.father.alignRelatives(this, pos.x, pos.y - 80, listOfMovedPersons);
		if(this.mother != null)
			this.mother.alignRelatives(this, pos.x + this.dimension().width - 50, pos.y - 80, listOfMovedPersons);
		$.each(this.children, function(c, index) {
			c.alignRelatives(this, this.position().x - index * (c.dimension().width + 10), pos.y + 80, listOfMovedPersons);
		}, this);
	} else // align this person acording to
	{
		this.move(x, y);
		// todo: start the recursion
	}
	return this;
};
function setRootPerson(p) {
	if(rootPerson == p)
		return;
	// Nothing to do...
	if(rootPerson != null) {
		var tmp = rootPerson;
		rootPerson = null;
		tmp.container.removeClass('rootperson');
		tmp.collapse();
		//tmp.hideRelatives();
	}
	rootPerson = p;
	console.log("new root person: " + rootPerson.displayName());
	rootPerson.show();

	p.container.addClass('rootperson');
	p.expand();
	p.show();
}