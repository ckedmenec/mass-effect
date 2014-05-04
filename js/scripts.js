
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

});


$(document).ready(function(){
  $('section[data-type="background"]').each(function(){
    var $bgobj = $(this); // assigning the object
 		var $window = $(window)
    $(window).scroll(function() {
      var yPos = -($window.scrollTop() / $bgobj.data('speed')); 
       
      var coords = '50% '+ yPos + 'px';
      
      $bgobj.css({ backgroundPosition: coords });
    }); 
  });    
});