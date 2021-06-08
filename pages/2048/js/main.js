var nums = new Array();//
var score=0;
var hasConflicted = new Array();//是否已叠加，解决重复叠加问题

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
  newgame();  

});
//开始新游戏
function newgame(){
    if(documentWidth>500){
        containerWidth = 500;
        cellWidth = 100;
        cellSpace = 20;
    }else{
        settingForMobile(); 
    }
   

    init();
//随机生成2个数字
    generateOneNumber();
    generateOneNumber();

}

function settingForMobile(){
    $('#header .wrapper').css('width',containerWidth)

    $('#grid-container').css('width',containerWidth-cellSpace*2);
    $('#grid-container').css('height',containerWidth-cellSpace*2);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',containerWidth*0.02);

    $('.grid-cell').css('width',cellWidth);
    $('.grid-cell').css('height',cellWidth);
    $('.grid-cell').css('border-radius',cellWidth*0.06);
}


//初始化页面
function init(){
    //初始化单元格位置
    for (var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridCell=$('#grid-cell-'+i+'-'+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }
    }
//初始化数组底层
for (var i=0;i<4;i++){
    nums[i]=new Array();
    hasConflicted[i]=new Array();
    for(var j=0;j<4;j++){
        nums[i][j]=0;
        hasConflicted[i][j]=false;//false表示未曾叠加过，true表示已经叠加过
        }
    }
//动态初始化上层单元格
updateView();
score=0;
updateScore(score);

}

//更新上层单元格视图
function updateView(){
    
    $(".number-cell").remove();//将上层所有单元格清空，重新初始化

    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $('#grid-container').append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');

            var numberCell=$('#number-cell-'+i+'-'+j+'');
            if(nums[i][j]==0){
                numberCell.css('width','0px');
                numberCell.css('height','0px');
                numberCell.css('top',getPosTop(i,j)+cellWidth*0.5);
                numberCell.css('left',getPosLeft(i,j)+cellWidth*0.5);               
            }else{
                numberCell.css('width', cellWidth);
                numberCell.css('height', cellWidth);
                numberCell.css('top',getPosTop(i,j));
                numberCell.css('left',getPosLeft(i,j));
                numberCell.css('background-color',getNumberBackgroundColor(nums[i][j]));
                numberCell.css('color',getNumberColor(nums[i][j]));
                numberCell.text(nums[i][j]);
            }
            hasConflicted[i][j]=false;//重置叠加状态

            // 移动端尺寸
            $('.number-cell').css('border-radius', cellWidth*0.06);
            $('.number-cell').css('font-size', cellWidth*0.5);
            $('.number-cell').css('line-height', cellWidth+'px');
        }
    }

}

/*
在随机单元格里面生成一个随机数；
1在空余的单元格里面随机找一个
2随机生成一个2或者4
*/
function generateOneNumber(){
    //判断是否有空间，没有直接返回
    if(noSpace(nums)){
        return;
    }
//随机产生一个位置
var count=0;
var temp =new Array();
    for (var i=0;i<4;i++){
        for (var j=0;j<4;j++){
            if(nums[i][j]==0){
                temp[count] = i*4+j;
                count++;
            }
        }
    }
    var pos =Math.floor(Math.random()*count);//[0,1)变成[0,6)的浮点,0-5的整数
    var randx=Math.floor(temp[pos]/4);
    var randy=Math.floor(temp[pos]%4);
//随机一个数字
   var randNum= Math.random()<0.5?2:4;
   //在随机位置上显示随机数字
    nums[randx][randy]=randNum;
    showNumberWithAnimation(randx,randy,randNum);

}

//实现键盘的响应
$(document).keydown(function(event){
//阻止事件的默认行为，比如上下键控制滚动条
    event.preventDefault();


   // console.log(event);
    switch(event.keyCode){
        case 37://left
            //判断是否可以向左移动
            if(canMoveLeft(nums)){
                moveLeft();
                setTimeout(generateOneNumber,200);
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        break;
        case 38://up
            if(canMoveUp(nums)){
                moveUp();
                setTimeout(generateOneNumber,200);
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        break;
        case 39://right
            if(canMoveRight(nums)){
                moveRight();
                setTimeout(generateOneNumber,200);
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        break;
        case 40://down
            if(canMoveDown(nums)){
                moveDown();
                setTimeout(generateOneNumber,200);
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        break;
        default://其他
        break;
        
    }

});


// 实现触摸滑动响应
document.addEventListener('touchstart',function(event){
    // console.log(event);
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;

});
document.addEventListener('touchend',function(event){
    // console.log(event);
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    // 判断滑动的方向
    var datax = endx-startx;
    var datay = endy-starty;
    // 判断滑动距离小于一定值时，不作处理
    if(Math.abs(datax)<documentWidth*0.1 && Math.abs(datay)<documentWidth*0.08){
        return;
    }


    if(Math.abs(datax) >= Math.abs(datay)){ //水平方向移动
        if(datax>0){ // 向右移动
            if(canMoveRight(nums)){
                moveRight();
                setTimeout(generateOneNumber,200);
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        }else{ //向左移动
            if(canMoveLeft(nums)){
                moveLeft();
                setTimeout(generateOneNumber,200);
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        }
        
    }else{ //垂直方向移动
        if(datay>0){ //向下移动
            if(canMoveDown(nums)){
                moveDown();
                setTimeout(generateOneNumber,200);
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        }else{ // 向上移动
            if(canMoveUp(nums)){
                moveUp();
                setTimeout(generateOneNumber,200);
                setTimeout(generateOneNumber,200);
                setTimeout(isGameOver,500);
            }
        }
    }
})




//左移，对每一个左边进行判断，选择落脚点
//落脚2种可能：1.落空的地方，并且中间没有障碍物
//           2落数字一样的地方，并且移动过程红没有障碍物
function moveLeft(){
    for (var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(nums[i][j]!=0){
                for (var k=0;k<j;k++){
                    if(nums[i][k]==0 && noBlockHorizontal(i,k,j,nums)){//第i行的第k-j列是否有障碍物
                        //移动操作
                        showMoveAnimation(i,j,i,k);
                        nums[i][k]=nums[i][j];
                        nums[i][j]=0;
                        break;
                    }  else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        nums[i][k]+=nums[i][j];
                        nums[i][j]=0;
                        //统计分数
                        score+=nums[i][k];
                        updateScore(score);

                        hasConflicted[i][k]=true;//已经叠加
                        break;
                    }  

                }
            }
        }
    }
    //更新页面上的数据，真正显示更新显示移动后的效果
    setTimeout('updateView()',200);
}

function moveRight(){
    for (var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if(nums[i][j]!=0){
                for (var k=3;k>j;k--){
                    if(nums[i][k]==0 && noBlockHorizontal(i,j,k,nums)){//第i行的第j-k列是否有障碍物
                        //移动操作
                        showMoveAnimation(i,j,i,k);
                        nums[i][k]=nums[i][j];
                        nums[i][j]=0;
                        break;
                    }  else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,j,k,nums) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        nums[i][k]+=nums[i][j];
                        nums[i][j]=0;
                        //统计分数
                        score+=nums[i][k];
                        updateScore(score);

                        hasConflicted[i][k]=true;//已经叠加
                        break;
                    }  

                }
            }
        }
    }
    //更新页面上的数据，真正显示更新显示移动后的效果
    setTimeout('updateView()',200);
}

function moveUp(){
    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){
            if(nums[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(nums[k][j]==0 && noBlockVertical(j,k,i,nums)){//第J列的第k-i行之间是否有障碍物
                        showMoveAnimation(i,j,k,j);
                        nums[k][j]=nums[i][j];
                        nums[i][j]=0;
                        break;
                    }else if(nums[k][j]==nums[i][j] && noBlockVertical(j,k,i,nums) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        nums[k][j]+=nums[i][j];
                        nums[i][j]=0;
                        score+=nums[k][j];
                        updateScore(score);

                        hasConflicted[k][j]=true;
                        break;
                    }
                }
            }

        }
    }
    setTimeout('updateView()',200);

}

function moveDown(){
    for (var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if(nums[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(nums[k][j]==0 && noBlockVertical(j,i,k,nums)){
                        showMoveAnimation(i,j,k,j);
                        nums[k][j]=nums[i][j];
                        nums[i][j]=0;
                        break;
                    }else if(nums[k][j]==nums[i][j] && noBlockVertical(j,i,k,nums) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        nums[k][j]+=nums[i][j];
                        nums[i][j]=0;
                        score+=nums[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        break;
                    }
                }
            }
        }
    }
    setTimeout(updateView,200);
}