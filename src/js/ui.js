var ui = {};

(function() {

ui.init = function() {
  initTabs();
  initTorrents();
  initButtons();
};

function initTabs() {
  $('#tabs').tabs();
}

function initTorrents() {
  $('#torrents').dataTable({
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
      {fnCreatedCell: renderByteRate,
       mData: 'status.download_rate',
       sWidth: '12%'},
      {fnCreatedCell: renderByteRate,
       mData: 'status.upload_rate',
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

function renderByteRate(cell, data) {
  $(cell).html(util.toByteRate(data));
}

function renderRemoveButton(cell, data, torrent) {
  var button = $('<button class="remove_torrent">Remove</button>');
  button.attr('hash', torrent.info.hash);
  button.button({disabled: torrent.info.hash == '',
                 icons: {primary: 'ui-icon-trash'},
                 text: false});
  $(cell).html(button);
}

function initButtons() {
  $('#add_torrent').button();
}

})();
