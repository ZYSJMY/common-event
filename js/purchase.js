    //body高度
    $(function() {
        var height = $(window).height()
        $(document.body).css("min-height", height)
    })
    function loading2() {
        $('body').loading({
            loadingWidth: 168,
            title: '',
            name: 'test',
            discription: '正在加载中...',
            direction: 'column',
            type: 'origin',
            originDivWidth: 40,
            originDivHeight: 40,
            originWidth: 6,
            originHeight: 6,
            smallLoading: false,
            loadingMaskBg: 'rgba(0,0,0,0.2)'
        });
    }
    if ($('input[type="radio"]:checked').length == 0) {
        $(".yuan_xuan").text("0 元")
    }
    
    $("body").delegate("input[name=Storage]","click",function(){
        sex = $(this).val();
        titlename = $(this).attr("title");
        $(".yuan_xuan").text(sex + " 元")
        console.log(titlename)
    });
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }
    var name = (getQueryString("name"));
    var company = (getQueryString("company"));
    var phone = (getQueryString("phone"));
    var event_ID = (getQueryString("event_id"));
    var signUpId = (getQueryString("signUpId"));
    var codeID = (getQueryString("code"));
    localStorage["type"] = (getQueryString("type"));
    var type = (getQueryString("type"));
    var wechatId;
    var pay = new Pay()
    pay.init()
        //微信内嵌支付
    if (pay.URLdata.code) {
        $.ajax({
            type: 'post',
            data: { code: codeID },
            url: changeUrl.address + '/wxPay/get_wx_info.do',
            success: function(data) {
                console.log(data)
                var openid = data.data.openid
                console.log(openid)
                $.ajax({
                    type: 'get',
                    url: changeUrl.address + '/Pay/WxPay_public.do',
                    data: {
                        "openid": openid,
                        "body": localStorage["paybody"],
                        "total_fee": localStorage["payment"],
                        "out_trade_no": localStorage["orderNo"]
                    },
                    success: function(msg) {
                        console.log(msg)
                        var appId = msg.data.appId,
                            timeStamp = msg.data.timeStamp,
                            nonceStr = msg.data.nonceStr,
                            package = msg.data.package,
                            signType = msg.data.signType,
                            paySign = msg.data.paySign

                        function onBridgeReady() {
                            WeixinJSBridge.invoke(
                                'getBrandWCPayRequest', {
                                    "appId": appId, //公众号名称，由商户传入     
                                    "timeStamp": timeStamp, //时间戳，自1970年以来的秒数     
                                    "nonceStr": nonceStr, //随机串     
                                    "package": package,
                                    "signType": signType, //微信签名方式：     
                                    "paySign": paySign //微信签名 
                                },
                                function(res) {
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                                        $.ajax({
                                            type: "get",
                                            data: {
                                                telphone: localStorage["wechatId"],
                                                activeName:localStorage["type"]
                                            },
                                            url: changeUrl.address + "/CommonApi/send_pay_message.do",
                                            success: function(data) {
                                                console.log(data)
                                                if (data.code == 0) {
                                                    window.location.href = changeUrl.Catalog + "/common-event/personal.html?phone=" + localStorage["wechatId"]
                                                }
                                            }
                                        })
                                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                        window.location.href = changeUrl.Catalog + "/common-event/purchase.html?name=" + localStorage["name"] + "&company=" + localStorage["company"] + "&phone=" + localStorage["wechatId"] + "&id=" + localStorage["goodsId"]
                                    } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                                        window.location.href = changeUrl.Catalog + "/common-event/purchase.html?name=" + localStorage["name"] + "&company=" + localStorage["company"] + "&phone=" + localStorage["wechatId"] + "&id=" + localStorage["goodsId"]
                                    }
                                }
                            );
                        }
                        if (typeof WeixinJSBridge == "undefined") {
                            if (document.addEventListener) {
                                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                            } else if (document.attachEvent) {
                                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                            }
                        } else {
                            onBridgeReady();
                        }
                    },
                    error: function() {
                        console.log("error in pay.do----2")
                    }
                })
            },
            error: function() {
                console.log("error----1")
            }
        })
    }
    //移动端
    if (pay.IsMobile) {
        $(".wechatpayment").click(function() {
            if (pay.isWeixn) {
                //单选框
                if ($('input[type="radio"]:checked').length != 0) {
                    var radio = $("input[name=Storage]")
                    var radiovalue = ''; //radiovalue为radio中选中的值
                    for (var i = 0; i < radio.length; i++) {
                        if (radio[i].checked == true) {
                            radiovalue = radio[i].value;
                            break;
                        }
                    }
                } else {
                    $.message({
                        message: "请选择一个张门票",
                        type: 'warning',
                        duration: 2000,
                        showClose: false,
                        center: false,
                    });
                    return false;
                }
                localStorage["activeId"] = event_ID
                var data = "wechatId=" + phone +//手机号
                    "&goodsId=" + signUpId +//用户报名表id,
                    "&productName="+ type+"-" + titlename+//活动名+票简称
                    "&productType=活动" +//活动
                    "&payment=" + radiovalue +//支付金额
                    "&quantity=1" +
                    "&totalPrice=" + radiovalue +//支付金额
                    "&buyerMessage=" + name + '-' + company //用户姓名-公司名
                $.ajax({
                    type: "post",
                    async: false,
                    data: data,
                    dataType: "json",
                    url: changeUrl.address + '/order/create_activity.do',
                    success: function(data) {
                        console.log(data)
                        if (data.code == 0) {
                            buyerMessage = data.data.buyerMessage //名字加公司
                            buyerMessageArr = buyerMessage.split("-")
                            createTime = data.data.createTime //时间
                            goodsId = data.data.goodsId //id
                            payment = data.data.payment //价钱
                            orderNo = data.data.orderNo //订单号
                            wechatId = data.data.wechatId //手机号
                            productName = data.data.productName //vis2019
                            productType = data.data.productType //活动
                            quantity = data.data.quantity //是否公开信息
                            localStorage["paybody"] = productName + "-" + titlename
                            localStorage["orderNo"] = orderNo
                            localStorage["payment"] = payment
                            localStorage["wechatId"] = wechatId
                            localStorage["name"] = buyerMessageArr[0]
                            localStorage["company"] = buyerMessageArr[1]
                            localStorage["goodsId"] = goodsId
                            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx37e5ddff7dc5282e&redirect_uri=https://www.xinxueshuo.cn/event/common-event/purchase.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                        }
                    },
                    error: function() {
                        localStorage["paybody"] = ""
                        localStorage["orderNo"] = ""
                        localStorage["payment"] = ""
                        alert("创建订单失败，请联系新学说客服")
                        $.message({
                            message: "创建订单失败，请联系新学说客服",
                            type: 'warning',
                            duration: 2000,
                            showClose: false,
                            center: false,
                        });
                        return false;
                    }

                })
            }
        })
        $(".alipayment").click(function() {
            if (pay.isWeixn) {
                $.message({
                    message: "微信不支持支付宝支付,请点击右上角在系统浏览器中打开",
                    type: 'warning',
                    duration: 4000,
                    showClose: false,
                    center: false,
                });
                return false;
            } else {
                // 支付宝h5场景
                //单选框
                if ($('input[type="radio"]:checked').length != 0) {
                    var radio = $("input[name=Storage]")
                    var radiovalue = '';
                    for (var i = 0; i < radio.length; i++) {
                        if (radio[i].checked == true) {
                            radiovalue = radio[i].value;
                            break;
                        }
                    }
                } else {
                    $.message({
                        message: "请选择一个张门票",
                        type: 'warning',
                        duration: 2000,
                        showClose: false,
                        center: false,
                    });
                    return false;
                }
                var data = "wechatId=" + phone +//手机号
                    "&goodsId=" + signUpId +//用户报名表id,
                    "&productName="+ type+"-" + titlename+//活动名+票简称
                    "&productType=活动" +//活动
                    "&payment=" + radiovalue +//支付金额
                    "&quantity=1" +
                    "&totalPrice=" + radiovalue +//支付金额
                    "&buyerMessage=" + name + '-' + company //用户姓名-公司名
                $.ajax({
                    type: "post",
                    async: false,
                    data: data,
                    dataType: "json",
                    url: changeUrl.address + '/order/create_activity.do',
                    success: function(data) {
                        console.log(data)
                        if (data.code == 0) {
                            buyerMessage = data.data.buyerMessage //名字加公司
                            createTime = data.data.createTime //时间
                            goodsId = data.data.goodsId //id
                            payment = data.data.payment //价钱
                            orderNo = data.data.orderNo //订单号
                            wechatId = data.data.wechatId //手机号
                            productName = data.data.productName //vis2019
                            productType = data.data.productType //活动
                            quantity = data.data.quantity //是否公开信息
                            localStorage["paybody"] = productName + "-" + titlename
                            localStorage["orderNo"] = orderNo
                            localStorage["payment"] = payment
                            localStorage["wechatId"] = wechatId
                            $.ajax({
                                type: 'get',
                                url: changeUrl.address + '/Pay/ali_app_pay.do',
                                data: {
                                    "subject": localStorage["paybody"],
                                    "body": localStorage["orderNo"],
                                    "total_fee": localStorage["payment"],
                                    "returnUrl": changeUrl.Catalog + "/common-event/alisuccess.html?phone=" + localStorage["wechatId"]
                                },
                                success: function(data) {
                                    console.log(data + "app支付宝支付")
                                    $("body").append(data)
                                },
                                error: function() {
                                    alert('请求失败')

                                }
                            })
                        }
                    },
                    error: function() {
                        localStorage["paybody"] = ""
                        localStorage["orderNo"] = ""
                        localStorage["payment"] = ""
                        localStorage["wechatId"] = ""
                        $.message({
                            message: "创建订单失败，请联系新学说客服",
                            type: 'warning',
                            duration: 2000,
                            showClose: false,
                            center: false,
                        });
                        $('#loading').modal('hide');
                        return false;
                    }

                })

            }
        })
        //pc端微信支付宝付款
    } else {
        $(".wechatpayment").click(function() {
            //单选框
            if ($('input[type="radio"]:checked').length != 0) {
                var radio = $("input[name=Storage]")
                var radiovalue = '';
                for (var i = 0; i < radio.length; i++) {
                    if (radio[i].checked == true) {
                        radiovalue = radio[i].value;
                        break;
                    }
                }
            } else {
                $.message({
                    message: "请选择一个张门票",
                    type: 'warning',
                    duration: 2000,
                    showClose: false,
                    center: false,
                });
                return false;
            }
            var data = "wechatId=" + phone +//手机号
                    "&goodsId=" + signUpId +//用户报名表id,
                    "&productName="+ type+"-" + titlename+//活动名+票简称
                    "&productType=活动" +//活动
                    "&payment=" + radiovalue +//支付金额
                    "&quantity=1" +
                    "&totalPrice=" + radiovalue +//支付金额
                    "&buyerMessage=" + name + '-' + company //用户姓名-公司名
            $.ajax({
                type: "post",
                async: false,
                data: data,
                dataType: "json",
                url: changeUrl.address + '/order/create_activity.do',
                success: function(data) {
                    $(".wechatpayment").attr("data-toggle", "modal")
                    $(".wechatpayment").attr("data-target", "#myModal")
                    console.log(data)
                    if (data.code == 0) {
                        buyerMessage = data.data.buyerMessage //名字加公司
                        createTime = data.data.createTime //时间
                        goodsId = data.data.goodsId //id
                        payment = data.data.payment //价钱
                        orderNo = data.data.orderNo //订单号
                        wechatId = data.data.wechatId //手机号
                        productName = data.data.productName //vis2019
                        productType = data.data.productType //活动
                        quantity = data.data.quantity //是否公开信息
                        localStorage["paybody"] = productName + "-" + titlename
                        localStorage["orderNo"] = orderNo
                        localStorage["payment"] = payment
                        localStorage["wechatId"] = wechatId
                        wxPay()
                    }
                },
                error: function() {
                    localStorage["paybody"] = ""
                    localStorage["orderNo"] = ""
                    localStorage["payment"] = ""
                    localStorage["wechatId"] = ""
                    $.message({
                        message: "创建订单失败，请联系新学说客服",
                        type: 'warning',
                        duration: 2000,
                        showClose: false,
                        center: false,
                    });
                    $('#loading').modal('hide');
                    return false;
                }

            })

        })
        $(".alipayment").click(function() {
            //单选框
            if ($('input[type="radio"]:checked').length != 0) {
                var radio = $("input[name=Storage]")
                var radiovalue = '';
                for (var i = 0; i < radio.length; i++) {
                    if (radio[i].checked == true) {
                        radiovalue = radio[i].value;
                        break;
                    }
                }
            } else {
                $.message({
                    message: "请选择一个张门票",
                    type: 'warning',
                    duration: 2000,
                    showClose: false,
                    center: false,
                });
                return false;
            }
            var data = "wechatId=" + phone +//手机号
                    "&goodsId=" + signUpId +//用户报名表id,
                    "&productName="+ type+"-" + titlename+//活动名+票简称
                    "&productType=活动" +//活动
                    "&payment=" + radiovalue +//支付金额
                    "&quantity=1" +
                    "&totalPrice=" + radiovalue +//支付金额
                    "&buyerMessage=" + name + '-' + company //用户姓名-公司名
            $.ajax({
                type: "post",
                async: false,
                data: data,
                dataType: "json",
                url: changeUrl.address + '/order/create_activity.do',
                success: function(data) {
                    $(".wechatpayment").attr("data-toggle", "modal")
                    $(".wechatpayment").attr("data-target", "#myModal")
                    console.log(data)
                    if (data.code == 0) {
                        buyerMessage = data.data.buyerMessage //名字加公司
                        createTime = data.data.createTime //时间
                        goodsId = data.data.goodsId //id
                        payment = data.data.payment //价钱
                        orderNo = data.data.orderNo //订单号
                        wechatId = data.data.wechatId //手机号
                        productName = data.data.productName //vis2019
                        productType = data.data.productType //活动
                        quantity = data.data.quantity //是否公开信息
                        localStorage["paybody"] = productName + "-" + titlename
                        localStorage["orderNo"] = orderNo
                        localStorage["payment"] = payment
                        localStorage["wechatId"] = wechatId
                        $.ajax({
                            type: 'get',
                            url: changeUrl.address + '/Pay/ali_pc_pay.do',
                            data: {
                                "subject": localStorage["paybody"],
                                "body": localStorage["orderNo"],
                                "total_fee": localStorage["payment"],
                                "returnUrl": changeUrl.Catalog + "/common-event/alisuccess.html?phone=" + localStorage["wechatId"]
                            },
                            success: function(data) {
                                window.location.href = changeUrl.Catalog + "/common-event/flag.html";
                                localStorage["data"] = data
                                let flagnum = 1
                                let flagTime = 2000
                                flagnum > 30 ? flagTime = 10000 : flagTime = 2000
                                let mytime = setInterval(function() {
                                    flagnum++
                                    $.ajax({
                                        type: 'post',
                                        url: changeUrl.address + '/aliPay/query_order_pay_status.do',
                                        data: {
                                            "orderNo": localStorage["orderNo"],
                                        },
                                        success: function(msg) {
                                            if (flagnum > 50) {
                                                clearInterval(mytime)
                                            };
                                            if (msg.code == 0) {
                                                clearInterval(mytime)
                                                $.message({
                                                    message: "支付成功",
                                                    type: 'success',
                                                    duration: 2000,
                                                    showClose: false,
                                                    center: false,
                                                });
                                            }
                                        },
                                        error: function() {
                                            alert('请求失败')
                                        }
                                    })
                                }, flagTime)

                            },
                            error: function() {
                                alert('请求失败')

                            }
                        })
                    }
                },
                error: function() {
                    localStorage["paybody"] = ""
                    localStorage["orderNo"] = ""
                    localStorage["payment"] = ""
                    localStorage["wechatId"] = ""
                    $.message({
                        message: "创建订单失败，请联系新学说客服",
                        type: 'warning',
                        duration: 2000,
                        showClose: false,
                        center: false,
                    });
                    $('#loading').modal('hide');
                    return false;
                }

            })
        })
    }
    // 微信二维码支付
    var t1;
    var t2;
    function wxPay() {
        loading2()
        $.ajax({
            type: "post",
            data: {
                "body": localStorage["paybody"],
                "total_fee": localStorage["payment"],
                "out_trade_no": localStorage["orderNo"],
                "attach": localStorage["paybody"]
            },
            url: changeUrl.address + '/Pay/pay_qrCode.do',
            success: function(data) {
                var urlimg = data.data
                console.log(data)
                if (data.code == 0) {
                    var xiu = new Image()
                    xiu.src = urlimg
                    $(".modal-footer").find("span").html(localStorage["paybody"])
                    xiu.onload = function() {
                        $("#imagelist").attr("src", urlimg)
                        removeLoading('test');
                        // 定时器开始执行  如果返回的正确就清除定时器 跳转到成功支付页面 
                        t1 = setInterval("time()", 3000);
                        loop(this);
                    }
                }
            }
        })
    }
    // 倒计时
    var waitTime = 120;
    function loop(ele) {
        if (waitTime == 0) {
            ele.disabled = false;
            alert("付款二维码已失效，请从新生成二维码")
            waitTime = 120; // 恢复计时
        } else {
            ele.disabled = true;
            console.log(waitTime + "弹框")
            waitTime--;
            t2 = setTimeout(function() {
                loop(ele) // 关键处-定时循环调用
            }, 1000)
        }
    }
    // 请求后台接口
    function time() {
        $.ajax({
            type: "get",
            data: {
                "orderNo": localStorage["orderNo"],
                "runtime": "1" + Math.random()
            },
            cache: false,
            url: changeUrl.address + '/Pay/query_wxpay_status.do',
            success: function(data) {
                console.log(data)
                if (data.code == 0) {
                    window.clearInterval(t1);
                    $.message({
                        message: "支付成功",
                        type: 'success',
                        duration: 2000,
                        showClose: false,
                        center: false,
                    });
                    $.ajax({
                        type: "get",
                        data: {
                            telphone: localStorage["wechatId"],
                            activeName:localStorage["type"]
                        },
                        url: changeUrl.address + "/CommonApi/send_pay_message.do",
                        success: function(data) {
                            console.log(data)
                            if (data.code == 0) {
                                window.location.href = changeUrl.Catalog + "/common-event/personal.html?phone=" + localStorage["wechatId"]
                            }
                        }
                    })
                }
            }
        })

    }
    // 清除定时器
    $(".close").click(function() {
        waitTime = 120;
        window.clearInterval(t1);
        window.clearTimeout(t2);
    })
    $(".modal").click(function() {
        waitTime = 120;
        window.clearInterval(t1);
        window.clearTimeout(t2);
    })
    $(".gb").click(function() {
        cover.style.display = "none"; //隐藏遮罩层
        modal.style.display = "none"; //隐藏弹出层
    })
    $("#cover").click(function() {
        cover.style.display = "none"; //隐藏遮罩层
        modal.style.display = "none"; //隐藏弹出层
    })

$.ajax({
    type: "get",
    data: {
        activeId: event_ID == null?''+localStorage["activeId"]+'':''+event_ID+''
    },
    url: changeUrl.address + "/activity_tickets/find_item.do",
    success: function(data) {
        var data = data.data
        for(var i in data){
            var html =
            '<div class="col-xs-12 col-md-6  list_color">'+
            '<input type="radio" name="Storage" id="model'+i+'" title="'+data[i].shortName+'" value="'+data[i].ticketPrice+'" />'+
            '<label for="model'+i+'">'+data[i].ticketName+' <span class="yuan">'+data[i].ticketPrice+'元</span></label>'+
            '</div>'
            $(".Block").append(html)
        }
    }
})
//请求是否开启的功能
$.ajax({
    type: "get",
    data: {
        id: event_ID == null?''+localStorage["activeId"]+'':''+event_ID+''
    },
    url: changeUrl.address + '/nsiEvent/detail',
    success: function(data) {
        console.log(data.data)
        if(data.data.ticketInfo01 == '0'){
            $('.guibing').hide()
            $('hr').hide()
        }else{
            $('.guibing').html(data.data.ticketInfo01)
        }
        if(data.data.ticketInfo02 == '0'){
            $('.zunxiang').hide()
            $('hr').hide()
        }else{
            $('.zunxiang').html(data.data.ticketInfo02)
        }
    }
})

