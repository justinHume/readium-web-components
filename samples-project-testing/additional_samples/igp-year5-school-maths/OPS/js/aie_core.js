// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine

/*
aie_core.js - AIE module contains the basic common functions and definitions
*/

var AIE = AIE || {};

AIE.AUDIO = "AUDIO";

AIE.utils = {
	/*
	converts the properties from text format to object format
	*/
	convertPropertyStrtoObj: function (s_prop) {
		var propobj = new Object(); 
		var l_prop = [];
		l_prop = s_prop.split(";");
		
		if (l_prop.length < 1) l_prop[0] = s_prop;
		
		for (i in l_prop) {
			p_prop = l_prop[i];
			//replace all the double quotes in the CSS property with nothing
			p_prop = p_prop.replace(/\"/g,"");
			lp_prop =  p_prop.split(":");
			if (l_prop.length > 0) propobj[lp_prop[0]] = lp_prop[1]; 
		}
		return propobj;
	},
	
	log: function(msg) {
		//console.log(msg);
	}
};

AIE.audioutils = {
	playAudio: function (elid, startNoteTime) {	
		//get the DOM object of the audio object
		var audioPlayer = $(elid).get(0);
		try {
			audioPlayer.play();
		}
		catch(e){
			
		}
	},

	stopAudio: function (elid) {	
		//get the DOM object of the audio object
		var audioPlayer = $(elid).get(0);
		try {
			audioPlayer.pause();
			audioPlayer.currentTime = 0;
		}
		catch(e){
			
		}
	},

	pauseAudio: function (elid) {	
		//get the DOM object of the audio object
		var audioPlayer = $(elid).get(0);
		try {
			audioPlayer.pause();
		}
		catch(e){
			
		}
	}
};
/*Common plugin for shuffling elements*/
(function($){
        $.fn.shuffle = function(){
            return this.each(function(){
                var items = $(this).children().clone(true);
                return (items.length) ? $(this).html($.shuffle(items)) : this;
            });
        }
	    $.shuffle = function(arr){
            for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) 
                ;
            return arr;
        }
})(jQuery);

$(document).ready(function() {
	//Global action to remove a Digital Publisher specific class name from src file
	$('body').find('.ctarget').removeClass('ctarget');
});


