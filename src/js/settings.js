var settings = {};

(function() {

settings.init = function() {
  var jqxhr = $.getJSON('/ajax/get_settings');
  jqxhr.success(initSuccess);
};

settings.onInit = $.Deferred();

var values = null;

function initSuccess(data) {
  values = data;
  settings.onInit.resolve();
}

settings.get = function(name) {
  if (!(name in values))
    throw('Invalid setting: ' + name);
  return values[name];
};

settings.set = function(name, value) {
  if (!(name in values))
    throw('Invalid setting: ' + name);
  values[name] = value;
};

settings.save = function(success, error, complete) {
  return $.post('/ajax/save_settings', values);
};

})();
