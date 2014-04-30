
 /*
 * 表单验证对象构造函数
 * @author GongYunyun(gongyy999@126.com)
 * @date    2014-04-30 11:03
 * @version V2.4
  +----------------------------------------------------------
 * @param json   --验证规则信息
 * @param obj    --验证对象
 * @param callback    --验证通过后执行回调函数
 * @param breakO    --是否为碰到错误即中止验证
 * @param emailAid    --邮箱辅助DOM
 * @param pwdAid    --密码辅助DOM
  +----------------------------------------------------------
 */

function FormValidate(json,obj,callBack,breakO,emailAid,pwdAid){
    this.breakO=breakO || false;    //是否为碰到错误即中止验证
    this.json=json ||[];
    this.obj=$(obj) ||$("body");
    this.callBack=callBack || null;
    this.emailListDom=emailAid?$(emailAid):$("#mail_list");  //邮箱提示容器
    this.pwdStatusDom=emailAid?$(pwdAid):$("#PwdStatus");  //密码提示容器

    this.placeholderClass="placeholder";    //兼容性placeholder实现时，默认输入框class样式继承
    this.placeholder='placeholder' in document.createElement('input');
    this.result={};//用于信息提示

    var _this=this;
    /**对象submit事件绑定**/
    this.obj.submit(function() {
        var status = true,
            input=[],
            arr={};
        for (var key in json) {
            input[key] = _this.obj.find(":input[name=" + key + "]");
            if(input[key].length===0){
                continue ;
            };
            if(!_this.verification(input[key],key)){    //常规验证
                status=false;
                if(_this.breakO&&_this.json[key]['must']!==false){  //是否中止
                    if(input[key].val()==""){
                        input[key].focus();
                    }
                    break;
                };
            };
            arr[key]=input[key].val();
        };
        /**对象提交时去除placeholder属性值**/
        if(status&&!_this.placeholder){
            for (var key in input) {
                if(input[key].attr("placeholder")!="undefined"&&input[key].val()==input[key].attr("placeholder")){
                    input[key].val("");
                }
            };
        };
        
        if (status && typeof _this.callBack === "function") {
            _this.callBack(arr);
        } else if (status) {
            return true;
        };
        return false;
    });

    /*绑定事件至外层容器，减少事件绑定*/
    this.obj.bind("focusin",function(e){
        var obj = $(e.target);
        var name=obj.attr("name");
        if(typeof(name)!="undefined"&&typeof(_this.json[name])!="undefined"){
            _this.msg(obj,"def",typeof(_this.json[name]['default'])!="undefined"?_this.json[name]['default']:"");   //提示default信息
        };
    }).bind("focusout",function(e){
        var obj = $(e.target);
        var name=obj.attr("name");
        if(typeof(name)!="undefined"&&typeof(_this.json[name])!="undefined"&&!_this.json[name]['emailAid']){
            _this.verification(obj,name);   //进行验证
        };
    })

    /*初始化界面*/
    for (var key in this.json) {
        //设置默认值
        this.json[key]["must"]=this.json[key]["must"]===false?false:true;
        this.json[key]["default"]=typeof(this.json[key]["default"])=="undefined"?"":this.json[key]["default"];
        this.json[key]["error"]=typeof(this.json[key]["error"])=="undefined"?"该项有误":this.json[key]["error"];
        this.json[key]["right"]=typeof(this.json[key]["right"])=="undefined"?"可用":this.json[key]["right"];

        var input = this.obj.find(":input[name="+key+ "]");
        if(this.json[key]['default']!=""){
            this.msg(input,"def",this.json[key]['default']);
        };
        if(!this.placeholder&&typeof(input.attr("placeholder"))!="undefined"){
            this.placeholderFn(input);  //placeholder属性扩展
        };

        if(this.json[key]["emailAid"]&&typeof(this.emailListDom[0])!="undefined"){    //email类型输入辅助
            this.emailList(input,key);
        };
    };

}

FormValidate.prototype.regex = {
    intege:/^[1-9]\d*$/,                  //正整数
    num:/^[1-9]\d*|0$/,                   //正数（正整数 + 0）
    pwd:/^[a-zA-Z0-9_\[\^`~!@#$%^&*()+=|\\\]\[\{\}:;',.<>\?]{6,20}$/,                   //密码
    realname : /^[a-z_\-\u4e00-\u9fa5]{2,10}$/,                       //姓名
    color:/^[a-fA-F0-9]{6}$/,               //颜色
    url:/^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-.\/?%&=]*)?$/,    //url
    chinese:/^[\u4E00-\u9FA5\uF900-\uFA2D]+$/,                  //仅中文
    ascii:/^[\x00-\xFF]+$/,               //仅ACSII字符
    zipcode:/^\d{6}$/,                     //邮编
    phone:/^(13|15|18|14)[0-9]{9}$/,               //手机
    ip4:/^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/,  //ip地址
    notempty:/^(.|\n)+$/,                      //非空
    picture:/(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/,   //图片
    rar:/(.*)\.(rar|zip|7zip|tgz)$/,                               //压缩文件
    qq:/^[1-9]?[0-9]{6,10}$/,               //QQ号码
    tel:/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/,   //电话号码的函数(包括验证国内区号,国际区号,分机号)
    username:/^(([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,6}){1,2}))|((13|15|18|14)[0-9]{9})$/,                      //用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
    letter:/^[A-Za-z]+$/,                   //字母
    age:/^[1-9]?[0-9]?$/,
    email:/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,6}){1,2})$/,
    checkcode:/^[a-zA-Z0-9]{4}$/,
    date:/^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/,
    time:/^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/
};


FormValidate.prototype.msg=function(obj, status, msg){
    var dom=obj.attr("type")=="radio"?obj.parent("label").siblings(".validateMsg"):obj.nextAll(".validateMsg")
    if (status === "def") {  //显示默认信息
        dom.attr("class","validateMsg").html(msg);
        return true;
    } else if (status) {   //显示正确信息
        dom.addClass("prompt-true").removeClass("prompt-false").html(msg);
        return true;
    } else {      //显示错误信息
        dom.addClass("prompt-false").removeClass("prompt-true").html(msg);
        return false;
    };
}


/**
+----------------------------------------------------------
* @param input   --被验证表单元素
* @param i     --验证信息KEY
+----------------------------------------------------------
*/
FormValidate.prototype.verification=function(input,i){
    var type=input.attr("type"),
     value=null,
     special=["emailExp","conPwd","cardId","pwdExp"];//内置特殊验证类型
    this.result={"status":false,"msg":this.json[i]['error']};

    /*判断radio,checkbox是否选中*/
    if((type=="checkbox"||type=="radio")&&typeof (this.json[i]["reg"]) !== "function"){    
        for(var j=0; j<input.length; j++){
            if(input[j].checked){
                this.result={"status":true,"msg":this.json[i]['right']};
                break;
            };
        };
        this.msg(input,this.result.status,this.result.msg);
        return this.result.status;
    }

    /*进行text,textarea,select类型验证*/
    value=input.val()==input.attr("placeholder")?"":input.val();
    value = $.trim(value);

    if(input.is(":hidden")){ //容器隐藏跳过验证
        return true;
    }else if (value == ""&&this.json[i]['must']!==true) {  //为空且非必填
        this.msg(input,"def",this.json[i]['default']);
        return true;
    } else if(typeof (this.json[i]["reg"]) === "function"){ //自定义function验证
        this.result = this.json[i]["reg"](value);

    } else {  //内置正则或特殊验证
        switch (this.json[i]["reg"]){
            case "emailExp":
                this.result=this.emailExp(value);
                break;
            case "cardId":
                this.result=this.cardId(value);
                break;
            case "pwdExp":
                this.result=this.pwdExp(value);
                break;
            case "conPwd":
                if (value==$(this.json[i]['pwdDom']).val()) {
                    this.result={"status":true,"msg":this.json[i]['right']};
                };
                break;
            default:
                var reg=typeof(this.json[i]["reg"])=="string"?this.regex[this.json[i]["reg"]]:this.json[i]["reg"];
                if(this.regValidate(reg, value)){
                    this.result={"status":true,"msg":this.json[i]['right']};
                };
        }

    }
    if (this.result.status&&typeof(this.json[i]["ajax"])!="undefined"&& this.json[i]["ajax"]!= "") {  //ajax验证
        this.ajax(input, this.json[i]['ajax'], value);
    };
    this.msg(input,this.result.status,this.result.msg);
    return this.result.status;
};

FormValidate.prototype.regValidate=function(patrn, v) {
    if (patrn.test(v)) {
        return true;
    };
    return false;
};


/*异步验证
  +----------------------------------------------------------
 * @param input     --验证对象
 * @param url       --异步验证地址
 * @param value     --待验证的值
  +----------------------------------------------------------
 */
FormValidate.prototype.ajax=function(input, url, value) {
    
    this.msg(input,true,"正在进行异步验证，请稍后...");
    var data={},
        _this=this;
    data[input.attr('name')]=value;
    $.ajax({
        url: url+"?m=" + Math.random(),
        async: false,
        dataType: 'json',
        data:data,
        success: function(data) {
            _this.result=data;
        },
        error: function() {
            _this.result=data;
        }
    })
};


/**身份证验证
  +----------------------------------------------------------
 * @param val     --待验证值
  +----------------------------------------------------------
 */
FormValidate.prototype.cardId=function(sId) {
    var data={"status":true,"msg":"OK"}
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
    var iSum = 0;
    var info = "";
    if (!/^\d{17}(\d|x)$/i.test(sId)){
        return {"status":false,"msg":"你输入的身份证长度有误"}
    };

    if (city[parseInt(sId.substr(0, 2))] == null){
        return {"status":false,"msg":"你的身份证地区有误"}
    };
    sBirthday = sId.substr(6, 4) + "/" + Number(sId.substr(10, 2)) + "/" + Number(sId.substr(12, 2));
    var d = new Date(sBirthday);
    if (sBirthday != (d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate())){
        return {"status":false,"msg":"你的身份证出生日期有误"}
    };
    for (var i = 17; i >= 0; i--){
        iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    };
    if (iSum % 11 != 1){
        return {"status":false,"msg":"你输入的身份证号有误"}
    };
    return data;
}


/**邮箱精准验证
  +----------------------------------------------------------
 * @param val     --待验证值
  +----------------------------------------------------------
 */
FormValidate.prototype.emailExp=function(val){
    var data={"msg":"OK","status":true};
    var reg= {
        "def":/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,6}){1,2})$/,
        "qq.com":/^([1-9]{1}\d{5,11})|([a-z]{1}[a-zA-Z0-9._-]{2,17})$/,
        "vip.qq.com":/^([1-9]{1}\d{5,11})|([a-zA-Z]{1}[a-zA-Z0-9]{3,19})$/,
        "163.com":/^[a-z]{1}[a-zA-Z0-9_]{5,17}$/,
        "126.com":/^[a-z]{1}[a-zA-Z0-9_]{5,17}$/,
        "sohu.com":/^[a-z]{1}[a-zA-Z0-9._-]{3,15}$/,
        "sina.cn":/^[a-z0-9]{1}[a-z0-9_]{3,15}$/,
        "gmail.com":/^[a-z0-9]{1}[a-z0-9.]{1,}$/,
        "msn.com":/^[a-zA-Z0-9._-]{1,}$/
    };
    if (!reg['def'].test(val)) {
        data['msg']="您的邮箱格式不正确！";
        data['status']=false;
        return data;
    };
    var email=val.split("@");
    if(typeof(reg[email[1]])!="undefined"){
        if (!reg[email[1]].test(email[0])) {
            var emailType=/[a-zA-Z0-9]{1,}/.exec(email[1]);
            emailType=emailType=="vip"?"qq":emailType;
            data['msg']="您的"+emailType+"邮箱格式不正确！";
            data['status']=false;
            return data;
        };
    };
    return data;
}


/**email类型输入辅助
  +----------------------------------------------------------
 * @param input     --待输入容器
 * @param i     --验证信息KEY
  +----------------------------------------------------------
 */
FormValidate.prototype.emailList=function(input,i){
    var _this=this;

    //点击选取
    this.emailListDom.find("ul li").click(function(){
        input.val($(this)[0].innerHTML.replace(/<[^>]+>/ig,""));
    });

    input.keyup(function(event){
        var isShow=_this.emailListDom.is(":visible");
        var list=_this.emailListDom.find("li");
        if (isShow&&event.keyCode==13){  //回车选中
            emailChange(input,i);
            return false;
        }else if(isShow&&(event.keyCode==40||event.keyCode==38)){    //上下改变当前选中条目
            var k=0;
            var listVisible=_this.emailListDom.find("ul li:visible");   //符合的条目对象
            listVisible.each(function(i){
                if($(this).hasClass('current')){
                    k=i;
                    return false;
                };
            });
            var curr=event.keyCode==40?((k+1)>=listVisible.length?0:k+1):k-1;
            listVisible.eq(curr).addClass("current").siblings("li").removeClass("current");
            return false;
        }else{ //隐藏不符合的条目
            var email=$(this).val();
            if(email==""){
                _this.emailListDom.hide();
                return false;
            }
            email=email.split("@");
            if(email.length===2&&email[0]!=""){
                _this.emailListDom.show().find("ul li").each(function(){
                    $(this).css("display",$(this).children("em").html().match("@"+email[1])?"block":"none");
                });
                _this.emailListDom.find("ul li:visible:eq(0)").addClass("current").siblings("li").removeClass("current");
                if(_this.emailListDom.find("ul li:visible").length==0){
                    _this.emailListDom.hide();
                    return false;
                }
            };
            _this.emailListDom.find("li").find("span").html(email[0]);
        }
        
    }).focusin(function(){
        var offset=$(this).offset();
        _this.emailListDom.css({"left":offset.left,"top":offset.top+24});
    }).focusout(function(){
        time=setTimeout(function(){
            _this.emailListDom.hide();
            _this.verification(input,i);
        },300);
        
    });

    /**email类型输入选择
      +----------------------------------------------------------
     * @param input     --待输入容器
     * @param i     --验证信息KEY
      +----------------------------------------------------------
     */
    function emailChange(input,i){
        var val=input.val();
        var current=_this.emailListDom.find("li.current");
        if(val==""||typeof(current)=="undefined"){
            return false;
        }
        var email=current[0].innerHTML.replace(/<[^>]+>/ig,"");
        input.val(email);
        _this.emailListDom.hide();
        _this.verification(input,i);
        return ;
    }
}


/**添加对placeholder属性的兼容性支持
  +----------------------------------------------------------
 * @param input     --待获取支持的元素
  +----------------------------------------------------------
 */
FormValidate.prototype.placeholderFn=function(input){
    var _this=this,
        domList=["text","textarea"],    //扩展类型
        val=input.attr("placeholder");
    if(val!=""&&$.inArray(input.attr("type"),domList)>=0){
        input.val(val).addClass(this.placeholderClass).focusin(function(){
            if($(this).val()==val){
                $(this).val("").removeClass(_this.placeholderClass);
            };
        }).focusout(function(){
            if($(this).val()==""&&val!=""){
                $(this).val(val).addClass(_this.placeholderClass);
            };
        });
    };
}





/**密码精准验证
  +----------------------------------------------------------
 * @param val     --待验证值
  +----------------------------------------------------------
 */
FormValidate.prototype.pwdExp=function(val){
    var data={"msg":"填写完成","status":true};
    var lvDicts = new Array("asdfgh","qwerty","zxcvbn","Password","Passwd","Woaini","Iloveyou","Woaiwojia","521521","5201314","7758521","1314520","1314521","520520","201314","211314","7758258","147258369","159357","123456","1234567","12345678","123456789","654321","123123","123321","123abc");

    var  patrn=this.regex.pwd;
    if  (!patrn.exec(val)){
        data['msg']="请输入6至20位字符，中文除外";
        data['status']=false;
        this.pwdStatusDom.attr("class","PwdStatus");
    }else if($.inArray(val,lvDicts)>0){
        data['msg']="密码过于简单，请尝试多种不同字符组合！";
        data['status']=false;
        this.pwdStatusDom.attr("class","PwdStatus");
    }else{
        var level=checkPasswordLevel(val);
        this.pwdStatusDom.attr("class","PwdStatus PwdStatus"+level).show();
    };
    return data;
    /*计算密码强度等级*/
    function checkPasswordLevel(strPassword){
        var result = strPassword.length>6?strPassword.length>10?30:10:0; //长度分值
        var lHave = false;  //是否有字母
        var lAll = false;   //是否有大小写字母
        var capital = strPassword.match(/[A-Z]{1}/);//找大写字母
        var small = strPassword.match(/[a-z]{1}/);//找小写字母

        if ( capital == null && small == null ){
            lHave = false;//没有字母
        }else if ( capital != null && small != null ){
            result += 20;
            lAll = true;
        }else{
            result += 10;
            lHave = true;
        };

        //检查数字
        var num=strPassword.match(/[0-9]/g);
        var numAmount = num===null?0:num.length;     //数字个数
        var numHave = numAmount===0?false:true;
        result += numAmount>0?numAmount.length>2?20:10:0; //分值

        //检查非单词字符
        var other=strPassword.match(/[^a-zA-Z0-9]/g);
        var otherLen = other===null?0:other.length;
        var oHave = otherLen===0?false:true;
        result+=otherLen===0?0:25;

        //检查额外奖励
        if ( lAll && numHave && oHave){
            result += 100;
        }else if (lHave && numHave && oHave){
            result += 60;
        } else if ((lHave && numHave)||lAll||(numHave&&oHave)||(lHave&&oHave)){
            result += 30;
        };
        var level = result>=40?result>75?3:2:1;
        return level;
    };

};


