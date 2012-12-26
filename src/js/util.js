var util = {};

util.toPercentage = function(num) {
  num *= 100;
  return num.toFixed(2) + ' %';
};

util.byteRateUnits = ['B/s', 'kB/s', 'MB/s'];

util.toByteRate = function(num) {
  for (var i = 0; i < util.byteRateUnits.length - 1; ++i) {
    if (num < 1000)
      break;
    num /= 1000;
  }

  return num.toFixed(1) + ' ' + util.byteRateUnits[i];
};
