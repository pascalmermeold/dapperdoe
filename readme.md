#Dapper Doe

Dapper Doe is a static web page generator/editor that makes any html template drag-and-drop editable. It is perfect for allowing people who are not familiar with html to create and edit nice and beautiful webpage. You can use Dapper Doe in your application or as a mini-CMS for simple static websites.

This project is starting and only the most basic features are ready, so if you need something more, I'll be glad you contribute!

## Intro / Demo

*First of all, test Dapper Doe with the demo in order to better understand the rest of this readme.*

**Demo : <a href="http://www.lafactoria.fr/dapperdoe/" target="_blank">www.lafactoria.fr/dapperdoe</a>**

Dapper Doe is based on snippets. A snippet is a chunk of html code that represents an editable and addable block of content. Snippets are available on the right sidebar of the editor and can be dragged into the page. 

The contents of snippets can be edited by clicking on them. Currently, `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<p>`, `<img>` are editable but lists, slideshows, videos will be available soon.

## Getting Started

Here is an example project based on Twitter Bootstrap: <a href="http://www.lafactoria.fr/dapperdoe/dapperdoe.zip" target="_blank">dapperdoe.zip</a>. Download it and check `snippets.html` and `script.js` files to better understand how to make DapperDoe work.

**Dapper Doe will only work on a server as it uses ajax to load contents, so use a local static file server to do you tests**

####Include Dapper Doe js and css files

Dapper Doe depends on jQuery and jQuery UI, so you need to add them. It also depends on Font Awesome v4.2.
	
	<link href="dapperdoe/libs/css/font-awesome.css" rel="stylesheet">
	<link href="dapperdoe/dist/dapperdoe.min.css" rel="stylesheet">
	
	<script src="dapperdoe/libs/jquery/jquery.min.js"></script>
    <script src="dapperdoe/libs/jquery/jquery-ui.min.js"></script>
	<script src="dapperdoe/dist/dapperdoe.min.js"></script>
	
####Create snippets

DapperDoe needs to know which are the snippets that can be added and dragged. Create an html file listing all the html snippets you want to add to the editor.

Take a look at the file called `/bootstrap/snippets.html` in the example project. As you can see, a snippet looks like this :

	<div data-preview="snippets/jumbotron.png">
		<div class="jumbotron">
      		<div class="container">
        		<h1>Hello, world!</h1>
        		<p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
        		<p><a class="btn btn-primary btn-lg" role="button">Learn more &raquo;</a></p>
      		</div>
    	</div>
	</div>

You just need to add the attribute "data-preview" to make DapperDoe aware that this snippet must be added in the sidebar. The value of `data-preview` is the path to the snippet's image preview that will appear in the sidebar (typically a screenshot of the result, you can check the png files in `/bootstrap/snippets/` to see an example).
	
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

You need to call `callback(savedImageUrl)` once an image has been saved in `saveImageCallback()` to let know DapperDoe the url of the image.
	
####That's it!

Just load your page and you'll see DapperDoe magic happen!

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

## Contributing

All the code is in the /app folder. It's only 1 less file and 4 coffee script files. There is a Gruntfile that will automatically compile the app in /src (non minified) and /dist (minified).

DapperDoe depends on jQuery, jQuery UI but also Rangy. Because Rangy is light, stable and tedious to add to every project, it is added in the compiled source.

If you need a feature, I'll be happy to point you in the right direction so you can contribute to the project and add it.

## Release notes

####0.2.0

**Features / Improvements**

* Font Awesome as a dependency
* New text editor (more user-friendly and Firefox compatible)
* 

**Bugs**

* Firefox text alignment


####0.1.0

**First release, basic editor.**

* Parse html
* Edit html `<p>`, `<hn>`, `<img>`
* Basic UI
* Save button
* Rows ordering