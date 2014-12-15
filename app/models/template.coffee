class DapperDoe.Models.Template extends Backbone.Model

  initialize: (options) ->
    this.parseSnippets(options.callback)

  parseSnippets: (callback) ->
    $snippets = $('<div id="dd_snippets_loader"></div>')
    $snippets.load("#{this.attributes.name}/snippets.html", =>
      snippetsPreviews = new DapperDoe.Collections.SnippetsPreviews()

      $snippets.children().each ->
        snippetsPreviews.add
          previewUrl: $(this).data('preview')
          type: $(this).data('type')
          html: $(this).html()
          collection: snippetsPreviews

      this.snippetsPreviews = snippetsPreviews
      callback()
    )
