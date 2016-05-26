$(function(){
  $(window).resize(infinite);
  function infinite() {
    var htmlWidth = $('html').width();
    if (htmlWidth >= 1080) {
      $("html").css({
        "font-size" : "42px"
      });
    } else {
      $("html").css({
        "font-size" :  42 / 1080 * htmlWidth + "px"
      });
    }
  }infinite();
});


/*var htmlSize = function(){
    var htmlFont = Math.ceil(screen.width*100/750); 
    $('html').css('font-size',htmlFont+'px');
}
htmlSize();
window.addEventListener('resize',function(){
    htmlSize();
})*/