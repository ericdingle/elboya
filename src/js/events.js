var events = {};

(function() {

events.init = function() {
  $('#tabs').tabs({activate: tabsActivate});

  $('#add_torrent').click(addTorrent);
  $('#torrents tbody').on('click', '.remove_torrent', removeTorrent);
  updateTorrents();

  $('#save_settings').click(saveSettings);
};

function tabsActivate(event, ui) {
  console.log(ui);
  if ($('#tabs').tabs('option', 'active') == 1) {
    $('#magnet_url').val('');
    $('#save_path').val(settings.get('default_save_path'));
  }
}

function addTorrent() {
  $(this).button('disable');

  var magnet_url = $('#magnet_url').val();
  var save_path = $('#save_path').val();

  torrents.add(magnet_url, save_path, addTorrentSuccess, addTorrentError,
               addTorrentComplete)
}

function addTorrentSuccess() {
  $('#tabs').tabs({active: 0});
}

function addTorrentError(data, status, jqxhr) {
  alert('Could not add torrent: ' + jqxhr.statusText);
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

function removeTorrentError(data, status, jqxhr) {
  alert('Could not remove torrent: ' + jqxhr.statusText);
}

function updateTorrents() {
  $('#torrents').dataTable().fnReloadAjax();
  setTimeout(updateTorrents, 1000);
}

function saveSettings() {
  $(this).button('disable');

  settings.set('default_save_path', $('#default_save_path').val());
  settings.save(saveSettingsSuccess, saveSettingsError, saveSettingsComplete);
}

function saveSettingsSuccess() {
  $('#tabs').tabs({active: 0});
}

function saveSettingsError(data, status, jqxhr) {
  alert('Could not save settings: ' + jqxhr.statusText);
}

function saveSettingsComplete() {
  $('#save_settings').button('enable');
}

})();
