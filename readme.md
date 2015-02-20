#Dapper Doe

Dapper Doe is a static web page generator/editor that makes any html template drag-and-drop editable. It is perfect for allowing people who are not familiar with html to create and edit nice and beautiful webpage. You can use Dapper Doe in your application or as a mini-CMS for simple static websites.

This project is starting and only the most basic features are ready, so if you need something more, I'll be glad you contribute!

## Demo

*First of all, test Dapper Doe with the demo in order to better understand the rest of this readme.*

**Demo : <a href="http://pascalmerme.github.io/dapperdoe/" target="_blank">http://pascalmerme.github.io/dapperdoe/</a>**

You can also test Dapper Doe on your machine. Just clone this repo and run `grunt serve`. This will start a local server at `http://localhost:9000`. Open the example index.html page at `http://localhost:9000/demo/index.html` and start playing with the editor.

## Intro

Dapper Doe is based on snippets. A snippet is a chunk of html code that represents an editable and addable block of content. Snippets are available on the right sidebar of the editor and can be dragged into the page. 

The contents of snippets can be edited by clicking on them. Currently, `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<p>`, `<img>` and `<iframe>` videos are editable but icons will be available soon.

## Getting Started

Check `snippets.html` and `script.js` files in the `demo/bootstrap` folder to better understand how to make DapperDoe work.

**Dapper Doe will only work on a server as it uses ajax to load contents, so use the grunt static file server to do you tests or use it on your own server**

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
        		<h1 data-dd="text">Hello, world!</h1>
        		<p data-dd="text">This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
        		<p data-dd="text"><a class="btn btn-primary btn-lg" role="button">Learn more &raquo;</a></p>
      		</div>
    	</div>
	</div>
	
#####Snippets

You just need to add the attribute "data-preview" to make DapperDoe aware that this snippet must be added in the sidebar. The value of `data-preview` is the path to the snippet's image preview that will appear in the sidebar (typically a screenshot of the result, you can check the png files in `/bootstrap/snippets/` to see an example).

#####Text Editor

In order to tell Dapper Doe that text tags can be edited, you must add the `data-dd="text"` attribute to them. For example `<h1 data-dd="text">Hello, world!</h1>` will trigger the text editor when text is selected. Don't include an editable tag inside another editable tag!

#####Images

`img` tags are automatically made editable. You don't need to do anything for them.

#####Videos

You can add videos in your template by adding the following markup :

	<div data-dd="video">
      <iframe src="..."></iframe>
    </div>
    
As you can see, you just need to add a `data-dd="video"` attribute to a div wrapping the video iframe. It has been tested with Youtube, Vimeo and Dailymotion embed iframes.
	
####Run DapperDoe

Create a `new DapperDoe.App({...})` object to launch the editor and assign it to `window.app`. Three options are mandatory : the element that serves as container for the snippets, the path to the snippets and a callback that will save uploaded images on a server of your choice :

 	window.app = new DapperDoe.App({
 		topElement: $('#dd_container'),
		snippetsPath: './bootstrap/snippets.html',
		saveImageCallback: function(formdata, callback) {
			saveImageSomewhere(formdata);
			callback(savedImageUrl);
		}
	});

You need to call `callback(savedImageUrl)` once an image has been saved in `saveImageCallback()` to let know DapperDoe the url of the image.
	
####That's it!

Just load your page and you'll see DapperDoe magic happen!

In order to get the html that has been generated with the editor, just run `window.app.getHtml()`

## Options

You can customize DapperDoe UI with some options :

####Snippets Container

By default, a sidebar containing the draggable snippets will appear on the right of the screen. But you can place the snippets in a custom div if you want. To do so, use the `snippetsContainer` option:

	window.app = new DapperDoe.App({
		...,
		snippetsContainer: $('#my_own_sidebar'),
        ...
	});

####Color Palette

A default color palette is provided by default. You can customize it by giving DapperDoe the base colors you want to use :

	window.app = new DapperDoe.App({
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

	window.app = new DapperDoe.App({
		...,
		buttonClass: 'btn',
		buttonOptions: {
			option1: {
				"large": {
					"class": "btn-lg",
					"name": "Large"
				},
				"medium": {
					"class": "btn-md",
					"name": "Medium"
				},
				"small": {
					"class": "btn-sm",
					"name": "Small"
				}
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
* Color choice for buttons
* Snippet's background color
* Snippet's background image
* Snippet's padding

**Bugs**

* Firefox text alignment


####0.1.0

**First release, basic editor.**

* Parse html
* Edit html `<p>`, `<hn>`, `<img>`
* Basic UI
* Save button
* Rows ordering