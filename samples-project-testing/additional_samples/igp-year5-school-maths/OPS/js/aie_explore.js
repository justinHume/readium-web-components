// Copyright 2011 Infogrid Pacific. All rights reserved
// AZARDI Interactive Engine

//Define the namespace
var AIE = AIE || {};

AIE.Explore = {
	leftkeydown: false,
	animation4:function(){
			//on keydown
			var interval = 0;
			$(document).keydown(function(e){
				//if left arrow key down
				if(e.which == 37) {
 				AIE.Explore.leftkeydown = true;
					if (interval == 0) interval = AIE.Explore.startAnimation(); 
				}		
			}).keyup(function(e){
				if(e.which == 37) {
					AIE.Explore.leftkeydown = false;
				}
			});
		},
	startAnimation:	function ()
		{
			var positionLeft = 0;
			var FPS = 10;
			var interval = setInterval(function() {
				if(AIE.Explore.leftkeydown)
				{ 
					positionLeft = parseInt(positionLeft); 
					positionLeft = positionLeft - 100;
					positionLeft = positionLeft.toString();
					positionLeft = parseInt(positionLeft);
					if(positionLeft == -1000) positionLeft = 0;
					positionLeft = positionLeft.toString(); 
					$('.anim-object4').css("background-position", positionLeft+"px 0px");
				}
			},1000/FPS);
			return interval;
		}
		
};


$(document).ready(function() {
	//Temp test.
	AIE.utils.log("Explore JS loaded for this page <br/>");
	AIE.Explore.animation4();
	
})
