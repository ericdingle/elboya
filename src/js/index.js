(function() {

$(document).ready(function() {
  // UI.
  $('#tabs').tabs();

  var table = $('#torrents').dataTable({
    aoColumnDefs: [
      {aTargets: [2, 3, 4, 5, 6],
       sClass: 'col-center'},
    ],
    aoColumns: [
      {mData: 'name',
       sWidth: '30%'},
      {fnCreatedCell: renderProgressBar,
       mData: 'status.progress',
       sWidth: '20%'},
      {mData: 'status.download_rate',
       mRender: formatByteRate,
       sWidth: '12%'},
      {mData: 'status.upload_rate',
       mRender: formatByteRate,
       sWidth: '12%'},
      {mData: 'status.num_peers',
       sWidth: '6%'},
      {mData: 'status.state',
       sWidth: '14%'},
      {fnCreatedCell: renderRemoveButton,
       mData: null,
       sWidth: '6%'},
    ],
    bFilter: false,
    bJQueryUI: true,
    bInfo: false,
    bPaginate: false,
    bSort: false,
    oLanguage: {
      sEmptyTable: 'No torrents',
    },
    sAjaxDataProp: 'torrents',
    sAjaxSource: 'ajax/get_torrents',
  });
  setInterval(function() {
    table.fnReloadAjax();
  }, 1000);

  // Event handlers.
  $('#add_torrent').button().click(addTorrent);
});

function renderProgressBar(cell, data) {
  var div = $(
      '<div>' +
        '<span class="ui-progressbar-label">' +
          util.toPercentage(data) +
        '</span>' +
      '</div>');

  var value = Math.round(data * 100);
  div.progressbar({value: value});
  $(cell).html(div);
}

function formatByteRate(data, type) {
  if (type == 'display')
    return util.toByteRate(data);

  return data;
}

function renderRemoveButton(cell, data, torrent) {
  var button = $('<button>Remove</button>');
  button.button({disabled: torrent.info.hash == '',
                 icons: {primary: 'ui-icon-trash'},
                 text: false});
  button.click(torrent.info.hash, removeTorrent);
  $(cell).html(button);
}

function removeTorrent(event) {
  $(this).button('disable');

  $.post('ajax/remove_torrent', {hash: event.data});
}

function addTorrent(event) {
  $(this).button('disable');

  var magnet_url = $('#magnet_url').val();
  var save_path = $('#save_path').val();

  $.post('ajax/add_torrent', {magnet_url: magnet_url, save_path: save_path},
         addTorrentSuccess);
}

function addTorrentSuccess() {
  $('#add_torrent').button('enable');

  $('#magnet_url').val('');
  $('#save_path').val('');

  $('#tabs').tabs({active: 0});
}

})();
