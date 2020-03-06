(function(){
    // 类目的模板字符串
    var itemTmpl = '<div class="star-score">$starstr</div>'

    function _getStars(){

        // 获取得分，例如：4.4分
        var _score = this.score.toString();

        // 把分数拆分为数组，[4,4]
        var scoreArray = _score.split('.');

        // 满星个数
        var fullstar = parseInt(scoreArray[0]);

        // 半星个数，只有1个或0个两种
        var halfstar = parseInt(scoreArray[1]) >= 5 ? 1: 0;

        // 0星
        var nullstar = 5 - fullstar - halfstar;

        var starstr = '';

        for(var i = 0; i < fullstar; i++){
            starstr += '<div class="star fullstar"></div>'
        }

        for(var j = 0; j < halfstar; j++){
            starstr += '<div class="star halfstar"></div>'
        }

        for(var k = 0; k < nullstar; k++){
            starstr += '<div class="star nullstar"></div>'
        }

        return itemTmpl.replace('$starstr',starstr);
    }

    window.StarScore = function(score){
        this.score = score || '';
        this.getStars = _getStars;
    }
})()