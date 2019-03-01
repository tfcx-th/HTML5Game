function Game2048(container) {
    this.container = container;
    this.tiles = new Array(16);    // 总共16个格子
}

Game2048.prototype = {
    init: function() {
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.newTile(0);
            tile.setAttribute('index', i);
            this.container.appendChild(tile);
            this.tiles[i] = tile;
        }
        this.randomTile();
        this.randomTile();
    },
    
    // 创建格子
    newTile: function(val) {
        var tile = document.createElement('div');
        this.setTileVal(tile, val);
        return tile;
    },

    // 设置格子数值
    setTileVal: function(tile, val){
        tile.className = 'tile tile' + val;
        tile.setAttribute('val', val);
        tile.innerHTML = val > 0 ? val : '';
    },

    // 随机选取空格子赋值
    randomTile: function() {
        var zeroTiles = [];    // 空格子
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getAttribute('val') == 0) {
                zeroTiles.push(this.tiles[i]);
            }
        }
        // 随机选取一个空格子
        var rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
        // 在选取的空格子上赋值，80%为2，20%为4
        this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);
    },

    // 通过WASD操作，每移动完一次，随机生成一个格子
    move: function(direction) {
        var j;
        switch(direction) {
            // 从第二行起所有格子向上移动
            case 'W':
                for (var i = 4; i < this.tiles.length; i++) {
                    j = i;
                    while (j >= 4) {
                        this.merge(this.tiles[j - 4], this.tiles[j]);
                        j -= 4;
                    }
                }
                break;
            // 第一到第三行所有格子向下移动
            case 'S':
                for (var i = 11; i >= 0; i--) {
                    j = i;
                    while (j <= 11) {
                        this.merge(this.tiles[j + 4], this.tiles[j]);
                        j += 4;
                    }
                }
                break;
            // 从第二列起所有格子向左移动
            case 'A':
                for (var i = 1; i < this.tiles.length; i++) {
                    j = i;
                    while (j % 4 !== 0) {
                        this.merge(this.tiles[j - 1], this.tiles[j]);
                        j -= 1;
                    }
                }
                break;
            // 第一列到第三列所有格子向右移动
            case 'D': 
                for (var i = 14; i >= 0; i--) {
                    j = i;
                    while (j % 4 !== 3) {
                        this.merge(this.tiles[j + 1], this.tiles[j]);
                        j += 1;
                    }
                }
                break;
        }
        this.randomTile();
    },

    // 合并两个格子
    merge: function(targetTile, currentTile) {
        var targetTileVal = targetTile.getAttribute('val');
        var currentTileVal = currentTile.getAttribute('val');
        // 当前格子数值为0时不移动
        if (currentTileVal != 0) {
            // 下个格子为0时直接设置为当前格子数值，当前格子数值置零
            // 可通过move中的循环找到该行或列第一个不为0的格子
            if (targetTileVal == 0) {
                this.setTileVal(targetTile, currentTileVal);
                this.setTileVal(currentTile, 0);
            } 
            // 若下个格子数值等于当前，则下个格子数值*2，当前置零
            // 若不相等，则不处理，二者正好相邻
            else if (targetTileVal == currentTileVal) {
                this.setTileVal(targetTile, currentTileVal * 2);
                this.setTileVal(currentTile, 0);
            }
        }
    },

    // 格子最大值是否达到2048
    max: function() {
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].getAttribute('val') == 2048) {
                return 2048;
            }
        }
    },

    // 判断游戏失败，遍历每个格子，判断其右侧和下侧是否有相等的格子
    // 若全部没有，且无空格子，则判负，返回true
    over: function() {
        for (var i = 0; i < this.tiles.length; i++) {
            // 判断是否有空格子
            if (this.tiles[i].getAttribute('val') == '0') {
                return false;
            }
            // 判断右侧是否有相等的格子
            if (i % 4 !== 3) {
                if (this.tiles[i].getAttribute('val') == this.tiles[i + 1].getAttribute('val')) {
                    return false;
                }
            }
            // 判断下侧是否有相等的格子
            if (i < 12) {
                if (this.tiles[i].getAttribute('val') == this.tiles[i + 4].getAttribute('val')) {
                    return false;
                }
            }
        }
        return true;
    },

    // 清空
    clean: function() {
        for (var i = 0; i < this.tiles.length; i++) {
            this.container.removeChild(this.tiles[i]);
        }
        this.tiles = new Array(16);
    }
}

var game, startBtn;

window.onload = function() {
    var container = document.getElementById('div2048');
    startBtn = document.getElementById('start');
    startBtn.onclick = function() {
        this.style.display = 'none';
        game = new Game2048(container);
        game.init();
    }
}

window.onkeydown = function(e) {
    var keynum, keychar;
    if (window.event) {       // IE
        keynum = e.keyCode;
    } else if (e.which) {       // Netscape/Firefox/Opera
        keynum = e.which;
    }
    keychar = String.fromCharCode(keynum);
    if (['W', 'S', 'A', 'D'].indexOf(keychar) > -1) {
        if (game.over()) {
            game.clean();
            startBtn.style.display = 'block';
            startBtn.innerHTML = 'GAME OVER, REPLAY?';
            return;
        }
        game.move(keychar);
    }
}