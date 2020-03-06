(function(){
    // 左边类目的模板字符串
    var itemTmpl = '<div class="left-item">'+
                        '<div class="item-text">$getItemContent</div>'+
                    '</div>';

    // 请求数据
    function getList(){
        $.get('././json/food.json',function(data){
            console.log(data);
            window.food_spu_tags = data.data.food_spu_tags || [];
            initContentList(window.food_spu_tags);

            window.ShopBar.changeShippingPrice(data.data.poi_info.shipping_fee || 0);
        })
    }

    // 渲染item内容
    function getItemContent(data){
        if(data.icon){
            return '<img class="item-icon" src='+data.icon+' />'+data.name;
        }else{
            return data.name;
        }
    }

    // 渲染列表
    function initContentList(list){
        list.forEach(function (item,index){
            var str = itemTmpl
                      .replace('$getItemContent',getItemContent(item));

            // 将item数据存放到itemData上面
            var $target = $(str);
            $target.data('itemData',item);

            $('.left-bar-inner').append($target);
        })
        // 默认触发第一个类目的点击事件
        $('.left-item').first().click();

    }

    // 点击左边的列表类目，就把对应的数据传给window.Right.refresh
    function addClick(){
        $('.menu-inner').on('click','.left-item',function(e){
            var $target = $(e.currentTarget);

            $target.addClass('active');
            $target.siblings().removeClass('active');

            // 获取之前存放在itemData上的数据，并传给right.js中的Right.refresh方法。
            window.Right.refresh($target.data('itemData'));
        })
    }

    function init(){
        getList();
        addClick();
    }
    
    init();
    
})()