$(function() {
    var height = $(window).height()
    $(document.body).css("min-height", height)
})

//时间转换   
function formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d 
};

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}
var phone = (getQueryString("phone"));
vis_list(phone)
// if (phone == null || phone == "") {
//     //wechatId 是手机号
//     if (localStorage["wechatId"] == null || localStorage["wechatId"] == undefined) {
//         cover.style.display = "block"; //显示遮罩层
//         modal.style.display = "block"; //显示弹出层
//     } else {
//         $(".text_phone span").html("用户手机号：" + localStorage["wechatId"] + "&nbsp;&nbsp;&nbsp;")
        
//         vis_list(localStorage["wechatId"])
//     }
// } else {
//     $(".text_phone span").html("用户手机号：" + phone + "&nbsp;&nbsp;&nbsp;")
//     $(".text_phone #qiehuan").html("切换账号")
//     vis_list(phone)
// }

//请求数据
function vis_list(wechatId) {
    $.ajax({
        type: "get",
        data: {
            "phone": wechatId,
            pageNum:1,
            pageSize:10
        },
        url: changeUrl.address + '/event_collect/List_byPhone.do',
        success: function(data) {
            console.log(data.data.list)
            if (data.code == 0) {
               var  data = data.data.list
                if (data == "") {
                    $(".dingdan").css("display", "block")
                    $(".main").css("display", "none")
                    $(".text_phone span").css("display", "none")
                    $(".text_phone a").css("display", "none")
                } else {
                    for (var i in data) {
                        $.ajax({
                            type: "get",
                            async: true,
                            dataType: "json",
                            async:false,
                            url: changeUrl.address + '/nsiEvent/detail?id='+data[i].activeId,
                            success: function(src) {
                                console.log(src)
                                data[i].option1 = src.data.openInvoice
                                data[i].option2 = src.data.eventStartTime
                                data[i].option3 = src.data.eventPlace
                                data[i].option4 = src.data.openPay
                                data[i].option5 = src.data.openVerify
                            }
                        }) 
                    }
                    for(var k in data){
                        var html = '<hr>' +
                            ' <div>' +
                            '<div  class="main_list_one main_list_d  main_list_one' + k + '">' +
                            '<h4 title="' + data[k].name + '" id="' + data[k].goodsId + '" data-type="' + data[k].productName.split("-").pop() + '" data-phone="' + data[k].telphone + '" data-creattime="' + data[k].createTime + '" data-order="' + data[k].orderNo + '" class="pull-left pull_name"><span>' + data[k].name + '</span>'+
                            '</h4>' +
                            '<button type="button" class="btn btn-primary pull-right">查看电子门票</button>' +
                            '</div>' +
                            '<p class="text-muted piao' + k + '"></p>' +
                            '<p class="text-muted time"> <span class="time_data' + k + '">时间：'+formatDateTime(new Date(Number(data[k].option2)))+'</span><span class="border-left"></span><span>'+(data[k].option3 !='0'?''+data[k].option3+'':'')+'</span>'+
                            '<a href="#"  title="' + data[k].totalPrice + '" class="invoice invoice_hide' + k + '" data-order="' + data[k].orderNo + '" data-phone="' + data[k].telphone + '"  style="float:right;text-decoration: underline;margin-left: 15px;">申请发票</a>'+
                            '<span class="status' + k + '" style="float:right;margin-left: 15px;"></span>'+
                            '<span class="verify' + k + '" style="float:right;"></span>'+
                            '</p>' +
                            '</div>'
                        $(".main_list").append(html)
                        if(data[k].option1 == 0){
                            $(".invoice_hide" + k).css("display", "none")
                        }
                        if(data[k].option4 == 1 && data[k].option5 == 0){
                            $(".status" + k).html('已支付')
                            $(".verify" + k).css("display", "none")
                        }
                        if(data[k].option4 == 0 && data[k].option5 == 0){
                            $(".status" + k).css("display", "none")
                            $(".verify" + k).css("display", "none")
                        }
                        if(data[k].option4 == 0 && data[k].option5 == 1){
                            $(".status" + k).css("display", "none")
                            if(data[k].verify == 0){
                                $(".verify" + k).html('已通过')
                            }
                            if(data[k].verify == 1){
                                $(".verify" + k).html('审核中')
                            }
                            if(data[k].verify == 2){
                                $(".verify" + k).html('审核拒绝')
                            }
                        }
                        if(data[k].option4 == 1 && data[k].option5 == 1){
                            $(".status" + k).css("display", "none")
                            if(data[k].verify == 0){
                                $(".verify" + k).html('已通过')
                            }
                            if(data[k].verify == 1){
                                $(".verify" + k).html('审核中')
                            }
                            if(data[k].verify == 2){
                                $(".verify" + k).html('审核拒绝')
                            }
                        }
                    }
                }
            }
        }
    })
}
//切换手机号
$("#qiehuan").click(function() {
    cover.style.display = "block"; //显示遮罩层
    modal.style.display = "block"; //显示弹出层
})
$(".text_phone #qiehuan").html("切换账号")
var waitTime = 60;
function time(ele) {
    if (waitTime == 0) {
        ele.disabled = false;
        ele.innerHTML = "获取验证码";
        waitTime = 60; // 恢复计时
    } else {
        ele.disabled = true;
        ele.innerHTML = waitTime + "秒后重新发送";
        waitTime--;
        setTimeout(function() {
            time(ele) // 关键处-定时循环调用
        }, 1000)
    }
}
// 获取验证码
$("#Code_btn").click(function() {
    var myreg = /^[1][3,4,5,7,8,6,1,2,9][0-9]{9}$/;
    if ($("input[name=tel]").val() == "") {
        $.message({
            message: "手机号不能为空！",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else if (!myreg.test($("input[name=tel]").val())) {
        $.message({
            message: "手机号格式不正确，请正确输入!",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });　　
        return false;
    } else {
        //验证码
        time(this);
        var mobile = $("input[name=tel]").val()
        $.ajax({
            type: "post",
            async: true,
            dataType: "json",
            url: changeUrl.address + '/CommonApi/sendSms.do?mobile=' + mobile,
            success: function(data) {}
        })
    }
})
$("#sub").click(function() {
    var myreg = /^[1][3,4,5,7,8,6,1,2,9][0-9]{9}$/;
    if ($("input[name=tel]").val() == "") {
        $.message({
            message: "手机号不能为空！",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else if (!myreg.test($("input[name=tel]").val())) {
        $.message({
            message: "手机号格式不正确，请正确输入!",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });　　
        return false;
    }
    if ($("input[name=code]").val() == "") {
        $.message({
            message: "验证码不能为空！",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else {
        var mobile = $("input[name=tel]").val()
        var code = $("input[name=code]").val()
        $.ajax({
            type: "post",
            async: true,
            dataType: "json",
            url: changeUrl.address + '/CommonApi/check_code.do?mobile=' + mobile + '&code=' + code,
            success: function(data) {
                console.log(data)
                if (data.code == 0) {
                    window.location.href = changeUrl.Catalog + "/common-event/personal.html?phone=" + mobile
                } else {
                    $.message({
                        message: data.msg,
                        type: 'warning',
                        duration: 2000,
                        showClose: false,
                        center: false,
                    });
                    return false;
                }
            }
        })
    }
})
$(document).on('click', ".main_list_d", function() {
    var nameval = $(this).find(".pull_name").attr("title")
    var ID = $(this).find(".pull_name").attr("id")
    var type = $(this).find(".pull_name").data('type')
    var phone = $(this).find(".pull_name").data("phone")
    var creattime = $(this).find(".pull_name").data("creattime")
    var orderNo = $(this).find(".pull_name").data("order")
    window.location.href = changeUrl.Catalog + "/common-event/successPay.html?name="+nameval+'&id='+ID+'&type='+type+'&phone='+phone+'&creattime='+creattime+'&orderNo='+orderNo
})

$(document).on('click', ".invoice", function() {
    var orderNo = $(this).data("order")
    var phone = $(this).data("phone")
    var totalPrice = $(this).attr("title")
    //判断是否开过发票
    $.ajax({
        type: "get",
        url: changeUrl.address + '/Invoice/check_invoice.do?orderNo=' + orderNo,
        success: function(data) {
            console.log(data)
            if (data.code == 1) {
                $.message({
                    message: "您已申请过发票了哦",
                    type: 'success',
                    duration: 2000,
                    showClose: false,
                    center: false,
                });
            } else {
                window.location.href = changeUrl.Catalog +"/common-event/invoice.html?orderNo=" + orderNo + "&totalPrice=" + totalPrice + "&phone=" + phone
            }
        }
    })
})
$("#shuaxin").click(function() {
    location.reload();
})
$("#cover1").click(function() {
    cover1.style.display = "none"; //隐藏遮罩层
    modal1.style.display = "none"; //隐藏弹出层
})