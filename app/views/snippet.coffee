class DapperDoe.Views.SnippetPreview extends Backbone.View

  events:
    "addSnippet" : "addSnippet"

  initialize: (options) ->
    this.buildSnippet(options.index)
    this.enableDraggable()

  buildSnippet: (index) ->
    this.$el = $("<div class='dd_snippet'></div>")
    this.$el.attr('id', "dd_snippet#{index}")
    this.$el.append($("<img src='#{window.app.template.attributes.path}/#{this.model.attributes.previewUrl}' />"))

  enableDraggable: ->
    this.$el.draggable
        appendTo: window.app.topElement
        helper: 'clone'
        revert: false
        connectToSortable: window.app.topElement

  addSnippet: (event, params) ->
    console.log params.element
    params.element.find('img').remove()
    params.element.append $(this.model.attributes.html)
    new DapperDoe.Views.Snippet({model: this.model, el: params.element})

class DapperDoe.Views.Sidebar extends Backbone.View

  events:
    "click .dd_sidebar_opener": "toggleSidebar"
  
  initialize: (options) ->
    this.buildSidebar()

  buildSidebar: ->
    this.$el = $("<div id='dd_sidebar'></div>")
    this.$el.append("<span class='dd_sidebar_opener'><i class='fa fa-pencil'></i></span>")
    this.$el.append("<div class='dd_snippets_previews'></div>")
    for snippet, i in this.collection.models
      snippet_view = new DapperDoe.Views.SnippetPreview
        model: snippet
        index: i
        collection: this.collection

      this.$el.find('> div').append(snippet_view.$el)

    $('body').append(this.$el)

  toggleSidebar: () ->
    this.$el.toggleClass('opened', 200)

class DapperDoe.Views.Snippet extends Backbone.View

  events:
    "mouseover" : "showTools"
    "mouseleave" : "hideTools"
    "click .snippet_destroyer" : "destroy"

  initialize: ->
    this.addTools()
    this.parseSnippet()

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
    this.$el.find('a, p, h1, h2, h3, h4, h5, h6').each ->  new DapperDoe.Views.Content.Text({el: $(this)})
    this.$el.find('img').each -> new DapperDoe.Views.Content.Image({el: $(this)})

  destroy: ->
    if confirm("Are you sure you want to destroy this snippet?")
      this.$el.remove()

class DapperDoe.Views.App extends Backbone.View

  events:
    "click" : "removeToolbars"
    "click #save_page_button" : "savePage"

  initialize: ->
    $('body').bind('click', => this.removeToolbars())
    this.$el.addClass('dd_top_element')
    this.addTools()
    this.$el.sortable
      items: ".dd_snippet"
      forcePlaceholderSize: true
      axis: 'y'
      receive: this.addSnippet
      handle: '.snippet_mover'

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

