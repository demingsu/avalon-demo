require.config({
    baseUrl: 'javascripts/',
    paths: {
        avalon: 'core/avalon/avalon',
        mmHistory: 'core/avalon/mmHistory',
        mmRouter: 'core/avalon/mmRouter',
        domReady: 'core/requirejs/domReady',
        jquery: 'core/jquery/jquery.min',
        jqCookie: 'core/jquery/jquery.cookie',
        bootstrap: 'core/bootstrap/bootstrap',
        text: 'core/requirejs/text',
        echarts: 'core/echarts/echarts.min',
        urlMapping: '../UrlMapping',
        public: 'core/public',
        rtlCalendar: 'core/rtl/RtlCalendar',
        rtlPage: 'core/rtl/RtlPaging',
        rtlLoad: 'core/rtl/RtlLoading',
        xcConfirm: 'core/xcConfirm/xcConfirm'
    },
    shim: {
        avalon: {
            exports: 'avalon'
        },
        mmHistory: {
            deps: ['avalon'],
            mmHistory: 'mmHistory'
        },
        mmRouter: {
            deps: ['mmHistory'],
            mmRouter: 'mmRouter'
        },
        domReady: {
            deps: ['mmRouter'],
            domReady: 'domReady'
        },
        jquery: {
            exports: 'jquery'
        },
        jqCookie: {
            deps: ['jquery'],
            exports:'jqCookie'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        echarts: {
            exports: 'echarts'
        },
        urlMapping: {
            exports: 'urlMapping'
        },
        rtlLoad: {
            deps: ['jquery'],
            exports: 'rtlLoad'
        },
        public: {
            exports: 'public'
        },
        rtlCalendar: {
            exports: 'rtlCalendar'
        },
        rtlPage: {
            exports: 'rtlPage'
        },
        xcConfirm: {
            deps: ['jquery'],
            exports: 'xcConfirm'
        }
    },
    waitSeconds: 0
});

require(['bootstrap', 'domReady!', 'public','urlMapping','xcConfirm','jqCookie'], function(bootstrap,domReady,public,urlMapping,xcConfirm,jqCookie){
    avalon.templateCache.empty = "";
    var vm = avalon.define({
        $id: 'mainBodyCtrl',
        contentPage: 'empty',
        treeData: [
            {
                url: 'home',
                img: 'images/home.png',
                desc: '我的首页'
            },
            {
                url: '',
                img: 'images/menu_jingyingcanmou.png',
                desc: '经营参谋',
                list:[
                    {url: 'businessIndicators', desc: '经营指标'},
                    {url: 'commodityAnalysis', desc: '商品分析'},
                    {url: 'customerAnalysis', desc: '顾客分析'},
                    {url: 'promotionAnalysis', desc: '促销分析'},
                    {url: 'competeAnalysis', desc: '竞争分析'}
                ]
            }
            //{
            //    url: '',
            //    img: 'images/menu_zhuantigongju.png',
            //    desc: '专题工具',
            //    list: [
            //        {url: 'forecast', desc: '销量预测'}
            //    ]
            //}
        ],
        vendorList:[],  //供应商卡号列表
        /*计算左导航高度,同时获取用户信息*/
        initFun:function(){
            var lockState= $.cookie('lockState');
            if(lockState!=null){
                if(lockState=='0'){
                    $('#rtlLock').css('display','block');
                }else{
                    $('#rtlLock').css('display','none');
                }
            }
            $.ajax({
                url:urlMapping['get_compass_username'],
                type:'get',
                dataType:'json',
                data:{},
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        $('#rtlLockUserName').text(data.name);
                        public.nodeReady({
                            elId:'compassSidebar',
                            callback:function(node){
                                var $height=$(window).height()-70;
                                $(node).css({
                                    height: $height+'px',
                                    visibility:'visible'
                                });
                                $(window).on('resize', function(){
                                    var $height=$(window).height()-70;
                                    $(node).css({
                                        height:$height+'px'
                                    });
                                });
                            }
                        });
                    }else{
                        window.wxc.xcConfirm('获取用户信息失败', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        treeEvent: function () {
            var that = this;
            var name = that.tagName;
            if (name === 'DIV') {
                $(that).parent().find('.second-list').slideToggle(150, function () {
                    var _this = $(this);
                    if (_this.is(':visible')) {
                        $(that).css({
                            background: 'url("images/menu_sanjiao01.png") no-repeat 170px 18px'
                        });
                    } else {
                        $(that).css({
                            background: 'url("images/menu_sanjiao02.png") no-repeat 170px 18px'
                        });
                    }
                });
                var hasCls = $(that).hasClass('top-list-first');
                if (hasCls) {
                    if(!vm.pageLoadFlag) {
                        vm.pageLoadFlag = true;
                        $('.sidebar').find('.list-blue').removeClass('list-blue');
                        $(that).find('img').attr('src', 'images/home.png');
                        $(that).parent().addClass('list-blue');
                        var $src = 'home';  //设置地址
                        window.location.hash = "#!/" + $src + "&_" + new Date().getTime();  //要加时间戳,不然不触发hash变化
                    }
                }
            }
            if (name === 'LI') {
                if(!vm.pageLoadFlag) {
                    vm.pageLoadFlag = true;
                    $('.sidebar').find('.list-blue').removeClass('list-blue');
                    $('.sidebar').find('.top-list-first img').attr('src', 'images/home_blue.png');
                    $(that).addClass('list-blue');
                    var $src = $(that).attr('data-href');  //设置地址
                    window.location.hash = "#!/" + $src + "&_" + new Date().getTime();  //要加时间戳,不然不触发hash变化
                }
            }
        },
        getVendor:function(){
            $.ajax({
                url:urlMapping['get_vendor_list'],
                type:'get',
                dataType:'json',
                data:{},
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.vendorList=data;
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        lockScreen:function(){
            $.cookie('lockState','0');
            $('#loginInput').val('');
            $('#rtlLock').css('display','block');
        },
        lockLogin:function(){
            var passWord= $.trim($('#loginInput').val());
            if(passWord==''){
                window.wxc.xcConfirm('请输入密码', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            $.ajax({
                url:urlMapping['get_compass_unlock'],
                type:'post',
                dataType:'json',
                data:{
                    passwd:passWord
                },
                success:function(data){
                    if(data.code=='ok'){
                        $.cookie('lockState','1');
                        $('#rtlLock').css('display','none');
                    }else{
                        window.wxc.xcConfirm('密码错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        logout:function(){
            /*清除cookie 这里因为是调用的其他端的cookie,所以要加上域名*/
            document.cookie='vcmserp='+''+';expires=' + new Date(0).toUTCString()+';domain=.wumart.com';
            window.location.href='login.html';
        },
        clearSuggest:function(){
            $('#cfInput2').val('');
            $('#cfInput3').val('');
            $('#cfInput4').val('');
        },
        feedbackEvt:function(){
            var contact= $.trim($('#cfInput2').val());
            var title= $.trim($('#cfInput3').val());
            var content= $.trim($('#cfInput4').val());
            if(contact==''){
                window.wxc.xcConfirm('请输入收件人邮箱', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            if(cfInput2==''){
                window.wxc.xcConfirm('请输入您的电话或邮箱', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            if(title==''){
                window.wxc.xcConfirm('请输入标题', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            if(content==''){
                window.wxc.xcConfirm('请输入发送内容', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            $.ajax({
                url:urlMapping['get_compass_feedback'],
                type:'post',
                dataType:'json',
                data:{
                    contact: contact,
                    title: title,
                    content: content
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        if(data.code=='ok'){
                            $('#closeFeedback').click();
                        }else{
                            window.wxc.xcConfirm('反馈失败', window.wxc.xcConfirm.typeEnum.error);
                        }
                    }else{
                        window.wxc.xcConfirm('反馈失败', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('反馈失败', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        pageLoadFlag: false
    });
    vm.initFun();
    //路由
    function urlCallback(){
        var _path = this.path;
        if(_path.indexOf("/home") == 0){  //我的首页
            require(['./modules/home/home'], function (nowModal) {
                nowModal.initFunc();
                vm.contentPage = './templates/home/home.html';
                vm.pageLoadFlag = false;
            });
        }else if(_path.indexOf("/businessIndicators") == 0){  //经营指标
            require(['./modules/businessIndicators/businessIndicators'], function (nowModal) {
                nowModal.initFunc();
                vm.contentPage = './templates/businessIndicators/businessIndicators.html';
                vm.pageLoadFlag = false;
            });
        }else if(_path.indexOf("/commodityAnalysis") == 0){  //商品分析
            require(['./modules/commodityAnalysis/commodityAnalysis'], function (nowModal) {
                nowModal.initFunc();
                vm.contentPage = './templates/commodityAnalysis/commodityAnalysis.html';
                vm.pageLoadFlag = false;
            });
        }else if(_path.indexOf("/customerAnalysis") == 0){  //顾客分析
            require(['./modules/customerAnalysis/customerAnalysis'], function (nowModal) {
                nowModal.initFunc();
                vm.contentPage = './templates/customerAnalysis/customerAnalysis.html';
                vm.pageLoadFlag = false;
            });
        }else if(_path.indexOf("/promotionAnalysis") == 0){  //促销分析
            require(['./modules/promotionAnalysis/promotionAnalysis'], function (nowModal) {
                nowModal.initFunc();
                vm.contentPage = './templates/promotionAnalysis/promotionAnalysis.html';
                vm.pageLoadFlag = false;
            });
        }else if(_path.indexOf("/competeAnalysis") == 0){  //竞争分析
            require(['./modules/competeAnalysis/competeAnalysis'], function (nowModal) {
                nowModal.initFunc();
                vm.contentPage = './templates/competeAnalysis/competeAnalysis.html';
                vm.pageLoadFlag = false;
            });
        }else if(_path.indexOf("/forecast") == 0){  //销量预测
            require(['./modules/forecast/forecast'], function (nowModal) {
                nowModal.initFunc();
                vm.contentPage = './templates/forecast/forecast.html';
                vm.pageLoadFlag = false;
            });
        }else {  //我的首页
            require(['./modules/home/home'], function (nowModal) {
                nowModal.initFunc();
                vm.contentPage = './templates/home/home.html';
                vm.pageLoadFlag = false;
            });
        }
    }
    avalon.router.get('/*path', urlCallback);
    avalon.history.start();
    avalon.scan(document.body);
});