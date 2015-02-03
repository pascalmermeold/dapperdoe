/*! Dapper Doe - v0.2.0 - 2015-02-03
* https://github.com/pascalmerme/dapperdoe
* Copyright (c) 2015 Pascal Merme; Licensed MIT */
(function() {
  window.DapperDoe = {};

}).call(this);

(function() {
  DapperDoe.Template = (function() {
    function Template(options) {
      this.attributes = options;
      this.parseSnippets(options.callback);
    }

    Template.prototype.parseSnippets = function(callback) {
      var $snippets;
      $snippets = $('<div id="dd_snippets_loader"></div>');
      return $snippets.load("" + this.attributes.path, (function(_this) {
        return function() {
          var snippetsPreviews;
          snippetsPreviews = [];
          $snippets.children().each(function() {
            return snippetsPreviews.push({
              previewUrl: $(this).data('preview'),
              html: $(this).html()
            });
          });
          _this.snippetsPreviews = snippetsPreviews;
          return callback();
        };
      })(this));
    };

    return Template;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DapperDoe.SnippetPreview = (function() {
    function SnippetPreview(options) {
      this.snippet = options.snippet;
      this.index = options.index;
      this.buildSnippet();
      this.enableDraggable();
      this.events();
    }

    SnippetPreview.prototype.events = function() {
      return this.$el.bind('addSnippet', (function(_this) {
        return function(event, params) {
          return _this.addSnippet(event, params);
        };
      })(this));
    };

    SnippetPreview.prototype.buildSnippet = function() {
      this.$el = $("<div class='dd_snippet'></div>");
      this.$el.attr('id', "dd_snippet" + this.index);
      return this.$el.append($("<img src='" + this.snippet.previewUrl + "' />"));
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
      params.element.append($(this.snippet.html));
      return new DapperDoe.Snippet({
        el: params.element
      });
    };

    return SnippetPreview;

  })();

  DapperDoe.Sidebar = (function() {
    function Sidebar(options) {
      this.collection = options.collection;
      this.buildSidebar();
      this.events();
    }

    Sidebar.prototype.events = function() {
      return this.$el.find('.dd_sidebar_opener').bind('click', (function(_this) {
        return function() {
          return _this.toggleSidebar();
        };
      })(this));
    };

    Sidebar.prototype.buildSidebar = function() {
      var i, snippet, snippet_view, _i, _len, _ref;
      this.$el = $("<div id='dd_sidebar'></div>");
      this.$el.append("<span class='dd_sidebar_opener'><i class='fa fa-pencil'></i></span>");
      this.$el.append("<div class='dd_snippets_previews'></div>");
      _ref = this.collection;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        snippet = _ref[i];
        snippet_view = new DapperDoe.SnippetPreview({
          snippet: snippet,
          index: i
        });
        this.$el.find('> div').append(snippet_view.$el);
      }
      return $('body').append(this.$el);
    };

    Sidebar.prototype.toggleSidebar = function() {
      return this.$el.toggleClass('opened', 200);
    };

    return Sidebar;

  })();

  DapperDoe.Snippet = (function() {
    function Snippet(options) {
      this.changeColor = __bind(this.changeColor, this);
      this.$el = options.el;
      this.addTools();
      this.parseSnippet();
      this.events();
    }

    Snippet.prototype.events = function() {
      this.$el.bind("mouseover", (function(_this) {
        return function() {
          return _this.showTools();
        };
      })(this));
      this.$el.bind("mouseleave", (function(_this) {
        return function() {
          return _this.hideTools();
        };
      })(this));
      this.$el.find(".dd_tools .snippet_destroyer").bind("click", (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
      this.$el.find(".color").bind("click", (function(_this) {
        return function(e) {
          return _this.changeColor(e);
        };
      })(this));
      this.$el.find(".dd_tools .snippet_settings").bind("click", (function(_this) {
        return function() {
          return _this.toggleSettings();
        };
      })(this));
      this.$el.find(".dd_snippet_settings").bind("click", (function(_this) {
        return function() {
          return _this.hideSettings();
        };
      })(this));
      this.$el.find(".dd_image_background").bind("click", (function(_this) {
        return function(e) {
          return _this.imageBackgroundFileSelector(e);
        };
      })(this));
      this.$el.find(".dd_image_background .image_input, .dd_snippet_padding").bind("click", (function(_this) {
        return function(e) {
          return e.stopPropagation();
        };
      })(this));
      this.$el.find(".dd_image_background .image_input").bind("change", (function(_this) {
        return function(e) {
          return _this.uploadBackgroundImage(e);
        };
      })(this));
      return this.$el.find(".dd_snippet_padding").bind("input", (function(_this) {
        return function(e) {
          return _this.updatePadding(e);
        };
      })(this));
    };

    Snippet.prototype.toggleSettings = function() {
      if (this.$el.find('.dd_snippet_settings').is(':visible')) {
        return this.hideSettings();
      } else {
        return this.showSettings();
      }
    };

    Snippet.prototype.showTools = function() {
      return this.$el.find('.dd_tool').show();
    };

    Snippet.prototype.hideTools = function() {
      return this.$el.find('.dd_tool').hide();
    };

    Snippet.prototype.addTools = function() {
      var baseColor, _i, _len, _ref;
      this.$el.append("<div class='dd_tools dd_ui'> <div class='dd_tool snippet_mover'><i class='fa fa-arrows'></i></div> <div class='dd_tool snippet_settings'><i class='fa fa-adjust'></i></div> <div class='dd_tool snippet_destroyer'><i class='fa fa-trash'></i></div> </div>");
      this.$el.append("<div class='dd_snippet_settings dd_ui'><div class='dd_background_manager'></div></div>");
      _ref = window.app.colorPalette;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        baseColor = _ref[_i];
        this.$el.find('.dd_snippet_settings .dd_background_manager').append("<span class='color' style='background: #" + baseColor + ";' data-color='" + baseColor + "'></span>");
      }
      this.$el.find('.dd_snippet_settings .dd_background_manager').append("<span class='dd_image_background'><i class='fa fa-picture-o'></i></span><input type='file' class='image_input' style='display: none;'/>");
      return this.$el.find('.dd_snippet_settings .dd_background_manager').append("<br/><input type=range min=0 max=60 value=0 class='dd_snippet_padding'>");
    };

    Snippet.prototype.showSettings = function() {
      return this.$el.find('.dd_snippet_settings').show(200);
    };

    Snippet.prototype.hideSettings = function() {
      return this.$el.find('.dd_snippet_settings').hide(100);
    };

    Snippet.prototype.changeColor = function(e) {
      this.$el.css('background', '#' + $(e.target).data('color'));
      return this.hideSettings();
    };

    Snippet.prototype.imageBackgroundFileSelector = function(e) {
      e.stopPropagation();
      return this.$el.find('.image_input').trigger("click");
    };

    Snippet.prototype.uploadBackgroundImage = function(e) {
      var file, formdata, reader;
      if (e.target.files && e.target.files[0]) {
        file = e.target.files[0];
        if (file.type.match('image.*')) {
          reader = new FileReader();
          reader.onload = (function(_this) {
            return function(o) {
              return _this.$el.css('background', 'url(' + o.target.result + ') no-repeat center center', 200);
            };
          })(this);
          reader.readAsDataURL(file);
        }
        if (window.FormData) {
          formdata = new FormData();
          formdata.append('source', file);
          return window.app.saveImageCallback(formdata, (function(_this) {
            return function(url) {
              if (url) {
                _this.$el.css('background', 'url(' + url + ') no-repeat center center');
                _this.$el.css('background-size', 'cover');
              }
              return _this.hideSettings();
            };
          })(this));
        } else {
          return alert('Type de fichier non autorisé');
        }
      }
    };

    Snippet.prototype.updatePadding = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return this.$el.css('padding', $(e.target).val() + 'px 0');
    };

    Snippet.prototype.parseSnippet = function() {
      this.$el.find('.dd_text').each(function() {
        return new DapperDoe.Content.Text({
          el: $(this)
        });
      });
      return this.$el.find('img').each(function() {
        return new DapperDoe.Content.Image({
          el: $(this)
        });
      });
    };

    Snippet.prototype.destroy = function() {
      if (confirm("Are you sure you want to destroy this snippet?")) {
        return this.$el.remove();
      }
    };

    return Snippet;

  })();

  DapperDoe.AppView = (function() {
    function AppView(options) {
      this.addSnippet = __bind(this.addSnippet, this);
      this.$el = options.el;
      this.$el.addClass('dd_top_element');
      this.addTools();
      this.$el.sortable({
        items: ".dd_snippet",
        forcePlaceholderSize: true,
        axis: 'y',
        receive: this.addSnippet,
        handle: '.snippet_mover'
      });
      this.events();
      this.parsePage();
    }

    AppView.prototype.events = function() {
      $('body').bind('click', (function(_this) {
        return function() {
          return window.app.textToolbar.hide();
        };
      })(this));
      return this.$el.bind("click", (function(_this) {
        return function() {
          return window.app.textToolbar.hide();
        };
      })(this));
    };

    AppView.prototype.addSnippet = function(event, ui) {
      var index, randomnumber;
      randomnumber = Math.ceil(Math.random() * 100000);
      index = randomnumber = Math.ceil(Math.random() * 100000);
      $(ui.helper).attr('id', "snippet_" + index);
      $(ui.helper).removeAttr('style');
      return $(ui.item).trigger('addSnippet', {
        element: $("#snippet_" + index)
      });
    };

    AppView.prototype.addTools = function() {
      return $('body').append("<div class='dd_loader'><i class='fa fa-circle-o-notch fa-spin'></i></div>");
    };

    AppView.prototype.parsePage = function() {
      return this.$el.find('.dd_snippet').each(function(index, snippet) {
        return new DapperDoe.Snippet({
          el: $(snippet)
        });
      });
    };

    AppView.prototype.getHtml = function() {
      var html;
      html = this.$el.clone();
      $(html).find('.dd_ui').remove();
      $(html).find('.ui-draggable, .ui-draggable-handle').removeClass('ui-draggable ui-draggable-handle');
      $(html).find('.rangySelectionBoundary').remove();
      $(html).find('*[contenteditable=true]').removeAttr('contenteditable');
      $(html).find('.dd_image_wrapper').each(function() {
        $(this).find('img').appendTo($(this).parent());
        return $(this).remove();
      });
      $(html).find('.dd_text .dd_text_content').each(function() {
        $(this).children().appendTo($(this).parent());
        return $(this).remove();
      });
      return html.html().replace(/(\r\n|\n|\r|\t)/gm, "").replace(/<script>/gi, '').replace(/<\/script>/gi, '');
    };

    AppView.prototype.startLoader = function() {
      return $('.dd_loader').show();
    };

    AppView.prototype.stopLoader = function() {
      return $('.dd_loader').hide();
    };

    return AppView;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DapperDoe.Content = (function() {
    function Content(options) {
      this.$el = options.el;
      this.$el.bind('click', function(e) {
        return e.stopPropagation();
      });
    }

    return Content;

  })();

  DapperDoe.Toolbar = (function() {
    function Toolbar(options) {
      this.$el = $('<div></div>');
      this.$el.bind('click', function(e) {
        return e.stopPropagation();
      });
    }

    return Toolbar;

  })();

  DapperDoe.Tools = (function() {
    function Tools() {}

    return Tools;

  })();

  DapperDoe.Content.Text = (function(_super) {
    __extends(Text, _super);

    function Text(options) {
      Text.__super__.constructor.call(this, options);
      this.$el.attr('contenteditable', 'true');
      this.events();
      if ((this.$el.is('p, div, blockquote')) && (this.$el.children().length === 0)) {
        this.$el.wrapInner('<p></p>');
      } else if ((this.$el.is('h1, h2, h3, h4, h5, h6')) && (this.$el.children().length === 0)) {
        this.$el.wrapInner('<div></div>');
      }
    }

    Text.prototype.events = function() {
      this.$el.bind('paste', (function(_this) {
        return function(e) {
          return _this.handlePaste(e);
        };
      })(this));
      this.$el.bind('dragover drop', (function(_this) {
        return function(e) {
          return _this.preventDrag(e);
        };
      })(this));
      this.$el.bind('mouseup', (function(_this) {
        return function() {
          return _this.openToolbar();
        };
      })(this));
      return this.$el.bind('keyup', (function(_this) {
        return function() {
          return _this.openToolbar();
        };
      })(this));
    };

    Text.prototype.openToolbar = function() {
      var range;
      window.app.textToolbar.hide();
      range = rangy.getSelection().getRangeAt(0);
      if (range.startOffset !== range.endOffset) {
        return window.app.textToolbar.show();
      }
    };

    Text.prototype.handlePaste = function(e) {
      var temp, text;
      e.preventDefault();
      text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
      temp = document.createElement("div");
      temp.innerHTML = text;
      return document.execCommand('insertHtml', false, temp.textContent);
    };

    Text.prototype.preventDrag = function(e) {
      e.preventDefault();
      return false;
    };

    return Text;

  })(DapperDoe.Content);

  DapperDoe.Content.Image = (function(_super) {
    __extends(Image, _super);

    function Image(options) {
      Image.__super__.constructor.call(this, options);
      this.tools = new DapperDoe.Tools.Image({
        image: this.$el
      });
    }

    return Image;

  })(DapperDoe.Content);

  DapperDoe.Tools.Image = (function(_super) {
    __extends(Image, _super);

    function Image(options) {
      this.uploadImage = __bind(this.uploadImage, this);
      this.$image = options.image;
      this.$image.wrap('<div class="dd_image_wrapper"></div>');
      this.$el = this.$image.parent('.dd_image_wrapper');
      this.$el.append(this.html);
      this.$tools = this.$el.find('.dd_tools');
      this.positionTools();
      this.$tools.hide();
      this.events();
    }

    Image.prototype.events = function() {
      this.$el.find(".image_upload").bind("click", (function(_this) {
        return function() {
          return _this.selectFile();
        };
      })(this));
      this.$el.bind("mouseover", (function(_this) {
        return function() {
          return _this.$tools.show();
        };
      })(this));
      this.$el.bind("mouseout", (function(_this) {
        return function() {
          return _this.$tools.hide();
        };
      })(this));
      return this.$el.find(".image_input").bind("change", (function(_this) {
        return function(e) {
          return _this.uploadImage(e);
        };
      })(this));
    };

    Image.prototype.selectFile = function() {
      return this.$tools.find(".image_input").trigger("click");
    };

    Image.prototype.uploadImage = function(e) {
      var file, formdata, reader;
      if (e.target.files && e.target.files[0]) {
        file = e.target.files[0];
        if (file.type.match('image.*')) {
          reader = new FileReader();
          reader.onload = (function(_this) {
            return function(o) {
              _this.$image.attr('src', o.target.result);
              return _this.positionTools();
            };
          })(this);
          reader.readAsDataURL(file);
        }
        if (window.FormData) {
          formdata = new FormData();
          formdata.append('source', file);
          return window.app.saveImageCallback(formdata, (function(_this) {
            return function(url) {
              if (url) {
                return _this.$image.attr('src', url);
              }
            };
          })(this));
        } else {
          return alert('Type de fichier non autorisé');
        }
      }
    };

    Image.prototype.positionTools = function() {
      this.$tools.css('left', (this.$image.width() / 2) - (this.$el.find('.dd_tools').width() / 2));
      return this.$tools.css('top', (this.$image.height() / 2) - (this.$el.find('.dd_tools').height() / 2));
    };

    Image.prototype.remove = function() {
      this.$image.parent('.dd_image_wrapper').find('div').remove();
      return this.$image.unwrap();
    };

    Image.prototype.html = function() {
      return "<span class='dd_tools dd_ui'> <!--<i class='image_link fa fa-link'></i><br/>--> <i class='image_upload fa fa-image'></i> <input type='file' class='image_input' style='display: none;'/> </span>";
    };

    return Image;

  })(DapperDoe.Tools);

  DapperDoe.Toolbar.Text = (function(_super) {
    __extends(Text, _super);

    function Text(options) {
      this.applyForeColor = __bind(this.applyForeColor, this);
      this.editText = __bind(this.editText, this);
      Text.__super__.constructor.call(this, options);
      this.$el.html(this.html);
      $(window.app.topElement).append(this.$el);
      this.toolbarWidth = this.$el.find('.dd_toolbar').width();
      this.toolbarHeight = this.$el.find('.dd_toolbar').height();
      this.$el.hide();
      this.events();
    }

    Text.prototype.events = function() {
      return this.$el.find("button").bind("click", (function(_this) {
        return function(e) {
          return _this.editText(e);
        };
      })(this));
    };

    Text.prototype.hide = function() {
      this.$el.hide();
      return this.hideSubToolbar();
    };

    Text.prototype.hideSubToolbar = function() {
      window.app.textSubToolbarColor.hide();
      return window.app.textSubToolbarUrl.hide();
    };

    Text.prototype.show = function() {
      var boundary, left, top;
      this.$el.hide();
      boundary = rangy.getSelection().getRangeAt(0).getBoundingClientRect();
      if (boundary.bottom > 0) {
        top = boundary.top - 10;
        left = boundary.left + (boundary.width / 2) - (this.toolbarWidth / 2);
        if (left < 10) {
          left = 10;
        }
        if ((left + this.toolbarWidth) > ($(document).width() - 10)) {
          left = $(document).width() - 10 - this.toolbarWidth;
        }
        this.$el.find('.dd_toolbar').css('bottom', $(window.app.topElement).height() - top - $(window).scrollTop());
        this.$el.find('.dd_toolbar').css('left', left);
        return this.$el.show();
      }
    };

    Text.prototype.editText = function(e) {
      var action;
      if (window.app.lastSel) {
        rangy.removeMarkers(window.app.lastSel);
      }
      window.app.lastSel = rangy.saveSelection();
      action = $(e.currentTarget).data('action');
      this.hideSubToolbar();
      switch (action) {
        case "bold":
          document.execCommand('bold', false, null);
          break;
        case "italic":
          document.execCommand('italic', false, null);
          break;
        case "underline":
          document.execCommand('underline', false, null);
          break;
        case "text-color":
          window.app.textSubToolbarColor.show(this.applyForeColor);
          break;
        case "align-left":
          document.execCommand('justifyLeft', false, null);
          break;
        case "align-center":
          document.execCommand('justifyCenter', false, null);
          break;
        case "align-right":
          document.execCommand('justifyRight', false, null);
          break;
        case "link":
          window.app.textSubToolbarUrl.show();
          break;
        case "unlink":
          document.execCommand('unlink', false, null);
          break;
        case "clear":
          document.execCommand('removeFormat', false, null);
          document.execCommand('unlink', false, null);
          break;
        case "undo":
          document.execCommand('undo', false, null);
      }
      return this.show();
    };

    Text.prototype.html = function() {
      return $("<div class='dd_toolbar dd_ui'> <div class='dd_sub_toolbar'></div> <button data-action='bold'><i class='fa fa-bold'></i></button> <button data-action='italic'><i class='fa fa-italic'></i></button> <button data-action='underline'><i class='fa fa-underline'></i></button> <button data-action='text-color'><i class='fa fa-tint'></i></button> <button data-action='align-left'><i class='fa fa-align-left'></i></button> <button data-action='align-center'><i class='fa fa-align-center'></i></button> <button data-action='align-right'><i class='fa fa-align-right'></i></button> <button data-action='link'><i class='fa fa-link'></i></button> <button data-action='unlink'><i class='fa fa-unlink'></i></button> <button data-action='clear'><i class='fa fa-eraser'></i></button> <button data-action='undo'><i class='fa fa-undo'></i></button> </div>");
    };

    Text.prototype.applyForeColor = function(color) {
      rangy.restoreSelection(window.app.lastSel);
      return document.execCommand('foreColor', false, color);
    };

    return Text;

  })(DapperDoe.Toolbar);

  DapperDoe.TextSubToolbar = (function() {
    function TextSubToolbar(options) {
      this.$el = window.app.textToolbar.$el.find('.dd_sub_toolbar');
      this.$el.hide();
      this.$el.append(this.html());
      this.events();
    }

    TextSubToolbar.prototype.events = function() {
      this.$el.bind("click", (function(_this) {
        return function(e) {
          return _this.stopPropagation(e);
        };
      })(this));
      return this.$el.find(".dd_submit").bind("click", (function(_this) {
        return function(e) {
          return _this.doAction(e);
        };
      })(this));
    };

    TextSubToolbar.prototype.show = function(type, callback, hideExisting) {
      this.callback = callback;
      if (hideExisting) {
        this.$el.find('.dd_sub_toolbar_content').hide();
      }
      this.$el.find(".dd_toolbar_" + type).show();
      return this.$el.slideDown(200);
    };

    TextSubToolbar.prototype.doAction = function(e) {
      return e.stopPropagation();
    };

    TextSubToolbar.prototype.hide = function() {
      $('.dd_toolbar button').removeClass('active');
      return this.$el.hide();
    };

    TextSubToolbar.prototype.stopPropagation = function(e) {
      return e.stopPropagation();
    };

    TextSubToolbar.prototype.html = function() {
      return "";
    };

    return TextSubToolbar;

  })();

  DapperDoe.TextSubToolbar.Color = (function(_super) {
    __extends(Color, _super);

    function Color(options) {
      this.html = __bind(this.html, this);
      Color.__super__.constructor.call(this, options);
    }

    Color.prototype.events = function() {
      Color.__super__.events.call(this);
      return this.$el.find(".color").bind("click", (function(_this) {
        return function(e) {
          return _this.doAction(e);
        };
      })(this));
    };

    Color.prototype.stopPropagation = function(e) {
      return e.stopPropagation();
    };

    Color.prototype.doAction = function(e) {
      var color;
      e.stopPropagation();
      color = $(e.target).data('color');
      this.hide(e);
      return this.callback(color);
    };

    Color.prototype.hide = function() {
      return this.$el.find('.dd_toolbar_color').hide();
    };

    Color.prototype.show = function(callback, isSubSub) {
      Color.__super__.show.call(this, 'color', callback, !isSubSub);
      if (!isSubSub) {
        return $('.dd_toolbar button[data-action=text-color]').addClass('active');
      }
    };

    Color.prototype.html = function() {
      var $html, baseColor, colorWidth, colors, columnWidth, _i, _len;
      $html = $("<div class='dd_sub_toolbar_content dd_toolbar_color'></div>");
      colors = window.app.colorPalette;
      columnWidth = window.app.textToolbar.toolbarWidth / colors.length;
      colorWidth = Math.round(columnWidth - 4);
      for (_i = 0, _len = colors.length; _i < _len; _i++) {
        baseColor = colors[_i];
        $html.append("<span class='color' style='background: #" + baseColor + "; width: " + colorWidth + "px; height: " + colorWidth + "px;' data-color='" + baseColor + "'></span>");
      }
      return $html;
    };

    return Color;

  })(DapperDoe.TextSubToolbar);

  DapperDoe.TextSubToolbar.Url = (function(_super) {
    __extends(Url, _super);

    function Url(options) {
      this.manageLinkColor = __bind(this.manageLinkColor, this);
      Url.__super__.constructor.call(this, options);
      this.$el.find('.dd_link_color').bind('click', this.manageLinkColor);
      this.linkColor = 'fff';
    }

    Url.prototype.manageLinkColor = function(e) {
      if (window.app.textSubToolbarColor.$el.find('.dd_toolbar_color').is(':visible')) {
        return window.app.textSubToolbarColor.hide();
      } else {
        return window.app.textSubToolbarColor.show(function(color) {
          window.app.textSubToolbarUrl.linkColor = color;
          return this.$el.find('.dd_link_color').css('background', '#' + color);
        }, true);
      }
    };

    Url.prototype.doAction = function(e) {
      var cssApplier, cssClass, key, option, _ref;
      e.stopPropagation();
      this.url = this.$el.find('.dd_url').val();
      this.blank = this.$el.find('.dd_blank').is(':checked');
      this.button = this.$el.find('.dd_button').is(':checked');
      rangy.restoreSelection(app.lastSel);
      this.link = document.execCommand('createLink', false, this.url);
      if (this.blank) {
        rangy.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.setAttribute("target", "_blank");
      }
      if (this.button) {
        rangy.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.setAttribute("style", "background: #" + this.linkColor + ";");
      } else {
        rangy.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.setAttribute("style", "color: #" + this.linkColor + ";");
      }
      if (this.button) {
        cssClass = window.app.buttonClass;
        _ref = window.app.buttonOptions;
        for (key in _ref) {
          option = _ref[key];
          cssClass += " " + this.$el.find("input[name=" + key + "]:checked").val();
        }
        cssApplier = rangy.createCssClassApplier(cssClass, {
          normalize: true,
          elementTagName: 'a'
        });
        cssApplier.toggleSelection();
      }
      return this.hide(e);
    };

    Url.prototype.show = function() {
      $('.dd_toolbar button[data-action=link]').addClass('active');
      Url.__super__.show.call(this, 'url', function() {
        return console.log('');
      }, true);
      return this.$el.find('.dd_link_color').css('background', '#fff');
    };

    Url.prototype.html = function() {
      var $html, key, klass, name, option, _ref;
      $html = $("<div class='dd_sub_toolbar_content dd_toolbar_url'> <input type='text' placeholder='Url' class='dd_url' /> <span class='dd_link_color'></span> <div class='dd_submit'><i class='fa fa-check'></i></div> <div class='clearfix'></div> <div class='dd_url_options'> <label>_blank <input type='checkbox' class='dd_blank'/></label> <label>Button <input type='checkbox' class='dd_button'/></label> </div> </div>");
      _ref = window.app.buttonOptions;
      for (key in _ref) {
        option = _ref[key];
        for (klass in option) {
          name = option[klass];
          $html.find(".dd_url_options").append("<label> " + name + " <input type='radio' name='" + key + "' value='" + klass + "' /> </label>");
        }
        $html.find("input[name=" + key + "]:first").attr('checked', true);
      }
      return $html;
    };

    return Url;

  })(DapperDoe.TextSubToolbar);

  DapperDoe.Modal = (function() {
    function Modal(options) {
      this.$el = this.html();
      $(window.app.topElement).append(this.$el);
      this.events();
    }

    Modal.prototype.events = function() {
      this.$el.bind("click", (function(_this) {
        return function(e) {
          return _this.stopPropagation(e);
        };
      })(this));
      this.$el.find(".dd_submit_modal").bind("click", (function(_this) {
        return function(e) {
          return _this.doAction(e);
        };
      })(this));
      return this.$el.find(".dd_close_modal").bind("click", (function(_this) {
        return function(e) {
          return _this.closeModal(e);
        };
      })(this));
    };

    Modal.prototype.doAction = function(e) {
      return e.stopPropagation();
    };

    Modal.prototype.closeModal = function(e) {
      e.stopPropagation();
      return this.$el.remove();
    };

    Modal.prototype.stopPropagation = function(e) {
      return e.stopPropagation();
    };

    Modal.prototype.html = function() {
      return $("<div class='dd_modal_overlay'> <div class='dd_modal'> <span class='dd_close_modal'><i class='fa fa-close'></i></span> <div class='dd_content'> </div> </div> </div>");
    };

    return Modal;

  })();

  DapperDoe.Modal.Color = (function(_super) {
    __extends(Color, _super);

    function Color(options) {
      this.html = __bind(this.html, this);
      Color.__super__.constructor.call(this, options);
      this.callback = options.callback;
      this.events();
    }

    Color.prototype.events = function() {
      Color.__super__.events.call(this);
      return this.$el.find(".color").bind("click", (function(_this) {
        return function(e) {
          return _this.doAction(e);
        };
      })(this));
    };

    Color.prototype.stopPropagation = function(e) {
      return e.stopPropagation();
    };

    Color.prototype.doAction = function(e) {
      var color;
      e.stopPropagation();
      color = $(e.target).data('color');
      this.closeModal(e);
      return this.callback(color);
    };

    Color.prototype.colorLuminance = function(hex, lum) {
      var c, i, rgb, _i;
      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      lum = lum || 0;
      rgb = "";
      for (i = _i = 0; _i <= 2; i = _i += 1) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
      }
      return rgb;
    };

    Color.prototype.html = function() {
      var $html, baseColor, color, colorName, i, _i, _ref;
      $html = Color.__super__.html.call(this);
      $html.find('.dd_content').append("<table class='dd_color_palette'></table>");
      _ref = window.app.colorPalette;
      for (baseColor in _ref) {
        colorName = _ref[baseColor];
        $html.find('.dd_color_palette').append("<tr class='base_color_" + baseColor + "'></tr>");
        for (i = _i = -2; _i <= 3; i = _i += 1) {
          color = this.colorLuminance(baseColor, i * 0.3);
          $html.find(".dd_color_palette .base_color_" + baseColor).append("<td class='color' style='background: #" + color + ";' data-color='" + color + "'></td>");
        }
      }
      return $html;
    };

    return Color;

  })(DapperDoe.Modal);

  DapperDoe.Modal.Url = (function(_super) {
    __extends(Url, _super);

    function Url(options) {
      Url.__super__.constructor.call(this, options);
    }

    Url.prototype.doAction = function(e) {
      var cssApplier, cssClass, key, option, _ref;
      e.stopPropagation();
      this.url = this.$el.find('.dd_url').val();
      this.blank = this.$el.find('.dd_blank').is(':checked');
      this.button = this.$el.find('.dd_button').is(':checked');
      rangy.restoreSelection(app.lastSel);
      this.link = document.execCommand('createLink', false, this.url);
      if (this.blank) {
        rangy.getSelection().getRangeAt(0).commonAncestorContainer.parentNode.setAttribute("target", "_blank");
      }
      if (this.button) {
        cssClass = window.app.buttonClass;
        _ref = window.app.buttonOptions;
        for (key in _ref) {
          option = _ref[key];
          cssClass += " " + this.$el.find("input[name=" + key + "]:checked").val();
        }
        cssApplier = rangy.createCssClassApplier(cssClass, {
          normalize: true,
          elementTagName: 'a'
        });
        cssApplier.toggleSelection();
      }
      return this.closeModal(e);
    };

    Url.prototype.html = function() {
      var $html, key, klass, name, option, _ref;
      $html = Url.__super__.html.call(this);
      $html.find('.dd_content').append("<input type='text' placeholder='Url' class='dd_url' /> <div class='dd_options'> <label> Target blank <input type='checkbox' class='dd_blank'/> </label> <div class='dd_button_options'> <b>Button <input type='checkbox' class='dd_button'/></b> </div> </div> <input type='submit' value='OK' class='dd_submit_modal'/>");
      _ref = window.app.buttonOptions;
      for (key in _ref) {
        option = _ref[key];
        $html.find('.dd_button_options').append("<div class='dd_button_option " + key + "'></div>");
        for (klass in option) {
          name = option[klass];
          $html.find(".dd_button_options .dd_button_option." + key).append("<label> " + name + " <input type='radio' name='" + key + "' value='" + klass + "' /> </label>");
        }
        $html.find("input[name=" + key + "]:first").attr('checked', true);
      }
      return $html;
    };

    return Url;

  })(DapperDoe.Modal);

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  DapperDoe.App = (function() {
    function App(options) {
      this.buildApp = __bind(this.buildApp, this);
      var settings;
      settings = {
        buttonClass: 'btn',
        colorPalette: ['eb6566', 'f4794d', 'fbd546', '599e7f', '3e8871', '618eb1', '0d6eb2', '595d8e', 'b172ab', '792360', 'ac8b66', '8b9291', 'eeeeee', 'ffffff'],
        saveImageCallback: function(formdata, callback) {
          console.log(formdata);
          return callback(false);
        }
      };
      settings = $.extend(settings, options);
      this.snippetsPath = settings.snippetsPath;
      this.buttonClass = settings.buttonClass;
      this.buttonOptions = settings.buttonOptions;
      this.colorPalette = settings.colorPalette;
      this.savePageCallback = settings.savePageCallback;
      this.saveImageCallback = settings.saveImageCallback;
      this.topElement = settings.topElement;
      this.template = new DapperDoe.Template({
        topElement: this.topElement,
        path: this.snippetsPath,
        callback: this.buildApp
      });
    }

    App.prototype.buildApp = function() {
      this.initTopElement();
      return this.buildUI();
    };

    App.prototype.buildUI = function() {
      this.sidebar = new DapperDoe.Sidebar({
        collection: this.template.snippetsPreviews
      });
      this.textToolbar = new DapperDoe.Toolbar.Text;
      this.textSubToolbarUrl = new DapperDoe.TextSubToolbar.Url;
      return this.textSubToolbarColor = new DapperDoe.TextSubToolbar.Color;
    };

    App.prototype.initTopElement = function() {
      return this.view = new DapperDoe.AppView({
        el: this.topElement
      });
    };

    App.prototype.getHtml = function() {
      return this.view.getHtml();
    };

    return App;

  })();

}).call(this);

window.rangy=function(){function l(p,u){var w=typeof p[u];return w=="function"||!!(w=="object"&&p[u])||w=="unknown"}function K(p,u){return!!(typeof p[u]=="object"&&p[u])}function H(p,u){return typeof p[u]!="undefined"}function I(p){return function(u,w){for(var B=w.length;B--;)if(!p(u,w[B]))return false;return true}}function z(p){return p&&A(p,x)&&v(p,t)}function C(p){window.alert("Rangy not supported in your browser. Reason: "+p);c.initialized=true;c.supported=false}function N(){if(!c.initialized){var p,
u=false,w=false;if(l(document,"createRange")){p=document.createRange();if(A(p,n)&&v(p,i))u=true;p.detach()}if((p=K(document,"body")?document.body:document.getElementsByTagName("body")[0])&&l(p,"createTextRange")){p=p.createTextRange();if(z(p))w=true}!u&&!w&&C("Neither Range nor TextRange are implemented");c.initialized=true;c.features={implementsDomRange:u,implementsTextRange:w};u=k.concat(f);w=0;for(p=u.length;w<p;++w)try{u[w](c)}catch(B){K(window,"console")&&l(window.console,"log")&&window.console.log("Init listener threw an exception. Continuing.",
B)}}}function O(p){this.name=p;this.supported=this.initialized=false}var i=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer","START_TO_START","START_TO_END","END_TO_START","END_TO_END"],n=["setStart","setStartBefore","setStartAfter","setEnd","setEndBefore","setEndAfter","collapse","selectNode","selectNodeContents","compareBoundaryPoints","deleteContents","extractContents","cloneContents","insertNode","surroundContents","cloneRange","toString","detach"],
t=["boundingHeight","boundingLeft","boundingTop","boundingWidth","htmlText","text"],x=["collapse","compareEndPoints","duplicate","getBookmark","moveToBookmark","moveToElementText","parentElement","pasteHTML","select","setEndPoint","getBoundingClientRect"],A=I(l),q=I(K),v=I(H),c={version:"1.2.3",initialized:false,supported:true,util:{isHostMethod:l,isHostObject:K,isHostProperty:H,areHostMethods:A,areHostObjects:q,areHostProperties:v,isTextRange:z},features:{},modules:{},config:{alertOnWarn:false,preferTextRange:false}};
c.fail=C;c.warn=function(p){p="Rangy warning: "+p;if(c.config.alertOnWarn)window.alert(p);else typeof window.console!="undefined"&&typeof window.console.log!="undefined"&&window.console.log(p)};if({}.hasOwnProperty)c.util.extend=function(p,u){for(var w in u)if(u.hasOwnProperty(w))p[w]=u[w]};else C("hasOwnProperty not supported");var f=[],k=[];c.init=N;c.addInitListener=function(p){c.initialized?p(c):f.push(p)};var r=[];c.addCreateMissingNativeApiListener=function(p){r.push(p)};c.createMissingNativeApi=
function(p){p=p||window;N();for(var u=0,w=r.length;u<w;++u)r[u](p)};O.prototype.fail=function(p){this.initialized=true;this.supported=false;throw Error("Module '"+this.name+"' failed to load: "+p);};O.prototype.warn=function(p){c.warn("Module "+this.name+": "+p)};O.prototype.createError=function(p){return Error("Error in Rangy "+this.name+" module: "+p)};c.createModule=function(p,u){var w=new O(p);c.modules[p]=w;k.push(function(B){u(B,w);w.initialized=true;w.supported=true})};c.requireModules=function(p){for(var u=
0,w=p.length,B,V;u<w;++u){V=p[u];B=c.modules[V];if(!B||!(B instanceof O))throw Error("Module '"+V+"' not found");if(!B.supported)throw Error("Module '"+V+"' not supported");}};var L=false;q=function(){if(!L){L=true;c.initialized||N()}};if(typeof window=="undefined")C("No window found");else if(typeof document=="undefined")C("No document found");else{l(document,"addEventListener")&&document.addEventListener("DOMContentLoaded",q,false);if(l(window,"addEventListener"))window.addEventListener("load",
q,false);else l(window,"attachEvent")?window.attachEvent("onload",q):C("Window does not have required addEventListener or attachEvent method");return c}}();
rangy.createModule("DomUtil",function(l,K){function H(c){for(var f=0;c=c.previousSibling;)f++;return f}function I(c,f){var k=[],r;for(r=c;r;r=r.parentNode)k.push(r);for(r=f;r;r=r.parentNode)if(v(k,r))return r;return null}function z(c,f,k){for(k=k?c:c.parentNode;k;){c=k.parentNode;if(c===f)return k;k=c}return null}function C(c){c=c.nodeType;return c==3||c==4||c==8}function N(c,f){var k=f.nextSibling,r=f.parentNode;k?r.insertBefore(c,k):r.appendChild(c);return c}function O(c){if(c.nodeType==9)return c;
else if(typeof c.ownerDocument!="undefined")return c.ownerDocument;else if(typeof c.document!="undefined")return c.document;else if(c.parentNode)return O(c.parentNode);else throw Error("getDocument: no document found for node");}function i(c){if(!c)return"[No node]";return C(c)?'"'+c.data+'"':c.nodeType==1?"<"+c.nodeName+(c.id?' id="'+c.id+'"':"")+">["+c.childNodes.length+"]":c.nodeName}function n(c){this._next=this.root=c}function t(c,f){this.node=c;this.offset=f}function x(c){this.code=this[c];
this.codeName=c;this.message="DOMException: "+this.codeName}var A=l.util;A.areHostMethods(document,["createDocumentFragment","createElement","createTextNode"])||K.fail("document missing a Node creation method");A.isHostMethod(document,"getElementsByTagName")||K.fail("document missing getElementsByTagName method");var q=document.createElement("div");A.areHostMethods(q,["insertBefore","appendChild","cloneNode"])||K.fail("Incomplete Element implementation");A.isHostProperty(q,"innerHTML")||K.fail("Element is missing innerHTML property");
q=document.createTextNode("test");A.areHostMethods(q,["splitText","deleteData","insertData","appendData","cloneNode"])||K.fail("Incomplete Text Node implementation");var v=function(c,f){for(var k=c.length;k--;)if(c[k]===f)return true;return false};n.prototype={_current:null,hasNext:function(){return!!this._next},next:function(){var c=this._current=this._next,f;if(this._current)if(f=c.firstChild)this._next=f;else{for(f=null;c!==this.root&&!(f=c.nextSibling);)c=c.parentNode;this._next=f}return this._current},
detach:function(){this._current=this._next=this.root=null}};t.prototype={equals:function(c){return this.node===c.node&this.offset==c.offset},inspect:function(){return"[DomPosition("+i(this.node)+":"+this.offset+")]"}};x.prototype={INDEX_SIZE_ERR:1,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INVALID_STATE_ERR:11};x.prototype.toString=function(){return this.message};l.dom={arrayContains:v,isHtmlNamespace:function(c){var f;return typeof c.namespaceURI==
"undefined"||(f=c.namespaceURI)===null||f=="http://www.w3.org/1999/xhtml"},parentElement:function(c){c=c.parentNode;return c.nodeType==1?c:null},getNodeIndex:H,getNodeLength:function(c){var f;return C(c)?c.length:(f=c.childNodes)?f.length:0},getCommonAncestor:I,isAncestorOf:function(c,f,k){for(f=k?f:f.parentNode;f;)if(f===c)return true;else f=f.parentNode;return false},getClosestAncestorIn:z,isCharacterDataNode:C,insertAfter:N,splitDataNode:function(c,f){var k=c.cloneNode(false);k.deleteData(0,f);
c.deleteData(f,c.length-f);N(k,c);return k},getDocument:O,getWindow:function(c){c=O(c);if(typeof c.defaultView!="undefined")return c.defaultView;else if(typeof c.parentWindow!="undefined")return c.parentWindow;else throw Error("Cannot get a window object for node");},getIframeWindow:function(c){if(typeof c.contentWindow!="undefined")return c.contentWindow;else if(typeof c.contentDocument!="undefined")return c.contentDocument.defaultView;else throw Error("getIframeWindow: No Window object found for iframe element");
},getIframeDocument:function(c){if(typeof c.contentDocument!="undefined")return c.contentDocument;else if(typeof c.contentWindow!="undefined")return c.contentWindow.document;else throw Error("getIframeWindow: No Document object found for iframe element");},getBody:function(c){return A.isHostObject(c,"body")?c.body:c.getElementsByTagName("body")[0]},getRootContainer:function(c){for(var f;f=c.parentNode;)c=f;return c},comparePoints:function(c,f,k,r){var L;if(c==k)return f===r?0:f<r?-1:1;else if(L=z(k,
c,true))return f<=H(L)?-1:1;else if(L=z(c,k,true))return H(L)<r?-1:1;else{f=I(c,k);c=c===f?f:z(c,f,true);k=k===f?f:z(k,f,true);if(c===k)throw Error("comparePoints got to case 4 and childA and childB are the same!");else{for(f=f.firstChild;f;){if(f===c)return-1;else if(f===k)return 1;f=f.nextSibling}throw Error("Should not be here!");}}},inspectNode:i,fragmentFromNodeChildren:function(c){for(var f=O(c).createDocumentFragment(),k;k=c.firstChild;)f.appendChild(k);return f},createIterator:function(c){return new n(c)},
DomPosition:t};l.DOMException=x});
rangy.createModule("DomRange",function(l){function K(a,e){return a.nodeType!=3&&(g.isAncestorOf(a,e.startContainer,true)||g.isAncestorOf(a,e.endContainer,true))}function H(a){return g.getDocument(a.startContainer)}function I(a,e,j){if(e=a._listeners[e])for(var o=0,E=e.length;o<E;++o)e[o].call(a,{target:a,args:j})}function z(a){return new Z(a.parentNode,g.getNodeIndex(a))}function C(a){return new Z(a.parentNode,g.getNodeIndex(a)+1)}function N(a,e,j){var o=a.nodeType==11?a.firstChild:a;if(g.isCharacterDataNode(e))j==
e.length?g.insertAfter(a,e):e.parentNode.insertBefore(a,j==0?e:g.splitDataNode(e,j));else j>=e.childNodes.length?e.appendChild(a):e.insertBefore(a,e.childNodes[j]);return o}function O(a){for(var e,j,o=H(a.range).createDocumentFragment();j=a.next();){e=a.isPartiallySelectedSubtree();j=j.cloneNode(!e);if(e){e=a.getSubtreeIterator();j.appendChild(O(e));e.detach(true)}if(j.nodeType==10)throw new S("HIERARCHY_REQUEST_ERR");o.appendChild(j)}return o}function i(a,e,j){var o,E;for(j=j||{stop:false};o=a.next();)if(a.isPartiallySelectedSubtree())if(e(o)===
false){j.stop=true;return}else{o=a.getSubtreeIterator();i(o,e,j);o.detach(true);if(j.stop)return}else for(o=g.createIterator(o);E=o.next();)if(e(E)===false){j.stop=true;return}}function n(a){for(var e;a.next();)if(a.isPartiallySelectedSubtree()){e=a.getSubtreeIterator();n(e);e.detach(true)}else a.remove()}function t(a){for(var e,j=H(a.range).createDocumentFragment(),o;e=a.next();){if(a.isPartiallySelectedSubtree()){e=e.cloneNode(false);o=a.getSubtreeIterator();e.appendChild(t(o));o.detach(true)}else a.remove();
if(e.nodeType==10)throw new S("HIERARCHY_REQUEST_ERR");j.appendChild(e)}return j}function x(a,e,j){var o=!!(e&&e.length),E,T=!!j;if(o)E=RegExp("^("+e.join("|")+")$");var m=[];i(new q(a,false),function(s){if((!o||E.test(s.nodeType))&&(!T||j(s)))m.push(s)});return m}function A(a){return"["+(typeof a.getName=="undefined"?"Range":a.getName())+"("+g.inspectNode(a.startContainer)+":"+a.startOffset+", "+g.inspectNode(a.endContainer)+":"+a.endOffset+")]"}function q(a,e){this.range=a;this.clonePartiallySelectedTextNodes=
e;if(!a.collapsed){this.sc=a.startContainer;this.so=a.startOffset;this.ec=a.endContainer;this.eo=a.endOffset;var j=a.commonAncestorContainer;if(this.sc===this.ec&&g.isCharacterDataNode(this.sc)){this.isSingleCharacterDataNode=true;this._first=this._last=this._next=this.sc}else{this._first=this._next=this.sc===j&&!g.isCharacterDataNode(this.sc)?this.sc.childNodes[this.so]:g.getClosestAncestorIn(this.sc,j,true);this._last=this.ec===j&&!g.isCharacterDataNode(this.ec)?this.ec.childNodes[this.eo-1]:g.getClosestAncestorIn(this.ec,
j,true)}}}function v(a){this.code=this[a];this.codeName=a;this.message="RangeException: "+this.codeName}function c(a,e,j){this.nodes=x(a,e,j);this._next=this.nodes[0];this._position=0}function f(a){return function(e,j){for(var o,E=j?e:e.parentNode;E;){o=E.nodeType;if(g.arrayContains(a,o))return E;E=E.parentNode}return null}}function k(a,e){if(G(a,e))throw new v("INVALID_NODE_TYPE_ERR");}function r(a){if(!a.startContainer)throw new S("INVALID_STATE_ERR");}function L(a,e){if(!g.arrayContains(e,a.nodeType))throw new v("INVALID_NODE_TYPE_ERR");
}function p(a,e){if(e<0||e>(g.isCharacterDataNode(a)?a.length:a.childNodes.length))throw new S("INDEX_SIZE_ERR");}function u(a,e){if(h(a,true)!==h(e,true))throw new S("WRONG_DOCUMENT_ERR");}function w(a){if(D(a,true))throw new S("NO_MODIFICATION_ALLOWED_ERR");}function B(a,e){if(!a)throw new S(e);}function V(a){return!!a.startContainer&&!!a.endContainer&&!(!g.arrayContains(ba,a.startContainer.nodeType)&&!h(a.startContainer,true))&&!(!g.arrayContains(ba,a.endContainer.nodeType)&&!h(a.endContainer,
true))&&a.startOffset<=(g.isCharacterDataNode(a.startContainer)?a.startContainer.length:a.startContainer.childNodes.length)&&a.endOffset<=(g.isCharacterDataNode(a.endContainer)?a.endContainer.length:a.endContainer.childNodes.length)}function J(a){r(a);if(!V(a))throw Error("Range error: Range is no longer valid after DOM mutation ("+a.inspect()+")");}function ca(){}function Y(a){a.START_TO_START=ia;a.START_TO_END=la;a.END_TO_END=ra;a.END_TO_START=ma;a.NODE_BEFORE=na;a.NODE_AFTER=oa;a.NODE_BEFORE_AND_AFTER=
pa;a.NODE_INSIDE=ja}function W(a){Y(a);Y(a.prototype)}function da(a,e){return function(){J(this);var j=this.startContainer,o=this.startOffset,E=this.commonAncestorContainer,T=new q(this,true);if(j!==E){j=g.getClosestAncestorIn(j,E,true);o=C(j);j=o.node;o=o.offset}i(T,w);T.reset();E=a(T);T.detach();e(this,j,o,j,o);return E}}function fa(a,e,j){function o(m,s){return function(y){r(this);L(y,$);L(d(y),ba);y=(m?z:C)(y);(s?E:T)(this,y.node,y.offset)}}function E(m,s,y){var F=m.endContainer,Q=m.endOffset;
if(s!==m.startContainer||y!==m.startOffset){if(d(s)!=d(F)||g.comparePoints(s,y,F,Q)==1){F=s;Q=y}e(m,s,y,F,Q)}}function T(m,s,y){var F=m.startContainer,Q=m.startOffset;if(s!==m.endContainer||y!==m.endOffset){if(d(s)!=d(F)||g.comparePoints(s,y,F,Q)==-1){F=s;Q=y}e(m,F,Q,s,y)}}a.prototype=new ca;l.util.extend(a.prototype,{setStart:function(m,s){r(this);k(m,true);p(m,s);E(this,m,s)},setEnd:function(m,s){r(this);k(m,true);p(m,s);T(this,m,s)},setStartBefore:o(true,true),setStartAfter:o(false,true),setEndBefore:o(true,
false),setEndAfter:o(false,false),collapse:function(m){J(this);m?e(this,this.startContainer,this.startOffset,this.startContainer,this.startOffset):e(this,this.endContainer,this.endOffset,this.endContainer,this.endOffset)},selectNodeContents:function(m){r(this);k(m,true);e(this,m,0,m,g.getNodeLength(m))},selectNode:function(m){r(this);k(m,false);L(m,$);var s=z(m);m=C(m);e(this,s.node,s.offset,m.node,m.offset)},extractContents:da(t,e),deleteContents:da(n,e),canSurroundContents:function(){J(this);w(this.startContainer);
w(this.endContainer);var m=new q(this,true),s=m._first&&K(m._first,this)||m._last&&K(m._last,this);m.detach();return!s},detach:function(){j(this)},splitBoundaries:function(){J(this);var m=this.startContainer,s=this.startOffset,y=this.endContainer,F=this.endOffset,Q=m===y;g.isCharacterDataNode(y)&&F>0&&F<y.length&&g.splitDataNode(y,F);if(g.isCharacterDataNode(m)&&s>0&&s<m.length){m=g.splitDataNode(m,s);if(Q){F-=s;y=m}else y==m.parentNode&&F>=g.getNodeIndex(m)&&F++;s=0}e(this,m,s,y,F)},normalizeBoundaries:function(){J(this);
var m=this.startContainer,s=this.startOffset,y=this.endContainer,F=this.endOffset,Q=function(U){var R=U.nextSibling;if(R&&R.nodeType==U.nodeType){y=U;F=U.length;U.appendData(R.data);R.parentNode.removeChild(R)}},qa=function(U){var R=U.previousSibling;if(R&&R.nodeType==U.nodeType){m=U;var sa=U.length;s=R.length;U.insertData(0,R.data);R.parentNode.removeChild(R);if(m==y){F+=s;y=m}else if(y==U.parentNode){R=g.getNodeIndex(U);if(F==R){y=U;F=sa}else F>R&&F--}}},ga=true;if(g.isCharacterDataNode(y))y.length==
F&&Q(y);else{if(F>0)(ga=y.childNodes[F-1])&&g.isCharacterDataNode(ga)&&Q(ga);ga=!this.collapsed}if(ga)if(g.isCharacterDataNode(m))s==0&&qa(m);else{if(s<m.childNodes.length)(Q=m.childNodes[s])&&g.isCharacterDataNode(Q)&&qa(Q)}else{m=y;s=F}e(this,m,s,y,F)},collapseToPoint:function(m,s){r(this);k(m,true);p(m,s);if(m!==this.startContainer||s!==this.startOffset||m!==this.endContainer||s!==this.endOffset)e(this,m,s,m,s)}});W(a)}function ea(a){a.collapsed=a.startContainer===a.endContainer&&a.startOffset===
a.endOffset;a.commonAncestorContainer=a.collapsed?a.startContainer:g.getCommonAncestor(a.startContainer,a.endContainer)}function ha(a,e,j,o,E){var T=a.startContainer!==e||a.startOffset!==j,m=a.endContainer!==o||a.endOffset!==E;a.startContainer=e;a.startOffset=j;a.endContainer=o;a.endOffset=E;ea(a);I(a,"boundarychange",{startMoved:T,endMoved:m})}function M(a){this.startContainer=a;this.startOffset=0;this.endContainer=a;this.endOffset=0;this._listeners={boundarychange:[],detach:[]};ea(this)}l.requireModules(["DomUtil"]);
var g=l.dom,Z=g.DomPosition,S=l.DOMException;q.prototype={_current:null,_next:null,_first:null,_last:null,isSingleCharacterDataNode:false,reset:function(){this._current=null;this._next=this._first},hasNext:function(){return!!this._next},next:function(){var a=this._current=this._next;if(a){this._next=a!==this._last?a.nextSibling:null;if(g.isCharacterDataNode(a)&&this.clonePartiallySelectedTextNodes){if(a===this.ec)(a=a.cloneNode(true)).deleteData(this.eo,a.length-this.eo);if(this._current===this.sc)(a=
a.cloneNode(true)).deleteData(0,this.so)}}return a},remove:function(){var a=this._current,e,j;if(g.isCharacterDataNode(a)&&(a===this.sc||a===this.ec)){e=a===this.sc?this.so:0;j=a===this.ec?this.eo:a.length;e!=j&&a.deleteData(e,j-e)}else a.parentNode&&a.parentNode.removeChild(a)},isPartiallySelectedSubtree:function(){return K(this._current,this.range)},getSubtreeIterator:function(){var a;if(this.isSingleCharacterDataNode){a=this.range.cloneRange();a.collapse()}else{a=new M(H(this.range));var e=this._current,
j=e,o=0,E=e,T=g.getNodeLength(e);if(g.isAncestorOf(e,this.sc,true)){j=this.sc;o=this.so}if(g.isAncestorOf(e,this.ec,true)){E=this.ec;T=this.eo}ha(a,j,o,E,T)}return new q(a,this.clonePartiallySelectedTextNodes)},detach:function(a){a&&this.range.detach();this.range=this._current=this._next=this._first=this._last=this.sc=this.so=this.ec=this.eo=null}};v.prototype={BAD_BOUNDARYPOINTS_ERR:1,INVALID_NODE_TYPE_ERR:2};v.prototype.toString=function(){return this.message};c.prototype={_current:null,hasNext:function(){return!!this._next},
next:function(){this._current=this._next;this._next=this.nodes[++this._position];return this._current},detach:function(){this._current=this._next=this.nodes=null}};var $=[1,3,4,5,7,8,10],ba=[2,9,11],aa=[1,3,4,5,7,8,10,11],b=[1,3,4,5,7,8],d=g.getRootContainer,h=f([9,11]),D=f([5,6,10,12]),G=f([6,10,12]),P=document.createElement("style"),X=false;try{P.innerHTML="<b>x</b>";X=P.firstChild.nodeType==3}catch(ta){}l.features.htmlParsingConforms=X;var ka=["startContainer","startOffset","endContainer","endOffset",
"collapsed","commonAncestorContainer"],ia=0,la=1,ra=2,ma=3,na=0,oa=1,pa=2,ja=3;ca.prototype={attachListener:function(a,e){this._listeners[a].push(e)},compareBoundaryPoints:function(a,e){J(this);u(this.startContainer,e.startContainer);var j=a==ma||a==ia?"start":"end",o=a==la||a==ia?"start":"end";return g.comparePoints(this[j+"Container"],this[j+"Offset"],e[o+"Container"],e[o+"Offset"])},insertNode:function(a){J(this);L(a,aa);w(this.startContainer);if(g.isAncestorOf(a,this.startContainer,true))throw new S("HIERARCHY_REQUEST_ERR");
this.setStartBefore(N(a,this.startContainer,this.startOffset))},cloneContents:function(){J(this);var a,e;if(this.collapsed)return H(this).createDocumentFragment();else{if(this.startContainer===this.endContainer&&g.isCharacterDataNode(this.startContainer)){a=this.startContainer.cloneNode(true);a.data=a.data.slice(this.startOffset,this.endOffset);e=H(this).createDocumentFragment();e.appendChild(a);return e}else{e=new q(this,true);a=O(e);e.detach()}return a}},canSurroundContents:function(){J(this);w(this.startContainer);
w(this.endContainer);var a=new q(this,true),e=a._first&&K(a._first,this)||a._last&&K(a._last,this);a.detach();return!e},surroundContents:function(a){L(a,b);if(!this.canSurroundContents())throw new v("BAD_BOUNDARYPOINTS_ERR");var e=this.extractContents();if(a.hasChildNodes())for(;a.lastChild;)a.removeChild(a.lastChild);N(a,this.startContainer,this.startOffset);a.appendChild(e);this.selectNode(a)},cloneRange:function(){J(this);for(var a=new M(H(this)),e=ka.length,j;e--;){j=ka[e];a[j]=this[j]}return a},
toString:function(){J(this);var a=this.startContainer;if(a===this.endContainer&&g.isCharacterDataNode(a))return a.nodeType==3||a.nodeType==4?a.data.slice(this.startOffset,this.endOffset):"";else{var e=[];a=new q(this,true);i(a,function(j){if(j.nodeType==3||j.nodeType==4)e.push(j.data)});a.detach();return e.join("")}},compareNode:function(a){J(this);var e=a.parentNode,j=g.getNodeIndex(a);if(!e)throw new S("NOT_FOUND_ERR");a=this.comparePoint(e,j);e=this.comparePoint(e,j+1);return a<0?e>0?pa:na:e>0?
oa:ja},comparePoint:function(a,e){J(this);B(a,"HIERARCHY_REQUEST_ERR");u(a,this.startContainer);if(g.comparePoints(a,e,this.startContainer,this.startOffset)<0)return-1;else if(g.comparePoints(a,e,this.endContainer,this.endOffset)>0)return 1;return 0},createContextualFragment:X?function(a){var e=this.startContainer,j=g.getDocument(e);if(!e)throw new S("INVALID_STATE_ERR");var o=null;if(e.nodeType==1)o=e;else if(g.isCharacterDataNode(e))o=g.parentElement(e);o=o===null||o.nodeName=="HTML"&&g.isHtmlNamespace(g.getDocument(o).documentElement)&&
g.isHtmlNamespace(o)?j.createElement("body"):o.cloneNode(false);o.innerHTML=a;return g.fragmentFromNodeChildren(o)}:function(a){r(this);var e=H(this).createElement("body");e.innerHTML=a;return g.fragmentFromNodeChildren(e)},toHtml:function(){J(this);var a=H(this).createElement("div");a.appendChild(this.cloneContents());return a.innerHTML},intersectsNode:function(a,e){J(this);B(a,"NOT_FOUND_ERR");if(g.getDocument(a)!==H(this))return false;var j=a.parentNode,o=g.getNodeIndex(a);B(j,"NOT_FOUND_ERR");
var E=g.comparePoints(j,o,this.endContainer,this.endOffset);j=g.comparePoints(j,o+1,this.startContainer,this.startOffset);return e?E<=0&&j>=0:E<0&&j>0},isPointInRange:function(a,e){J(this);B(a,"HIERARCHY_REQUEST_ERR");u(a,this.startContainer);return g.comparePoints(a,e,this.startContainer,this.startOffset)>=0&&g.comparePoints(a,e,this.endContainer,this.endOffset)<=0},intersectsRange:function(a,e){J(this);if(H(a)!=H(this))throw new S("WRONG_DOCUMENT_ERR");var j=g.comparePoints(this.startContainer,
this.startOffset,a.endContainer,a.endOffset),o=g.comparePoints(this.endContainer,this.endOffset,a.startContainer,a.startOffset);return e?j<=0&&o>=0:j<0&&o>0},intersection:function(a){if(this.intersectsRange(a)){var e=g.comparePoints(this.startContainer,this.startOffset,a.startContainer,a.startOffset),j=g.comparePoints(this.endContainer,this.endOffset,a.endContainer,a.endOffset),o=this.cloneRange();e==-1&&o.setStart(a.startContainer,a.startOffset);j==1&&o.setEnd(a.endContainer,a.endOffset);return o}return null},
union:function(a){if(this.intersectsRange(a,true)){var e=this.cloneRange();g.comparePoints(a.startContainer,a.startOffset,this.startContainer,this.startOffset)==-1&&e.setStart(a.startContainer,a.startOffset);g.comparePoints(a.endContainer,a.endOffset,this.endContainer,this.endOffset)==1&&e.setEnd(a.endContainer,a.endOffset);return e}else throw new v("Ranges do not intersect");},containsNode:function(a,e){return e?this.intersectsNode(a,false):this.compareNode(a)==ja},containsNodeContents:function(a){return this.comparePoint(a,
0)>=0&&this.comparePoint(a,g.getNodeLength(a))<=0},containsRange:function(a){return this.intersection(a).equals(a)},containsNodeText:function(a){var e=this.cloneRange();e.selectNode(a);var j=e.getNodes([3]);if(j.length>0){e.setStart(j[0],0);a=j.pop();e.setEnd(a,a.length);a=this.containsRange(e);e.detach();return a}else return this.containsNodeContents(a)},createNodeIterator:function(a,e){J(this);return new c(this,a,e)},getNodes:function(a,e){J(this);return x(this,a,e)},getDocument:function(){return H(this)},
collapseBefore:function(a){r(this);this.setEndBefore(a);this.collapse(false)},collapseAfter:function(a){r(this);this.setStartAfter(a);this.collapse(true)},getName:function(){return"DomRange"},equals:function(a){return M.rangesEqual(this,a)},isValid:function(){return V(this)},inspect:function(){return A(this)}};fa(M,ha,function(a){r(a);a.startContainer=a.startOffset=a.endContainer=a.endOffset=null;a.collapsed=a.commonAncestorContainer=null;I(a,"detach",null);a._listeners=null});l.rangePrototype=ca.prototype;
M.rangeProperties=ka;M.RangeIterator=q;M.copyComparisonConstants=W;M.createPrototypeRange=fa;M.inspect=A;M.getRangeDocument=H;M.rangesEqual=function(a,e){return a.startContainer===e.startContainer&&a.startOffset===e.startOffset&&a.endContainer===e.endContainer&&a.endOffset===e.endOffset};l.DomRange=M;l.RangeException=v});
rangy.createModule("WrappedRange",function(l){function K(i,n,t,x){var A=i.duplicate();A.collapse(t);var q=A.parentElement();z.isAncestorOf(n,q,true)||(q=n);if(!q.canHaveHTML)return new C(q.parentNode,z.getNodeIndex(q));n=z.getDocument(q).createElement("span");var v,c=t?"StartToStart":"StartToEnd";do{q.insertBefore(n,n.previousSibling);A.moveToElementText(n)}while((v=A.compareEndPoints(c,i))>0&&n.previousSibling);c=n.nextSibling;if(v==-1&&c&&z.isCharacterDataNode(c)){A.setEndPoint(t?"EndToStart":"EndToEnd",
i);if(/[\r\n]/.test(c.data)){q=A.duplicate();t=q.text.replace(/\r\n/g,"\r").length;for(t=q.moveStart("character",t);q.compareEndPoints("StartToEnd",q)==-1;){t++;q.moveStart("character",1)}}else t=A.text.length;q=new C(c,t)}else{c=(x||!t)&&n.previousSibling;q=(t=(x||t)&&n.nextSibling)&&z.isCharacterDataNode(t)?new C(t,0):c&&z.isCharacterDataNode(c)?new C(c,c.length):new C(q,z.getNodeIndex(n))}n.parentNode.removeChild(n);return q}function H(i,n){var t,x,A=i.offset,q=z.getDocument(i.node),v=q.body.createTextRange(),
c=z.isCharacterDataNode(i.node);if(c){t=i.node;x=t.parentNode}else{t=i.node.childNodes;t=A<t.length?t[A]:null;x=i.node}q=q.createElement("span");q.innerHTML="&#feff;";t?x.insertBefore(q,t):x.appendChild(q);v.moveToElementText(q);v.collapse(!n);x.removeChild(q);if(c)v[n?"moveStart":"moveEnd"]("character",A);return v}l.requireModules(["DomUtil","DomRange"]);var I,z=l.dom,C=z.DomPosition,N=l.DomRange;if(l.features.implementsDomRange&&(!l.features.implementsTextRange||!l.config.preferTextRange)){(function(){function i(f){for(var k=
t.length,r;k--;){r=t[k];f[r]=f.nativeRange[r]}}var n,t=N.rangeProperties,x,A;I=function(f){if(!f)throw Error("Range must be specified");this.nativeRange=f;i(this)};N.createPrototypeRange(I,function(f,k,r,L,p){var u=f.endContainer!==L||f.endOffset!=p;if(f.startContainer!==k||f.startOffset!=r||u){f.setEnd(L,p);f.setStart(k,r)}},function(f){f.nativeRange.detach();f.detached=true;for(var k=t.length,r;k--;){r=t[k];f[r]=null}});n=I.prototype;n.selectNode=function(f){this.nativeRange.selectNode(f);i(this)};
n.deleteContents=function(){this.nativeRange.deleteContents();i(this)};n.extractContents=function(){var f=this.nativeRange.extractContents();i(this);return f};n.cloneContents=function(){return this.nativeRange.cloneContents()};n.surroundContents=function(f){this.nativeRange.surroundContents(f);i(this)};n.collapse=function(f){this.nativeRange.collapse(f);i(this)};n.cloneRange=function(){return new I(this.nativeRange.cloneRange())};n.refresh=function(){i(this)};n.toString=function(){return this.nativeRange.toString()};
var q=document.createTextNode("test");z.getBody(document).appendChild(q);var v=document.createRange();v.setStart(q,0);v.setEnd(q,0);try{v.setStart(q,1);x=true;n.setStart=function(f,k){this.nativeRange.setStart(f,k);i(this)};n.setEnd=function(f,k){this.nativeRange.setEnd(f,k);i(this)};A=function(f){return function(k){this.nativeRange[f](k);i(this)}}}catch(c){x=false;n.setStart=function(f,k){try{this.nativeRange.setStart(f,k)}catch(r){this.nativeRange.setEnd(f,k);this.nativeRange.setStart(f,k)}i(this)};
n.setEnd=function(f,k){try{this.nativeRange.setEnd(f,k)}catch(r){this.nativeRange.setStart(f,k);this.nativeRange.setEnd(f,k)}i(this)};A=function(f,k){return function(r){try{this.nativeRange[f](r)}catch(L){this.nativeRange[k](r);this.nativeRange[f](r)}i(this)}}}n.setStartBefore=A("setStartBefore","setEndBefore");n.setStartAfter=A("setStartAfter","setEndAfter");n.setEndBefore=A("setEndBefore","setStartBefore");n.setEndAfter=A("setEndAfter","setStartAfter");v.selectNodeContents(q);n.selectNodeContents=
v.startContainer==q&&v.endContainer==q&&v.startOffset==0&&v.endOffset==q.length?function(f){this.nativeRange.selectNodeContents(f);i(this)}:function(f){this.setStart(f,0);this.setEnd(f,N.getEndOffset(f))};v.selectNodeContents(q);v.setEnd(q,3);x=document.createRange();x.selectNodeContents(q);x.setEnd(q,4);x.setStart(q,2);n.compareBoundaryPoints=v.compareBoundaryPoints(v.START_TO_END,x)==-1&v.compareBoundaryPoints(v.END_TO_START,x)==1?function(f,k){k=k.nativeRange||k;if(f==k.START_TO_END)f=k.END_TO_START;
else if(f==k.END_TO_START)f=k.START_TO_END;return this.nativeRange.compareBoundaryPoints(f,k)}:function(f,k){return this.nativeRange.compareBoundaryPoints(f,k.nativeRange||k)};if(l.util.isHostMethod(v,"createContextualFragment"))n.createContextualFragment=function(f){return this.nativeRange.createContextualFragment(f)};z.getBody(document).removeChild(q);v.detach();x.detach()})();l.createNativeRange=function(i){i=i||document;return i.createRange()}}else if(l.features.implementsTextRange){I=function(i){this.textRange=
i;this.refresh()};I.prototype=new N(document);I.prototype.refresh=function(){var i,n,t=this.textRange;i=t.parentElement();var x=t.duplicate();x.collapse(true);n=x.parentElement();x=t.duplicate();x.collapse(false);t=x.parentElement();n=n==t?n:z.getCommonAncestor(n,t);n=n==i?n:z.getCommonAncestor(i,n);if(this.textRange.compareEndPoints("StartToEnd",this.textRange)==0)n=i=K(this.textRange,n,true,true);else{i=K(this.textRange,n,true,false);n=K(this.textRange,n,false,false)}this.setStart(i.node,i.offset);
this.setEnd(n.node,n.offset)};N.copyComparisonConstants(I);var O=function(){return this}();if(typeof O.Range=="undefined")O.Range=I;l.createNativeRange=function(i){i=i||document;return i.body.createTextRange()}}if(l.features.implementsTextRange)I.rangeToTextRange=function(i){if(i.collapsed)return H(new C(i.startContainer,i.startOffset),true);else{var n=H(new C(i.startContainer,i.startOffset),true),t=H(new C(i.endContainer,i.endOffset),false);i=z.getDocument(i.startContainer).body.createTextRange();
i.setEndPoint("StartToStart",n);i.setEndPoint("EndToEnd",t);return i}};I.prototype.getName=function(){return"WrappedRange"};l.WrappedRange=I;l.createRange=function(i){i=i||document;return new I(l.createNativeRange(i))};l.createRangyRange=function(i){i=i||document;return new N(i)};l.createIframeRange=function(i){return l.createRange(z.getIframeDocument(i))};l.createIframeRangyRange=function(i){return l.createRangyRange(z.getIframeDocument(i))};l.addCreateMissingNativeApiListener(function(i){i=i.document;
if(typeof i.createRange=="undefined")i.createRange=function(){return l.createRange(this)};i=i=null})});
rangy.createModule("WrappedSelection",function(l,K){function H(b){return(b||window).getSelection()}function I(b){return(b||window).document.selection}function z(b,d,h){var D=h?"end":"start";h=h?"start":"end";b.anchorNode=d[D+"Container"];b.anchorOffset=d[D+"Offset"];b.focusNode=d[h+"Container"];b.focusOffset=d[h+"Offset"]}function C(b){b.anchorNode=b.focusNode=null;b.anchorOffset=b.focusOffset=0;b.rangeCount=0;b.isCollapsed=true;b._ranges.length=0}function N(b){var d;if(b instanceof k){d=b._selectionNativeRange;
if(!d){d=l.createNativeRange(c.getDocument(b.startContainer));d.setEnd(b.endContainer,b.endOffset);d.setStart(b.startContainer,b.startOffset);b._selectionNativeRange=d;b.attachListener("detach",function(){this._selectionNativeRange=null})}}else if(b instanceof r)d=b.nativeRange;else if(l.features.implementsDomRange&&b instanceof c.getWindow(b.startContainer).Range)d=b;return d}function O(b){var d=b.getNodes(),h;a:if(!d.length||d[0].nodeType!=1)h=false;else{h=1;for(var D=d.length;h<D;++h)if(!c.isAncestorOf(d[0],
d[h])){h=false;break a}h=true}if(!h)throw Error("getSingleElementFromRange: range "+b.inspect()+" did not consist of a single element");return d[0]}function i(b,d){var h=new r(d);b._ranges=[h];z(b,h,false);b.rangeCount=1;b.isCollapsed=h.collapsed}function n(b){b._ranges.length=0;if(b.docSelection.type=="None")C(b);else{var d=b.docSelection.createRange();if(d&&typeof d.text!="undefined")i(b,d);else{b.rangeCount=d.length;for(var h,D=c.getDocument(d.item(0)),G=0;G<b.rangeCount;++G){h=l.createRange(D);
h.selectNode(d.item(G));b._ranges.push(h)}b.isCollapsed=b.rangeCount==1&&b._ranges[0].collapsed;z(b,b._ranges[b.rangeCount-1],false)}}}function t(b,d){var h=b.docSelection.createRange(),D=O(d),G=c.getDocument(h.item(0));G=c.getBody(G).createControlRange();for(var P=0,X=h.length;P<X;++P)G.add(h.item(P));try{G.add(D)}catch(ta){throw Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");}G.select();n(b)}function x(b,d,h){this.nativeSelection=
b;this.docSelection=d;this._ranges=[];this.win=h;this.refresh()}function A(b,d){var h=c.getDocument(d[0].startContainer);h=c.getBody(h).createControlRange();for(var D=0,G;D<rangeCount;++D){G=O(d[D]);try{h.add(G)}catch(P){throw Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)");}}h.select();n(b)}function q(b,d){if(b.anchorNode&&c.getDocument(b.anchorNode)!==c.getDocument(d))throw new L("WRONG_DOCUMENT_ERR");}function v(b){var d=
[],h=new p(b.anchorNode,b.anchorOffset),D=new p(b.focusNode,b.focusOffset),G=typeof b.getName=="function"?b.getName():"Selection";if(typeof b.rangeCount!="undefined")for(var P=0,X=b.rangeCount;P<X;++P)d[P]=k.inspect(b.getRangeAt(P));return"["+G+"(Ranges: "+d.join(", ")+")(anchor: "+h.inspect()+", focus: "+D.inspect()+"]"}l.requireModules(["DomUtil","DomRange","WrappedRange"]);l.config.checkSelectionRanges=true;var c=l.dom,f=l.util,k=l.DomRange,r=l.WrappedRange,L=l.DOMException,p=c.DomPosition,u,w,
B=l.util.isHostMethod(window,"getSelection"),V=l.util.isHostObject(document,"selection"),J=V&&(!B||l.config.preferTextRange);if(J){u=I;l.isSelectionValid=function(b){b=(b||window).document;var d=b.selection;return d.type!="None"||c.getDocument(d.createRange().parentElement())==b}}else if(B){u=H;l.isSelectionValid=function(){return true}}else K.fail("Neither document.selection or window.getSelection() detected.");l.getNativeSelection=u;B=u();var ca=l.createNativeRange(document),Y=c.getBody(document),
W=f.areHostObjects(B,f.areHostProperties(B,["anchorOffset","focusOffset"]));l.features.selectionHasAnchorAndFocus=W;var da=f.isHostMethod(B,"extend");l.features.selectionHasExtend=da;var fa=typeof B.rangeCount=="number";l.features.selectionHasRangeCount=fa;var ea=false,ha=true;f.areHostMethods(B,["addRange","getRangeAt","removeAllRanges"])&&typeof B.rangeCount=="number"&&l.features.implementsDomRange&&function(){var b=document.createElement("iframe");b.frameBorder=0;b.style.position="absolute";b.style.left=
"-10000px";Y.appendChild(b);var d=c.getIframeDocument(b);d.open();d.write("<html><head></head><body>12</body></html>");d.close();var h=c.getIframeWindow(b).getSelection(),D=d.documentElement.lastChild.firstChild;d=d.createRange();d.setStart(D,1);d.collapse(true);h.addRange(d);ha=h.rangeCount==1;h.removeAllRanges();var G=d.cloneRange();d.setStart(D,0);G.setEnd(D,2);h.addRange(d);h.addRange(G);ea=h.rangeCount==2;d.detach();G.detach();Y.removeChild(b)}();l.features.selectionSupportsMultipleRanges=ea;
l.features.collapsedNonEditableSelectionsSupported=ha;var M=false,g;if(Y&&f.isHostMethod(Y,"createControlRange")){g=Y.createControlRange();if(f.areHostProperties(g,["item","add"]))M=true}l.features.implementsControlRange=M;w=W?function(b){return b.anchorNode===b.focusNode&&b.anchorOffset===b.focusOffset}:function(b){return b.rangeCount?b.getRangeAt(b.rangeCount-1).collapsed:false};var Z;if(f.isHostMethod(B,"getRangeAt"))Z=function(b,d){try{return b.getRangeAt(d)}catch(h){return null}};else if(W)Z=
function(b){var d=c.getDocument(b.anchorNode);d=l.createRange(d);d.setStart(b.anchorNode,b.anchorOffset);d.setEnd(b.focusNode,b.focusOffset);if(d.collapsed!==this.isCollapsed){d.setStart(b.focusNode,b.focusOffset);d.setEnd(b.anchorNode,b.anchorOffset)}return d};l.getSelection=function(b){b=b||window;var d=b._rangySelection,h=u(b),D=V?I(b):null;if(d){d.nativeSelection=h;d.docSelection=D;d.refresh(b)}else{d=new x(h,D,b);b._rangySelection=d}return d};l.getIframeSelection=function(b){return l.getSelection(c.getIframeWindow(b))};
g=x.prototype;if(!J&&W&&f.areHostMethods(B,["removeAllRanges","addRange"])){g.removeAllRanges=function(){this.nativeSelection.removeAllRanges();C(this)};var S=function(b,d){var h=k.getRangeDocument(d);h=l.createRange(h);h.collapseToPoint(d.endContainer,d.endOffset);b.nativeSelection.addRange(N(h));b.nativeSelection.extend(d.startContainer,d.startOffset);b.refresh()};g.addRange=fa?function(b,d){if(M&&V&&this.docSelection.type=="Control")t(this,b);else if(d&&da)S(this,b);else{var h;if(ea)h=this.rangeCount;
else{this.removeAllRanges();h=0}this.nativeSelection.addRange(N(b));this.rangeCount=this.nativeSelection.rangeCount;if(this.rangeCount==h+1){if(l.config.checkSelectionRanges)if((h=Z(this.nativeSelection,this.rangeCount-1))&&!k.rangesEqual(h,b))b=new r(h);this._ranges[this.rangeCount-1]=b;z(this,b,aa(this.nativeSelection));this.isCollapsed=w(this)}else this.refresh()}}:function(b,d){if(d&&da)S(this,b);else{this.nativeSelection.addRange(N(b));this.refresh()}};g.setRanges=function(b){if(M&&b.length>
1)A(this,b);else{this.removeAllRanges();for(var d=0,h=b.length;d<h;++d)this.addRange(b[d])}}}else if(f.isHostMethod(B,"empty")&&f.isHostMethod(ca,"select")&&M&&J){g.removeAllRanges=function(){try{this.docSelection.empty();if(this.docSelection.type!="None"){var b;if(this.anchorNode)b=c.getDocument(this.anchorNode);else if(this.docSelection.type=="Control"){var d=this.docSelection.createRange();if(d.length)b=c.getDocument(d.item(0)).body.createTextRange()}if(b){b.body.createTextRange().select();this.docSelection.empty()}}}catch(h){}C(this)};
g.addRange=function(b){if(this.docSelection.type=="Control")t(this,b);else{r.rangeToTextRange(b).select();this._ranges[0]=b;this.rangeCount=1;this.isCollapsed=this._ranges[0].collapsed;z(this,b,false)}};g.setRanges=function(b){this.removeAllRanges();var d=b.length;if(d>1)A(this,b);else d&&this.addRange(b[0])}}else{K.fail("No means of selecting a Range or TextRange was found");return false}g.getRangeAt=function(b){if(b<0||b>=this.rangeCount)throw new L("INDEX_SIZE_ERR");else return this._ranges[b]};
var $;if(J)$=function(b){var d;if(l.isSelectionValid(b.win))d=b.docSelection.createRange();else{d=c.getBody(b.win.document).createTextRange();d.collapse(true)}if(b.docSelection.type=="Control")n(b);else d&&typeof d.text!="undefined"?i(b,d):C(b)};else if(f.isHostMethod(B,"getRangeAt")&&typeof B.rangeCount=="number")$=function(b){if(M&&V&&b.docSelection.type=="Control")n(b);else{b._ranges.length=b.rangeCount=b.nativeSelection.rangeCount;if(b.rangeCount){for(var d=0,h=b.rangeCount;d<h;++d)b._ranges[d]=
new l.WrappedRange(b.nativeSelection.getRangeAt(d));z(b,b._ranges[b.rangeCount-1],aa(b.nativeSelection));b.isCollapsed=w(b)}else C(b)}};else if(W&&typeof B.isCollapsed=="boolean"&&typeof ca.collapsed=="boolean"&&l.features.implementsDomRange)$=function(b){var d;d=b.nativeSelection;if(d.anchorNode){d=Z(d,0);b._ranges=[d];b.rangeCount=1;d=b.nativeSelection;b.anchorNode=d.anchorNode;b.anchorOffset=d.anchorOffset;b.focusNode=d.focusNode;b.focusOffset=d.focusOffset;b.isCollapsed=w(b)}else C(b)};else{K.fail("No means of obtaining a Range or TextRange from the user's selection was found");
return false}g.refresh=function(b){var d=b?this._ranges.slice(0):null;$(this);if(b){b=d.length;if(b!=this._ranges.length)return false;for(;b--;)if(!k.rangesEqual(d[b],this._ranges[b]))return false;return true}};var ba=function(b,d){var h=b.getAllRanges(),D=false;b.removeAllRanges();for(var G=0,P=h.length;G<P;++G)if(D||d!==h[G])b.addRange(h[G]);else D=true;b.rangeCount||C(b)};g.removeRange=M?function(b){if(this.docSelection.type=="Control"){var d=this.docSelection.createRange();b=O(b);var h=c.getDocument(d.item(0));
h=c.getBody(h).createControlRange();for(var D,G=false,P=0,X=d.length;P<X;++P){D=d.item(P);if(D!==b||G)h.add(d.item(P));else G=true}h.select();n(this)}else ba(this,b)}:function(b){ba(this,b)};var aa;if(!J&&W&&l.features.implementsDomRange){aa=function(b){var d=false;if(b.anchorNode)d=c.comparePoints(b.anchorNode,b.anchorOffset,b.focusNode,b.focusOffset)==1;return d};g.isBackwards=function(){return aa(this)}}else aa=g.isBackwards=function(){return false};g.toString=function(){for(var b=[],d=0,h=this.rangeCount;d<
h;++d)b[d]=""+this._ranges[d];return b.join("")};g.collapse=function(b,d){q(this,b);var h=l.createRange(c.getDocument(b));h.collapseToPoint(b,d);this.removeAllRanges();this.addRange(h);this.isCollapsed=true};g.collapseToStart=function(){if(this.rangeCount){var b=this._ranges[0];this.collapse(b.startContainer,b.startOffset)}else throw new L("INVALID_STATE_ERR");};g.collapseToEnd=function(){if(this.rangeCount){var b=this._ranges[this.rangeCount-1];this.collapse(b.endContainer,b.endOffset)}else throw new L("INVALID_STATE_ERR");
};g.selectAllChildren=function(b){q(this,b);var d=l.createRange(c.getDocument(b));d.selectNodeContents(b);this.removeAllRanges();this.addRange(d)};g.deleteFromDocument=function(){if(M&&V&&this.docSelection.type=="Control"){for(var b=this.docSelection.createRange(),d;b.length;){d=b.item(0);b.remove(d);d.parentNode.removeChild(d)}this.refresh()}else if(this.rangeCount){b=this.getAllRanges();this.removeAllRanges();d=0;for(var h=b.length;d<h;++d)b[d].deleteContents();this.addRange(b[h-1])}};g.getAllRanges=
function(){return this._ranges.slice(0)};g.setSingleRange=function(b){this.setRanges([b])};g.containsNode=function(b,d){for(var h=0,D=this._ranges.length;h<D;++h)if(this._ranges[h].containsNode(b,d))return true;return false};g.toHtml=function(){var b="";if(this.rangeCount){b=k.getRangeDocument(this._ranges[0]).createElement("div");for(var d=0,h=this._ranges.length;d<h;++d)b.appendChild(this._ranges[d].cloneContents());b=b.innerHTML}return b};g.getName=function(){return"WrappedSelection"};g.inspect=
function(){return v(this)};g.detach=function(){this.win=this.anchorNode=this.focusNode=this.win._rangySelection=null};x.inspect=v;l.Selection=x;l.selectionPrototype=g;l.addCreateMissingNativeApiListener(function(b){if(typeof b.getSelection=="undefined")b.getSelection=function(){return l.getSelection(this)};b=null})});
rangy.createModule("SaveRestore",function(h,m){function n(a,g){var e="selectionBoundary_"+ +new Date+"_"+(""+Math.random()).slice(2),c,f=p.getDocument(a.startContainer),d=a.cloneRange();d.collapse(g);c=f.createElement("span");c.id=e;c.style.lineHeight="0";c.style.display="none";c.className="rangySelectionBoundary";c.appendChild(f.createTextNode(q));d.insertNode(c);d.detach();return c}function o(a,g,e,c){if(a=(a||document).getElementById(e)){g[c?"setStartBefore":"setEndBefore"](a);a.parentNode.removeChild(a)}else m.warn("Marker element has been removed. Cannot restore selection.")}
function r(a,g){return g.compareBoundaryPoints(a.START_TO_START,a)}function k(a,g){var e=(a||document).getElementById(g);e&&e.parentNode.removeChild(e)}h.requireModules(["DomUtil","DomRange","WrappedRange"]);var p=h.dom,q="\ufeff";h.saveSelection=function(a){a=a||window;var g=a.document;if(h.isSelectionValid(a)){var e=h.getSelection(a),c=e.getAllRanges(),f=[],d,j;c.sort(r);for(var b=0,i=c.length;b<i;++b){d=c[b];if(d.collapsed){j=n(d,false);f.push({markerId:j.id,collapsed:true})}else{j=n(d,false);
d=n(d,true);f[b]={startMarkerId:d.id,endMarkerId:j.id,collapsed:false,backwards:c.length==1&&e.isBackwards()}}}for(b=i-1;b>=0;--b){d=c[b];if(d.collapsed)d.collapseBefore((g||document).getElementById(f[b].markerId));else{d.setEndBefore((g||document).getElementById(f[b].endMarkerId));d.setStartAfter((g||document).getElementById(f[b].startMarkerId))}}e.setRanges(c);return{win:a,doc:g,rangeInfos:f,restored:false}}else m.warn("Cannot save selection. This usually happens when the selection is collapsed and the selection document has lost focus.")};
h.restoreSelection=function(a,g){if(!a.restored){for(var e=a.rangeInfos,c=h.getSelection(a.win),f=[],d=e.length,j=d-1,b,i;j>=0;--j){b=e[j];i=h.createRange(a.doc);if(b.collapsed)if(b=(a.doc||document).getElementById(b.markerId)){b.style.display="inline";var l=b.previousSibling;if(l&&l.nodeType==3){b.parentNode.removeChild(b);i.collapseToPoint(l,l.length)}else{i.collapseBefore(b);b.parentNode.removeChild(b)}}else m.warn("Marker element has been removed. Cannot restore selection.");else{o(a.doc,i,b.startMarkerId,
true);o(a.doc,i,b.endMarkerId,false)}d==1&&i.normalizeBoundaries();f[j]=i}if(d==1&&g&&h.features.selectionHasExtend&&e[0].backwards){c.removeAllRanges();c.addRange(f[0],true)}else c.setRanges(f);a.restored=true}};h.removeMarkerElement=k;h.removeMarkers=function(a){for(var g=a.rangeInfos,e=0,c=g.length,f;e<c;++e){f=g[e];if(f.collapsed)k(a.doc,f.markerId);else{k(a.doc,f.startMarkerId);k(a.doc,f.endMarkerId)}}}});
rangy.createModule("CssClassApplier",function(i,v){function r(a,b){return a.className&&RegExp("(?:^|\\s)"+b+"(?:\\s|$)").test(a.className)}function s(a,b){if(a.className)r(a,b)||(a.className+=" "+b);else a.className=b}function o(a){return a.split(/\s+/).sort().join(" ")}function w(a,b){return o(a.className)==o(b.className)}function x(a){for(var b=a.parentNode;a.hasChildNodes();)b.insertBefore(a.firstChild,a);b.removeChild(a)}function y(a,b){var c=a.cloneRange();c.selectNodeContents(b);var d=c.intersection(a);
d=d?d.toString():"";c.detach();return d!=""}function z(a){return a.getNodes([3],function(b){return y(a,b)})}function A(a,b){if(a.attributes.length!=b.attributes.length)return false;for(var c=0,d=a.attributes.length,e,f;c<d;++c){e=a.attributes[c];f=e.name;if(f!="class"){f=b.attributes.getNamedItem(f);if(e.specified!=f.specified)return false;if(e.specified&&e.nodeValue!==f.nodeValue)return false}}return true}function B(a,b){for(var c=0,d=a.attributes.length,e;c<d;++c){e=a.attributes[c].name;if(!(b&&
h.arrayContains(b,e))&&a.attributes[c].specified&&e!="class")return true}return false}function C(a){var b;return a&&a.nodeType==1&&((b=a.parentNode)&&b.nodeType==9&&b.designMode=="on"||k(a)&&!k(a.parentNode))}function D(a){return(k(a)||a.nodeType!=1&&k(a.parentNode))&&!C(a)}function E(a){return a&&a.nodeType==1&&!M.test(p(a,"display"))}function N(a){if(a.data.length==0)return true;if(O.test(a.data))return false;switch(p(a.parentNode,"whiteSpace")){case "pre":case "pre-wrap":case "-moz-pre-wrap":return false;
case "pre-line":if(/[\r\n]/.test(a.data))return false}return E(a.previousSibling)||E(a.nextSibling)}function m(a,b,c,d){var e,f=c==0;if(h.isAncestorOf(b,a))return a;if(h.isCharacterDataNode(b))if(c==0){c=h.getNodeIndex(b);b=b.parentNode}else if(c==b.length){c=h.getNodeIndex(b)+1;b=b.parentNode}else throw v.createError("splitNodeAt should not be called with offset in the middle of a data node ("+c+" in "+b.data);var g;g=b;var j=c;g=h.isCharacterDataNode(g)?j==0?!!g.previousSibling:j==g.length?!!g.nextSibling:
true:j>0&&j<g.childNodes.length;if(g){if(!e){e=b.cloneNode(false);for(e.id&&e.removeAttribute("id");f=b.childNodes[c];)e.appendChild(f);h.insertAfter(e,b)}return b==a?e:m(a,e.parentNode,h.getNodeIndex(e),d)}else if(a!=b){e=b.parentNode;b=h.getNodeIndex(b);f||b++;return m(a,e,b,d)}return a}function F(a){var b=a?"nextSibling":"previousSibling";return function(c,d){var e=c.parentNode,f=c[b];if(f){if(f&&f.nodeType==3)return f}else if(d)if((f=e[b])&&f.nodeType==1&&e.tagName==f.tagName&&w(e,f)&&A(e,f))return f[a?
"firstChild":"lastChild"];return null}}function t(a){this.firstTextNode=(this.isElementMerge=a.nodeType==1)?a.lastChild:a;this.textNodes=[this.firstTextNode]}function q(a,b,c){this.cssClass=a;var d,e,f=null;if(typeof b=="object"&&b!==null){c=b.tagNames;f=b.elementProperties;for(d=0;e=P[d++];)if(b.hasOwnProperty(e))this[e]=b[e];d=b.normalize}else d=b;this.normalize=typeof d=="undefined"?true:d;this.attrExceptions=[];d=document.createElement(this.elementTagName);this.elementProperties={};for(var g in f)if(f.hasOwnProperty(g)){if(G.hasOwnProperty(g))g=
G[g];d[g]=f[g];this.elementProperties[g]=d[g];this.attrExceptions.push(g)}this.elementSortedClassName=this.elementProperties.hasOwnProperty("className")?o(this.elementProperties.className+" "+a):a;this.applyToAnyTagName=false;a=typeof c;if(a=="string")if(c=="*")this.applyToAnyTagName=true;else this.tagNames=c.toLowerCase().replace(/^\s\s*/,"").replace(/\s\s*$/,"").split(/\s*,\s*/);else if(a=="object"&&typeof c.length=="number"){this.tagNames=[];d=0;for(a=c.length;d<a;++d)if(c[d]=="*")this.applyToAnyTagName=
true;else this.tagNames.push(c[d].toLowerCase())}else this.tagNames=[this.elementTagName]}i.requireModules(["WrappedSelection","WrappedRange"]);var h=i.dom,H=function(){function a(b,c,d){return c&&d?" ":""}return function(b,c){if(b.className)b.className=b.className.replace(RegExp("(?:^|\\s)"+c+"(?:\\s|$)"),a)}}(),p;if(typeof window.getComputedStyle!="undefined")p=function(a,b){return h.getWindow(a).getComputedStyle(a,null)[b]};else if(typeof document.documentElement.currentStyle!="undefined")p=function(a,
b){return a.currentStyle[b]};else v.fail("No means of obtaining computed style properties found");var k;(function(){k=typeof document.createElement("div").isContentEditable=="boolean"?function(a){return a&&a.nodeType==1&&a.isContentEditable}:function(a){if(!a||a.nodeType!=1||a.contentEditable=="false")return false;return a.contentEditable=="true"||k(a.parentNode)}})();var M=/^inline(-block|-table)?$/i,O=/[^\r\n\t\f \u200B]/,Q=F(false),R=F(true);t.prototype={doMerge:function(){for(var a=[],b,c,d=0,
e=this.textNodes.length;d<e;++d){b=this.textNodes[d];c=b.parentNode;a[d]=b.data;if(d){c.removeChild(b);c.hasChildNodes()||c.parentNode.removeChild(c)}}return this.firstTextNode.data=a=a.join("")},getLength:function(){for(var a=this.textNodes.length,b=0;a--;)b+=this.textNodes[a].length;return b},toString:function(){for(var a=[],b=0,c=this.textNodes.length;b<c;++b)a[b]="'"+this.textNodes[b].data+"'";return"[Merge("+a.join(",")+")]"}};var P=["elementTagName","ignoreWhiteSpace","applyToEditableOnly"],
G={"class":"className"};q.prototype={elementTagName:"span",elementProperties:{},ignoreWhiteSpace:true,applyToEditableOnly:false,hasClass:function(a){return a.nodeType==1&&h.arrayContains(this.tagNames,a.tagName.toLowerCase())&&r(a,this.cssClass)},getSelfOrAncestorWithClass:function(a){for(;a;){if(this.hasClass(a,this.cssClass))return a;a=a.parentNode}return null},isModifiable:function(a){return!this.applyToEditableOnly||D(a)},isIgnorableWhiteSpaceNode:function(a){return this.ignoreWhiteSpace&&a&&
a.nodeType==3&&N(a)},postApply:function(a,b,c){for(var d=a[0],e=a[a.length-1],f=[],g,j=d,I=e,J=0,K=e.length,n,L,l=0,u=a.length;l<u;++l){n=a[l];if(L=Q(n,!c)){if(!g){g=new t(L);f.push(g)}g.textNodes.push(n);if(n===d){j=g.firstTextNode;J=j.length}if(n===e){I=g.firstTextNode;K=g.getLength()}}else g=null}if(a=R(e,!c)){if(!g){g=new t(e);f.push(g)}g.textNodes.push(a)}if(f.length){l=0;for(u=f.length;l<u;++l)f[l].doMerge();b.setStart(j,J);b.setEnd(I,K)}},createContainer:function(a){a=a.createElement(this.elementTagName);
i.util.extend(a,this.elementProperties);s(a,this.cssClass);return a},applyToTextNode:function(a){var b=a.parentNode;if(b.childNodes.length==1&&h.arrayContains(this.tagNames,b.tagName.toLowerCase()))s(b,this.cssClass);else{b=this.createContainer(h.getDocument(a));a.parentNode.insertBefore(b,a);b.appendChild(a)}},isRemovable:function(a){var b;if(b=a.tagName.toLowerCase()==this.elementTagName){if(b=o(a.className)==this.elementSortedClassName){var c;a:{b=this.elementProperties;for(c in b)if(b.hasOwnProperty(c)&&
a[c]!==b[c]){c=false;break a}c=true}b=c&&!B(a,this.attrExceptions)&&this.isModifiable(a)}b=b}return b},undoToTextNode:function(a,b,c){if(!b.containsNode(c)){a=b.cloneRange();a.selectNode(c);if(a.isPointInRange(b.endContainer,b.endOffset)){m(c,b.endContainer,b.endOffset,[b]);b.setEndAfter(c)}if(a.isPointInRange(b.startContainer,b.startOffset))c=m(c,b.startContainer,b.startOffset,[b])}this.isRemovable(c)?x(c):H(c,this.cssClass)},applyToRange:function(a){a.splitBoundaries();var b=z(a);if(b.length){for(var c,
d=0,e=b.length;d<e;++d){c=b[d];!this.isIgnorableWhiteSpaceNode(c)&&!this.getSelfOrAncestorWithClass(c)&&this.isModifiable(c)&&this.applyToTextNode(c)}a.setStart(b[0],0);c=b[b.length-1];a.setEnd(c,c.length);this.normalize&&this.postApply(b,a,false)}},applyToSelection:function(a){a=a||window;a=i.getSelection(a);var b,c=a.getAllRanges();a.removeAllRanges();for(var d=c.length;d--;){b=c[d];this.applyToRange(b);a.addRange(b)}},undoToRange:function(a){a.splitBoundaries();var b=z(a),c,d,e=b[b.length-1];if(b.length){for(var f=
0,g=b.length;f<g;++f){c=b[f];(d=this.getSelfOrAncestorWithClass(c))&&this.isModifiable(c)&&this.undoToTextNode(c,a,d);a.setStart(b[0],0);a.setEnd(e,e.length)}this.normalize&&this.postApply(b,a,true)}},undoToSelection:function(a){a=a||window;a=i.getSelection(a);var b=a.getAllRanges(),c;a.removeAllRanges();for(var d=0,e=b.length;d<e;++d){c=b[d];this.undoToRange(c);a.addRange(c)}},getTextSelectedByRange:function(a,b){var c=b.cloneRange();c.selectNodeContents(a);var d=c.intersection(b);d=d?d.toString():
"";c.detach();return d},isAppliedToRange:function(a){if(a.collapsed)return!!this.getSelfOrAncestorWithClass(a.commonAncestorContainer);else{for(var b=a.getNodes([3]),c=0,d;d=b[c++];)if(!this.isIgnorableWhiteSpaceNode(d)&&y(a,d)&&this.isModifiable(d)&&!this.getSelfOrAncestorWithClass(d))return false;return true}},isAppliedToSelection:function(a){a=a||window;a=i.getSelection(a).getAllRanges();for(var b=a.length;b--;)if(!this.isAppliedToRange(a[b]))return false;return true},toggleRange:function(a){this.isAppliedToRange(a)?
this.undoToRange(a):this.applyToRange(a)},toggleSelection:function(a){this.isAppliedToSelection(a)?this.undoToSelection(a):this.applyToSelection(a)},detach:function(){}};q.util={hasClass:r,addClass:s,removeClass:H,hasSameClasses:w,replaceWithOwnChildren:x,elementsHaveSameNonClassAttributes:A,elementHasNonClassAttributes:B,splitNodeAt:m,isEditableElement:k,isEditingHost:C,isEditable:D};i.CssClassApplier=q;i.createCssClassApplier=function(a,b,c){return new q(a,b,c)}});
rangy.createModule("Coordinates", function(api, module) {
    api.requireModules( ["WrappedSelection", "WrappedRange"] );

    var WrappedRange = api.WrappedRange;

    function mergeRects(rect1, rect2) {
        var rect = {
            top: Math.min(rect1.top, rect2.top),
            bottom: Math.max(rect1.bottom, rect2.bottom),
            left: Math.min(rect1.left, rect2.left),
            right: Math.max(rect1.right, rect2.right)
        };
        rect.width = rect.right - rect.left;
        rect.height = rect.bottom - rect.top;

        return rect;
    }

    var getRangeBoundingClientRect = (function() {

        // Test for getBoundingClientRect support in Range
        var testRange = api.createNativeRange();

        var rangeSupportsGetBoundingClientRect = false;
        var elementSupportsGetBoundingClientRect = false;

        if (api.features.implementsTextRange) {
            return function(range) {
                // We need a TextRange
                var textRange = api.util.isTextRange(range.nativeRange) ?
                    range.nativeRange : WrappedRange.rangeToTextRange(range);

                var left = textRange.boundingLeft, top = textRange.boundingTop;
                var width = textRange.boundingWidth, height = textRange.boundingHeight;
                return {
                    top: top,
                    bottom: top + height,
                    left: left,
                    right: left + width,
                    width: width,
                    height: height
                };
            };

        } else if (api.features.implementsDomRange) {
            rangeSupportsGetBoundingClientRect = api.util.isHostMethod(testRange, "getBoundingClientRect");
            api.features.rangeSupportsGetBoundingClientRect = rangeSupportsGetBoundingClientRect;


            var createWrappedRange = function(range) {
                return (range instanceof WrappedRange) ? range : new WrappedRange(range);
            };

            if (rangeSupportsGetBoundingClientRect) {
                return function(range) {
                    return createWrappedRange(range).nativeRange.getBoundingClientRect();
                };
            } else {
                // Test that <span> elements support getBoundingClientRect
                var span = document.createElement("span");
                elementSupportsGetBoundingClientRect = api.util.isHostMethod(span, "getBoundingClientRect");

                var getElementBoundingClientRect = elementSupportsGetBoundingClientRect ?
                    function(el) {
                        return el.getBoundingClientRect();
                    } :

                    // This implementation is very naive. There are many browser quirks that make it extremely
                    // difficult to get accurate element coordinates in all situations
                    function(el) {
                        var x = 0, y = 0, offsetEl = el, width = el.offsetWidth, height = el.offsetHeight;
                        while (offsetEl) {
                            x += offsetEl.offsetLeft;
                            y += offsetEl.offsetTop;
                            offsetEl = offsetEl.offsetParent;
                        }

                        return {
                            top: y,
                            bottom: y + height,
                            left: x,
                            right: x + width,
                            width: width,
                            height: height
                        };
                    };

                var getRectFromBoundaries = function(range) {
                    range.splitBoundaries();
                    var span = document.createElement("span");
                    var workingRange = range.cloneRange();
                    workingRange.collapse(true);
                    workingRange.insertNode(span);
                    var startRect = getElementBoundingClientRect(span);
                    span.parentNode.removeChild(span);
                    workingRange.collapseToPoint(range.endContainer, range.endOffset);
                    workingRange.insertNode(span);
                    var endRect = getElementBoundingClientRect(span);
                    span.parentNode.removeChild(span);
                    range.normalizeBoundaries();
                    return mergeRects(startRect, endRect);
                };

                return function(range) {
                    return getRectFromBoundaries(createWrappedRange(range));
                };
            }
        }
    })();

    api.getRangeBoundingClientRect = getRangeBoundingClientRect;

    api.rangePrototype.getBoundingClientRect = function() {
        return getRangeBoundingClientRect(this);
    };

    (function() {
        function createClientBoundaryPosGetter(isStart) {
            return function() {
                var boundaryRange = this.cloneRange();
                boundaryRange.collapse(isStart);
                var rect = getRangeBoundingClientRect(this);
                return { left: rect.left, top: rect.top };
            };
        }

        api.rangePrototype.getStartClientPos = createClientBoundaryPosGetter(true);
        api.rangePrototype.getEndClientPos = createClientBoundaryPosGetter(false);
    })();

    api.selectionPrototype.getBoundingClientRect = function() {
        for (var i = 0, rect = null, rangeRect; i < this.rangeCount; ++i) {
            rangeRect = getRangeBoundingClientRect(this.getRangeAt(i));
            rect = rect ? mergeRects(rect, rangeRect) : rangeRect;
        }
        return rect;
    };
});
