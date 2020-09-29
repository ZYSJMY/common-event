$(function() {
    var height = $(window).height()
    $(document.body).css("min-height", height)
})
// var qrcode = new QRCode(document.getElementById("qrcode"), {
// 	width : 260,
// 	height : 260
// });
// console.log(qrcode)
// function makeCode () {		
// 	var elText = document.getElementById("text");
// 	if (!elText.value) {
// 		alert("Input a text");
// 		elText.focus();
// 		return;
// 	}
// 	qrcode.makeCode(elText);
// }
// makeCode();
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}
var name = (getQueryString("name"));
var ID = (getQueryString("id"));
var type = (getQueryString("type"));
var phone = (getQueryString("phone"));
var creattime = (getQueryString("creattime"));
var orderNo = (getQueryString("orderNo"));

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
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
var creattimeNew = formatDateTime(new Date(Number(creattime)));
$(".phone").html("手机号：" + phone)
$(".creattimeNew").html("购买时间：" + creattimeNew)
$(".orderNo").html("订单号：" + orderNo)
function loading2() {
    $('body').loading({
        loadingWidth: 168,
        title: '',
        name: 'test',
        discription: '门票加载中',
        direction: 'column',
        type: 'origin',
        originDivWidth: 40,
        originDivHeight: 40,
        originWidth: 6,
        originHeight: 6,
        smallLoading: false,
        loadingMaskBg: 'rgba(0,0,0,0.2)'
    });
    $.ajax({
        type: "post",
        data: {
            "type": type,
            "username": name,
            "qrImgUrl": 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data='+ID+''
        },
        url: changeUrl.address + "/activity/get_image_synthesis.do",
        success: function(data) {
            console.log(data)
            var data = data.data
            $(".main").find("img").attr("src", data)
            removeLoading('test');
        }
    })
}
loading2()
$(".top_img").click(function() {
    window.location.href = changeUrl.Catalog + "/common-event/personal.html?phone=" + phone
})