#Dapper Doe

Dapper Doe is a static web page generator/editor that makes any html template drag-and-drop editable. It is perfect for allowing people who are not familiar with html to create et edit nice and beautiful webpage. You can use Dapper Doe in your application or as a mini-CMS for simple static websites.

This project is starting and only the most basic features are there, so if you are interested in contributing, let me know!

##How it works

Dapper Doe is a jQuery plugin that parses any html page and makes it easily editable. You must provide the plugin with a template that allows end-users to add new contents to their page. Currently, text and image elements are editable, but there's more to come.

## Intro

**First of all, test Dapper Doe here in order to better understand the rest of this readme : .**

Dapper Doe is based on snippets. A snippet is a chunk of html code that represents an editable and addable block of content. Snippets are available on the right sidebar of the editor and can be dragged into the page. 

The contents of snippets can be edited by clicking on them. Currently, `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<p>`, `<img>` are editable but lists, slideshows, videos will be available soon.

## Getting Started

Here is an example project based on Twitter Bootstrap. Download it if you want to better understand how to make DapperDoe work! : gfdfgdfggf

####Include Dapper Doe js and css files

Dapper Doe depends on jQuery and jQuery UI, so you need to add them too.

	<link href="dapperdoe/dist/dapperdoe.min.css" rel="stylesheet">
	
	<script src="dapperdoe/libs/jquery/jquery.min.js"></script>
    <script src="dapperdoe/libs/jquery/jquery-ui.min.js"></script>
	<script src="dapperdoe/src/dapperdoe.js"></script>
	
####Create snippets

DapperDoe needs to know which are the snippets that can be added and dragged. Create an html file called `snippets.html` listing all the html snippets you want to add to the editor.

Take a look at the file called snippets.html in the example project. As you can see, a snippet in snippets.html looks like this :

	<div data-preview="snippets/jumbotron.png">
		<div class="jumbotron">
      		<div class="container">
        		<h1>Hello, world!</h1>
        		<p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
        		<p><a class="btn btn-primary btn-lg" role="button">Learn more &raquo;</a></p>
      		</div>
    	</div>
	</div>

Add the attribute "data-preview" to make DapperDoe aware that this snippet must be added in the sidebar. The value of `data-preview` is the path to the snippet's image preview.
	
####Call DapperDoe

Call `dapperDoe()` on the element that serves as container for the snippets. Three options are mandatory : the path to the snippets, the callback that will save rendered html and the callback that will save uploaded images :

 	$('#container').dapperDoe({
		snippetsPath: './bootstrap/snippets.html',
		savePageCallback: function(html, callback) {
			saveHtmlSomewhere(html);
			callback();
		}, 
		saveImageCallback: function(formdata, callback) {
			saveImageSomewhere(formdata);
			callback(savedImageUrl);
		}
	});
	
You need to call `callback()` once the page has been saved in `savePageCallback()` to inform DapperDoe the request is finished.

You need to call `callback(savedImageUrl)` once an image has been saved in `saveImageCallback()` to let know DapperDoe the url to use for the image.
	
####That's it!

Just load your page and you will seethe DapperDoe magic appear!

## Options

You can customize DapperDoe UI with some options :

####Color Palette

A default color palette is provided by default. You can customize it by giving DapperDoe the base colors you want to use :

	$('#container').dapperDoe({
		...,
		colorPalette: {
        	'eb6566' : "Cayenne",
        	'f4794d' : "Celosia",
        	'fbd546' : "Freesia",
        	'599e7f' : "Hemlock",
        	'3e8871' : "Comfrey",
        	'618eb1' : "Placid Blue",
        	'0d6eb2' : "Dazzling Blue",
        	'595d8e' : "Violet Tulip",
        	'b172ab' : "Radiant Orchid",
        	'792360' : "Magenta Purple",
        	'ac8b66' : "Sand",
        	'8b9291' : "Paloma"
        },
        ...
	});
	
The palette will automatically include lighter and darker versions of these base colors.

####Buttons

The default class used for buttons is `.btn`. You can customize this class with the `buttonClass` option. You can then add sets of options (with corresponding classes) for buttons with `buttonOptions`.

	$('#container').dapperDoe({
		...,
		buttonClass: 'btn',
		buttonOptions: {
			option1: {
				"btn-default" : "Default",
				"btn-primary" : "Primary"
			},
			option2: {
				"btn-lg" : "Large",
				"btn-md" : "Medium",
				"btn-sm" : "Small"
			}
		},
		...
	});