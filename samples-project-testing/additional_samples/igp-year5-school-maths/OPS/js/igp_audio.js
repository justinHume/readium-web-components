function isiPhone(){
	try {
		return (
			//Detect iPhone
			(navigator.platform.indexOf("iPhone") != -1) ||
			//Detect iPod
			(navigator.platform.indexOf("iPad") != -1)
		);
	} catch(err){
		return false;
	}
}

//Register the event handler for audio play and pause
$(document).ready(function(){	
	var content_orignal = $("#rw-block-general_47748-113481101").html();
	$('.audio-inline-rw img').addClass('play');
	$('.audio-block-rw img').addClass('play');
   
   
   
   
   if (isiPhone() == false) {
   
	    $('.audio-inline-rw').bind("click", function(e){
	        var $target = $(this).find('img');
		
	        var audio_obj = $(this).find('audio').get(0);
	        
			$(audio_obj).bind('timeupdate',function(event){
				var curr_time = $(this).get(0).currentTime;
				var duration = $(this).get(0).duration;
				if(curr_time >= duration){
					//audio finished playing. set the class
					$(this).parent('.audio-inline-rw').find('img').removeClass("stop").addClass("play");
					$(audio_obj).unbind('timeupdate');
				} else {
					$(this).parent('.audio-inline-rw').find('img').removeClass("play").addClass("stop");
				}
			});
		
			if (audio_obj.play) { 
				if ($target.hasClass('play')) { 
					if(audio_obj.currentTime) audio_obj.currentTime=0;
					audio_obj.play();
					$target.removeClass("play").addClass("stop");    
				}
				else {
					$(audio_obj).unbind('timeupdate');
					audio_obj.pause();
					$target.removeClass("stop").addClass("play");
				}
			}
	    });
    
    }
    
    
    
       if (isiPhone()) {
   		
	    $('.audio-inline-rw').live("touchstart  ", function(e){
	        var $target = $(this).find('img');
		
	        var audio_obj = $(this).find('audio').get(0);
	        
			$(audio_obj).bind('timeupdate',function(event){
				var curr_time = $(this).get(0).currentTime;
				var duration = $(this).get(0).duration;
				if(curr_time >= duration){
					//audio finished playing. set the class
					$(this).parent('.audio-inline-rw').find('img').removeClass("stop").addClass("play");
					$(audio_obj).unbind('timeupdate');
				} else {
					$(this).parent('.audio-inline-rw').find('img').removeClass("play").addClass("stop");
				}
			});
		
			if (audio_obj.play) { 
				if ($target.hasClass('play')) { 
					if(audio_obj.currentTime) audio_obj.currentTime=0;
					audio_obj.play();
					$target.removeClass("play").addClass("stop");    
				}
				else {
					$(audio_obj).unbind('timeupdate');
					audio_obj.pause();
					$target.removeClass("stop").addClass("play");
				}
			}
	    });
    
    }
    
    
    
    
    
	if (isiPhone() == false) {
		$('.audio-block-rw').bind("click", function(e){ 
			if(!$(this).hasClass('track')) {
					if($('.audio-block-rw').hasClass('track')) {
						$('.track').each( function(index) {
							var audio_track = $(this).find('audio').get(0);
							$(audio_track).unbind('timeupdate');
							audio_track.pause();
							$(this).removeClass('track').addClass("play");
							$(this).find('img').removeClass('stop').addClass("play");
	
						});
					}
				}
			var $target = $(this).find('img');
			var audio_obj = $(this).find('audio').get(0);
				
			$(audio_obj).bind('timeupdate',function(event){
				var curr_time = $(this).get(0).currentTime;
				var duration = $(this).get(0).duration;
				
				if(curr_time >= duration){ 
					//audio finished playing. set the class
					$(this).parent('.audio-block-rw').find('img').removeClass("stop").addClass("play");
					$(audio_obj).unbind('timeupdate');
				} else {
					$(this).parent('.audio-block-rw').find('img').removeClass("play").addClass("stop");
				}
				
			});
			
				
			if (audio_obj.play) {
				if ($target.hasClass('play')) {
					if(audio_obj.currentTime) audio_obj.currentTime=0;
					audio_obj.play();
					$target.removeClass("play").addClass("stop");
					$target.parent(".audio-block-rw").addClass("track");
				}
				else {
					$(audio_obj).unbind('timeupdate');
					audio_obj.pause();
					$target.removeClass("stop").addClass("play");
					$target.parent(".audio-block-rw").removeClass("track");
					
					
				}
			}
		});
	}


	
		function playNewTrack(trackImg, audio_obj, $target){
		
		$(audio_obj).bind('timeupdate',function(event){
// 				
				var curr_time = $(this).get(0).currentTime;
				var duration = $(this).get(0).duration;
				if(curr_time >= duration){
					//audio finished playing. set the class
					$(this).parent('.audio-block-rw').find('img').removeClass("stop").addClass("play");
					$(audio_obj).unbind('timeupdate');
				} else {
					$(this).parent('.audio-block-rw').find('img').removeClass("play").addClass("stop");
				}
				
			});
			
			if ($target.hasClass('play')) {
						audio_obj.play();
						console.log("play  " )
						$target.removeClass("play").addClass("stop");
						$target.parent(".audio-block-rw").addClass("track previous");
					}
					else {
						$(audio_obj).unbind('timeupdate');//alert("iui")
						audio_obj.pause();
						console.log("stop ")
						$target.removeClass("stop").addClass("play");
						$target.parent(".audio-block-rw").removeClass("track ");
					}
					
				return false;
	}
	
	if (isiPhone()) {
		//Click event stops working on ipad once iscroll takes over
		//So implementing a touchend to handle this
		//$('.audio-block-rw').unbind("touchend");
		$('.audio-block-rw').live("touchstart  ", function(e){
			
			var audio_obj = $(this).find('audio').get(0);
			 var $target = $(this).find('img');
		if(!$target.parent(".audio-block-rw").hasClass('track')) {
				 playNewTrack($(this), audio_obj, $target);
			
			}
	
 			else{
			 	playNewTrack($(this), audio_obj, $target);
			 	}
		},false);
	}
});

//Plays a audio specified by audioref. 
//audio ref must be the id of a existing <audio> tag
//button represent the DOM element of object that called this function
function playAudio(button, audioref){
	var audio_obj = $('#'+audioref).get(0);
	if (audio_obj.paused) {
		 audio_obj.play();
		 $(button).removeClass("playsound").addClass("pausesound");
	}else {
		audio_obj.pause();
		audio_obj.currentTime=0;
		$(button).removeClass("pausesound").addClass("playsound");
    }
}


audio_state_tracker = function(){

	return {
		pauseCurrentActiveAudio : function(){},
		setActiveAudio : function(){},
		stopActiveAudio : function(){},
	}
}();


//Plays a audio specified by audioref. Does not handle button state
function playSFX(button, audioref){
	var audio_obj = $('#'+audioref).get(0);
	if(audio_obj.currentTime) audio_obj.currentTime = 0;
	audio_obj.play();
}
