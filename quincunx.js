var w, h, ratio, i, s, el, g, div, dragQ, game, my = {};
function quincunxMain(mode) {
    this.version = '0.631';
    w = 500;
    h = 730;
    my.boxW = 30;
    my.boxH = 30;
    my.userBoardSize = 6;
    my.multiClrQ = false;
    my.borderT = 116;
    FF = false;
    my.leftProb = 0.5;
    var s = '';
    s += '<div id="main" style="position:relative; width:' + w + 'px; min-height:' + h + 'px;  margin:auto; display:block; background-color: hsl(240,100%,93%); border-radius: 20px; ">';
    s += '<div style="position:relative;">';
    s += '<canvas id="can1" style="position: absolute; width:' + w + 'px; height:' + w + 'px; left: 0px; top: 0px; border: none;"></canvas>';
    s += '</div>';
    s += '<div id="cans" style="display: inline-block; float:left; margin: 0;">';
    s += '</div>';
    s += '<div id="play" style="position:absolute; left:10px; top:10px; z-index:1;">';
    s += '<input type="text" id="count" style="display: inline-block; width: 65px; color: black; text-align:center; padding: 3px; background-color: #eeffee; font: bold 18px Arial; border-radius: 10px; vertical-align: top; margin-top:3px;" value=""/>';
    s += getPlayHTML(36);
    s += '</div>';
    s += '<div id="buttons" style="position:absolute; right:6px; top:6px; text-align:right; ">';
    s += '<button id="restart" style=" font: 20px Arial; height:30px; vertical-align:middle; z-index: 10;" class="togglebtn" onclick="restart()" >Restart</button>';
    s += '<br>';
    s += '<button id="data" style=" font: 20px Arial; height:30px; vertical-align:middle; z-index: 10;" class="togglebtn" onclick="optPop()" >Data</button>';
    s += '</div>';
    s += optPopHTML();
    var lblStyle = 'display: inline-block; font:15px Arial; width: 80px; text-align: right; margin-right:10px;';
    var txtStyle = 'display: inline-block; width:100px; font: 18px Arial; color: #6600cc; text-align: left;';
    s += '<div id="settings" style="position:absolute; left:10px; top:10px;">';
    s += '<div style="' + lblStyle + '">Size:</div>'
    s += '<input type="range" id="r2"  value="5" min="1" max="15" step="1"  style="z-index:2; width:200px; height:10px; border: none; " autocomplete="off" oninput="onSizeChg(0,this.value)" onchange="onSizeChg(1,this.value)" />';
    s += '<div id="size" style="' + txtStyle + '">0.5</div>';
    s += '<br>';
    s += '<div style="' + lblStyle + '">Left/Right:</div>'
    s += '<input type="range" id="r3"  value="0.5" min="0" max="1" step=".01"  style="z-index:2; width:200px; height:10px; border: none; " autocomplete="off" oninput="onProbChg(0,this.value)" onchange="onProbChg(1,this.value)" />';
    s += '<div id="prob" style="' + txtStyle + '">0.5</div>';
    s += '<br>';
    s += '<div style="' + lblStyle + '">Speed:</div>'
    s += '<input type="range" id="r1"  value="0.4" min="0" max="1" step=".01"  style="z-index:2; width:200px; height:10px; border: none; " autocomplete="off" oninput="onSpeedChg(0,this.value)" onchange="onSpeedChg(1,this.value)" />';
    s += '<div id="speed" style="' + txtStyle + '">1</div>';
    s += '</div>';
    s += '<div id="copyrt" style="position: absolute; left: 10px; bottom: 10px; font: 10px Arial; color: blue; ">&copy; 2017 MathsIsFun.com  v' + this.version + '</div>';
    s += '</div>';
    document.write(s);
    el = document.getElementById('can1');
    ratio = 3;
    el.width = w * ratio;
    el.height = h * ratio;
    el.style.width = w + "px";
    el.style.height = h + "px";
    g = el.getContext("2d");
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.clrs = [["Red", '#FF0000'], ["Blue", '#0000FF'], ["Black", '#000000'], ["Green", '#00cc00'], ["Orange", '#FFA500'], ["Slate Blue", '#6A5ACD'], ["Lime", '#00FF00'], ["Spring Green", '#00FF7F'], ["Teal", '#008080'], ["Gold", '#ffd700'], ["Med Purple", '#aa00aa'], ["Light Blue", '#ADD8E6'], ["Navy", '#000080'], ["Purple", '#800080'], ["Dark SeaGreen", '#8FBC8F']];
    this.clrNo = 0;
    my.frameN = 200;
    tiles = [];
    onSizeChg(1, 6);
    onSpeedChg(1, 0.4);
    onProbChg(1, 0.5);
    restart();
}
function restart() {
    g.clearRect(0, 0, el.width, el.height);
    my.frameNo = 0;
    for (var i = 0; i < tiles.length; i++) {
        t = tiles[i];
        t.stop();
    }
    tiles = [];
    var div = document.getElementById('cans');
    while (div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
    div.innerHTML = '';
    my.datas = [];
    my.boardSize = my.userBoardSize;
    my.boardHalf = my.boardSize / 2;
    my.maxCount = 10;
    drawBoard();
    drawGraph();
    reset();
    if (!my.playQ)
        togglePlay();
}
function reset() {
    my.count = 0;
    for (var i = 0; i < my.tots.length; i++) {
        var t = my.tots[i];
        t.count = 0;
    }
    var div = document.getElementById('count');
    div.value = my.count;
}
function onSpeedChg(n, v) {
    v = Number(v) * 1.3 + 1;
    v = Number(Math.pow(10, v).toPrecision(2));
    my.frameN = parseInt(3000 / v);
    v = parseInt(v);
    document.getElementById('speed').innerHTML = v;
}
function onSizeChg(n, v) {
    v = Number(v);
    my.userBoardSize = v;
    document.getElementById('size').innerHTML = v;
}
function onProbChg(n, v) {
    v = Number(1 - v).toFixed(2);
    my.leftProb = v;
    var pct = parseInt(v * 100);
    var s = pct + '%' + ' / ' + (100 - pct) + '%'
    document.getElementById('prob').innerHTML = s;
}
function nextDrop() {
    my.frameNo = 2;
    animate();
}
function animate() {
    if (my.playQ) {
        if (my.frameNo == 2) {
            var clr = '#00a';
            if (my.multiClrQ) {
                this.clrNo++;
                this.clrNo = this.clrNo % this.clrs.length;
                clr = this.clrs[this.clrNo][1];
            }
            my.count++;
            var div = document.getElementById('count');
            div.value = my.count;
            addTile(0, 0, clr);
        }
        my.frameNo = (++my.frameNo) % my.frameN;
        requestAnimationFrame(animate);
    }
}
function drawBoard() {
    my.boardHalf = Math.floor(my.boardSize / 2);
    var bd = {
        x: boxLeft(0, my.boardSize + 1),
        y: my.borderT,
        wd: my.boxW * (my.boardSize + 2),
        ht: my.boxH * my.boardSize + 126
    }
    var grd = g.createLinearGradient(bd.x, bd.y, bd.x + bd.wd, bd.y);
    grd.addColorStop(0, "#cdf");
    grd.addColorStop(0.1, "#def");
    grd.addColorStop(1, "#cdf");
    g.strokeStyle = '#888';
    g.fillStyle = grd;
    g.beginPath();
    g.rect(bd.x, bd.y, bd.wd, bd.ht);
    g.fill();
    g.stroke();
    for (var row = 0; row < my.boardSize; row++) {
        for (var col = 0; col < row + 1; col++) {
            var posx = boxLeft(col, row);
            var posy = boxTop(row);
            for (var i = 0; i < 8; i++) {
                g.beginPath();
                g.fillStyle = 'rgba(0, 0, 0, 0.03)';
                g.arc(posx + 45 / 2, posy + 30 + 1.5, 2 + i / 2, 0, 2 * Math.PI);
                g.fill();
            }
            g.beginPath();
            g.fillStyle = '#f88';
            g.strokeStyle = '#000';
            g.arc(posx + 45 / 2 - 1.5, posy + 30, 3, 0, 2 * Math.PI);
            g.stroke();
            g.fill();
        }
    }
    var div = document.getElementById('play');
    div.style.left = parseInt(boxLeft(0, 0) - 15) + "px";
    div.style.top = parseInt(boxTop(0) - 38) + "px";
}
function drawGraph() {
    my.tots = [];
    for (var col = 0; col <= my.boardSize; col++) {
        posx = boxLeft(col, my.boardSize) + 6;
        posy = boxTop(my.boardSize);
        var tot = new Tot(my.boxW,my.boxH,col);
        tot.setxy(posx, posy + 6);
        my.tots.push(tot);
    }
}
function boxTop(rowNo) {
    return (my.borderT + Number(my.boxH * rowNo));
}
function boxLeft(colNo, rowNo) {
    return (w / 2 + Number(my.boxW * (-0.5 - rowNo / 2 + colNo)));
}
function getPlayHTML(w) {
    var s = '';
    s += '<style type="text/css">';
    s += '.btn {display: inline-block; position: relative; width:' + w + 'px; height:' + w + 'px; margin-right:' + w * 0.2 + 'px; padding: .6em; border: 0 solid rgba(208,208,248,1); border-radius: 10em; background: linear-gradient(#fff, #ccf), #c9c5c9; box-shadow: 0 3 4 rgba(0,0,0,.4); }';
    s += '.btn:hover {background: linear-gradient(#f5f5f5, #b9b9b9), #c9c5c9; }';
    s += '.btn:before, button:after {content: " "; position: absolute; }';
    s += '.btn:active {top:' + w * 0.05 + 'px; box-shadow: 0 ' + w * 0.02 + 'px ' + w * 0.03 + 'px rgba(0,0,0,.4); }';
    s += '.play:before {  left: ' + w * 0.36 + 'px; top: ' + w * 0.22 + 'px; width: 0; height: 0; border: ' + w * 0.3 + 'px solid transparent; border-left-width: ' + w * 0.4 + 'px; border-left-color: blue;  }';
    s += '.play:hover:before {border-left-color: yellow; }';
    s += '.pause:before, .pause:after {display: block; left: ' + w * 0.29 + 'px; top: ' + w * 0.28 + 'px; width: ' + w * 0.19 + 'px; height: ' + w * 0.47 + 'px; background-color: blue; }';
    s += '.pause:after {left: ' + w * 0.54 + 'px; }';
    s += '.pause:hover:before, .pause:hover:after {background-color: yellow; }';
    s += '</style>';
    s += '<button id="playBtn" class="btn play" onclick="togglePlay()" ></button>';
    return s;
}
function optPopHTML() {
    var s = '';
    s += '<div id="optpop" style="position:absolute; left:-500px; top:0px; width:360px; padding: 5px; border-radius: 9px; background-color: #bcd; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); transition: all linear 0.3s; opacity:0; text-align: center; ">';
    s += '<div id="optInside" style="margin: 5px auto 5px auto;">';
    s += 'List:</br>';
    s += '<textarea id="optList" style="width:100%; height:200px"></textarea>';
    s += '<br>Summary:</br>';
    s += '<textarea id="optSums" style="width:100%; height:50px"></textarea>';
    s += '</div>';
    s += '<div style="float:right; margin: 0 0 5px 10px;">';
    s += '<button onclick="optNo()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2718;</button>';
    s += '</div>';
    s += '</div>';
    return s;
}
function optPop() {
    var pop = document.getElementById('optpop');
    pop.style.transitionDuration = "0.3s";
    pop.style.opacity = 1;
    pop.style.zIndex = 12;
    pop.style.left = (w - 400) / 2 + 'px';
    var div = document.getElementById('optList');
    div.value = my.datas.join(',');
    var sums = [];
    for (var i = 0; i < my.tots.length; i++) {
        var t = my.tots[i];
        sums.push(t.count);
    }
    var div = document.getElementById('optSums');
    var s = 'Size: ' + my.boardSize + ', Left Probability: ' + my.leftProb;
    s += '\n';
    s += 'Totals: ' + sums.join(',');
    div.value = s;
}
function optYes() {
    var pop = document.getElementById('optpop');
    pop.style.opacity = 0;
    pop.style.zIndex = 1;
    pop.style.left = '-999px';
    newGame();
}
function optNo() {
    var pop = document.getElementById('optpop');
    pop.style.opacity = 0;
    pop.style.zIndex = 1;
    pop.style.left = '-999px';
}
function togglePlay() {
    if (my.resetQ) {
        reset();
        my.resetQ = false;
    }
    if (this.frame >= this.frameMax) {
        this.frame = 0;
    }
    var btn = 'playBtn';
    if (my.playQ) {
        my.playQ = false;
        document.getElementById(btn).classList.add("play");
        document.getElementById(btn).classList.remove("pause");
    } else {
        my.playQ = true;
        nextDrop();
        document.getElementById(btn).classList.add("pause");
        document.getElementById(btn).classList.remove("play");
    }
    if (my.colNo < my.colMax)
        my.cols[my.colNo].anim();
}
function addTile(row, col, clr) {
    var tile = new Tile(row,col);
    tiles.push(tile);
    var posx = boxLeft(col, row);
    var posy = boxTop(row);
    tile.setxy(posx, posy);
    tile.anim(clr);
}
function delTile(tile) {
    tile.stop();
    document.getElementById('cans').removeChild(tile.canvas);
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i] === tile) {
            tiles.splice(i, 1);
        }
    }
}
function Tile(row, col) {
    this.row = row;
    this.col = col;
    this.ball = {
        size: 8,
        color: 'white',
        lightColor: 'yellow',
        darkColor: 'darkblue'
    }
    this.wd = 45;
    this.ht = 58;
    this.midX = this.wd / 2;
    this.midY = 20;
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = "absolute";
    document.getElementById('cans').appendChild(this.canvas);
    this.ratio = 2;
    this.canvas.width = this.wd * this.ratio;
    this.canvas.height = this.ht * this.ratio;
    this.canvas.style.width = this.wd + "px";
    this.canvas.style.height = this.ht + "px";
    this.g = this.canvas.getContext("2d");
    this.g.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
    this.frame = 0;
    this.frameN = my.frameN * 0.9;
    this.playQ = true;
    this.redraw();
}
Tile.prototype.stop = function() {
    this.playQ = false;
}
Tile.prototype.setxy = function(lt, tp) {
    this.canvas.style.left = lt + 'px';
    this.canvas.style.top = tp + 'px';
}
;
Tile.prototype.redraw = function() {
    this.g.clearRect(0, 0, this.wd, this.ht);
    if (this.frame > 0 && this.frame <= this.frameN) {
        this.g.ball(this.ball, this.midX + this.x, this.midY + this.y + 2);
    }
}
;
Tile.prototype.anim = function(clr) {
    this.clr = clr;
    this.ball.darkColor = clr;
    this.frame = 0;
    this.hasBall = true;
    this.frameN = parseInt(my.frameN * 0.99);
    this.x = 0;
    this.y = 0;
    if (Math.random() < my.leftProb) {
        this.dir = -1;
    } else {
        this.dir = 1;
    }
    this.vx = this.dir * my.boxW / this.frameN / 2;
    this.vy = -60 / this.frameN;
    this.dvy = -3 * this.vy / this.frameN;
    this.doFrame();
}
;
Tile.prototype.doFrame = function() {
    this.redraw();
    this.frame++;
    this.x += this.vx;
    this.vy += this.dvy;
    this.y += this.vy;
    if (this.frame == this.frameN - 1) {
        this.bouncenow();
    }
    if (this.frame <= this.frameN) {
        if (this.playQ)
            requestAnimationFrame(this.doFrame.bind(this));
    } else {
        delTile(this)
    }
}
;
Tile.prototype.bouncenow = function() {
    var nextRow = this.row + 1;
    var nextCol = (this.dir < 0) ? this.col : this.col + 1;
    if (nextRow < my.boardSize) {
        addTile(nextRow, nextCol, this.clr)
    } else {
        my.tots[nextCol].addOne();
        redrawTots();
        my.datas.push(nextCol);
    }
}
function redrawTots(dx, dy) {
    for (var i = 0; i < my.tots.length; i++) {
        var t = my.tots[i];
        t.redraw();
    }
}
function Tot(dx, dy, id) {
    this.id = id;
    this.barHt = 100;
    this.wd = my.boxW;
    this.ht = this.barHt + 20;
    var canvas = document.createElement('canvas');
    canvas.style.position = "absolute";
    document.getElementById('cans').appendChild(canvas);
    var ratio = 2;
    canvas.width = this.wd * ratio;
    canvas.height = (this.ht + 30) * ratio;
    canvas.style.width = this.wd + "px";
    canvas.style.height = (this.ht + 30) + "px";
    var g = canvas.getContext("2d");
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.canvas = canvas;
    this.g = g;
    this.count = 0;
}
Tot.prototype.stop = function() {
    console.log("Tot stop");
}
Tot.prototype.setxy = function(lt, tp) {
    this.canvas.style.left = lt + 'px';
    this.canvas.style.top = tp + 'px';
}
;
Tot.prototype.addOne = function() {
    this.count++;
    if (this.count > my.maxCount)
        my.maxCount = this.count;
}
;
Tot.prototype.redraw = function() {
    this.g.clearRect(0, 0, this.wd, this.ht);
    var ht = this.barHt * (this.count / my.maxCount);
    this.g.strokeStyle = 'black';
    this.g.fillStyle = 'orange';
    this.g.beginPath();
    this.g.rect(0, this.ht - ht, this.wd, ht);
    this.g.fill();
    this.g.stroke();
    this.g.fillStyle = 'black';
    this.g.beginPath();
    this.g.textAlign = 'center';
    this.g.font = '15px Arial';
    this.g.fillText(this.count.toString(), this.wd / 2, this.ht - ht - 3);
    this.g.fill();
    this.g.fillStyle = 'grey';
    this.g.font = '13px Arial';
    this.g.textAlign = 'center';
    this.g.beginPath();
    this.g.fillText(this.id, this.wd / 2, this.ht + 14);
    this.g.fill();
}
;
CanvasRenderingContext2D.prototype.ball = function(ball, x, y) {
    var size = ball.size;
    this.beginPath();
    this.fillStyle = ball.color;
    this.arc(x, y, size, 0, Math.PI * 2, true);
    var gradient = this.createRadialGradient(x - size / 2, y - size / 2, 0, x, y, size);
    gradient.addColorStop(0, ball.color);
    gradient.addColorStop(1, ball.darkColor);
    this.fillStyle = gradient;
    this.fill();
    this.closePath();
    this.beginPath();
    this.arc(x, y, size * 0.85, (Math.PI / 180) * 270, (Math.PI / 180) * 200, true);
    gradient = this.createRadialGradient(x - size * .5, y - size * .5, 0, x, y, size);
    gradient.addColorStop(0, ball.lightColor);
    gradient.addColorStop(0.5, 'transparent');
    this.fillStyle = gradient;
    this.fill();
}
