// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine

/*
aie_storyline.js - AIE module for Storyline
*/

var AIE = AIE || {};

AIE.Storyline = {
	storylineobj: {},
	storylinestarted: false,
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
			if (l_storyline.length < 3) {
				return [false, {}];
			}
			
			var storyobj = new Object(); 
			storyobj["type"] = "normal"; 
			if (l_storyline[2] == AIE.AUDIO) {
				storyobj["type"] = AIE.AUDIO;
				storyobj["startsafter"] = parseInt(l_storyline[0]) + incr_count;
				storyobj["elid"] = "#" + l_storyline[1];
				storyobj["duration"] = 0;
				storyobj["properties"] = {};
				storyobj["command"] = l_storyline[3];
			} else {
				//create a storyline object
				storyobj["startsafter"] = parseInt(l_storyline[0]) + incr_count;
				storyobj["elid"] = "#" + l_storyline[1];
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
						AIE.Storyline.startStoryline(AIE.Storyline.storylineobj);
						$(storylineobj["launch"]).hide();
					});
			}
		} else {
			this.startStoryline(storylineobj);
		}
	},
	
	startStoryline: function (storyline) {
		
		if (AIE.Storyline.storylinestarted) {
			//this is to make sure that story line can be launched only once
			return;
		}
		
		AIE.Storyline.storylinestarted = true;
		//Iterate and setup the timeout for each event
		for (i in storyline) {
			var obj = storyline[i];
			var key = obj['elid'];
			if (obj["type"]  == AIE.AUDIO) {
				setTimeout(AIE.Storyline.handleStorylineAudio,obj['startsafter'], [key, obj]);
			} else {
				setTimeout(AIE.Storyline.handleStorylineAnimate,obj['startsafter'], [key, obj]);
			}
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
	
	//actual function that is called for animation
	handleStorylineAnimate: function (param){
		$(param[0]).animate(param[1]['properties'],  param[1]['duration'], 'linear', function(){});
	}
}; 

//Load the storyline on start
$(document).ready(function() {
	//load the story line 
	var storyline = AIE.Storyline.loadStoryline();
	
	AIE.Storyline.setupStartStoryLine(storyline);
});

