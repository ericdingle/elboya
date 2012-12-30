var torrents = {};

(function() {

torrents.add = function(magnet_url, save_path, success, error, complete) {
  var jqxhr = $.post('/ajax/add_torrent',
                     {magnet_url: magnet_url, save_path: save_path});
  addCallbacks(jqxhr, success, error, complete);
};

torrents.remove = function(hash, success, error, complete) {
  var jqxhr = $.post('/ajax/remove_torrent', {hash: hash});
  addCallbacks(jqxhr, success, error, complete);
};

function addCallbacks(jqxhr, success, error, complete) {
  if (success)
    jqxhr.success(success);
  if (error)
    jqxhr.error(error);
  if (complete)
    jqxhr.complete(complete);
}

})();
