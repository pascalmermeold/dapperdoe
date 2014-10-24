// Generated by CoffeeScript 1.8.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DapperDoe.Views.SnippetPreview = (function(_super) {
    __extends(SnippetPreview, _super);

    function SnippetPreview() {
      return SnippetPreview.__super__.constructor.apply(this, arguments);
    }

    SnippetPreview.prototype.events = {
      "addSnippet": "addSnippet"
    };

    SnippetPreview.prototype.initialize = function(options) {
      this.buildSnippet(options.index);
      return this.enableDraggable();
    };

    SnippetPreview.prototype.buildSnippet = function(index) {
      this.$el = $("<div class='dd_snippet'></div>");
      this.$el.attr('id', "dd_snippet" + index);
      return this.$el.append($("<img src='" + window.app.template.attributes.name + "/" + this.model.attributes.previewUrl + "' />"));
    };

    SnippetPreview.prototype.enableDraggable = function() {
      return this.$el.draggable({
        appendTo: window.app.topElement,
        helper: 'clone',
        revert: false,
        connectToSortable: window.app.topElement
      });
    };

    SnippetPreview.prototype.addSnippet = function(event, params) {
      params.element.find('img').remove();
      params.element.append($(this.model.attributes.html));
      return new DapperDoe.Views.Snippet({
        model: this.model,
        el: params.element
      });
    };

    return SnippetPreview;

  })(Backbone.View);

  DapperDoe.Views.Sidebar = (function(_super) {
    __extends(Sidebar, _super);

    function Sidebar() {
      return Sidebar.__super__.constructor.apply(this, arguments);
    }

    Sidebar.prototype.events = {
      "click .dd_sidebar_opener": "toggleSidebar"
    };

    Sidebar.prototype.initialize = function(options) {
      return this.buildSidebar();
    };

    Sidebar.prototype.buildSidebar = function() {
      var i, snippet, snippet_view, _i, _len, _ref;
      this.$el = $("<div id='dd_sidebar'></div>");
      this.$el.append("<span class='dd_sidebar_opener'><i class='fa fa-pencil'></i></span>");
      this.$el.append("<div class='dd_snippets_previews'></div>");
      _ref = this.collection.models;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        snippet = _ref[i];
        snippet_view = new DapperDoe.Views.SnippetPreview({
          model: snippet,
          index: i,
          collection: this.collection
        });
        this.$el.find('> div').append(snippet_view.$el);
      }
      return $('body').append(this.$el);
    };

    Sidebar.prototype.toggleSidebar = function() {
      return this.$el.toggleClass('opened', 200);
    };

    return Sidebar;

  })(Backbone.View);

  DapperDoe.Views.Snippet = (function(_super) {
    __extends(Snippet, _super);

    function Snippet() {
      return Snippet.__super__.constructor.apply(this, arguments);
    }

    Snippet.prototype.events = {
      "mouseover": "showTools",
      "mouseleave": "hideTools"
    };

    Snippet.prototype.initialize = function() {
      this.addTools();
      return this.parseSnippet();
    };

    Snippet.prototype.showTools = function() {
      return this.$el.find('.tool').fadeIn();
    };

    Snippet.prototype.hideTools = function() {
      return this.$el.find('.tool').fadeOut();
    };

    Snippet.prototype.addTools = function() {
      return this.$el.append("<div class='tool snippet_mover'><i class='fa fa-arrows'></i></div>");
    };

    Snippet.prototype.parseSnippet = function() {
      return this.$el.find('p, h1, h2, h3, h4, h5, h6').each(function() {
        return new DapperDoe.Views.Content.Text({
          el: $(this)
        });
      });
    };

    return Snippet;

  })(Backbone.View);

  DapperDoe.Views.Snippets = (function(_super) {
    __extends(Snippets, _super);

    function Snippets() {
      this.addSnippet = __bind(this.addSnippet, this);
      return Snippets.__super__.constructor.apply(this, arguments);
    }

    Snippets.prototype.events = {
      "click": "removeToolbars"
    };

    Snippets.prototype.initialize = function() {
      this.$el.addClass('dd_top_element');
      return this.$el.sortable({
        items: ".dd_snippet",
        forcePlaceholderSize: true,
        axis: 'y',
        receive: this.addSnippet,
        handle: '.snippet_mover'
      });
    };

    Snippets.prototype.addSnippet = function(event, ui) {
      var index;
      index = this.$el.find('.dd_snippet').length;
      $(ui.helper).attr('id', "snippet_" + index);
      $(ui.helper).removeAttr('style');
      return $(ui.item).trigger('addSnippet', {
        element: $("#snippet_" + index)
      });
    };

    Snippets.prototype.removeToolbars = function(e) {
      return $(window.app.topElement).find('.dd_toolbar').remove();
    };

    return Snippets;

  })(Backbone.View);

}).call(this);
