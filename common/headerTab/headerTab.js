(function(){
    // 底部导航的模板字符串
    var itemTmpl = '<a class="$key tab-item" href="$key.html">'+
                        '$text'+
                    '</a>';
    
    function init(){
        var items = [{
            key:'menu',
            text:'点菜'
        },{
            key:'comment',
            text:'评价'
        },{
            key:'restaurant',
            text:'商家'
        }];

        var str = '';

        items.forEach(function (item){
            str += itemTmpl.replace(/\$key/g,item.key)
                            .replace('$text',item.text);
        });

        $('.tab-bar').append($(str));

        // 找到当前页面的url来确定key值
        var arr = window.location.pathname.split('/');
        var page = arr[arr.length-1].replace('.html','');

        // 将当前页面对应的key值的a元素设置active的class,$('a.'+page)选中class为page的a标签。
        $('a.'+page).addClass('active');
    }
    init();
})()