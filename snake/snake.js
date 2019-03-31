var map = document.getElementsByClassName('map')[0];

// 产生随机数对象
(function() {
  // 产生随机数的构造函数
  function Random() {

  }

  window.Random = Random;

  // 在原型对象中添加方法，范围min~max-1
  Random.prototype.getRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };
})();

// 产生小方块对象
(function() {
  // 保存食物的数组
  var elements = [];

  // 食物的构造函数
  function Food(width, height, color) {
    this.width = width || 20;
    this.height = height || 20;
    this.color = color || 'green';
    this.x = 0;
    this.y = 0;
    this.element = document.createElement('div');
  }

  window.Food = Food;

  // 初始化小方块的显示效果及位置
  Food.prototype.init = function() {
    // 创建之前先删除，保证小方块唯一
    remove();

    var div = this.element;
    map.appendChild(div);

    div.style.width = this.width + 'px';
    div.style.height = this.height + "px";
    div.style.backgroundColor = this.color;
    div.style.position = 'absolute';

    this.x = new Random().getRandom(0, map.offsetWidth / this.width) * this.width;
    this.y = new Random().getRandom(0, map.offsetHeight / this.height) * this.height;
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';

    elements.push(div);
  };

  function remove() {
    for (var i = 0; i < elements.length; i++) {
      elements[i].parentElement.removeChild(elements[i]);
      // 清空数组，从i的位置删除1个元素
      elements.splice(i, 1);
    }
  }
})();

// 产生小蛇对象
(function() {
  // 保存小蛇身体的每个div
  var elements = [];

  function Snack(width, height, direction) {
    this.width = width || 20;
    this.height = height || 20;
    this.direction = direction || 'right';
    this.beforeDirection = this.direction;

    this.body = [
      {
        x: 3,
        y: 2,
        color: 'red'
      },
      {
        x: 2,
        y: 2,
        color: 'orange'
      },
      {
        x: 1,
        y: 2,
        color: 'orange'
      }
    ];
  }

  window.Snack = Snack;

  Snack.prototype.init = function(map) {
    // 删除之前的
    remove();

    // 创建蛇的身体
    for (var i = 0; i < this.body.length; i++) {
      var div = document.createElement('div');
      map.appendChild(div);

      div.style.width = this.width + 'px';
      div.style.height = this.height + "px";
      div.style.position = 'absolute';
      div.style.border = '1px solid black';

      // 位置
      var tempObj = this.body[i];
      div.style.left = tempObj.x * this.width + 'px';
      div.style.top = tempObj.y * this.width + 'px';
      div.style.backgroundColor = tempObj.color;

      elements.push(div);
    }
  };

    // 蛇移动
  Snack.prototype.move =function(food) {
    var index = this.body.length - 1;

    for (var i = index; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }

    // 头部
    switch(this.direction) {
      case 'right': 
        this.body[i].x += 1;
        break;
      case 'left':
        this.body[i].x -= 1;
        break;
      case 'up':
        this.body[i].y -= 1;
        break;
      case 'down':
        this.body[i].y += 1;
        break;
      default:
        break;
    }

    // 吃到食物
    var headX = this.body[0].x * this.width;
    var headY = this.body[0].y * this.height;

    // 吃到后，身体延长
    if ((headX === food.x) && (headY === food.y)) {
      var last = this.body[this.body.length - 1];
      this.body.push({
        x: last.x,
        y: last.y,
        color: last.color
      });

      food.init();
    }
  };

  function remove() {
    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode.removeChild(elements[i]);
      elements.splice(i, 1);
    }
  }
})();

// 产生游戏对象
(function() {
  var that = null;

  function Game(map) {
    this.food = new Food(20, 20, 'purple');
    this.snack = new Snack(20, 20);
    this.map = map;
    that = this;
  }

  // 初始化
  Game.prototype.init = function() {
    this.food.init(this.map);
    this.snack.init(this.map);

    this.autoRun();
    this.changeDirection();
  };

  Game.prototype.autoRun = function() {

    var speed = 500; 
    var timeId = setInterval(autoMove.bind(that), speed);

    function autoMove() {

      console.log(speed);

      this.snack.move(this.food);
      this.snack.init(this.map);

      // 判断边界
      var maxX = this.map.offsetWidth / this.snack.width;
      var maxY = this.map.offsetHeight / this.snack.height;

      // 判断是否会吃到自己
      for (var i = 1; i < this.snack.body.length; i++) {
        if ((this.snack.body[0].x === this.snack.body[i].x) && (this.snack.body[0].y === this.snack.body[i].y)) {
          clearInterval(timeId);
          alert('Game Over!');
          return;
        }
      }

      // x
      if ((this.snack.body[0].x < 0) || (this.snack.body[0].x >= maxX)) {
        clearInterval(timeId);
        alert('Game Over!');
        return;
      }

      // y
      if ((this.snack.body[0].y < 0) || (this.snack.body[0].y >= maxY)) {
        clearInterval(timeId);
        alert('Game Over!');
        return;
      }

      // 蛇的速度
      if (Math.floor(this.snack.body.length) < 28) {
        speed = 500 - 50 * Math.floor(this.snack.body.length / 3);
      }
      clearInterval(timeId);
      timeId = setInterval(autoMove.bind(that), speed);
    }
  };

  Game.prototype.changeDirection = function() {
    addAnyEventListener(document, 'keydown', function(e) {
      this.snack.beforeDirection = this.snack.direction;

      switch(e.keyCode) {
        // 左
        case 37:
          this.snack.beforeDirection !== 'right' ? this.snack.direction = "left" : this.snack.direction = "right";
          break;
        // 上
        case 38: 
          this.snack.beforeDirection !== "down" ? this.snack.direction = "up" : this.snack.direction = "down";
          break;
        // 右
        case 39: 
          this.snack.beforeDirection !== "left" ? this.snack.direction = "right" : this.snack.direction = "left";
          break;
        // 下
        case 40: 
          this.snack.beforeDirection !== "up" ? this.snack.direction = "down" : this.snack.direction = "up";
          break;
        default:
          break;
      }
    }.bind(that));
  };

  window.Game = Game;
})();

function start() {
  var game = new Game(map);
  game.init();
}

// 为任意元素绑定任意事件
function addAnyEventListener(element, type, func) {
  if(element.addEventListener) {
    element.addEventListener(type, func, false);
  } else if(element.attachEvent) {
    element.attachEvent("on"+type, func);
  } else {
    element["on"+type] = func;
  }
}