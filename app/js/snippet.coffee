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
    this.$el = $("<div class='dd_snippet'></div>")
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
    this.$el.find(".snippet_destroyer").bind("click", => this.destroy())

  showTools: ->
    this.$el.find('.tool').show()

  hideTools: ->
    this.$el.find('.tool').hide()

  # Snippet's UI DOM
  addTools: ->
    this.$el.append("<div class='tools dd_ui'>
      <div class='tool snippet_mover'><i class='fa fa-arrows'></i></div>
      <div class='tool snippet_destroyer'><i class='fa fa-trash'></i></div>
    </div>")

  # Makes snippet's content editable by creating new content objects
  parseSnippet: ->
    this.$el.find('a, p, h1, h2, h3, h4, h5, h6').each ->  new DapperDoe.Content.Text({el: $(this)})
    this.$el.find('img').each -> new DapperDoe.Content.Image({el: $(this)})

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
      items: ".dd_snippet"
      forcePlaceholderSize: true
      axis: 'y'
      receive: this.addSnippet
      handle: '.snippet_mover'
    this.events()
    this.parsePage()

  events: ->
    $('body').bind('click', => this.removeToolbars())
    this.$el.bind("click", => this.removeToolbars())
    $("#dd_save_page_button").bind("click", => this.savePage())

  # Adds a snippet to the page, giving it a random id
  addSnippet: (event, ui) =>
    randomnumber = Math.ceil(Math.random()*100000)
    index = randomnumber = Math.ceil(Math.random()*100000)
    $(ui.helper).attr('id',"snippet_#{index}")
    $(ui.helper).removeAttr('style')
    $(ui.item).trigger('addSnippet', {element: $("#snippet_#{index}")})

  removeToolbars: (e) ->
    $(window.app.topElement).find('.dd_toolbar').remove()

  addTools: ->
    $('body').append("<div class='dd_loader'><i class='fa fa-circle-o-notch fa-spin'></i></div>")
    $('body').append("<div id='dd_save_page_button'><i class='fa fa-save'></i> Save</div>")

  parsePage: ->
    this.$el.find('.dd_snippet').each (index, snippet) ->
      new DapperDoe.Snippet({el: $(snippet)})

  # Prepares the html for saving and calls the callback
  savePage: ->
    this.startLoader()
    html = this.$el.clone()
    $(html).find('.dd_ui').remove()
    $(html).find('*[contenteditable=true]').removeAttr('contenteditable')
    $(html).find('.dd_image_wrapper').each ->
      $(this).find('img').appendTo($(this).parent())
      $(this).remove()
    window.app.savePageCallback(html.html().replace(/(\r\n|\n|\r|\t)/gm,"").replace(/<script>/gi,'').replace(/<\/script>/gi,''), =>
      this.stopLoader()
    )

  startLoader: ->
    $('.dd_loader').show()

  stopLoader: ->
    $('.dd_loader').hide()

