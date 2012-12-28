(function() {

$(document).ready(function() {
  // UI.
  $('#tabs').tabs();

  var table = $('#torrents').dataTable({
    aoColumns: [
      {mData: 'name'},
      {mData: formatData('status.progress', util.toPercentage)},
      {mData: formatData('status.download_rate', util.toByteRate)},
      {mData: formatData('status.upload_rate', util.toByteRate)},
      {mData: 'status.num_peers'},
      {mData: 'status.state'},
    ],
    bFilter: false,
    bInfo: false,
    bPaginate: false,
    bSort: false,
    sAjaxDataProp: 'torrents',
    sAjaxSource: 'ajax/get_torrents',
  });
  setInterval(function() {
    table.fnReloadAjax();
  }, 1000);

  // Event handlers.
  $('#add_torrent').button().click(addTorrent);
});

function formatData(dataPath, formatFunc) {
  return function(data, type, val) {
    // Traverse the dot notation path.
    var parts = dataPath.split('.');
    for (var i = 0; i < parts.length; i++) {
      data = data[parts[i]];
    }

    // Return the formatted data for display.
    if (type == 'display')
      return formatFunc(data);

    return data;
  };
}

function addTorrent(event) {
  $('#add_torrent').button({disabled: true});

  var magnet_url = $('#magnet_url').val();
  var save_path = $('#save_path').val();

  $.post('ajax/add_torrent', {magnet_url: magnet_url, save_path: save_path},
         addTorrentSuccess);
}

function addTorrentSuccess() {
  $('#add_torrent').button({disabled: false});

  $('#magnet_url').val('');
  $('#save_path').val('');

  $('#tabs').tabs({active: 0});
}

})();
