# Content.js
# ----------
# Defines how contents can be edited
# Creates relative UI and behaviour
# Type of content that can currently be edited :
#  * Text (<h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <p>)
#  * Image (<img>)
# ----------

# Generic class for contents (for example, a <h1> or <img> tag)
class DapperDoe.Content
	constructor: (options) ->
		this.$el = options.el
		this.$el.bind('click', (e) -> e.stopPropagation())

# Generic class for toolbars
class DapperDoe.Toolbar
	constructor: (options) ->
		this.$el = $('<div></div>')
		this.$el.bind('click', (e) -> e.stopPropagation())

# Generic class for tools (UI on contents)
class DapperDoe.Tools

# Text content, called on <h*> and <p>
class DapperDoe.Content.Text extends DapperDoe.Content
	constructor: (options) ->
		super(options)
		this.$el.attr('contenteditable','true')
		this.events()

		# Wrap content with p it plain text to prevent Firefox bug
		if (this.$el.find('.dd_text_content').length == 0)
			this.$el.wrapInner("<div class='dd_text_content'></div>")

	events: ->
		this.$el.bind('paste', (e) => this.handlePaste(e))
		this.$el.bind('dragover drop', (e) => this.preventDrag(e))
		this.$el.bind('mouseup', () => this.openToolbar())
		this.$el.bind('keyup', () => this.openToolbar())

	openToolbar: ->
		window.app.textToolbar.hide()
		range = rangy.getSelection().getRangeAt(0)
		if range.startOffset != range.endOffset
			window.app.textToolbar.show()

	# Removes all tags when pasting to prevent bugs due to unexpected tags from other softwares and apps
	handlePaste: (e) ->
		e.preventDefault()
		text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..')
		temp = document.createElement("div")
		temp.innerHTML = text
		document.execCommand('insertHtml', false, temp.textContent)

	preventDrag: (e) ->
		e.preventDefault()
		return false

# Image content called on <img>
class DapperDoe.Content.Image extends DapperDoe.Content
	constructor: (options) ->
		super(options)
		this.tools = new DapperDoe.Tools.Image({image: this.$el})

# Video content called on <div container iframe width class "dd_video">
class DapperDoe.Content.Video extends DapperDoe.Content
	constructor: (options) ->
		super(options)
		this.tools = new DapperDoe.Tools.Video({el: this.$el})

# UI for editing images
class DapperDoe.Tools.Image extends DapperDoe.Tools
	constructor: (options) ->
		this.$image = options.image
		this.$image.wrap('<div class="dd_image_wrapper"></div>')
		this.$el = this.$image.parent('.dd_image_wrapper')
		this.$el.append(this.html)
		this.$tools = this.$el.find('.dd_tools')
		this.positionTools()
		this.$tools.hide()
		this.events()

	events: ->
		this.$el.find(".image_upload").bind("click", => this.selectFile())
		this.$el.bind("mouseover", => this.$tools.show())
		this.$el.bind("mouseout", => this.$tools.hide())
		this.$el.find(".image_input").bind("change", (e) => this.uploadImage(e))

	selectFile: ->
		this.$tools.find(".image_input").trigger("click")

	# Manage image upload and calls the callback provided
	uploadImage: (e) =>
		if e.target.files and e.target.files[0]
			file = e.target.files[0]

			if file.type.match('image.*')
				reader = new FileReader()
				reader.onload = (o) =>
					this.$image.attr('src', o.target.result)
					this.positionTools()
				reader.readAsDataURL(file)
			
			if window.FormData
				formdata = new FormData()
				formdata.append('source',file)
				window.app.saveImageCallback(formdata, (url) =>
					if url
						this.$image.attr('src', url)
				)
			else
				alert('Type de fichier non autorisé')

	# Position buttons at the center of the image
	positionTools: ->
		this.$tools.css('left',(this.$image.width()/2)-(this.$el.find('.dd_tools').width()/2))
		this.$tools.css('top',(this.$image.height()/2)-(this.$el.find('.dd_tools').height()/2))

	remove: ->
		this.$image.parent('.dd_image_wrapper').find('div').remove()
		this.$image.unwrap()

	# UI's DOM
	html: ->
		"<span class='dd_tools dd_ui'>
			<!--<i class='image_link fa fa-link'></i><br/>-->
			<i class='image_upload fa fa-image'></i>
				<input type='file' class='image_input' style='display: none;'/>
		</span>"

# UI for editing images
class DapperDoe.Tools.Video extends DapperDoe.Tools
	constructor: (options) ->
		this.$el = options.el
		this.$el.append(this.html)
		this.$tools = this.$el.find('.dd_tools')
		this.positionTools()
		this.$tools.hide()
		this.events()

	events: ->
		this.$el.find(".video_action").bind("click", => this.doAction())
		this.$el.bind("mouseover", => this.show())
		this.$el.bind("mouseout", => this.hide())
		#this.$el.find(".image_input").bind("change", (e) => this.uploadImage(e))

	show: (e) ->
		#this.positionTools()
		this.$tools.show()

	hide: (e) ->
		this.$tools.hide()

	# Position buttons at the center of the image
	positionTools: ->
		this.$tools.css('left',(this.$el.width()/2)-(this.$el.find('.dd_tools').width()/2))
		this.$tools.css('top',(this.$el.height()/2)-(this.$el.find('.dd_tools').height()/2))

	doAction: ->
		$icon = this.$el.find(".video_action")

		if $icon.hasClass('fa-code')
			this.$el.find(".video_code_textarea").show()
			$icon.switchClass('fa-code', 'fa-check')
		else
			this.$el.find(".video_code_textarea").hide()
			$icon.switchClass('fa-check', 'fa-code')
			new_code = this.$el.find(".video_code_textarea").val()
			if (new_code != "") and (new_code != "<iframe></iframe>")
				this.$el.find('iframe').replaceWith(this.$el.find(".video_code_textarea").val())
			this.hide()

	# UI's DOM
	html: ->
		"<span class='dd_tools dd_ui'>
			<textarea class='video_code_textarea' style='display:none;'><iframe></iframe></textarea>
			<i class='video_action fa fa-code'></i><br/>
		</span>"

# UI for editing texts
class DapperDoe.Toolbar.Text extends DapperDoe.Toolbar

	constructor: (options) ->
		super(options)
		this.$el.html(this.html)
		$(window.app.topElement).append(this.$el)
		this.toolbarWidth = this.$el.find('.dd_toolbar').width()
		this.toolbarHeight = this.$el.find('.dd_toolbar').height()
		this.$el.hide()
		this.events()

	events: ->
		this.$el.find("button").bind("click", (e) => this.editText(e))

	hide: ->
		this.$el.hide()
		this.hideSubToolbar()

	hideSubToolbar: ->
		window.app.textSubToolbarColor.hide()
		window.app.textSubToolbarUrl.hide()

	show: ->
		this.$el.hide()
		boundary = rangy.getSelection().getRangeAt(0).getBoundingClientRect()
		if(boundary.bottom > 0)
			top = boundary.top - 10
			left = boundary.left + (boundary.width/2) - (this.toolbarWidth/2)
			if left < 10
				left = 10
			if (left + this.toolbarWidth) > ($(document).width() - 10)
				left = $(document).width() - 10 - this.toolbarWidth

			this.$el.find('.dd_toolbar').css('bottom', $(window.app.topElement).height() - top - $(window).scrollTop())
			this.$el.find('.dd_toolbar').css('left', left)
			this.$el.show()

	# Commands called when clicking on a toolbar button
	editText: (e) =>
		if(window.app.lastSel)
			rangy.removeMarkers(window.app.lastSel)
		window.app.lastSel = rangy.saveSelection()
		action = $(e.currentTarget).data('action')
		this.hideSubToolbar()

		switch action
			when "bold" then document.execCommand('bold', false, null)
			when "italic" then document.execCommand('italic', false, null)
			when "underline" then document.execCommand('underline', false, null)
			when "text-color" then window.app.textSubToolbarColor.show(this.applyForeColor)
			when "align-left" then document.execCommand('justifyLeft', false, null)
			when "align-center" then document.execCommand('justifyCenter', false, null)
			when "align-right" then document.execCommand('justifyRight', false, null)
			when "link" then window.app.textSubToolbarUrl.show()
			when "unlink" then document.execCommand('unlink', false, null)
			when "clear"
				document.execCommand('removeFormat', false, null)
				document.execCommand('unlink', false, null)
			when "undo" then document.execCommand('undo', false, null)

		this.show()

	# UI's DOM
	html: ->
		$("<div class='dd_toolbar dd_ui'>
			<div class='dd_sub_toolbar'></div>
			<button data-action='bold'><i class='fa fa-bold'></i></button>
			<button data-action='italic'><i class='fa fa-italic'></i></button>
			<button data-action='underline'><i class='fa fa-underline'></i></button>
			<button data-action='text-color'><i class='fa fa-tint'></i></button>
			<button data-action='align-left'><i class='fa fa-align-left'></i></button>
			<button data-action='align-center'><i class='fa fa-align-center'></i></button>
			<button data-action='align-right'><i class='fa fa-align-right'></i></button>
			<button data-action='link'><i class='fa fa-link'></i></button>
			<button data-action='unlink'><i class='fa fa-unlink'></i></button>
			<button data-action='clear'><i class='fa fa-eraser'></i></button>
			<button data-action='undo'><i class='fa fa-undo'></i></button>
		</div>")

	applyForeColor: (color) =>
		rangy.restoreSelection(window.app.lastSel)
		document.execCommand('foreColor', false, color)

class DapperDoe.TextSubToolbar
	constructor: (options) ->
		this.$el = window.app.textToolbar.$el.find('.dd_sub_toolbar')
		this.$el.hide()
		this.$el.append(this.html())
		this.events()

	events: ->
		this.$el.bind("click", (e) => this.stopPropagation(e))
		this.$el.find(".dd_submit").bind("click", (e) => this.doAction(e))

	show: (type,callback,hideExisting) ->
		this.callback = callback
		if hideExisting
			this.$el.find('.dd_sub_toolbar_content').hide()
		this.$el.find(".dd_toolbar_#{type}").show()
		this.$el.slideDown(200)

	doAction: (e) ->
		e.stopPropagation()

	hide: () ->
		$('.dd_toolbar button').removeClass('active')
		this.$el.hide()

	stopPropagation: (e) ->
		e.stopPropagation()

	html: ->
		return ""

# Color modal, allowing to choose a color from the palette and execute a callback with the choosen color
class DapperDoe.TextSubToolbar.Color extends DapperDoe.TextSubToolbar
	constructor: (options)->
		super(options)

	events: ->
		super()
		this.$el.find(".color").bind("click", (e) => this.doAction(e))

	stopPropagation: (e) ->
		e.stopPropagation()

	doAction: (e) ->
		e.stopPropagation()
		color = $(e.target).data('color')
		this.hide(e)
		if this.callback
			this.callback(color)

	hide: ->
		this.$el.find('.dd_toolbar_color').hide()

	show: (callback, isSubSub) ->
		super('color', callback, !isSubSub)
		if !isSubSub
			$('.dd_toolbar button[data-action=text-color]').addClass('active')

	html: =>
		$html = $("<div class='dd_sub_toolbar_content dd_toolbar_color'></div>")

		colors = window.app.colorPalette
		columnWidth = window.app.textToolbar.toolbarWidth / colors.length
		colorWidth = Math.round(columnWidth - 4)

		for baseColor in colors
			$html.append("<span class='color' style='background: ##{baseColor}; width: #{colorWidth}px; height: #{colorWidth}px;' data-color='#{baseColor}'></span>")

		return $html

# Url modal, allowing to add a link, and optionnaly button classes to the link.
# Adds the link to the currently selected text
class DapperDoe.TextSubToolbar.Url extends DapperDoe.TextSubToolbar
	constructor: (options)->
		super(options)
		this.$el.find('.dd_link_color').bind('click', this.manageLinkColor)
		this.linkColor = 'fff'

	manageLinkColor: (e) =>
		if(window.app.textSubToolbarColor.$el.find('.dd_toolbar_color').is(':visible'))
			window.app.textSubToolbarColor.hide()
		else
			window.app.textSubToolbarColor.show((color) ->
				window.app.textSubToolbarUrl.linkColor = color
				this.$el.find('.dd_link_color').css('background', '#' + color)
			, true)
			

	doAction: (e) ->
		e.stopPropagation()
		this.url = this.$el.find('.dd_url').val()
		this.blank = this.$el.find('.dd_blank').is(':checked')
		this.button = this.$el.find('.dd_button').is(':checked')

		rangy.restoreSelection(app.lastSel)
		this.link = document.execCommand('createLink', false, this.url)
		rangy.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.setAttribute("target", "_blank") if this.blank
		
		if this.button
			rangy.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.setAttribute("style", "background: #" + this.linkColor + ";")
		else
			rangy.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.setAttribute("style", "color: #" + this.linkColor + ";")

		if this.button
			cssClass = window.app.buttonClass
			for key, option of window.app.buttonOptions
				cssClass += " " + this.$el.find("input[name=#{key}]:checked").val()

			cssApplier = rangy.createCssClassApplier(cssClass,
				normalize: true
				elementTagName: 'a')
			cssApplier.toggleSelection()

		this.hide(e)

	show: () ->
		$('.dd_toolbar button[data-action=link]').addClass('active')
		super('url', -> 
			console.log('')
		, true)
		this.$el.find('.dd_link_color').css('background', '#fff')

	html: ->
		$html = $("<div class='dd_sub_toolbar_content dd_toolbar_url'>
			<input type='text' placeholder='Url' class='dd_url' />
			<span class='dd_link_color'></span>
			<div class='dd_submit'><i class='fa fa-check'></i></div>
			<div class='clearfix'></div>
			<div class='dd_url_options'>
				<label>_blank <input type='checkbox' class='dd_blank'/></label>
				<label>Button <input type='checkbox' class='dd_button'/></label>
			</div>
		</div>")

		for key, option of window.app.buttonOptions

			for key2, subOption of option
				$html.find(".dd_url_options").append("<label>
					#{subOption.name} <input type='radio' name='#{key}' value='#{subOption.class}' />
				</label>")

			$html.find("input[name=#{key}]:first").attr('checked', true);
		return $html

# Generic class for modals (used for links and colors for example)
class DapperDoe.Modal
	constructor: (options) ->
		this.$el = this.html()
		$(window.app.topElement).append(this.$el)
		this.events()

	events: ->
		this.$el.bind("click", (e) => this.stopPropagation(e))
		this.$el.find(".dd_submit_modal").bind("click", (e) => this.doAction(e))
		this.$el.find(".dd_close_modal").bind("click", (e) => this.closeModal(e))

	doAction: (e) ->
		e.stopPropagation()

	closeModal: (e) ->
		e.stopPropagation()
		this.$el.remove()

	stopPropagation: (e) ->
		e.stopPropagation()

	html: ->
		$("<div class='dd_modal_overlay'>
			<div class='dd_modal'>
				<span class='dd_close_modal'><i class='fa fa-close'></i></span>
				<div class='dd_content'>
				</div>
			</div>
		</div>")

# Color modal, allowing to choose a color from the palette and execute a callback with the choosen color
class DapperDoe.Modal.Color extends DapperDoe.Modal

	constructor: (options)->
		super(options)
		this.callback = options.callback
		this.events()

	events: ->
		super()
		this.$el.find(".color").bind("click", (e) => this.doAction(e))

	stopPropagation: (e) ->
		e.stopPropagation()

	doAction: (e) ->
		e.stopPropagation()
		color = $(e.target).data('color')
		this.closeModal(e)
		this.callback(color)

	colorLuminance: (hex, lum) ->
		hex = String(hex).replace(/[^0-9a-f]/gi, '')
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2] if (hex.length < 6)
		lum = lum || 0

		rgb = ""
		for i in [0..2] by 1
			c = parseInt(hex.substr(i*2,2), 16)
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
			rgb += ("00"+c).substr(c.length)

		return rgb

	html: =>
		$html = super()
		$html.find('.dd_content').append("<table class='dd_color_palette'></table>")

		for baseColor, colorName of window.app.colorPalette
			$html.find('.dd_color_palette').append("<tr class='base_color_#{baseColor}'></tr>")
			for i in [-2..3] by 1
				color = this.colorLuminance(baseColor,i*0.3)
				$html.find(".dd_color_palette .base_color_#{baseColor}").append("<td class='color' style='background: ##{color};' data-color='#{color}'></td>")

		return $html

# Url modal, allowing to add a link, and optionnaly button classes to the link.
# Adds the link to the currently selected text
class DapperDoe.Modal.Url extends DapperDoe.Modal

	constructor: (options) ->
		super(options)

	doAction: (e) ->
		e.stopPropagation()
		this.url = this.$el.find('.dd_url').val()
		this.blank = this.$el.find('.dd_blank').is(':checked')
		this.button = this.$el.find('.dd_button').is(':checked')

		rangy.restoreSelection(app.lastSel)
		this.link = document.execCommand('createLink', false, this.url)
		rangy.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.setAttribute("target", "_blank") if this.blank


		if this.button
			cssClass = window.app.buttonClass
			for key, option of window.app.buttonOptions
				cssClass += " " + this.$el.find("input[name=#{key}]:checked").val()

			cssApplier = rangy.createCssClassApplier(cssClass,
				normalize: true
				elementTagName: 'a')
			cssApplier.toggleSelection()

		this.closeModal(e)

	html: ->
		$html = super()
		$html.find('.dd_content').append("<input type='text' placeholder='Url' class='dd_url' />
			<div class='dd_options'>
				<label>
					Target blank <input type='checkbox' class='dd_blank'/>
				</label>
				<div class='dd_button_options'>
					<b>Button <input type='checkbox' class='dd_button'/></b>
				</div>
			</div>
			<input type='submit' value='OK' class='dd_submit_modal'/>")

		for key, option of window.app.buttonOptions
			$html.find('.dd_button_options').append("<div class='dd_button_option #{key}'></div>")

			for klass, name of option
				$html.find(".dd_button_options .dd_button_option.#{key}").append("<label>
						#{name} <input type='radio' name='#{key}' value='#{klass}' />
					</label>")

			$html.find("input[name=#{key}]:first").attr('checked', true);
		return $html