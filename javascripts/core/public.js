/*
* v:1.0.0
* author:lily
* date:2016/06/01
* dateFormat
*/
define(['urlMapping','rtlLoad'], function(urlMapping,rtlLoad){
    var publicNode = {};
    var isLocalHost = location.hostname.toLowerCase() == 'localhost';
    publicNode.getUrl = function(url,callback){
        callback(urlMapping[url]);
    };
    var _loading;
    publicNode.showLoading=function(){
        _loading=new rtlLoad();
    };
    publicNode.closeLoading=function(){
        _loading.hide();
    };
    /*异步获取数据接口*/
    publicNode.ajaxDataFetch = function(param){
        var url = urlMapping[param.url],
            returnObj = {};
        if(!url){
            returnObj.code = '9996';
            returnObj.msg = '请求的路由错误';
            return;
        }
        if(typeof param.data != 'string') param.data = JSON.stringify(param.data);
        $.ajax({
            type: isLocalHost? "GET" : param.type,
            url: url,
            dataType: 'json',
            async: true,
            cache: false,
            data: param.data,
            contentType: 'application/json;charset=utf-8',
            success: function (data) {
                if (typeof data === 'string') {
                    returnObj = JSON.parse(data);
                } else {
                    returnObj = data;
                }
                if (undefined != param.callback) param.callback(returnObj);
            },
            error: function () {
                if (undefined != param.callback) param.callback({code: 'error', msg: '请求发生错误，请重试'});
            }
        });
    };
    /*
    *获取日期
    *对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     *例子：
     *publicNode.dateFormat("yyyy-MM-dd hh:mm:ss.S","2016-07-02") ==> 2006-07-02 08:09:04.423
     *publicNode.dateFormat("yyyy-M-d h:m:s.S","2016/07/02")      ==> 2006-7-2 8:9:4.18
     * times:格式必须为：2016-07-02||2016/07/02
    */
    publicNode.dateFormat = function(fmt,times){
        if(fmt === "" && fmt === undefined){
            return null;
        }
        var date = new Date();
        if (undefined !== times && times!== "") {
            var timestamp = times;
            if(!(/[0-9]{13}/.test(times))){
                if(/^(\d{4})(-|\/)(\d{2})(-|\/)(\d{2})$/.test(times)){
                    timestamp = new Date((times+"").replace(/(-|年|月)/g,'/').replace(/日/g,"")).getTime();
                }else{
                    return null;
                }
            }
            date = new Date(parseInt(timestamp));
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    /*判断页面节点是否渲染完成*/
    var NodeReady = function(options){
        this.elId = options.elId;
        this.callback = options.callback;
        if(!this.elId) {
            throw new Error('element id is null');
        }
        if(!this.callback) {
            throw new Error('callback is null');
        }
        this.counter = 0;
    };
    NodeReady.prototype = {
        ready: function(){
            var _this = this;
            setTimeout(function () {
                if(_this.elId.indexOf(".") === 0){
                    var node = $(_this.elId)[0];
                }else {
                    var node = document.getElementById(_this.elId);
                }
                if (!node) {
                    _this.ready();
                    _this.counter++;
                    if (_this.counter > 30) {
                        _this.counter = 0;
                    }
                } else {
                    _this.counter = 0;
                    _this.callback(node);
                }
            }, 300);
        }
    };
    publicNode.nodeReady = function(options){
        new NodeReady(options).ready();
    };
    publicNode._IE = (function (){
        var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );
        return v > 4 ? v : false;
    }());
    return publicNode;
});