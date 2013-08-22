$(document).ready(function(){
	$('.block-control-rw').remove();
	// PopUp Footnotes, Notes ===================================================
	$('a.xx').click(function(){
		var epubtype = $(this).attr("epub:type");
		if (epubtype == "noteref") {
		var popidref = $(this).attr('href');
		var copy = $(popidref).clone(true);
		var poptemp = '<div class="azardi-popup" />'
		$('.azardi-popup').remove();
		$(this).after(poptemp);
		$('.azardi-popup').html(copy);
		//alert(popcontent);
		
		var wwidth = $(window).width();
		var wheight = $(window).height();
		var powidth = $('.azardi-popup').outerWidth();
		var poheight = $('.azardi-popup').outerHeight();
		
		var offset = $(this).offset();
		$('.azardi-popup').css('left',offset.left);    
		$('.azardi-popup').css('top',offset.top+20);
		// shift the left offset postion of pop up block out of visible area
		var leftoffset = offset.left + powidth;
		if(leftoffset > wwidth) {
			$('.azardi-popup').css('left',offset.left-powidth);
		}
		
		// shift the top offset postion of pop up block out of visible area
		var topoffset = offset.top + poheight;
		//alert(wheight)
		
		if(topoffset > wheight) {
			$('.azardi-popup').css('top',offset.top-poheight);    
		} 
		return false;
		}
	});
	$(".azardi-popup aside a[href]").click(function(){
		return false;
	});
	
	$("body").click(function() {
		$('.azardi-popup').remove();
	}); 
	$(".azardi-popup").click(function(event){
		 event.preventDefault();
		 return false;
	});

	// PopUP Text ===================================================
	$('.ref-popup-rw').click(function(){
		var popupref = $(this).attr("data-popup-target");
		$('.ref-popup-rw').next('.popup-text-rw').remove();
		$(this).after($('#'+popupref).clone());
		$(this).next('.popup-text-rw').show();
		
			var wwidth = $(window).width();
			var wheight = $(window).height();
			var powidth = $('.popup-text-rw').outerWidth();
			var poheight = $('.popup-text-rw').outerHeight();
		
			var offset = $(this).offset();
			var docleftoffset = $(document).scrollLeft();
			
			$('.popup-text-rw').css('left',offset.left);    
			$('.popup-text-rw').css('top',offset.top+20);
			// shift the left offset postion of pop up block out of visible area
			var leftoffset = offset.left + powidth;
			if(leftoffset > (docleftoffset + wwidth)) {
				$('.popup-text-rw').css('left',offset.left - (powidth));
			}
		
			// shift the top offset postion of pop up block out of visible area
			var topoffset = offset.top + poheight;
		
			if(topoffset > wheight) {
				$('.popup-text-rw').css('top',offset.top-poheight);    
			} 
		return false;
	});
	
	$(".galley-rw").click(function() {
		$('.ref-popup-rw').next('.popup-text-rw').remove();
	}); 
	/*
	$("body").on('click', '.popup-text-rw', function(event){
		 event.preventDefault();
		 return false;
	});
	*/
	// Reveal ===================================================
	$('.ref-reveal-rw').click(function(){
		var elements = $(this).parent('p, h1, h2, h3, h4, h5, h6, li, div');
		var revealtar = $(this).attr("data-reveal-target");
		if($(this).hasClass('active') == false) {
			$('.ref-reveal-rw').removeClass('active');
			$(this).addClass('active');
			$(this).closest(elements).after($('#'+revealtar).clone(true).end().show());
			var blh = $('#'+revealtar).outerHeight();
			$(this).closest(elements).next($('#'+revealtar).css({'height': '1px','overflow':'hidden',}).animate({height: blh,}, 250));
			
		} else if ($(this).hasClass('active') == true) {
			$('.ref-reveal-rw').removeClass('active');
			$(this).closest(elements).next('#'+revealtar).animate({height: '1px',},250, function() {$(this).hide().removeAttr('style');});
			$(this).removeClass('active');
		}
	});
	
	// Popup Panel
	$('.ref-panel-popup-rw').click(function(){
		var pptarget = $(this).attr("data-pp-target");
		$('body > #'+pptarget).remove();
		$('body').prepend($('#'+pptarget).clone());
		$('body > #'+pptarget).prepend('<button onclick="$(this).parent().remove();" class="ppclose" style="float:right;">X</button>');
		$('body > #'+pptarget).show();
	});
	
	ProcessPopup2Link();
	/*
	$('a').click(function(){
		var reftype = $(this).attr('epub:type')
		var refid = $(this).attr('href');
		var asidetype = $(refid).attr('epub:type');
		var asideid = $(refid).attr('id');
		alert(reftype+'/' +refid+'/'+asidetype+'/'+asideid);
	});
	*/
});

function ProcessPopup2Link() {
	var isiPad = navigator.userAgent.match(/iPad/i) != null || navigator.userAgent.match(/iPhone/i) != null || navigator.userAgent.match(/iPod/i) != null;
	if(isiPad) {
		$('span.ref-popup-rw').each(function(){
			$(this).attr('epub:type', 'noteref');
			var href = $(this).attr('data-popup-target');
			$(this).attr('href', '#'+href);
			
			var atag = '<a class="ref-popup-rw" id="ref_'+href+'" href="#'+href+'">'+$(this).text()+'</a>';
			$(this).after(atag);
			$(this).next('a').attr('epub:type', 'noteref');
			$(this).remove();
		});
		
		$('.popup-text-rw').each(function(index){
			var ID = $(this).attr('id');
			//var href = $('.ref-popup-rw:eq('+index+')').attr('id');
			$(this).find('h4').wrapInner('<a href="#ref_'+ID+'" />')
			//$(this).wrap('<aside class="wrapper" id="'+ID+'" />');
			//$(this).attr('id', 'popup'+index);
			//$(this).parent('aside').attr('epub:type', 'footnote');
		});
	}
}