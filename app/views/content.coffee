class DapperDoe.Views.Content extends Backbone.View
	events:
		"click" : "stopPropagation"

	stopPropagation: (e) ->
		e.stopPropagation()

class DapperDoe.Views.Toolbar extends Backbone.View
	events:
		"click" : "stopPropagation"

	stopPropagation: (e) ->
		e.stopPropagation()

class DapperDoe.Views.Content.Text extends DapperDoe.Views.Content
	events:
		"focus": "showToolbar"

	initialize: ->
		this.events = _.extend({},DapperDoe.Views.Content.prototype.events,this.events)
		this.$el.attr('contenteditable','true')

	showToolbar: (e) ->
		this.toolbar = new DapperDoe.Views.Toolbar.Text({content: this})

class DapperDoe.Views.Toolbar.Text extends DapperDoe.Views.Toolbar
	events:
		"click button" : "editText"

	initialize: (options) ->
		this.content = options.content
		this.events = _.extend({},DapperDoe.Views.Toolbar.prototype.events,this.events)
		window.app.snippetsView.removeToolbars()
		this.$el.html(this.html)
		$(window.app.topElement).append(this.$el)

	editText: (e) =>
		window.app.lastSel = rangy.saveSelection()

		switch $(e.currentTarget).data('action')
			when "bold" then document.execCommand('bold', false, null)
			when "italic" then document.execCommand('italic', false, null)
			when "underline" then document.execCommand('underline', false, null)
			when "text-color" then new DapperDoe.Views.Modal.Color({callback: this.applyForeColor})
			when "background-color" then new DapperDoe.Views.Modal.Color({callback: this.applyHiliteColor})
			when "align-left" then document.execCommand('justifyLeft', false, null)
			when "align-center" then document.execCommand('justifyCenter', false, null)
			when "align-right" then document.execCommand('justifyRight', false, null)
			when "link" then new DapperDoe.Views.Modal.Url()
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

class DapperDoe.Views.Modal extends Backbone.View
	events:
		"click" : "stopPropagation"
		"click .dd_submit_modal" : "doAction"
		"click .dd_close_modal" : "closeModal"

	initialize: (options) ->
		this.$el.html(this.html)
		$(window.app.topElement).append(this.$el)

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


class DapperDoe.Views.Modal.Color extends DapperDoe.Views.Modal
	events:
		"click .color" : "doAction"

	initialize: (options)->
		super()
		this.events = _.extend({},DapperDoe.Views.Modal.prototype.events,this.events)
		this.callback = options.callback

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

class DapperDoe.Views.Modal.Url extends DapperDoe.Views.Modal

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