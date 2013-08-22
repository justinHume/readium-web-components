// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine


var AIE = AIE || {};

/*Game evaluation module
 Kicks into life if class game-evaluation present on the page. 
 Subscribes to event from Events engine and QAA 
 Calculate times, scores
 Stores best time and scores to local storage
*/
AIE.SimpleGameEvaluation = function () {
	this.lastpanel = false;
	this.evallookup = {};
	this.starttime = {};
	this.besttime_key = "AIE_GAME_BESTTIME";
	this.correctscore = "AIE_GAME_CORRECT_SCORE";
	this.wrongscore = "AIE_GAME_WRONG_SCORE";
	this.subscriptions = [];
	
	this.getBestTimeFromLocalStorage = function () {
		if (localStorage)  {
			var btime = localStorage.getItem(this.besttime_key);
			if (btime) return parseInt(btime);
		}
		return 0;
	}
	
	this.setBestTimeToLocalStorage = function (besttimems) {
		if (localStorage)  {
			localStorage.setItem(this.besttime_key, besttimems);
		}
	}

	this.getCorrectAnswer = function(panelid) {
		var correct_ans = "";
		var objs = $("#" + panelid + " > .option-source > li");
		var parent_obj = $("#" + panelid + " > .option-source");
		for (var i=1; i<=objs.length	; i++) {
			var sel = ".s" + i;
			correct_ans = correct_ans + $(sel, parent_obj).text();
		}
		return correct_ans;
	}
	
	this.padTwo = function (x) {return ((x>9)?"":"0")+x}
	
	this.calculateTimeFromMilliSec = function(totaltime) {
		var seconds = (totaltime/1000)%60;
		var minutes = (totaltime/(1000*60))%60;
		seconds = Math.floor(seconds);
		minutes = Math.floor(minutes);
		if (minutes <= 0) {
			var disp_time_short = this.padTwo(minutes)+":"+this.padTwo(seconds);
			var disp_time_desc = this.padTwo(seconds) + " seconds";
		} else {
			var disp_time_short = minutes+":"+seconds;
			var disp_time_desc = minutes + " minutes " + this.padTwo(seconds) + " seconds";
		}
		var timeinfo = {
			"totaltimems": totaltime,
			"min": minutes,
			"sec": seconds,
			"shorttime": disp_time_short,
			"desctime": disp_time_desc
		};
		return timeinfo;
	}
	
	this.handleGameEnd = function() {
		/* Show the correct panel based on results */
		var win = true;
		var wrong_answers = [];
		var wrong_answers_str = "";
		var correct_count = 0;
		var wrong_count = 0;
		
		//Now evaluate all the qaa to get the result: correctscore, wrongscore
		for (item in this.evallookup) {
			if (this.evallookup.hasOwnProperty(item)) {
				if (this.evallookup[item] == false) {
					win = false;
					var temp_ans = this.getCorrectAnswer(item);
					wrong_answers.push(temp_ans);
					wrong_answers_str = wrong_answers_str + "<span>" + temp_ans + " </span>";
					wrong_count = wrong_count + 1;
				} else {
					correct_count = correct_count + 1;
				}	
			}
		}
		
		//Publish the GAMEEND event, This is used to stop the game timer
		//See AIE.GameTimer
		$.publish("GAMEEND");
		
		//Calculate the time taken for this game
		this.endtime = new Date();
		var totaltime = this.endtime - this.starttime;
		var timeinfo = this.calculateTimeFromMilliSec (totaltime);
		
		//Handle the best time logic
		var prevBestTime = this.getBestTimeFromLocalStorage();
		if (prevBestTime == 0) {
			//Set the best time only if user managed to get every answer correct
			if (win) this.setBestTimeToLocalStorage(totaltime);
		} else if (prevBestTime < totaltime) {
			//regardless of win or loose, we still show the last best time
			timeinfo = this.calculateTimeFromMilliSec(prevBestTime);
		} else {
			//Set the best time only if user managed to get every answer correct
			if (win){ 
				this.setBestTimeToLocalStorage(totaltime);
			} else {
				//Show the last best time
				timeinfo = this.calculateTimeFromMilliSec(prevBestTime);
			}
		}
		
		//Show the panels for correct/wrong
		//Set BestTime, CorrectScore, Wrong Score
		if (win) {
			$(".panel-correct").removeClass("hide").addClass("show");
			$(".correct-score").text(correct_count);
			$(".best-time").text(timeinfo.desctime);
		} else {
			$(".panel-wrong").removeClass("hide").addClass("show");
			$(".correct-score").text(correct_count);
			$(".wrong-score").text(wrong_count);
			$(".wrong-word-list").html(wrong_answers_str);
			$(".wrong-word-list").html(wrong_answers_str);
			$(".best-time").text(timeinfo.desctime);
		}	
	}
	
	this.initGameEvents = function() {
		var self = this;
		self.lastpanel = false;
		self.evallookup = {};
		self.starttime = "";
		self.endtime = "";
		
		//This is published by the Events engine command
		//0 XX COMMAND TRIGGER GAMESTART
		var handle = $.subscribe("GAMESTART", function(panelid){
			self.starttime = new Date();
		});
		this.subscriptions.push(handle);
		
		//This is published by Navigation object
		//See AIE.Navobj::next function
		var handle = $.subscribe("NAV-LAST", function(panelid){
			self.lastpanel = true;
		});
		this.subscriptions.push(handle);
		//This is published by QAA engine
		//See $('.association-rw >.option-target >li').droppable
		var handle = $.subscribe("qaaAssociationCorrect", function(qaaid, result){
			self.evallookup[qaaid] = result;
			//We trigger the Gameend function when user is on last panel
			//And has finished the question correctly
			if (self.lastpanel) {
				self.handleGameEnd();
			}
		});
		this.subscriptions.push(handle);
		
		//This is published by QAA engine
		//See $('.association-rw >.option-target >li').droppable
		var handle = $.subscribe("qaaAssociationWrong", function(qaaid, result){
			self.evallookup[qaaid] = result;
			//We trigger the Gameend function when user is on last panel
			//And has finished the question wrongly
			if (self.lastpanel) {
				self.handleGameEnd();
			}
		});
		this.subscriptions.push(handle);
		//Called from Events engine
		var handle = $.subscribe("GAMEPLAYAGAIN", function(){
			AIE.GameTimer.resetTimer();
			self.lastpanel = false;
			self.evallookup = {};
			self.starttime = {};	
			$(".panel-wrong").removeClass("show").addClass("hide");			
			$(".panel-correct").removeClass("show").addClass("hide");			
			//Reset QAA
			$(".qaa-rw").each( function() {
				var classname = $(this).attr("class");
				if ($(this).hasClass("sequence-rw")) { //Sequence  in set
					AIE.Qaa.resetDAD($(this));
				} else if ($(this).hasClass("association-rw")) { //Association  in set
					AIE.Qaa.resetDAD($(this));
				}
			});
			//Reset NAV OBJECT
			AIE.Events.initNavObjects();
			
		});
		
		this.subscriptions.push(handle);
	}
}

/*Time object - Handles the display of incrementing Time: mm:ss
	Acitivated if there is a element with class game-timer on page
*/
AIE.GameTimer = {
	seconds: 0,
	minutes:0,
	running: false,
	timerid: 0,
	starthandle: 0,
	endhandle: 0,
	
	padTwo: function (x) {return ((x>9)?"":"0")+x},
	
	tick: function() {
		AIE.GameTimer.seconds = AIE.GameTimer.seconds + 1;
		if (AIE.GameTimer.seconds == 60) {
			AIE.GameTimer.seconds = 0;
			AIE.GameTimer.minutes = AIE.GameTimer.minutes + 1;
		}
		if (AIE.GameTimer.minutes == 60) {
			AIE.GameTimer.minutes = 0;
		}
		var disptime = AIE.GameTimer.padTwo(AIE.GameTimer.minutes)+":"+AIE.GameTimer.padTwo(AIE.GameTimer.seconds);
		$(".game-timer").text(disptime);
	},
	
	init: function () {	
		this.running = true;
		var timer =  $(".game-timer");
		if (timer.length < -1) return;
		
		this.starthandle = $.subscribe("GAMESTART", function(){
			AIE.GameTimer.timer = setInterval(AIE.GameTimer.tick, 1000);
		});
		
		//Published from AIE.SimpleGameEvaluation::handleGameEnd
		this.endhandle = $.subscribe("GAMEEND", function(){
			clearInterval(AIE.GameTimer.timer);
		});
	},
	
	resetTimer: function() {
		this.running = false;
		clearInterval(AIE.GameTimer.timer);
		AIE.GameTimer.timer = 0;
		AIE.GameTimer.minutes = 0;
		AIE.GameTimer.seconds = 0;
		$(".game-timer").text("00:00");
	}
};

//Load the storyline on start
$(document).ready(function() {
	//Initialize the game timer 
	AIE.GameTimer.init();
	//Initialize the game evaluation engine
	if ($(".game-evaluation")){
		this.game_eval_obj = new AIE.SimpleGameEvaluation();
		this.game_eval_obj.initGameEvents();
	}
});
