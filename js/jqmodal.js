/**
 * This is the popup jQuery plugin. Here's some examples.
 * 
 * defaults:
 *
 * {
 *	 'modal' : true,      //True for showing lightbox fadeout div, false for no background.
 *	 'backgroundStyle'       : 'light',   //'light' for a white popup, 'dark' for a black one
 * };
 *
 * Create a popup with default parameters:
 *
 *	$('#button').popup(function() {
 *		$('#popup').html('<button id="test">test</button>'); //Populated the html of the popup.
 *		$('#test').popup('close'); //When the user clicks on the #test button, the popup will close.
 *	});
 *
 **/

(function( $ ){

	var methods = {
		init : function( options, callback ) 
		{
			$(this).click(function(e) {
				e.preventDefault();
				if(options.modal)
				{
					methods.modal();
					methods.closingSelectors($('#popupback'));
				}
				$('body').prepend('<div id="popup" class="'+options.backgroundStyle+'"></div>');
				if(options.className != '')
				{
					$('#popup').addClass(options.className);
				}
				$('#popup').hide();
				
				var inner = ''
				if(options.html)
				{	
					methods.build(options.html, options.closingSelectors);
				}
				else if(options.src)
				{
					$('body').prepend('<div id="dump"></div>');
					$('#dump').hide().load(options.src, function() {
						methods.build($('#dump').html(), options.closingSelectors, callback);
						$('#dump').remove();
					});
				}
			});
		},
		build : function( inner, closingSelectors, callback )
		{
			$('#popup').html(inner);

			var leftMarginMinusWidthHalfWay = ($(window).width()/2) - ($('#popup').width()/2);
			var topMarginMinusHeightHalfWay = ($(window).height()/2) - ($('#popup').height()/2);

			$('#popup').css({'left' : leftMarginMinusWidthHalfWay, 'top' : topMarginMinusHeightHalfWay});
			$('#popup').fadeIn(300);

			if(closingSelectors.length > 0)
			{
				for(i in closingSelectors)
				{
					methods.closingSelectors(closingSelectors[i]);
				}
			}
			var tabPlace = 0;
			var tabArray =  $('#popup').find(':tabbable');
			$(window).keydown(function(e) {
			   var code = e.keyCode || e.which;
			   if (code == '9') {
			   		if(e.shiftKey)
			   		{
			   			tabPlace--;
				   		if(tabPlace == -1)
				   		{
				   			tabPlace = (tabArray.length-1);
				   		}
			   		}
			   		else
			   		{
				   		tabPlace++;
				   		if(tabPlace == tabArray.length)
				   		{
				   			tabPlace = 0;
				   		}			   			
			   		}
			   		tabArray[tabPlace].focus();
				   return false;
			   }
			});
			if(callback)
			{
				callback();
			}

		},
		closingSelectors : function( element ) 
		{
			$(element).click(function() {
				if($("#popup").length > 0) { $("#popup").fadeOut(300,function(){$('#popup').remove();}); }
				if($("#popupback").length > 0) { $("#popupback").fadeOut(300,function(){$('#popupback').remove();}); }
				$(window).unbind('keydown');
			});
		},
		modal : function() 
		{
			width = $(document).width()+100;
			height = $(document).height()+100;
			
			$('body').prepend('<div id="popupback"></div>');
			
			$('#popupback').hide();
			$('#popupback').fadeIn(300);
			$('#popupback').width(width);
			$('#popupback').height(height);
		},
		loader : function( text )
		{
			methods.init({
					modal : false,
					backgroundStyle : 'dark',
				}, function() {
					$('#popup').addClass('loading_popup');
					$('#popup').html('<span id="loading">'+text+'</span> <div class="inline" id="loading_image"><div id="bowlG"><div id="bowl_ringG"><div class="ball_holderG"><div class="ballG"></div></div></div></div></div>');	
			});	
		}
	};

	$.fn.jqmodal = function( method, options ) {
		var settings = {
		  'modal'                : true,
		  'backgroundStyle'      : 'light',
		  'html'                 : '',
		  'name'                 : '',
		  'src'                  : '',
		  'closingSelectors'     : [],
		};

		var privateMethods = [
			'modal',
		];

		// Method calling logic
		if ( methods[method] ) 
		{
			if($.inArray(method, privateMethods) < 0)
			{
				return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			}
			else
			{
				$.error( 'Method ' +  method + ' does not exist on jQuery.popup' );
			}
		} 
		else if ( typeof method === 'object' || ! method ) 
		{
			if(typeof method == 'object')
			{
				method = $.extend( settings, method);
			}
			else
			{
				var temp = new Array();
				temp.push(settings);
				temp.push(arguments[0]);
				arguments = temp; 
			}
			return methods.init.apply( this, arguments );
		}
		else 
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    
	};

})( jQuery );