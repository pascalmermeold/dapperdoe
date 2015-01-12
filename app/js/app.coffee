# App.js
# ----------
# Defines jQuery plugin and main app
# Sets default options and copy user-specified options
# Initialize app
# ----------

$ = jQuery

# jQuery Plugin definition
$.fn.extend
  dapperDoe: (options) ->

    #Default settings
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

      #By defaut, callbacks just log
      savePageCallback: (html, callback) ->
        console.log(html)
        callback()
      saveImageCallback: (formdata, callback) ->
        console.log(formdata)
        callback(false)

    settings = $.extend settings, options

    return @each () ->
      topElement = this

      window.app = new DapperDoe.App
        settings: settings
        topElement: $(this)

# DapperDoe app created by the jQuery plugin
class DapperDoe.App
  constructor: (options) ->
    this.snippetsPath = options.settings.snippetsPath
    this.buttonClass = options.settings.buttonClass
    this.buttonOptions = options.settings.buttonOptions
    this.colorPalette = options.settings.colorPalette
    this.savePageCallback = options.settings.savePageCallback
    this.saveImageCallback = options.settings.saveImageCallback

    this.topElement = options.topElement

    # We create a template based on the given snippetsPath
    this.template = new DapperDoe.Template
      topElement: this.topElement
      path: this.snippetsPath
      callback: this.buildApp

  # Called when the template has been initialized
  buildApp: ->
    window.app.initTopElement()
    window.app.buildUI()

  # Builds Dapper Doe UI based on the template
  buildUI: ->
    this.sidebar = new DapperDoe.Sidebar
      collection: this.template.snippetsPreviews

  # Parses the exsiting html
  initTopElement: ->
    this.view = new DapperDoe.AppView
      el: this.topElement