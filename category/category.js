(function(){
    // 类目的模板字符串
    var itemTmpl = '<div class="category-item">'+
                        '<img class="item-icon" src=$url />'+
                        '<p class="item-name">$name</p>'+
                    '</div>';

    // 渲染category元素
    function initCategory(){
        // 获取category数据
    
        $.get('./json/head.json',function(data){
            // console.log(data);

            var list = data.data.primary_filter.splice(0,8);
            list.forEach(function(item,index){
                var str = itemTmpl.replace('$url',item.url).replace('$name',item.name);

                $('.category-content').append($(str));
            });
        });
    }

    // 绑定item的click事件
    function addClick(){
        $('.category-content').on('click','.category-item',function(){
            alert(1)
        });
    }

    function init(){
        initCategory();
        addClick();
    }

    init();
})()