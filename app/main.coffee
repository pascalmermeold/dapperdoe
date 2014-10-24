# coffee -o src/ -cw app/


$ ->
	$('#dd_container').dapperDoe({
		templateName: 'bootstrap'
		buttonClass: 'btn'
		buttonOptions:
			option1:
				"btn-default" : "Default"
				"btn-primary" : "Primary"
			option2:
				"btn-lg" : "Large"
				"btn-md" : "Medium"
				"btn-sm" : "Small"
	})