var events = {};

(function() {

events.init = function() {
  $('#add_torrent').click(addTorrent);
  $('#torrents tbody').on('click', '.remove_torrent', removeTorrent);
  updateTorrents();
};

function addTorrent() {
  $(this).button('disable');

  var magnet_url = $('#magnet_url').val();
  var save_path = $('#save_path').val();

  torrents.add(magnet_url, save_path, addTorrentSuccess, addTorrentError,
               addTorrentComplete)
}

function addTorrentSuccess() {
  $('#magnet_url').val('');
  $('#save_path').val('');

  $('#tabs').tabs({active: 0});
}

function addTorrentError(data, status) {
  alert('Could not add torrent: ' + status);
}

function addTorrentComplete() {
  $('#add_torrent').button('enable');
}

function removeTorrent() {
  var button = $(this);
  button.button('disable');

  var hash = button.attr('hash');

  torrents.remove(hash, null, removeTorrentError);
}

function removeTorrentError(data, status) {
  alert('Could not remove torrent: ' + status);
}

function updateTorrents() {
  $('#torrents').dataTable().fnReloadAjax();
  setTimeout(updateTorrents, 1000);
}

})();
