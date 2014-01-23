var settings = {};

(function() {

settings.init = function() {
  var jqxhr = $.getJSON('/ajax/get_settings');
  jqxhr.done(initSuccess);
  jqxhr.fail(initFail);
};

settings.onInit = $.Deferred();

var values = null;

function initSuccess(data) {
  values = data;
  settings.onInit.resolve();
}

function initFail() {
	console.log('settings.initFail');
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
