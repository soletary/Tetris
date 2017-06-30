/**
 * @name 俄罗斯方块
 * @author zhuys
 * @2017.06.27
 */
var TETRIS_ROWS=22;
var TETRIS_COLS=10;
var NO_BLOCK=0;
var CELL_SIZE=30;
var colors=["black","yellow","red","green","blue","purple","orange","pink"];
var tetris_status=[];
var isPlaying=true;
window.onload=function(){
	if(window.localStorage){
		alert("浏览支持localStorage") 
	}
	else
	{ 
		alert("浏览暂不支持localStorage") 
	} 
	creatCanvas(TETRIS_ROWS,TETRIS_COLS,CELL_SIZE,CELL_SIZE);
	document.body.appendChild(tetris_canvas);
	curScoreEle=document.getElementById("curScoreEle");
	curSpeedEle=document.getElementById("curSpeedEle");
	maxScoreEle=document.getElementById("maxScoreEle");
	var tmpStatus=localStorage.getItem("tetris_status");
	tetris_status=tmpStatus==null?tetris_status:JSON.parse(tmpStatus);
	drawBlock();
	curScore=localStorage.getItem("curScore");
	curScore=curScore==null?0:parseInt(curScore);
	maxScore=localStorage.getItem("maxScore");
	maxScore=maxScore==null?0:parseInt(maxScore);
	curSpeed=localStorage.getItem("curSpeed");
	curSpeed=curSpeed==null?1:parseInt(curSpeed);
	initBlock();
	curTimer=setInterval("moveDown();",500/curSpeed);
}

var creatCanvas = function(rows, cols, cellWidth, cellHeight) {
	tetris_canvas = document.createElement("canvas");
	//set canvas's width and height
	tetris_canvas.width == cols * cellWidth;
	tetris_canvas.height = rows * cellHeight;
	//set canvas's border
	tetris_canvas.style.border = "1px solid black";
	//get canvas's painting api
	tetris_ctx = tetris_canvas.getContext('2d');
	//draw path
	tetris_ctx.beginPath();
	//draw path of grid
	for(var i = 1; i < TETRIS_ROWS; i++) {
		tetris_ctx.moveTo(0, i * CELL_SIZE);
		tetris_ctx.lineTo(TETRIS_COLS * CELL_SIZE, i * CELL_SIZE);
	}
	for(var i = 1; i < TETRIS_COLS; i++) {
		tetris_ctx.moveTo(i * CELL_SIZE, 0);
		tetris_ctx.lineTo(i * CELL_SIZE, TETRIS_ROWS * CELL_SIZE);
	}
	tetris_ctx.closePath();
	//设置笔触颜色
	tetris_ctx.strokeStyle = "#aaa";
	//设置线条粗线
	tetris_ctx.lineWidth = 0.3;
	//draw line
	tetris_ctx.stroke();
}

var blockArr=[
	//Z
	[
		{x:TETRIS_COLS/2-1,y:0,color:1},
		{x:TETRIS_COLS/2,y:0,color:1},
		{x:TETRIS_COLS/2,y:1,color:1},
		{x:TETRIS_COLS/2+1,y:1,color:1}
	],
	//^Z
	[
		{x:TETRIS_COLS/2-1,y:0,color:2},
		{x:TETRIS_COLS/2,y:0,color:2},
		{x:TETRIS_COLS/2,y:1,color:2},
		{x:TETRIS_COLS/2+1,y:1,color:2}
	],
	//田
	[
		{x:TETRIS_COLS/2-1,y:0,color:3},
		{x:TETRIS_COLS/2,y:0,color:3},
		{x:TETRIS_COLS/2-1,y:1,color:3},
		{x:TETRIS_COLS/2,y:1,color:3}
	],
	//L
	[
		{x:TETRIS_COLS/2,y:0,color:4},
		{x:TETRIS_COLS/2,y:1,color:4},
		{x:TETRIS_COLS/2,y:2,color:4},
		{x:TETRIS_COLS/2+1,y:2,color:4}
	],
	//J
	[
		{x:TETRIS_COLS/2,y:0,color:5},
		{x:TETRIS_COLS/2,y:1,color:5},
		{x:TETRIS_COLS/2,y:2,color:5},
		{x:TETRIS_COLS/2-1,y:2,color:5}
	],
	//|
	[
		{x:TETRIS_COLS/2,y:0,color:6},
		{x:TETRIS_COLS/2,y:1,color:6},
		{x:TETRIS_COLS/2,y:2,color:6},
		{x:TETRIS_COLS/2,y:3,color:6}
	],
	//土
	[
		{x:TETRIS_COLS/2,y:0,color:7},
		{x:TETRIS_COLS/2-1,y:1,color:7},
		{x:TETRIS_COLS/2,y:1,color:7},
		{x:TETRIS_COLS/2+1,y:1,color:7}
	],
];


for(var i=0;i<TETRIS_ROWS;i++){
	tetris_status[i]=[];
	for(var j=0;j<TETRIS_COLS;j++){
		tetris_status[i][j]=NO_BLOCK;
	}
}

var initBlock=function(){
	var rand=Math.floor(Math.random()*blockArr.length);
	currentFall = [{
		x: blockArr[rand][0].x,
		y: blockArr[rand][0].y,
		color: blockArr[rand][0].color
	},{
		x: blockArr[rand][1].x,
		y: blockArr[rand][1].y,
		color: blockArr[rand][1].color
	},{
		x: blockArr[rand][2].x,
		y: blockArr[rand][2].y,
		color: blockArr[rand][2].color
	},{
		x: blockArr[rand][3].x,
		y: blockArr[rand][3].y,
		color: blockArr[rand][3].color
	}];
};

var moveDown=function(){
	//define ifCanDown
	var canDown=true;
	for(var i=0;i<currentFall.length;i++){
		//judge ifIsBottom
		if(currentFall[i].y>=TETRIS_ROWS-1){
			canDown=false;
			break;
		}
		if(tetris_status[currentFall[i].y+1][currentFall[i].x]!=NO_BLOCK){
			canDown=false;
			break;
		}
	}
	//if can down
	if(canDown){
		//paint backgroud color of the origin position to white
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			//set white
			tetris_ctx.fillStyle='white';
			//draw rectangle
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		//drop each block
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			cur.y++;
		}
		//paint each droped block
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			tetris_ctx.fillStyle=colors[cur.color];
			//draw rectangle
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}
	else{
		//foreach each block to record its value in tetris_status array
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			//if block is on the top of the canvas ,indicate failure
			if(cur.y<2)
			{
			localStorage.removeItem("curScore");
			localStorage.removeItem("tetris_status");
			localStorage.removeItem("curSpeed");
			if(confirm("You lose,join the Score Record?")){
				maxScore=localStorage.getItem("maxScore");
				maxScore=maxScore==null?0:maxScore;
				if(curScore>=maxScore)
				{
					localStorage.setItem("maxScore",curScore);	
				}
				maxScoreEle.innerHTML=maxScore;
				}
			isPlaying=false;
			clearInterval(curTimer);
			return;
			}
			tetris_status[cur.y][cur.x]=cur.color;
		}
		lineFull();
		localStorage.setItem("tetris_status",JSON.stringify(tetris_status));
		initBlock();
	}
};

var lineFull=function(){
	for(var i=0;i<TETRIS_ROWS;i++){
		var flag=true;
		for(var j=0;j<TETRIS_COLS;j++){
			if(tetris_status[i][j]==NO_BLOCK){
				flag=false;
				break;
			}
		}
		//if current line is full with block
		if(flag){
			//add 100points to curScore
			curScoreEle.innerHTML=curScore+=100;
			localStorage.setItem("curScore",curScore);
			
				maxScore=localStorage.getItem("maxScore");
				maxScore=maxScore==null?0:maxScore;
				if(curScore>=maxScore)
				{
					localStorage.setItem("maxScore",curScore);	
				}
				maxScore=localStorage.getItem("maxScore");
				maxScoreEle.innerHTML=maxScore;
				
			
			if(curScore>=curSpeed*curSpeed*500){
				curSpeedEle.innerHTML=curSpeed+=1;
				localStorage.setItem("curSpeed",curSpeed);
				clearInterval(curTimer);
				curTimer=setInterval("moveDown();",500/curSpeed);
			}
			//drop all block 
			for(var k=i;k>0;k--){
				for(var l=0;l<TETRIS_COLS;l++){
					tetris_status[k][l]=tetris_status[k-1][l];
				}
			}
			drawBlock();
		}
	}
}

var drawBlock=function(){
	for(var i=0;i<TETRIS_ROWS;i++){
		for(var j=0;j<TETRIS_COLS;j++){
			//paint place with block
			if(tetris_status[i][j]!=NO_BLOCK){
				tetris_ctx.fillStyle=colors[tetris_status[i][j]];
				tetris_ctx.fillRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			}
			else{
				tetris_ctx.fillStyle='white';
				tetris_ctx.fillRect(j*CELL_SIZE+1,i*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
			}
		}
	}
}

window.onkeydown=function(evt){
	switch(evt.keyCode){
		//down
		case 40:
			if(!isPlaying)
				return;
			moveDown();
			break;
		//left
		case 37:
			if(!isPlaying)
				return;
			moveLeft();
			break;
		//right
		case 39:
			if(!isPlaying)
				return;
			moveRight();
			break;
		//up
		case 38:
			if(!isPlaying)
				return;
			rotate();
			break;
	}
}

var moveLeft=function(){
	var canLeft=true;
	for(var i=0;i<currentFall.length;i++){
		//if is most left ,can not move
		if(currentFall[i].x<=0){
			canLeft=false;
			break;
		}
		//if block in most left ,can not move
		if(tetris_status[currentFall[i].y][currentFall[i].x-1]!=NO_BLOCK){
			canLeft=false;
			break;
		}
	}
	//if can left
	if(canLeft){
		//paint origin poisition white
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			tetris_ctx.fillStyle='white';
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		//left move dropping block
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			cur.x--;
		}
		//draw left block to certain color
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			tetris_ctx.fillStyle=colors[cur.color];
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}
}

var moveRight=function(){
	var canRight=true;
	for(var i=0;i<currentFall.length;i++){
		//if is most right ,can not move
		if(currentFall[i].x>=TETRIS_COLS-1){
			canRight=false;
			break;
		}
		//if block in most right ,can not move
		if(tetris_status[currentFall[i].y][currentFall[i].x+1]!=NO_BLOCK){
			canRight=false;
			break;
		}
	}
	//if can right
	if(canRight){
		//paint origin poisition white
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			tetris_ctx.fillStyle='white';
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		//right move dropping block
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			cur.x++;
		}
		//draw right block to certain color
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			tetris_ctx.fillStyle=colors[cur.color];
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}
}

var rotate=function(){
	//define if can ratate
	var canRotate=true;
	for(var i=0;i<currentFall.length;i++){
		var preX=currentFall[i].x;
		var preY=currentFall[i].y;
		//third block is the rotate center,when i==2
		if(i!=2){
			var afterRotateX=currentFall[2].x+preY-currentFall[2].y;
			var afterRotateY=currentFall[2].y+currentFall[2].x-preX;
			//if block is not empty,cannot rotate
			if(tetris_status[afterRotateY][afterRotateX]!=NO_BLOCK){
				canRotate=false;
				break;
			}
			//if block is most left
			if(afterRotateX<0||tetris_status[afterRotateY-1][afterRotateX]!=NO_BLOCK)
			{
				moveRight();
				afterRotateX=currentFall[2].x+preY-currentFall[2].y;
				afterRotateY=currentFall[2].y+currentFall[2].x-preX;
				break;
			}
			if(afterRotateX<0||tetris_status[afterRotateY-1][afterRotateX]!=NO_BLOCK)
			{
				moveRight();
				break;
			}
			//if block is most right
			if(afterRotateX>=TETRIS_COLS-1||tetris_status[afterRotateY][afterRotateX+1]!=NO_BLOCK)
			{
				moveLeft();
				afterRotateX=currentFall[2].x+preY-currentFall[2].y;
				afterRotateY=currentFall[2].y+currentFall[2].x-preX;
				break;
			}
			if(afterRotateX>=TETRIS_COLS-1||tetris_status[afterRotateY][afterRotateX+1]!=NO_BLOCK)
			{
				moveLeft();
				break;
			}
		}
	}
	if(canRotate){
		//draw origin position white
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			tetris_ctx.fillStyle='white';
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
		for(var i=0;i<currentFall.length;i++){
			var preX=currentFall[i].x;
			var preY=currentFall[i].y;
			if(i!=2){
				currentFall[i].x=currentFall[2].x+preY-currentFall[2].y;
				currentFall[i].y=currentFall[2].y+currentFall[2].x-preX;
			}
		}
		for(var i=0;i<currentFall.length;i++){
			if(currentFall[i].x==TETRIS_COLS-1){
				moveRight();
			}
		}
		//paint
		for(var i=0;i<currentFall.length;i++){
			var cur=currentFall[i];
			tetris_ctx.fillStyle=colors[cur.color];
			tetris_ctx.fillRect(cur.x*CELL_SIZE+1,cur.y*CELL_SIZE+1,CELL_SIZE-2,CELL_SIZE-2);
		}
	}
}

