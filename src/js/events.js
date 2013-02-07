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
  if ($('#tabs').tabs('option', 'active') == 1) {
    $('#magnet_url').val('');
    $('#save_path').val(settings.get('default_save_path'));
  }
}

function addTorrent() {
  $(this).button('disable');

  var magnet_url = $('#magnet_url').val();
  var save_path = $('#save_path').val();

  torrents.add(magnet_url, save_path)
      .done(addTorrentDone)
      .fail(addTorrentFail)
      .always(addTorrentAlways);
}

function addTorrentDone() {
  $('#tabs').tabs({active: 0});
}

function addTorrentFail(jqxhr, textStatus) {
  alert('Could not add torrent: ' + textStatus);
}

function addTorrentAlways() {
  $('#add_torrent').button('enable');
}

function removeTorrent() {
  var button = $(this);
  button.button('disable');

  var hash = button.attr('hash');

  torrents.remove(hash).fail(removeTorrentFail);
}

function removeTorrentFail(jqxhr, textStatus) {
  alert('Could not remove torrent: ' + textStatus);
}

function updateTorrents() {
  $('#torrents').dataTable().fnReloadAjax();
  setTimeout(updateTorrents, 1000);
}

function saveSettings() {
  $(this).button('disable');

  settings.set('default_save_path', $('#default_save_path').val());
  settings.save().done(saveSettingsDone)
                 .fail(saveSettingsFail)
                 .always(saveSettingsAlways);
}

function saveSettingsDone() {
  $('#tabs').tabs({active: 0});
}

function saveSettingsFail(jqxhr, textStatus) {
  alert('Could not save settings: ' + textStatus);
}

function saveSettingsAlways() {
  $('#save_settings').button('enable');
}

})();
