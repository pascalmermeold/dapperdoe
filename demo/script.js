$(document).ready(function() {
	window.app = new DapperDoe.App({
		topElement: $('#dd_container'),
		snippetsPath: 'bootstrap/snippets.html',
		buttonClass: 'btn btn-default',
		buttonOptions: {
			option1: {
				"btn-lg" : "Large",
				"btn-md" : "Medium",
				"btn-sm" : "Small"
			}
		},
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
})