$(function(){
    var validityCode = "", submitFlag = false, verifyFlag = false,
        isLocalHost = location.hostname.toLowerCase() == 'localhost',
        rtlCodeOrigin = window.location.protocol + "//" + window.location.hostname;
    /*每次刷新页面重置输入框*/
    $('#loginInputName').val('');
    $('#loginInputPWD').val('');
    $('#loginInputCode').val('');
    var getValidityCode = function(){
        var url = (isLocalHost?'./mokeData/':rtlCodeOrigin+'/') + 'captcha/key' + (isLocalHost ? '.json' : '');
        $.ajax({
            url: url+'?_'+new Date().getTime(),
            type: 'GET',
            dataType: 'json',
            success: function(data){
                var codeFlag = false;
                if(data && data.key){
                    validityCode = data.key;
                    $("#verifyImg").attr('src', rtlCodeOrigin+'/captcha/img?key='+ validityCode);
                    codeFlag = true;
                }
                if(!codeFlag){
                    $('.rtl-err-tip').css('display','block').text('获取验证码失败');
                }
            },
            error: function(){
                $('.rtl-err-tip').css('display','block').text('获取验证码失败');
            }
        });
    };
    /*获取验证码*/
    getValidityCode();
    /*重新获取验证码*/
    $("#verifyImg").on('click', function(){
        getValidityCode();
    });
    /*自动检验事件*/
    $("#loginInputCode").on('keyup', function () {
        var _val = $(this).val();
        if(_val.length == 6 && !verifyFlag && validityCode != ""){
            verifyFlag = true;
            $.ajax({
                url: (isLocalHost?'./mokeData/':rtlCodeOrigin+'/') + 'captcha/verify' + (isLocalHost ? '.json' : ''),
                type: 'GET',
                dataType: 'json',
                data: {key: validityCode, value: _val},
                success: function(data){
                    verifyFlag = false;
                    var codeFlag = false;
                    if(data && data.constructor == Object){
                        if(data.code && data.code == 'ok'){
                            codeFlag = true;
                        }
                    }
                    if(!codeFlag){
                        $('.rtl-err-tip').css('display','block').text('验证码错误');
                    }
                },
                error: function(){
                    verifyFlag = false;
                    throw new Error('auto validity code request error');
                }
            });
        }
    });
    /*登录事件*/
    $("#loginInBtn").on('click', function(){
        if(validityCode != "" && !submitFlag){
            submitFlag = true;
            var account = $.trim($("#loginInputName").val());
            if(account == ""){
                $('.rtl-err-tip').css('display','block').text('请输入账号');
                submitFlag = false;
                return;
            }
            var passwd = $.trim($("#loginInputPWD").val());
            if(passwd == ""){
                $('.rtl-err-tip').css('display','block').text('请输入密码');
                submitFlag = false;
                return;
            }
            var captchaValue = $.trim($("#loginInputCode").val());
            if(captchaValue == ""){
                $('.rtl-err-tip').css('display','block').text('请输入验证码');
                submitFlag = false;
                return;
            }
            $.ajax({
                url: (isLocalHost?'./mokeData/':rtlCodeOrigin+'/') + 'vendor-login' + (isLocalHost ? '.json' : ''),
                type: 'POST',
                dataType: 'json',
                data: {account: account, passwd: passwd, 'captcha-key': validityCode, 'captcha-value': captchaValue},
                success: function(data){
                    submitFlag = false;
                    //var codeFlag = false;
                    if(data && data.constructor == Object){
                        if(data.code == 'ok'){
                            location.href = 'index.html';
                            //codeFlag = true;
                        }else if(data.code=='wrong-captcha'){
                            $('.rtl-err-tip').css('display','block').text('验证码错误');
                        }else{
                            $('.rtl-err-tip').css('display','block').text(data.code);
                            $('#loginInputCode').val('');
                            getValidityCode();
                        }
                    }else{
                        $('.rtl-err-tip').css('display','block').text('登录失败');
                    }
                    //if(!codeFlag){
                    //    $('.rtl-err-tip').css('display','block').text('登录失败');
                    //}
                },
                error: function () {
                    submitFlag = false;
                    $('.rtl-err-tip').css('display','block').text('登录失败');
                }
            });
        }
    });
});
