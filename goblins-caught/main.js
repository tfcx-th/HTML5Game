// 创建画布
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// 加载背景图片
var backgroundReady = false;
var backgroundImage = new Image();
backgroundImage.onload = function () {
  backgroundReady = true;
};
backgroundImage.src = 'images/background.png';

// 加载人物图片
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = 'images/hero.png';

// 加载怪兽图片
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
  monsterReady = true;
};
monsterImage.src = 'images/monster.png';

var hero = {
  speed: 256
};
var monster = {};
var monstersCaught = 0;

// 监听键盘 
var keysDown = {};

addEventListener('keydown', function (e) {
  keysDown[e.keyCode] = true;
}, false);
addEventListener('keyup', function (e) {
  delete keysDown[e.keyCode];
}, false);

// 抓到怪兽时重置
var reset = function () {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;

  // 随机设置怪兽位置
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// 更新对象
var update = function (modifier) {
  if (38 in keysDown) {
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) {
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) {
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) {
    hero.x += hero.speed * modifier;
  }

  if (hero.x <= (monster.x + 32) && 
      hero.x >= (monster.x - 31) && 
      hero.y <= (monster.y + 32) &&
      hero.y >= (monster.y - 32)) {
    monstersCaught++;
    reset();
  }
};

// 渲染物体
var render = function () {
  if (backgroundReady) {
    ctx.drawImage(backgroundImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  // 分数
  ctx.fillStyle = 'rgb(250, 250, 250)';
  ctx.font = '24px Helvetica';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Goblins Caught:' + monstersCaught, 32, 32);
};

// 主循环
var main = function () {
  var now = Date.now();

  var delta = now - then;
  update(delta / 1000);
  render();

  then = now;

  requestAnimationFrame(main);
}

// 兼容性
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();
main();