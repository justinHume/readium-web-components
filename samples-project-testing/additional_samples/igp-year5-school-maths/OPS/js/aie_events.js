// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine


var AIE = AIE || {};

AIE.AUDIO = "AUDIO";

AIE.Events = {
	storylineobj: {},
	storylinestarted: false,
	eventBodyMap: {},
	resetStyleMap: {},
	spriteMap: {},
	self: this,
	navMap: {},
	subscribeHandle: [],
	storylineTimer: [],
	onloadevents: [],
	
	//Called by Gameutils to reset the nav to initial state
	initNavObjects: function() {
		if (this.navMap) {
			for (navName in this.navMap) {
				navobj = this.navMap[navName];
				navobj.init();
			}
		}
	},
	
	loadEvents: function() {
		/*for (var i=0; i<AIE.Events.storylineTimer; i++) {
			var timer = AIE.Events.storylineTimer[i];
			clearTimeout (timer);
		}*/
		for(var i = 0; i < AIE.Events.subscribeHandle.length; i++) {
			var handle = AIE.Events.subscribeHandle[i];
			$.unsubscribe(handle);
		}
		
		AIE.Events.storylineTimer = [];
		//Load the event declarations
		this.loadEventDeclarations();
		//load the event definitions
	},
	
	loadEventDeclarations: function() {
		var s_events = $("pre.aie-events").text();
		var cl_events = s_events.split("\n");
		
		var counter = 0;
		var incr_count = 0;
		var eventname = "";
		var eventdata = "";
		for (event in cl_events) {
			//handle empty lines
			var eventline = cl_events[event];
			
			if (eventline == "") continue;
			var ltype = this.getLineType(eventline);
			var linetype = ltype[1];
			
			switch(linetype){
				case "EVENT":
					this.publishEvent(eventline);
					break;
				case "NAV":
					this.createNavObject(eventline);
					break;
				case "SPRITE":
					this.createSpriteObject(eventline);
					break;
				case "EVENTSTART":
					eventname = ltype[2][1];
					break;
				case "EVENTEND":
					this.setupEventSubscription(eventname, eventdata);
					eventdata = "";
					eventname = "";
					break;
				default:
					if (eventname != "") eventdata = eventdata + eventline + "\n";
					break;
			}
		}
		
		//now publish the onload trigger
		for (var i=0; i < this.onloadevents.length; i++) {
			var eventinfo = this.onloadevents[i];
			var eventtopic = eventinfo[0];
			var eventselector = eventinfo[1];
			$.publish(eventtopic, [eventselector]);
		}
	},
	
	createSpriteObject: function (spritedef) {
		try {
			var l_spritedef = spritedef.split(" ");
			var spritename = l_spritedef[1];
			var sprite_elid = l_spritedef[2];
			var sprite_imgdim = l_spritedef[3];
			var sprite_boxdim = l_spritedef[4];
			var sprite_steps = l_spritedef[5];
			var sprite_fps = l_spritedef[6];
			
			if (sprite_elid[0] != ".") sprite_elid = "#" + sprite_elid;
			
			var spriteobj = new AIE.Sprite(spritename, sprite_elid, sprite_imgdim, sprite_boxdim, sprite_steps, sprite_fps);
			this.spriteMap[spritename] = spriteobj;
			spriteobj.hello();
			
		} catch (e) {
			console.log("Exception in CreateSpriteobject ", e);
		}		
	},
	
	createNavObject: function(navdecl) {
		var l_navdecl = navdecl.split(" ");
		
		var navName = l_navdecl[1];
		var s_spine = l_navdecl[2];
		
		var spine = s_spine.split(",");
		
		var navobj = new AIE.Navobj(navName, spine);
		navobj.init();
		this.navMap[navName] = navobj;
	},
	
	publishEvent: function(eventdecl) {
		var l_evtdecl = eventdecl.split(" ");
		var eventtopic = l_evtdecl[1];
		var eventtarget = l_evtdecl[2];
		var eventtrigger = l_evtdecl[3];
		
		var l_eventtarget = eventtarget.split("=");
		if (l_eventtarget.length == 2){
			var selector = "";
			if (l_eventtarget[0] == "id") {
				selector = "#";
			} else if (l_eventtarget[0] == "class") {
				selector = ".";
			}
			selector = selector + l_eventtarget[1];
			
			if (eventtrigger == "ONLOAD") {
				this.onloadevents.push([eventtopic, selector]);
			} else {
				$(selector).bind(eventtrigger, function(){
					$.publish(eventtopic, [selector]);
				});
			}
		} 
	},
	
	setupEventSubscription: function(eventname, eventbody) {
		var self = this;
		this.setupEventBody(eventname, eventbody);
		var handle = $.subscribe(eventname, function(eventbody) {
			self.setupStartStoryLine(self.eventBodyMap[eventname]);
		});
		this.subscribeHandle.push(handle);
	},
	
	setupEventBody: function(eventname, eventbody) {
		var eventobj = new Object(); 
		var cl_eventbody = eventbody.split("\n");
		var counter = 0;
		var incr_count = 0;
		for (line in cl_eventbody) {
			s_line = cl_eventbody[line].trim();
			var startline = this.checkStartInstruction(s_line);
			var isStartInstruction = startline[0];
			
			if (s_line[0] == "+") {
				s_line = s_line.replace(/\+/g,"");
				incr_count = parseInt(s_line);
				if (isNaN(incr_count))incr_count = 0;
			} else {
				//Pass the storyline string to function to get back a object
				var isSelectorID = true;
				var res = this.processStorylineEvent(s_line, incr_count);
				if (res[0] == false) continue;
				
				if (res[0]) {
					var elprop = res[1];
					//Set the object for storyline to the object
					eventobj[counter] = elprop;
					counter = counter + 1;
				}
			}
		}
		this.eventBodyMap[eventname] = eventobj;
	},
	
	getLineType: function(linedata) {
		try {
			var l_evts = linedata.split(" ");
			
			var etype = "";
			var estatus = true;
			
			if (l_evts[0] == "EVENT") {
				etype = "EVENT";
			} else if (l_evts[0] == "EVENTSTART") {
				etype = "EVENTSTART";
			} else if (l_evts[0] == "EVENTEND") {
				etype = "EVENTEND";
			} else if (l_evts[0] == "NAV") {
				etype = "NAV";
			}  else if (l_evts[0] == "SPRITE") {
				etype = "SPRITE";
			} else {
				estatus = false;
			}
			return [estatus, etype, l_evts]
		} catch (err) {
			console.log(err);
			return [false, "", []];
		}
	},
	
	/*
		function processes the storyline configuration and returns a
		obj of storyline events
		structure of obj
			{"#elid": {
					"startsafter": timeinms, //this is the time after which this object starts animating
					"elid": element id, //this is the time after which this object starts animating
					"duration": time in ms, //this is the time duration of animation
					"properties" : the animation properties
				},
			 "elid": {
			 
			 }
			}
	*/
	loadStoryline: function () {
		var storylineobj = new Object(); 
		storylineobj["start"] = "onload";
		//get the storyline content from pre tag
		var s_storyline = $("pre.timeline").text();
		//split on newline char to get each storyline config
		var cl_storyline = s_storyline.split("\n");
		
		var counter = 0;
		var incr_count = 0;
		for (line in cl_storyline) {
			
			s_line = cl_storyline[line].trim();
			var startline = this.checkStartInstruction(s_line);
			var isStartInstruction = startline[0];
			
			if (s_line[0] == "+") {
				s_line = s_line.replace(/\+/g,"");
				incr_count = parseInt(s_line);
				if (isNaN(incr_count))incr_count = 0;
			} else if (isStartInstruction){
				var startInstruction = startline[1];
				if (startInstruction == undefined) startInstruction = "onload";
				storylineobj["launch"] = startInstruction;
			} else {
				
				//Pass the storyline string to function to get back a object
				var res = this.processStorylineEvent(s_line, incr_count);
				if (res[0]) {
					//use element id as the key inside the storyline object
					var elid = "#" + res[1]["elid"];
					var elprop = res[1];
					//Set the object for storyline to the global object
					storylineobj[counter] = elprop;
					
					counter = counter + 1;
				}
			}
		}
		
		return storylineobj;
	},
	
	checkStartInstruction: function (storyline_evt) {
		try {
			var l_storyline = storyline_evt.split(" ");
			if (l_storyline.length < 2) {
				return [false, ""];
			}
			if (l_storyline[1] == "START") {
				return [true, l_storyline[2]];
			}
			return [false, ""];
		} catch (err) {
			return [false, ""];
		}
	},
	
	/*
		Processes a single storyline event and returns a object
	*/
	processStorylineEvent: function (storyline, incr_count) {
		try {
			var l_storyline = storyline.split(" ");
			if (l_storyline.length < 1) {
				return [false, {}];
			}
			//Handle the scenario where the user specifies a class name as selector
			var selector = "";
			if (l_storyline[1][0] == ".") {
				selector = l_storyline[1];
			} else {
				selector = "#" + l_storyline[1];
			}
			
			var storyobj = new Object(); 
			storyobj["type"] = "normal"; 
			if (l_storyline[2] == AIE.AUDIO) {
				storyobj["type"] = AIE.AUDIO;
				storyobj["startsafter"] = parseInt(l_storyline[0]) + incr_count;
				storyobj["elid"] = selector;
				storyobj["duration"] = 0;
				storyobj["properties"] = {};
				storyobj["command"] = l_storyline[3];
			} else if (l_storyline[2] == "COMMAND") {
				storyobj["type"] = "COMMAND";
				storyobj["startsafter"] = parseInt(l_storyline[0]) + incr_count;
				storyobj["elid"] = selector;
				storyobj["duration"] = 0;
				storyobj["command"] = l_storyline[3];
				storyobj["properties"] = l_storyline[4];
			} else if (l_storyline[2] == "NAV") {
				storyobj["type"] = "NAV";
				storyobj["startsafter"] = parseInt(l_storyline[0]) + incr_count;
				storyobj["elid"] = selector;
				storyobj["duration"] = 0;
				storyobj["navname"] = l_storyline[3];
				storyobj["navcommand"] = l_storyline[4];
			} else if (l_storyline[2] == "SPRITE") {
				storyobj["type"] = "SPRITE";
				storyobj["startsafter"] = parseInt(l_storyline[0]) + incr_count;
				storyobj["elid"] = selector;
				storyobj["duration"] = 0;
				storyobj["name"] = l_storyline[3];
				storyobj["command"] = l_storyline[4];
				storyobj["properties"] = l_storyline[5];
			} else {
				//create a storyline object
				storyobj["startsafter"] = parseInt(l_storyline[0]) + incr_count;
				storyobj["elid"] = selector;
				storyobj["duration"] = parseInt(l_storyline[2]);
				storyobj["properties"] = AIE.utils.convertPropertyStrtoObj(l_storyline[3]);
			}
			return [true, storyobj];
		} catch (err) {
			return [false, {}];
		}
	},
	
	setupStartStoryLine: function (storylineobj) {
		this.storylineobj = storylineobj;
		if (storylineobj["launch"])  {
			switch(storylineobj["launch"]) {
				case "onload":
					this.startStoryline(storylineobj);
					break;
				default:
					$(storylineobj["launch"]).click(function () {
						AIE.Events.startStoryline(AIE.Events.storylineobj);
						$(storylineobj["launch"]).hide();
					});
			}
		} else {
			this.startStoryline(storylineobj);
		}
	},
	
	startStoryline: function (storyline) {
		
		AIE.Events.storylinestarted = true;
		//Iterate and setup the timeout for each event
		
		for (i in storyline) {
			var timer = 0;
			var obj = storyline[i];
			var key = obj['elid'];
			if (obj["type"]  == AIE.AUDIO) {
				timer = setTimeout(AIE.Events.handleStorylineAudio, obj['startsafter'], [key, obj]);
			} else if (obj["type"]  == "COMMAND") {
				timer = setTimeout(AIE.Events.handleEventCommands, obj['startsafter'], [key, obj]);
			} else if (obj["type"]  == "NAV") {
				timer = setTimeout(AIE.Events.handleNavEvent, obj['startsafter'], [key, obj]);
			} else if (obj["type"]  == "SPRITE") {
				timer = setTimeout(AIE.Events.handleSpriteCommands, obj['startsafter'], [key, obj]);
			} else {
				timer = setTimeout(AIE.Events.handleStorylineAnimate, obj['startsafter'], [key, obj]);
			}
			AIE.Events.storylineTimer.push(timer);
		}
	},
	
	//Handler function for the storyline audio events
	//It expects the follow format
	//5000 a1 AUDIO play
	//5000 - Starts After
	//a1 - audio tag id
	//AUDIO - Contant to indicate that this is a audio line
	//command - play|pause|stop
	handleStorylineAudio: function (param) {
		var command = param[1]['command'];
		switch (command) {
			case 'play':
				AIE.audioutils.playAudio(param[0], 0);
				break;
			case 'pause':
				AIE.audioutils.pauseAudio(param[0]);
				break;
			case 'stop':
				AIE.audioutils.stopAudio(param[0]);
				break;
		}
		$(param[0]).animate(param[1]['properties'],  param[1]['duration'], function(){});
	},

	handleEventCommands: function (param) {
		var command = param[1]['command'];
		
		switch (command) {
			case 'TRIGGER':
				var eventname = param[1]['properties'];
				$.publish(eventname, []);
				break;
			case 'ADDCLASS':
				var classname = param[1]['properties'];
				classname = classname.replace(/^\"|\"$/g, "");
				var selector = param[0]; 
				AIE.Events.storeDefaultClass(selector);
				$(selector).addClass(classname);
				break;
			case 'REMOVECLASS':
				var classname = param[1]['properties'];
				classname = classname.replace(/^\"|\"$/g, "");
				var selector = param[0]; 
				AIE.Events.storeDefaultClass(selector);
				$(selector).removeClass(classname);
				break;
			case 'TOGGLECLASS':
				var classname = param[1]['properties'];
				classname = classname.replace(/^\"|\"$/g, "");
				var selector = param[0]; 
				AIE.Events.storeDefaultClass(selector);
				$(selector).toggleClass(classname);
				break;
			case 'SHOW':
				var selector = param[0]; 
				$(selector).show();
				break;
			case 'HIDE':
				var selector = param[0]; 
				$(selector).hide();
				break;
			case 'RESET':
				var selector = param[0]; 
				AIE.Events.setDefaultStyle(selector);
				break;
			case 'RESETALL':
				AIE.Events.resetAllStylestoDefault("");
				break;
			case 'INCREMENT':
				var selector = param[0]; 
				var stepvalue = param[1]['properties'];
				AIE.Events.incrementValue(selector, stepvalue);
				break;
			case 'DECREMENT':
				var selector = param[0]; 
				var stepvalue = param[1]['properties'];
				AIE.Events.decrementValue(selector, stepvalue);
				break;
			case 'BROWSETO':
				var selector = param[0]; 
				var targetloc = param[1]['properties'];
				targetloc = targetloc.replace(/^\"|\"$/g, "");
				window.location = targetloc;
				break;
			case 'SETCONTENT':
				var selector = param[0]; 
				var content = param[1]['properties'];
				AIE.Events.setContent(selector, content);
				break;
		}
	},
	
	setContent: function (selector, content) {
		$(selector).text(content);
	},
	
	//actual function that is called for animation
	handleStorylineAnimate: function (param){
		AIE.Events.storeDefaultProperty(param[0], param[1]['properties']);
		$(param[0]).animate(param[1]['properties'],  param[1]['duration'], 'linear', function(){});
	},
	
	storeDefaultProperty: function(selector, properties) {
		if (this.resetStyleMap[selector]) {

		} else {
			this.resetStyleMap[selector] = {"default_properties":{}, "default_class": "~NC~"}
		}
		
		for (prop in properties) {
			if (prop && properties[prop]) {
				//Make sure that we do not overwrite a existing default value
				if (this.resetStyleMap[selector]["default_properties"].hasOwnProperty(prop) == false) {
					this.resetStyleMap[selector]["default_properties"][prop] = $(selector).css(prop);
				}
			}
		}
	},
	
	storeDefaultClass: function(selector) {
		if (this.resetStyleMap.hasOwnProperty(selector) == false) {
			this.resetStyleMap[selector] = {"default_properties":{}, "default_class": "~NC~"}
		}
		
		if (this.resetStyleMap[selector]["default_class"] == "~NC~") {
			this.resetStyleMap[selector]["default_class"] = $(selector).attr("class");	
		}
	},
	
	resetAllStylestoDefault: function() {
		for (selector in this.resetStyleMap) {
			AIE.Events.setDefaultStyle(selector);
		}
	},
	
	setDefaultStyle: function(selector) {
		if (this.resetStyleMap.hasOwnProperty(selector)) {
			var defproperties = this.resetStyleMap[selector]["default_properties"];
			for (prop in defproperties) $(selector).css(prop, defproperties[prop]);
			
			var defclass = this.resetStyleMap[selector]["default_class"];
			if (this.resetStyleMap[selector]["default_class"] != "~NC~") {
				 $(selector).attr("class", this.resetStyleMap[selector]["default_class"]);	
			}
		}
	},
	
	incrementValue: function(selector, stepval){
		var s_currval = $(selector).text();
		currval = parseInt(s_currval);
		stepval = parseInt(stepval);
		if (isNaN(currval))currval = 0;
		currval = currval + stepval;
		$(selector).text(currval);
	},
	
	decrementValue: function(selector, stepval){
		var s_currval = $(selector).text();
		currval = parseInt(s_currval);
		stepval = parseInt(stepval);
		if (isNaN(currval))currval = 0;
		currval = currval - stepval;
		$(selector).text(currval);
	},
	
	handleNavEvent: function(param) {
		var navname = param[1]["navname"];
		if (AIE.Events.navMap.hasOwnProperty(navname)){
			var navobj = AIE.Events.navMap[navname];
			var navcommand = param[1]["navcommand"];
			navobj.runCommand(navcommand);
		} 
	},
	
	handleSpriteCommands: function(param) {
		var spritename = param[1]["name"];
		var command = param[1]["command"];
		var properties = param[1]["properties"];
		if (AIE.Events.spriteMap.hasOwnProperty(spritename)){
			var spriteobj = AIE.Events.spriteMap[spritename];
			spriteobj.runCommand(command, properties);
		}
	}
}; 

AIE.Navobj = function (navname, spine) {
	this.name = navname;
	this.spine = spine;
	this.currPage = 0;
	this.totalPages = spine.length;
	this.currSelector = ""; 
	
	this.init = function() {
		this.currPage = 0;
		this.displaySelector();
	};
	
	this.displaySelector = function() {
		if (this.currSelector) {
			$(this.currSelector).removeClass("show").addClass("hide");
			this.currSelector = "";
		}
		
		var selector = this.spine[this.currPage];
		if (selector[0] != ".") selector = "#" + selector;
		this.currSelector = selector;
		$(selector).addClass("show").removeClass("hide");
	}
	
	this.first = function() {
		this.currPage = 0;
		this.displaySelector();
	};
	
	this.previous = function() {
		this.currPage = this.currPage - 1;
		if (this.currPage < 0) this.currPage = 0;
		this.displaySelector();
	};
	
	this.next = function() {
		this.currPage = this.currPage + 1;
		if (this.currPage >= this.totalPages) this.currPage = this.totalPages-1;
		//Publish a NAV-LAST Panel message. Used for game evaluation
		if (this.currPage+1 >= this.totalPages) {
			var selector = this.spine[this.currPage];
			$.publish('NAV-LAST', [selector]);
		}
		this.displaySelector();
	};
	
	this.last = function() {
		this.currPage = this.totalPages - 1;
		this.displaySelector();
	};
	
	this.runCommand = function(command) {
		switch (command) {
			case 'FIRST':
				this.first();
				break;
			case 'PREVIOUS':
				this.previous();
				break;
			case 'NEXT':
				this.next();
				break;
			case 'LAST':
				this.last();
				break;
		}
	}
}  


AIE.Sprite = function(spritename, spritetag, spritedim, boxdim, steps, fps) {
	this.name = spritename;
	this.el = spritetag;
	this.sprite_steps = steps;
	
	this.fps = fps;
	
	this.interval = "";
	this.width = 0;
	this.height = 0;
	this.disp_width = 0;
	this.disp_height = 0;
	this.direction = "";
	
	
	//now find out if the user has used a img/bgimage for the sprite
	var imgs = $(this.el).find("img");
	if (imgs.length == 0) {
		this.origPosition =  parseInt($(this.el).css("background-position"));
		this.cssProp = "background-position";
	} else {
		this.origPosition = parseInt($(this.el).find("img").css("margin-left"));
		this.cssProp = "margin-left";
	}
	
	this.setDimensions = function(w, h) {
		this.width = parseInt(w);
		this.height = parseInt(h);
	};
	
	this.setDisplayDimensions = function(w, h) {
		this.disp_width = parseInt(w);
		this.disp_height = parseInt(h);
	};
	
	spritedim = spritedim.replace("(", "");
	spritedim = spritedim.replace(")", "");
	spritedim_l = spritedim.split(",");
	this.setDimensions(spritedim_l[0], spritedim_l[1]);
	
	
	boxdim = boxdim.replace("(", "");
	boxdim = boxdim.replace(")", "");
	boxdim_l = boxdim.split(",");
	this.setDisplayDimensions(boxdim_l[0], boxdim_l[1]);
	
	this.direction = "left";		
	if($(this.el).hasClass("sprite-left") ) {
		this.direction = "left";
	} else if($(this.el).hasClass("sprite-right") ) {
		this.direction = "right";
	}
	
	this.hello = function() {
		
	};
	
	this.stopSpriteLoop = function() {
		clearInterval(this.interval);
		this.interval = "";
		switch (this.direction) {
			case "left":
				this.setPostion(0);
				break;
			case "right":
				this.setPostion(this.origPosition);
				break;
		}
	},
	
	this.startSpriteLoop = function() {
		var step = 1;
		
		var self = this;
		
		var positionLeft = parseInt($(self.el).find("img").css("margin-left"));
		var positionRight = parseInt($(self.el).find("img").css("margin-left"));
		
		if (this.interval) {
			//we do not want to launch another timer loop if
			//sprite is already in motion
			return;
		}
		
		this.interval = setInterval(function() {
			switch (self.direction) {
				case "left":
					positionLeft = positionLeft - self.disp_width;
					if(step >= self.sprite_steps) {
						positionLeft = 0;
						step = 0;
					}
					self.setPostion(positionLeft);
					step = step + 1;
					break;
				case "right":
					positionRight = positionRight + self.disp_width;
					if(step >= self.sprite_steps) {
						positionRight = self.origPosition;
						step = 0;
					}
					self.setPostion(positionRight);
					step = step + 1;
					break;
			}
		},1000/self.fps);
	},
	
	this.setPostion = function(position) {
		if (this.cssProp != "background-position") {
			$(this.el).find("img").css(this.cssProp, position+"px");
		} else {
			$(this.el).css(this.cssProp, position+"px 0px");
		}
	}
	
	this.runCommand = function(command, value) {
		switch (command) {
			case 'START':
				this.startSpriteLoop();
				break;
			case 'STOP':
				this.stopSpriteLoop();
				break;
			case 'FPS':
				this.fps = parseInt(value);
				this.stopSpriteLoop();
				this.startSpriteLoop();
				break;
		}
	}
}

//Load the storyline on start
$(document).ready(function() {
	//load the story line 
	var storyline = AIE.Events.loadEvents();
	
});
