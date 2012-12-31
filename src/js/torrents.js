var torrents = {};

torrents.add = function(magnet_url, save_path, success, error, complete) {
  var jqxhr = $.post('/ajax/add_torrent',
                     {magnet_url: magnet_url, save_path: save_path});
  util.addXhrCallbacks(jqxhr, success, error, complete);
};

torrents.remove = function(hash, success, error, complete) {
  var jqxhr = $.post('/ajax/remove_torrent', {hash: hash});
  util.addXhrCallbacks(jqxhr, success, error, complete);
};
