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
      this.$el = $("<div data-dd='snippet'></div>");
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
      if (window.app.snippetsContainer) {
        this.$el = window.app.snippetsContainer;
      } else {
        this.$el = $("<div id='dd_sidebar'></div>");
        this.$el.append("<span class='dd_sidebar_opener'><i class='fa fa-pencil'></i></span>");
      }
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
      this.$el.append("<div class='dd_tools dd_ui'> <div class='dd_tool snippet_mover'><i class='fa fa-arrows'></i></div> <div class='dd_tool snippet_settings'><i class='fa fa-adjust'></i></div> <div class='dd_tool snippet_destroyer'><i class='fa fa-times'></i></div> </div>");
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
      this.$el.find('[data-dd="text"]').each(function() {
        return new DapperDoe.Content.Text({
          el: $(this)
        });
      });
      this.$el.find('img').each(function() {
        return new DapperDoe.Content.Image({
          el: $(this)
        });
      });
      this.$el.find('[data-dd="video"]').each(function() {
        return new DapperDoe.Content.Video({
          el: $(this)
        });
      });
      return this.$el.find("." + iconset[window.app.iconSet].iconClass).each(function() {
        return new DapperDoe.Content.Icon({
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
        items: "[data-dd='snippet']",
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
      return this.$el.find('*[data-dd="snippet"]').each(function(index, snippet) {
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
      $(html).find('[data-dd="text"] .dd_text_content').each(function() {
        return $(this).parent().html($(this).html());
      });
      return html.html().replace(/<script>/gi, '').replace(/<\/script>/gi, '');
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
      if (this.$el.find('.dd_text_content').length === 0) {
        this.$el.wrapInner("<div class='dd_text_content'></div>");
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

  DapperDoe.Content.Video = (function(_super) {
    __extends(Video, _super);

    function Video(options) {
      Video.__super__.constructor.call(this, options);
      this.tools = new DapperDoe.Tools.Video({
        el: this.$el
      });
    }

    return Video;

  })(DapperDoe.Content);

  DapperDoe.Content.Icon = (function(_super) {
    __extends(Icon, _super);

    function Icon(options) {
      Icon.__super__.constructor.call(this, options);
      this.tools = new DapperDoe.Tools.Icon({
        icon: this.$el
      });
    }

    return Icon;

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

  DapperDoe.Tools.Video = (function(_super) {
    __extends(Video, _super);

    function Video(options) {
      this.$el = options.el;
      this.$el.append(this.html);
      this.$tools = this.$el.find('.dd_tools');
      this.positionTools();
      this.$tools.hide();
      this.events();
    }

    Video.prototype.events = function() {
      this.$el.find(".video_action").bind("click", (function(_this) {
        return function() {
          return _this.doAction();
        };
      })(this));
      this.$el.bind("mouseover", (function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      return this.$el.bind("mouseout", (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
    };

    Video.prototype.show = function(e) {
      return this.$tools.show();
    };

    Video.prototype.hide = function(e) {
      return this.$tools.hide();
    };

    Video.prototype.positionTools = function() {
      this.$tools.css('left', (this.$el.width() / 2) - (this.$el.find('.dd_tools').width() / 2));
      return this.$tools.css('top', (this.$el.height() / 2) - (this.$el.find('.dd_tools').height() / 2));
    };

    Video.prototype.doAction = function() {
      var $icon, new_code;
      $icon = this.$el.find(".video_action");
      if ($icon.hasClass('fa-code')) {
        this.$el.find(".video_code_textarea").show();
        return $icon.switchClass('fa-code', 'fa-check');
      } else {
        this.$el.find(".video_code_textarea").hide();
        $icon.switchClass('fa-check', 'fa-code');
        new_code = this.$el.find(".video_code_textarea").val();
        if ((new_code !== "") && (new_code !== "<iframe></iframe>")) {
          this.$el.find('iframe').replaceWith(this.$el.find(".video_code_textarea").val());
        }
        return this.hide();
      }
    };

    Video.prototype.html = function() {
      return "<span class='dd_tools dd_ui'> <textarea class='video_code_textarea' style='display:none;'><iframe></iframe></textarea> <i class='video_action fa fa-code'></i><br/> </span>";
    };

    return Video;

  })(DapperDoe.Tools);

  DapperDoe.Tools.Icon = (function(_super) {
    __extends(Icon, _super);

    function Icon(options) {
      this.$icon = options.icon;
      this.$el = $('#icon-picker');
      this.$el = this.html();
      $(window.app.topElement).append(this.$el);
      this.$el.hide();
      this.events();
      this.$icon.css('cursor', 'pointer');
    }

    Icon.prototype.events = function() {
      this.$icon.bind('click', (function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      return this.$el.find('i').bind('click', (function(_this) {
        return function(e) {
          return _this.doAction(e);
        };
      })(this));
    };

    Icon.prototype.doAction = function(e) {
      this.$icon.attr('class', '');
      this.$icon.addClass("" + ($(e.target).data('iconset')) + " " + ($(e.target).data('icon')));
      return this.hide();
    };

    Icon.prototype.show = function() {
      this.$el.show();
      return this.$el.css('marginTop', -(this.$el.height() / 2));
    };

    Icon.prototype.hide = function() {
      return this.$el.hide();
    };

    Icon.prototype.html = function() {
      var $ui, i, icon, iconClassName, iconsetClassName, _i, _len, _ref;
      $ui = $("<span class='dd_tools dd_ui' id='icon-picker'><div class='dd-iconpicker-wrapper'></div></span>");
      i = 0;
      _ref = iconset[window.app.iconSet].icons;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        icon = _ref[_i];
        iconClassName = iconset[window.app.iconSet].iconClassFix + icon;
        iconsetClassName = iconset[window.app.iconSet].iconClass;
        $ui.find('.dd-iconpicker-wrapper').append("<i data-iconset='" + iconsetClassName + "' data-icon='" + iconClassName + "' class='" + iconsetClassName + " " + iconClassName + "'></i>");
        if (i % 20 === 19) {
          $ui.find('.dd-iconpicker-wrapper').append("<br/>");
        }
        i++;
      }
      return $ui;
    };

    return Icon;

  })(DapperDoe.Tools);

  DapperDoe.Toolbar.Text = (function(_super) {
    __extends(Text, _super);

    function Text(options) {
      this.applyForeColor = __bind(this.applyForeColor, this);
      this.editText = __bind(this.editText, this);
      Text.__super__.constructor.call(this, options);
      this.$el.html(this.html());
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
      if (this.callback) {
        return this.callback(color);
      }
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
      var $html, key, key2, option, subOption, _ref;
      $html = $("<div class='dd_sub_toolbar_content dd_toolbar_url'> <input type='text' placeholder='Url' class='dd_url' /> <span class='dd_link_color'></span> <div class='dd_submit'><i class='fa fa-check'></i></div> <div class='clearfix'></div> <div class='dd_url_options'> <label>_blank <input type='checkbox' class='dd_blank'/></label> <label>Button <input type='checkbox' class='dd_button'/></label> </div> </div>");
      _ref = window.app.buttonOptions;
      for (key in _ref) {
        option = _ref[key];
        for (key2 in option) {
          subOption = option[key2];
          $html.find(".dd_url_options").append("<label> " + subOption.name + " <input type='radio' name='" + key + "' value='" + subOption["class"] + "' /> </label>");
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
        iconSet: '',
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
      this.snippetsContainer = settings.snippetsContainer;
      this.iconSet = settings.iconSet;
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
