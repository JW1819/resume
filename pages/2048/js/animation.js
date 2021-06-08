//数字显示的动画
function showNumberWithAnimation(i,j,randNumber){
    var numberCell=$('#number-cell-'+i+'-'+j);
    numberCell.text(randNumber);
    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));

    numberCell.animate({
        width: cellWidth,
        height: cellWidth,
        top: getPosTop(i,j) ,
        left:  getPosLeft(i,j) 
    },500)
}
//移动的动画
function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell=$('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)

    },200);

}