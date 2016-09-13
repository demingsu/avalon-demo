define(function () {
    var isLocalHost = location.hostname.toLowerCase() == 'localhost';
    var origin=window.location.protocol + "//" + window.location.hostname;
    return {
        'get_compass_username':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/username' + (isLocalHost ? '.json' : ''),//最新的数据时间
        'get_compass_time':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/time' + (isLocalHost ? '.json' : ''),//最新的数据时间
        'get_compass':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/vendor-mtd' + (isLocalHost ? '.json' : ''),//首页 月数据
        'get_compass_twoHours':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/vendor-2hours' + (isLocalHost ? '.json' : ''),//首页 每2小时销售额
        'get_compass_topTen':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/merch-top10-wtd' + (isLocalHost ? '.json' : ''),//首页 周热销商品
        'get_compass_abnormal':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/abnormal-index' + (isLocalHost ? '.json' : ''),//首页 异常商品
        'get_customer_index':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/customer-index' + (isLocalHost ? '.json' : ''),//首页 顾客画像
        'get_notice_index':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/notice-index' + (isLocalHost ? '.json' : ''),//首页 罗盘信息
        'get_bigdata_index':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/bigdata-index' + (isLocalHost ? '.json' : ''),//首页 最新一条大数据应用案例
        'get_compass_weather':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/weather' + (isLocalHost ? '.json' : ''),//首页 获取天气
        'get_compass_unlock':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/unlock' + (isLocalHost ? '.json' : ''),//首页 解锁
        /*实际用这个start*/
        //'get_operate_day':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-day' + (isLocalHost ? '.json' : ''),//经营指标-月至今指标
        //'get_operate_days':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-days' + (isLocalHost ? '.json' : ''),//经营指标-指定时间段
        /*实际用这个end*/
        'get_emc_list':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/emc-list' + (isLocalHost ? '.json' : ''),//经营指标下拉框列表
        'get_emc_table':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/emc-merch-rank-mtd' + (isLocalHost ? '.json' : ''),//经营指标商品月指标(按emc查询)
        'get_sku_table':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/merch-mtd-emc-rank' + (isLocalHost ? '.json' : ''),//经营指标商品月指标(按sku查询)
        'get_site_list':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/site-list' + (isLocalHost ? '.json' : ''),//获取门店列表
        'get_merch_last':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/merch-last-5hours' + (isLocalHost ? '.json' : ''),//经营指标实时信息
        'get_customer_percent':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/customer-percent' + (isLocalHost ? '.json' : ''),//顾客分析顾客分析
        'get_good_trend':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/emc-or-merch-saleamt' + (isLocalHost ? '.json' : ''),//商品销售走势
        'get_merch_rank':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/merch-site-rank' + (isLocalHost ? '.json' : ''),//门店销量排行 经营指标行情
        'get_merch_top':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/merch-top10-dth' + (isLocalHost ? '.json' : ''),//商品分析今日Top10商品
        'get_merch_site':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/merch-site-top10' + (isLocalHost ? '.json' : ''),//商品分析今日Top10商品 门店信息
        'get_merch_hot':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/merch-top10' + (isLocalHost ? '.json' : ''),//商品分析热销商品排行
        'get_abnormal_merch':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/abnormal-merch' + (isLocalHost ? '.json' : ''),//商品分析异常商品列表
        'get_brand_rank':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/brand-rank' + (isLocalHost ? '.json' : ''),//商品分析我的品牌排行
        'get_abnormal_site':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/abnormal-merch-site' + (isLocalHost ? '.json' : ''),//商品分析门店信息弹窗
        'get_competition_merch':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/competition-merch' + (isLocalHost ? '.json' : ''),//竞争分析产品销售趋势对比图
        'get_competition_customer':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/competition-customer' + (isLocalHost ? '.json' : ''),//竞争分析顾客特征对比图
        'get_pro_top':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/promo-merch-top10-dth' + (isLocalHost ? '.json' : ''),//促销分析实时商品销售排行榜
        'get_pro_site':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/promo-merch-top10-site-dth' + (isLocalHost ? '.json' : ''),//促销分析显示详情
        'get_promo_year':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/promo-merch-site-years' + (isLocalHost ? '.json' : ''),//促销分析 年数据
        'get_vendor_list':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/vendors-list' + (isLocalHost ? '.json' : ''),//首页齿轮 供应商卡号列表
        'get_compass_feedback':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/feedback' + (isLocalHost ? '.json' : ''),//首页 反馈
        'get_complete_site':'./mokeData/vendor/compass/complete-site.json',//自动补全门店json

        /*自己开发用这个start*/
        'get_operate_day1':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-day1' + (isLocalHost ? '.json' : ''),//经营指标-销售额指标
        'get_operate_day2':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-day2' + (isLocalHost ? '.json' : ''),//经营指标-净总进货额指标
        'get_operate_day3':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-day3' + (isLocalHost ? '.json' : ''),//经营指标-高库存占比指标
        'get_operate_day4':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-day4' + (isLocalHost ? '.json' : ''),//经营指标-到货满足率指标
        'get_operate_day5':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-day5' + (isLocalHost ? '.json' : ''),//经营指标-退货率指标
        'get_operate_days1':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-days1' + (isLocalHost ? '.json' : ''),//经营指标-销售额
        'get_operate_days2':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-days2' + (isLocalHost ? '.json' : ''),//经营指标-净进货额
        'get_operate_days3':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-days3' + (isLocalHost ? '.json' : ''),//经营指标-高库存占比
        'get_operate_days4':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-days4' + (isLocalHost ? '.json' : ''),//经营指标-到货满足率
        'get_operate_days5':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-days5' + (isLocalHost ? '.json' : ''),//经营指标-退货率
        'get_operate_days6':(isLocalHost?'./mokeData/':origin+'/') + 'vendor/compass/operate-days6' + (isLocalHost ? '.json' : '')//经营指标-右边图表
    };
        /*自己开发用这个end*/
});