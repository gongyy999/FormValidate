<p>由于开发环境的多样性，用户通常会有一些特殊的验证需求。基于这个目的，我进行了FormValidate2.0的开发。在2.0版中，不仅内置了很多常用的验证类型，还加入了一些表单 中常用的交互效果。另外，使用者还可以根据自己的需要，随意扩展。比如，我同一页面上有两个不同的form需要验证，并且需要做不同的提示效果。</p>
<p>不多废话，我们进入正题。先简单的介绍下这个插件的使用方法。</p>
<p>1、当然是引入JS了,JQUERY文件我比较喜欢用google的，可以为我的服务器略微的减小点压力。</p>
<div class="box1">
	&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"&gt;&lt;/script&gt;<br />
	&lt;script src="formValidate.js" type="text/javascript" &gt;&lt;/script&gt;</div>
<p>2、设置HTML格式，注意提示内容需要拥有"validateMsg"的class属性，并且在表单元素之后且处在同级。因为提示的时候是通过next来查找容器的。PS：radio类型的验证会先查找低级的label，再搜索与label同级的"validateMsg"。</p>
<pre class="brush:html;">	&lt;form id="myform"&gt;
        &lt;ul&gt;
            &lt;li&gt;
                用户名：&lt;input type="text" name="username" /&gt;
                &lt;span class="validateMsg"&gt;&lt;/span&gt;
            &lt;/li&gt;
            &lt;li&gt;
            	性别：
                &lt;label&gt;&lt;input type="radio" name="sex" value="1" /&gt;男&lt;/label&gt;
                &lt;label&gt;&lt;input type="radio" name="sex" value="2" /&gt;女&lt;/label&gt;
                &lt;span class="validateMsg"&gt;&lt;/span&gt;
            &lt;/li&gt;
            &lt;li&gt; ... &lt;/li&gt;
            &lt;li&gt;
                &lt;input type="submit" value="确定" /&gt;
            &lt;/li&gt;
        &lt;/ul&gt;
    &lt;/form&gt;</pre> <p>3、设置提示内容框样式。错误提示会对提示容器添加名为"prompt-false"的class属性，正确状态会添加名为"prompt-true"的class属性。使用的时候可以根据自己界面的需要自定义设置。以下代码仅供参考。</p>
<div class="box1">
	.prompt-true,.prompt-false{padding:5px;display:inline-block;vertical-align:middle;}<br />
	.prompt-true{border:1px solid #c5def2;}<br />
	.prompt-false{border:1px solid #fb8384;}</div>
<p>4、实例化插件</p>
<pre class="brush:javascript;">
	var f1= new FormValidate({ 
	"username": { "reg": "username","right":"填写完成", "error": "请输入正确的用户名","default":"请输入您的邮箱、昵称或者手机号码",ajax:"http://www.itooy.com/","must":true,"emailAid":true },
	"sex": {"reg":"intege","right":"填写完成", "error": "请选择性别"}
    }, "#myform", callback, true);
</pre>
<p>实例化的时候需要传入4个参数，分别是：</p>
<ul>
	<li>@param json   --验证规则信息，后面会详细的介绍这个参数。</li>
	<li>@param obj    --包裹的对象，通常就是最外层的form了，用jquery选择器的写法传入</li>
	<li>@param callback    --验证通过后执行的回调函数。为function类型时执行，不提交表单，否则提交表单。</li>
	<li>@param breakO    --是否为碰到错误即中止验证，在提交验证的时候会用到。默认为false</li>
	<li>@param emailAid    --邮箱输入辅助DOM，可选。需要用到邮箱输入提示时需带入，用jquery选择器的写法传入即可。DOM需满足一定的结构（下面会提到详情结构）</li>
	<li>@param pwdAid    --密码强度提示助DOM，可选。需要用到密码强度提示时需带入，用jquery选择器的写法传入即可。DOM需满足一定的结构</li>
</ul>
<p>关于验证规则信息这个参数，从上面的实例代码中可以看到，它是一个JSON串。一级的KEY值是表单元素的name属性值。二级的内容如下</p>
<ul>
	<li>reg：验证规则，可以是正则表达式，function对象，也可以是插件内置的一些固定字串。比如说带上"phone"字串，相应的验证规则就是/^(13|15|18|14)[0-9]{9}$/。其他还有邮箱(email)、电话(tel)等</li>
	<li>right：验证正确后显示的提示信息，可选，默认为"可用"</li>
	<li>error：验证错误后显示的提示信息，可选，默认为"该项有误"</li>
	<li>default：默认显示的文字提示内容。可选</li>
	<li>ajax：用于异步验证的接口地址。接口返回值需为带有status和msg属性的JSON数据，如：{"status":true,"msg":"提示内容"}</li>
	<li>must：是否必填，可选，默认为true</li>
	<li>emailAid：是否需要显示邮箱输入辅助，可选。常用于可输入手机或邮箱地址的用户名</li>
</ul>
<h2 class="mt20">通过以上内容，你应该已经了解了FormValidate基本的使用方法，下面再讲些FormValidate特色。</h2>
<h3>多种验证方式结合</h3>
插件本身自带了一些常用的验证方式，比如，邮箱，手机号，身份证等，使用时只需要把reg的值设为相应的字符串就可以了。具体如下
<ul>
	<li>正整数：<b>intege:</b>/^[1-9]\d*$/</li>
	<li>密码 字母+数字：<b>pwd:</b>:/^[a-zA-Z0-9]{6,}$/</li>
	<li>姓名：<b>realname:</b>/^[a-z_\-\u4e00-\u9fa5]{2,10}$/</li>
	<li>颜色：<b>color:</b>/^[a-fA-F0-9]{6}$/</li>
	<li>url：<b>url:</b>/^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-.\/?%&amp;=]*)?$/</li>
	<li>仅中文：<b>chinese:</b>/^[\u4E00-\u9FA5\uF900-\uFA2D]+$/</li>
	<li>仅ACSII字符：<b>ascii:</b>/^[\x00-\xFF]+$/</li>
	<li>邮编：<b>zipcode:</b>/^\d{6}$/</li>
	<li>手机：<b>phone:</b>/^(13|15|18|14)[0-9]{9}$/</li>
	<li>ip地址：<b>ip4:</b>/^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/</li>
	<li>非空：<b>notempty:</b>/^\S+$/</li>
	<li>图片：<b>picture:</b>/(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/</li>
	<li>压缩文件：<b>rar:</b>/(.*)\.(rar|zip|7zip|tgz)$/</li>
	<li>QQ号码：<b>qq:</b>/^[1-9]?[0-9]{6,10}$/</li>
	<li>电话号码(包括验证国内区号,国际区号,分机号)：<b>tel:</b>/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/</li>
	<li>用户名：<b>username:</b>/^\w+$/</li>
	<li>字母：<b>letter:</b>/^[A-Za-z]+$/</li>
	<li>年龄：<b>age:</b>/^[1-9]?[0-9]?$/</li>
	<li>验证码：<b>checkcode:</b>/^[a-zA-Z0-9]{4}$/</li>
	<li>日期：<b>date:</b>/^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/</li>
	<li>时间：<b>time:</b>/^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/</li>

</ul>
<p>如果以上没有你所需要的正则验证规则，你可以把reg的值直接设为你所需要的正则表达式。此外，FormValidate扩展了一些常用又相对复杂的验证类型。比如精准的身份证验证(isCardID)，弱密码验证(pwdExp)等。只需要把reg值设为相应的字串就可以了</p>
<p>如果需要进行其他比较复杂的验证规则，可以把reg的值设为一个function对象，在该function对象中接收输入值，并对该值进行验证，并且返回json串(格式与AJAX接口相同)。</p>
<p>另外有个重复密码的验证，也是常用又比较特殊的。在FormValidate里，如果要对重复密码进行验证，reg值就要设为"conpwd"，并且再添加一个key为"pwdDom"，值为密码输入框的JQUERY对象。</p>
<pre class="brush:html;">	//html代码
	&lt;form action="" id="myform"&gt;
		用户名：&lt;input type="text" name="username" /&gt;
		密码：&lt;input type="password" name="pwd" /&gt;
		确认密码：&lt;input type="passowrd" name="conpwd" /&gt;
	&lt;/form&gt;
	//插件调用方法
	var f1= new FormValidate({
	"username": { "reg": getUsername,"error": "请输入正确的用户名" },
	"pwd": { "reg": "username","error": "请输入您的密码" },
	"conpwd": { "reg": "conpwd","pwdDom":"input[name='conpwd']", "error": "二次输入的密码不一致" }
    }, "#myform", null, true);

    function getUsername(){
		//运算代码
		return {"status":true,"msg":"提示内容"};
    };
 </pre>
 <h3>自定义扩展提示方式</h3>
<p>有的时候会出现这种情况，在同一页面中，我们需要对多个表单进行单独验证，并且验证的提示内容界面都不相同。这时，我们可以重写实例化对象的msg方法来实现。例如</p>
<pre class="brush:javascript;">
	var f1=new FormValidate();
	var f2=new FormValidate();
	 /*
	 * @param obj    --验证对象
	 * @param status    --验证结果，通常为true或false
	 * @param msg    --提示内容
	  +----------------------------------------------------------
	 */
	f1.msg=function(obj, status, msg){
		alert(msg);
	}
</pre>
<p>通过以上代码修改f1实例化的原型后，验证结果就会直接以alert的方式做出提示。而f2保持默认的提示方式。</p>
<p>基于该原理，FormValidate中的regex(自带正则)、ajax(异步验证)等方法，都可以通过该方法来重写。</p>
<h3>邮箱输入辅助</h3>
<p>邮箱输入也是一种常用的优化体验的方式。考虑到需要用到该功能不一定只能输邮箱。有时候我们需要一个输入框即能输入手机号，又可以输入邮箱。比如目前大部分网站的用户名都有这样的需求。所以2.0改变了原先的默认在输入邮箱时做提示的方法。现在用该功能，需要在相应的二级JSON中加入emailAid:true。提示显示也从原先一输入就提示改为输入@符号时才会把输入辅助框显示出来。所以，你可以实现在输入密码时来个邮箱提示的奇葩需求。</p>
<p>顺便提一下，对邮箱格式的验证，FormValidate自带了email和emailExp</p>
<ol>
	<li>1、reg值为email,或者emailExp。email和emailExp的区别是email只进行常规的正则验证，emailExp则进一步的对不同的邮箱类型进行验证。比如126邮箱前缀是6至18位，sina的邮箱则是4至16位等等。</li>
	<li>2、在html代码中存在id为mail_list的DOM元素，并设为绝对定位，FormValidate对计算输入框位置并定位邮箱辅助框，代码结构如下：</li>
</ol>
<pre class="brush:html">
	&lt;div id="mail_list"&gt;
        &lt;p&gt;请选择邮箱&lt;/p&gt;
        &lt;ul&gt;
            &lt;li&gt;&lt;span&gt;&lt;/span&gt;&lt;em&gt;@qq.com&lt;/em&gt;&lt;/li&gt;
            &lt;li&gt;...&lt;/li&gt;
            &lt;li&gt;&lt;span&gt;&lt;/span&gt;&lt;em&gt;@189.cn&lt;/em&gt;&lt;/li&gt;
        &lt;/ul&gt;
    &lt;/div&gt;
</pre>

<h3>密码强度提示</h3>
<p>该功能也是提升体验的常用功能，FormValidate把密码分为弱、中、强三个等级。使用方法类似于邮箱辅助功能:</p>
<ol>
	<li>1、设置reg值为pwdExp。在pwdExp的提示内容是被写死的，如有需要可以自行改写pwdExp，以达到自己想要的效果。</li>
	<li>1、在html代码中存在id为PwdStatus的DOM元素。代码结构如下：</li>
</ol>
<pre class="brush:html">
	&lt;div id="PwdStatus" class="PwdStatus" &gt;
	    &lt;span class="s1"&gt;弱&lt;/span&gt;
	    &lt;span class="s2"&gt;中等&lt;/span&gt;
	    &lt;span class="s3"&gt;强&lt;/span&gt;
	&lt;/div&gt;
</pre>

<h3>placeholder属性兼容扩展</h3>
<p>placeholder即占位符。是在HTML5中新增的功能。在输入框中显示提示内容，在输入时隐藏。目前除了IE10以下版本的IE系列浏览器，其他主流浏览器都支持该属性。使用该属性，可以有效的减少用户输入障碍。</p>
<p>FormValidate中对IE10以下浏览器进行了placeholder支持。使用是需要在输入框中添加placeholder的class值，并且设置placeholder属性的值。FormValidate会把placeholder的值写入value中，在获取焦点时清除。提交表单前，也会把value等于placeholder属性的值清除。无焦点的状态下，表单元素会获取class为值placeholder的样式。可根据需要设置placeholder的样式，一般用来改变文字颜色。在获得焦点时会移除该class值。目前该class值还没写入配置内。以后会考虑由配置的方便带入。</p>
<p>由于是使用写入value的方法来实现，对type为password的input框无法支持。因为password类型的输入框的value值是以"*"来显示的。以之后的版本中，我会用生成带有提示内容的容器，定位到password输入框上面的方式来实现。这是我目前想到的唯一方法。</p>
<h3>未来优化方向</h3>
<p>FormValidate只是我为了满足日常工作需要的一个产物。还有很多有待改善的地方。例如：</p>
<ul>
	<li>本人技术水平有限，在执行效率上还有很大的提升空间。</li>
	<li>FormValidate还没有任何的css代码，DEMO的只做参考，后续应该会做几套不同风格的UI界面提供使用。</li>
	<li>...</li>
</ul>
<p>你可以<a href="/demo/FormValidate" target="_blank">点击这里</a>查看简单的DEMO，或者<a href="/demo/FormValidate/FormValidate.zip" target="_blank">点击下载</a>DEMO</p>
<p>文章写的不好，如有问题或建议欢迎指教。</p>
