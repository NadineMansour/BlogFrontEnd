(function($) {
	/*
		Options     data-modifier     default
		
		dots            data-dots              true
		arrows          data-arrows            true
		autoplay        data-autoplay          false
		duration        data-duration          2000             // only relevant if autoplay set to true
		showSlides      data-show-slides       1                // num of slides to show
		showSlidesMed   data-show-slides-med   showSlides       // num of slides to show on med size screen
		showSlidesSml   data-show-slides-sml   showSlidesMed    // num of slides to show on sml size screen
		navClass        data-nav-class         ""               // class to add to slider nav
		arrowClass      data-arrow-class       ""               // class to add to each arrow
		dotClass        data-dots-class        ""               // class to add to dots' CONTAINER
	*/

	var Slider = (function() {
		/*
			Slider Constructor
			@arg element  -> slider dom object
		*/
		function SliderCons(element) {

			this.settings = {
				dots: true,
				arrows: true,
				autoplay: false,
				duration: 2000
			}

			Object.keys(this.settings).forEach(function(key) {
				var override       = element.data(key);
				this.settings[key] = (typeof override !== "undefined") ? override : this.settings[key];
			}.bind(this))

			this.settings.showSlides        = element.data('show-slides') || 1;
			this.settings.showSlidesMed     = element.data('show-slides-med') || this.settings.showSlides;
			this.settings.showSlidesSml     = element.data('show-slides-sml') || this.settings.showSlidesMed;
			this.settings.currentShowSlides = this.settings.showSlides;

			this.settings.navClass   = element.data('nav-class') || "";
			this.settings.arrowClass = element.data('arrow-class') || "";
			this.settings.dotsClass  = element.data('dots-class') || "";


			this.$element = element;

			
			this.totalSlides     = this.$element.find('.slide').length;
			this.currentIndex    = 0;

			this.goTo = this.goTo.bind(this);
			if(!this.resizeIfNeeded()) this.prepare();
		}

		return SliderCons;
	})();


	/*
		Calculates contianer width and slides width
		Adds dots and/or arrows and event listeners
		Starts autoplay if applicable
	*/
	Slider.prototype.prepare = function() {
		this.irregularSlides            = (this.totalSlides % this.settings.currentShowSlides != 0);
		this.lastIndex                  = Math.ceil(this.totalSlides / this.settings.currentShowSlides) - 1;
		this.settings.containerWidth    = Math.ceil(this.totalSlides/this.settings.currentShowSlides);
		this.settings.slideWidth        = (100/this.settings.currentShowSlides)/this.settings.containerWidth;

		this.$element
		    .find('.slides_container')
		    .css('width', (100* this.settings.containerWidth) +"%");

		this.$element
		    .find('.slide')
		    .css('width', this.settings.slideWidth + "%");	

		this.currentIndex--;
		this.goTo({animate: false});	

		if(this.settings.dots || this.settings.arrows) {
				// remove any old navs
				this.$element
					.find('._slider_nav').remove()

				this.$element
			        .append('<div class="_slider_nav '+this.settings.navClass+'"></div>');			
		}

		this._addArrowsIfNeeded();
		this._addDotsIfNeeded();	
	}

	Slider.prototype._addArrowsIfNeeded = function() {
		if(this.settings.arrows) {
			var additionalClass = this.settings.arrowClass;
			var arrowTemplate = function(direction) { 
				return '<span class="_slider_arrow _slider_'+direction+' '+additionalClass+'" data-slide-direction='+ direction+'></span>';
			}

			this.$element.find('._slider_nav')
			             .append(arrowTemplate('left'))
			             .append(arrowTemplate('right'));

			this.$element
			    .find('._slider_arrow')
			    .on('click', this.goTo);
		}
	}

	Slider.prototype._addDotsIfNeeded = function() {
		if(this.settings.dots) {
			var additionalClass = this.settings.dotsClass || "";
			// add dots list element
			var dots = this.$element
			               .find('._slider_nav')
			               .append('<ul class="_slider_dots '+additionalClass+'">')
			               .find('._slider_dots');

			var slidesCount = Math.ceil(this.totalSlides / this.settings.currentShowSlides);

			// add a dot for each slide
			for(var i = 0; i < slidesCount; i++){
				dots.append('<li data-slide-index=' + i + '>');
			}

			// add click handler and add active class to first dot
			dots.find('li')
			    .on('click', this.goTo)
			    .eq(this.currentIndex)
			    .addClass('active');
		}
	}

	Slider.prototype.resizeIfNeeded = function() {
		var isSmall  = matchMedia('only screen and (max-width: 40em)').matches
		var isMedium = matchMedia('only screen and (min-width:40.063em) and (max-width:64em)').matches
		var isLarge  = matchMedia('only screen and (min-width:64.063em) and (max-width:90em)').matches 
		
		var oldShowSlides = this.settings.currentShowSlides;

		switch(true) {
			case isSmall:
				this.settings.currentShowSlides = this.settings.showSlidesSml;
				break;
			case isMedium:
				this.settings.currentShowSlides = this.settings.showSlidesMed;
				break;
			case isLarge:
				this.settings.currentShowSlides = this.settings.showSlides;
				break;
		}

		var shouldResize = this.settings.currentShowSlides != oldShowSlides
		if(shouldResize) {
			// getting index of a visible subslide and convert that to current index system.
			this.currentIndex = Math.floor((this.currentIndex * oldShowSlides) / this.settings.currentShowSlides);
			this.prepare();
		}

		return shouldResize;
	}

	/*
	Changes slide depending on input event
	*/
	Slider.prototype.goTo = function(e) {
		if(e && e.animate === false)
			this.$element.find('.slides_container').toggleClass('_slider_notransition', true);
	

		if(this.settings.autoplay)
			this.stopAutoplayTimer();
		// remove active class from old index dot
		this.$element
		    .find('._slider_dots li')
		    .removeClass('active');

		// update currentIndex to correct index
		this.currentIndex = this.indexFromEvent(e);

		// add active class to dot
		this.$element
		    .find('._slider_dots li')
		    .eq(this.currentIndex)
		    .addClass('active');


		var slideModifier = this.currentIndex;
		if(this.irregularSlides && this.currentIndex == this.lastIndex) {
			//ratio between number of subslides in last slide to number of subslides in a normal slide
			var ratio = ((this.totalSlides % this.settings.currentShowSlides) * 1.0) / this.settings.currentShowSlides;
			slideModifier -= (1 - ratio);
		}	
		// show the correct slide
		this.$element
		    .find('.slides_container')
		    .css('right', slideModifier * 100 + "%");
		
		if(this.settings.autoplay)
			this.startAutoplayTimer();

		// without timeout, the animation goes through even when adding notransition class
		setTimeout(function(){
			this.$element.find('.slides_container').toggleClass('_slider_notransition', false);
		}.bind(this), 100);
		
	}

	Slider.prototype.indexFromEvent = function(e) {
		var direction = 'right'; // e maybe undefined if event triggered by autoplay
		if(e !== undefined && e.animate !== false) {
			var target    = $(e.currentTarget);
			var nextIndex = target.data('slide-index'); // if the element clicked was a dot
			direction     = target.data('slide-direction'); // if the element clicked was an arrow
		}

		if(direction == 'left') {
			nextIndex = this.currentIndex == 0 ? this.lastIndex : this.currentIndex - 1;
		} else if (direction == 'right') {
			nextIndex = this.currentIndex == this.lastIndex ? 0 : this.currentIndex + 1;
		}

		return nextIndex;
	}

	Slider.prototype.stopAutoplayTimer = function() {
		clearInterval(this.autoplayTimer);
	}

	Slider.prototype.startAutoplayTimer = function() {
		this.autoplayTimer = setInterval(this.goTo.bind(this), this.settings.duration);
	}


	$(document).ready(function() {
		$('div[data-slider]').each(function(i, element){
			element._Slider = new Slider($(element));
			element._Slider.settings.lastKnownWidth = document.body.clientWidth;
		})
	})
	window.addEventListener("resize", function(){
		$('div[data-slider]').each(function(i, element){
				element._Slider.resizeIfNeeded();
		})
	})
})(jQuery);
