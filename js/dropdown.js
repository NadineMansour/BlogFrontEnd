$('document').ready(function(){

set_selected($('.dropdown-item').first());
$('.dropdown-item').click(function(e) {
	set_selected($(this));
});

function set_selected(selected_item){
	$('.dropdown-item').removeClass('dropdown-item-selected');
    selected_item.addClass('dropdown-item-selected');
	$('.dropdown-button span').text(selected_item.text());
}

$('.dropdown-button').click(function(e) {
	$('dropdown-list')
});

});