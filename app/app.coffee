$ = jQuery

$.fn.extend
  dapperDoe: (options) ->
    settings =
      buttonClass: 'btn'
      colorPalette:
        'eb6566' : "Cayenne"
        'f4794d' : "Celosia"
        'fbd546' : "Freesia"
        '599e7f' : "Hemlock"
        '3e8871' : "Comfrey"
        '618eb1' : "Placid Blue"
        '0d6eb2' : "Dazzling Blue"
        '595d8e' : "Violet Tulip"
        'b172ab' : "Radiant Orchid"
        '792360' : "Magenta Purple"
        'ac8b66' : "Sand"
        '8b9291' : "Paloma"

    settings = $.extend settings, options

    return @each () ->
      topElement = this

      window.app = new DapperDoe.App
        settings: settings
        topElement: $(this)

class DapperDoe.App extends Backbone.Model

  initialize: (options) ->
    this.templateName = options.settings.templateName
    this.buttonClass = options.settings.buttonClass
    this.buttonOptions = options.settings.buttonOptions
    this.colorPalette = options.settings.colorPalette

    this.topElement = options.topElement

    this.template = new DapperDoe.Models.Template
      topElement: this.topElement
      name: this.templateName
      callback: this.buildApp

  buildApp: ->
    window.app.initTopElement()
    window.app.buildUI()

  buildUI: ->
    this.sidebar = new DapperDoe.Views.Sidebar
      collection: this.template.snippetsPreviews

  initTopElement: ->
    this.snippetsView = new DapperDoe.Views.Snippets
      el: this.topElement
      collection: new DapperDoe.Collections.Snippets()