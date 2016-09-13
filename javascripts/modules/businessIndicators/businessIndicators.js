define(['avalon','public','echarts','rtlCalendar','rtlPage','urlMapping','xcConfirm'],function(avalon,public,echarts,rtlCalendar,rtlPage,urlMapping,xcConfirm){
    var charts={  //我干,为了一个图表resize也是拼
        saleamtChart:'',
        purchaseChart:'',
        highStockChart:'',
        receiveChart:'',
        returnChart:'',
        rightChart:''
    };
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
        $id:'businessIndicatorsCtrl',
        createDataArray:{  //时间和图表数据集合
            completeArray:[],  //自动补全所有门店数据
            /*最新的数据时间*/
            compassTime:{
                last_2hour: '',
                last_shop_hour:  '',
                last_shop_hour_end:  '',
                yesterday:  '',
                yesterday_end:  ''
            },
            /*5个头部总数据*/
            saleArray:{
                saleamt:'',  //月总销售额(千元)
                mom_saleamt_diff:'',  //增长量(千元)
                mom_comp_rate:'',  //环比(百分数)-增长幅度
                yoy_comp_rate:''  //同比(百分数)
            },
            purchaseArray:{
                pure_purchase:'',  //月总净进货额(千元)
                mom_comp_diff_pp:'',  //增长量(千元)
                mom_comp_rate_pp:'',  //环比(百分数)-增长幅度
                yoy_comp_rate_pp:''  //同比(百分数)
            },
            highStockArray:{
                high_stock_rate:'',  //高库存占比(百分数)
                mom_comp_diff:'',  //增长量(百分数)
                mom_comp_rate:'',  //环比(百分数)-增长幅度
                yoy_comp_rate:'',  //同比(百分数)
                yoy_high_stock_rate:'',  //去年同期
                mom_high_stock_rate:''  //上月同期
            },
            receiveArray:{
                rcv_rate:'',  //到货满足率(百分数)
                mom_comp_diff_rcv:'',  //增长量(百分数)
                mom_comp_rate_rcv:'',  //环比(百分数)-增长幅度
                yoy_comp_rate_rcv:'',  //同比(百分数)
                yoy_rcv_rate:'',  //去年同期
                mom_rcv_rate:''  //上月同期
            },
            returnArray:{
                return_rate:'',  //退货率(百分数)
                mom_comp_diff_rr:'',  //增长量(百分数)
                mom_comp_rate_rr:'',  //环比(百分数)-增长幅度
                yoy_comp_rate_rr:''  //同比(百分数)
            },
            /*左边5个图表总数据*/
            saleChart:{
                data:'',
                dates:''
            },
            purchaseChart:{
                data:'',
                dates:''
            },
            highStockChart:{
                data:'',
                dates:''
            },
            receiveChart:{
                data:'',
                dates:''
            },
            returnChart:{
                data:'',
                dates:''
            },
            /*右边图表数据集合*/
            rightChartData:{
                data:'',
                dates:''
            },
            emcList:[],
            tableList:[],
            goodName:'',
            goodSku:'',
            customerGoodName:''  //表格具体商品名
        },
        createRightData:{  //右边详情数据集合
            totalData:'',
            monthChange:'',  //增减量
            monthComOn:'',  //同比
            monthComChain:'',  //环比
            compassTime:''  //时间
        },
        createTableData:{
            tableList:[],
            total:'',
            pages:''
        },
        goods:{
            goodsSku:'',  //商品sku或商品名
            goodsEmc:''  //商品emc
        },
        pageNow:1,
        pageWatch:{
            order:'',
            sort_by:'',
            resize:false
        },
        modalInfo:{
            price:'',
            sale:'',
            num:'',
            stock:''
        },
        month:'',  //我的几月经营指标
        emcOrsku:'',  //查询的是emc还是sku
        selectOrInput:0,  //当前选择的是输入框0还是下拉框1
        goodVisibleCtrl:false,  //查询的是sku时显示商品名
        leftChartIndex:0,
        historyTimeStart:'',  //历史记录日历开始时间
        historyTimeType:'month',  //历史记录日历选择的是月month还是年year
        modalCanDate:'',  //弹窗日历时间
        modalCanDateType:'day',  //弹窗日历类型
        autoCompleteArray:[],  //自动联想
        site:{
            siteCode:'',
            siteName:''  //这个字段暂时留着,怕以后有用
        },
        leftChart:function(id,color,unit,normal,time,data,name){
            $('#'+id).html('');
            charts[id] = echarts.init(document.getElementById(id));
            var option = {
                color:[color],
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    top: 30,
                    left: 30,
                    right: 30,
                    bottom: 5,
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
                        name:unit,
                        nameTextStyle:{
                            fontSize:12,
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
                        name:name,
                        type:'line',
                        smooth:true,
                        //areaStyle:{
                        //    normal:normal
                        //},
                        data:data
                    }
                ]
            };
            charts[id].setOption(option);
            $(window).resize(function(){
                charts[id].resize();
            });
        },
        rightChart:function(color,unit,normal,time,data,name){
            $('#rightChart').html('');
            charts.rightChart=echarts.init(document.getElementById('rightChart'));
            var option = {
                color:[color],
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    top: 30,
                    left: 30,
                    right: 30,
                    bottom: 5,
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
                        name:unit,
                        nameTextStyle:{
                            fontSize:12,
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
                        name:name,
                        type:'line',
                        smooth:true,
                        //areaStyle:{
                        //    normal:normal
                        //},
                        data:data
                    }
                ]
            };
            charts.rightChart.setOption(option);
            $(window).resize(function(){
                charts.rightChart.resize();
            });
        },
        modalStockChart:function(id,time,data){
            $('#'+id).html('');
            var modalStockChart=echarts.init(document.getElementById(id));
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
                    left: 10,
                    right: 25,
                    bottom: 5,
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
                        name:'利润',
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
            modalStockChart.setOption(option);
            $(window).resize(function(){
                modalStockChart.resize();
            });
        },
        modalLineChart:function(time,data){
            $('#modalLineChart').html('');
            var modalLineChart = echarts.init(document.getElementById('modalLineChart'));
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
            modalLineChart.setOption(option);
            $(window).resize(function(){
                modalLineChart.resize();
            });
        },
        initFunc:function(){
            public.showLoading();
            /*清理输入框*/
            vm.goods.goodsSku='';
            /*左导航改变*/
            var sideBar=$('#compassSidebar');
            var sideBarLi=sideBar.find('li');
            var sideHref;
            sideBarLi.removeClass('list-blue');
            for(var sideNum=0;sideNum<sideBarLi.length;sideNum++){
                sideHref=sideBarLi.eq(sideNum).attr('data-href');
                if(sideHref=='businessIndicators'){
                    sideBarLi.eq(sideNum).addClass('list-blue');
                    sideBarLi.eq(sideNum).parent().slideDown(150);
                    break;
                }
            }
            vm.createDataArray.customerGoodName='';
            counter = 0;
            /*实际用这个start*/
            //var requestArray = [
            //    {type: 'get', url: urlMapping['get_compass_time'], data: {}, name: 'compassTime'},  //最新的数据时间
            //    {type: 'get', url: urlMapping['get_operate_day'], data: {type:'sale',date:''}, name: 'saleArray'},  //销售额指标
            //    {type: 'get', url: urlMapping['get_operate_day'], data: {type:'purchase',date:''}, name: 'purchaseArray'},  //净总进货额指标
            //    {type: 'get', url: urlMapping['get_operate_day'], data: {type:'high_stock',date:''}, name: 'highStockArray'},  //高库存占比指标
            //    {type: 'get', url: urlMapping['get_operate_day'], data: {type:'receive',date:''}, name: 'receiveArray'},  //到货满足率指标
            //    {type: 'get', url: urlMapping['get_operate_day'], data: {type:'return',date:''}, name: 'returnArray'},  //退货率指标
            //    {type: 'get', url: urlMapping['get_operate_days'], data: {type:'sale',time_type:'day',date:''}, name: 'saleChart'},  //销售额图表
            //    {type: 'get', url: urlMapping['get_operate_days'], data: {type:'purchase',time_type:'day',date:''}, name: 'purchaseChart'},  //净总进货额图表
            //    {type: 'get', url: urlMapping['get_operate_days'], data: {type:'high_stock',time_type:'day',date:''}, name: 'highStockChart'},  //高库存占比图表
            //    {type: 'get', url: urlMapping['get_operate_days'], data: {type:'receive',time_type:'day',date:''}, name: 'receiveChart'},  //到货满足率图表
            //    //{type: 'get', url: urlMapping['get_operate_days'], data: {type:'return',time_type:'day',date:''}, name: 'returnChart'},  //退货率图表
            //    {type: 'get', url: urlMapping['get_operate_days'], data: {type:'sale',time_type:'month',date: ''}, name: 'rightChartData', right:'right'},  //右边图表
            //    {type: 'get', url: urlMapping['get_emc_list'], data: {}, name: 'emcList'},  //商品月指标下拉框
            //    {type: 'get', url: urlMapping['get_emc_table'], data: {emc:'',date:'',sort_by:'amt',order:'desc',page:1}, name: 'tableList',emc:'emc'},  //商品月指标列表
            //    {type: 'get', url: urlMapping['get_complete_site'], data: {}, name: 'completeArray'}  //读取自动补全文件
            //];
            /*实际用这个end*/

            /*自己开发用这个start*/
            var requestArray = [
                {type: 'get', url: urlMapping['get_compass_time'], data: {}, name: 'compassTime'},  //最新的数据时间
                {type: 'get', url: urlMapping['get_operate_day1'], data: {type:'sale',date: ''}, name: 'saleArray'},  //销售额指标
                {type: 'get', url: urlMapping['get_operate_day2'], data: {type:'purchase',date: ''}, name: 'purchaseArray'},  //净总进货额指标
                {type: 'get', url: urlMapping['get_operate_day3'], data: {type:'high_stock',date: ''}, name: 'highStockArray'},  //高库存占比指标
                {type: 'get', url: urlMapping['get_operate_day4'], data: {type:'receive',date: ''}, name: 'receiveArray'},  //到货满足率指标
                {type: 'get', url: urlMapping['get_operate_day5'], data: {type:'return',date: ''}, name: 'returnArray'},  //退货率指标图表
                {type: 'get', url: urlMapping['get_operate_days1'], data: {type:'sale',time_type:'day',date: ''}, name: 'saleChart'},  //销售额图表
                {type: 'get', url: urlMapping['get_operate_days2'], data: {type:'purchase',time_type:'day',date: ''}, name: 'purchaseChart'},  //净总进货额图表
                {type: 'get', url: urlMapping['get_operate_days3'], data: {type:'high_stock',time_type:'day',date: ''}, name: 'highStockChart'},  //高库存占比图表
                {type: 'get', url: urlMapping['get_operate_days4'], data: {type:'receive',time_type:'day',date: ''}, name: 'receiveChart'},  //到货满足率图表
                //{type: 'get', url: urlMapping['get_operate_days5'], data: {type:'return',time_type:'day',date: ''}, name: 'returnChart'},  //退货率图表
                {type: 'get', url: urlMapping['get_operate_days6'], data: {type:'sale',time_type:'month',date: ''}, name: 'rightChartData', right:'right'},  //右边图表
                {type: 'get', url: urlMapping['get_emc_list'], data: {}, name: 'emcList'},  //商品月指标下拉框
                {type: 'get', url: urlMapping['get_emc_table'], data: {emc:'',date:'',sort_by:'amt',order:'desc',page:1}, name: 'tableList',emc:'emc'},  //商品月指标列表
                {type: 'get', url: urlMapping['get_complete_site'], data: {}, name: 'completeArray'}  //读取自动补全文件
            ];
            /*自己开发用这个end*/

            itorReqFunc(requestArray, function(){
                public.closeLoading();
                public.nodeReady({
                    elId:'tablePage',
                    callback:function(){
                        /*销售额图表*/
                        vm.leftChart('saleamtChart','#5584ff','千元',{
                            width:4
                            //color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            //        offset:0,
                            //        color:'#5584ff'
                            //    },{
                            //        offset:1,
                            //        color:'rgba(255,255,255,0.5)'
                            //    }]
                            //)
                        },vm.$model.createDataArray.saleChart.dates,vm.$model.createDataArray.saleChart.data,'当日销售额');
                        /*净总进货额图表*/
                        vm.leftChart('purchaseChart','#d05454','千元',{
                            width:4
                            //color: publicIE?'#fab6b6' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            //        offset:0,
                            //        color:'#f8a4a4'
                            //    },{
                            //        offset:1,
                            //        color:'rgba(255,255,255,0.5)'
                            //    }]
                            //)
                        },vm.$model.createDataArray.purchaseChart.dates,vm.$model.createDataArray.purchaseChart.data,'当日净进货额');
                        /*高库存占比图表*/
                        vm.leftChart('highStockChart','#5584ff','百分比',{
                            width:4
                            //color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            //        offset:0,
                            //        color:'#5584ff'
                            //    },{
                            //        offset:1,
                            //        color:'rgba(255,255,255,0.5)'
                            //    }]
                            //)
                        },vm.$model.createDataArray.highStockChart.dates,vm.$model.createDataArray.highStockChart.data,'当日高库存占比');
                        /*到货满足率图表*/
                        vm.leftChart('receiveChart','#d05454','百分比',{
                            width:4
                            //color: publicIE?'#fab6b6' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            //        offset:0,
                            //        color:'#f8a4a4'
                            //    },{
                            //        offset:1,
                            //        color:'rgba(255,255,255,0.5)'
                            //    }]
                            //)
                        },vm.$model.createDataArray.receiveChart.dates,vm.$model.createDataArray.receiveChart.data,'当日到货满足率');
                        /*退货率图表*/
                        //vm.leftChart('returnChart','#5584ff','百分比',{
                        //    width:4
                        //    //color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                        //    //        offset:0,
                        //    //        color:'#5584ff'
                        //    //    },{
                        //    //        offset:1,
                        //    //        color:'rgba(255,255,255,0.5)'
                        //    //    }]
                        //    //)
                        //},vm.$model.createDataArray.returnChart.dates,vm.$model.createDataArray.returnChart.data,'当日退货率');
                        /*右边数据同步为第一个图的相关详情*/
                        vm.createRightData.totalData=vm.$model.createDataArray.saleArray.saleamt;  //第一个图表的总额
                        vm.createRightData.monthChange=vm.$model.createDataArray.saleArray.mom_saleamt_diff;  //第一个图表的增减量
                        vm.createRightData.monthComOn=vm.$model.createDataArray.saleArray.yoy_comp_rate;  //第一个图表的同比
                        vm.createRightData.monthComChain=vm.$model.createDataArray.saleArray.mom_comp_rate;  //第一个图表的环比
                        /*右边图表*/
                        vm.rightChart('#5584ff','千元',{
                            width:4
                            //color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            //        offset:0,
                            //        color:'#5584ff'
                            //    },{
                            //        offset:1,
                            //        color:'rgba(255,255,255,0.5)'
                            //    }]
                            //)
                        },vm.$model.createDataArray.rightChartData.dates,vm.$model.createDataArray.rightChartData.data,'累计销售额');
                        /*同步下拉框*/
                        $('#goodSelect').val(vm.$model.createDataArray.emcList[0][0]);
                        vm.goods.goodsEmc=vm.$model.createDataArray.emcList[0][0];
                        /*商品月指标表格*/
                        vm.createTableData.tableList=vm.$model.createDataArray.tableList.data;
                        vm.createTableData.total=vm.$model.createDataArray.tableList.total;
                        vm.createTableData.pages=vm.$model.createDataArray.tableList.pages;
                        vm.emcOrsku='emc';
                        vm.pageWatch.order='desc';  //同步升序降序
                        vm.pageWatch.sort_by='amt';  //同步排名依据
                        /*我的几月经营指标*/
                        var nowMonth=vm.$model.createDataArray.compassTime.yesterday;
                        vm.month=parseInt(nowMonth.split('-')[1]);
                        /*日历初始化*/
                        initDateFunc('timepicker');
                        /*分页初始化*/
                        new RtlPaging({
                            size: vm.$model.createDataArray.tableList.pages,
                            el: "tablePage",
                            callback:function(data){
                                vm.pageNow=data;
                            }
                        });
                        /*商品月指标名称过长显示*/
                        var timer=setInterval(function(){
                            var length=$('#monthTable').find('tbody').find('tr').length;
                            if(length==vm.$model.createTableData.tableList.length){
                                $('[data-toggle="tooltip"]').tooltip();
                                clearInterval(timer);
                            }
                        },50);
                        /*选择门店弹窗显示消失*/
                        $('body').on('click',function(){
                            $('.rtl-menu-box').hide(0);
                        });
                        $('#siteModalChoice').on('click',function(e){
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
            });
        },
        chartEvt:function(evt){  //我干,这里的$target是canvas
            var $target=$(evt.target) || $(evt.element);
            var $index=$target.parents('.businessChartBox').index('.businessChartBox');
            var type,unit,color,graphicObj,name;
            initDateFunc('timepicker');  //切换日历
            if($index==vm.$model.leftChartIndex){  //左边点击的和右边展现的是同一个
                return;
            }
            public.showLoading();
            /*点击时默认传的时间为yesterday的上一个月*/
            var dateNow=vm.$model.createDataArray.compassTime.yesterday;
            var dateSplit=dateNow.split('-');
            //yesterday的月份往前减1个月
            var strMonth;
            if(dateSplit[1]*1-1>9){
                strMonth=String(dateSplit[1]*1-1);
            }else if(dateSplit[1]*1-1==0){
                strMonth='12';
            }else{
                strMonth='0'+String(dateSplit[1]*1-1);
            }
            var newTime=dateSplit[0]+'-'+strMonth;
            vm.createRightData.compassTime=newTime;  //更新日期
            if($index==0){
                $('#rightBoxTitle').text('当月总销售额');
                vm.createRightData.totalData=vm.$model.createDataArray.saleArray.saleamt;
                vm.createRightData.monthChange=vm.$model.createDataArray.saleArray.mom_saleamt_diff;
                vm.createRightData.monthComOn=vm.$model.createDataArray.saleArray.yoy_comp_rate;
                vm.createRightData.monthComChain=vm.$model.createDataArray.saleArray.mom_comp_rate;
                vm.leftChartIndex=0;
                type='sale';
                unit='千元';
                color='#5584ff';
                graphicObj={
                    width:4,
                    color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            offset:0,
                            color:'#5584ff'
                        },{
                            offset:1,
                            color:'rgba(255,255,255,0.5)'
                        }]
                    )
                };
                name='累计销售额';
            }else if($index==1){
                $('#rightBoxTitle').text('当月总净进货额');
                vm.createRightData.totalData=vm.$model.createDataArray.purchaseArray.pure_purchase;
                vm.createRightData.monthChange=vm.$model.createDataArray.purchaseArray.mom_comp_diff_rcv;
                vm.createRightData.monthComOn=vm.$model.createDataArray.purchaseArray.yoy_comp_rate_pp;
                vm.createRightData.monthComChain=vm.$model.createDataArray.purchaseArray.mom_comp_rate_pp;
                vm.leftChartIndex=1;
                type='purchase';
                unit='千元';
                color='#d05454';
                graphicObj={
                    width:4,
                    color: publicIE?'#fab6b6' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            offset:0,
                            color:'#f8a4a4'
                        },{
                            offset:1,
                            color:'rgba(255,255,255,0.5)'
                        }]
                    )
                };
                name='净进货额';
            }else if($index==2){
                $('#rightBoxTitle').text('当月高库存占比');
                vm.createRightData.totalData=vm.$model.createDataArray.highStockArray.high_stock_rate;
                vm.createRightData.monthChange=vm.$model.createDataArray.highStockArray.mom_comp_diff;
                vm.createRightData.monthComOn=vm.$model.createDataArray.highStockArray.yoy_comp_rate;
                vm.createRightData.monthComChain=vm.$model.createDataArray.highStockArray.mom_comp_rate;
                vm.leftChartIndex=2;
                type='high_stock';
                unit='百分比';
                color='#5584ff';
                graphicObj={
                    width:4,
                    color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            offset:0,
                            color:'#5584ff'
                        },{
                            offset:1,
                            color:'rgba(255,255,255,0.5)'
                        }]
                    )
                };
                name='高库存占比';
            }else if($index==3){
                $('#rightBoxTitle').text('当月到货满足率');
                vm.createRightData.totalData=vm.$model.createDataArray.receiveArray.rcv_rate;
                vm.createRightData.monthChange=vm.$model.createDataArray.receiveArray.mom_comp_diff_rcv;
                vm.createRightData.monthComOn=vm.$model.createDataArray.receiveArray.yoy_comp_rate_rcv;
                vm.createRightData.monthComChain=vm.$model.createDataArray.receiveArray.mom_comp_rate_rcv;
                vm.leftChartIndex=3;
                type='receive';
                unit='百分比';
                color='#d05454';
                graphicObj={
                    width:4,
                    color: publicIE?'#fab6b6' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            offset:0,
                            color:'#f8a4a4'
                        },{
                            offset:1,
                            color:'rgba(255,255,255,0.5)'
                        }]
                    )
                };
                name='到货满足率';
            }else if($index==4){
                $('#rightBoxTitle').text('当月退货率');
                vm.createRightData.totalData=vm.$model.createDataArray.returnArray.return_rate;
                vm.createRightData.monthChange=vm.$model.createDataArray.returnArray.mom_comp_diff_rr;
                vm.createRightData.monthComOn=vm.$model.createDataArray.returnArray.yoy_comp_rate_rr;
                vm.createRightData.monthComChain=vm.$model.createDataArray.returnArray.mom_comp_rate_rr;
                vm.leftChartIndex=4;
                type='return';
                unit='百分比';
                color='#5584ff';
                graphicObj={
                    width:4
                    //color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                    //        offset:0,
                    //        color:'#5584ff'
                    //    },{
                    //        offset:1,
                    //        color:'rgba(255,255,255,0.5)'
                    //    }]
                    //)
                };
                name='退货率';
            }
            /*
             *
            正式用这个urlMapping['get_operate_days']
            *
            */
            $.ajax({
                url:urlMapping['get_operate_days1'],  //urlMapping['get_operate_days1']
                type:'get',
                data:{
                    type:type,
                    time_type:'month',
                    date:newTime
                },
                dataType:'json',
                success:function(data){
                    public.closeLoading();
                    if(data){
                        vm.rightChart(color,unit,graphicObj,data.dates,data.data,name);
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    public.closeLoading();
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*点击下拉框或输入框*/
        disableEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $index=$target.index();
            $target.removeClass('form-search-disabled');
            if($index==0){  //点击的是输入框
                $('#goodSelect').addClass('form-search-disabled');
                vm.selectOrInput=0;
            }else{  //点击的是下拉框
                $('#goodInput').addClass('form-search-disabled').val('');
                vm.selectOrInput=1;
            }
        },
        /*表格查询*/
        tableSearch:function(){
            var selectOrInput=vm.$model.selectOrInput;
            var goodsSku= $.trim(vm.$model.goods.goodsSku);
            vm.goods.goodsEmc=$('#goodSelect').val();  //更新下拉框值
            var dataObj,url;
            if(selectOrInput==0){  //按sku查询
                if(goodsSku!=''){
                    dataObj={
                        sku:goodsSku,
                        date:vm.$model.createDataArray.compassTime.yesterday
                    };
                    url='get_sku_table';
                    vm.emcOrsku='sku';
                }else{
                    window.wxc.xcConfirm('请输入商品SKU', window.wxc.xcConfirm.typeEnum.warning);
                    //alert('请输入商品SKU');
                    return false;
                }
            }else{  //按emc查询
                dataObj={
                    emc:vm.$model.goods.goodsEmc,
                    date:vm.$model.createDataArray.compassTime.yesterday,
                    sort_by:'amt',
                    order:'desc',
                    page:1
                };
                url='get_emc_table';
                vm.emcOrsku='emc';
            }
            $('.businessSort').removeClass('desc asc').eq(0).addClass('desc');  //重置排序tr
            vm.pageWatch.order='desc';  //同步升序降序
            vm.pageWatch.sort_by='amt';  //同步排名依据
            vm.pageWatch.resize=true;
            public.showLoading();
            if(vm.$model.pageNow==1){
                getPageData(url,dataObj);
            }else{
                vm.pageNow=1;
            }
        },
        /*表格排序*/
        sortEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var rank,order,url,dataObj;
            rank = $target.attr('month-sort');
            $target.hasClass('desc')?
                $target.removeClass('desc').addClass('asc').parent('th').siblings().find('a').removeClass('desc asc'):
                $target.hasClass('asc')?
                    $target.removeClass('asc').addClass('desc').parent('th').siblings().find('a').removeClass('desc asc'):
                    $target.addClass('desc').parent('th').siblings().find('a').removeClass('desc asc');
            order = $target.hasClass('asc')?'asc': 'desc';
            vm.pageWatch.order=order;  //同步升序降序
            vm.pageWatch.sort_by=rank;  //同步排名依据
            vm.pageWatch.resize=true;
            if(vm.$model.emcOrsku=='emc'){
                url='get_emc_table';  //这里是为了防止sku可能是模糊查询会出现多条导致需求修改
                dataObj={
                    sort_by:rank,
                    order:order,
                    date:vm.$model.createDataArray.compassTime.yesterday,
                    page:1,
                    emc:vm.$model.goods.goodsEmc
                };
            }else{
                url='get_sku_table';
                dataObj={
                    sku:vm.$model.goods.goodsSku,
                    date:vm.$model.createDataArray.compassTime.yesterday
                };
            }
            var $length=vm.$model.createTableData.tableList.length;
            if($length<2){  //只有一条或0条不用排序
                return false;
            }
            public.showLoading();
            if(vm.$model.pageNow==1){
                getPageData(url,dataObj);
            }else{
                vm.pageNow=1;
            }
        },
        /*自动联想*/
        autoEvt:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $val= $.trim($target.val());
            var completeArray=vm.$model.createDataArray.completeArray;
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
        /*选择全部门店*/
        setSiteAll:function(){
            setTimeout(function(){
                $('.rtl-menu-box').hide(0);
            },200);
            $('#siteModalChoice').val('全部门店');
            vm.site.siteCode='';
        },
        /*选择单个门店*/
        setSiteOne:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $text=$target.text();
            $('#siteModalChoice').val($text);
            setTimeout(function(){
                $('.rtl-menu-box').hide(0);
            },200);
            vm.site.siteCode=$target.attr('value');
        },
        /*实时信息弹窗*/
        seeModalStock:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var goodName=$target.parent().siblings('.good-name').text();
            var sku=$target.parent().siblings('.good-sku').text();
            $('#siteModalChoice').val('');
            vm.createDataArray.goodName=goodName;
            vm.createDataArray.goodSku=sku;
            vm.site.siteCode='';
            vm.getModalStock('',sku);
        },
        /*实时信息选择门店确定*/
        modalStockSearch:function(){
            vm.getModalStock(vm.$model.site.siteCode,vm.$model.createDataArray.goodSku);
        },
        /*获取实时信息*/
        getModalStock:function(site,sku){
            $.ajax({
                url:urlMapping['get_merch_last'],
                type:'get',
                dataType:'json',
                data:{
                    site:site,
                    sku:sku,
                    hour:vm.createDataArray.compassTime.last_shop_hour
                },
                success:function(data){
                    if(data){
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
                        vm.modalInfo.price=data.price[0];
                        vm.modalInfo.sale=data.saleamt_day;
                        vm.modalInfo.num=data.salenum_day;
                        vm.modalStockChart('modalStock1',priceTime,data.price.reverse());
                        vm.modalStockChart('modalStock2',saleamtTime,data.saleamt.reverse());
                        vm.modalStockChart('modalStock3',salenumTime,data.salenum.reverse());
                        //for(var n=0;n<data.stock.length;n++){
                        //    stockTime.unshift(timeArray[n]);
                        //}
                        //vm.modalInfo.stock=data.stock[0];
                        //vm.modalStockChart('modalStock4',stockTime,data.stock.reverse());
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    public.closeLoading();
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*行情信息弹窗*/
        seeModalLine:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var goodName=$target.parent().siblings('.good-name').text();
            var sku=$target.parent().siblings('.good-sku').text();
            var time=vm.$model.createDataArray.compassTime.yesterday;
            new RtlCalendar('timepickerB',{
                checked: function () {
                    vm.modalCanDate=arguments[0]+'&'+arguments[1];
                    vm.modalCanDateType=arguments[2];
                },
                setDate: vm.$model.createDataArray.compassTime.yesterday+'&'+vm.$model.createDataArray.compassTime.yesterday,
                isModal:true,
                startDate: '2016/01/01',
                endDate: vm.$model.createDataArray.compassTime.yesterday,
                pull: 'right',
                format: 'DWMY'
            });
            vm.modalCanDate=vm.$model.createDataArray.compassTime.yesterday+'&'+vm.$model.createDataArray.compassTime.yesterday;
            vm.createDataArray.goodName=goodName;
            vm.createDataArray.goodSku=sku;
            vm.getModalLine(sku,'day',vm.$model.createDataArray.compassTime.yesterday);
        },
        /*行情信息确定*/
        modalLineSearch:function(){
            var date=vm.$model.modalCanDate;
            date=date.replace(/\//g,'-');
            var dateSplit=date.split('&');
            var typ=vm.$model.modalCanDateType;
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
            vm.getModalLine(vm.$model.createDataArray.goodSku,typ,date);
        },
        /*获取行情信息*/
        getModalLine:function(sku,type,date){
            $.ajax({
                url:urlMapping['get_good_trend'],
                type:'get',
                dataType:'json',
                data:{
                    sku:sku,
                    typ:type,
                    date:date
                },
                success:function(data){
                    if(data){
                        vm.modalLineChart(data.time,data.data);
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                        //alert('服务器错误');
                    }
                },
                error:function(){
                    public.closeLoading();
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        /*获取历史记录数据(点击日历旁边的确定)*/
        getHistoryData:function(){
            var historyTimeType=vm.$model.historyTimeType;
            var historyTimeStart=vm.$model.historyTimeStart;
            var leftChartIndex=vm.$model.leftChartIndex;
            var time_type,type,date,unit,color,graphicObj,name;
            /*日期类型判断*/
            if(historyTimeType=='month'){
                time_type='month';
                date=historyTimeStart.split('/')[0]+'-'+historyTimeStart.split('/')[1];
            }else if(historyTimeType=='year'){
                time_type='year';
                date=historyTimeStart.split('/')[0];
            }
            /*指标类型判断*/
            if(leftChartIndex==0){
                type='sale';
                unit='千元';
                color='#5584ff';
                graphicObj={
                    width:4,
                    color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            offset:0,
                            color:'#5584ff'
                        },{
                            offset:1,
                            color:'rgba(255,255,255,0.5)'
                        }]
                    )
                };
                name='累计销售额';
            }else if(leftChartIndex==1){
                type='purchase';
                unit='千元';
                color='#d05454';
                graphicObj={
                    width:4,
                    color: publicIE?'#fab6b6' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            offset:0,
                            color:'#f8a4a4'
                        },{
                            offset:1,
                            color:'rgba(255,255,255,0.5)'
                        }]
                    )
                };
                name='净销售额';
            }else if(leftChartIndex==2){
                type='high_stock';
                unit='百分比';
                color='#5584ff';
                graphicObj={
                    width:4,
                    color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            offset:0,
                            color:'#5584ff'
                        },{
                            offset:1,
                            color:'rgba(255,255,255,0.5)'
                        }]
                    )
                };
                name='高库存占比';
            }else if(leftChartIndex==3){
                type='receive';
                unit='百分比';
                color='#d05454';
                graphicObj={
                    width:4,
                    color: publicIE?'#fab6b6' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                            offset:0,
                            color:'#f8a4a4'
                        },{
                            offset:1,
                            color:'rgba(255,255,255,0.5)'
                        }]
                    )
                };
                name='到货满足率';
            }else{
                type='return';
                unit='百分比';
                color='#5584ff';
                graphicObj={
                    width:4
                    //color: publicIE?'#cedcff' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                    //        offset:0,
                    //        color:'#5584ff'
                    //    },{
                    //        offset:1,
                    //        color:'rgba(255,255,255,0.5)'
                    //    }]
                    //)
                };
                name='退货率';
            }
            public.showLoading();
            /*
             *
             正式用这个urlMapping['get_operate_days']
             *
             */
            $.ajax({
                url:urlMapping['get_operate_days6'],  //get_operate_days6
                type:'get',
                dataType:'json',
                data:{
                    type:type,
                    time_type:time_type,
                    date:date
                },
                success:function(data){
                    public.closeLoading();
                    if(data){
                        vm.rightChart(color,unit,graphicObj,data.dates,data.data,name);
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    public.closeLoading();
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        }
    });
    /*分页*/
    vm.$watch('pageNow',function(page){
        vm.pageNow=page;
        var url,dataObj;
        if(vm.$model.emcOrsku=='emc'){
            url='get_emc_table';  //这里是为了防止sku可能是模糊查询会出现多条导致需求修改
            dataObj={
                sort_by:vm.$model.pageWatch.sort_by,
                order:vm.$model.pageWatch.order,
                date:vm.$model.createDataArray.compassTime.yesterday,
                page:vm.$model.pageNow,
                emc:vm.$model.goods.goodsEmc
            };
        }else{
            url='get_sku_table';
            dataObj={
                sku:vm.$model.goods.goodsSku,
                date:vm.$model.createDataArray.compassTime.yesterday
            };
        }
        getPageData(url,dataObj);
    });
    var getPageData=function(url,dataObj){
        $.ajax({
            url:urlMapping[url],
            type:'get',
            dataType:'json',
            data:dataObj,
            success:function(data){
                public.closeLoading();
                if(data){
                    if(data.data){  //emc
                        vm.createTableData.tableList=data.data;
                        vm.createTableData.total=data.total;
                        vm.createTableData.pages=data.pages;
                        vm.goodVisibleCtrl=false;
                    }else{  //sku
                        if(data.sku_name==false){
                            vm.createTableData.tableList=[];
                            window.wxc.xcConfirm('查无此商品SKU或商品SKU不属于此供商卡号', window.wxc.xcConfirm.typeEnum.warning);
                            return false;
                        }
                        vm.createTableData.tableList=[data];
                        vm.createTableData.total=1;
                        vm.createTableData.pages=1;
                        vm.createDataArray.customerGoodName=data.sku_name;
                        vm.goodVisibleCtrl=true;  //显示商品名
                    }
                    if(vm.$model.pageWatch.resize){
                        new RtlPaging({  //分页重置
                            size: vm.$model.createTableData.pages,
                            el: "tablePage",
                            callback:function(data){
                                vm.pageNow=data;
                            }
                        });
                        vm.pageWatch.resize=false;
                    }
                    public.nodeReady({
                        elId:'tablePage',
                        callback:function(){
                            $('[data-toggle="tooltip"]').tooltip();
                        }
                    })
                }else{
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            },
            error:function(){
                public.closeLoading();
                window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
            }
        });
    };
    var initDateFunc = function(){
        var nowTime=vm.$model.createDataArray.compassTime.yesterday;
        nowTime=nowTime.replace(/\-/g,'/');
        var nowDate=new Date(nowTime);
        var pastDate=new Date(nowDate.getFullYear(), nowDate.getMonth(),0);
        var newTime=pastDate.getFullYear()+'/'+((pastDate.getMonth()+1)>9?(pastDate.getMonth()+1):('0'+(pastDate.getMonth()+1)))+'/01'+'&'+pastDate.getFullYear()+'/'+((pastDate.getMonth()+1)>9?(pastDate.getMonth()+1):('0'+(pastDate.getMonth()+1)))+'/'+(pastDate.getDate()<9?('0'+pastDate.getDate()):(pastDate.getDate()));
        vm.historyTimeStart=newTime;  //同步历史记录日历时间
        public.nodeReady({
            elId:'timepicker',
            callback:function(){
                new RtlCalendar('timepicker', {
                    checked: function () {
                        vm.historyTimeStart=arguments[0];
                        vm.historyTimeType=arguments[2];
                    },
                    setDate: newTime,
                    isModal:true,
                    startDate: '2016/01/01',
                    endDate: pastDate.getFullYear()+'/'+((pastDate.getMonth()+1)>9?(pastDate.getMonth()+1):('0'+(pastDate.getMonth()+1)))+'/'+(pastDate.getDate()<9?('0'+pastDate.getDate()):(pastDate.getDate())),  //日历初始化为yesterday的上个月
                    pull: 'right',
                    format: 'MY'
                });
            }
        });
    };
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
        if(arr[counter].right){  //我干,右边图表还要传yesterday的前一个月
            var dateNow=vm.$model.createDataArray.compassTime.yesterday;
            var dateSplit=dateNow.split('-');
            //yesterday的月份往前减1个月
            var strMonth;
            if(dateSplit[1]*1-1>9){
                strMonth=String(dateSplit[1]*1-1);
            }else if(dateSplit[1]*1-1==0){
                strMonth='12';
            }else{
                strMonth='0'+String(dateSplit[1]*1-1);
            }
            arr[counter].data.date = dateSplit[0]+'-'+strMonth;
            vm.createRightData.compassTime=arr[counter].data.date;  //右边日历时间同步
        }
        if(arr[counter].emc){  //商品月指标表格需要传入下拉列表的第一个
            var emc=vm.$model.createDataArray.emcList[0][0];
            arr[counter].data.emc=emc;
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
                vm.createDataArray[arr[counter].name] = data;  //这句话是为了让arr的日期与avalon的同步,它没有自动同步
                counter ++;
                if(counter == 1){
                    for(var i = 1;i < arr.length;i ++){
                        arr[i].data.date = vm.$model.createDataArray.compassTime.yesterday;
                    }
                }
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