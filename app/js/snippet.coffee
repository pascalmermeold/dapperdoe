# Snippet.js
# ----------
# Defines how snippets are parsed and binded to content editors
# Defines how snippets are dragged and dropped from the sidebar
# ----------

# Represents a snippet in the sidebar
class DapperDoe.SnippetPreview

  constructor: (options) ->
    @snippet = options.snippet
    @index = options.index
    this.buildSnippet()
    this.enableDraggable()
    this.events()

  events: ->
    this.$el.bind('addSnippet', (event, params) => this.addSnippet(event, params))

  # Build a snippet preview DOM
  buildSnippet: () ->
    this.$el = $("<div data-dd='snippet'></div>")
    this.$el.attr('id', "dd_snippet#{@index}")
    this.$el.append($("<img src='#{@snippet.previewUrl}' />"))

  # Sets jQuery UI draggable
  enableDraggable: ->
    this.$el.draggable
        appendTo: window.app.topElement
        helper: 'clone'
        revert: false
        connectToSortable: window.app.topElement

  # Called when the snippet is dropped in the page
  # Removes the UI helper and creates the snippet
  addSnippet: (event, params) ->
    params.element.find('img').remove()
    params.element.append $(@snippet.html)
    new DapperDoe.Snippet({el: params.element})

# Represents the sidebar
class DapperDoe.Sidebar
  
  constructor: (options) ->
    @collection = options.collection
    this.buildSidebar()
    this.events()

  events: ->
    this.$el.find('.dd_sidebar_opener').bind('click', => this.toggleSidebar())

  # Build snippets previews from the template object
  buildSidebar: ->
    if(window.app.snippetsContainer)
      this.$el = window.app.snippetsContainer
    else
      this.$el = $("<div id='dd_sidebar'></div>")
      this.$el.append("<span class='dd_sidebar_opener'><i class='fa fa-pencil'></i></span>")

    this.$el.append("<div class='dd_snippets_previews'></div>")
    for snippet, i in @collection
      snippet_view = new DapperDoe.SnippetPreview
        snippet: snippet
        index: i

      this.$el.find('> div').append(snippet_view.$el)

    $('body').append(this.$el)

  toggleSidebar: () ->
    this.$el.toggleClass('opened', 200)

# Represents a snippet in the page
class DapperDoe.Snippet

  constructor: (options) ->
    this.$el = options.el
    this.addTools()
    this.parseSnippet()
    this.events()

  events: ->
    this.$el.bind("mouseover", => this.showTools())
    this.$el.bind("mouseleave", => this.hideTools())
    this.$el.find(".dd_tools .snippet_destroyer").bind("click", => this.destroy())
    this.$el.find(".color").bind("click", (e) => this.changeColor(e))
    this.$el.find(".dd_tools .snippet_settings").bind("click", => this.toggleSettings())
    this.$el.find(".dd_snippet_settings").bind("click", => this.hideSettings())
    this.$el.find(".dd_image_background").bind("click", (e) => this.imageBackgroundFileSelector(e))
    this.$el.find(".dd_image_background .image_input, .dd_snippet_padding").bind("click", (e) => e.stopPropagation())
    this.$el.find(".dd_image_background .image_input").bind("change", (e) => this.uploadBackgroundImage(e))
    this.$el.find(".dd_snippet_padding").bind("input", (e) => this.updatePadding(e))

  toggleSettings: ->
    if(this.$el.find('.dd_snippet_settings').is(':visible'))
      this.hideSettings()
    else
      this.showSettings()

  showTools: ->
    this.$el.find('.dd_tool').show()

  hideTools: ->
    this.$el.find('.dd_tool').hide()

  # Snippet's UI DOM
  addTools: ->
    this.$el.append("<div class='dd_tools dd_ui'>
      <div class='dd_tool snippet_mover'><i class='fa fa-arrows'></i></div>
      <div class='dd_tool snippet_settings'><i class='fa fa-adjust'></i></div>
      <div class='dd_tool snippet_destroyer'><i class='fa fa-times'></i></div>
    </div>")
    this.$el.append("<div class='dd_snippet_settings dd_ui'><div class='dd_background_manager'></div></div>")
    for baseColor in window.app.colorPalette
      this.$el.find('.dd_snippet_settings .dd_background_manager').append("<span class='color' style='background: ##{baseColor};' data-color='#{baseColor}'></span>")
    this.$el.find('.dd_snippet_settings .dd_background_manager').append("<span class='dd_image_background'><i class='fa fa-picture-o'></i></span><input type='file' class='image_input' style='display: none;'/>")
    this.$el.find('.dd_snippet_settings .dd_background_manager').append("<br/><input type=range min=0 max=60 value=0 class='dd_snippet_padding'>")
  showSettings: ->
    this.$el.find('.dd_snippet_settings').show(200)

  hideSettings: ->
    this.$el.find('.dd_snippet_settings').hide(100)

  changeColor: (e) =>
    this.$el.css('background', '#' + $(e.target).data('color'))
    this.hideSettings()

  imageBackgroundFileSelector: (e) ->
    e.stopPropagation()
    this.$el.find('.image_input').trigger("click")

  uploadBackgroundImage: (e) ->
    if e.target.files and e.target.files[0]
      file = e.target.files[0]

      if file.type.match('image.*')
        reader = new FileReader()
        reader.onload = (o) =>
          this.$el.css('background', 'url(' + o.target.result + ') no-repeat center center', 200)
        reader.readAsDataURL(file)
      
      if window.FormData
        formdata = new FormData()
        formdata.append('source',file)
        window.app.saveImageCallback(formdata, (url) =>
          if url
            this.$el.css('background', 'url(' + url + ') no-repeat center center')
            this.$el.css('background-size', 'cover')
          this.hideSettings()
        )
      else
        alert('Type de fichier non autorisé')

  updatePadding: (e) ->
    e.preventDefault()
    e.stopPropagation()
    this.$el.css('padding', $(e.target).val() + 'px 0')

  # Makes snippet's content editable by creating new content objects
  parseSnippet: ->
    this.$el.find('[data-dd="text"]').each ->  new DapperDoe.Content.Text({el: $(this)})
    this.$el.find('img').each -> new DapperDoe.Content.Image({el: $(this)})
    this.$el.find('[data-dd="video"]').each -> new DapperDoe.Content.Video({el: $(this)})
    this.$el.find(".#{iconset[window.app.iconSet].iconClass}").each -> new DapperDoe.Content.Icon({el: $(this)})

  destroy: ->
    if confirm("Are you sure you want to destroy this snippet?")
      this.$el.remove()

# Represents all the snippets in the page
class DapperDoe.AppView

  # Initialize object and makes snippets sortable
  constructor: (options) ->
    this.$el = options.el
    this.$el.addClass('dd_top_element')
    this.addTools()
    this.$el.sortable
      items: "[data-dd='snippet']"
      forcePlaceholderSize: true
      axis: 'y'
      receive: this.addSnippet
      handle: '.snippet_mover'
    this.events()
    this.parsePage()

  events: ->
    $('body').bind('click', => window.app.textToolbar.hide())
    this.$el.bind("click", => window.app.textToolbar.hide())

  # Adds a snippet to the page, giving it a random id
  addSnippet: (event, ui) =>
    randomnumber = Math.ceil(Math.random()*100000)
    index = randomnumber = Math.ceil(Math.random()*100000)
    $(ui.helper).attr('id',"snippet_#{index}")
    $(ui.helper).removeAttr('style')
    $(ui.item).trigger('addSnippet', {element: $("#snippet_#{index}")})

  addTools: ->
    $('body').append("<div class='dd_loader'><i class='fa fa-circle-o-notch fa-spin'></i></div>")

  parsePage: ->
    this.$el.find('*[data-dd="snippet"]').each (index, snippet) ->
      new DapperDoe.Snippet({el: $(snippet)})

  # Prepares the html for saving and calls the callback
  getHtml: ->
    html = this.$el.clone()
    $(html).find('.dd_ui').remove()
    $(html).find('.ui-draggable, .ui-draggable-handle').removeClass('ui-draggable ui-draggable-handle')
    $(html).find('.rangySelectionBoundary').remove()
    $(html).find('*[contenteditable=true]').removeAttr('contenteditable')
    $(html).find('.dd_image_wrapper').each ->
      $(this).find('img').appendTo($(this).parent())
      $(this).remove()
    $(html).find('[data-dd="text"] .dd_text_content').each ->
      $(this).parent().html($(this).html())
    return html.html().replace(/<script>/gi,'').replace(/<\/script>/gi,'')

  startLoader: ->
    $('.dd_loader').show()

  stopLoader: ->
    $('.dd_loader').hide()

