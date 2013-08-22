// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine

/*
aie_textsound.js - AIE module provides the Text and sound features
*/

var AIE = AIE || {};

AIE.TextSound = {
	/*Main launch function*/
	launchTextandSound: function () {
		$(".aie-audio-text-rw").each(function(i){
			//Initialize a object to handle a single audio text div on the page
			var textsound = new AIE.TextSound.AudioText($(this), i);
			textsound.init();
		});
	}

	
	 
};

/*Class to handle a single audio text element on a page
	handles the play, pause, stop events
	handles the line click play event
	handles the line highlighting based on audio timeline
*/
AIE.TextSound.AudioText = function (pObj, ctr) {
	this.parent = pObj;
	this.index_map = {};
	this.parentID = "";
	this.textsoundInstructions = [];
	this.audioPlayer = {};
	this.counter = 0;
	this.sequenceMode = false;
	this.span_id = "";
	this.startTime = 0;
	this.endTime = 0;
	this.sub_title = "";
	this.loadTimerId = "";
	
	this.init = function() {
		//Set a id to the parent audio div if it does not have one already
		var tID = $(this.parent).attr('id');
		if (!tID) {
			tID = "aie_paud" + ctr;
			$(this.parent).attr('id', tID);
		}
		this.parentID = tID
		this.textsoundInstructions = this.loadAudioInstructions();
		this.generateIDforAudioSpan();
		//make sure there are audio instructions 
		if (this.textsoundInstructions.length > 0) {
			this.audioPlayer = $('.audioPlayer', this.parent).get(0);
			this.audioPlayer.load();
			this.setupLineClick();
			this.setupPlayEvent();
			this.setupStopEvent();
			this.setupTimeUpdate();
			this.setAudioInstructions(this.counter);
			
		}
	};
	
	/*Event handler for timeupdate.
	 This must be called only once
	*/
    this.setupTimeUpdate = function(ctr){
		var self = this;
		$(self.audioPlayer).bind('timeupdate',function(event){
			var curr_time = self.audioPlayer.currentTime;
			self.processTimeUpdate(ctr, curr_time);
		});
	};
	
	this.processTimeUpdate = function (ctr, currentTime){
		var self = this;
		if (self.sequenceMode == true) {	
			if(currentTime <= self.endTime) {
				$('.sub-title', self.parent).html(self.sub_title);
			} else {
				//switch to next line
				self.counter = self.counter + 1;
				//Stop if we have run out of instructions
				if(self.counter >= self.textsoundInstructions.length) {
					self.sub_title = "";
					self.removeHilitement();
					self.stopStoryLine();
					return;
				}
				//Load the start, end time, subtitle, spanid
				self.setAudioInstructions(self.counter);
				//hilite the current line
				self.setHighlightByID(self.span_id);
			}
		} else {
			if(currentTime > self.endTime) {
				self.audioPlayer.pause();
				self.setToggle($(self.parent).find('.buttons-rw >.play'), 'Play');
			}
		}
	};
	
	/*Event handler for the stop button. */
  	this.setupStopEvent = function(){
		var self = this;
		var isiPad = navigator.userAgent.match(/iPad/i) != null;
		
		if (isiPad == false) {
			$(self.parent).find('.buttons-rw >.stop').click(function(){
				self.sequenceMode = false;
				self.setToggle($(self.parent).find('.buttons-rw >.play'), 'Play');
				self.stopStoryLine();
				self.removeHilitement();
				//Set the hilite back on first line
				self.span_id = "";
				self.setHighlightByID(self.span_id);
			});
		} else {
			$(self.parent).find('.buttons-rw >.stop').live("touchend", function(e){
				self.sequenceMode = false;
				self.setToggle($(self.parent).find('.buttons-rw >.play'), 'Play');
				self.stopStoryLine();
				self.removeHilitement();
				//Set the hilite back on first line
				self.span_id = "";
				self.setHighlightByID(self.span_id);
			});
		}
	},
	
	/* Event handler for Play button*/
	this.setupPlayEvent = function(){
		var self = this;
		var isiPad = navigator.userAgent.match(/iPad/i) != null;
		
		if (isiPad == false) {
			$(self.parent).find('.buttons-rw >.play').click(function(){
				//If current state is not playing
				if ($(this).hasClass("playing") == false) {
					self.sequenceMode = true;
					self.setAudioInstructions(self.counter);
					self.setHighlightByID(self.span_id);
					//Using play function of audio directly here to get audio to 
					//continue playing from current position
					if ((self.counter == 0) && (self.startTime > 0)){
						//This is a spl case where the audio does not start from time pos 0
						self.audioPlayer.play();
						//we need to do settimeout as audioPlayer.currentTime is not accessible
						//until audio has started playing
						setTimeout(function(){
							try {
							self.audioPlayer.pause();
							self.audioPlayer.currentTime = self.startTime;
							self.audioPlayer.play();
							} catch(e){
								self.setToggle($(this),'Play');
							}
						}, 15);
					} else {
						self.audioPlayer.play();
					}
					self.setToggle($(this),'Pause');
				} else {
					//Pause option
					self.setAudioInstructions(self.counter);
					//Set the button state
					self.setToggle($(this),'Play');
					//Pause the player at the current state
					self.audioPlayer.pause();
				}
			});
		} else {
			$(self.parent).find('.buttons-rw >.play').live("touchend", function(e){
				
				//If current state is not playing
				if ($(this).hasClass("playing") == false) {
					self.sequenceMode = true;
					self.setAudioInstructions(self.counter);
					self.setHighlightByID(self.span_id);
					//Using play function of audio directly here to get audio to 
					//continue playing from current position
					if ((self.counter == 0) && (self.startTime > 0)){
						//This is a spl case where the audio does not start from time pos 0
						self.audioPlayer.play();
						//we need to do settimeout as audioPlayer.currentTime is not accessible
						//until audio has started playing
						var currbut = $(this);
						setTimeout(function(){
							try {
								self.audioPlayer.pause();
								self.audioPlayer.currentTime = self.startTime;
								self.audioPlayer.play();
							} catch(e){
								self.setToggle($(currbut),'Play');
								console.log("Cannot set the currentTime");
							}
						}, 5);
					} else {
						self.audioPlayer.play();
					}
					self.setToggle($(this),'Pause');
					return false;
				} else {
					//Pause option
					self.setAudioInstructions(self.counter);
					//Set the button state
					self.setToggle($(this),'Play');
					//Pause the player at the current state
					self.audioPlayer.pause();
					return false;
				}
			});
		}
	 
	};
	
	/*Event handler for line click*/
	this.setupLineClick = function(){
		var self = this;
		var isiPad = navigator.userAgent.match(/iPad/i) != null;
		
		if (isiPad == false) {
			$('p > span.audio, .aie-textsound-temp', self.parent).click(function(){
				//Get the id of the current span and get the index number for audio 
				//instruction from the index_map
				self.counter = self.index_map[$(this).attr("id")];	
				self.span_id = $(this).attr("id");
				//17:23 29-02-2012 - Commented the following line to allow
				//audio to keep playing or stop based on status of play button
				//self.sequenceMode = false;
				//Set the current start and end time
				self.setAudioInstructions(self.counter);
				$('.sub-title', self.parent).html(self.sub_title)
				//Hilite the line being displayed
				self.setHighlightByID(self.span_id);
				//Set the button state to pause
				self.setToggle($(self.parent).find('.buttons-rw >.play'), 'Pause');
				//Play the clicked line
				self.playStoryLine(self.startTime);
			});
		} else {
			$('p > span.audio, .aie-textsound-temp', self.parent).live("touchend", function(e){
				//Get the id of the current span and get the index number for audio 
				//instruction from the index_map
				self.counter = self.index_map[$(this).attr("id")];	
				self.span_id = $(this).attr("id");
				//17:23 29-02-2012 - Commented the following line to allow
				//audio to keep playing or stop based on status of play button
				//self.sequenceMode = false;
				//Set the current start and end time
				self.setAudioInstructions(self.counter);
				$('.sub-title', self.parent).html(self.sub_title)
				//Hilite the line being displayed
				self.setHighlightByID(self.span_id);
				//Set the button state to pause
				self.setToggle($(self.parent).find('.buttons-rw >.play'), 'Pause');
				//Play the clicked line
				self.playStoryLine(self.startTime);
			});
		}
	},
	
	this.audioReady = function(self){
		try {
			if (self.audioPlayer.readyState > 3) {
				if (self.loadTimerId) clearTimeout(self.loadTimerId);
				self.audioPlayer.currentTime = self.startTime;
				self.audioPlayer.play();
			} else {
				self.loadTimerId = setTimeout(function(){
					self.audioReady(self);
				}, 250);
			}
		} catch(e) {
			console.log(e.message);
		}
    }
    

	
	/*Starts playing the audio from a certain point*/
	this.playStoryLine = function(start_time){
		try {
			this.audioPlayer.currentTime = start_time;
			this.audioPlayer.play();
		} catch(e) {
			console.log(e.message);
			this.audioPlayer.load();
			this.audioReady(this);
		}
	};
	
	/*Set the start and end time of story line*/
	this.setAudioInstructions = function(ctr){
		this.startTime =  this.getAudioInstruction(ctr,0);
		this.endTime = this.getAudioInstruction(ctr,1);
		this.sub_title = this.getAudioInstruction(ctr,2);
		this.span_id = this.getAudioInstruction(ctr,3);
	};
	
	/*Return the storyline instruction of current line*/
	this.getAudioInstruction = function (counter, timeIndex) {
		return this.textsoundInstructions[counter][timeIndex];
	},
	
	this.removeHilitement = function(){
		$(this.parent).find('.correct').removeClass('correct');
	},
	
	this.setHighlightByID = function(spanid){
		if (spanid) {
			this.removeHilitement();
			$('#'+spanid).addClass('correct');
			
		}
	},
	
	/*Stop playing the audio, set toggle state of button*/
	this.stopStoryLine  = function ()	{	
		try {
			this.audioPlayer.pause();
			this.audioPlayer.currentTime = 0;
			this.counter = 0;
			this.setToggle($('.buttons-rw >.play', this.parent), 'Play');
			this.setAudioInstructions(this.counter);
			this.audioPlayer.currentTime = this.startTime;
		} catch(e) {
			console.log(e.message);
		}
	};
	
	/*Update the play button text and state*/
	this.setToggle = function (elem , play_status) {
		$(elem).text(play_status);
		if(play_status == 'Play') $(elem).removeClass('playing');
		else if(play_status == 'Pause') $(elem).addClass('playing');
	},	
	
	this.generateIDforAudioSpan = function(){
		var self = this;
		$(self.parent).find('.audio').each(function(index){
			$(this).attr("id", self.parentID + "_aud_" + index);
			$(this).addClass("aie-textsound-temp");
		});
	};
	
	this.loadAudioInstructions = function(){	
		try {
			var preContent = $(this.parent).find('pre').text();
			var arr_list = new Array();
			var splitContent = new Array();
			//Evaluate the instructions for subtitles
			if (preContent.indexOf("'")>0) {
				preContent = preContent.split("'")
				for (var i = 0; i < preContent.length; i = i + 2) {
					var tArray = new Array();
					tArray[0] = preContent[i]
					tArray[1] = preContent[i + 1]
					arr_list.push(tArray);
				}
			} else {
				//No subtitles
				preContent = jQuery.trim(preContent);
				preContent = preContent.split("\n");
				for (var i = 0; i < preContent.length; i = i + 1) {
					var tArray = new Array();
					tArray[0] = preContent[i];
					tArray[1] = preContent[i];
					arr_list.push(tArray);
				}
			}
			
			for (var i = 0; i < arr_list.length; i++) {
				var string1 = arr_list[i][0];
				var string2 = arr_list[i][1];
				var tArray = new Array();
				string1  = jQuery.trim(arr_list[i][0]);
				if (string1.split(' ')[0] != '') {
					splititems = string1.split(' ');
					if (splititems[0][0] === "#") {
						tArray[0]  = parseFloat(string1.split(' ')[1]);
						tArray[1]  = parseFloat(string1.split(' ')[2]);
						tArray[2]  = arr_list[i][1];
						tArray[3]  = splititems[0].replace("#", "");
						$("#" + tArray[3]).addClass("aie-textsound-temp");
					} else {
						tArray[0]  = parseFloat(string1.split(' ')[0]);
						tArray[1]  = parseFloat(string1.split(' ')[1]);
						tArray[2]  = arr_list[i][1];
						tArray[3]  = this.parentID + "_aud_" + i;
					}
					splitContent.push(tArray);
					//map the audio id to the index in array.
					//This will help us to locate the instruction when span is clicked
					this.index_map[tArray[3]] = i;
				}
			}
			return splitContent;
		} catch (e) {
			return [];
		}
	};
}

$(document).ready(function() {
	 	
	AIE.TextSound.launchTextandSound();
	
});
