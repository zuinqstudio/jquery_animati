/* ----------------------------------------------------------------------------------
  $.animati plugin

  Encoding: UTF-8
  Version:  v0.1
  Authors:  
    Juan G. Hurtado   [hello@juanghurtado.com]
----------------------------------------------------------------------------------
  Table of contents
----------------------------------------------------------------------------------
  1.DEFAULT CONFIG
  2.LOCAL VARS
  3.INIT METHOD
  4.PUBLIC METHODS
    4.1.move_to_next()
    4.2.move_to_prev()
    4.3.move_to($target)
  5.PRIVATE METHODS
    5.1.update_visual_state()
    5.2.clear_timer()
  6.INITIALIZATION
  7.PLUGIN BINDING
---------------------------------------------------------------------------------- */
(function($) {
  $.animati = function(element, options) {
    
    /* =DEFAULT CONFIG
    ------------------------------------------------------------------------------ */
    var defaults = {
		autoStart: true,
		animationTime: 500
    }
    
    /* =LOCAL VARS
    ------------------------------------------------------------------------------ */
    var plugin = this,
		animationsType = new Array('top','bottom','left','right'),
        element = element,
        $element  = $(element),
        $animati  = $element,
		$elements = $element.find('.animati-element'),
		$animations = new Array();
        
    plugin.settings = {};
	plugin.animationTop = 'top';
	plugin.animationBottom = 'bottom';
	plugin.animationLeft = 'left';
	plugin.animationRight = 'right';
    
    /* =INIT METHOD
    ------------------------------------------------------------------------------ */
    plugin.init = function() {
		var ps = plugin.settings = $.extend({}, defaults, options);
		var itemsEncontrados = 0;

		if ($animati.hasClass('processed')) {
			return;
		}

		// 1.- Leemos las posiciones originales de los elementos , el tipo de animacion, el orden y las guardamos
		$elements
			.each(function(index, animatiOrder){
				var item = jQuery(animatiOrder);
				
				//Lo oculto
				item.css('visible', 'hidden');
				
				//Posición
				item.data('top', (item.position().top - $element.position().top));
				item.data('bottom', ($element.outerHeight() - item.outerHeight() - item.data('top')));
				item.data('left', (item.offset().left - $element.offset().left));
				item.data('right', ($element.outerWidth() - item.outerWidth() - item.data('left') ));
				item.data('width', item.width());
				item.data('height', item.height());
				
				//Tipo de animacion
				var regExpType = new RegExp('animati-type-([a-zA-Z]+)');
				var typeTemp = item.attr('class').match(regExpType);
				if(typeTemp != null && animationsType.indexOf(typeTemp[1]) != -1){
					item.data('type', typeTemp[1]);
				}
				
				//Orden de la animcion
				var regExpOrder = new RegExp('animati-order-([0-9]+)');
				var orderTemp = item.attr('class').match(regExpOrder);
				if(orderTemp != null){
					item.data('order', orderTemp[1]);
				}
				
				if(item.data('order') != undefined && item.data('type') != undefined){
					itemsEncontrados++;
				}
				
			});
			
		// 2. Creamos el array de animaciones con todos los elementos en orden
		$animations = new Array(itemsEncontrados);
		
		// 3.- Modificamos todos los elementos para posicionarlos absollutamente
		$element.css({position:'relative', overflow:'hidden'});
		plugin.reset();
			
		// 4.- Lanzamos todas las animaciones en orden
		if(ps.autoStart){
			plugin.start();
		}
      
        // 5.- Mark as processed if everything was fine
        $animati.addClass('processed');
    }
    
    /* =PUBLIC METHODS
    ------------------------------------------------------------------------------ */
	plugin.reset = function(){
		$elements
			.each(function(index, animatiOrder){
				var item = jQuery(animatiOrder);
				var orden = item.data('order');
				var tipo = item.data('type');
				
				//Si no tiene definido order o tipo de animacion, pasamos
				if(orden == undefined || tipo == undefined){
					return;
				}
				
				//Lo recolocamos
				item.css({position:'absolute', width:item.data('width')+"px", height:item.data('height')+"px", visibility: 'hidden'});
				
				//En funcion del tipo de animacion, movemos las cosas donde sean
				if(tipo == plugin.animationTop){
					item.css('top', "-"+(item.data('height')+20)+"px");
					item.css('left', item.data('left')+"px");

				}else if(tipo == plugin.animationBottom){
					item.css('bottom', "-"+(item.data('height')+20)+"px");
					item.css('left', item.data('left')+"px");
					
				}else if(tipo == plugin.animationLeft){
					item.css('left', "-"+(item.data('width')+20)+"px");
					item.css('top', item.data('top')+"px");
					
				}else if(tipo == plugin.animationRight){
					item.css('right', "-"+(item.data('width')+20)+"px");
					item.css('top', item.data('top')+"px");
					
				}else{
					return;
					
				}
				
				//Guardamos la animacion donde corresponda
				$animations[orden] = item;
				
			});
	}
	
	plugin.start = function(){
		plugin.animacionActual = 0;
		plugin.makeNextAnimation();
	}
	
	plugin.makeNextAnimation = function(){
		var $animacion = $animations[plugin.animacionActual];

		if($animacion == null){
			return;
		}

		var tipo = $animacion.data('type');
		
		$animacion.css('visibility', 'visible');

		if(tipo == plugin.animationTop){
			$animacion
				.animate(
					{top : $animacion.data('top')+'px'}, 
					ps.animationTime, 
					function(){ 
						plugin.makeNextAnimation(); 
					});
					
		}else if(tipo == plugin.animationBottom){
			$animacion
				.css('visible', 'visible')
				.animate(
					{bottom : $animacion.data('bottom')+'px'}, 
					ps.animationTime, 
					function(){ 
						plugin.makeNextAnimation(); 
					});
		}else if(tipo == plugin.animationLeft){
			$animacion
				.css('visible', 'visible')
				.animate(
					{left : $animacion.data('left')+'px'}, 
					ps.animationTime, 
					function(){ 
						plugin.makeNextAnimation(); 
					});
			
		}else if(tipo == plugin.animationRight){
			$animacion
				.css('visible', 'visible')
				.animate(
					{right : $animacion.data('right')+'px'}, 
					ps.animationTime, 
					function(){ 
						plugin.makeNextAnimation(); 
					});

		}
		
		plugin.animacionActual++;
	}
    
    /* =PRIVATE METHODS
    ------------------------------------------------------------------------------ */
    
    
    /* =INITIALIZATION
    ------------------------------------------------------------------------------ */
    plugin.init();
  }
  
  /* =PLUGIN BINDING
    ------------------------------------------------------------------------------ */
  $.fn.animati = function(options) {
    return this.each(function() {
      if (undefined == $(this).data('animati')) {
        var plugin = new $.animati(this, options);
        $(this).data('animati', plugin);
      }
    });
  }
})($);