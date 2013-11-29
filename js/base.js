

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}


//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}



jQuery.fn.extend({
    tabs: function(current) {  //tab插件
        if(current){
            $(this).find("li").eq(current).addClass("current").siblings("li").removeClass("current").parents(".tabs-title").siblings("div.tab").hide().eq(current).show();
            return ;
        }
        $(this).find("li").each(function(i) {
            $(this).click(function() {
                $(this).addClass("current").siblings("li").removeClass("current").parents(".tabs-title").siblings("div.tab").hide().eq(i).show().removeClass("hide-v");
                
            })
        })
    },

    popUp: function(obj,time) {  //信息提示插件
        var sm;
        time=time==0?800:time;
        $(this).hover(function() {
            clearTimeout(sm);
            $(obj).show("fast");
        }, function() {
            sm = setTimeout(function() {
                $(obj).hide("fast");
            }, time);
        })
        $(obj).mouseover(function(){
            clearTimeout(sm)
        }).mouseout(function(){
            sm = setTimeout(function() {
                $(obj).hide("fast");
            }, time);
        });
    },
    myPosition: function(left, top) {       //简单定位插件，调用元素需要设置绝对定位
        left = left == "center" ? $(window).scrollLeft() + ($(window).width() - $(this).width()) / 2 : left;
        top = top == "center" ? $(window).scrollTop() + ($(window).height() - $(this).height() - 50) / 2 : top;
        $(this).css({
            'top': top,
            'left': left,
            'z-index':"999"
        });
    }
})