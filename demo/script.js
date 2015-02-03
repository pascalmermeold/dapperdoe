$(document).ready(function() {
    $('#dd_container').dapperDoe({
		snippetsPath: 'bootstrap/snippets.html',
		buttonClass: 'btn btn-default',
		buttonOptions: {
			option1: {
				"btn-lg" : "Large",
				"btn-md" : "Medium",
				"btn-sm" : "Small"
			}
		},
		// savePageCallback: function(html, callback) {
		// 	$.ajax('/static_pages/1.json',{
		// 		type: 'POST',
		// 		contentType: 'text/plain',
		// 		data: html
		// 	}).success(function(data) {
		// 		callback();
		// 	}).error(function(data){
		// 		callback();
		// 		alert("The page wasn't saved, error processing the request")
		// 	})
		// },
		// saveImageCallback: function(formdata, callback) {
		// 	$.ajax("/static_images.json",{
		// 		type: 'POST',
		// 		processData: false,
		// 		contentType: false,
		// 		dataType: 'json',
		// 		cache: false,
		// 		data: formdata
		// 	}).success(function(data) {
		// 		callback(data.url)
		// 	}).error(function(data){
		// 		callback(null)
		// 		alert("The image wasn't saved, error processing the request")
		// 	})
		// }
	})
});