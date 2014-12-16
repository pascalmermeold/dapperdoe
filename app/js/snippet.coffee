class DapperDoe.SnippetPreview

  constructor: (options) ->
    @snippet = options.snippet
    @index = options.index
    this.buildSnippet()
    this.enableDraggable()
    this.events()

  events: ->
    this.$el.bind('addSnippet', (event, params) => this.addSnippet(event, params))

  buildSnippet: () ->
    this.$el = $("<div class='dd_snippet'></div>")
    this.$el.attr('id', "dd_snippet#{@index}")
    this.$el.append($("<img src='#{window.app.template.attributes.path}/#{@snippet.previewUrl}' />"))

  enableDraggable: ->
    this.$el.draggable
        appendTo: window.app.topElement
        helper: 'clone'
        revert: false
        connectToSortable: window.app.topElement

  addSnippet: (event, params) ->
    params.element.find('img').remove()
    params.element.append $(@snippet.html)
    new DapperDoe.Snippet({el: params.element})

class DapperDoe.Sidebar
  
  constructor: (options) ->
    @collection = options.collection
    this.buildSidebar()
    this.events()

  events: ->
    this.$el.find('.dd_sidebar_opener').bind('click', => this.toggleSidebar())

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

  addTools: ->
    this.$el.append("<div class='tools'>
      <div class='tool snippet_mover'><i class='fa fa-arrows'></i></div>
      <div class='tool snippet_destroyer'><i class='fa fa-trash'></i></div>
    </div>")

  parseSnippet: ->
    this.$el.find('a, p, h1, h2, h3, h4, h5, h6').each ->  new DapperDoe.Content.Text({el: $(this)})
    this.$el.find('img').each -> new DapperDoe.Content.Image({el: $(this)})

  destroy: ->
    if confirm("Are you sure you want to destroy this snippet?")
      this.$el.remove()

class DapperDoe.AppView

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
    this.$el.find("#save_page_button").bind("click", => this.savePage())

  addSnippet: (event, ui) =>
    index = this.$el.find('.dd_snippet').length
    $(ui.helper).attr('id',"snippet_#{index}")
    $(ui.helper).removeAttr('style')
    $(ui.item).trigger('addSnippet', {element: $("#snippet_#{index}")})

  removeToolbars: (e) ->
    $(window.app.topElement).find('.dd_toolbar').remove()

  addTools: ->
    this.$el.append("<div class='loader'><i class='fa fa-circle-o-notch fa-spin'></i></div>")
    this.$el.append("<div id='save_page_button'><i class='fa fa-save'></i> Save</div>")

  parsePage: ->
    this.$el.find('.dd_snippet').each (index, snippet) ->
      new DapperDoe.Snippet({el: $(snippet)})

  savePage: ->
    this.startLoader()
    html = this.$el.clone()
    $(html).find('.loader, #save_page_button').remove()
    window.app.savePageCallback(html.html().replace(/(\r\n|\n|\r|\t)/gm,""), =>
      this.stopLoader()
    )

  startLoader: ->
    this.$el.find('.loader').show()

  stopLoader: ->
    this.$el.find('.loader').hide()

