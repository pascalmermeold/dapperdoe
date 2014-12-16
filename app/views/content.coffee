class DapperDoe.Content
	constructor: (options) ->
		this.$el = options.el
		this.$el.bind('click', (e) -> e.stopPropagation())

class DapperDoe.Toolbar
	constructor: (options) ->
		this.$el = $('div')
		this.$el.bind('click', (e) -> e.stopPropagation())

class DapperDoe.Content.Text extends DapperDoe.Content
	constructor: (options) ->
		super(options)
		this.$el.attr('contenteditable','true')
		this.$el.bind("focus", => this.showToolbar())

	showToolbar: (e) ->
		this.toolbar = new DapperDoe.Toolbar.Text({content: this})

class DapperDoe.Content.Image extends DapperDoe.Content

	constructor: (options) ->
		super(options)
		this.tools = new DapperDoe.Tools.Image({image: this.$el})

class DapperDoe.Tools

class DapperDoe.Tools.Image extends DapperDoe.Tools

	constructor: (options) ->
		this.$image = options.image
		this.$image.wrap('<div class="dd_image_wrapper"></div>')
		this.setElement(this.$image.parent('.dd_image_wrapper'))
		this.$el.append(this.html)
		this.$tools = this.$el.find('.dd_tools')
		this.positionTools()
		this.$tools.hide()
		this.events()

	events: ->
		this.$el.find(".image_upload").bind("click", => this.selectFile())
		this.$el.bind("mouseover", => this.$tools.show())
		this.$el.bind("mouseout", => this.$tools.hide())
		this.$el.find(".image_input").bind("change", => this.uploadImage())

	selectFile: ->
		this.$tools.find(".image_input").trigger("click")

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

	positionTools: ->
		this.$tools.css('left',(this.$image.width()/2)-(this.$el.find('.dd_tools').width()/2))
		this.$tools.css('top',(this.$image.height()/2)-(this.$el.find('.dd_tools').height()/2))

	remove: ->
		this.$image.parent('.dd_image_wrapper').find('div').remove()
		this.$image.unwrap()

	html: ->
		"<span class='dd_tools'>
			<i class='image_link fa fa-link'></i><br/>
			<i class='image_upload fa fa-image'></i>
				<input type='file' class='image_input' style='display: none;'/>
		</span>"

class DapperDoe.Toolbar.Text extends DapperDoe.Toolbar

	constructor: (options) ->
		super(options)
		this.content = options.content
		window.app.view.removeToolbars()
		this.$el.html(this.html)
		$(window.app.topElement).append(this.$el)
		this.events()

	events: ->
		this.$el.find("button").bind("click", => this.editText())

	editText: (e) =>
		window.app.lastSel = rangy.saveSelection()

		switch $(e.currentTarget).data('action')
			when "bold" then document.execCommand('bold', false, null)
			when "italic" then document.execCommand('italic', false, null)
			when "underline" then document.execCommand('underline', false, null)
			when "text-color" then new DapperDoe.Modal.Color({callback: this.applyForeColor})
			when "background-color" then new DapperDoe.Modal.Color({callback: this.applyHiliteColor})
			when "align-left" then document.execCommand('justifyLeft', false, null)
			when "align-center" then document.execCommand('justifyCenter', false, null)
			when "align-right" then document.execCommand('justifyRight', false, null)
			when "link" then new DapperDoe.Modal.Url()
			when "unlink" then document.execCommand('unlink', false, null)
			when "list" then document.execCommand('insertUnorderedList', false, null)
			when "clear"
				document.execCommand('removeFormat', false, null)
				document.execCommand('unlink', false, null)
			when "undo" then document.execCommand('undo', false, null)

	html: ->
		$("<div class='dd_toolbar'>
			<button data-action='bold'><i class='fa fa-bold'></i></button>
			<button data-action='italic'><i class='fa fa-italic'></i></button>
			<button data-action='underline'><i class='fa fa-underline'></i></button>
			<button data-action='text-color'><i class='fa fa-paint-brush'></i></button>
			<button data-action='background-color'><i class='fa fa-tint'></i></button>
			<button data-action='align-left'><i class='fa fa-align-left'></i></button>
			<button data-action='align-center'><i class='fa fa-align-center'></i></button>
			<button data-action='align-right'><i class='fa fa-align-right'></i></button>
			<button data-action='link'><i class='fa fa-link'></i></button>
			<button data-action='unlink'><i class='fa fa-unlink'></i></button>
			<button data-action='list'><i class='fa fa-list-ul'></i></button>
			<button data-action='clear'><i class='fa fa-eraser'></i></button>
			<button data-action='undo'><i class='fa fa-undo'></i></button>
		</div>")

	applyForeColor: (color) ->
		rangy.restoreSelection(app.lastSel)
		document.execCommand('foreColor', false, color)

	applyHiliteColor: (color) ->
		rangy.restoreSelection(app.lastSel)
		document.execCommand('hiliteColor', false, color)

class DapperDoe.Modal

	constructor: (options) ->
		this.$el.html(this.html)
		$(window.app.topElement).append(this.$el)
		this.events()

	events: ->
		this.$el.bind("click", => this.stopPropagation())
		this.$el.find(".dd_submit_modal").bind("click", => this.doAction())
		this.$el.find(".dd_close_modal").bind("click ", => this.closeModal())

	closeModal: ->
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


class DapperDoe.Modal.Color extends DapperDoe.Modal

	constructor: (options)->
		super(options)
		this.callback = options.callback
		this.events()

	events: ->
		this.find(".color").bind("click", => this.doAction())

	doAction: (e) ->
		color = $(e.target).data('color')
		this.callback(color)
		this.closeModal()

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

class DapperDoe.Modal.Url extends DapperDoe.Modal

	constructor: (options) ->
		super(options)

	doAction: ->
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

		this.closeModal()

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

			console.log $html.find("input[name=#{key}]:first")
			$html.find("input[name=#{key}]:first").attr('checked', true);
		return $html