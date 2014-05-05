function ParallaxScroll () {
	this.initialize();
	this.setupScrollHandlers();
}

ParallaxScroll.prototype.initialize = function () {
	this.$window = $(window)
	this.$document = $(document)

	this.bindEvents();
	this.setupScrollIntervals();
}

ParallaxScroll.prototype.bindEvents = function () {
	window.addEventListener('resize', this);
}

// Handle the events placed on the Parallax object
ParallaxScroll.prototype.handleEvent = function ( event ) {
	if(event.type === "resize")
		this.setupScrollIntervals()
}

ParallaxScroll.prototype.setupScrollHandlers = function () {
	var _this = this;
	_this.scrollIntervals.forEach(function(elem){

		// Reset scroll points
		if ( elem.action ) {
			$(window).unbind( "scroll", elem.action )
		}

		elem.action = function () {
			var $bgobj = $(elem.el);
			var newPos, windowHeight, scrollTop;
			windowHeight = $(window).height();
			scrollTop = $(document).scrollTop();

			if (scrollTop > elem.trigger && scrollTop < elem.trigger + 2 * windowHeight) {
				var yPos = -((scrollTop - elem.trigger - windowHeight) / elem.speed); 
				var coords = '50% '+ yPos + 'px';
				$bgobj.css({ backgroundPosition: coords });
			}
		}
		window.addEventListener( 'scroll', elem.action );
	});  
};

ParallaxScroll.prototype.setupScrollIntervals = function () {
	this.scrollIntervals = [];
	var _this = this;
	
	$('[data-parallax-speed]').each(function(){
		var elem = this;
		_this.scrollIntervals.push({
			el: elem,
			height: $(elem).height(),
			duration: _this.$window.height(),
			speed: $(elem).data("parallax-speed"),
			trigger: $(elem).position().top - _this.$window.height()
		});
	});	
}