(function() {

$(document).ready(function() {
  // UI.
  $('#tabs').tabs();

  var table = $('#torrents').dataTable({
    aoColumns: [
      {mData: 'name',
       sWidth: '30%'},
      {mData: 'status.progress',
       sWidth: '20%'},
      {mData: 'status.download_rate',
       mRender: formatByteRate,
       sClass: 'col-center',
       sWidth: '13%'},
      {mData: 'status.upload_rate',
       mRender: formatByteRate,
       sClass: 'col-center',
       sWidth: '13%'},
      {mData: 'status.num_peers',
       sClass: 'col-center',
       sWidth: '8%'},
      {mData: 'status.state',
       sClass: 'col-center',
       sWidth: '16%'},
    ],
    bFilter: false,
    bJQueryUI: true,
    bInfo: false,
    bPaginate: false,
    bSort: false,
    fnRowCallback: formatPercentage,
    sAjaxDataProp: 'torrents',
    sAjaxSource: 'ajax/get_torrents',
  });
  setInterval(function() {
    table.fnReloadAjax();
  }, 1000);

  // Event handlers.
  $('#add_torrent').button().click(addTorrent);
});

function formatPercentage(row, data) {
  var div = $(
      '<div>' +
        '<span class="ui-progressbar-label">' +
          util.toPercentage(data.status.progress) +
        '</span>' +
      '</div>');

  var value = Math.round(data.status.progress * 100);
  div.progressbar({value: value});

  $('td:eq(1)', row).html(div);
}

function formatByteRate(data, type, full) {
  // Return the formatted data for display.
  if (type == 'display')
    return util.toByteRate(data);

  return data;
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
