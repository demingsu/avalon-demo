$(function(){
    /*页面开始加载动画*/
    var LoadingNode = function () {
        var that = this;
        that.id = '';
        var _showLoading=document.getElementById('showLoadingBox');
        if(_showLoading){
            return;
        }
        that.show();
    };
    LoadingNode.prototype = {
        show: function () {
            var that = this;
            var _mn = document.createElement('div');
            var mc = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999;';
            var mlc = 'position: relative; width: 100%; height: 100%; background-color: #000; opacity: 0.5;' +
                ' filter:alpha(opacity=50);   -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)" ';
            var nc = 'position: absolute; top: 50%; left: 50%; margin-top: -62px; margin-left: -155px; width: 312px; height: 124px;';
            var bc = 'position: relative; width: 100%; height: 100%; background: #fff;-webkit-border-radius: 8px; -moz-border-radius: 8px; border-radius: 8px;';
            var bck = 'background-image: url(data:image/gif;base64,R0lGODlh3AATAMQfAP7w6P7Qsv7p3P7WvP7i0P7PsP7Xvv707v7hzv7s4P7Jpv7UuP7Lqv7dyP749P7u5P7cxv7FoP7z7P6/lv76+P7m1v7awv7eyv7bxP759v7k1P7n2P728v7DnP///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTY3OTZFRjkyQUQwMTFFNkJBRUZFMUZGNDU3MjZENzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTY3OTZFRkEyQUQwMTFFNkJBRUZFMUZGNDU3MjZENzYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNjc5NkVGNzJBRDAxMUU2QkFFRkUxRkY0NTcyNkQ3NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxNjc5NkVGODJBRDAxMUU2QkFFRkUxRkY0NTcyNkQ3NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6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); background-repeat: no-repeat; background-position: center;';
            var textTip = 'position: absolute; top:78px; left:121px; color:#525252;font-size:14px;';
            _mn.setAttribute('style', mc);
            //that.id = '_' + new Date().getTime();
            that.id = 'showLoadingBox';
            _mn.id = that.id;
            document.body.appendChild(_mn);
            var _ml = document.createElement('div');
            _ml.setAttribute('style', mlc);
            _mn.appendChild(_ml);
            var _rn = document.createElement('div');
            _rn.setAttribute('style', nc);
            _mn.appendChild(_rn);
            var _bn = document.createElement('div');
            _bn.setAttribute('style', bc + bck);
            _rn.appendChild(_bn);
            var _text = document.createElement('div');
            _text.setAttribute('style', textTip);
            var oText=document.createTextNode("页面加载中");
            _text.appendChild(oText);
            _rn.appendChild(_text);
        },
        hide: function () {
            var _showLoading=document.getElementById('showLoadingBox');
            if(_showLoading){
                $(_showLoading).remove();
            }
        }
    };
    var _loading;
    var href=location.href;
    var id=href.split('=')[1];
    var isLocalHost = location.hostname.toLowerCase() == 'localhost';
    var origin=window.location.protocol + "//" + window.location.hostname;
    $.ajax({
        url:(isLocalHost?'/wumartCompass/mokeData/':origin+'/') + 'vendor/compass/notice' + (isLocalHost ? '.json' : ''),
        type:'get',
        dataType:'json',
        data:{
            id:id
        },
        beforeSend:function(){
            _loading= new LoadingNode();
        },
        complete:function(){
            _loading.hide();
        },
        success:function(data){
            if(data){
                var publishTime=new Date(data.publishTime);
                var newTime=publishTime.getFullYear()+'-'+((publishTime.getMonth()+1)<9?('0'+(publishTime.getMonth()+1)):(publishTime.getMonth()+1))+'-'+publishTime.getDate();
                $('.compass-case h4').html(data.title+'<small>'+newTime+'</small>');
                $('.compass-case-box').html(data.context);
            }else{
                window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
            }
        },
        error:function(){
            window.wxc.xcConfirm('服务器错误', window.wxc.xcConfirm.typeEnum.error);
        }
    });
});