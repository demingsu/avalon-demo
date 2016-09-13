define(['avalon','public','echarts','urlMapping','xcConfirm'],function(avalon,public,echarts,urlMapping,xcConfirm){
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
        $id:'homeCtrl',
        createData:{
            last_2hour:'',
            last_shop_hour:'',
            last_shop_hour_end:'',
            yesterday:'',
            yesterday_end:'',
            highStock:'',  //高库存占比
            rcvRate: '',  //到货满足率
            returnRate: '',  //退货率
            totalSale:'',  //总销售额
            lastTotalSale:'',  //总销售额上月同期
            totalCost:'',  //总净进货额
            lastTotalCost:'',  //总净进货额上月同期
            saleamtArray:[],  //月销售总额数组
            purchaseArray:[],  //月总净进货额数组
            twoHours:'',  //最近时间段
            twoHoursSale:'',  //最近时间段销售总额
            tabTableList:[],  //畅销商品列表
            abnormalPercent:'',  //所有异常商品占所有商品种类的百分比
            customerGoodName:'',
            customerGoodSku:'',
            infoList:[],  //罗盘信息
            bigDataId:'',  //大数据应用案例
            bigDataTitle:'',
            bigDataCount:''
        },
        weather:[
            {
                'wid': '00',
                'big':'qing-big.png',
                'small':'qing-small.png',
                'weather': '晴'
            },
            {
                'wid': '01',
                'big':'duoyun-big.png',
                'small':'duoyun-small.png',
                'weather': '多云'
            },
            {
                'wid': '02',
                'big':'yin-big.png',
                'small':'yin-small.png',
                'weather': '阴'
            },
            {
                'wid': '03',
                'big':'',
                'small':'',
                'weather': '阵雨'
            },
            {
                'wid': '04',
                'big':'leizhenyu-big.png',
                'small':'leizhenyu-small.png',
                'weather': '雷阵雨'
            },
            {
                'wid': '05',
                'big':'leizhenyubingbao-big.png',
                'small':'leizhenyubingbao-small.png',
                'weather': '雷阵雨伴有冰雹'
            },
            {
                'wid': '06',
                'big':'yuxue-big.png',
                'small':'yuxue-small.png',
                'weather': '雨夹雪'
            },
            {
                'wid': '07',
                'big':'xiaoyu-big.png',
                'small':'xiaoyu-small.png',
                'weather': '小雨'
            },
            {
                'wid': '08',
                'big':'zhongyu-big.png',
                'small':'zhongyu-small.png',
                'weather': '中雨'
            },
            {
                'wid': '09',
                'big':'',
                'small':'',
                'weather': '大雨'
            },
            {
                'wid': '10',
                'big':'baoyu-big.png',
                'small':'baoyu-small.png',
                'weather': '暴雨'
            },
            {
                'wid': '11',
                'big':'baoyudabaoyu-big.png',
                'small':'baoyudabaoyu-small.png',
                'weather': '大暴雨'
            },
            {
                'wid': '12',
                'big':'baoyutedabaoyu-big.png',
                'small':'baoyutedabaoyu-small.png',
                'weather': '特大暴雨'
            },
            {
                'wid': '13',
                'big':'',
                'small':'',
                'weather': '阵雪'
            },
            {
                'wid': '14',
                'big':'xiaoxue-big.png',
                'small':'xiaoxue-small.png',
                'weather': '小雪'
            },
            {
                'wid': '15',
                'big':'zhongxue-big.png',
                'small':'zhongxue-small.png',
                'weather': '中雪'
            },
            {
                'wid': '16',
                'big':'daxue-big.png',
                'small':'daxue-small.png',
                'weather': '大雪'
            },
            {
                'wid': '17',
                'big':'baoxue-big.png',
                'small':'baoxue-small.png',
                'weather': '暴雪'
            },
            {
                'wid': '18',
                'big':'wu-big.png',
                'small':'wu-small.png',
                'weather': '雾'
            },
            {
                'wid': '19',
                'big':'dongyu-big.png',
                'small':'dongyu-small.png',
                'weather': '冻雨'
            },
            {
                'wid': '20',
                'big':'shachenbao-big.png',
                'small':'shachenbao-small.png',
                'weather': '沙尘暴'
            },
            {
                'wid': '21',
                'big':'',
                'small':'',
                'weather': '小雨-中雨'
            },
            {
                'wid': '22',
                'big':'',
                'small':'',
                'weather': '中雨-大雨'
            },
            {
                'wid': '23',
                'big':'dayubaoyu-big.png',
                'small':'dayubaoyu-small.png',
                'weather': '大雨-暴雨'
            },
            {
                'wid': '24',
                'big':'baoyudabaoyu-big.png',
                'small':'baoyudabaoyu-small.png',
                'weather': '暴雨-大暴雨'
            },
            {
                'wid': '25',
                'big':'',
                'small':'',
                'weather': '大暴雨-特大暴雨'
            },
            {
                'wid': '26',
                'big':'xiaoxuezhongxue-big.png',
                'small':'xiaoxuezhongxue-small.png',
                'weather': '小雪-中雪'
            },
            {
                'wid': '27',
                'big':'zhongxuebaoxue-big.png',
                'small':'zhongxuebaoxue-small.png',
                'weather': '中雪-大雪'
            },
            {
                'wid': '28',
                'big':'daxuebaoxue-big.png',
                'small':'daxuebaoxue-small.png',
                'weather': '大雪-暴雪'
            },
            {
                'wid': '29',
                'big':'fuchen-big.png',
                'small':'fuchen-small.png',
                'weather': '浮尘'
            },
            {
                'wid': '30',
                'big':'yangsha-big.png',
                'small':'yangsha-small.png',
                'weather': '扬沙'
            },
            {
                'wid': '31',
                'big':'qiangshachenbao-big.png',
                'small':'qiangshachenbao-small.png',
                'weather': '强沙尘暴'
            },
            {
                'wid': '53',
                'big':'mai-big.png',
                'small':'mai-small.png',
                'weather': '霾'
            }
        ],
        weatherArray:{
            top:{
                weather:'',
                temp:'',
                left:'',
                right:''
            },
            bottom:[]
        },
        homeMonthChart:function(time,saleamtArray,purchaseArray){
            $('#homeMonthChart').html('');
            var homeMonthChart = echarts.init(document.getElementById('homeMonthChart'));
            var option = {
                animation:true,
                color:['#5584ff','#d05454'],
                tooltip : {
                    trigger: 'axis'
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
                        name:'千元',
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
                        name:'月总销售额',
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
                        data:saleamtArray
                    },
                    {
                        name:'月总净进货额',
                        type:'line',
                        smooth:true,
                        areaStyle:{
                            normal:{
                                width:4,
                                color: publicIE?'#fab6b6' : new echarts.graphic.LinearGradient(0,0,0,0.8,[{
                                        offset:0,
                                        color:'#f8a4a4'
                                    },{
                                        offset:1,
                                        color:'rgba(255,255,255,0.5)'
                                    }]
                                )
                            }
                        },
                        data:purchaseArray
                    }
                ]
            };
            homeMonthChart.setOption(option);
            $(window).resize(function(){
                homeMonthChart.resize();
            });
        },
        homeSalesChart:function(time,data){
            $('#homeSalesChart').html('');
            var homeSalesChart = echarts.init(document.getElementById('homeSalesChart'));
            var option = {
                color:['#b7cbfe'],
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    top: 6,
                    left: 15,
                    right: 25,
                    bottom: 0,
                    containLabel: true
                },
                xAxis : [
                    {
                        axisLine:{
                            lineStyle:{
                                color:'#9ab6ff'
                            }
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#fff',
                                fontSize:12
                            }
                            //formatter:function(data){
                            //    var label=data.split('~');
                            //    if(publicIE){
                            //        return label[0]+'~'+label[1];
                            //    }else{
                            //        return label[0]+'\n'+'~'+'\n'+label[1];
                            //    }
                            //}
                        },
                        splitLine:{
                            show:false
                        },
                        type : 'category',
                        boundaryGap : false,
                        data : time
                    }
                ],
                yAxis : [
                    {
                        axisLine:{
                            show:false
                        },
                        axisTick:{
                            show:false
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#fff'
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
                        name:'总销售额',
                        type:'line',
                        smooth:true,
                        areaStyle:{
                            normal:{
                                width:4,
                                color: publicIE?'#356bf0':new echarts.graphic.LinearGradient(0,0,0,1,[{
                                        offset:0,
                                        color:'#2853BA'
                                    },{
                                        offset:1,
                                        color:'rgba(69,113,230,0.5)'
                                    }]
                                )
                            }
                        },
                        data:data
                    }
                ]
            };
            homeSalesChart.setOption(option);
            $(window).resize(function(){
                homeSalesChart.resize();
            });
        },
        homeAbnormalGoodsChart:function(abnormalLegend,abnormalArray){
            $('#homeAbnormalGoodsChart').html('');
            var homeAbnormalGoodsChart = echarts.init(document.getElementById('homeAbnormalGoodsChart'));
            var option = {
                color:['#7d61f3','#859cf3','#fee06b','#ef5255','#5786fb','#45bcb1'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}'
                },
                legend: {
                    icon:'circle',
                    itemWidth:10,
                    itemHeight:10,
                    x:'70%',
                    y:'40%',
                    orient: 'vertical',
                    data:abnormalLegend
                },
                series: [
                    {
                        type:'pie',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '20'
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
            homeAbnormalGoodsChart.setOption(option);
            $(window).resize(function(){
                homeAbnormalGoodsChart.resize();
            });
        },
        customerStockChart:function(id,data,name){
            $('#'+id).html('');
            var customerStockChart=echarts.init(document.getElementById(id));
            var option = {
                color:['#5584ff'],
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
                    left:10,
                    top:10,
                    right:100,
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
        getAbnormal:function(){  //异常饼图
            public.showLoading();
            $.ajax({
                url:urlMapping['get_compass_abnormal'],
                type:'get',
                data:{
                    'date':vm.$model.createData.yesterday
                },
                dataType:'json',
                success:function(data){
                    public.closeLoading();
                    if(data){
                        vm.createData.abnormalPercent=data.percent;
                        var abnormalLegend=[],abnormalArray=[];
                        for(var j=0;j<data.status.length;j++){
                            switch (data.status[j]){
                                case 'Z':
                                    abnormalLegend.push('滞销异常 '+data.values[j]+'%');
                                    abnormalArray.push({
                                        value:data.values[j],
                                        name:'滞销异常 '+data.values[j]+'%',
                                        key:data.status[j]
                                    });
                                    break;
                                case 'C':
                                    abnormalLegend.push('畅缺异常 '+data.values[j]+'%');
                                    abnormalArray.push({
                                        value:data.values[j],
                                        name:'畅缺异常 '+data.values[j]+'%',
                                        key:data.status[j]
                                    });
                                    break;
                                case 'G':
                                    abnormalLegend.push('高库存异常 '+data.values[j]+'%');
                                    abnormalArray.push({
                                        value:data.values[j],
                                        name:'高库存异常 '+data.values[j]+'%',
                                        key:data.status[j]
                                    });
                                    break;
                                case 'L':
                                    abnormalLegend.push('零库存正常状态商品 '+data.values[j]+'%');
                                    abnormalArray.push({
                                        value:data.values[j],
                                        name:'零库存正常状态商品 '+data.values[j]+'%',
                                        key:data.status[j]
                                    });
                                    break;
                            }
                        }
                        vm.homeAbnormalGoodsChart(abnormalLegend,abnormalArray);
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
        getCustomer:function(){  //顾客画像
            public.showLoading();
            $.ajax({
                type:'get',
                url:urlMapping['get_customer_index'],
                data:{
                    'date':vm.$model.createData.yesterday
                },
                dataType:'json',
                success:function(data){
                    public.closeLoading();
                    if(data){
                        vm.createData.customerGoodName=data.sku_name;
                        vm.createData.customerGoodSku=data.sku;
                        var sex,age,member,pay;
                        /*性别图表*/
                        sex=data.sex;
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
                        age=data.age;
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
                        member=data.member;
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
                        pay=data.pay;
                        var payArray=[],payLegend=[];
                        for(var n=0;n<pay.names.length;n++){
                            payLegend.push(pay.names[n]+' '+pay.values[n]+'%');
                            payArray.push({
                                name:pay.names[n]+' '+pay.values[n]+'%',
                                value:pay.values[n]
                            });
                        }
                        vm.customerStockChart('sexChart',sexArray,'性别');
                        vm.customerStockChart('ageChart',ageArray,'年龄');
                        vm.customerStockChart('levelChart',memberArray,'会员等级');
                        vm.customerCircleChart(payLegend,payArray);
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
        initFunc:function(){
            public.showLoading();
            public.ajaxDataFetch({
                url:'get_compass_time',
                data:{},
                callback:function(data){
                    if(data){
                        vm.createData.last_2hour=data.last_2hour;
                        vm.createData.last_shop_hour=data.last_shop_hour;
                        vm.createData.last_shop_hour_end=data.last_shop_hour_end;
                        vm.createData.yesterday=data.yesterday;
                        vm.createData.yesterday_end=data.yesterday_end;
                        $.when(
                            $.ajax({
                                url:urlMapping['get_compass'],
                                type:'get',
                                data:{
                                    date:vm.$model.createData.yesterday
                                },
                                dataType:'json'
                            }),
                            $.ajax({
                                url:urlMapping['get_compass_twoHours'],
                                type:'get',
                                data:{
                                    '2hour':vm.$model.createData.last_2hour
                                },
                                dataType:'json'
                            }),
                            $.ajax({
                                url:urlMapping['get_compass_topTen'],
                                type:'get',
                                data:{
                                    date:vm.$model.createData.yesterday
                                },
                                dataType:'json'
                            }),
                            $.ajax({
                                url:urlMapping['get_notice_index'],
                                type:'get',
                                data:{},
                                dataType:'json'
                            }),
                            $.ajax({
                                url:urlMapping['get_bigdata_index'],
                                type:'get',
                                data:{},
                                dataType:'json'
                            }),
                            $.ajax({
                                url:urlMapping['get_compass_weather'],
                                type:'get',
                                dataType:'json',
                                data:{}
                            })
                        ).done(function(response1,response2,response3,response4,response5,response6){
                            public.closeLoading();
                            var data1=response1[0],data2=response2[0],data3=response3[0],data4=response4[0],data5=response5[0],data6=response6[0];
                            /*月数据*/
                            vm.createData.highStock=data1.high_stock+'%';
                            vm.createData.rcvRate=data1.rcv_rate+'%';
                            vm.createData.returnRate=data1.return_rate+'%';
                            vm.createData.totalSale=data1.saleamt.day_data;
                            vm.createData.lastTotalSale=data1.saleamt.last_month_same_day;
                            vm.createData.totalCost=data1.purchase.day_data;
                            vm.createData.lastTotalCost=data1.purchase.last_month_same_day;
                            vm.createData.saleamtArray=data1.saleamt.days_data;
                            vm.createData.purchaseArray=data1.purchase.days_data;
                            var saleamtArray=data1.saleamt.days_data;
                            var purchaseArray=data1.purchase.days_data;
                            var timeLineArray=[];
                            var timeSplit=vm.$model.createData.yesterday;
                            var timeLineMonth=timeSplit.split('-')[1];  //取月份
                            for(var i=0;i<saleamtArray.length;i++){
                                if(i<9){
                                    timeLineArray.push(timeLineMonth+'-0'+(i+1));
                                }else{
                                    timeLineArray.push(timeLineMonth+'-'+(i+1));
                                }
                            }
                            /*每2小时销售额*/
                            var homeSalesArray=data2.saleamt;
                            var homeSalesTime=data2.time;
                            vm.createData.twoHoursSale=data2.total_saleamt;
                            vm.createData.twoHours=data2.last_2hour;
                            /*周热销商品*/
                            vm.createData.tabTableList=data3;
                            /*罗盘信息*/
                            vm.createData.infoList=data4;
                            /*最新一条大数据应用案例*/
                            vm.createData.bigDataId=data5.newestNews.id;
                            vm.createData.bigDataTitle=data5.newestNews.title;
                            vm.createData.bigDataCount=data5.count;
                            /*天气*/
                            var weatherAll=vm.$model.weather;
                            var weatherAllLength=weatherAll.length;
                            //比较天气的时候记住只能比较图，其他的都照后台返回的来
                            vm.weatherArray.bottom=[];  //用了push就要把数组置空
                            for(var m=0;m<data6.length;m++){
                                for(var n=0;n<weatherAllLength;n++){
                                    if(m==0){
                                        vm.weatherArray.top.weather=data6[m].weather;
                                        vm.weatherArray.top.temp=data6[m].temperature;
                                        var topWeather=data6[m].weather;
                                        var topLeft=topWeather.split('转')[0];
                                        var topRight=topWeather.split('转')[1];
                                        if(topLeft==weatherAll[n].weather){
                                            if(weatherAll[n].big!=''){
                                                vm.weatherArray.top.left='.../../images/weather/'+weatherAll[n].big;
                                            }else{
                                                vm.weatherArray.top.left=false;
                                            }
                                        }
                                        if(topRight==weatherAll[n].weather){
                                            if(weatherAll[n].big!=''){
                                                vm.weatherArray.top.right='.../../images/weather/'+weatherAll[n].big;
                                            }else{
                                                vm.weatherArray.top.right=false;
                                            }
                                        }
                                    }
                                }
                                if(m!=0){
                                    vm.weatherArray.bottom.push({
                                        weather:data6[m].weather,
                                        week:data6[m].week,
                                        temp:data6[m].temperature
                                    });
                                }
                            }
                            var newBottom=vm.$model.weatherArray.bottom;
                            var newBottomLeft='';
                            var newBottomRight='';
                            for(var j=0;j<newBottom.length;j++){
                                for(var k=0;k<weatherAllLength;k++){
                                    var newBottomWeather=newBottom[j].weather;
                                    newBottomLeft=newBottomWeather.split('转')[0];
                                    newBottomRight=newBottomWeather.split('转')[1];
                                    if(newBottomLeft==weatherAll[k].weather){
                                        if(weatherAll[k].small!=''){
                                            newBottom[j].left='.../../images/weather/'+weatherAll[k].small;
                                        }else{
                                            newBottom[j].left=false;
                                        }
                                    }
                                    if(newBottomRight==weatherAll[k].weather){
                                        if(weatherAll[k].small!=''){
                                            newBottom[j].right='.../../images/weather/'+weatherAll[k].small;
                                        }else{
                                            newBottom[j].right=false;
                                        }
                                    }
                                }
                            }
                            vm.weatherArray.bottom=newBottom;
                            /*最后再加载图表数据*/
                            public.nodeReady({
                                elId:'homeMonthChart',
                                callback:function(){
                                    $('.big-data-ellipsis').html(data5.newestNews.context);
                                    vm.homeMonthChart(timeLineArray,saleamtArray,purchaseArray);
                                    vm.homeSalesChart(homeSalesTime,homeSalesArray);
                                    /*案例内容过长省略号*/
                                    $(".big-data-ellipsis").each(function(){
                                        var $p = $(this);
                                        while ($p.height() > 90) {  //50是自己根据两行文字高度确定的
                                            $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
                                        }
                                    });
                                    /*实时商品排行榜名称过长显示*/
                                    $('[data-toggle="tooltip"]').tooltip();
                                    /*免责声明*/
                                    $('#myRelief').modal({keyboard:false});
                                }
                            });
                        }).fail(function(){
                            public.closeLoading();
                            window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                            //alert('服务器错误');
                        });
                    }else{
                        public.closeLoading();
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                }
            });
        },
        tableSortEvt:function(evt){
            var tableList=vm.$model.createData.tabTableList;
            var $target=$(evt.target) || $(evt.element);
            var $index=$target.parent().index();
            if($index==1){  //销售额
                if($target.hasClass('desc')){
                    vm.createData.tabTableList=tableList.sort(function(a,b){
                         return a.saleamt- b.saleamt;
                    });
                    $('.sort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.tabTableList=tableList.sort(function(a,b){
                        return b.saleamt- a.saleamt;
                    });
                    $('.sort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{  //这种情况是指本来是在排名变化，但是现在点击了销售额
                    vm.createData.tabTableList=tableList.sort(function(a,b){
                        return b.saleamt- a.saleamt;
                    });
                    $('.sort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
            if($index==4){  //排名变化
                if($target.hasClass('desc')){
                    vm.createData.tabTableList=tableList.sort(function(a,b){
                        return Math.abs(a.rank_change)- Math.abs(b.rank_change);
                    });
                    $('.sort').removeClass('desc asc');
                    $target.addClass('asc');
                }else if($target.hasClass('asc')){
                    vm.createData.tabTableList=tableList.sort(function(a,b){
                        return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                    });
                    $('.sort').removeClass('desc asc');
                    $target.removeClass('asc').addClass('desc');
                }else{    //这种情况是指本来是在销售额，但是现在点击了排名变化
                    vm.createData.tabTableList=tableList.sort(function(a,b){
                        return Math.abs(b.rank_change)- Math.abs(a.rank_change);
                    });
                    $('.sort').removeClass('desc asc');
                    $target.addClass('desc');
                }
            }
        },
        /*进入经营指标*/
        goBusinessIndicators:function(){
            var _href = window.location.href;
            window.location.href = _href.substring(0, _href.indexOf(".html") + 5) + "#!/businessIndicators" + '&_'+new Date().getTime();
        },
        /*进入商品分析*/
        goCommodityAnalysis:function(){
            var _href = window.location.href;
            window.location.href = _href.substring(0, _href.indexOf(".html") + 5) + "#!/commodityAnalysis" + '&_'+new Date().getTime();
        },
        /*切换卡进入相应页面*/
        goDetailHtml:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var $index=$target.next().find('ul').find('.active').index();
            var _href = window.location.href;
            if($index==0){
                window.location.href = _href.substring(0, _href.indexOf(".html") + 5) + "#!/commodityAnalysis" +'&_hot='+new Date().getTime();
            }else if($index==1){
                window.location.href = _href.substring(0, _href.indexOf(".html") + 5) + "#!/commodityAnalysis" + '&_abnormal='+new Date().getTime();
            }else{
                window.location.href = _href.substring(0, _href.indexOf(".html") + 5) + "#!/customerAnalysis" + '&_'+new Date().getTime()+'&sku='+vm.$model.createData.customerGoodSku;
            }
        },
        /*跳转罗盘信息页面*/
        goCompassIntroduce:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var id=$target.attr('value');
            /*本地*/
            var href=location.href;
            var newLocation=href.split('wumartCompass')[0]+'wumartCompass'+'/templates/compassCase/compassCase.html?id='+id;
            window.open(newLocation);
            /*正式*/
            //window.open('http://luopan-qa.wumart.com/templates/compassCase/compassCase.html?id='+id);
        },
        /*大数据应用案例*/
        goCompassCase:function(evt){
            var $target=$(evt.target) || $(evt.element);
            var id=$target.attr('value');
            /*本地*/
            var href=location.href;
            var newLocation=href.split('wumartCompass')[0]+'wumartCompass'+'/templates/compassIntroduce/compassIntroduce.html?id='+id;
            window.open(newLocation);
            /*正式*/
            //window.open('http://luopan-qa.wumart.com/templates/compassIntroduce/compassIntroduce.html?id='+id);
        },
        /*拒绝免责*/
        refuseRelief:function(){
            /*清除cookie 这里因为是调用的其他端的cookie,所以要加上域名*/
            document.cookie='vcmserp='+''+';expires=' + new Date(0).toUTCString()+';domain=.wumart.com';
            window.location.href='login.html';
        }
    });
    return vm;
});