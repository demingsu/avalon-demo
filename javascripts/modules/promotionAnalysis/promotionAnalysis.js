define(['avalon','public','echarts','rtlCalendar','urlMapping','xcConfirm'],function(avalon,public,echarts,rtlCalendar,urlMapping,xcConfirm){
    var publicIE=public._IE;
    if(publicIE){
        if(publicIE<9){
            publicIE=true;
        }else{
            publicIE=false;
        }
    }else{
        publicIE=false
    }
    var vm=avalon.define({
        $id:'promotionAnalysisCtrl',
        createData:{
            yesterday:'',
            last_shop_hour:'',
            last_2hour:'',
            last_shop_hour_end:'',
            yesterday_end:'',
            siteList:[],
            tableList:[],
            modalList:[],
            yearList:[],  //年份选择下拉框
            yearStr:''  //选择的年份
        },
        yearJson:{
            sku:'',
            site:'',
            years:''
        },
        promoBlue:[],
        promoRed:[],
        promoYellow:[],
        autoCompleteArray:[],
        site:{
            siteCode:'',
            siteName:''  //这个字段暂时留着,怕以后有用
        },
        /*促销档期销售曲线*/
        promotionChart:function(x_data,data){
            $('#promotionChart').html('');
            var promotionChart = echarts.init(document.getElementById('promotionChart'));
            var option={
                color:['#5584ff','#d05454','#ffe161'],
                tooltip : {
                    trigger: 'axis',
                    formatter:function(params){
                        var data=params;
                        var str='';
                        if(data instanceof Array){
                            str=params[0].name+'<br/>';
                            for(var i=0;i<data.length;i++){
                                str+='销售额 : '+data[i].data+'<br/>';
                            }
                        }else{
                            str='促销区间:'+data.data.promo_startdate+'至'+data.data.promo_enddate;
                        }
                        return str;
                    }
                },
                grid: {
                    top:40,
                    left: 80,
                    right: 50,
                    bottom: 70
                },
                xAxis: {
                    name:'天',
                    nameTextStyle:{
                        color:'#222'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#d4dbe2'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#8694B0'
                        }
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#d4dbe2',
                            type: 'dashed'
                        }
                    },
                    type: 'category',
                    data: x_data
                },
                yAxis: {
                    name: '销售额(千元)',
                    nameTextStyle:{
                        color:'#222'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#d4dbe2'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#8694B0'
                        }
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#d4dbe2',
                            type: 'dashed'
                        }
                    },
                    type: 'value'
                },
                dataZoom: {
                    show:true,
                    start:0,
                    end:30
                },
                series:data
            };
            promotionChart.setOption(option, true);
            promotionChart.on('click', function(params){
                if (params.componentType == 'markLine') {
                    var topic=params.data.topic;
                    var topicStr='';
                    for(var attr in topic){
                        topicStr+=attr+',';
                    }
                    topicStr=topicStr.substr(0,topicStr.length-1);
                    if(params.color=='#5584ff'){  //蓝色
                        vm.promoBlue=[
                            params.data.year,
                            params.data.promo_startdate+'至'+params.data.promo_enddate,
                            topicStr,
                            params.data.promo_price,
                            params.data.promo_saleamt,
                            params.data.later1week_saleamt,
                            params.data.pre1week_saleamt
                        ];
                    }
                    if(params.color=='#d05454'){  //红色
                        vm.promoRed=[
                            params.data.year,
                            params.data.promo_startdate+'至'+params.data.promo_enddate,

                            topicStr,
                            params.data.promo_price,
                            params.data.promo_saleamt,
                            params.data.later1week_saleamt,
                            params.data.pre1week_saleamt
                        ];
                    }
                    if(params.color=='#ffe161'){  //黄色
                        vm.promoYellow=[
                            params.data.year,
                            params.data.promo_startdate+'至'+params.data.promo_enddate,
                            topicStr,
                            params.data.promo_price,
                            params.data.promo_saleamt,
                            params.data.later1week_saleamt,
                            params.data.pre1week_saleamt
                        ];
                    }
                }
            });
            $(window).resize(function(){
                promotionChart.resize();
            });
        },
        initFunc:function(){
            public.showLoading();
            /*数据重置*/
            vm.promoBlue=[];
            vm.promoRed=[];
            vm.promoYellow=[];
            $.when(
                $.ajax({
                    url:urlMapping['get_compass_time'],
                    type:'get',
                    dataType:'json',
                    data:{}
                }),
                $.ajax({
                    url:urlMapping['get_complete_site'],
                    type:'get',
                    dataType:'json',
                    data:{}
                })
            ).done(function(response1,response2){
                var data1=response1[0],data2=response2[0];
                /*请求日期*/
                vm.createData.yesterday=data1.yesterday;
                vm.createData.last_shop_hour=data1.last_shop_hour;
                vm.createData.last_2hour=data1.last_2hour;
                vm.createData.last_shop_hour_end=data1.last_shop_hour_end;
                vm.createData.yesterday_end=data1.yesterday_end;
                var yearStr=data1.yesterday;
                yearStr=yearStr.split('-')[0];
                vm.createData.yearList=[];  //我干,这里要清理一次,不然年份会重复累积,为毛
                for(var i=2016;i<=yearStr;i++){
                    vm.createData.yearList.push(i+'年');
                }
                /*请求门店*/
                vm.createData.siteList=data2;
                /*请求数据*/
                $.ajax({
                    url:urlMapping['get_pro_top'],
                    type:'get',
                    dataType:'json',
                    data:{
                        hour:data1.last_shop_hour
                    },
                    success:function(data){
                        public.closeLoading();
                        if(data){
                            vm.createData.tableList=data;
                            public.nodeReady({
                                elId:'promotionChart',
                                callback:function(){
                                    /*年份输入框重置*/
                                    $('#promoTimeInput').val('');
                                    /*选择年份显示消失*/
                                    $('body').on('click',function(){
                                        $('.rtl-drop-down-year').hide(0);
                                        $('.rtl-menu-box').hide(0);
                                    });
                                    $('#promoTimeInput').off('click').on('click',function(e){
                                        $('.rtl-drop-down-year').slideToggle(0);
                                        var $event=e || window.event;
                                        $event.stopPropagation();
                                    });
                                    $('.rtl-drop-down-year').on('click',function(e){
                                        var $event=e || window.event;
                                        $event.stopPropagation();
                                    });
                                    /*实时商品排行榜名称过长显示*/
                                    $('[data-toggle="tooltip"]').tooltip();
                                    vm.promotionChart([0],[0]);
                                    /*选择门店弹窗显示消失*/
                                    $('#siteChoice').off('click').on('click',function(e){
                                        $('#allSite').prop('checked',false);
                                        $(this).val('');
                                        $('#siteInputBox').val('');
                                        vm.autoCompleteArray=[];
                                        $('.rtl-menu-box').slideToggle(0);
                                        var $event=e || window.event;
                                        $event.stopPropagation();
                                    });
                                    $('.rtl-menu-box').on('click',function(e){
                                        var $event=e || window.event;
                                        $event.stopPropagation();
                                    });
                                }
                            });
                        }else{
                            public.closeLoading();
                            window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                        }
                    },
                    error:function(){
                        public.closeLoading();
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                });
            }).fail(function(){
                public.closeLoading();
                window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
            });
        },
        sortEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var tableList=vm.$model.createData.tableList;
            if($target.hasClass('desc')){
                vm.createData.tableList=tableList.sort(function(a,b){
                    return Math.abs(a.rank_change)-Math.abs(b.rank_change);
                });
                $target.removeClass('desc').addClass('asc');
            }else if($target.hasClass('asc')){
                vm.createData.tableList=tableList.sort(function(a,b){
                    return Math.abs(b.rank_change)-Math.abs(a.rank_change);
                });
                $target.removeClass('asc').addClass('desc');
            }else{
                vm.createData.tableList=tableList.sort(function(a,b){
                    return Math.abs(b.rank_change)-Math.abs(a.rank_change);
                });
                $target.addClass('desc');
            }
        },
        /*显示详情*/
        seeDetails:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var sku=$target.parent().siblings('.good-sku').text();
            var promo_id=$target.parent().siblings('.promo-id').text();
            $('.promotionModalSort').removeClass('desc asc');
            $.ajax({
                url:urlMapping['get_pro_site'],
                type:'get',
                dataType:'json',
                data:{
                    sku:sku,
                    promo_id:promo_id,
                    hour:vm.$model.createData.last_shop_hour
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.createData.modalList=data;
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*详情表格排序*/
        modalSortEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var modalList=vm.$model.createData.modalList;
            if($target.hasClass('desc')){
                vm.createData.modalList=modalList.sort(function(a,b){
                    return Math.abs(a.rank_change)-Math.abs(b.rank_change);
                });
                $target.removeClass('desc').addClass('asc');
            }else if($target.hasClass('asc')){
                vm.createData.modalList=modalList.sort(function(a,b){
                    return Math.abs(b.rank_change)-Math.abs(a.rank_change);
                });
                $target.removeClass('asc').addClass('desc');
            }else{
                vm.createData.modalList=modalList.sort(function(a,b){
                    return Math.abs(b.rank_change)-Math.abs(a.rank_change);
                });
                $target.addClass('desc');
            }
        },
        /*自动联想*/
        autoEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $val= $.trim($target.val());
            var completeArray=vm.$model.createData.siteList;
            vm.autoCompleteArray=[];
            if($val==''){
                return false;
            }
            for(var i=0;i<completeArray.length;i++){
                if(vm.$model.autoCompleteArray.length<10){
                    if(completeArray[i][0].match($val)!=null || completeArray[i][1].match($val)!=null){
                        vm.autoCompleteArray.push({
                            code:completeArray[i][0],
                            name:completeArray[i][1]
                        });
                    }
                }
            }
        },
        /*选择单个门店*/
        setSiteOne:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $text=$target.text();
            $('#siteChoice').val($text);
            setTimeout(function(){
                $('.rtl-menu-box').hide(0);
            },200);
            vm.site.siteCode=$target.attr('value');
        },
        /*选择年份*/
        chooseYear:function(){
            var that=$(this);
            var $target=that.find('input');
            var yearStr=vm.$model.createData.yearStr;
            yearStr=yearStr.split(',');
            if(yearStr.length==1 && yearStr[0]==''){
                yearStr=[];
            }
            var $state=$target.prop('checked');
            if(yearStr.length>=3 && !$state){
                window.wxc.xcConfirm('最多选择3个年份', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            if($state==true){
                $target.prop('checked',false);
                yearStr.splice(that.find('span').text(),1);
            }else{
                $target.prop('checked',true);
                yearStr.push(that.find('span').text());
            }
            vm.createData.yearStr=yearStr.join(',');
        },
        /*查询年数据*/
        seeYearChart:function(){
            var sku= $.trim($('#promoSku').val());
            var site= vm.$model.site.siteCode;
            var promoTime= $.trim($('#promoTimeInput').val());
            if(sku==''){
                window.wxc.xcConfirm('请输入商品SKU', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            if(site==''){
                window.wxc.xcConfirm('请选择门店', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            if(promoTime==''){
                window.wxc.xcConfirm('请选择年份', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            /*同步数据*/
            var years=promoTime;
            years=years.split(',');
            vm.yearJson.sku=sku;
            vm.yearJson.site=site;
            vm.yearJson.years=years;  //英文逗号
            var yearStr='';
            for(var i=0;i<years.length;i++){
                yearStr+='&years='+years[i].substr(0,4);
            }
            $.ajax({
                url:urlMapping['get_promo_year']+'?sku='+sku+'&site='+site+yearStr,
                type:'get',
                dataType:'json',
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        if(data.sku_name==false){
                            window.wxc.xcConfirm('查无此商品SKU或商品SKU不属于此供商卡号', window.wxc.xcConfirm.typeEnum.warning);
                            return false;
                        }
                        /*坑爹的数据结构来了*/
                        var allData=data;
                        var length=data.years.length;
                        var colorArr=['#5584ff','#d05454','#ffe161'];
                        var shadowArr=['#cedcff','#d05454','#ffe887'];
                        var markLineY=['75%','70%','65%'];
                        var seriesData=[];
                        var promotionOne=[],markLineArr=[];
                        for(var i=0;i<length;i++){
                            markLineArr=[];  //每个年份数组重置
                            promotionOne=allData.years[i].promotions;
                            for(var j=0;j<promotionOne.length;j++){
                                markLineArr.push([{
                                    lineStyle: { normal: { color: colorArr[i],width:2} },
                                    coord: [promotionOne[j].promo_startdate],
                                    y:markLineY[i],
                                    promo_plan:promotionOne[j].promo_plan,  //促销档期号
                                    topic:promotionOne[j].topic,  //促销主题
                                    year:promotionOne[j].year,  //促销年份
                                    promo_price:promotionOne[j].promo_price,  //促销期间定价
                                    promo_saleamt:promotionOne[j].promo_saleamt,  //促销期间销售额
                                    promo_startdate:promotionOne[j].promo_startdate,  //促销开始日期
                                    promo_enddate:promotionOne[j].promo_enddate,  //促销结束日期
                                    later1week_saleamt:promotionOne[j].later1week_saleamt,  //促销前1周销售额
                                    pre1week_saleamt:promotionOne[j].pre1week_saleamt,  //促销后1周销售额
                                    promo_period:promotionOne[j].promo_period  //促销周期
                                },{
                                    coord: [promotionOne[j].promo_enddate],
                                    y:markLineY[i]
                                }]);
                            }
                            seriesData.push({
                                type: 'line',
                                name:data.years[i].year,
                                smooth:true,
                                areaStyle:{
                                    normal:{
                                        width:4,
                                        color: publicIE?shadowArr[i] : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                                                offset:0,
                                                color:colorArr[i]
                                            },{
                                                offset:1,
                                                color:'rgba(255,255,255,0.5)'
                                            }]
                                        )
                                    }
                                },
                                data:allData.years[i].saleamts,
                                markLine: {
                                    symbol: 'circle',
                                    symbolSize: 5,
                                    lineStyle: { normal: { type: 'solid' } },
                                    label: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: markLineArr
                                }
                            });
                        }
                        vm.promotionChart(data.dates,seriesData);
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*预测*/
        goForecast:function(){
            window.wxc.xcConfirm('暂不支持', window.wxc.xcConfirm.typeEnum.error);
        }
    });
    return vm;
});