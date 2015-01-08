class DapperDoe.Template

  constructor: (options) ->
    this.attributes = options
    this.parseSnippets(options.callback)

  parseSnippets: (callback) ->
    $snippets = $('<div id="dd_snippets_loader"></div>')
    $snippets.load("#{this.attributes.path}", =>
      snippetsPreviews = []

      $snippets.children().each ->
        snippetsPreviews.push
          previewUrl: $(this).data('preview')
          html: $(this).html()

      this.snippetsPreviews = snippetsPreviews
      callback()
    )
