// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine

/*
aie_qaa.js - AIE module for Question and answers
*/

var AIE = AIE || {};

AIE.Qaa = {
	evalMap: {},
	
	feedbackOptions: {},
	
	dadMap: {},
	
	userSelectionMap: {},
	
	init: function() {
		this.generateID();
		this.createEvaluationLookup();
		this.createFeedbackLookup();
		AIE.Qaa.TrueFalse.init();
		AIE.Qaa.MultiTrueFalse.init();
		AIE.Qaa.MultiChoice.init();
		AIE.Qaa.MultiResponse.init();
		AIE.Qaa.TextMatch.init();
		AIE.Qaa.MultiTextMatch.init();
		AIE.Qaa.Association.init();
		AIE.Qaa.Association_tap.init();
		AIE.Qaa.Sequence.init();
		AIE.Qaa.Sequence_tap.init();
		AIE.Qaa.Grouping.init();
		AIE.Qaa.UserResultStorage.init();	
		AIE.Qaa.QASet.init();	
		AIE.Qaa.SortWords.init();
	},

	generateID: function() {
		//Generate ID for each qaa
		//ID pattern qaa{n}
		$('.qaa-rw').each(function(index) {
			var qaaid = 'qaa'+index;
			//Dont lose the original id as it could be used for CSS mapping
			var origid = $(this).attr('id');
			if (origid){ 
				$(this).attr('id', origid);
				qaaid = origid + "___" + qaaid;
			} else {
				qaaid = qaaid + "___" + qaaid;
				$(this).attr('id', qaaid);
			}
			
			//Generate ID for each option source inside the qaa
			//ID pattern for ol option source - qaa{n}_os{n}
			$(this).find('.option-source').each(function(osi){
				var osid = qaaid + "_" + "os" + osi;
				$(this).attr('id', osid);
				$(this).find('li').each(function(lii){
					//ID pattern for LI qaa{n}_os{n}_li{n}
					var liid = osid + "_" + "li" + lii;
					$(this).attr('id', liid);
					$(this).find('span[contenteditable]').each(function(sii){
						//ID pattern for LI qaa{n}_os{n}_li{n}
						var siid = liid + "_sp" + sii;
						$(this).attr('id', siid);
					});
					
					$(this).find('.inputcontent').each(function(sii){
						//ID pattern for LI qaa{n}_os{n}_li{n}
						var siid = liid + "_in" + sii;
						$(this).attr('id', siid);
					});
					
					$(this).find('span').each(function(sii){
						//ID pattern for LI qaa{n}_os{n}_li{n}
						var siid = liid + "_sp" + sii;
						var currid = $(this).attr('id');
						if (typeof currid == 'undefined') {
							$(this).attr('id', siid);
						}
					});
					
				});
			});
			//Generate ID for options target
			$(this).find('.option-target').each(function(oti){
				var osid = qaaid + "_" + "ot" + oti;
				$(this).attr('id', osid);
				$(this).find('li').each(function(olii){
					//ID pattern for LI qaa{n}_os{n}_li{n}
					var liid = osid + "_" + "li" + olii;
					$(this).attr('id', liid);
				});
			});
			
			//Generate ID for each Question control answer map inside the qaa
			//ID pattern for ol option source - qaa{n}_am{n}
			$(this).find('.answer-map').each(function(osi){
				var osid = qaaid + "_" + "am" + osi;
				$(this).attr('id', osid);
				$(this).find('li').each(function(lii){
					//ID pattern for LI qaa{n}_am{n}_li{n}
					var liid = osid + "_" + "li" + lii;
					$(this).attr('id', liid);
				});
			});
		});
	},
	
	/*
		Create a lookup structure to map option source to its target value
	*/
	createEvaluationLookup: function() {
		//Create a lookup structure for li
		$('.qaa-rw').find('.option-source > li').each( function() {
			var optid = $(this).attr('id');
			var targetid = "#" + optid.replace("_os", "_am");
			AIE.Qaa.evalMap[optid] = "";
			if($(targetid).text() || $(targetid).val()) {
				AIE.Qaa.evalMap[optid] = $(targetid).text() || $(targetid).val();
			}
		});
		
		//Now iterate throught all option source
		//AIE.Qaa.evalMap[qaa0_os0_li2_sp0] = actual answer goes here
		$('.qaa-rw').find(".option-source").each(function(){
			//Iterate each span inside the option source
			$(this).find('span[contenteditable]').each( function(counter) {
				var optid = $(this).attr('id');
				var li_id = $(this).parent('li').attr('id');
				
				var opt_index_index = optid.indexOf("___");
				var prefix = optid.substring(0, opt_index_index+3);
				var suffix = optid.substring(opt_index_index+3);
				
				//Span id structure is: qaa0_os0_li1_sp0
				//We are trying to get the index from the span 
				var opt_index_l = optid.split("_");
				
				//Get the last item from the list
				var opt_index_s = opt_index_l[opt_index_l.length-1];
				//Remove sp to get just the number 
				opt_index_s = opt_index_s.replace("sp", "");
				//Convert the string into a number
				var opt_index_index = counter + 1;
				//create the id for the equivalent answermap for this option source
				//Split the suffix after ___ to get the first two parts of the id
				var t = suffix.split("_");
				var temp = prefix + t[0] + "_" + t[1] ;
				var am_id = temp.replace("_os", "_am");
				
				//Now create a filter to get the target answer based on nth-child selector
				var targetfilter =  "#" + am_id + " > li:nth-child(" + opt_index_index + ")";
				var answer = $(targetfilter).text() ||  $(targetfilter).val();
				
				AIE.Qaa.evalMap[optid] = "";
				if(answer) {
					AIE.Qaa.evalMap[optid] = answer;
				}
			});
			
			
			
			$(this).find('.inputcontent').each( function(counter) {
				var optid = $(this).attr('id');
				var li_id = $(this).parent('li').attr('id');
				
				var opt_index_index = optid.indexOf("___");
				var prefix = optid.substring(0, opt_index_index+3);
				var suffix = optid.substring(opt_index_index+3);
				
				//Span id structure is: qaa0_os0_li1_sp0
				//We are trying to get the index from the span 
				var opt_index_l = optid.split("_");
				
				//Get the last item from the list
				var opt_index_s = opt_index_l[opt_index_l.length-1];
				//Remove sp to get just the number 
				opt_index_s = opt_index_s.replace("sp", "");
				//Convert the string into a number
				var opt_index_index = counter + 1;
				//create the id for the equivalent answermap for this option source
				//Split the suffix after ___ to get the first two parts of the id
				var t = suffix.split("_");
				var temp = prefix + t[0] + "_" + t[1] ;
				var am_id = temp.replace("_os", "_am");
				
				//Now create a filter to get the target answer based on nth-child selector
				var targetfilter =  "#" + am_id + " > li:nth-child(" + opt_index_index + ")";
				var answer = $(targetfilter).text() ||  $(targetfilter).val();
				
				AIE.Qaa.evalMap[optid] = "";
				if(answer) {
					AIE.Qaa.evalMap[optid] = answer;
				}
			});
		});
	},
	
	/* */
	createFeedbackLookup: function() {
		//Generate ID for each qaa
		//ID pattern qaa{n}
		$('.qaa-rw').each(function(index) {
			var qaaid = $(this).attr('id');
			//Load the feedback messages class and message for this qaa div
			AIE.Qaa.feedbackOptions[qaaid] = {};
			var qacl = $(this).attr('class');
			qacl = qacl.replace("qaa-rw", "");
			qacl = jQuery.trim(qacl);
		
			AIE.Qaa.feedbackOptions[qaaid]["qaatype"] = qacl;
			AIE.Qaa.feedbackOptions[qaaid]["evaluation"] = $(this).find(".evaluation").text();
			AIE.Qaa.feedbackOptions[qaaid]["feedback"] = $(this).find(".feedback").text();
			AIE.Qaa.feedbackOptions[qaaid]["results"] = $(this).find(".results").text();
			$(this).find('.feedback-messages').children().each(function(){
				var cl = $(this).attr('class');
				AIE.Qaa.Association_tapl = cl.replace("fbm", "");
				cl = jQuery.trim(cl);
				
				switch (cl) {
					case "correct":
						AIE.Qaa.feedbackOptions[qaaid]["correct"] = $(this).text();
						break;
					case "wrong":
						AIE.Qaa.feedbackOptions[qaaid]["wrong"] = $(this).text();
						break;
					case "reinforcement":
						AIE.Qaa.feedbackOptions[qaaid]["reinforcement"] = $(this).html();
						break;
				}
			});
		});
	},
	
	showFeedback: function($parentobj, state) {
		var rl = 'reinforcement';
		//Create the dynamic eventname
		var eventname = $parentobj.attr("id") + "-";
		
		if (state == true) {
			//user has got it right
			//Show the correct message
			var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
			$parentobj.find(" > .feedback-messages > ." + cl).show();
			$parentobj.find(" > .feedback-messages > .wrong").hide();
			//Hide the reinforcement if it is displayed
			$parentobj.find(" > .feedback-messages > ." + rl).hide();
			$parentobj.find(" > .feedback-messages").show();
			eventname = eventname + "correct";

		} else {
			//user has got it wrong
			//hide the correct message
			var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
			$parentobj.find(" > .feedback-messages > ." + cl).hide();
			$parentobj.find(" > .feedback-messages > .wrong").show();
			//show the reinforcement if it is displayed
			$parentobj.find(" > .feedback-messages > ." + rl).show();
			$parentobj.find("> .feedback-messages").show();
			eventname = eventname + "wrong";
		}
		//Publish the dynamic event
		$.publish(eventname, []);
				
	},
	
	evaluate: function(qaaobj, selobj) {
		var qaaid = qaaobj.attr('id');
		var fb = AIE.Qaa.feedbackOptions[qaaid]["feedback"];
		if(fb){
			//Handle the different types of feedback here
			switch (fb) {
				
				default:
					//Default is no feedback on a user event
					break;
			}
		}
	},
	
	getAnswer: function(elid) {
		var ans = AIE.Qaa.evalMap[elid];
		ans = jQuery.trim(ans);
		return ans;
	},
	
	getWrongFeedbackClass: function(qaaid) {
		return "wrong";
	},
	
	getCorrectFeedbackClass: function(qaaid) {
		return "correct";
	},
	
	resetOptions: function($parentobj) {
		$parentobj.find('.option-source >li').each(function(){
			$(this).removeClass('wrong');
			$(this).removeClass('correct');
			$(this).removeClass('selected-aie');
		});
		
		var qaaid = $parentobj.attr("id");
		
		//Set the userselection to empty
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
		}
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
	},
	
	retryOptions: function($parentobj) {
		var  id = $parentobj.attr("id");
		
		//Set the userselection to empty
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(id) == true)) {
			var userselection = AIE.Qaa.userSelectionMap[id]["userselection"];
		}
		
		$("#"+id+" ol").find('.wrong').each(function() {
			$(this).removeClass('wrong');
			if (userselection) {
				userselection[$(this).attr("id")] = false;
			}
		});
		
		//Set the userselection to empty
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(id) == true)) {
			if (userselection) {
				AIE.Qaa.userSelectionMap[id]["userselection"] = userselection;
			}
		}
		
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
	},
	
	recordCheckAction: function($parentobj) {
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 0, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0};
		}
		AIE.Qaa.userSelectionMap[qaaid]["attempts"] = AIE.Qaa.userSelectionMap[qaaid]["attempts"] + 1;
	},
	
	recordTryAgainAction: function($parentobj) {
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 0, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0};
		}
		AIE.Qaa.userSelectionMap[qaaid]["try-again-count"] = AIE.Qaa.userSelectionMap[qaaid]["try-again-count"] + 1;
	},
	
	recordResetAction: function($parentobj) {
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 0, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0};
		}
		AIE.Qaa.userSelectionMap[qaaid]["reset-count"] = AIE.Qaa.userSelectionMap[qaaid]["reset-count"] + 1;
	},
	
	checkAnswers: function($parentobj, incr_correct_count){
		//Make sure that incr correct count is set to true if calling function
		//does not pass an arg. 
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
		
		//we declare the variable here to check if any one of the answers
		//is wrong. If that happens, we need to show wrong message
		var eval_status = false;
		var once = true;
		var user_options = {};
		$parentobj.find('.option-source >li').each(function() {
			if (once) {
				//set the eval_status to true for first time
				eval_status = true;
				once = false;
			}
			
			var src_id = $(this).attr("id");
			var answer = AIE.Qaa.getAnswer($(this).attr("id"));
			user_options[src_id] = false; 
			if ($(this).hasClass('selected-aie') == false) {
				//We need to make sure that we show a reenforcement
				//if user does not attempt something, But the answer is true
				//This happens when a check is done after doing a try again
				if ((answer == "1") && ($(this).hasClass('correct') == false)) {
					eval_status = false;
				} else if ((answer == "1") && ($(this).hasClass('correct') == true)) {
					user_options[src_id] = true;
				}
			} else {
				//User has selected this as the correct option
				user_options[src_id] = true;
				switch (answer) {
					case "0":
						var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
						$(this).addClass(cl).removeClass('selected-aie');
						eval_status = false;
						break;
					case "1":
						var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
						$(this).addClass(cl).removeClass('selected-aie');
						break;
					default:
						var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
						eval_status = false;
						$(this).addClass(cl).removeClass('selected-aie');
				}
			}
		});
		
		var qaaid = $parentobj.attr("id");
		
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = user_options;
			if (eval_status && incr_correct_count) {
				AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
			}
		}
		
		AIE.Qaa.showFeedback($parentobj, eval_status);
	},
	
	checkTextMatchAnswers: function($parentobj, incr_correct_count){
		//Make sure that incr correct count is set to true if calling function
		//does not pass an arg. 
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
		
		var eval_status = false;
		var once = true;
		var parentid = $parentobj.attr('id');
		var useroptions = {};
	 
		if($("#" + parentid + " input").hasClass('inputcontent')){
			var filter = "#" + parentid + ' .inputcontent';
		} else{
			var filter = "#" + parentid + ' span[contenteditable]' ;
		}
		 
		$(filter).each(function() {
			if (once) {
				//set the eval_status to true for first time
				eval_status = true;
				once = false;
			}
			var user_answer = $(this).text() || $(this).val();
			user_answer = jQuery.trim(user_answer);
			useroptions[$(this).attr("id")] = user_answer;
			
			var sys_answer = AIE.Qaa.getAnswer($(this).attr("id"));
			$(this).removeClass('selected-aie');
			$(this).removeClass('wrong');
			$(this).removeClass('correct');
			var correct_answer = false;
			//Handle the multi answers here
			var multi = [];
			//multiple options are specified as quotes wrapped comma separated
			if (sys_answer[0] == "\"") {
				var tmulti = sys_answer.split('"');
				for (var k=0; k<tmulti.length; k++){
					var option = tmulti[k];
					option = jQuery.trim(option);
					if (option && (option!=",") && (option!="\"") ) multi.push(tmulti[k]);
				}
			} else {
				//multiple options are specified as comma separated
				multi = sys_answer.split(',');
			}
			
			if (multi.length > 1) {
				for (var k=0; k<multi.length; k++){
					var option = multi[k];
					option = jQuery.trim(option);
					if (user_answer == option){
						correct_answer = true;
						break
					}
				}
			} else {
				if (multi.length == 1) sys_answer =  multi[0];
				//Single answer option
				if (user_answer == sys_answer){
					correct_answer = true;
				}
			}

			if (correct_answer) {
				var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
				$(this).addClass(cl);
			} else {
				if (($(this).get(0).innerHTML == "&nbsp;") ||  (user_answer == "")){
					//Dont set a error class if user has not attemped the option
					eval_status = false;
				} else {
					var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
					eval_status = false;
					$(this).addClass(cl);
				}
			}
		});
		
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
			if (eval_status && incr_correct_count) {
				AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
			}
		}
		
		AIE.Qaa.showFeedback($parentobj, eval_status);
	},
	
	resetTextMatch: function($parentobj){
		var parentid = $parentobj.attr('id');
	 
		if($("#" + parentid + " input").hasClass('inputcontent')){
			var filter = "#" + parentid + ' .inputcontent';
		}
		 else{
				var filter = "#" + parentid + ' span[contenteditable]' ;
		}
		
		//var filter = "#" + parentid + ' span[contenteditable]' || "#" + parentid + ' .inputcontent';
		$(filter).each(function() {
			$(this).removeClass('wrong');
			$(this).removeClass('correct');
			$(this).removeClass('selected-aie');
			if($(this).hasClass('inputcontent')) {
				$(this).val(" ");	
			} else {
				$(this).text(" ");	
			}	
			var index = $(this).attr('class').replace(/\D/g,'') -1 ;
			$($parentobj.children('.textmatch-answermap').find('li:eq('+index +')').show()).css({left:'0px',top:'0px'});
		});
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
		}
		
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
	},
	
	retryTextMatch: function($parentobj){ 
		var parentid = $parentobj.attr('id');
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		var useroptions = {}
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			useroptions = AIE.Qaa.userSelectionMap[qaaid]["userselection"];
		}
		
		//var filter = "#" + parentid + ' span[contenteditable]' || "#" + parentid + ' .inputcontent';
		if($("#" + parentid + " input").hasClass('inputcontent')){
			var filter = "#" + parentid + ' .inputcontent';
		}
		else {
			var filter = "#" + parentid + ' span[contenteditable]' ;
		}
	 
		$(filter).each(function() {
			if ($(this).hasClass('wrong')) {
				var index = $(this).attr('class').replace(/\D/g,'') -1 ;
				$($parentobj.children('.textmatch-answermap').find('li:eq('+index +')').show()).css({left:'0px',top:'0px'});
				$(this).removeClass('wrong');
				$(this).removeClass('correct');
				$(this).removeClass('selected-aie');
				if($(this).hasClass('inputcontent')) {
					$(this).val(" ");	
				} else {
					$(this).text(" ");	
				}
				if (useroptions && (useroptions.hasOwnProperty($(this).attr("id")) == true)) {
					useroptions[$(this).attr("id")] = "";
				}
			}
		});
		
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			if (useroptions) AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
		}		
				
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
	},
	
	
	checkDADMatchLive: function($parentobj) {
		var result = true;
		$parentobj.find('.option-target').children().each(function(){
			if($(this).hasClass('selected-aie')) {
				var target_id = $(this).attr('id');
				//check if the map has src for the selected target
				if (AIE.Qaa.dadMap[target_id]) {
					//get the src id
					var src_id = AIE.Qaa.dadMap[target_id];
					//now use the src id to get the class
					var sClass = $("#" + src_id).attr('class').split(' ')[0];
					//extract the src class index
					var sClassIndex = sClass.replace(/\D/g,'');
					//now use the target id to get the class
					var tClass = $(this).attr('class').split(' ')[0];
					var tClassIndex = tClass.replace(/\D/g,'');
					//Compare the src and target index
					if (sClassIndex == tClassIndex) {
						//do nothing
					} else {
						var srcdata = $("#" + src_id).text();
						var targetid = "#" + target_id.replace("_ot", "_am");
						var targetanswer = $(targetid).text();						if (srcdata != targetanswer) {
							result = false;
						}
					}
				} else {
					result = false;
				}
			}else {
				//looks like user has some items remaining to drop
				result = false;
			}
		});
		return result;		
	},
	
	hasUserFinishedDrop: function($parentobj) {
		var result = true;
		$parentobj.find('.option-target').children().each(function(){
			if($(this).hasClass('selected-aie')) {
				
			}else {
				//looks like user has some items remaining to drop
				result = false;
			}
		});
		return result;		
	},
	
	checkDADMatch: function($parentobj) {
		//Make sure that incr correct count is set to true if calling function
		//does not pass an arg. 
		incr_correct_count = typeof(incr_correct_count) != 'undefined' ? incr_correct_count : true;
		
		//$(".non-draggable").removeClass("non-draggable").addClass("ui-draggable");  
		$(".non-draggable").removeClass("selected-aie") 
		//Variable used for displaying the feedback
		var eval_status = false;
		var once = true;
		var useroptions = {};
		
		$parentobj.find('.option-target').children().each(function(){
			if (once) {
				//set the eval_status to true for first time
				eval_status = true;
				once = false;
			}
			if($(this).hasClass('selected-aie')) {
				var target_id = $(this).attr('id');
				//check if the map has src for the selected target
				if (AIE.Qaa.dadMap[target_id]) {
					//get the src id
					var src_id = AIE.Qaa.dadMap[target_id];
					//now use the src id to get the class
					var sClass = $("#" + src_id).attr('class').split(' ')[0];
					$("#" + src_id).removeClass('selected-aie');
					//extract the src class index
					var sClassIndex = sClass.replace(/\D/g,'');
					//now use the target id to get the class
					var tClass = $(this).attr('class').split(' ')[0];
					var tClassIndex = tClass.replace(/\D/g,'');
					//Compare the src and target index
					useroptions[target_id] = src_id;
					if (sClassIndex == tClassIndex) {
						//Show correct response
						var cl = AIE.Qaa.getCorrectFeedbackClass($parentobj.attr("id"));
						$(this).addClass(cl);
					} else {
						//Show error response
						var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
						eval_status = false;
						$(this).addClass(cl).removeClass('selected-aie');
					}
					$(this).removeClass('selected-aie');
				} else {
					//Show error response
					var cl = AIE.Qaa.getWrongFeedbackClass($parentobj.attr("id"));
					eval_status = false;
					$(this).addClass(cl).removeClass('selected-aie');
				}	
			}else {
				//Make sure that you handle the case where something was 
				//checked properly in the previous check event and is not selected
				if ($(this).hasClass('correct') == false) {
					eval_status = false;
				} else {
					//Here we add the item to the variable to be stored in local storage
					var target_id = $(this).attr('id');
					var src_id = AIE.Qaa.dadMap[target_id];
					if (src_id) useroptions[target_id] = src_id;
				}
			}
		});
		
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			if (useroptions) AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
			if (eval_status && incr_correct_count) {
				AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
			}
		}		
		
		AIE.Qaa.showFeedback($parentobj, eval_status);
						
	},
	
	retryDAD: function($parentobj) {
		//Handle the update to local datastructure here
		var useroptions = {};
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			useroptions = AIE.Qaa.userSelectionMap[qaaid]["userselection"];
		}
		$(".non-draggable").removeClass("non-draggable").addClass("ui-draggable");  
		$( ".non-droppable").removeClass("non-droppable").addClass("ui-droppable"); 
		//$("option-source .ui-draggable").removeClass("selected-aie");
		$parentobj.find('.option-target').children().each(function(){
			//Check if user has done a drag operation and it is wrong
			if($(this).hasClass('wrong')) {
				var target_id = $(this).attr('id');
				if (AIE.Qaa.dadMap[target_id]) {
					//get the src id
					var src_id = AIE.Qaa.dadMap[target_id];
					//now use the src id to get the class
					var sClass = $("#" + src_id).attr('class').split(' ')[0];
					//extract the src class index
					var sClassIndex = sClass.replace(/\D/g,'');
					var srcclass ='.s'+ sClassIndex;
					var src_selector = '.option-source >' + srcclass;
					$parentobj.find("#" + src_id).css({top:'0px',left:'0px'});
					useroptions[target_id] = "";
				}
				if (AIE.Qaa.dadMap[target_id]) {
					delete AIE.Qaa.dadMap[target_id];
				}
				$(this).removeClass('selected-aie');
				$(this).removeClass('wrong');
				$(this).removeClass('correct');
			} else if($(this).hasClass('correct')) {
				//Add the correct answers to useroptions to save it to local storage
				var src_id = AIE.Qaa.dadMap[target_id];
				useroptions[target_id] = src_id;
			}
		});
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			if (useroptions) AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useroptions;
		}	
		
	},
	
	resetDAD: function($parentobj) {
		
	    $($parentobj).attr('id');
		var elemid =  $($parentobj).attr('id');
		
		var association_id = elemid;
		
		$('#'+association_id+' .check').removeAttr("disabled", "disabled");
  		$('#'+association_id+' .try-again').removeAttr("disabled", "disabled");
		
		$parentobj.find('.option-target').children().each(function(){
			var target_id = $(this).attr('id');
			
			$(this).removeClass('wrong');
			$(this).removeClass('correct')
			
			if(AIE.Qaa.dadMap[target_id]) {
				//get the src id
				var src_id = AIE.Qaa.dadMap[target_id];
				//now use the src id to get the class
				var sClass = $("#" + src_id).attr('class').split(' ')[0];
				//extract the src class index
				var sClassIndex = sClass.replace(/\D/g,'');
					
				var srcclass ='.s'+ sClassIndex;
				var src_selector = '.option-source >' + srcclass;
				$parentobj.find(src_selector).css({top:'0px',left:'0px'});
		 
				$(this).removeClass('selected-aie');
				$(this).removeClass('wrong');
				$(this).removeClass('correct');	 
			}
			
			if (AIE.Qaa.dadMap[target_id]) {
				delete AIE.Qaa.dadMap[target_id];
			}
		});
		//Hide the feedback message
		$parentobj.find(".feedback-messages").hide();
		
		//Setup event handler for evaluation
		$('.'+association_id+ ' > .option-source').each(function(){
			//Make sure you shuffle only if the author wants it
			if ($(this).hasClass('shuffle')) {
				$(this).shuffle();
			}
		});
		
		
		$(".option-target li").removeClass("  undefined")
		//	$( ".non-droppable").removeClass("non-droppable")
		$(".option-target li").removeClass("selected-aie wrong correct undefined")
		
		$( ".non-droppable").removeClass("non-droppable").addClass("ui-droppable"); 
		$(".ui-draggable").removeClass("selected-aie");
	 
		$('#'+elemid+" .option-source li").each( function(index) {
			$(this).css( {"left" :0 , "top" :0});
		});
	
		//Handle the update to local datastructure here
		var qaaid = $parentobj.attr("id");
		if (AIE.Qaa.userSelectionMap && (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == true)) {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
		}	
	},
	
	evaluateOptions: function($sel_obj){
		var isEval = false;
		$qaaobj = $sel_obj.parents('.qaa-rw');
		AIE.Qaa.evaluate($qaaobj, $sel_obj);
		//Reset selection of other classes
		$optionsrc = $sel_obj.parent();
		$optionsrc.children().each(function(){
			if (($(this).hasClass('correct')) ||  ($(this).hasClass('wrong'))){
				isEval = true;
			}
		});
		
		if (isEval == false) {
			$optionsrc.children().removeClass('selected-aie');
			//set selection on the current item
			$sel_obj.addClass('selected-aie');
		}
	}
};

AIE.Qaa.TrueFalse = {
	init:function(){
		//Setup event handler for evaluation
		$('.truefalse-rw >.option-source >li').click(function(){
			AIE.Qaa.evaluateOptions($(this));
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.truefalse-rw').hasClass("auto-check-rw")) {
				$(this).parents('.truefalse-rw').find('.buttons-rw > .check').trigger('click');
			}
		});	
		
		//Setup event handler for CHECK button
		$('.truefalse-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.truefalse-rw > .buttons-rw > .try-again').click(function(){ 
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.truefalse-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};

AIE.Qaa.MultiTrueFalse = {
	init:function(){
		//Setup event handler for evaluation
		$('.multi-truefalse-rw').find('.option-source >li').click(function(){
			AIE.Qaa.evaluateOptions($(this));
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.multi-truefalse-rw').hasClass("auto-check-rw")) {
				$(this).parents('.multi-truefalse-rw').find('.buttons-rw > .check').trigger('click');
			}
		});	
		
		//Setup event handler for CHECK button
		$('.multi-truefalse-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.multi-truefalse-rw > .buttons-rw > .try-again').click(function(){
			var target=$(this).parent().parent().attr("id") 
			 
			$('#'+target+" ol li").removeClass("undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.multi-truefalse-rw > .buttons-rw > .reset').click(function(){ 
			var target=$(this).parent().parent().attr("id") 
			$('#'+target+" ol li").removeClass("wrong correct undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};
	
AIE.Qaa.MultiChoice = {
	init:function(){
		//Setup event handler for evaluation
		$('.multichoice-rw').find('.option-source >li').click(function(){
			AIE.Qaa.evaluateOptions($(this));
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.multichoice-rw').hasClass("auto-check-rw")) {
				$(this).parents('.multichoice-rw').find('.buttons-rw > .check').trigger('click');
			}
		});	
		
		//Setup event handler for CHECK button
		$('.multichoice-rw >.buttons-rw > .check').click(function(){
			var target=$(this).parent().parent().attr("id");  
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.multichoice-rw > .buttons-rw > .try-again').click(function(){
			var target=$(this).parent().parent().attr("id")
			$('#'+target+" ol li").removeClass("undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
			 
		});	
		
		//RESET  EVENT HANDLER
		$('.multichoice-rw > .buttons-rw > .reset').click(function(){
			var target=$(this).parent().parent().attr("id") 
			$('#'+target+" ol li").removeClass("wrong correct undefined")
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};

AIE.Qaa.MultiResponse = {
	init:function(){
		//Setup event handler for evaluation
		$('.multiresponse-rw').find('.option-source >li').click(function(event){
			//Removed the requirement for CTRL key as per client reqt - 20111121 - DC
			//if (event.ctrlKey) {
				$qaaobj = $(this).parents('.qaa-rw');
				AIE.Qaa.evaluate($qaaobj, $(this));
				//Reset selection of other classes
				$optionsrc = $(this).parent();
				//set selection on the current item
				$(this).toggleClass('selected-aie');
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.multiresponse-rw').hasClass("auto-check-rw")) {
					$(this).parents('.multiresponse-rw').find('.buttons-rw > .check').trigger('click');
				}
			//}
		});	
		
		//Setup event handler for CHECK button
		$('.multiresponse-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.multiresponse-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryOptions($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.multiresponse-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetOptions($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};

AIE.Qaa.TextMatch = {
	dragItems:function(){
		
		$('.textmatch-rw >.textmatch-answermap >li').draggable({
			revert:"invalid"
//			$(this).addClass('selected-aie');	
		});
		
		$('.textmatch-rw >.option-source >li').find('span[contenteditable]').droppable({
			drop:function(e,ui){
				$(ui.draggable).offset($(this).offset())
				$(this).text($(ui.draggable).text());
				$($(ui.draggable)).hide();
			}
//			$(this).addClass('selected-aie');	
		});
		
	}, 	
	init:function(){
		//Setup event handler for evaluation
		$('.textmatch-rw > .option-source >li >span').blur(function(){
			$(this).addClass('selected-aie');
		});
		$('.textmatch-rw > .option-source >li >span').focusout(function(){
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.textmatch-rw').hasClass("auto-check-rw")) {
				$(this).parents('.textmatch-rw').find('.buttons-rw > .check').trigger('click');
			}
		});
		
		//Setup event handler for CHECK button
		$('.textmatch-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkTextMatchAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.textmatch-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryTextMatch($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.textmatch-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetTextMatch($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};



AIE.Qaa.LocalStorage = {
	save: function(key, content) {
		window.localStorage.setItem(key, content);
	},

	load: function(key) {
		return  localStorage.getItem(key);
	},
	
	remove: function(key) {
		window.localStorage.removeItem(key);
	}	
};


AIE.Qaa.UserResultStorage = {
	init: function() {
		AIE.Qaa.UserResultStorage.loadUserResult();
	},
	
	getUniqueName: function() {
		var path = window.location.pathname;
		var currpageid = $(".aco-presentation ").attr("id");
		var solitnames = path.split('/');
		var pagename = solitnames[solitnames.length-1];
		var uniquename = pagename + "::" + currpageid;
		return uniquename;
	},
	
	// Function to store the result of the user in local storage
	 saveUserResult: function() {
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(AIE.Qaa.userSelectionMap));
		return;
	 },
	 
     // Function to load the result of the user from local storage 
	 loadUserResult: function() {
		var uname = this.getUniqueName();
		var retrievedObject = localStorage.getItem(uname);
		AIE.Qaa.userSelectionMap = JSON.parse(retrievedObject);
		if (AIE.Qaa.userSelectionMap) {
			
		} else {
			AIE.Qaa.userSelectionMap = {};
		}
		AIE.Qaa.LocalStorageDataLoader.init();
		return;
	},
	
	resetSortWordMultiObject: function(parentobj) {
		var qaaid = $(parentobj).attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 1, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 1, "targetdata": {}};
		} else {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
			AIE.Qaa.userSelectionMap[qaaid]["targetdata"] = {};
			AIE.Qaa.userSelectionMap[qaaid]["reset-count"] = AIE.Qaa.userSelectionMap[qaaid]["reset-count"] + 1;
		}
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(AIE.Qaa.userSelectionMap));
	},
	
	saveSortWordMultiObject: function(parentobj, result){
		var useractions = {};
		var targetdata = {};
		var qaaid = $(parentobj).attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 1, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0, "targetdata": {}};
		} else {
			useractions = AIE.Qaa.userSelectionMap[qaaid]["userselection"];
			AIE.Qaa.userSelectionMap[qaaid]["attempts"] = AIE.Qaa.userSelectionMap[qaaid]["attempts"] + 1;
		}
		//First we store the state of span into the useractions
		//If a span is hidden, it means that user has dragged and dropped it into the target
		$('.qaa-item > .option-source > li > span', $(parentobj)).each(function(){
			if (($(this).is(":visible")) == false) {
				useractions[$(this).attr("id")] = false;
			}
		});
		
		$('.qaa-item > .option-target > li', $(parentobj)).each(function(){
			var li_data = $(this).html();
			targetdata[$(this).attr("id")] = li_data;
		});
		
		AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useractions;
		AIE.Qaa.userSelectionMap[qaaid]["targetdata"] = targetdata;
		
		//Increment the correct count for the qaa if the user got it right
		if (result) {
			AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
		}
		
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(AIE.Qaa.userSelectionMap));
	},
	saveGroupingObject: function(parentobj, result){
		var useractions = {};
		var qaaid = $(parentobj).attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 1, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 0};
		} else {
			useractions = AIE.Qaa.userSelectionMap[qaaid]["userselection"];
			AIE.Qaa.userSelectionMap[qaaid]["attempts"] = AIE.Qaa.userSelectionMap[qaaid]["attempts"] + 1;
		}
		
		//First we store the state of span into the useractions
		//If a lis are hidden, it means that user has dragged and dropped it into the target
		$(parentobj).find('.option-source li').each(function(){
			if (($(this).is(":visible")) == false) {
				var c = $(this).attr('class');
				var spc = c.split('__')[1];
				useractions[$(this).attr("id")] = spc;
			} 
		});
		
		AIE.Qaa.userSelectionMap[qaaid]["userselection"] = useractions;
		
		//Increment the correct count for the qaa if the user got it right
		if (result) {
			AIE.Qaa.userSelectionMap[qaaid]["correct-count"] = AIE.Qaa.userSelectionMap[qaaid]["correct-count"] + 1;
		}
		
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(AIE.Qaa.userSelectionMap));
	},
	resetGroupingObject: function(parentobj){
		var qaaid = $(parentobj).attr("id");
		if (AIE.Qaa.userSelectionMap.hasOwnProperty(qaaid) == false) {
			AIE.Qaa.userSelectionMap[qaaid] = {"attempts": 1, "correct-count": 0, "try-again-count": 0, "userselection": {}, "reset-count": 1};
		} else {
			AIE.Qaa.userSelectionMap[qaaid]["userselection"] = {};
			AIE.Qaa.userSelectionMap[qaaid]["reset-count"] = AIE.Qaa.userSelectionMap[qaaid]["reset-count"] + 1;
		}
		var uname = this.getUniqueName();
		localStorage.setItem(uname, JSON.stringify(AIE.Qaa.userSelectionMap));
	}
};

AIE.Qaa.LocalStorageDataLoader = {
	getQAAType: function(qaobj) {
		if ($(qaobj).hasClass("truefalse-rw") || $(qaobj).hasClass("multi-truefalse-rw")) {
			return "TRUEFALSE";
		}
		
		if ($(qaobj).hasClass("multichoice-rw") || $(qaobj).hasClass("multiresponse-rw")) {
			return "MULTICHOICE_RESPONSE";
		}
		
		if ($(qaobj).hasClass("textmatch-rw") || $(qaobj).hasClass("multi-textmatch-rw")) {
			return "TEXTMATCH";
		}
		
		if ($(qaobj).hasClass("association-rw") || $(qaobj).hasClass("sequence-rw")) {
			return "ASSOCIATION-SEQUENCE";
		}
		
		if ($(qaobj).hasClass("sortword-multi-rw")) {
			return "SORTWORD-MULTI";
		}
		
		if ($(qaobj).hasClass("grouping-rw")) {
			return "GROUPING";
		}
		
		return "";
	},

	init:function(){
		var self = this;
		for (qaaid in AIE.Qaa.userSelectionMap) {
			var qaobj = $("#" + qaaid);
			var storageobject = AIE.Qaa.userSelectionMap[qaaid];
			var qaclass = self.getQAAType(qaobj);
			switch(qaclass){
				case "TRUEFALSE":
					self.loadQAAObject(qaobj, storageobject);
					break;
				case "MULTICHOICE_RESPONSE":
					self.loadQAAObject(qaobj, storageobject);
					break;
				case "TEXTMATCH":
					self.loadQAATextObject(qaobj, storageobject);
					break;
				case "ASSOCIATION-SEQUENCE":
					self.loadDaDObject(qaobj, storageobject);
					break;
				case "SORTWORD-MULTI":
					self.loadSortWordMulti(qaobj, storageobject);
					break;
				case "GROUPING":
					self.loadGrouping(qaobj, storageobject);
					break;
				default:
					break
			}
		}
		
		//Now call the check answer for any set on the page.
		var sets = $('.qaa-set-rw');
		if (sets.length > 0) {
			for (var i = 0; i < sets.length; i++) {
				var setobj = sets[i];
				AIE.Qaa.QASet.checkSetAnswers($(setobj));
			}
		}
		
	},
	
	loadQAAObject: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		for (li_id in userselection) {
			var state = userselection[li_id];
			if (state == true) {
				$("#" + li_id).addClass("selected-aie");
				call_checkanswer = true;
			}
		}
		if (call_checkanswer) {
			//We pass false as second param to make sure that correct count
			//does not increase when loading from local storage
			AIE.Qaa.checkAnswers($(qaobj), false);
		}
	},
	
	loadQAATextObject: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		for (in_id in userselection) {
			var user_answer = userselection[in_id];
			if (user_answer) {
				var nodename = $("#" + in_id)[0].nodeName;
				if (nodename.toLowerCase() == "span") {
					$("#" + in_id).text(user_answer);
				} else if (nodename.toLowerCase() == "input") {
					$("#" + in_id).val(user_answer);
				}
				call_checkanswer = true;
			}
		}
		if (call_checkanswer) {
			AIE.Qaa.checkTextMatchAnswers($(qaobj), false);
		}
	},
	
	loadDaDObject: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		for (target_id in userselection) {
			var src_id = userselection[target_id];
			if (src_id) {
				var targetoffset = $("#"+target_id).offset();
				$("#" + src_id).offset(targetoffset);
				$("#" + target_id).addClass("selected-aie");
				AIE.Qaa.dadMap[target_id] = src_id;
				call_checkanswer = true;
			}
		}
		if (call_checkanswer) {
			AIE.Qaa.checkDADMatch($(qaobj), false);
		}
	},
	
	loadSortWordMulti: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		for (span_id in userselection) {
			var span_state = userselection[span_id];
			if (span_state == false) {
				$("#" + span_id).hide();
				call_checkanswer = true;
			}
		}
		
		var targetdata = storageobject["targetdata"];
		for (li_id in targetdata) {
			var li_data = targetdata[li_id];
			if (li_data) {
				$("#" + li_id).html(li_data);
				call_checkanswer = true;
			}
		}
		
		if (call_checkanswer) {
			AIE.Qaa.SortWords.checkMultiSort(qaobj);
		}
	},
	
	loadGrouping: function(qaobj, storageobject) {
		var userselection = storageobject["userselection"];
		var call_checkanswer = false;
		for (list in userselection) {
			var span_state = userselection[list];
			if (span_state == false) {
				$("#" + list).show();
				call_checkanswer = true;
			} else {
					$('.option-source #'+list).addClass('dropped__'+span_state);
					var t = $("#" + list).clone();
					$('.option-target[data-t="'+span_state+'"]').prepend(t);
					$("#" + list).hide();
				call_checkanswer = true;
				}
		}
		if (call_checkanswer) {
			AIE.Qaa.Grouping.checkGroupingAnswer(qaobj);
		}
	},
}


AIE.Qaa.MultiTextMatch = {
	init:function(){
	
		//Setup event handler for evaluation
		$('.multi-textmatch-rw > .option-source >li >span').blur(function(){
			$(this).addClass('selected-aie');	
		});
		
		$('.multi-textmatch-rw > .option-source >li >span').focusout(function(){
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.multi-textmatch-rw').hasClass("auto-check-rw")) {
				$(this).parents('.multi-textmatch-rw').find('.buttons-rw > .check').trigger('click');
			}
		});
		
		//Setup event handler for CHECK button
		$('.multi-textmatch-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkTextMatchAnswers($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.multi-textmatch-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryTextMatch($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.multi-textmatch-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetTextMatch($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};



AIE.Qaa.Association_tap = {
	init: function() {
		$('.association-rw .option-source .ui-draggable').each( function(index) {
			var association_id= $(this).attr("id")
			AIE.Qaa.Association_tap.save_tap_results(this);
		});
	},
	
	save_tap_results: function(elem) {
		var Source_target_string='';
		var association_id= $(elem).parents('.qaa-rw').attr("id")
	
		$(elem).click( function() {
			$('.association-rw .option-source .ui-draggable').removeClass("selected-aie")
			
			var select_this = $(this).attr("class").split(' ')[1];
			//Remove the selected class from other items before selecting current
			//Clicked element
			if(	$('.'+select_this).hasClass("selected-aie")) {
				$('.'+select_this).removeClass("selected-aie")
				$(elem).addClass("selected-aie");
			} else {
				$(elem).addClass("selected-aie");
			}
		
			$(".option-target li").removeClass("undefined");
			
			var source_target = true;

			var source = elem;
			var src_id =  $(elem).attr('id');
		
			$(elem).parents('.qaa-rw').find('.option-target> *').unbind();
			$(elem).parents('.qaa-rw').find('.option-target> *').bind( "click", function(e) {
				if((source_target)) {
					$(source).addClass("selected-aie");

					$(this).addClass("selected-aie");

					var target_id = $(this).attr('id');

					var tag = $(e.target).get(0).tagName;


					if($(source).hasClass('ui-draggable') && $(source).hasClass('selected-aie') && !$(e.target).hasClass('inline-target') && $(e.target).hasClass('ui-droppable') && tag=='LI') {
						$(source).offset($(e.target).offset());    
						$(source).removeClass("ui-draggable").addClass("non-draggable");	
					}
					if($(source).hasClass('ui-draggable') && $(source).hasClass('selected-aie')  && $(e.target).parent().hasClass('ui-droppable') && tag=="SPAN") {
						$(source).offset($(e.target).parents("li").offset());
						$(source).removeClass("ui-draggable").addClass("non-draggable");
					}


					if($(source).hasClass('ui-draggable') && $(source).hasClass('selected-aie')  && $(e.target).parents("li").hasClass('ui-droppable') && tag== "IMG") {		 
						$(source).offset($(e.target).parents("li").offset());
						$(source).removeClass("ui-draggable").addClass("non-draggable");	
					}


					if($(this).hasClass('selected-aie')) {
						$(this).removeClass("ui-droppable").addClass("non-droppable");
					}

					AIE.Qaa.dadMap[target_id] = src_id;

					var $parentobj = $(this).parents('.qaa-rw');
					var finished = AIE.Qaa.hasUserFinishedDrop($parentobj);
					if (finished) {
						var parentid = $parentobj.attr('id');
						var result = AIE.Qaa.checkDADMatchLive($parentobj);
						if (result) {
							$.publish("qaaAssociationCorrect", [parentid, result]);
						} else {
							$.publish("qaaAssociationWrong", [parentid, result]);
						}
					}
					source_target = false;

					var sClass = $(source).attr('class').split(' ')[0];
					//extract the src class index
					var sClassIndex = sClass.replace(/\D/g,'');

					//now use the target id to get the class
					var tClass = $(this).attr('class').split(' ')[0];
					var tClassIndex = tClass.replace(/\D/g,'');
				}
				
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.association-rw').hasClass('auto-check-rw')) {
					$(this).parents('.association-rw').find('.buttons-rw > .check').trigger('click');
				}
			});
		});
	}
};
		


AIE.Qaa.Association = {
	init:function(){
		//Setup event handler for evaluation
		$('.association-rw > .option-source').each(function(){
			//Make sure you shuffle only if the author wants it
			if ($(this).hasClass('shuffle')) {
				$(this).shuffle();
			}
		});
		
		//Setup draggable
		$('.association-rw >.shuffle >li').draggable({
			revert:'invalid'		
		});	
		
		//Setup dropable	
		$('.association-rw >.option-target >li').droppable({
			drop:function(event,ui){
				var target_id = $(this).attr('id');
				//Is there something already there on the target
				if ($(this).hasClass('selected-aie')) {
					//We dont want to stack another object on top of that
					$(ui.draggable).css({top:'0px',left:'0px'});
					return false;
				}
				
				var src_id =  $(ui.draggable).attr('id');
				//Snap the element to the top of target
				$(ui.draggable).offset($(this).offset());
				$(this).addClass('selected-aie');
				//Map the src id to element on which it is mapped
				AIE.Qaa.dadMap[target_id] = src_id;
				var $parentobj = $(this).parents('.qaa-rw');
				var finished = AIE.Qaa.hasUserFinishedDrop($parentobj);
				if (finished) {
					var parentid = $parentobj.attr('id');
					var result = AIE.Qaa.checkDADMatchLive($parentobj);
					if (result) {
						$.publish("qaaAssociationCorrect", [parentid, result]);
					} else {
						$.publish("qaaAssociationWrong", [parentid, result]);
					}
				}
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.association-rw').hasClass('auto-check-rw')) {
					$(this).parents('.association-rw').find('.buttons-rw > .check').trigger('click');
				}
			}
			
		});	
			
		
		//Setup event handler for CHECK button
		$('.association-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkDADMatch($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.association-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryDAD($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.association-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetDAD($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	}	
};

AIE.Qaa.Sequence = {
	init:function(){
		//Setup event handler for evaluation
		$('.sequence-rw > .option-source').each(function(){
			//Make sure you shuffle only if the author wants it
			if ($(this).hasClass('shuffle')) {
				$(this).shuffle();
			}
		});
		
		//Setup draggable
		$('.sequence-rw >.shuffle >li').draggable({
			revert:'invalid'				
		});	
		
		//Setup dropable	
		$('.sequence-rw >.option-target >li').droppable({
			drop:function(event,ui){
				var target_id = $(this).attr('id');
				//Is there something already there on the target
				if ($(this).hasClass('selected-aie')) {
					//We dont want to stack another object on top of that
					$(ui.draggable).css({top:'0px',left:'0px'});
					return false;
				}
				
				var src_id =  $(ui.draggable).attr('id');
				//Snap the element to the top of target
				$(ui.draggable).offset($(this).offset());
				$(this).addClass('selected-aie');
				//Map the src id to element on which it is mapped
				AIE.Qaa.dadMap[target_id] = src_id;
				
				// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
				// check if author wants auto-check the answer
				if($(this).parents('.sequence-rw').hasClass('auto-check-rw')) {
					$(this).parents('.sequence-rw').find('.buttons-rw > .check').trigger('click');
				}
			}
		});	
			
		
		//Setup event handler for CHECK button
		$('.sequence-rw >.buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordCheckAction($parentobj);
			AIE.Qaa.checkDADMatch($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.sequence-rw > .buttons-rw > .try-again').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordTryAgainAction($parentobj);
			AIE.Qaa.retryDAD($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.sequence-rw > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			AIE.Qaa.recordResetAction($parentobj);
			AIE.Qaa.resetDAD($parentobj);
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
	},
};

AIE.Qaa.Sequence_tap = {
	selected_src_id: "",
	init: function() {		
		$('.sequence-rw .option-source .ui-draggable').each( function(index) {
			var el_id= $(this).attr("id")
			AIE.Qaa.Sequence_tap.setupSourceEventHandler(this);
			AIE.Qaa.Sequence_tap.setupTargetEventHandler();
		});  
	},
	setupSourceEventHandler: function(seqelem) {
		$(seqelem).click( function() {
			$('.sequence-rw .option-source .ui-draggable').removeClass("selected-aie");
			var select_this = $(this).attr("class").split(' ')[1];
			if(	$('.'+select_this).hasClass("selected-aie")) {
				$('.'+select_this).removeClass("selected-aie")
				$(seqelem).addClass("selected-aie");
			} else {
				$(seqelem).addClass("selected-aie");
			}
		
			$(".option-target li").removeClass("undefined");
			
			AIE.Qaa.Sequence_tap.selected_src_id = $(seqelem).attr("id");
		});
	},
	
	setupTargetEventHandler: function() {
		//Setup dropable	
		$('.sequence-rw >.option-target >li').click(function(){
			//if no source selected, then do nothing
			if (AIE.Qaa.Sequence_tap.selected_src_id == "")return false;
			
			//Is there something already there on the target
			if ($(this).hasClass('selected-aie')) {
				//We dont want to stack another object on top of that
				return false;
			}
			
			var target_id = $(this).attr('id');
			
			var src_id =  AIE.Qaa.Sequence_tap.selected_src_id;
			//Snap the element to the top of target
			$("#" + src_id).offset($(this).offset());
			$(this).addClass('selected-aie');
			//Map the src id to element on which it is mapped
			AIE.Qaa.dadMap[target_id] = src_id;
			AIE.Qaa.Sequence_tap.selected_src_id = "";
			
			// auto-check feature implemented as per clients requirement - 2013-04-16 - Milan
			// check if author wants auto-check the answer
			if($(this).parents('.sequence-rw').hasClass('auto-check-rw')) {
				$(this).parents('.sequence-rw').find('.buttons-rw > .check').trigger('click');
			}
		});	
	}
};
	

AIE.Qaa.QASet = {
	init:function(){	
		
		var self = this;
		//Setup event handler for CHECK button
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-submit').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-check').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			
			var score = [];
			$(".qaa-rw", $parentobj).each( function() {
				var classname = $(this).attr("class");
				AIE.Qaa.recordCheckAction($(this));
				if ($(this).hasClass("multichoice-rw")) { //Multichoice item in set
					AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("multiresponse-rw")) { //Multiresponse item in set
					AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("truefalse-rw")) { //True false item in set
					AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("multi-truefalse-rw")) { //Multi True false item in set
					AIE.Qaa.checkAnswers($(this));
				} else if ($(this).hasClass("textmatch-rw")) { //Text Match item in set
					AIE.Qaa.checkTextMatchAnswers($(this));
				} else if ($(this).hasClass("multi-textmatch-rw")) { //Multi Text match item in set
					AIE.Qaa.checkTextMatchAnswers($(this));
				} else if ($(this).hasClass("sequence-rw")) { //Sequence  in set
					AIE.Qaa.checkDADMatch($(this));
				} else if ($(this).hasClass("association-rw")) { //Association  in set
					AIE.Qaa.checkDADMatch($(this));
				} else if ($(this).hasClass("sortword-multi-rw")) { //Association  in set
					AIE.Qaa.SortWords.checkMultiSort($(this));
				} else if ($(this).hasClass("grouping-rw")) { // Grouping in set
					AIE.Qaa.Grouping.checkGroupingAnswer($(this));
				}
			});
			//Now Call the function to evaluate and display the result
			self.checkSetAnswers($parentobj);
			//Save results to the local storage
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
		//RESET  EVENT HANDLER
		$('.qaa-set-rw > .qaa-set-buttons-rw > .qaa-set-reset').click(function(){
			$parentobj = $(this).parents('.qaa-set-rw');
			
			$(".qaa-rw", $parentobj).each( function() {
				AIE.Qaa.recordResetAction($(this));
				var classname = $(this).attr("class");
				if ($(this).hasClass("multichoice-rw")) { //Multichoice item in set
					AIE.Qaa.resetOptions($(this));
				} else if ($(this).hasClass("multiresponse-rw")) { //Multiresponse item in set
					AIE.Qaa.resetOptions($(this));
				} else if ($(this).hasClass("truefalse-rw")) { //True false item in set
					AIE.Qaa.resetOptions($(this));
				} else if ($(this).hasClass("multi-truefalse-rw")) { //Multi True false item in set
					AIE.Qaa.resetOptions($(this));
				} else if ($(this).hasClass("textmatch-rw")) { //Text Match item in set
					AIE.Qaa.resetTextMatch($(this));
				} else if ($(this).hasClass("multi-textmatch-rw")) { //Multi Text match item in set
					AIE.Qaa.resetTextMatch($(this));
				} else if ($(this).hasClass("sequence-rw")) { //Sequence  in set
					AIE.Qaa.resetDAD($(this));
				} else if ($(this).hasClass("association-rw")) { //Association  in set
					AIE.Qaa.resetDAD($(this));
				} else if ($(this).hasClass("association-rw")) { //Association  in set
					AIE.Qaa.SortWords.resetSortMulti($(this));
				} else if ($(this).hasClass("grouping-rw")) { //Association  in set
					AIE.Qaa.Grouping.reset($(this));
				}
			});
			//Set the score to empty
			$(".qaa-set-results-rw > .correct-score", $parentobj).text("0");
			$(".qaa-set-results-rw > .wrong-score", $parentobj).text("0");
			
			AIE.Qaa.UserResultStorage.saveUserResult();
		});	
		
	},
	
	checkSetAnswers: function(setobj) {
		var self = this;
		$parentobj = $(setobj);
		var score = [];
		$(".qaa-rw", $parentobj).each( function() {
			var wrong_feedback = $(".feedback-messages > .wrong", $(this));
			var correct_feedback = $(".feedback-messages > .correct", $(this));
			var correct_score = $(this).find(".question-control > .correct-score").text();
			var wrong_score = $(this).find(".question-control > .wrong-score").text();
			var qaa_res =  {"id": "", "status": "", "score": 0};
			if ($(wrong_feedback).is(":visible")) {
				qaa_res["id"] = $(this).attr("id");
				qaa_res["status"] = "wrong";
				qaa_res["score"] = parseInt(wrong_score);
			} else if ($(correct_feedback).is(":visible")) {
				qaa_res["id"] = $(this).attr("id");
				qaa_res["status"] = "correct";
				qaa_res["score"] = parseInt(correct_score);
			}
			//Push the info regarding this qaa item into array for later eval
			score.push(qaa_res);
		});
			//Now pass the eval array to function for final processing
		self.scoreSet($parentobj, score);
	},
	
	scoreSet: function(setobj, scoredata) {
		$(".qaa-rw", $(setobj)).each( function() {
			total_correct = 0;
			total_wrong = 0;
			for (var i =0; i < scoredata.length; i++) {
				var t_score = scoredata[i];
				if (t_score["status"] == "correct") {
					total_correct = total_correct + t_score["score"];
				} else {
					total_wrong = total_wrong + t_score["score"];
				}
			}
			
			$(".qaa-set-results-rw > .correct-score", setobj).text(total_correct);
			$(".qaa-set-results-rw > .wrong-score", setobj).text(total_wrong);			
		});
	}	
};

AIE.Qaa.SortWords = {
	init:function(){
		var self = this;
		//Setup event handler for evaluation
		$('.sortword-multi-rw > .qaa-item > .option-source').each(function(){
			//Make sure you shuffle only if the author wants it
			if ($(this).hasClass('shuffle')) {
				var spans = $(this).find("li");
				spans.shuffle();
				//Append a blank to make sure that li does not collapse
				//after all spans inside it are hidden
				spans.append("&#160;");
			}
		});
		
		//Setup draggable
		$('.sortword-multi-rw > .qaa-item > .option-source > li > span').draggable({
			revert:'invalid'				
		});	
		
		//Setup dropable	
		$('.sortword-multi-rw > .qaa-item >.option-target >li').droppable({
			drop:function(event,ui){
				var target_id = $(this).attr('id');
				var src_id =  $(ui.draggable).attr('id');
				var topy = $(this).parent().css("top");
				var offset = $(this).parent().position();
				$(this).addClass('selected-aie');
				$(ui.draggable).addClass('aieapp-dropped');
				var text = $(ui.draggable).text();
				$(this).append("<span>" + text + "</span>");
				$(ui.draggable).css({top:'0px',left:'0px'});
				$(ui.draggable).hide();
			}
			
		});	
			
		
		//Setup event handler for CHECK button
		$('.sortword-multi-rw > .buttons-rw > .check').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			var result = self.checkMultiSort($parentobj);
			AIE.Qaa.UserResultStorage.saveSortWordMultiObject($parentobj, result);
			return;
		});	
		
		//TRY AGAIN EVENT HANDLER
		$('.sortword-multi-rw  > .buttons-rw > .reset').click(function(){
			$parentobj = $(this).parents('.qaa-rw');
			self.resetSortMulti($parentobj);
			AIE.Qaa.UserResultStorage.resetSortWordMultiObject($parentobj);
			
		});	
		
		$('.sortword-multi-rw .option-source .ui-draggable').each( function(index) {
			//var association_id= $(this).attr("id")
			AIE.Qaa.SortWords.save_tap_results(this);
		});
	},
	
	checkMultiSort: function(parentobj) {
		$parentobj = $(parentobj);
		var eval_status = true;
		$(".qaa-item > .option-target > li ", $parentobj).each(function(index){
			var res = {};
			var user_answer = "";
			$("span", $(this)).each(function(){
				user_answer = user_answer + $(this).text() + " ";
			});
			var questioncontrol = $parentobj.find(".question-control > .answer-map");
			var curr_answer_map_ol = questioncontrol[index];
			var answer_text = $(curr_answer_map_ol).find("li").text();
			answer_text = jQuery.trim(answer_text);
			user_answer = jQuery.trim(user_answer);
			if (answer_text != user_answer) {
				eval_status = false;
				$(this).addClass("wrong");
			} else {
				$(this).addClass("correct");
			}
			
			AIE.Qaa.showFeedback($parentobj, eval_status);
		});	
		return eval_status;
	},
	
	resetSortMulti: function(parentobj) {
		$parentobj = $(parentobj);
		$(".qaa-item > .option-target > li", $parentobj).each(function(index){
			$(this).html("&#160;");
			$(this).removeClass("correct");
			$(this).removeClass("wrong");
			$(this).removeClass("selected-aie");
		});
		
		/* AIE.Qaa.resetDAD($parentobj); 
		$(".qaa-item > .option-target > li", $parentobj).html("&#160;");
		$(".qaa-item > .option-target > li", $parentobj).removeClass("correct");
		$(".qaa-item > .option-target > li", $parentobj).removeClass("wrong");
		$(".qaa-item > .option-target > li", $parentobj).removeClass("selected-aie"); */
		
		$parentobj.find(".feedback-messages").hide();
		$(".qaa-item > .option-source > li ", $parentobj).each(function(index){
			$("span", $(this)).each(function(){
				$(this).removeClass("aieapp-dropped");
				$(this).css({top:'0px',left:'0px'});
				$(this).show();
				
			});
		});
	},
	
	save_tap_results: function(elem) {
		$(elem).click( function() {
			$('.sortword-multi-rw .option-source .ui-draggable').removeClass("selected-aie")
			$(elem).addClass("selected-aie");
		 	var flag = 1;
			var source_target= true;
			var source = elem;
			var src_id =  $(elem);
			 
			$(elem).parents('.qaa-item').find('.option-target .ui-droppable').unbind();
			$(elem).parents('.qaa-item').find('.option-target .ui-droppable').bind( "click", function(e) { 
				var target_id = $(e.target).attr('id');
				var topy = $(e.target).parent().css("top");
				var offset = $(e.target).parent().position();
				$(e.target).addClass('selected-aie');
			    src_id.addClass('aieapp-dropped');
			    if(flag==1){
				var text = src_id.text();
				$(this).append("<span>" + text + "</span>");
				src_id.css({top:'0px',left:'0px'});
				src_id.hide();
				flag=0
				}
			});					
		});
	}
};

AIE.Qaa.Grouping = {
	init:function() {
		var self = this;
		// initialize tap-tap event
		self.groupingTap();
		// generate index numbers for source LI items and asign into the data-i attribute
		$('.grouping-rw .option-source li').each(function(index){
			var index = index+1;
			var indclass = 'i'+index;
			$(this).attr('data-i',indclass);
		});
		// generate index numbers for target LI items and asign into the data-i attribute
		$('.grouping-rw .option-target').each(function(index){
			var index = index + 1;
			$(this).attr('data-t', 't'+index);
		});
		// draggable event handler
		$('.grouping-rw .option-source li').draggable({
			revert:'invalid'
		});
		// we have an placeholder LI with class x inserted into the target OL as to make valid xhtml for epub
		// so we want to remove that x li before user drops the source items to the target
		$('.grouping-rw .option-target').find('li.x, li.x-rw, li.variable-rw, li.guide-rw').remove();
		// dropable event handler
		$('.grouping-rw .option-target').droppable({
			drop:function(event,ui){
				var item = $(ui.draggable).clone();
				var t = $(this).attr('data-t');
				$(ui.draggable).css({'top':'0px', 'left':'0px'}).hide().addClass('dropped__'+t);
				$(item).removeAttr('style').removeClass('ui-draggable');
				$(this).prepend(item);
			}
		});
		// check answer event handler
		$('.grouping-rw .check').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			var result = self.checkGroupingAnswer($parentobj);
			AIE.Qaa.UserResultStorage.saveGroupingObject($parentobj, result);
			return;
		});
		// try again event handler
		$('.grouping-rw .try-again').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			self.tryAgain($parentobj);
		});
		// reset event handler
		$('.grouping-rw .reset').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			self.reset($parentobj);
			AIE.Qaa.UserResultStorage.resetGroupingObject($parentobj);
		});
	},
	checkGroupingAnswer:function(parentobj) {
		$parentobj = $(parentobj);
		
		var eval_status = true;
		
		// check total number of cource items
	        var sourceitem = $parentobj.find('.option-source li').length;
		
		// variable for checking total number of target items being dropped into target block
		var targetitem = 0;
		
		// answer is checked with the following:
		// 1. all the source items most be dropped to the target box
		// 2. if the source item count and correct items count is equal
		// 3. and then checks if correct length is equal to source and target items
		// then answer is returned true
		var answer = false;
		
		//var eval_status = true;
		
		// checking and handling number of grouping target boxes
		$parentobj.find('.option-target').each(function(index){
			var index = index + 1;
			// update target items counts from each group target block
			targetitem = parseInt(targetitem + $(this).find('li').length);
			
			// first add wrong class to all the items inside the group target block
			$(this).find('li').addClass('wrong');
			// now add correct class to the items which are dropped into the right target block
			// and remove the wrong class if they're correct
			$(this).find('.g'+(index)).addClass('correct').removeClass('wrong');
			// check the lenghth of the wrong items
			var wronglength = $(this).find('.wrong').length;
			// now check and return the answer flag
			if(wronglength>0) {
				answer = false;
			} else {
				answer = true;
			}
		});
		// checks the actual answer and shows the feedback message
		// if answer flag is true and source and target item is equal
		// then answer is correct and correct feedback message is displayed
		if (answer && sourceitem == targetitem) {
			eval_status = true;
		} else {
			eval_status = false;
		}
		AIE.Qaa.showFeedback($parentobj, eval_status);
		return eval_status;
	},
	tryAgain:function($parentobj) {
		// grouping try again event handler
		$('.grouping-rw .option-target .wrong').each(function(){
			var item = $(this).attr('data-i');
			// removes the wrong items from the group target box
			$('.grouping-rw .option-target [data-i="'+item+'"]').remove();
			// and shows the appropriate items in the group source box
			$('.grouping-rw .option-source [data-i='+item+']').show();
		});
		$parentobj.find(".feedback-messages").hide();
	},
	reset:function($parentobj) {
		// grouping reset event handler
		// empty all the group target blocks
		$('.grouping-rw .option-target').empty();
		// and show all the items in the group source blocks
		$('.grouping-rw .option-source li').show();
		$parentobj.find(".feedback-messages").hide();
	},
	groupingTap:function() {
		// grouping tap-tap event handler
		// select a source item each time
		$('.grouping-rw .option-source li').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			$parentobj.find('.option-source li').removeClass('selected-aie');
			$(this).addClass('selected-aie');
		});
		// drop the selected source item into the group target block
		$('.grouping-rw .option-target').click(function(){
			var $parentobj = $(this).parents('.qaa-rw');
			var item = $('.option-source').find('.selected-aie').clone();
			var t = $(this).attr('data-t');
			$parentobj.find('.option-source .selected-aie').hide().addClass('dropped__'+t);
			$(this).prepend(item);
			$parentobj.find('.option-source li, .option-target li').removeClass('selected-aie');
		});		
	},
};

$(document).ready(function() {
	try{		
		AIE.Qaa.TextMatch.dragItems();
		AIE.Qaa.init();
	}catch(e){
		console.log(e);
	}
});
