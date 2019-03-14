window.onload = function() {
  // 获取内容区里的#main和#go，获取计数区
  var main = document.getElementById('main');
  var go = document.getElementById('go');
  var count = document.getElementById('count');

  // 设置四种颜色
  colors = ['#1aab8a', '#e15650', '#121b39', '#80a84e'];

  // 动态创建div
  function createDiv(classname) {
    // 创建div节点，为一行
    var div = document.createElement('div');
    // 生成随机数，Math.floor()后表示颜色
    var index = Math.floor(Math.random() * 4);
    // 设置class
    div.className = classname;

    // 在一行里面动态添加四个div，一行四块
    for (var i = 0; i < 4; i++) {
      var iDiv = document.createElement('div');
      div.appendChild(iDiv);
    }

    // 判断#main里面是否有元素
    if (main.children.length === 0) {
      main.appendChild(div);
    } else {
      // 如果有，则在该元素之前插入
      main.insertBefore(div, main.children[0]);
    }

    // 随机的设置四个div块的背景颜色
    div.children[index].style.backgroundColor = colors[index];
    div.children[index].className = 'i';
  }

  function move(obj) {
    // 默认速度与计分
    var speed = 5, num = 0;
    
    // 定义一个计时器
    obj.timer = setInterval(function() {
      // 速度
      var step = parseInt(getComputedStyle(obj, null)['top']) + speed;
      obj.style.top = step + 'px';
      if (parseInt(getComputedStyle(obj, null)['top']) >= 0) {
        createDiv('row');
        obj.style.top = -150 + 'px';
      }
      if (obj.children.length === 6) {
        for (var i = 0; i < 4; i++) {
          if (obj.children[obj.children.length - 1].children[i].className === 'i') {
            // 未点击，游戏结束
            obj.style.top = '-150px';
            count.innerHTML = '游戏结束，最高得分：' + num;
            // 关闭定时器
            clearInterval(obj.timer);
            // 显示开始游戏
            go.children[0].innerHTML = '游戏结束';
            go.style.display = 'block';
          }
        }
        obj.removeChild(obj.children[obj.children.length - 1]);
      }

      // 点击与计分
      obj.onmousedown = function(event) {
        // 点击的不是白块
        // 兼容IE
        event = event || window.event;
        if ((event.target ? event.target : event.srcElement).className === 'i') {
          // 点击后块的颜色
          (event.target ? event.target : event.srcElement).style.backgroundColor = '#bbb';
          // 清除盒子标记
          (event.target ? event.target : event.srcElement).className = '';
          // 计分
          num++;
          // 显示得分
          count.innerHTML = '当前得分：' + num;
        } else {
          // 点击白块，游戏结束
          obj.style.top = 0;
          count.innerHTML = '游戏结束，最高得分：' + num;
          // 关闭定时器
          clearInterval(obj.timer);
          //显示开始游戏
          go.children[0].innerHTML = '游戏结束';
          go.style.display = "block";
        }

        // 块加速
        if (num % 10 === 0) {
          speed++;
        }
      }

      // 松开触发终止
      obj.onmouseup = function(event) {
      }
    }, 20)
  }

  go.children[0].onclick = function() {
    if (main.children.length) {
      // 清除main中所有块
      main.innerHTML = '';
    }
    // 清空计分
    count.innerHTML = '';
    // 隐藏开始块
    this.parentNode.style.display = 'none';
    move(main);
  }
}