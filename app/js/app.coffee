# App.js
# ----------
# Defines jQuery plugin and main app
# Sets default options and copy user-specified options
# Initialize app
# ----------

# DapperDoe main app
class DapperDoe.App
  constructor: (options) ->
    settings =
      buttonClass: 'btn'
      colorPalette: [
        'eb6566'
        'f4794d'
        'fbd546'
        '599e7f'
        '3e8871'
        '618eb1'
        '0d6eb2'
        '595d8e'
        'b172ab'
        '792360'
        'ac8b66'
        '8b9291'
        'ffffff'
      ]

      #By defaut, image callback just log
      saveImageCallback: (formdata, callback) ->
        console.log(formdata)
        callback(false)

    settings = $.extend settings, options

    this.snippetsPath = settings.snippetsPath
    this.buttonClass = settings.buttonClass
    this.buttonOptions = settings.buttonOptions
    this.colorPalette = settings.colorPalette
    this.savePageCallback = settings.savePageCallback
    this.saveImageCallback = settings.saveImageCallback
    this.topElement = settings.topElement

    # We create a template based on the given snippetsPath
    this.template = new DapperDoe.Template
      topElement: this.topElement
      path: this.snippetsPath
      callback: this.buildApp

  # Called when the template has been initialized
  buildApp: =>
    this.initTopElement()
    this.buildUI()

  # Builds Dapper Doe UI based on the template
  buildUI: ->
    this.sidebar = new DapperDoe.Sidebar
      collection: this.template.snippetsPreviews
    this.textToolbar = new DapperDoe.Toolbar.Text
    this.textSubToolbarUrl = new DapperDoe.TextSubToolbar.Url
    this.textSubToolbarColor = new DapperDoe.TextSubToolbar.Color

  # Parses the exsiting html
  initTopElement: ->
    this.view = new DapperDoe.AppView
      el: this.topElement

  getHtml: ->
    this.view.getHtml()