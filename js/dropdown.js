$('document').ready(function(){

// set_selected($('.dropdown-item').first());

$( ".dropdown-component").each(function(e) {
  	var first_item = $(this).find('.dropdown-item').first();
	set_selected($(first_item));
});

$('.dropdown-item').click(function(e) {
	set_selected($(this));
});

function set_selected(selected_item){
	selected_item.siblings('.dropdown-item').removeClass('dropdown-item-selected');
    selected_item.addClass('dropdown-item-selected');
	selected_item.parent().siblings('.dropdown-button').first().children('span').text(selected_item.text());
}

$('.dropdown-button').click(function(e) {
	$(this).siblings('.dropdown-list').toggleClass('open');
});

/* Anything that gets to the document will hide the dropdown */
$(document).click(function(){
	$('.dropdown-list').removeClass('open');
});

/* Clicks within the dropdown won't make it past the dropdown itself */
$(".dropdown-component").click(function(e){
  e.stopPropagation();
});

});