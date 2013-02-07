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

util.toPercentage = function(num) {
  num *= 100;
  return num.toFixed(2) + ' %';
};

})();
