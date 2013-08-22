//var myScroll = []
function loaded() {
	  $('.panel-sliding-rw, .panel-tutorial-rw').each(function (index) {
	      new iScroll($(this).attr('id'), {
	        snap: true,
		momentum: false,
		hScrollbar: false,
		vScrollbar: false,
		onScrollEnd: function () {
			document.querySelector('#indicator > li.active').className = '';
			document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
		}
		
		});
	   });
	   
	$('.panel-scrolling-rw').each(function (index) {
	      new iScroll($(this).attr('id'), {
		      //hScrollbar: false,
			//vScrollbar: false,
		      });
	   });
	   //console.log(iScroll)
}
function PanelAutoSlide() {
	$('.panel-auto-sliding-rw > ul').slidesjs({
        //width: 600,
        //height: 500,
        play: {
          active: true,
          auto: true,
          interval: 4000,
          swap: true,
	  effect: 'fade',
	  pauseOnHover: true,
        },
	navigation: {
	  active: false,
	  effect: "fade"
        },
        pagination: {
	  active: false,
          effect: "fade"
        },
	effect: {
          fade: {
            speed: 1000,
          }
	  }
      });
}
//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//document.addEventListener('DOMContentLoaded', loaded, false);
$(document).ready(function() {
	//loaded();
	setTimeout(function(){loaded()},5);
	//setTimeout(function(){PanelAutoSlide()},5);
	PanelAutoSlide();
});