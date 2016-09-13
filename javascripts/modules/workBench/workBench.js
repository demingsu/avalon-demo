/**
 * Created by Simon on 2016/8/9.
 */
define(['avalon','public'],function(avalon,public){
    public.showLoading();
    var vm=avalon.define({
        $id:'workBenchCtrl',
        code: '',
        initFunc: function(){
            $.ajax({
                type: "GET",
                url: public.transitionRoute('GET_WORK_BENCH'),
                dataType: 'json',
                data: {data: 123},
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    vm.code = data.code;
                    setTimeout(function(){
                        public.closeLoading();
                    }, 800);
                },
                error: function () {
                    avalon.log('请求发生错误，请重试');
                    setTimeout(function(){
                        public.closeLoading();
                    }, 800);
                }
            });
        }
    });
    return vm;
});