var ms = null, timeHandle = null;

window.onload = function() {
  var radios = document.getElementsByName('level');
  for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = function() {
      if (ms != null) {
        if (ms.landMineCount > 0) {
          if (!confirm('确定结束当前游戏？'))
            return false;
        }
      }
      var value = this.value;
      init(value, value, (value * value / 5 - value), (value * value / 5));
      document.getElementById('ms-main').style.width = value * 40 + 180 + 60 + 'px';
    }
  }
  init(10, 10);
};

function init(rowCount, colCount, minLandMineCount, maxLandMineCount) {
  var doc = document;
  var landMineCountElement = doc.getElementById('land-mine-count'),
      timeShow = doc.getElementById('cost-time'),
      beginButton = doc.getElementById('begin');
    
  if (ms != null) {
    clearInterval(timeHandle);
    timeShow.innerHTML = 0;
    landMineCountElement.innerHTML = 0;
  }

  ms = MineSweeper('landmine', rowCount, colCount, minLandMineCount, maxLandMineCount);

  ms.endCallBack = function() {
    clearInterval(timeHandle);
  };
  ms.landMineCallBack = function(count) {
    landMineCountElement.innerHTML = count;
  };

  // 为开始按钮绑定事件
  beginButton.onclick = function() {
    ms.play();

    // 显示地雷个数
    landMineCountElement.innerHTML = ms.landMineCount;

    ms.begin();

    // 更新时间
    timeHandle = setInterval(function() {
      timeShow.innerHTML = parseInt((new Date() - ms.beginTime) / 1000);
    }, 1000);
  };
};