

		$("#sec-1").click(function() {
           $('html, body').animate({
               scrollTop:        $("#home").offset().top-66
           }, 1000);
        return false;
       });
      
      $("#sec-2").click(function() {
           $('html, body') .animate({
               scrollTop:        $("#about").offset().top-112
           }, 1000);
        return false;
       });
      
      $("#sec-3").click(function() {
           $(' html,body') .animate({
               scrollTop:        $("#experience").offset().top-112
           }, 1000);
        return false;
       });
      
      $("#sec-4").click(function() {
        $(this).addClass("active");
           $('html,body ') .animate({
               scrollTop:        $("#projects").offset().top-112
           }, 1000);
        return false;
       });
	   
	   