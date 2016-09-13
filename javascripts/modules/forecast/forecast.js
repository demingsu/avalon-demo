define(['avalon','public','urlMapping','xcConfirm'],function(avalon,public,urlMapping,xcConfirm){
    public.showLoading();
    var vm=avalon.define({
        $id:'forecastCtrl',
        initFunc:function(){
            public.closeLoading();
        },
        forecast:function(){
            window.wxc.xcConfirm('暂不支持', window.wxc.xcConfirm.typeEnum.error);
        }
    });
    return vm;
});