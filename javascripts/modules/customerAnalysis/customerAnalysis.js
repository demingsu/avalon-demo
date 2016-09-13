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
        $id:'customerAnalysisCtrl',
        createData:{
            last_2hour:'',
            last_shop_hour:'',
            last_shop_hour_end:'',
            yesterday_end:'',
            yesterday:'',
            sku:'',
            customerGoodName:''
        },
        saleTime:{
            start:'',
            end:'',
            type:''
        },
        siteTime:{
            start:'',
            end:'',
            type:''
        },
        tableList:[],
        customerStockChart:function(id,title,data,name){
            $('#'+id).html('');
            var customerStockChart=echarts.init(document.getElementById(id));
            var option = {
                color:['#5584ff'],
                title:{
                    text:title,
                    textStyle:{
                        fontSize:14,
                        fontWeight:'normal',
                        color:'#222'
                    },
                    x:40,
                    y:10
                },
                tooltip: {
                    trigger: 'item',
                    formatter:function(data){
                        return data.seriesName+' : '+data.data+'%';
                    },
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left:30,
                    top:40,
                    right:75,
                    bottom:10,
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    axisTick:{
                        show:false
                    },
                    splitLine:{
                        lineStyle:{
                            color:'#d4dbe2',
                            type: 'dashed'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#d4dbe2'
                        }
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#666'
                        }
                    },
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    axisTick:{
                        show:false
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#d4dbe2'
                        }
                    },
                    axisLabel:{
                        formatter:function(name){
                            var $name=name.split('');
                            var newName='';
                            for(var i=0;i<$name.length;i++){
                                newName+=$name[i]+'\n';
                            }
                            return newName;
                        },
                        textStyle:{
                            color:'#666'
                        }
                    },
                    type: 'category',
                    data: [name]
                },
                series: data
            };
            customerStockChart.setOption(option);
            $(window).resize(function(){
                customerStockChart.resize();
            });
        },
        customerCircleChart:function(abnormalLegend,abnormalArray){
            $('#payChart').html('');
            var payChart = echarts.init(document.getElementById('payChart'));
            var option = {
                color:['#7d61f3','#859cf3','#fee06b','#ef5255','#5786fb','#45bcb1'],
                title:{
                    text:'购买方式',
                    textStyle:{
                        fontSize:14,
                        fontWeight:'normal',
                        color:'#222'
                    },
                    x:40,
                    y:10
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}'
                },
                legend: {
                    icon:'circle',
                    itemWidth:10,
                    itemHeight:10,
                    x:'65%',
                    y:'25%',
                    orient: 'vertical',
                    data:abnormalLegend
                },
                series: [
                    {
                        type:'pie',
                        radius: ['50%', '70%'],
                        center: ['40%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '16'
                                },
                                formatter:function(data){
                                    return data.name.split(' ')[0];
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:abnormalArray
                    }
                ]
            };
            payChart.setOption(option);
            $(window).resize(function(){
                payChart.resize();
            });
        },
        saleTimeChart:function(time,data){
            $('#saleTimeChart').html('');
            var saleTimeChart = echarts.init(document.getElementById('saleTimeChart'));
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
                    right: 60,
                    bottom: 0,
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
            saleTimeChart.setOption(option);
            $(window).resize(function(){
                saleTimeChart.resize();
            });
        },
        initFunc:function(){
            public.showLoading();
            var href=window.location.href;
            var sku=parseInt(href.split('sku=')[1]);
            $.ajax({
                url:urlMapping['get_compass_time'],
                type:'get',
                dataType:'json',
                data:{},
                success:function(data){
                    public.closeLoading();
                    public.nodeReady({
                        elId:'goodInputBox',
                        callback:function(){
                            if(isNaN(sku)){
                                $('#goodInputBox').val('');
                            }else{
                                $('#goodInputBox').val(sku);
                                vm.searchGoodEvt();
                            }
                        }
                    });
                    if(data){
                        vm.createData.yesterday=data.yesterday;
                        vm.createData.last_shop_hour=data.last_shop_hour;
                        vm.createData.last_2hour=data.last_2hour;
                        vm.createData.last_shop_hour_end=data.last_shop_hour_end;
                        vm.createData.yesterday_end=data.yesterday_end;
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        searchGoodEvt:function(){
            var goodName= $.trim($('#goodInputBox').val());
            vm.createData.sku=goodName;  //同步sku
            if(goodName!=''){
                public.showLoading();
                $.when(
                    $.ajax({
                        url:urlMapping['get_customer_percent'],
                        type:'get',
                        dataType:'json',
                        data:{
                            sku:goodName,
                            date:vm.$model.createData.yesterday
                        }
                    }),
                    $.ajax({
                        url:urlMapping['get_good_trend'],
                        type:'get',
                        dataType:'json',
                        data:{
                            sku:goodName,
                            typ:'day',
                            date:vm.$model.createData.yesterday
                        }
                    }),
                    $.ajax({
                        url:urlMapping['get_merch_rank'],
                        type:'get',
                        dataType:'json',
                        data:{
                            sku:goodName,
                            typ:'day',
                            date:vm.$model.createData.yesterday,
                            order:'desc'
                        }
                    })
                ).done(function(response1,response2,response3){
                    public.closeLoading();
                    var data1=response1[0],data2=response2[0],data3=response3[0];
                    if(data1.sku_name==false){
                        window.wxc.xcConfirm('查无此商品SKU或商品SKU不属于此供商卡号', window.wxc.xcConfirm.typeEnum.warning);
                        return false;
                    }
                    $('.good-main-box').css({  //要先加载div，不然IE8下面有问题
                        visibility:'visible',
                        height:'auto'
                    });
                    vm.createData.customerGoodName=data1.sku_name;
                    var sex,age,member,pay;
                    /*性别图表*/
                    sex=data1.sex;
                    var sexArray=[];
                    for(var i=0;i<sex.names.length;i++){
                        sexArray.push({
                            barMaxWidth:30,
                            name: sex.names[i],
                            type: 'bar',
                            itemStyle : {
                                normal: {
                                    label : {
                                        show: true,
                                        position: 'right',
                                        textStyle:{
                                            color:'#222'
                                        },
                                        formatter:function(data){
                                            return data.seriesName+':'+data.data+'%';
                                        }
                                    }
                                }
                            },
                            data: [sex.values[i]]
                        });
                    }
                    /*年龄图表*/
                    age=data1.age;
                    var ageArray=[];
                    for(var j=0;j<age.names.length;j++){
                        ageArray.push({
                            barMaxWidth:30,
                            name: age.names[j],
                            type: 'bar',
                            itemStyle : {
                                normal: {
                                    label : {
                                        show: true,
                                        position: 'right',
                                        textStyle:{
                                            color:'#222'
                                        },
                                        formatter:function(data){
                                            return data.seriesName+':'+data.data+'%';
                                        }
                                    }
                                }
                            },
                            data: [age.values[j]]
                        });
                    }
                    /*等级图表*/
                    member=data1.member;
                    var memberArray=[];
                    for(var m=0;m<member.names.length;m++){
                        memberArray.push({
                            barMaxWidth:30,
                            name: member.names[m],
                            type: 'bar',
                            itemStyle : {
                                normal: {
                                    label : {
                                        show: true,
                                        position: 'right',
                                        textStyle:{
                                            color:'#222'
                                        },
                                        formatter:function(data){
                                            return data.seriesName+':'+data.data+'%';
                                        }
                                    }
                                }
                            },
                            data: [member.values[m]]
                        });
                    }
                    /*购买方式图表*/
                    pay=data1.pay;
                    var payArray=[],payLegend=[];
                    for(var n=0;n<pay.names.length;n++){
                        payLegend.push(pay.names[n]+' '+pay.values[n]+'%');
                        payArray.push({
                            name:pay.names[n]+' '+pay.values[n]+'%',
                            value:pay.values[n]
                        });
                    }
                    public.nodeReady({
                        elId:'sexChart',
                        callback:function(){
                            public.closeLoading();
                            /*加载消费时间分布日历*/
                            vm.saleTime.start=vm.$model.createData.yesterday;
                            vm.saleTime.end=vm.$model.createData.yesterday;
                            vm.saleTime.type='day';
                            new RtlCalendar('timepicker', {
                                checked: function () {
                                    vm.saleTime.start=arguments[0];
                                    vm.saleTime.end=arguments[1];
                                    vm.saleTime.type=arguments[2];
                                },
                                isModal:true,
                                setDate: vm.$model.createData.yesterday+'&'+vm.$model.createData.yesterday,
                                startDate: '2016/01/01',
                                endDate: vm.$model.createData.yesterday,
                                pull: 'right',
                                format: 'DWMY'
                            });
                            /*加载门店销售量排行日历*/
                            vm.siteTime.start=vm.$model.createData.yesterday;
                            vm.siteTime.end=vm.$model.createData.yesterday;
                            vm.siteTime.type='day';
                            new RtlCalendar('timepicker2', {
                                checked: function () {
                                    vm.siteTime.start=arguments[0];
                                    vm.siteTime.end=arguments[1];
                                    vm.siteTime.type=arguments[2];
                                },
                                isModal:true,
                                setDate: vm.$model.createData.yesterday+'&'+vm.$model.createData.yesterday,
                                startDate: '2016/01/01',
                                endDate: vm.$model.createData.yesterday,
                                pull: 'right',
                                format: 'DWMY'
                            });
                            vm.customerStockChart('sexChart','性别构成',sexArray,'性别');
                            vm.customerStockChart('ageChart','年龄构成',ageArray,'年龄');
                            vm.customerStockChart('levelChart','会员等级',memberArray,'会员等级');
                            vm.customerCircleChart(payLegend,payArray);
                            vm.saleTimeChart(data2.time,data2.data);
                            vm.tableList=data3;
                            /*表格下拉框加载*/
                            $('#customerTableList').off('click').on('click', 'li[rtl-select]', function (e) {
                                e.preventDefault();
                                var that = $(this);
                                var _attr = that.attr('rtl-select');
                                var ul = that.parents('ul[sort-box="sort"]');
                                that.addClass('active').siblings('li').removeClass('active');
                                ul.slideToggle('fast');
                                $('.i-sort-box').removeClass('sort-up');
                                var oldAttr = that.parents('ul[sort-box="sort"]').attr('rtl-old-select');
                                if (_attr != oldAttr) {
                                    ul.attr('rtl-old-select', _attr);
                                    var order;
                                    if (_attr == 'up') {
                                        /*do something here*/
                                        order='desc';
                                    } else {
                                        /*do something here*/
                                        order='asc';
                                    }
                                    $('.sort').removeClass('desc asc');
                                    vm.saleAreaEvt(order);
                                } else {
                                    return false;
                                }
                            }).on('click', 'i[sort-icon="sort"]', function (e) {
                                e.preventDefault();
                                $('.i-sort-box').toggleClass('sort-up');
                                $('ul[sort-box="sort"]').slideToggle('fast');
                            }).on('click', function (e) {
                                var ul = 'ul[sort-box="sort"]';
                                var tar = $(e.target).parents('div[rtl-select-box="box"]')[0];
                                if (!tar && $(ul).is(':visible') === true) {
                                    $(ul).slideToggle('fast');
                                    $('.i-sort-box').removeClass('sort-up');
                                }
                            });
                        }
                    });
                }).fail(function(){
                    public.closeLoading();
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                });
            }else{
                window.wxc.xcConfirm('请输入商品SKU', window.wxc.xcConfirm.typeEnum.warning);
            }
        },
        saleTimeEvt:function(){
            var date=vm.$model.saleTime.start;
            date=date.replace(/\//g,'-');
            var typ=vm.$model.saleTime.type;
            var newDate;
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
            $.ajax({
                url:urlMapping['get_good_trend'],
                type:'get',
                dataType:'json',
                data:{
                    sku:vm.$model.createData.sku,
                    typ:typ,
                    date:newDate
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.saleTimeChart(data.time,data.data);
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        saleAreaEvt:function(state){
            var order=state;
            var date=vm.$model.siteTime.start;
            date=date.replace(/\//g,'-');
            var typ=vm.$model.siteTime.type;
            var newDate;
            if(typ=='day'){
                newDate=date.substr(0,10);
                typ='day';
            }
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
            $.ajax({
                url:urlMapping['get_merch_rank'],
                type:'get',
                dataType:'json',
                data:{
                    sku:vm.$model.createData.sku,
                    typ:typ,
                    date:newDate,
                    order:order
                },
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                },
                success:function(data){
                    if(data){
                        vm.tableList=data;
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        tableSort:function(evt){
            var tableList=vm.$model.tableList;
            var $target=$(evt.target) || $(evt.element);
            if($target.hasClass('desc')){
                vm.tableList=tableList.sort(function(a,b){
                    return Math.abs(a.rank_change)- Math.abs(b.rank_change);
                });
                $target.removeClass('desc').addClass('asc');
            }else if($target.hasClass('asc')){
                vm.tableList=tableList.sort(function(a,b){
                    return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                });
                $target.removeClass('asc').addClass('desc');
            }else{
                vm.tableList=tableList.sort(function(a,b){
                    return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                });
                $target.addClass('desc');
            }
            $('.select-li').removeClass('active');
        }
    });
    return vm;
});