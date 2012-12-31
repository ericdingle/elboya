var settings = {};

(function() {

settings.init = function(callback) {
  var jqxhr = $.getJSON('/ajax/get_settings');
  jqxhr.success(initSuccess);
  jqxhr.success(callback);
};

var values = null;

function initSuccess(data) {
  values = data;
}

settings.set = function(name, value) {
  if (!(name in values))
    throw('Invalid setting: ' + name)

  values[name] = value;
};

settings.save = function(success, error, complete) {
  var jqxhr = $.post('/ajax/save_settings', values);
  util.addXhrCallbacks(jqxhr, success, error, complete);
};

})();
