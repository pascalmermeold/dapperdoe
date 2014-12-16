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
      savePageCallback: (html, callback) ->
        console.log(html)
        callback()
      saveImageCallback: (formdata, callback) ->
        console.log(formdata)
        callback('')

    settings = $.extend settings, options

    return @each () ->
      topElement = this

      window.app = new DapperDoe.App
        settings: settings
        topElement: $(this)

class DapperDoe.App
  constructor: (options) ->
    this.snippetsPath = options.settings.snippetsPath
    this.buttonClass = options.settings.buttonClass
    this.buttonOptions = options.settings.buttonOptions
    this.colorPalette = options.settings.colorPalette
    this.mobile = options.settings.mobile
    this.savePageCallback = options.settings.savePageCallback
    this.saveImageCallback = options.settings.saveImageCallback

    this.topElement = options.topElement
    $('body').addClass('mobile') if this.mobile

    this.template = new DapperDoe.Template
      topElement: this.topElement
      path: this.snippetsPath
      callback: this.buildApp

  buildApp: ->
    window.app.initTopElement()
    window.app.buildUI()

  buildUI: ->
    this.sidebar = new DapperDoe.Sidebar
      collection: this.template.snippetsPreviews

  initTopElement: ->
    this.view = new DapperDoe.AppView
      el: this.topElement