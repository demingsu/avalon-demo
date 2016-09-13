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
        $id:'competeAnalysisCtrl',
        createData:{
            yesterday:'',
            last_shop_hour:'',
            last_2hour:'',
            last_shop_hour_end:'',
            yesterday_end:''
        },
        compareTime:{
            start:'',
            end:''
        },
        goodName:'',
        compareTopChart:function(time,name,data1,data2){
            $('#compareTotalChart').html('');
            var compareTotalChart = echarts.init(document.getElementById('compareTotalChart'));
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
                        name:name+'销售额',
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
                        data:data1
                    },
                    {
                        name:'竞争品销售额',
                        type:'line',
                        step:'start',
                        //smooth:true,
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
                        data:data2
                    }
                ]
            };
            compareTotalChart.setOption(option);
            $(window).resize(function(){
                compareTotalChart.resize();
            });
        },
        compareLineChart:function(id,name,data,color,title){
            $('#'+id).html('');  //我干 IE8必须要先清空一次图表
            var customerStockChart=echarts.init(document.getElementById(id));
            var option = {
                color:[color],
                title:{
                    text:title,
                    textStyle:{
                        fontSize:14,
                        fontWeight:'normal',
                        color:'#222'
                    },
                    x:23,
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
                    left:10,
                    top:40,
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
        compareCircleChart:function(id,name,data){
            $('#'+id).html('');
            var payChart = echarts.init(document.getElementById(id));
            var option = {
                color:['#7d61f3','#859cf3','#fee06b','#ef5255','#5786fb','#45bcb1'],
                title:{
                    text:'购买方式',
                    textStyle:{
                        fontSize:14,
                        fontWeight:'normal',
                        color:'#222'
                    },
                    x:23,
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
                    data:name
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
                        data:data
                    }
                ]
            };
            payChart.setOption(option);
            $(window).resize(function(){
                payChart.resize();
            });
        },
        initFunc:function(){
            public.showLoading();
            vm.goodName='';
            $.ajax({
                url:urlMapping['get_compass_time'],
                type:'get',
                dataType:'json',
                data:{},
                beforeSend:function(){
                    public.showLoading();
                },
                complete:function(){
                    public.closeLoading();
                    public.nodeReady({
                        elId:'goodSku',
                        callback:function(){
                            $('#goodSku').val('');
                        }
                    });
                },
                success:function(data){
                    if(data){
                        public.nodeReady({
                            elId:'timepicker',
                            callback:function(){
                                vm.createData.yesterday=data.yesterday;
                                vm.createData.last_shop_hour=data.last_shop_hour;
                                vm.createData.last_2hour=data.last_2hour;
                                vm.createData.last_shop_hour_end=data.last_shop_hour_end;
                                vm.createData.yesterday_end=data.yesterday_end;
                                /*日期转换为上月*/
                                var date=data.yesterday;
                                date=date.replace(/\-/g,'/');
                                var nowDate=new Date(date);
                                var pastDate=new Date(nowDate.getFullYear(), nowDate.getMonth(),0);
                                var newTime=pastDate.getFullYear()+'/'+((pastDate.getMonth()+1)>9?(pastDate.getMonth()+1):('0'+(pastDate.getMonth()+1)))+'/01'+'&'+pastDate.getFullYear()+'/'+((pastDate.getMonth()+1)>9?(pastDate.getMonth()+1):('0'+(pastDate.getMonth()+1)))+'/'+(pastDate.getDate()<9?('0'+pastDate.getDate()):(pastDate.getDate()));
                                vm.compareTime.start=pastDate.getFullYear()+'-'+((pastDate.getMonth()+1)>9?(pastDate.getMonth()+1):('0'+(pastDate.getMonth()+1)))+'-01';
                                vm.compareTime.end=pastDate.getFullYear()+'-'+((pastDate.getMonth()+1)>9?(pastDate.getMonth()+1):('0'+(pastDate.getMonth()+1)))+'-'+(pastDate.getDate()<9?('0'+pastDate.getDate()):(pastDate.getDate()));
                                /*日历endDate为上月最后一天*/
                                new RtlCalendar('timepicker', {
                                    isModal: true,
                                    checked: function(){
                                        vm.compareTime.start=arguments[0];
                                        vm.compareTime.end=arguments[1];
                                    },
                                    setDate: newTime,
                                    startDate: '2016/01/01',
                                    endDate: pastDate.getFullYear()+'/'+((pastDate.getMonth()+1)>9?(pastDate.getMonth()+1):('0'+(pastDate.getMonth()+1)))+'/'+(pastDate.getDate()<9?('0'+pastDate.getDate()):(pastDate.getDate())),
                                    pull: 'right',
                                    format: 'M'
                                });
                                /*顶部对比图*/
                                vm.compareTopChart([],'',[],[]);
                                /*具体对比图*/
                                vm.compareLineChart('compareLine10','性别',[],'#5584ff','性别构成');
                                vm.compareLineChart('compareLine20','年龄',[],'#5584ff','年龄构成');
                                vm.compareLineChart('compareLine30','会员等级',[],'#5584ff','会员等级');
                                vm.compareLineChart('compareLine11','性别',[],'#fda524','性别构成');
                                vm.compareLineChart('compareLine21','年龄',[],'#fda524','年龄构成');
                                vm.compareLineChart('compareLine31','会员等级',[],'#fda524','会员等级');
                                vm.compareCircleChart('compareCircle10',['美通APP/美通卡','微信','支付宝','银行卡','现金','其他'],[
                                    {value:0,name:'美通APP/美通卡'},
                                    {value:0,name:'微信'},
                                    {value:0,name:'支付宝'},
                                    {value:0,name:'银行卡'},
                                    {value:0,name:'现金'},
                                    {value:0,name:'其他'}
                                ]);
                                vm.compareCircleChart('compareCircle11',['美通APP/美通卡','微信','支付宝','银行卡','现金','其他'],[
                                    {value:0,name:'美通APP/美通卡'},
                                    {value:0,name:'微信'},
                                    {value:0,name:'支付宝'},
                                    {value:0,name:'银行卡'},
                                    {value:0,name:'现金'},
                                    {value:0,name:'其他'}
                                ]);
                            }
                        });
                    }else{
                        window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                    }
                },
                error:function(){
                    window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
                }
            });
        },
        compareSearch:function(){
            var sku= $.trim($('#goodSku').val());
            if(sku==''){
                window.wxc.xcConfirm('请输入商品SKU', window.wxc.xcConfirm.typeEnum.warning);
                return false;
            }
            var date=vm.$model.compareTime.start;
            date=date.replace(/\//g,'-').substr(0,7);
            public.showLoading();
            $.when(
                $.ajax({
                    url:urlMapping['get_competition_merch'],
                    type:'get',
                    dataType:'json',
                    data:{
                        sku:sku,
                        date:date
                    }
                }),
                $.ajax({
                    url:urlMapping['get_competition_customer'],
                    type:'get',
                    dataType:'json',
                    data:{
                        sku:sku,
                        date:date
                    }
                })
            ).done(function(response1,response2){
                public.closeLoading();
                var data1=response1[0],data2=response2[0];
                var name=data1.sku_name;
                if(data1.sku_name==false){
                    window.wxc.xcConfirm('无此商品SKU', window.wxc.xcConfirm.typeEnum.warning);
                    return false;
                }
                vm.goodName=data1.sku_name;  //同步商品名
                var date=vm.$model.compareTime.start;
                date=date.replace(/\//g,'-');
                var month=date.split('-')[1];
                var timeArray=[],sex1,age1,member1,pay1,sex2,age2,member2,pay2;
                for(var k=0;k<data1.saleamt.length;k++){
                    if(k<9){
                        timeArray.push(month+'-0'+(k+1));
                    }else{
                        timeArray.push(month+'-'+(k+1));
                    }
                }
                /*您的产品*/
                /*性别图表*/
                sex1=data2.merch.sex;
                var sexArray1=[];
                for(var i1=0;i1<sex1.names.length;i1++){
                    sexArray1.push({
                        barMaxWidth:30,
                        name: sex1.names[i1],
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
                        data: [sex1.values[i1]]
                    });
                }
                /*年龄图表*/
                age1=data2.merch.age;
                var ageArray1=[];
                for(var j1=0;j1<age1.names.length;j1++){
                    ageArray1.push({
                        barMaxWidth:30,
                        name: age1.names[j1],
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
                        data: [age1.values[j1]]
                    });
                }
                /*等级图表*/
                member1=data2.merch.member;
                var memberArray1=[];
                for(var m1=0;m1<member1.names.length;m1++){
                    memberArray1.push({
                        barMaxWidth:30,
                        name: member1.names[m1],
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
                        data: [member1.values[m1]]
                    });
                }
                /*支付方式图表*/
                pay1=data2.merch.pay;
                var payNames1=[],payArray1=[];
                for(var t1=0;t1<pay1.names.length;t1++){
                    payNames1.push(pay1.names[t1]+' '+pay1.values[t1]+'%');
                    payArray1.push({
                        value:pay1.values[t1],
                        name:pay1.names[t1]+' '+pay1.values[t1]+'%'
                    });
                }
                /*竞品*/
                /*性别图表*/
                sex2=data2.compete_merch.sex;
                var sexArray2=[];
                for(var i2=0;i2<sex2.names.length;i2++){
                    sexArray2.push({
                        barMaxWidth:30,
                        name: sex2.names[i2],
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
                        data: [sex2.values[i2]]
                    });
                }
                /*年龄图表*/
                age2=data2.compete_merch.age;
                var ageArray2=[];
                for(var j2=0;j2<age2.names.length;j2++){
                    ageArray2.push({
                        barMaxWidth:30,
                        name: age2.names[j2],
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
                        data: [age2.values[j2]]
                    });
                }
                /*等级图表*/
                member2=data2.compete_merch.member;
                var memberArray2=[];
                for(var m2=0;m2<member2.names.length;m2++){
                    memberArray2.push({
                        barMaxWidth:30,
                        name: member2.names[m2],
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
                        data: [member2.values[m2]]
                    });
                }
                /*支付方式图表*/
                pay2=data2.compete_merch.pay;
                var payNames2=[],payArray2=[];
                for(var t2=0;t2<pay2.names.length;t2++){
                    payNames2.push(pay2.names[t2]+' '+pay2.values[t2]+'%');
                    payArray2.push({
                        value:pay2.values[t2],
                        name:pay2.names[t2]+' '+pay2.values[t2]+'%'
                    });
                }
                /*顶部对比图*/
                vm.compareTopChart(timeArray,name,data1.saleamt,data1.comp_saleamt);
                /*具体对比图*/
                vm.compareLineChart('compareLine10','性别',sexArray1,'#5584ff','性别构成');
                vm.compareLineChart('compareLine20','年龄',ageArray1,'#5584ff','年龄构成');
                vm.compareLineChart('compareLine30','会员等级',memberArray1,'#5584ff','会员等级');
                vm.compareLineChart('compareLine11','性别',sexArray2,'#fda524','性别构成');
                vm.compareLineChart('compareLine21','年龄',ageArray2,'#fda524','年龄构成');
                vm.compareLineChart('compareLine31','会员等级',memberArray2,'#fda524','会员等级');
                vm.compareCircleChart('compareCircle10',payNames1,payArray1);
                vm.compareCircleChart('compareCircle11',payNames2,payArray2);
            }).fail(function(){
                public.closeLoading();
                window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
            });
        }
    });
    return vm;
});