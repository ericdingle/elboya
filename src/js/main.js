(function() {

$(document).ready(function() {
  // UI.
  $('#tabs').tabs();

  $('#torrents').dataTable({
    bFilter: false,
    bInfo: false,
    bPaginate: false,
    bSort: false,
  });

  updateTorrents();

  // Event handlers.
  $('#add_torrent').button().click(addTorrent);
});

function updateTorrents() {
  $.get('ajax/get_torrents', function(data) {
    var table = $('#torrents').dataTable();
    table.fnClearTable();

    for (var i = 0; i < data.length; ++i) {
      var torrent = data[i];
      var status = torrent.status;
      table.fnAddData([
        torrent.name,
        util.toPercentage(status.progress),
        util.toByteRate(status.download_rate),
        util.toByteRate(status.upload_rate),
        status.num_peers,
        status.state
      ])
    }

    setTimeout(updateTorrents, 1000);    
  }, "json");
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
