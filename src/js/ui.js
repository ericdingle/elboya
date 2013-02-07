var ui = {};

(function() {

ui.init = function() {
  $('#add_torrent').button();
  $('#save_settings').button();

  $('#tabs').tabs();

  initTorrents();

  settings.onInit.done(initSettings);
};

function initTorrents() {
  $('#torrents').dataTable({
    aoColumnDefs: [
      {aTargets: [1, 3, 4, 5, 6, 7, 8],
       sClass: 'col-center'},
    ],
    aoColumns: [
      {mData: 'name',
       sWidth: '30%'},
      {fnCreatedCell: renderBytes,
       mData: 'total_size',
       sWidth: '8%'},
      {fnCreatedCell: renderProgressBar,
       mData: 'status.progress',
       sWidth: '15%'},
      {fnCreatedCell: renderByteRate,
       mData: 'status.download_rate',
       sWidth: '10%'},
      {fnCreatedCell: renderByteRate,
       mData: 'status.upload_rate',
       sWidth: '10%'},
      {fnCreatedCell: renderEta,
       mData: null,
       sWidth: '7%'},
      {mData: 'status.num_peers',
       sWidth: '5%'},
      {mData: 'status.state',
       sWidth: '10%'},
      {fnCreatedCell: renderRemoveButton,
       mData: null,
       sWidth: '5%'},
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
}

function renderBytes(cell, data) {
  $(cell).html(util.toBytes(data));
}

function renderByteRate(cell, data) {
  $(cell).html(util.toBytes(data) + '/s');
}

function renderEta(cell, data, torrent) {
  var size = torrent.total_size * (1 - torrent.status.progress);
  var seconds = Math.round(size / torrent.status.download_rate);
  $(cell).html(util.toDuration(seconds));
}

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

function renderRemoveButton(cell, data, torrent) {
  var button = $('<button class="remove_torrent">Remove</button>');
  button.attr('hash', torrent.info.hash);
  button.button({disabled: torrent.info.hash == '',
                 icons: {primary: 'ui-icon-trash'},
                 text: false});
  $(cell).html(button);
}

function initSettings() {
  $('#default_save_path').val(settings.get('default_save_path'));
}

})();
