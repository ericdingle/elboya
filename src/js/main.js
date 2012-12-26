(function() {

$(document).ready(function() {
  $('#add_torrent').click(addTorrent);
  updateTorrents();
});

function addTorrent() {
  var magnet_url = $('#magnet_url').val();
  var save_path = $('#save_path').val();
  $.post('ajax/add_torrent', {magnet_url: magnet_url, save_path: save_path});
}

function updateTorrents() {
  $.get('ajax/get_torrents', function(data) {
    while ($('#torrents tr').length != 1) {
      $('#torrents tr:last').remove();
    }

    for (var i = 0; i < data.length; ++i) {
      var torrent = data[i];
      var row = $(
          '<tr>' +
            '<td>' + torrent.name + '</td>' +
            '<td>' + util.toPercentage(torrent.status.progress) + '</td>' +
            '<td>' + util.toByteRate(torrent.status.download_rate) + '</td>' +
            '<td>' + util.toByteRate(torrent.status.upload_rate) + '</td>' +
            '<td>' + torrent.status.num_peers + '</td>' +
            '<td>' + torrent.status.state + '</td>' +
          '</tr>');
      $('#torrents').append(row);
    }

    setTimeout(updateTorrents, 1000);    
  }, "json");
}

})();
