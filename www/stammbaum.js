/**
 * @author wisbada team
 *
 */

/** Die Klasse Person stellt einen Knoten im Stammbaum dar und
 * bietet Methoden an, um die Person zu bearbeiten.
 */
Ext.define('Person', {
	firstname: "",
	lastname: "",
	mother: null,
	father: null,
	isCollapsed: false,
	self: this,
	children: [],
	constructor: function(vname,nname) {
		this.firstname = vname;
		this.lastname = nname;
		this.container = Ext.create('Ext.Component', {
			renderTo: Ext.get('board'),
			hidden: true,
			width: 200,
			height: 60,
			shadow: true,
			cls: 'container',
			html : '<img src="img/person.png" width="40" height="40" />'+
			'<span>'+ this.displayName() +'</span>',
			floating: true
		});
		this.container.sequenceFx(); // queue the animations; run only one at a time
		this.container.getEl().on('click', function () {
			setRootPerson(this, null);
		}, this);
		this.container.getEl().on('mouseenter', this.expand, this );
		this.container.getEl().on('mouseleave', this.collapse, this );
		this.container.getEl().child('img').setVisibilityMode( Ext.core.Element.OFFSETS );
		this.center();
		this.collapse();
	},
	collapse: function(anim) {
		if (this == rootPerson){
			// don't collapse the root instead show the edit tools
			return;
		}
		if (anim == null) anim = true;
		this.container.getEl().child('img').hide();
		this.container.getEl().setWidth(50, anim);	
		this.isCollapsed = true;
	},
	expand: function(anim) {
		if (this == rootPerson && !this.isCollapsed){
			// don't collapse the root instead hide the edit tools
			return;
		}
		if (anim == null) anim = true;
		this.container.getEl().setWidth(200, anim);
		this.container.getEl().child('img').show();
		this.isCollapsed = false;
	},
	container: null,
	/** Centers the container and returns the new position */
	center: function(anim) { 
		pos = { "x" : (Ext.get('board').getWidth()/2),
				"y" : (Ext.get('board').getHeight()/2) + (this.dimension().height) };
		this.move(pos.x,pos.y,anim);
		return pos;
	},
	move: function(x,y, anim) {
		if (anim == null) anim = {duration: 1000};
		this.container.getEl().moveTo(x,y, anim);
	},
	hide: function(anim) {
		if (anim == null) anim = {duration: 1000};
		this.container.hide(anim);
	},
	show: function(anim) {
		if (anim == null) anim = {duration: 1000};
		this.container.show(anim);
	},
	displayName: function() {
		return this.firstname + ', ' + this.lastname
	},
	position : function() {
		return {
			"x" : this.container.getEl().getX(),
			"y" : this.container.getEl().getY()
		};
	},
	dimension: function() {
		return {
			"width" : this.isCollapsed?50:200,
			"height" : this.container.getEl().getHeight()
		}
	},
	setFather: function (f) {
		this.father = f;
		f.children.push(this);
		this.alignRelatives('up');
	},
	setMother: function (m) {
		this.mother = m;
		m.children.push(this);
		this.alignRelatives('up');
	},
	appendChild: function(c) {
		this.children.insert(c);
		this.alignRelatives('down');
	},
	hideRelatives: function(upOrDown) {
		this.hide();
		if (upOrDown == null || upOrDown == 'up') {
			if (this.mother != null) this.mother.hideRelatives('up');
			if (this.father != null) this.father.hideRelatives('up');
		}
		if (upOrDown == null || upOrDown == 'down') {
			Ext.Array.each( this.children, function(c) {
				c.hideRelatives('down');
			});
		}
	},
	showRelatives: function(upOrDown) {
		this.show();
		if (upOrDown == null || upOrDown == 'up') {
			if (this.mother != null) this.mother.showRelatives('up');
			if (this.father != null) this.father.showRelatives('up');
		}
		if (upOrDown == null || upOrDown == 'down') {
			Ext.Array.each( this.children, function(c) {
				c.showRelatives('down');
			});
		};
		return this;
	},
	alignRelatives: function(referencePerson, x,y, listOfMovedPersons) {
		if (listOfMovedPersons == null) listOfMovedPersons = [];
		if (Ext.Array.contains(listOfMovedPersons, this)) return;
		listOfMovedPersons.push(this);
		if (this == rootPerson)
		{
			var pos = this.center(); // be the center
			if (this.father != null) this.father.alignRelatives(this, pos.x , pos.y-80, listOfMovedPersons);
			if (this.mother != null) this.mother.alignRelatives(this, pos.x+this.dimension().width-50, 
				pos.y-80, listOfMovedPersons);
			Ext.Array.each( this.children, function(c, index) {
				c.alignRelatives(this, this.position().x - index*( c.dimension().width + 10), pos.y+80, listOfMovedPersons);
			}, this);
		}
		else // align this person acording to 
		{
			this.move(x,y);
			// todo: start the recursion
		}
		return this;
	}
});

function setRootPerson(p) {
	if (rootPerson == p) return; // Nothing to do...
	if (rootPerson != null)
	{
		var tmp = rootPerson;
		rootPerson = null;
		tmp.container.removeCls('rootperson');
		tmp.collapse();
		//tmp.hideRelatives();
	}
	rootPerson = p;
	console.log("new root person: " + rootPerson.displayName());
	
	p.expand();
	p.container.addCls('rootperson');
	p.show();
	//p.alignRelatives();
}