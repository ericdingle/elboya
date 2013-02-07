var util = {};

(function() {

var byteUnits = ['B', 'kB', 'MB', 'GB'];

util.toBytes = function(num) {
  for (var i = 0; i < byteUnits.length - 1; ++i) {
    if (num < 1000)
      break;
    num /= 1000;
  }

  return num.toFixed(1) + ' ' + byteUnits[i];
};

var timeUnits = ['s', 'm', 'h', 'd'];
var timeAmounts = [60, 60, 24, Infinity];

util.toDuration = function(num) {
  if (!isFinite(num))
    return '-';

  var duration = [];

  for (var i = 0; i < timeUnits.length; ++i) {
    duration.unshift(num % timeAmounts[i] + timeUnits[i])
    if (num < timeAmounts[i])
      break;
    num = Math.floor(num / timeAmounts[i]);
  }

  return duration.slice(0, 2).join(' ');
};

util.toPercentage = function(num) {
  num *= 100;
  return num.toFixed(2) + ' %';
};

})();
