
//验证码
var waitTime = 60;
document.getElementById("Code_btn").onclick = function() {
    time(this);
}

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
//获取验证码
$("#Code_btn").click(function() {
        var mobile = $("input[name=telphone]").val()
        $.ajax({
            type: "post",
            async: true,
            dataType: "json",
            url: changeUrl.address + '/CommonApi/sendSms.do?mobile=' + mobile,
            success: function(data) {

            }
        })
    })
//判断手机号是否正确
$("input[name=telphone]").keyup(function(event) {
    var phoneNum = $(this).val();
    var myreg = /^[1][3,4,5,7,8,6,1,2,9][0-9]{9}$/;
    if (phoneNum.length == 11) {
        if ($("input[name=telphone]").val() == "") {
            $.message({
                message: "手机号不能为空！",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        } else if (!myreg.test($("input[name=telphone]").val())) {
            $.message({
                message: "手机号格式不正确，请正确输入!",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });　　
            $("#Code_btn").attr("disabled", true)　
            return false;
        }
        $("#Code_btn").attr("disabled", false)
    } else {
        $("#Code_btn").attr("disabled", true)
    }
})


// body高度
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
//截取url地址
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}
var from = (getQueryString("from"));
console.log()
var id = (getQueryString("id"));
var openPay   
var eventName
var expriyTime
var type
//请求报名表
$.ajax({
    type: "get",
    async: true,
    dataType: "json",
    url: changeUrl.address + '/title_form/detail.do?activeId='+id,
    success: function(data) {
        console.log(data)
        activeId = data.data.activeId;
        expriyTime = data.data.expriyTime;
        $(".name").html(data.data.name)
        $(".company").html(data.data.company)//公司
        $(".position").html(data.data.position)//职位
        $(".userMail").html(data.data.userMail)//邮箱
        $(".telphone").html(data.data.telphone)//手机号
        $(".Deadline").html('报名截止日期:'+ formatDateTime(new Date(Number(data.data.expriyTime))))//邮箱
        var dateTime=new Date();
        dateTime=dateTime.setDate(dateTime.getDate()+1);
        dateTime=new Date(dateTime);
        if(dateTime < formatDateTime(new Date(Number(data.data.expriyTime)))){
            alert("报名时间已截至")
        }
        //1
        if(data.data.type1 == "单选"){
            $('.option1 .form_input').css("display","none")
            $('.option1 .checkbox_Show').css("display","none")
            $('.option1 .select_Show').css("display","none")
            $('.option1 .enabled_Show').css("display","none")
            $(".option1 .radio_title").html(data.data.option1)
            var radio = data.data.value1.split(";").slice(0,-1)
            for(var i in radio){
                var radiohtml = 
                '<label class="radio-inline my_protocol">'+
                  '<input class="input_agreement_protocol" type="radio" name="radio" value='+i+'><span></span>'+radio[i]+''+
                '</label>'
                $(".option1 .radio_List").append(radiohtml)
            }
        }else if(data.data.type1 == "多选"){
            $('.option1 .form_input').css("display","none")
            $('.option1 .radio_Show').css("display","none")
            $('.option1 .select_Show').css("display","none")
            $('.option1 .enabled_Show').css("display","none")
            $(".option1 .checkbox_title").html(data.data.option1)//邮箱
            var checkbox = data.data.value1.split(";").slice(0,-1)
            for(var i in checkbox){
                var checkboxhtml = 
                '<div class="col-md-12">'+
                    '<div class="checkbox">'+
                        '<label class="my_protocol">'+
                        '<input class="input_agreement_protocol" type="checkbox" value="'+checkbox[i]+'"><span></span>'+checkbox[i]+''+
                        '</label>'+
                    '</div>'+
                '</div>'
                $(".option1 .checkbox_List").append(checkboxhtml)
            }
        }else if(data.data.type1 == "下拉"){
            $('.option1 .form_input').css("display","none")
            $('.option1 .radio_Show').css("display","none")
            $('.option1 .checkbox_Show').css("display","none")
            $('.option1 .enabled_Show').css("display","none")
            $(".option1 .select_title").html(data.data.option1)//邮箱
            var select = data.data.value1.split(";").slice(0,-1)
            for(var i in select){
                var selecthtml = 
                '<option>'+select[i]+'</option>'
                $(".option1 #test").append(selecthtml)
            }
        }else if(data.data.type1 == "表单"){
            $('.option1 .select_Show').css("display","none")
            $('.option1 .radio_Show').css("display","none")
            $('.option1 .checkbox_Show').css("display","none")
            $('.option1 .enabled_Show').css("display","none")
            $(".option1 .option").html(data.data.option1)
        }else if(data.data.type1 == "不启用"){
            $(".option1").css("display","none")
        }
        //2
        if(data.data.type2 == "单选"){
            $('.option2 .form_input').css("display","none")
            $('.option2 .checkbox_Show').css("display","none")
            $('.option2 .select_Show').css("display","none")
            $('.option2 .enabled_Show').css("display","none")
            $(".option2 .radio_title").html(data.data.option2)//邮箱
            var radio = data.data.value2.split(";").slice(0,-1)
            for(var i in radio){
                var radiohtml = 
                '<label class="radio-inline my_protocol">'+
                  '<input class="input_agreement_protocol" type="radio" name="radio" value='+i+'><span></span>'+radio[i]+''+
                '</label>'
                $(".option2 .radio_List").append(radiohtml)
            }
        }else if(data.data.type2 == "多选"){
            $('.option2 .form_input').css("display","none")
            $('.option2 .radio_Show').css("display","none")
            $('.option2 .select_Show').css("display","none")
            $('.option2 .enabled_Show').css("display","none")
            $(".option2 .checkbox_title").html(data.data.option2)//邮箱
            var checkbox = data.data.value2.split(";").slice(0,-1)
            for(var i in checkbox){
                var checkboxhtml = 
                '<div class="col-md-12">'+
                    '<div class="checkbox">'+
                        '<label class="my_protocol">'+
                        '<input class="input_agreement_protocol" type="checkbox" value="'+checkbox[i]+'"><span></span>'+checkbox[i]+''+
                        '</label>'+
                    '</div>'+
                '</div>'
                $(".option2 .checkbox_List").append(checkboxhtml)
            }
        }else if(data.data.type2 == "下拉"){
            $('.option2 .form_input').css("display","none")
            $('.option2 .radio_Show').css("display","none")
            $('.option2 .checkbox_Show').css("display","none")
            $('.option2 .enabled_Show').css("display","none")
            $(".option2 .select_title").html(data.data.option2)//邮箱
            var select = data.data.value2.split(";").slice(0,-1)
            for(var i in select){
                var selecthtml = 
                '<option>'+select[i]+'</option>'
                $(".option2 #test").append(selecthtml)
            }
        }else if(data.data.type2 == "表单"){
            $('.option2 .select_Show').css("display","none")
            $('.option2 .radio_Show').css("display","none")
            $('.option2 .checkbox_Show').css("display","none")
            $('.option2 .enabled_Show').css("display","none")
            $(".option2 .option").html(data.data.option2)
        }else if(data.data.type2 == "不启用"){
            $(".option2").css("display","none")
        }
        //3
        if(data.data.type3 == "单选"){
            $('.option3 .form_input').css("display","none")
            $('.option3 .checkbox_Show').css("display","none")
            $('.option3 .select_Show').css("display","none")
            $('.option3 .enabled_Show').css("display","none")
            $(".option3 .radio_title").html(data.data.option3)//邮箱
            var radio = data.data.value3.split(";").slice(0,-1)
            for(var i in radio){
                var radiohtml = 
                '<label class="radio-inline my_protocol">'+
                  '<input class="input_agreement_protocol" type="radio" name="radio" value='+i+'><span></span>'+radio[i]+''+
                '</label>'
                $(".option3 .radio_List").append(radiohtml)
            }
        }else if(data.data.type3 == "多选"){
            $('.option3 .form_input').css("display","none")
            $('.option3 .radio_Show').css("display","none")
            $('.option3 .select_Show').css("display","none")
            $('.option3 .enabled_Show').css("display","none")
            $(".option3 .checkbox_title").html(data.data.option3)//邮箱
            var checkbox = data.data.value3.split(";").slice(0,-1)
            for(var i in checkbox){
                var checkboxhtml = 
                '<div class="col-md-12">'+
                    '<div class="checkbox">'+
                        '<label class="my_protocol">'+
                        '<input class="input_agreement_protocol" type="checkbox" value="'+checkbox[i]+'"><span></span>'+checkbox[i]+''+
                        '</label>'+
                    '</div>'+
                '</div>'
                $(".option3 .checkbox_List").append(checkboxhtml)
            }
        }else if(data.data.type3 == "下拉"){
            $('.option3 .form_input').css("display","none")
            $('.option3 .radio_Show').css("display","none")
            $('.option3 .checkbox_Show').css("display","none")
            $('.option3 .enabled_Show').css("display","none")
            $(".option3 .select_title").html(data.data.option3)//邮箱
            var select = data.data.value3.split(";").slice(0,-1)
            for(var i in select){
                var selecthtml = 
                '<option>'+select[i]+'</option>'
                $(".option3 #test").append(selecthtml)
            }
        }else if(data.data.type3 == "表单"){
            $('.option3 .select_Show').css("display","none")
            $('.option3 .radio_Show').css("display","none")
            $('.option3 .checkbox_Show').css("display","none")
            $('.option3 .enabled_Show').css("display","none")
            $(".option3 .option").html(data.data.option3)
        }else if(data.data.type3 == "不启用"){
            $(".option3").css("display","none")
        }
        //4
        if(data.data.type4 == "单选"){
            $('.option4 .form_input').css("display","none")
            $('.option4 .checkbox_Show').css("display","none")
            $('.option4 .select_Show').css("display","none")
            $('.option4 .enabled_Show').css("display","none")
            $(".option4 .radio_title").html(data.data.option4)//邮箱
            var radio = data.data.value4.split(";").slice(0,-1)
            for(var i in radio){
                var radiohtml = 
                '<label class="radio-inline my_protocol">'+
                  '<input class="input_agreement_protocol" type="radio" name="radio" value='+i+'><span></span>'+radio[i]+''+
                '</label>'
                $(".option4 .radio_List").append(radiohtml)
            }
        }else if(data.data.type4 == "多选"){
            $('.option4 .form_input').css("display","none")
            $('.option4 .radio_Show').css("display","none")
            $('.option4 .select_Show').css("display","none")
            $('.option4 .enabled_Show').css("display","none")
            $(".option4 .checkbox_title").html(data.data.option4)//邮箱
            var checkbox = data.data.value4.split(";").slice(0,-1)
            for(var i in checkbox){
                var checkboxhtml = 
                '<div class="col-md-12">'+
                    '<div class="checkbox">'+
                        '<label class="my_protocol">'+
                        '<input class="input_agreement_protocol" type="checkbox" value="'+checkbox[i]+'"><span></span>'+checkbox[i]+''+
                        '</label>'+
                    '</div>'+
                '</div>'
                $(".option4 .checkbox_List").append(checkboxhtml)
            }
        }else if(data.data.type4 == "下拉"){
            $('.option4 .form_input').css("display","none")
            $('.option4 .radio_Show').css("display","none")
            $('.option4 .checkbox_Show').css("display","none")
            $('.option4 .enabled_Show').css("display","none")
            $(".option4 .select_title").html(data.data.option4)//邮箱
            var select = data.data.value4.split(";").slice(0,-1)
            for(var i in select){
                var selecthtml = 
                '<option>'+select[i]+'</option>'
                $(".option4 #test").append(selecthtml)
            }
        }else if(data.data.type4 == "表单"){
            $('.option4 .select_Show').css("display","none")
            $('.option4 .radio_Show').css("display","none")
            $('.option4 .checkbox_Show').css("display","none")
            $('.option4 .enabled_Show').css("display","none")
            $(".option4 .option").html(data.data.option4)
        }else if(data.data.type4 == "不启用"){
            $(".option4").css("display","none")
        }
        //5
        if(data.data.type5 == "单选"){
            $('.option5 .form_input').css("display","none")
            $('.option5 .checkbox_Show').css("display","none")
            $('.option5 .select_Show').css("display","none")
            $('.option5 .enabled_Show').css("display","none")
            $(".option5 .radio_title").html(data.data.option5)//邮箱
            var radio = data.data.value5.split(";").slice(0,-1)
            for(var i in radio){
                var radiohtml = 
                '<label class="radio-inline my_protocol">'+
                  '<input class="input_agreement_protocol" type="radio" name="radio" value='+i+'><span></span>'+radio[i]+''+
                '</label>'
                $(".option5 .radio_List").append(radiohtml)
            }
        }else if(data.data.type5 == "多选"){
            $('.option5 .form_input').css("display","none")
            $('.option5 .radio_Show').css("display","none")
            $('.option5 .select_Show').css("display","none")
            $('.option5 .enabled_Show').css("display","none")
            $(".option5 .checkbox_title").html(data.data.option5)//邮箱
            var checkbox = data.data.value5.split(";").slice(0,-1)
            for(var i in checkbox){
                var checkboxhtml = 
                '<div class="col-md-12">'+
                    '<div class="checkbox">'+
                        '<label class="my_protocol">'+
                        '<input class="input_agreement_protocol" type="checkbox" value="'+checkbox[i]+'"><span></span>'+checkbox[i]+''+
                        '</label>'+
                    '</div>'+
                '</div>'
                $(".option5 .checkbox_List").append(checkboxhtml)
            }
        }else if(data.data.type5 == "下拉"){
            $('.option5 .form_input').css("display","none")
            $('.option5 .radio_Show').css("display","none")
            $('.option5 .checkbox_Show').css("display","none")
            $('.option5 .enabled_Show').css("display","none")
            $(".option5 .select_title").html(data.data.option5)//邮箱
            var select = data.data.value5.split(";").slice(0,-1)
            for(var i in select){
                var selecthtml = 
                '<option>'+select[i]+'</option>'
                $(".option5 #test").append(selecthtml)
            }
        }else if(data.data.type5 == "表单"){
            $('.option5 .select_Show').css("display","none")
            $('.option5 .radio_Show').css("display","none")
            $('.option5 .checkbox_Show').css("display","none")
            $('.option5 .enabled_Show').css("display","none")
            $(".option5 .option").html(data.data.option5)
        }else if(data.data.type5 == "不启用"){
            $(".option5").css("display","none")
        }
    }
})
//请求是否开启的功能
$.ajax({
    type: "get",
    async: true,
    dataType: "json",
    url: changeUrl.address + '/nsiEvent/detail?id='+id,
    success: function(data) {
        console.log(data.data)
        eventName = data.data.eventName
        type = data.data.type
        $("#activityTitle").html(data.data.eventName)
        $("title").html(data.data.eventName)
        $("#activityDescription").html(data.data.eventSummary)
        $(".activeTitle_desc").html('新学说-'+data.data.eventName+'报名表')
        openPay = data.data.openPay
        weixinShare(data.data.eventName, data.data.eventSummary, 'https://data.xinxueshuo.cn/upImage/upInstitutionImg/100062/100062-logo.jpg')
    }
})  
//提交表单
var sub = $("#sub")
sub.on("click", function() {
    //邮箱
    var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    //手机号
    var myreg = /^[1][3,4,5,7,8,6,1,2,9][0-9]{9}$/;
    if ($("input[name=name]").val() == "") {
        $.message({
            message: "姓名不能为空！",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else {
        var nameval = $("input[name=name]").val()
    }
    if ($("input[name=company]").val() == "") {
        $.message({
            message: "公司或学校不能为空！",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else {
        var companyval = $("input[name=company]").val()
    }
    if ($("input[name=position]").val() == "") {
        $.message({
            message: "职位不能为空！",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else {
        var positionval = $("input[name=position]").val()
    }
    if ($("input[name=userMail]").val() == "") {
        $.message({
            message: "邮箱不能为空！",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else if (!reg.test($("input[name=userMail]").val())) {
        $.message({
            message: "邮箱格式不正确，请正确输入!",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else {
        var userMailval = $("input[name=userMail]").val()
    }
    //1
    if($(".option1 .radio_Show").is(":hidden")!=true){
        if ($('input[type="radio"]:checked').length != 0) {
            var radio = $("input[name=radio]")
            var optionval1 = ''; //radiovalue为radio中选中的值
            for (var i = 0; i < radio.length; i++) {
                if (radio[i].checked == true) {
                    optionval1 = radio[i].value;
                    break;
                }
            }
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option1 .checkbox_Show").is(":hidden")!=true){
        if ($('input[type="checkbox"]:checked').length != 0) {
            var checkbox_array = new Array();
            $('input[type="checkbox"]:checked').each(function() {
                checkbox_array.push($(this).val()); //向数组中添加元素  
            });
            var optionval1 = checkbox_array.join(','); //将数组元素连接起来以构建一个字符串
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option1 .select_Show").is(":hidden")!=true){
        var selected = $(".option1 #test option:selected");
        var optionval1 = selected.val()
    }else if($(".option1 .form_input").is(":hidden")!=true){
        if ($(".option1 input[name=option]").val() == "") {
            $.message({
                message: "请输入意见！",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        } else {
            var optionval1 = $(".option1 input[name=option]").val()
        }
    }else if($(".option1").is(":hidden")==true){
        var optionval1 = "0"
    }
    //2
    if($(".option2 .radio_Show").is(":hidden")!=true){
        if ($('input[type="radio"]:checked').length != 0) {
            var radio = $("input[name=radio]")
            var optionval2 = ''; //radiovalue为radio中选中的值
            for (var i = 0; i < radio.length; i++) {
                if (radio[i].checked == true) {
                    optionval2 = radio[i].value;
                    break;
                }
            }
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option2 .checkbox_Show").is(":hidden")!=true){
        if ($('input[type="checkbox"]:checked').length != 0) {
            var checkbox_array = new Array();
            $('input[type="checkbox"]:checked').each(function() {
                checkbox_array.push($(this).val()); //向数组中添加元素  
            });
            var optionval2 = checkbox_array.join(','); //将数组元素连接起来以构建一个字符串
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option2 .select_Show").is(":hidden")!=true){
        var selected = $(".option2 #test option:selected");
        var optionval2 = selected.val()
    }else if($(".option2 .form_input").is(":hidden")!=true){
        if ($(".option2 input[name=option]").val() == "") {
            $.message({
                message: "请输入意见！",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        } else {
            var optionval2 = $(".option2 input[name=option]").val()
        }
    }else if($(".option2").is(":hidden")==true){
        var optionval2 = "0"
    }
    //3
    if($(".option3 .radio_Show").is(":hidden")!=true){
        if ($('input[type="radio"]:checked').length != 0) {
            var radio = $("input[name=radio]")
            var optionval3 = ''; //radiovalue为radio中选中的值
            for (var i = 0; i < radio.length; i++) {
                if (radio[i].checked == true) {
                    optionval3 = radio[i].value;
                    break;
                }
            }
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option3 .checkbox_Show").is(":hidden")!=true){
        if ($('input[type="checkbox"]:checked').length != 0) {
            var checkbox_array = new Array();
            $('input[type="checkbox"]:checked').each(function() {
                checkbox_array.push($(this).val()); //向数组中添加元素  
            });
            var optionval3 = checkbox_array.join(','); //将数组元素连接起来以构建一个字符串
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option3 .select_Show").is(":hidden")!=true){
        var selected = $(".option3 #test option:selected");
        var optionval3 = selected.val()
    }else if($(".option3 .form_input").is(":hidden")!=true){
        if ($(".option3 input[name=option]").val() == "") {
            $.message({
                message: "请输入意见！",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        } else {
            var optionval3 = $(".option3 input[name=option]").val()
        }
    }else if($(".option3").is(":hidden")==true){
        var optionval3 = "0"
    }
    //4
    if($(".option4 .radio_Show").is(":hidden")!=true){
        if ($('input[type="radio"]:checked').length != 0) {
            var radio = $("input[name=radio]")
            var optionval4 = ''; //radiovalue为radio中选中的值
            for (var i = 0; i < radio.length; i++) {
                if (radio[i].checked == true) {
                    optionval4 = radio[i].value;
                    break;
                }
            }
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option4 .checkbox_Show").is(":hidden")!=true){
        if ($('input[type="checkbox"]:checked').length != 0) {
            var checkbox_array = new Array();
            $('input[type="checkbox"]:checked').each(function() {
                checkbox_array.push($(this).val()); //向数组中添加元素  
            });
            var optionval4 = checkbox_array.join(','); //将数组元素连接起来以构建一个字符串
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option4 .select_Show").is(":hidden")!=true){
        var selected = $(".option4 #test option:selected");
        var optionval4 = selected.val()
    }else if($(".option4 .form_input").is(":hidden")!=true){
        if ($(".option4 input[name=option]").val() == "") {
            $.message({
                message: "请输入意见！",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        } else {
            var optionval4 = $(".option4 input[name=option]").val()
        }
    }else if($(".option4").is(":hidden")==true){
        var optionval4 = "0"
    }
    //5
    if($(".option5 .radio_Show").is(":hidden")!=true){
        if ($('input[type="radio"]:checked').length != 0) {
            var radio = $("input[name=radio]")
            var optionval5 = ''; //radiovalue为radio中选中的值
            for (var i = 0; i < radio.length; i++) {
                if (radio[i].checked == true) {
                    optionval5 = radio[i].value;
                    break;
                }
            }
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option5 .checkbox_Show").is(":hidden")!=true){
        if ($('input[type="checkbox"]:checked').length != 0) {
            var checkbox_array = new Array();
            $('input[type="checkbox"]:checked').each(function() {
                checkbox_array.push($(this).val()); //向数组中添加元素  
            });
            var optionval5 = checkbox_array.join(','); //将数组元素连接起来以构建一个字符串
        } else {
            $.message({
                message: "需求至少要选择一项",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        }
    }else if($(".option5 .select_Show").is(":hidden")!=true){
        var selected = $(".option5 #test option:selected");
        var optionval5 = selected.val()
    }else if($(".option5 .form_input").is(":hidden")!=true){
        if ($(".option5 input[name=option]").val() == "") {
            $.message({
                message: "请输入意见！",
                type: 'warning',
                duration: 2000,
                showClose: false,
                center: false,
            });
            return false;
        } else {
            var optionval5 = $(".option5 input[name=option]").val()
        }
    }else if($(".option5").is(":hidden")==true){
        var optionval5 = "0"
    }
    if ($("input[name=telphone]").val() == "") {
        $.message({
            message: "手机号不能为空！",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else if (!myreg.test($("input[name=telphone]").val())) {
        $.message({
            message: "手机号格式不正确，请正确输入!",
            type: 'warning',
            duration: 2000,
            showClose: false,
            center: false,
        });
        return false;
    } else {
        var telphoneval = $("input[name=telphone]").val()
    }
    var code = $("input[name=code]").val()
    $.ajax({
        type: "post",
        async: true,
        dataType: "json",
        url: changeUrl.address + '/CommonApi/check_code.do?mobile=' + telphoneval + '&code=' + code,
        success: function(data) {
            console.log(data)
            if (data.code != 0) {
                $.message({
                    message: data.msg,
                    type: 'warning',
                    duration: 2000,
                    showClose: false,
                    center: false,
                });
                return false;
            } else {
                var Data = 
                "name=" + nameval +  "&company=" + companyval + 
                "&position=" + positionval + "&userMail=" + userMailval + 
                "&telphone=" + telphoneval + "&option1=" + optionval1 + 
                "&option2=" + optionval2 + "&option3=" + optionval3 + 
                "&option4="+optionval4  + "&option5=" + optionval5 + 
                "&activeId=" + activeId + "&isCheck=0" + "&from=" + (from==null?'0':from)
                $.ajax({
                    type: "post",
                    data: Data,
                    async: true,
                    dataType: "json",
                    url: changeUrl.address + '/event_collect/add_event_collect.do',
                    success: function(data) {
                        console.log(data.data.id)
                        console.log(data.data.activeId)
                        var  event_id = data.data.activeId
                        var  signUpId = data.data.id
                        if(data.code == 0){
                            if(openPay == 1){
                                window.location.href = changeUrl.Catalog + "/common-event/purchase.html?name=" + nameval + "&company=" + companyval + "&phone=" + telphoneval + "&event_id=" + event_id + "&type=" + type+ "&signUpId=" + signUpId
                            }else{
                                window.location.href = changeUrl.Catalog + "/common-event/success.html"
                            }
                        }
                    }
                })
            }
        }
    })
})