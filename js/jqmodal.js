/**
 * This is the popup jQuery plugin. Here's some examples.
 * 
 * defaults:
 *
 * {
 *		  //Whether the background darkens or not.
 *		  modal               : true,
 *		  //The style of the popup window (currently either default or dark).
 *		  backgroundStyle     : 'default',
 *		  //The html to be entered into the popup window.
 *		  html                : '',
 *		  //The name of the popup window (used for styling, selected with #popup.className)
 *		  className           : '',
 *		  //The href of the html if on a different file (don't use this and html together)
 *		  src                 : '',
 *		  //An array of selectors that, when clicked, will close the popup window.
 *		  closingSelectors    : [],
 *		  //Whether clicking the background will close the popup or not. default true
 *		  backgroundClose     : true
 *		  //Determine the id of the popup window
 *		  popupId             : 'popup'
 *		  //The id of the popup background
 *		  backgroundId        : 'popupback'
 * };
 *
 * Create a popup with default parameters:
 *
 *  //Bind a link or a button to call the popup window.
 *	$('#open').jqmodal({
 *			html : '<p>Populates the popup with html<p><p><button id="close">Close</button>',
 * 			closingSelectors : ['#close']
 *		})
 *	});
 *
 *
 *
 **/

(function( $ ){
	//I really like the revealing modual pattern way of setting stuff up, so I sort of set up the methods like that
	var methods = {
		/**
		 * Default init function, called with $(selector).jqmodal();
		 */
		init : function( options, callback ) 
		{
			console.log(options);
			//Binds the button to the popup
			$(this).click(function(e) {
				//Makes sure there's not already a popup there
				if($(options.popupId).length > 0)
				{
					return false;
				}
				e.preventDefault();

				//If the background needs to be darkened
				if(options.modal)
				{
					methods.modal(options.backgroundId);
					//Adds a click-to-close function on the background.
					if(options.backgroundClose)
					{
						methods.closingSelectors($(options.backgroundId), options.popupId);
					}
				}
				//Prepends the body with the popup, and adds the desired background style to it.
				$('body').prepend('<div id="'+options.popupId+'" class="'+options.backgroundStyle+'"></div>');
				//If a name was chosen, add that class name to the popup div.
				if(options.className != '')
				{
					$('#'+options.popupId).addClass(options.className);
				}
				$('#'+options.popupId).hide();
				
				var inner = ''
				if(options.html && options.src)
				{
					//Throws an error if both the html and src options are filled out.
					$.error('Cannot have both html and src declerations in jqmodal, pick one or the other.');
				}
				if(options.html)
				{
					methods.build(options.html, options.closingSelectors, options.popupId, options.backgroundId, callback);
				}
				else if(options.src)
				{
					//$.load() is a little weird because it needs a div to load into. Loading into a hidden dump div allows for the calculations to put it in the middle of the screen to happen after the information is loaded into the popup div.
					$('body').prepend('<div id="dump"></div>');
					$('#dump').hide().load(options.src, function() {
						var html = $('#dump').html();
						$('#dump').remove();
						methods.build(html, options.closingSelectors, options.popupId, options.backgroundId, callback);
					});
				}
			});
		},
		/**
		 * Populates the popup window and positions it in the middle of the screen.
		 */
		build : function( inner, closingSelectors, popupId, backgroundId, callback )
		{
			$('#'+popupId).html(inner);

			//gets the middle positions of the window.
			var leftMarginMinusWidthHalfWay = ($(window).width()/2) - ($('#'+popupId).width()/2);
			var topMarginMinusHeightHalfWay = ($(window).height()/2) - ($('#'+popupId).height()/2);

			$('#'+popupId).css({'left' : leftMarginMinusWidthHalfWay, 'top' : topMarginMinusHeightHalfWay});
			$('#'+popupId).fadeIn(300);

			//If there are any closing selectors chosen, then for each closing selector, bind it to close the popup.
			if(closingSelectors.length > 0)
			{
				for(i in closingSelectors)
				{
					methods.closingSelectors(closingSelectors[i], popupId, backgroundId);
				}
			}

			//The following try binds the tab index to the modal window, but requires jQuery UI to work.
			try {
				var tabPlace = 0;
				//Little known jQuery UI selector, :tabbable. Will find anything that's able to be selected with the tab key.
				var tabArray =  $('#'+popupId).find(':tabbable');
				tabArray[tabPlace].focus();
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
			}
			catch(e)
			{
				//console.log(e.message);
			}
			//If there's a callback, it get's fired here.
			if(callback)
			{
				callback();
			}

		},
		/**
		 * Binds the selected element to close the popup window.
		 */
		closingSelectors : function( element, popupId, backgroundId ) 
		{
			$(element).click(function() {
				if($('#'+popupId).length > 0) { $('#'+popupId).fadeOut(300,function(){$('#'+popupId).remove();}); }
				if($('#'+backgroundId).length > 0) { $('#'+backgroundId).fadeOut(300,function(){$('#'+backgroundId).remove();}); }
				$(window).unbind('keydown');
			});
		},
		/**
		 * Makes the darkened background
		 */
		modal : function(backgroundId) 
		{
			width = $(document).width()+100;
			height = $(document).height()+100;
			
			$('body').prepend('<div id="'+backgroundId+'"></div>');
			
			console.log($('body'));

			$('#'+backgroundId).hide();
			$('#'+backgroundId).fadeIn(300);
			$('#'+backgroundId).width(width);
			$('#'+backgroundId).height(height);
		},
	};

	$.fn.jqmodal = function( options, callback ) {
		//Initial settings
		var settings = {
		  'modal'                : true,
		  'backgroundStyle'      : 'default',
		  'html'                 : '',
		  'className'            : '',
		  'src'                  : '',
		  'closingSelectors'     : [],
		  'backgroundClose'		 : true,
		  'popupId'				 : 'popup',
		  'backgroundId'         : 'popupback'
		};

		if(typeof options == 'object')
		{
			options = $.extend( settings, options );
		}
		return methods.init.apply( this, arguments, callback );
	};

})( jQuery );