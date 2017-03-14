var input = $('input');
input.each(function(){
    $(this).data('default', $(this).val());
}).focus(function(){
    if($(this).val() == $(this).data('default')){
        $(this).val("");
    }            
}).blur(function(){
    if(!$(this).val()){
        $(this).val($(this).data('default'));
    }
}).keypress(function (e) {
  if (e.which == 13) {
    //Enter is pressed
    if($(this).val()){
    	addComment($(this).val());
    }
    return false;    
  }
});  


//Method to ad a new comment to the list
function addComment(comment) {
    console.log(comment);
    var text = '<li>'+
					'<div class="comment-container">'+
						'<div class="comment-img"><img src="images/tony.jpg" class="comment-img"></div>'+
						'<div class="comment-text">'+
							'<div class="comment-header">'+
								'<p class="comment-name">TONY STARK</p>'+
								'<i class="fa fa-calendar-o comment-header-text"></i>'+
								'<p class="comment-header-text"> 1 minute ago</p>'+
							'</div>'+
							'<p class="comment-content">'+comment+'</p>'+
						'</div>'+
						'<div class="clear"></div>'+
					'</div>'+		
				'</li>';
	$(".comments-container ul .add-comment-li").before(text);
	$(".comments-container ul .add-comment-li input").val($(this).data('default'));
} 

var displaySearch = false;
$('.header-search-icon').click(function() {
    displaySearch = ! displaySearch;
    if (displaySearch) {
        $(".search-input").css("display", "inline-block");
    } else{
        $(".search-input").css("display", "none");
    }
});

