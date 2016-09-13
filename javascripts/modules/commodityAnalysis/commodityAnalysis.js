define(['avalon','public','echarts','rtlCalendar','rtlPage','urlMapping','xcConfirm'],function(avalon,public,echarts,rtlCalendar,rtlPage,urlMapping,xcConfirm){
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
        $id:'commodityAnalysisCtrl',
        createData:{
            /*自动补全门店数据*/
            completeArray:[],
            /*最新的数据时间*/
            compassTime:{
                last_2hour: '',
                last_shop_hour: '',
                last_shop_hour_end: '',
                yesterday:  '',
                yesterday_end: ''
            },
            myActualGood:'',  //单品实时查询商品名称
            myTrendGood:'',  //商品销售走势商品名称
            emcList:[],  //下拉列表
            merchTop:[],  //今日TOP10 我干 数组必须定义为[],不然有警告
            goodTrend:'',  //商品销售走势
            merchHot:[],  //热销商品排行
            compassAbnormal:'',  //异常商品图表
            abnormalMerch:{
                data:[]  //这里也必须定义 注意字段名和后台字段名一致
            },  //异常商品表格
            brandRank:{  //我的品牌排行表格
                data:[]  //这里也必须定义 注意字段名和后台字段名一致
            },
            trendTimeType:'day',
            hotTimeType:'week',
            brandTimeType:'week',
            trendTimeData:{
                start:'',
                end:'',
                type:''
            },
            hotTimeData:{
                start:'',
                end:'',
                type:''
            },
            brandTimeData:{
                start:'',
                end:'',
                type:''
            },
            brandList:{
                order:'desc',
                sort_by:'amt',
                resize:false
            },
            brandTableTime:{  //用于表格排序,有排序的表格要单独放一个对象来保存不点查询确定的数据
                start:'',
                end:'',
                type:''
            },
            brandPageNow:1,
            trendIndex:0
        },
        autoCompleteArray:[],  //自动联想
        modalAutoCompleteArray:[],  //弹窗自动联想
        goodSkuOrEmc:'emc',  //默认是下拉框
        good:{
            sku:'',
            emc:'',
            typ:'day'
        },
        abnormalModalList:{
            data:[],
            total:'',
            pages:''
        },
        abnormalSku:'',
        abnormalModalPageNow:1,
        abnormalModalResize:false,
        abnormalPercent:'',
        abnormalPageNow:1,
        abnormalResize:false,
        brandPageNow:1,
        site:{
            siteCode:'',
            siteName:''  //这个字段暂时留着,怕以后有用
        },
        modalSite:{
            modalSiteCode:'',
            modalSiteName:''  //这个字段暂时留着,怕以后有用
        },
        topModalSku:'',  //TOP10弹窗
        topModalName:'',  //TOP10弹窗
        topModalSite:'',  //TOP10弹窗
        topModalDate:'',  //TOP10弹窗
        topModalDateType:'',  //TOP10弹窗
        topModalNum:{
            price:'',
            sale:'',
            num:'',
            stock:''
        },
        topModalTable:[],  //TOP10表格弹窗 门店信息
        goodTopNum:{
            price:'',
            sale:'',
            num:'',
            stock:''  //这个字段目前暂时没用了，先保留着吧
        },
        abnormalStatus:'Z',  //异常表格初始status为Z
        abnormalOrder:'desc',  //异常表格初始为降序
        abnormalSort:'site',  //异常表格初始为按门店信息排序
        abnormalModalOrder:'desc',
        abnormalZPercent:'',
        abnormalCPercent:'',
        abnormalGPercent:'',
        abnormalLPercent:'',
        commodityStockChart:function(id,time,data){
            $('#'+id).html('');
            var customerStockChart=echarts.init(document.getElementById(id));
            var option = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter:'{b} {c}'
                },
                grid: {
                    top:0,
                    left: '3%',
                    right: '35',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'value',
                        splitLine:{
                            show:true,
                            lineStyle:{
                                color:'#d4dbe2',
                                type: 'dashed'
                            }
                        },
                        splitNumber:2,
                        axisLine:{
                            show:false,
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
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        axisTick : {
                            show: false
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#d4dbe2'
                            }
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#8694B0'
                            }
                        },
                        data : time
                    }
                ],
                series : [
                    {
                        barMaxWidth:15,
                        type:'bar',
                        itemStyle:{
                            normal:{
                                width:4,
                                color: publicIE?'#e54c3d' : new echarts.graphic.LinearGradient(0,0,0.8,0,[{
                                        offset:1,
                                        color:'#e54c3d'
                                    },{
                                        offset:0,
                                        color:'#fed55d'
                                    }]
                                )
                            }
                        },
                        data:data
                    }
                ]
            };
            customerStockChart.setOption(option);
            $(window).resize(function(){
                customerStockChart.resize();
            });
        },
        goodSaleChart:function(id,time,data){
            $('#'+id).html('');
            var goodSaleChart = echarts.init(document.getElementById(id));
            var option = {
                animation:true,
                color:['#5584ff'],
                tooltip : {
                    trigger: 'axis',
                    formatter:'{a} {c}'
                },
                grid: {
                    top: 30,
                    left: 30,
                    right: 30,
                    bottom: 20,
                    containLabel: true
                },
                xAxis : [
                    {
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
                        type : 'category',
                        boundaryGap : false,
                        data : time
                    }
                ],
                yAxis : [
                    {
                        name:'销售额(千元)',
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
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'销售额',
                        type:'line',
                        smooth:true,
                        areaStyle:{
                            normal:{
                                width:4,
                                color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                                        offset:0,
                                        color:'#5584ff'
                                    },{
                                        offset:1,
                                        color:'rgba(255,255,255,0.5)'
                                    }]
                                )
                            }
                        },
                        data:data
                    }
                ]
            };
            goodSaleChart.setOption(option);
            $(window).resize(function(){
                goodSaleChart.resize();
            });
        },
        goodAbnormalChart:function(data){
            $('#goodTrendChart').html('');
            var goodAbnormalChart = echarts.init(document.getElementById('goodTrendChart'));
            var option = {
                color:['#7d61f3','#859cf3','#fee06b','#ef5255'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}"
                },
                series: [
                    {
                        type:'pie',
                        radius: ['70%', '90%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                formatter:function(data){
                                    return data.name.split(' ')[0];
                                },
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:data
                    }
                ]
            };
            goodAbnormalChart.setOption(option);
            $(window).resize(function(){
                goodAbnormalChart.resize();
            });
        },
        initFunc:function(){
            public.showLoading();
            /*左导航改变*/
            var sideBar=$('#compassSidebar');
            var sideBarLi=sideBar.find('li');
            var sideHref;
            sideBarLi.removeClass('list-blue');
            for(var sideNum=0;sideNum<sideBarLi.length;sideNum++){
                sideHref=sideBarLi.eq(sideNum).attr('data-href');
                if(sideHref=='commodityAnalysis'){
                    sideBarLi.eq(sideNum).addClass('list-blue');
                    sideBarLi.eq(sideNum).parent().slideDown(150);
                    break;
                }
            }
            vm.createData.myActualGood='';
            vm.createData.myTrendGood='';
            $.when(
                $.ajax({
                    url:urlMapping['get_compass_time'],
                    type:'get',
                    data:{},
                    dataType:'json'
                }),
                $.ajax({
                    url:urlMapping['get_emc_list'],
                    type:'get',
                    data:{},
                    dataType:'json'
                })
            ).done(function(response1,response2){
                var data1=response1[0],data2=response2[0];
                vm.createData.compassTime.yesterday=data1.yesterday;
                vm.createData.compassTime.last_shop_hour=data1.last_shop_hour;
                vm.createData.compassTime.last_2hour=data1.last_2hour;
                vm.createData.compassTime.last_shop_hour_end=data1.last_shop_hour_end;
                vm.createData.compassTime.yesterday_end=data1.yesterday_end;
                vm.createData.emcList=data2;  //加载商品下拉条
                vm.good.emc=data2[0][0];  //同步下拉选项
                /*计算本周一是几号*/
                var timeChange=data1.yesterday;
                var now = new Date(timeChange.split('-').join('/'));  //当前日期
                var nowDayOfWeek = now.getDay();  //今天是本周的第几天
                var nowYear = now.getFullYear();  //当前年
                var nowMonth = now.getMonth();  //月
                var nowDay = now.getDate();  //日
                nowDayOfWeek = nowDayOfWeek==0?7:nowDayOfWeek;  //如果是周日就变成7
                var weekStartDate = new Date(nowYear,nowMonth,nowDay - nowDayOfWeek+1);  //找到本周一
                var newDate = weekStartDate.getFullYear()+'-'+((weekStartDate.getMonth()+1)<9?('0'+(weekStartDate.getMonth()+1)):(weekStartDate.getMonth()+1))+'-'+(weekStartDate.getDate()<9?('0'+weekStartDate.getDate()):(weekStartDate.getDate()));
                counter=0;
                var requestArray=[
                    {type: 'get', url: urlMapping['get_merch_top'], data: {hour:vm.$model.createData.compassTime.last_shop_hour}, name: 'merchTop'},  //今日TOP10
                    {type: 'get', url: urlMapping['get_good_trend'], data: {emc:vm.$model.good.emc,typ:vm.$model.good.typ,date:newDate}, name: 'goodTrend'},  //商品销售走势
                    {type: 'get', url: urlMapping['get_merch_hot'], data: {rank:'amt',typ:'wtd',date:vm.$model.createData.compassTime.yesterday}, name: 'merchHot'},  //热销商品排行
                    {type: 'get', url: urlMapping['get_compass_abnormal'], data: {date:vm.$model.createData.compassTime.yesterday}, name: 'compassAbnormal'},  //异常商品图表
                    {type: 'get', url: urlMapping['get_abnormal_merch'], data: {status:'Z',page:1,date:vm.$model.createData.compassTime.yesterday,order:'desc',sort:'site'}, name: 'abnormalMerch'},  //异常商品表格
                    {type: 'get', url: urlMapping['get_brand_rank'], data: {sort_by:'amt',typ:'wtd',date:vm.$model.createData.compassTime.yesterday,order:'desc',page:1}, name: 'brandRank'},  //我的品牌排行
                    {type: 'get', url: urlMapping['get_complete_site'], data: {}, name: 'completeArray'}  //读取自动补全文件
                ];
                itorReqFunc(requestArray,function(){
                    /*今日TOP10*/
                    var merchTop=vm.$model.createData.merchTop;
                    /*商品销售走势*/
                    var goodTrend=vm.$model.createData.goodTrend;
                    /*热销商品排行*/
                    var merchHot=vm.$model.createData.merchHot;
                    /*异常商品图表*/
                    var compassAbnormal=vm.$model.createData.compassAbnormal;
                    vm.abnormalPercent=vm.$model.createData.compassAbnormal.percent;
                    var abnormalArray=[];
                    for(var i=0;i<compassAbnormal.status.length;i++){
                        switch (compassAbnormal.status[i]){
                            case 'Z':
                                abnormalArray.push({
                                    value:compassAbnormal.values[i],
                                    name:'滞销异常 '+compassAbnormal.values[i]+'%',
                                    key:compassAbnormal.status[i]
                                });
                                vm.abnormalZPercent=compassAbnormal.values[i];
                                break;
                            case 'C':
                                abnormalArray.push({
                                    value:compassAbnormal.values[i],
                                    name:'畅缺异常 '+compassAbnormal.values[i]+'%',
                                    key:compassAbnormal.status[i]
                                });
                                vm.abnormalCPercent=compassAbnormal.values[i];
                                break;
                            case 'G':
                                abnormalArray.push({
                                    value:compassAbnormal.values[i],
                                    name:'高库存异常 '+compassAbnormal.values[i]+'%',
                                    key:compassAbnormal.status[i]
                                });
                                vm.abnormalGPercent=compassAbnormal.values[i];
                                break;
                            case 'L':
                                abnormalArray.push({
                                    value:compassAbnormal.values[i],
                                    name:'零库存正常状态商品 '+compassAbnormal.values[i]+'%',
                                    key:compassAbnormal.status[i]
                                });
                                vm.abnormalLPercent=compassAbnormal.values[i];
                                break;
                        }
                    }
                    /*异常商品表格*/
                    var abnormalMerch=vm.$model.createData.abnormalMerch;
                    /*我的品牌排行表格*/
                    var brandRank=vm.$model.createData.brandRank;
                    public.nodeReady({
                        elId:'commodityStock1',
                        callback:function(){
                            /*是通过首页查看详情过来的*/
                            var hash=location.hash;
                            var $top=hash.indexOf("hot=");
                            var $abnormal=hash.indexOf("abnormal=");
                            if($top>-1){
                                $("html,body").animate({scrollTop:$("#hotGoodRank").offset().top-100},500);
                            }
                            if($abnormal>-1){
                                $("html,body").animate({scrollTop:$("#abnormalRank").offset().top-100},500);
                            }
                            /*商品销售走势日历*/
                            vm.createData.trendTimeData.start=newDate;
                            vm.createData.trendTimeData.end=vm.$model.createData.compassTime.yesterday;
                            vm.createData.trendTimeData.type='week';
                            new RtlCalendar('timepicker1', {
                                isModal: true,
                                checked: function(){
                                    vm.createData.trendTimeData.start=arguments[0];
                                    vm.createData.trendTimeData.end=arguments[1];
                                    vm.createData.trendTimeData.type=arguments[2];
                                },
                                setDate:newDate+'&'+vm.$model.createData.compassTime.yesterday,
                                startDate: '2016/01/01',
                                endDate: vm.$model.createData.compassTime.yesterday,
                                pull: 'right',
                                format: 'WMY'
                            });
                            /*热销商品TOP10日历*/
                            vm.createData.hotTimeData.start=newDate;
                            vm.createData.hotTimeData.end=vm.$model.createData.compassTime.yesterday;
                            vm.createData.hotTimeData.type='week';
                            new RtlCalendar('timepicker2', {
                                isModal: true,
                                checked: function(){
                                    vm.createData.hotTimeData.start=arguments[0];
                                    vm.createData.hotTimeData.end=arguments[1];
                                    vm.createData.hotTimeData.type=arguments[2];
                                },
                                setDate:newDate+'&'+vm.$model.createData.compassTime.yesterday,
                                startDate: '2016/01/01',
                                endDate: vm.$model.createData.compassTime.yesterday,
                                pull: 'right',
                                format: 'WMY'
                            });
                            /*品牌排行日历*/
                            vm.createData.brandTimeData.start=newDate;
                            vm.createData.brandTimeData.end=vm.$model.createData.compassTime.yesterday;
                            vm.createData.brandTimeData.type='week';
                            vm.createData.brandTableTime.start=newDate;
                            vm.createData.brandTableTime.end=vm.$model.createData.compassTime.yesterday;
                            vm.createData.brandTableTime.type='week';
                            new RtlCalendar('timepicker3', {
                                isModal: true,
                                checked: function(){
                                    vm.createData.brandTimeData.start=arguments[0];
                                    vm.createData.brandTimeData.end=arguments[1];
                                    vm.createData.brandTimeData.type=arguments[2];
                                },
                                setDate:newDate+'&'+vm.$model.createData.compassTime.yesterday,
                                startDate: '2016/01/01',
                                endDate: vm.$model.createData.compassTime.yesterday,
                                pull: 'right',
                                format: 'WMY'
                            });
                            /*分页初始化*/
                            new RtlPaging({  //
                                el: "tablePage1",
                                size: vm.$model.createData.abnormalMerch.pages,
                                desc: "C",
                                descCount: vm.$model.createData.abnormalMerch.total,
                                callback:function(data){
                                    vm.abnormalPageNow=data;
                                }
                            });
                            new RtlPaging({
                                el: "tablePage2",
                                size: vm.$model.createData.brandRank.pages,
                                desc: "C",
                                descCount: vm.$model.createData.brandRank.total,
                                callback:function(data){
                                    vm.brandPageNow=data;
                                }
                            });
                            /*选择门店弹窗显示消失*/
                            $('body').on('click',function(){
                                $('.rtl-menu-box').hide(0);
                            });
                            $('#siteChoice').off('click').on('click',function(e){
                                $('#allSite').prop('checked',false);
                                $(this).val('');
                                $('#siteInputBox').val('');
                                vm.autoCompleteArray=[];
                                $(this).siblings('.rtl-menu-box').slideToggle(0);
                                var $event=e || window.event;
                                $event.stopPropagation();
                            });
                            $('#siteModalChoice').off('click').on('click',function(e){
                                $('#allSite2').prop('checked',false);
                                $(this).val('');
                                $('#siteInputBox2').val('');
                                vm.modalAutoCompleteArray=[];
                                $(this).siblings('.rtl-menu-box').slideToggle(0);
                                var $event=e || window.event;
                                $event.stopPropagation();
                            });
                            $('.rtl-menu-box').on('click',function(e){
                                var $event=e || window.event;
                                $event.stopPropagation();
                            });
                            /*单品实时查询图表*/
                            vm.commodityStockChart('commodityStock1',['前5小时','前4小时','前3小时','前2小时','前1小时'],[0,0,0,0,0]);
                            vm.commodityStockChart('commodityStock2',['前5小时','前4小时','前3小时','前2小时','前1小时'],[0,0,0,0,0]);
                            vm.commodityStockChart('commodityStock3',['前5小时','前4小时','前3小时','前2小时','前1小时'],[0,0,0,0,0]);
                            //vm.commodityStockChart('commodityStock4',['前5小时','前4小时','前3小时','前2小时','前1小时'],[0,0,0,0,0]);
                            /*商品销售走势图表*/
                            vm.goodSaleChart('goodSaleChart',goodTrend.time,goodTrend.data);
                            /*异常商品分布图表*/
                            vm.goodAbnormalChart(abnormalArray);
                            /*实时商品排行榜名称过长显示*/
                            $('[data-toggle="tooltip"]').tooltip();
                            public.closeLoading();
                        }
                    });
                });
            }).fail(function(){
                public.closeLoading();
                window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
            });
        },
        /*自动联想*/
        autoEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $val= $.trim($target.val());
            var completeArray=vm.$model.createData.completeArray;
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
        /*弹窗自动联想*/
        modalAutoEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $val= $.trim($target.val());
            var completeArray=vm.$model.createData.completeArray;
            vm.modalAutoCompleteArray=[];
            if($val==''){
                return false;
            }
            for(var i=0;i<completeArray.length;i++){
                if(vm.$model.modalAutoCompleteArray.length<10){
                    if(completeArray[i][0].match($val)!=null || completeArray[i][1].match($val)!=null){
                        vm.modalAutoCompleteArray.push({
                            code:completeArray[i][0],
                            name:completeArray[i][1]
                        });
                    }
                }
            }
        },
        /*选择全部门店*/
        setSiteAll:function(){
            setTimeout(function(){
                $('.rtl-menu-box').hide(0);
            },200);
            $('#siteChoice').val('全部门店');
            vm.site.siteCode='';
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
        /*输入框下拉框切换*/
        disabledEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $index=$target.index();
            $target.removeClass('form-search-disabled');
            var $trendIndex=vm.$model.createData.trendIndex;
            if($index==$trendIndex){  //连续多次点击的是同一个
                return false;
            }
            if($index==0){  //点击的是下拉框 我特么操了 输入框日历有day,下拉框的没有,日历还要切换
                $('#goodInput2').addClass('form-search-disabled').val('');
                /*计算本周一是几号*/
                var timeChange=vm.$model.createData.compassTime.yesterday;
                var now = new Date(timeChange.split('-').join('/'));  //当前日期
                var nowDayOfWeek = now.getDay();  //今天是本周的第几天
                var nowYear = now.getFullYear();  //当前年
                var nowMonth = now.getMonth();  //月
                var nowDay = now.getDate();  //日
                nowDayOfWeek = nowDayOfWeek==0?7:nowDayOfWeek;  //如果是周日就变成7
                var weekStartDate = new Date(nowYear,nowMonth,nowDay - nowDayOfWeek+1);  //找到本周一
                var newDate = weekStartDate.getFullYear()+'-'+((weekStartDate.getMonth()+1)<9?('0'+(weekStartDate.getMonth()+1)):(weekStartDate.getMonth()+1))+'-'+(weekStartDate.getDate()<9?('0'+weekStartDate.getDate()):(weekStartDate.getDate()));

                vm.createData.trendTimeData.type='week';
                vm.createData.trendTimeData.start=newDate;
                vm.createData.trendIndex=0;
                vm.goodSkuOrEmc='emc';
                new RtlCalendar('timepicker1', {
                    isModal: true,
                    checked: function(){
                        vm.createData.trendTimeData.start=arguments[0];
                        vm.createData.trendTimeData.end=arguments[1];
                        vm.createData.trendTimeData.type=arguments[2];
                    },
                    setDate:newDate+'&'+vm.$model.createData.compassTime.yesterday,
                    startDate: '2016/01/01',
                    endDate: vm.$model.createData.compassTime.yesterday,
                    pull: 'right',
                    format: 'WMY'
                });
            }else{  //点击的是输入框
                $('#goodSelect').addClass('form-search-disabled');
                vm.createData.trendTimeData.type='day';
                vm.createData.trendTimeData.start=vm.$model.createData.compassTime.yesterday;
                vm.createData.trendIndex=2;  //这里是索引为2,span标签还要占一个
                vm.goodSkuOrEmc='sku';
                new RtlCalendar('timepicker1', {
                    isModal: true,
                    checked: function(){
                        vm.createData.trendTimeData.start=arguments[0];
                        vm.createData.trendTimeData.end=arguments[1];
                        vm.createData.trendTimeData.type=arguments[2];
                    },
                    setDate:vm.$model.createData.compassTime.yesterday+'&'+vm.$model.createData.compassTime.yesterday,
                    startDate: '2016/01/01',
                    endDate: vm.$model.createData.compassTime.yesterday,
                    pull: 'right',
                    format: 'DWMY'
                });
            }
        },
        /*TOP10门店信息*/
        seeModalSite:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var sku=$target.parent().siblings('.good-sku').text();
            var goodName=$target.parent().siblings('.good-name').text();
            $('#modalGoodName').text(goodName);
            $('.topModalTableSort').removeClass('desc asc');
            $.ajax({
                url:urlMapping['get_merch_site'],
                type:'get',
                dataType:'json',
                data:{
                    sku:sku,
                    date:vm.$model.createData.compassTime.last_shop_hour
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.topModalTable=data;
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*TOP10门店排序*/
        topModalTableSort:function(){
            var that=$(this);
            var list=vm.$model.topModalTable;
            if(that.hasClass('desc')){
                vm.topModalTable=list.sort(function(a,b){
                    return Math.abs(a.rank_change)- Math.abs(b.rank_change);
                });
                that.removeClass('desc').addClass('asc');
            }else if(that.hasClass('asc')){
                vm.topModalTable=list.sort(function(a,b){
                    return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                });
                that.removeClass('asc').addClass('desc');
            }else{
                vm.topModalTable=list.sort(function(a,b){
                    return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                });
                that.addClass('desc');
            }
        },
        /*单品实时查询确定*/
        searchSiteDetailEvt:function(){
            var sku= $.trim($('#goodInput').val());
            var site= vm.$model.site.siteCode;
            if(sku==''){
                window.wxc.xcConfirm('请输入商品SKU', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            $.ajax({
                url:urlMapping['get_merch_last'],
                type:'get',
                dataType:'json',
                data:{
                    sku:sku,
                    site:site,
                    hour:vm.$model.createData.compassTime.last_shop_hour
                },
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
                        vm.createData.myActualGood=data.sku_name;
                        var time=['前1小时','前2小时','前3小时','前4小时','前5小时'];
                        var time1=[],time2=[],time3=[];
                        for(var i=0;i<data.price.length;i++){
                            time1.unshift(time[i]);
                        }
                        for(var j=0;j<data.saleamt.length;j++){
                            time2.unshift(time[j]);
                        }
                        for(var m=0;m<data.salenum.length;m++){
                            time3.unshift(time[m]);
                        }
                        vm.goodTopNum.price=data.price[0];
                        vm.goodTopNum.sale=data.saleamt_day;
                        vm.goodTopNum.num=data.salenum_day;
                        vm.commodityStockChart('commodityStock1',time1,data.price.reverse());
                        vm.commodityStockChart('commodityStock2',time2,data.saleamt.reverse());
                        vm.commodityStockChart('commodityStock3',time3,data.salenum.reverse());
                        /*以下是删除的功能*/
                        //time4=[];
                        //for(var n=0;n<data.stock.length;n++){
                        //    time4.unshift(time[n]);
                        //}
                        //vm.goodTopNum.stock=data.stock[0];
                        //vm.commodityStockChart('commodityStock4',time4,data.stock.reverse());
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*TOP10商品排序*/
        TopSortEvt:function(evt){
            var tableList=vm.$model.createData.merchTop;
            var $target=$(evt.target) || $(evt.element);
            var $type=$target.attr('month-sort');
            if($type=='amt'){  //销售额排序
                if($target.hasClass('desc')){
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return a.saleamt- b.saleamt;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return b.saleamt- a.saleamt;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return b.saleamt- a.saleamt;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            if($type=='num'){  //销售量排序
                if($target.hasClass('desc')){
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return a.salenum- b.salenum;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return b.salenum- a.salenum;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return b.salenum- a.salenum;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            if($type=='rank'){  //排名变化绝对值排序 我干 每次看到这个都无力吐槽
                if($target.hasClass('desc')){
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return Math.abs(a.rank_change)- Math.abs(b.rank_change);
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            if($type=='day'){  //榜单停留排序
                if($target.hasClass('desc')){
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return a.list_hours- b.list_hours;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return b.list_hours- a.list_hours;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.merchTop=tableList.sort(function(a,b){
                        return b.list_hours- a.list_hours;
                    });
                    $('.topSort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            setTimeout(function(){
                /*实时商品排行榜名称过长显示*/
                $('[data-toggle="tooltip"]').tooltip();
            },100);
        },
        /*模态框选择全部门店*/
        setModalSiteAll:function(){
            setTimeout(function(){
                $('.rtl-menu-box').hide(0);
            },200);
            $('#siteModalChoice').val('全部门店');
            vm.modalSite.modalSiteCode='';
        },
        /*模态框选择单个门店*/
        setModalSiteOne:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $text=$target.text();
            $('#siteModalChoice').val($text);
            setTimeout(function(){
                $('.rtl-menu-box').hide(0);
            },200);
            vm.modalSite.modalSiteCode=$target.attr('value');
        },
        /*实时信息弹窗*/
        seeModalStock:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var goodName=$target.parent().siblings('.good-name').text();
            var sku=$target.parent().siblings('.good-sku').text();
            vm.topModalName=goodName;
            vm.topModalSku=sku;
            vm.topModalSite='';
            $('#siteModalChoice').val('');
            vm.getTopModalStock('',sku);
        },
        /*实时信息选择门店确定*/
        modalSearch:function(){
            vm.getTopModalStock(vm.$model.modalSite.modalSiteCode,vm.$model.topModalSku);
        },
        /*获取实时信息*/
        getTopModalStock:function(site,sku){
            $.ajax({
                url:urlMapping['get_merch_last'],
                type:'get',
                dataType:'json',
                data:{
                    sku:sku,
                    site:site,
                    hour:vm.$model.createData.compassTime.last_shop_hour
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    var timeArray=['前1小时','前2小时','前3小时','前4小时','前5小时'];
                    var priceTime=[],saleamtTime=[],salenumTime=[],stockTime=[];
                    for(var i=0;i<data.price.length;i++){
                        priceTime.unshift(timeArray[i]);
                    }
                    for(var j=0;j<data.saleamt.length;j++){
                        saleamtTime.unshift(timeArray[j]);
                    }
                    for(var m=0;m<data.salenum.length;m++){
                        salenumTime.unshift(timeArray[m]);
                    }
                    vm.topModalNum.price=data.price[0];
                    vm.topModalNum.sale=data.saleamt_day;
                    vm.topModalNum.num=data.salenum_day;
                    vm.commodityStockChart('modalStock1',priceTime,data.price.reverse());
                    vm.commodityStockChart('modalStock2',saleamtTime,data.saleamt.reverse());
                    vm.commodityStockChart('modalStock3',salenumTime,data.salenum.reverse());
                    //for(var n=0;n<data.stock.length;n++){
                    //    stockTime.unshift(timeArray[n]);
                    //}
                    //vm.topModalNum.stock=data.stock[0];
                    //vm.commodityStockChart('modalStock4',stockTime,data.stock.reverse());
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*行情信息弹窗*/
        seeModalLine:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var goodName=$target.parent().siblings('.good-name').text();
            var sku=$target.parent().siblings('.good-sku').text();
            vm.topModalName=goodName;
            vm.topModalSku=sku;
            new RtlCalendar('timepicker4', {
                isModal: true,
                checked: function(){
                    vm.topModalDate=arguments[0]+'&'+arguments[1];
                    vm.topModalDateType=arguments[2];
                },
                setDate: vm.$model.createData.compassTime.yesterday+'&'+vm.$model.createData.compassTime.yesterday,
                startDate: '2016/01/01',
                endDate: vm.$model.createData.compassTime.yesterday,
                pull: 'right',
                format: 'DWMY'
            });
            vm.topModalDate=vm.$model.createData.compassTime.yesterday+'&'+vm.$model.createData.compassTime.yesterday;
            vm.topModalDateType='day';
            vm.getTopModalLine(sku,'day',vm.$model.createData.compassTime.yesterday);
        },
        /*行情信息确定*/
        topModalLineSearch:function(){
            var date=vm.$model.topModalDate;
            date=date.replace(/\//g,'-');
            var dateSplit=date.split('&');
            var typ=vm.$model.topModalDateType;
            if(typ=='day'){  //日
                date=dateSplit[0].substr(0,10);
            }
            if(typ=='week'){  //周
                date=dateSplit[0];
            }
            if(typ=='month'){  //月
                date=dateSplit[0].substr(0,7);
            }
            if(typ=='year'){  //年
                date=dateSplit[0].substr(0,4);
            }
            vm.getTopModalLine(vm.$model.topModalSku,typ,date);
        },
        /*获取行情信息*/
        getTopModalLine:function(sku,typ,date){
            $.ajax({
                url:urlMapping['get_good_trend'],
                type:'get',
                dataType:'json',
                data:{
                    sku:sku,
                    typ:typ,
                    date:date
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.goodSaleChart('modalLineChart',data.time,data.data);
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*商品销售走势查询*/
        trendSearch:function(){
            var date=vm.$model.createData.trendTimeData.start;
            date=date.replace(/\//g,'-');
            var typ=vm.$model.createData.trendTimeData.type;
            var emcOrSku=vm.$model.goodSkuOrEmc;
            var sku,emc,dataObj,newDate;
            if(emcOrSku=='sku'){  //按sku查询
                sku= $.trim($('#goodInput2').val());
                if(sku==''){
                    window.wxc.xcConfirm('请输入商品SKU', window.wxc.xcConfirm.typeEnum.warning);
                    return false;
                }else{
                    if(typ=='day'){
                        newDate=date.substr(0,10);
                    }
                    if(typ=='week'){
                        newDate=date;
                    }
                    if(typ=='month'){
                        newDate=date.substr(0,7);
                    }
                    if(typ=='year'){
                        newDate=date.substr(0,4);
                    }
                    dataObj={
                        sku:sku,
                        typ:typ,
                        date:newDate
                    }
                }
            }else{  //按照emc查询
                emc=$('#goodSelect').val();
                if(typ=='week'){
                    newDate=date;
                }
                if(typ=='month'){
                    newDate=date.substr(0,7);
                }
                if(typ=='year'){
                    newDate=date.substr(0,4);
                }
                dataObj={
                    emc:emc,
                    typ:typ,
                    date:newDate
                }
            }
            $.ajax({
                url:urlMapping['get_good_trend'],
                type:'get',
                dataType:'json',
                data:dataObj,
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        if(emcOrSku=='sku'){
                            if(data.sku_name){
                                vm.createData.myTrendGood=data.sku_name;
                                vm.goodSaleChart('goodSaleChart',data.time,data.data);
                            }else{
                                window.wxc.xcConfirm('查无此商品SKU或商品SKU不属于此供商卡号', window.wxc.xcConfirm.typeEnum.error);
                            }
                        }else{
                            vm.createData.myTrendGood='';
                            vm.goodSaleChart('goodSaleChart',data.time,data.data);
                        }
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*热销商品排行查询*/
        hotGoodSearch:function(){
            var rank=$('#hotSelect').val();
            var typ=vm.$model.createData.hotTimeData.type;
            var date=vm.$model.createData.hotTimeData.start;
            var newDate,dataObj;
            date=date.replace(/\//g,'-');
            if(typ=='week'){
                newDate=date;
                typ='wtd';
            }
            if(typ=='month'){
                newDate=date.substr(0,7);
                typ='mtd';
            }
            if(typ=='year'){
                newDate=date.substr(0,4);
                typ='ytd';
            }
            dataObj={
                rank:rank,
                typ:typ,
                date:newDate
            };
            $.ajax({
                url:urlMapping['get_merch_hot'],
                type:'get',
                dataType:'json',
                data:dataObj,
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    public.closeLoading();
                    if(data){
                        vm.createData.merchHot=data;
                        setTimeout(function(){
                            /*实时商品排行榜名称过长显示*/
                            $('[data-toggle="tooltip"]').tooltip();
                        },200);
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*热销商品排行排序*/
        hotSortEvt:function(evt){
            var tableList=vm.$model.createData.merchHot;
            var $target=$(evt.target) || $(evt.element);
            var $type=$target.attr('month-sort');
            if($type=='amt'){  //销售额排序
                if($target.hasClass('desc')){
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return a.saleamt- b.saleamt;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return b.saleamt- a.saleamt;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return b.saleamt- a.saleamt;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            if($type=='num'){  //销售量排序
                if($target.hasClass('desc')){
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return a.salenum- b.salenum;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return b.salenum- a.salenum;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return b.salenum- a.salenum;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            if($type=='rank'){  //排名变化绝对值排序 我干 每次看到这个都无力吐槽
                if($target.hasClass('desc')){
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return Math.abs(a.rank_change)- Math.abs(b.rank_change);
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            if($type=='day'){  //榜单停留排序
                if($target.hasClass('desc')){
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return a.list_days- b.list_days;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return b.list_days- a.list_days;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.merchHot=tableList.sort(function(a,b){
                        return b.list_days- a.list_days;
                    });
                    $('.hotSort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            setTimeout(function(){
                /*实时商品排行榜名称过长显示*/
                $('[data-toggle="tooltip"]').tooltip();
            },100);
        },
        /*品牌排行确定(为啥要先做品牌排行而不是异常模块呢，因为我特么写不动了！！！)*/
        brandSearch:function(){
            var date=vm.$model.createData.brandTimeData.start;
            date=date.replace(/\//g,'-');
            var typ=vm.$model.createData.brandTimeData.type;
            var newDate,dataObj;
            if(typ=='week'){
                newDate=date;
                typ='wtd';
            }
            if(typ=='month'){
                newDate=date.substr(0,7);
                typ='mtd';
            }
            if(typ=='year'){
                newDate=date.substr(0,4);
                typ='ytd';
            }
            dataObj={
                typ:typ,
                sort_by:'amt',
                date:newDate,
                order:'desc',
                page:1
            };
            //vm.brandPageNow=1;
            /*点了确定将排序需要的东西同步*/
            vm.createData.brandTableTime.start=vm.$model.createData.brandTimeData.start;
            vm.createData.brandTableTime.end=vm.$model.createData.brandTimeData.end;
            vm.createData.brandTableTime.type=vm.$model.createData.brandTimeData.type;
            /*排序依据重置*/
            vm.createData.brandList.order='desc';
            vm.createData.brandList.sort_by='amt';
            vm.createData.brandList.resize=true;
            $('.brandSort').removeClass('desc asc').eq(0).addClass('desc');
            if(vm.$model.brandPageNow==1){
                vm.getBrandList(dataObj);
            }else{
                vm.brandPageNow=1;
            }
        },
        /*品牌排行表格排序*/
        brandSort:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var rank,order,dataObj;
            rank = $target.attr('month-sort');
            $target.hasClass('desc')?
                $target.removeClass('desc').addClass('asc').parent('th').siblings().find('a').removeClass('desc asc'):
                $target.hasClass('asc')?
                    $target.removeClass('asc').addClass('desc').parent('th').siblings().find('a').removeClass('desc asc'):
                    $target.addClass('desc').parent('th').siblings().find('a').removeClass('desc asc');
            order = $target.hasClass('asc')?'asc': 'desc';
            vm.createData.brandList.sort_by=rank;
            vm.createData.brandList.order=order;
            /*这里要专门使用用于排序的那个保存对象*/
            var date=vm.$model.createData.brandTableTime.start;
            date=date.replace(/\//g,'-');
            var typ=vm.$model.createData.brandTableTime.type;
            var newDate;
            if(typ=='week'){
                newDate=date;
                typ='wtd';
            }
            if(typ=='month'){
                newDate=date.substr(0,7);
                typ='mtd';
            }
            if(typ=='year'){
                newDate=date.substr(0,4);
                typ='ytd';
            }
            vm.createData.brandList.resize=true;
            dataObj={
                typ:typ,
                sort_by:rank,
                order:order,
                date:newDate,
                page:1
            };
            var $length=vm.$model.createData.brandRank.data.length;
            if($length<2){  //只有一条或0条不用排序
                return false;
            }
            if(vm.$model.brandPageNow==1){
                vm.getBrandList(dataObj);
            }else{
                vm.brandPageNow=1;
            }
        },
        /*获取品牌排行表格*/
        getBrandList:function(data){
            $.ajax({
                url:urlMapping['get_brand_rank'],
                type:'get',
                dataType:'json',
                data:data,
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.createData.brandRank=data;
                        if(vm.$model.createData.brandList.resize){
                            new RtlPaging({  //分页重置
                                size: data.pages,
                                desc: "C",
                                descCount: data.total,
                                el: "tablePage2",
                                callback:function(data){
                                    vm.brandPageNow=data;
                                }
                            });
                            vm.createData.brandList.resize=false;
                        }
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*异常表格切换*/
        abnormalSearch:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $index=$target.index();
            $target.addClass('active').siblings().removeClass('active');
            var status,order,sort;
            if($index==0){  //滞销异常
                status='Z';
                $('#abnormalName').text('滞销异常');
            }else if($index==1){  //畅缺异常
                status='C';
                $('#abnormalName').text('畅缺异常');
            }else if($index==2){  //高库存异常
                status='G';
                $('#abnormalName').text('高库存异常');
            }else{  //零库存正常状态商品
                status='L';
                $('#abnormalName').text('零库存正常状态商品');
            }
            order='desc';
            sort='site';
            vm.abnormalStatus=status;
            vm.abnormalOrder=order;
            vm.abnormalSort=sort;
            //vm.abnormalPageNow=1;
            vm.abnormalResize=true;
            $('.abnormalSort').removeClass('desc asc').eq(1).addClass('desc');  //排序样式重置
            vm.getAbnormalList(status,1,order,sort);
        },
        /*异常表格排序*/
        abnormalSortEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var sort=$target.attr('month-sort');
            var order;
            $target.hasClass('desc')?
                $target.removeClass('desc').addClass('asc').parent('th').siblings().find('a').removeClass('desc asc'):
                $target.hasClass('asc')?
                    $target.removeClass('asc').addClass('desc').parent('th').siblings().find('a').removeClass('desc asc'):
                    $target.addClass('desc').parent('th').siblings().find('a').removeClass('desc asc');
            order = $target.hasClass('asc')?'asc': 'desc';
            var page=1;
            var status=vm.$model.abnormalStatus;
            vm.abnormalOrder=order;  //升序降序同步
            vm.abnormalSort=sort;  //按门店还是库存排序同步
            vm.abnormalResize=true;
            vm.getAbnormalList(status,page,order,sort);
        },
        /*获取异常表格*/
        getAbnormalList:function(status,page,order,sort){
            $.ajax({
                url:urlMapping['get_abnormal_merch'],
                type:'get',
                dataType:'json',
                data:{
                    status:status,
                    page:page,
                    order:order,
                    sort:sort,
                    date:vm.$model.createData.compassTime.yesterday
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.createData.abnormalMerch=data;
                        vm.abnormalStatus=status;  //点击的是哪一个同步
                        vm.abnormalOrder=order;  //升序降序同步
                        vm.abnormalSort=sort;  //按门店还是库存排序同步
                        if(vm.$model.abnormalResize){
                            new RtlPaging({  //分页重置
                                size: data.pages,
                                desc: "C",
                                descCount: data.total,
                                el: "tablePage1",
                                callback:function(data){
                                    vm.abnormalPageNow=data;
                                }
                            });
                            vm.abnormalResize=false;
                        }
                        /*实时商品排行榜名称过长显示*/
                        setTimeout(function(){
                            $('[data-toggle="tooltip"]').tooltip();
                        },100);
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*异常门店弹窗*/
        seeSiteModal:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var sku=$target.parent().siblings('.good-sku').attr('value');
            var name=$target.parent().siblings('.good-name').text();
            vm.abnormalSku=sku;
            vm.abnormalModalPageNow=1;
            vm.abnormalModalResize=true;
            var status=vm.$model.abnormalStatus;
            $('#myModalLabel').html($('#abnormalName').text()+'门店详情'+'<span>(商品名称 : '+name+')</span>');
            vm.abnormalModalOrder='desc';
            $('.abnormalModalSort').removeClass('desc asc').addClass('desc');
            vm.getAbnormalSite(status,sku,1,'desc');
        },
        /*异常门店弹窗排序*/
        abnormalModalSort:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var order;
            $target.hasClass('desc')?
                $target.removeClass('desc').addClass('asc').parent('th').siblings().find('a').removeClass('desc asc'):$target.removeClass('asc').addClass('desc').parent('th').siblings().find('a').removeClass('desc asc');
            order = $target.hasClass('asc')?'asc': 'desc';
            vm.abnormalModalOrder=order;
            var sku=vm.$model.abnormalSku;
            var status=vm.$model.abnormalStatus;
            vm.abnormalModalResize=true;
            vm.getAbnormalSite(status,sku,1,order);
        },
        /*异常门店弹窗列表*/
        getAbnormalSite:function(status,sku,page,order){
            $.ajax({
                url:urlMapping['get_abnormal_site'],
                type:'get',
                dataType:'json',
                data:{
                    status:status,
                    sku:sku,
                    page:page,
                    order:order,
                    date:vm.$model.createData.compassTime.yesterday
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.abnormalModalList=data;
                        if(vm.$model.abnormalModalResize){
                            new RtlPaging({
                                size: data.pages,
                                desc: "C",
                                descCount: data.total,
                                el: "tablePage3",
                                callback:function(data){
                                    vm.abnormalModalPageNow=data;
                                }
                            });
                        }
                        vm.abnormalModalResize=false;
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        }
    });
    /*品牌排行表格分页*/
    vm.$watch('brandPageNow',function(page){
        vm.brandPageNow=page;
        var date=vm.$model.createData.brandTableTime.start;
        date=date.replace(/\//g,'-');
        var typ=vm.$model.createData.brandTableTime.type;
        var rank=vm.$model.createData.brandList.sort_by;
        var order=vm.$model.createData.brandList.order;
        var newDate;
        if(typ=='week'){
            newDate=date;
            typ='wtd';
        }
        if(typ=='month'){
            newDate=date.substr(0,7);
            typ='mtd';
        }
        if(typ=='year'){
            newDate=date.substr(0,4);
            typ='ytd';
        }
        var dataObj={
            typ:typ,
            sort_by:rank,
            order:order,
            date:newDate,
            page:vm.$model.brandPageNow
        };
        vm.getBrandList(dataObj);
    });
    /*异常表格分页*/
    vm.$watch('abnormalPageNow',function(page){
        vm.abnormalPageNow=page;
        var status=vm.$model.abnormalStatus;
        var order=vm.$model.abnormalOrder;
        var sort=vm.$model.abnormalSort;
        vm.getAbnormalList(status,page,order,sort);
    });
    /*异常门店弹窗分页*/
    vm.$watch('abnormalModalPageNow',function(page){
        vm.abnormalModalPageNow=page;
        var sku=vm.$model.abnormalSku;
        var status=vm.$model.abnormalStatus;
        var order=vm.$model.abnormalModalOrder;
        vm.getAbnormalSite(status,sku,page,order);
    });
    var counter = 0;
    var itorReqFunc = function(arr, callback){
        if(arr.constructor != Array || arr.length < 1){
            if(callback) callback();
            return;
        }
        if(!arr[counter].name || !arr[counter].url){
            counter ++;
            if(counter >= arr.length){
                if(callback) callback();
            } else {
                itorReqFunc(arr, callback);
            }
        }
        $.ajax({
            type: arr[counter].type? 'get': arr[counter].type,
            url: arr[counter].url,
            dataType: 'json',
            async: true,
            cache: false,
            data: arr[counter].data?arr[counter].data:'',
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                vm.createData[arr[counter].name] = data;  //这句话是为了让arr的日期与avalon的同步,它没有自动同步
                counter ++;
                if(counter < arr.length){
                    itorReqFunc(arr, callback);
                } else {
                    if(callback) callback();
                }
            },
            error: function () {
                window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                //alert('服务器错误');
                return false;
            }
        });
    };
    return vm;
});