(function() {
  var MineSweeper = function(id, rowCount, colCount, minLandMineCount, maxLandMineCount) {
    if (!(this instanceof MineSweeper)) {
      return new MineSweeper(id, rowCount, colCount, minLandMineCount, maxLandMineCount);
    }
    this.doc = document;
    // 画格子的表格
    this.table = this.doc.getElementById(id);
    // 小格子
    this.cells = this.table.getElementsByTagName('td');
    // 格子行数
    this.rowCount = rowCount || 10;
    // 格子列数
    this.colCount = colCount || 10;
    // 地雷个数
    this.landMineCount = 0;
    // 标记的地雷个数
    this.markLandMineCount = 0;
    // 地雷最少个数
    this.minLandMineCount = minLandMineCount || 10;
    // 地雷最大个数
    this.maxLandMineCount = maxLandMineCount || 20;
    // 格子对应的数组
    this.arrs = [];
    // 游戏开始时间
    this.beginTime = null;
    // 游戏结束时间
    this.endTime = null;
    // 当前走的步数
    this.currentStepCount = 0;
    // 游戏结束时的回调函数
    this.endCallBack = null;
    // 标记为地雷时更新剩余地雷个数的回调函数
    this.landMineCallBack = null;
    // 禁用右键菜单
    document.oncontextmenu = function() {
      return false;
    };
    this.drawMap();
  };

  MineSweeper.prototype = {
    drawMap: function() {
      var tds = [];

      if (window.ActiveXObject && parseInt(navigator.userAgent.match(/msie([\d.]+)/i)[1]) < 8) {
        var css = '#ms-main table td{background-color: #888;}',
            head = document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
      }

      for (var i = 0; i < this.rowCount; i++) {
        tds.push('<tr>');
        for (var j = 0; j < this.colCount; j++) {
          tds.push('<td id="m-' + i + '-' + j + '"></td>');
        }
        tds.push('</td>');
      }
      this.setTableInnerHTML(this.table, tds.join(''));
    },

    // 添加HTML到table
    setTableInnerHTML: function(table, html) {
      if (navigator && navigator.userAgent.match(/msie/i)) {
        var temp = table.ownerDocument.createElement('div');
        temp.innerHTML = '<table><tbody>' + html + '</tbody></table>';
        if (table.tBodies.length === 0) {
          var tbody = document.createElement('tbody');
          table.appendChild(tbody);
        }
        table.replaceChild(temp.firstChild.firstChild, table.tBodies[0]);
      } else {
        table.innerHTML = html;
      }
    },

    // 初始化，将数组默认值设置为0，确定地雷个数
    init: function() {
      for (var i = 0; i < this.rowCount; i++) {
        this.arrs[i] = [];
        for (var j = 0; j < this.colCount; j++) {
          this.arrs[i][j] = 0;
        }
      }
      this.landMineCount = this.selectFrom(this.minLandMineCount, this.maxLandMineCount);
      console.log(this.landMineCount)
      this.markLandMineCount = 0;
      this.beginTime = null;
      this.endTime = null;
      this.currentStepCount = 0;
    },

    // 是地雷的数组项设置为9
    landMine: function() {
      var allCount = this.rowCount * this.colCount - 1,
          tempArr = {};
      for (var i = 0; i < this.landMineCount; i++) {
        var randomNum = this.selectFrom(0, allCount),
            rowCol = this.getRowCol(randomNum);
        if (randomNum in tempArr) {
          i--;
          continue;
        }
        this.arrs[rowCol.row][rowCol.col] = 9;
        tempArr[randomNum] = randomNum;
      }
    },

    // 计算其他格子中的数字
    calculateNoLandMineCount: function() {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          if (this.arrs[i][j] === 9) continue;
          if (i > 0 && j > 0) {
            if (this.arrs[i - 1][j - 1] === 9)
              this.arrs[i][j]++;
          }
          if (i > 0) {
            if (this.arrs[i - 1][j] === 9)
              this.arrs[i][j]++;
          }
          if (i > 0 && j < this.colCount - 1) {
            if (this.arrs[i - 1][j + 1] === 9)
              this.arrs[i][j]++;
          }
          if (j > 0) {
            if (this.arrs[i][j - 1] === 9)
              this.arrs[i][j]++;
          }
          if (j < this.colCount - 1) {
            if (this.arrs[i][j + 1] === 9)
              this.arrs[i][j]++;
          }
          if (i < this.rowCount - 1 && j > 0) {
            if (this.arrs[i + 1][j - 1] === 9)
              this.arrs[i][j]++;
          }
          if (i < this.rowCount - 1) {
            if (this.arrs[i + 1][j] === 9)
              this.arrs[i][j]++;
          }
          if (i < this.rowCount - 1 && j < this.colCount - 1) {
            if (this.arrs[i + 1][j + 1] === 9)
              this.arrs[i][j]++;
          }
        }
      }
    },

    // 获取一个随机数
    selectFrom: function(iFirstValue, iLastValue) {
      var iChoices = iLastValue - iFirstValue + 1;
      return Math.floor(Math.random() * iChoices + iFirstValue);
    },

    // 通过数值找到行和列
    getRowCol: function(val) {
      return {
        row: parseInt(val / this.colCount),
        col: val % this.colCount
      };
    },

    $: function(id) {
      return this.doc.getElementById(id);
    },

    // 给每个格子绑定事件
    bindCells: function() {
      var self = this;
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          (function(row, col) {
            self.$('m-' + i + '-' + j).onmousedown = function(e) {
              e = e || window.event;
              var mounseNum = e.button;
              var className = this.className;
              
              // 点两下设置flag，已设置flag点两下取消
              if (mounseNum === 2) {
                if (className === 'flag') {
                  this.className = '';
                  self.markLandMineCount--;
                } else {
                  this.className = 'flag';
                  self.markLandMineCount++;
                }
                if (self.landMineCallBack) {
                  self.landMineCallBack(self.landMineCount - self.markLandMineCount);
                }
              } else if (className !== 'flag') {
                self.openBlock.call(self, this, row, col);
              }
            };
          })(i, j);
        }
      }
    },

    // 展开无雷区域
    showNoLandMine: function(x, y) {
      for (var i = x - 1; i < x + 2; i++) {
        for (var j = y - 1; j < y + 2; j++) {
          if (!(i == x && j == y)) {
            var ele = this.$('m-' + i + '-' + j);
            if (ele && ele.className === '') {
              this.openBlock.call(this, ele, i, j);
            }
          }
        }
      }
    },

    // 显示
    openBlock: function(obj, x, y) {
      if (this.arrs[x][y] !== 9) {
        this.currentStepCount++;
        if (this.arrs[x][y] !== 0) {
          obj.innerHTML = this.arrs[x][y];
        }
        obj.className = 'normal';
        if (this.currentStepCount + this.landMineCount === this.rowCount * this.colCount) {
          this.success();
        }
        obj.onmousedown = null;
        if (this.arrs[x][y] === 0) {
          this.showNoLandMine.call(this, x, y);
        }
      } else {
        this.failed();
      }
    },

    // 显示地雷
    showLandMine: function() {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          if (this.arrs[i][j] === 9) 
            this.$('m-' + i + '-' + j).className = 'landMine';
        }
      }
    },

    // 显示所有格子信息
    showAll: function() {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          if (this.arrs[i][j] === 9) {
            this.$('m-' + i + '-' + j).className = 'landMine';
          } else {
            var ele = this.$('m-' + i + '-' + j);
            if (this.arrs[i][j] !== 0)
              ele.innerHTML = this.arrs[i][j];
            ele.className = 'normal';
          }
        }
      }
    },

    // 清除显示的格子信息
    hideAll: function() {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          var tdCell = this.$('m-' + i + '-' + j);
          tdCell.className = '';
          tdCell.innerHTML = '';
        }
      }
    },

    // 删除格子绑定的事件
    disableAll: function() {
      for (var i = 0; i < this.rowCount; i++) {
        for (var j = 0; j < this.colCount; j++) {
          var tdCell = this.$('m-' + i + '-' + j);
          tdCell.onmousedown = null;
        }
      }
    },

    // 游戏开始
    begin: function() {
      this.currentStepCount = 0;
      this.markLandMineCount = 0;
      this.beginTime = new Date();
      this.hideAll();
      this.bindCells();
    },

    // 游戏结束
    end: function() {
      this.endTime = new Date();
      if (this.endCallBack) {
        this.endCallBack();
      }
    },

    // 游戏成功
    success: function() {
      this.end();
      this.showAll();
      this.disableAll();
      alert('Congratulation!');
    },

    // 游戏失败
    failed: function() {
      this.end();
      this.showAll();
      this.disableAll();
      alert('GAME OVER!');
    },

    // 入口
    play: function() {
      this.init();
      this.landMine();
      this.calculateNoLandMineCount();
    }
  };

  window.MineSweeper = MineSweeper;
})();