  /*####################################################################*
   * Languages
   * This is a modified vaersion of the awxi language stuff
   *####################################################################*/
var lang = {};

  $.extend(lang, {
    lang: {
      languages: {},
      curLang: '',
      langMsg: '',

      add: function(newLang) {
        // e.g. newLang = {langage:'German', short:'de', author:'MKay', values: {...}}
        this.languages[newLang.short] = newLang;
      },

      get: function(key, context) {
        if (!this.curLang) {
          return 'ERROR:LANGUAGE_UNDEFINED';
        } else if (context) {
          return this.langMsg.pgettext(context, key);
        } else {
          return this.langMsg.gettext(key);
        };
        
      },
      setLanguage: function(lang, callback) {
        this.curLang = lang;
        var ld = 'lang/' + lang + '.json';
        $.getJSON(ld, function(data) {
          mkf.lang.langMsg = new Jed({
            locale_data: { "messages": data }, 
            "missing_key_callback" : function(key) {
            console.error(key)
            }
          }); 
          callback(true)
        })
        .error(function() { callback(false) });
      },

      getLanguages: function(callback) {
        xbmc.sendCommand(
        '{ "method": "Addons.GetAddonDetails", "id": 0, "jsonrpc": "2.0", "params": { "addonid": "webinterface.jquerymobile", "properties": ["path"] } }',
        function(awxi) {
          var langPath = awxi.result.addon.path + '/lang';
          xbmc.getDirectory({
            media: 'files',
            directory: langPath,
            onError: function() {
              mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
              callback(false)
            },
            onSuccess: function(langs) {
              var langList = [];
              var langFiles = [];
              
              //Love async...
              for (var i=0; i < langs.files.length; i++) {
                //Build list of lang files.
                if (langs.files[i].file.split('.').pop() == 'json') {
                  langFiles.push(langs.files[i].label);
                };
                //Finsihed building list, parse.
                if (i == langs.files.length-1) {
                  var count = 0;
                  for (var n=0; n < langFiles.length; n++) {
                    $.getJSON('lang/' + langFiles[n], function(data) {
                      //Add short lang code for cookie etc.
                      count++;
                      data[''].code = this.url.split('.')[0].split('/')[1];
                      langList.push(data['']);
                      if (count == langFiles.length) { callback(langList) };
                    });
                  };
                };
              };
            }
          });
        },
        function() {
          mkf.messageLog.show(mkf.lang.get('Failed to retrieve list!', 'Popup message'), mkf.messageLog.status.error, 5000);
        }
      );

      }
    }
  });
