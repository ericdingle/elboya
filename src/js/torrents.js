var torrents = {};

torrents.add = function(magnet_url, save_path) {
  return $.post('/ajax/add_torrent',
                {magnet_url: magnet_url, save_path: save_path});
};

torrents.remove = function(hash) {
  return $.post('/ajax/remove_torrent', {hash: hash});
};
