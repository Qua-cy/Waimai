(function(){
    var itemtmpl_score =  '<div class="comment-score">'+
                        '<div class="left">'+
                            '<span>$comment_score</span>'+
                            '<span>商家评分</span>'+
                        '</div>'+
                        '<div class="center">'+
                            '<div class="food-score">'+
                                '<span>口味</span>'+
                                '<div class="food-star">$food_star</div>'+
                                '<span class="star-score">$food_score</span>'+
                            '</div>'+
                            '<div class="pack-score">'+
                                '<span>包装</span>'+
                                '<div class="pack-star">$pack_star</div>'+
                                '<span class="star-score">$pack_score</span>'+
                            '</div>'+
                        '</div>'+
                        '<div class="line"></div>'+
                        '<div class="right">'+
                            '<span class="delivery-score">$delivery_score</span>'+
                            '<span>配送评分</span>'+
                        '</div>'+
                    '</div>';

    var itemtmpl_count = '<div class="comment-count"></div>';

    var itemtmpl_content = '<div class="comment-content">'+
                                '<div class="comment-detail">'+
                                    '<div class="user-pic">'+
                                        '<img src="$user_pic_url" alt="">'+
                                    '</div>'+
                                    '<div class="user-comment">'+
                                        '<div class="top">'+
                                            '<div class="top-left">'+
                                                '<span>$user_name</span>'+
                                                '<span class="time">$ship_time分钟送达</span>'+
                                            '</div>'+
                                            '<div class="top-right">$getCommentTime</div>'+
                                        '</div>'+
                                        '<div class="middle">'+
                                            '<div>$comment</div>'+
                                            '$comment_pic'+
                                        '</div>'+
                                        '<div class="bottom">'+
                                            '$comment_label'+
                                        '</div>'+
                                        '<div class="store-reply">商家回复：谢谢，我们会继续努力，欢迎下次光临！</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';

    function init(list){
        initCommentScore(list);
        initCommentCount(list);
        initCommentContent(list.comments);
    }

    // 获取数据
    function getCommentList(){
        $.get('./json/comments.json',function(data){
            var list = data.data;
            console.log(list);

            init(list);
        })
    }

    getCommentList();


    // 渲染商家整体评分部分
    function initCommentScore(list){
        var str = itemtmpl_score.replace('$comment_score', list.comment_score)
                .replace('$food_star', new StarScore(list.food_score).getStars())
                .replace('$food_score', list.food_score)
                .replace('$pack_star', new StarScore(list.pack_score).getStars())
                .replace('$pack_score', list.pack_score)
                .replace('$delivery_score', list.delivery_score)

        $('.comment-wrap').append($(str));
    }

    // 渲染评价类型数量按钮
    function initCommentCount(list){
        var pattern = /[^\d]/g;
        var countType = [];
        var count = [];
        var countType1 = list.comment_categories;
        var countList = list.comment_score_type_infos;
        var countType2 = list.labels;
        var str = '';

        countList.forEach(function(item){
            count.push(item.total_count);
        });

        countType1.forEach(function(item){
            countType.push(item.match(pattern).join(''));
        });

        countType2.forEach(function(item){
            countType.push(item.content);
            count.push(item.label_count);
        });

        $('.comment-wrap').append($(itemtmpl_count));
        count.forEach(function(item,index){
            str += '<div class="item">'+countType[index]+'('+item+')</div>'
        });

        $('.comment-count').append($(str));

        commentCountClickEvent(list);
    }

    // 点击评价类型按钮切换active
    function commentCountClickEvent(list) {
        var commentTypeItem = $('.comment-count .item');
        var commentsList = list.comments;

        // 默认‘全部’评价为active
        $(commentTypeItem.first()).addClass('active');
        
        commentTypeItem.on('click', function(ev){
            // 如果重复点击active，直接return掉。
            if(ev.currentTarget.className.indexOf('active') !== -1) return;

            var chooseComments = [];

            // 点击全部
            if(ev.currentTarget.innerHTML.indexOf('全部') !== -1){
                initCommentContent(commentsList);
            }

            // 点击有图评价
            if(ev.currentTarget.innerHTML.indexOf('有图评价') !== -1){
                // 先清空
                chooseComments.splice(0, chooseComments.length);
                $('.comment-content').remove();
                // 筛选包含评论图片的数据放进新数组
                commentsList.map(function(item){
                    if(item.comment_pics != ''){
                        chooseComments.push(item);
                    }
                })
                initCommentContent(chooseComments);
            }

            // 点击好评
            if(ev.currentTarget.innerHTML.indexOf('好评') !== -1){
                // 先清空
                chooseComments.splice(0, chooseComments.length);
                $('.comment-content').remove();
                // 筛选包含评论图片的数据放进新数组
                commentsList.map(function(item){
                    if(item.order_comment_score > 3){
                        chooseComments.push(item);
                    }
                })
                initCommentContent(chooseComments);
            }

            // 点击差评
            if(ev.currentTarget.innerHTML.indexOf('差评') !== -1){
                // 先清空
                chooseComments.splice(0, chooseComments.length);
                $('.comment-content').remove();
                // 筛选包含评论图片的数据放进新数组
                commentsList.map(function(item){
                    if(item.order_comment_score <= 3){
                        chooseComments.push(item);
                    }
                })
                initCommentContent(chooseComments);
                
            }
            

            commentTypeItem.each(function(index, item){
                $(item).removeClass('active');
            })
            $(this).addClass('active');
        })  
    }

    function initCommentContent(list){
        var user_pic_default = 'comment/img/user_pic_default.jpg';

        list.forEach(function(item){
            var str = itemtmpl_content
                        .replace('$user_pic_url', item.user_pic_url == '' ? user_pic_default : item.user_pic_url)
                        .replace('$user_name', item.user_name)
                        .replace('$ship_time', item.ship_time)
                        .replace('$getCommentTime', getCommentTime(item.comment_time))
                        .replace('$comment', item.comment)
                        .replace('$comment_pic', getCommentPic(item.comment_pics) || '')
                        .replace('$comment_label', getCommentLabel(item.comment_labels) || '');

            $('.comment-wrap').append($(str));
        })
    }

    function getCommentTime(time){

        // 获取的一长串数字的时间表示1970年1月1日至今的总毫秒数，一般需要乘以1000；
        var date = new Date(time*1000),
            year = date.getFullYear(),
            month = date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1,
            day = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate();
         
        return year+'-'+month+'-'+day;
    }

    function getCommentPic(picArray){
        var imgStr = '<img src="$comment_pics" alt="">',
            imgTmpl = '';
        if(picArray){
            picArray.forEach(function(item){
                imgTmpl += imgStr.replace('$comment_pics', item.url);
            })
        }
        return imgTmpl;
    }

    function getCommentLabel(labelsArr){
        var commentLabel = '<div class="comment-label">$comment_label</div>',
            labelTmpl = '';
        if(labelsArr){
            labelsArr.forEach(function(item){
                labelTmpl += commentLabel.replace('$comment_label', item.content);
            })
        }
        return labelTmpl;
    }

    // 点击评论类型，筛选评论内容
    // function chooseCommentsContent(data){
    //     // 删除评论内容
        
    // }

})()