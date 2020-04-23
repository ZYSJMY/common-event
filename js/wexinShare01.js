function weixinShare(title, desc, imgUrl) {
    let isWeixn = is_weixn()
    if (!isWeixn) {
        return
    }
    var href = window.location.href;
    var title = title || '新学说 | 国际学校多边服务平台';
    var desc = desc || '新学说是由国际学校行业专家共同打造的多边媒体平台。自成立以来一直致力于中国国际学校行业研究，对于中国国际学校有着深刻的了解。';
    var imgUrl = imgUrl || 'https://data.xinxueshuo.cn/upImage/upInstitutionImg/100062/100062-logo.jpg';
    $.ajax({
        type : "get",
        url: 'https://data.xinxueshuo.cn/nsi-1.0/wxPay/wx_chat_share.do?url=' + href + '',
          
        success :   function(msg) {
            wx.config({

                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

                appId: msg.data.appId, // 必填，公众号的唯一标识

                timestamp: msg.data.timestamp, // 必填，生成签名的时间戳

                nonceStr: msg.data.nonceStr, // 必填，生成签名的随机串

                signature: msg.data.signature, // 必填，签名，见附录1

                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

            });

            wx.ready(function() {

                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                // 分享给朋友
                wx.onMenuShareAppMessage({

                    title: title, // 分享标题

                    desc: desc, // 分享描述

                    link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致

                    imgUrl: imgUrl, // 分享图标

                    type: '', // 分享类型,music、video或link，不填默认为link

                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空

                    success: function() {
                        // 用户确认分享后执行的回调函数

                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });

                // 分享到朋友圈
                wx.onMenuShareTimeline({

                    title: title, // 分享标题

                    link: href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致

                    imgUrl: imgUrl, // 分享图标

                    success: function() {

                        // 用户确认分享后执行的回调函数

                    },

                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });


            });
            // 处理失败验证
            wx.error(function(res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            });

            wx.checkJsApi({

                jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,

                success: function(res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                }
            });


        },
        error: function() {
            // alert('发生错误，请求数据失败！');
        }
    });
}

function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}