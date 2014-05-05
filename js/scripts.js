
$(document).ready(function () {
	
	$(document).scroll(function () {
		pageWidth = 960
		var leftPosition = $(window).scrollLeft()
    var windowWidth = $(window).width()
    var maxLeftPosition = pageWidth - windowWidth

    if (windowWidth < pageWidth && leftPosition > 0) {
      if (leftPosition < maxLeftPosition){
        $("header, .player").css({left: (- leftPosition) + "px"})
      } else {
        $("header, .player").css({left: (- maxLeftPosition) + "px"})
      }
    } else {
      $("header, .player").css({left: "0px"})
    	return
  	}
	})
  var merp = new ParallaxScroll();
});
