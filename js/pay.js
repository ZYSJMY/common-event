function Pay() {
    this.IsMobile = false
    this.URLdata = ''
    this.isWeixn = false
}
Pay.prototype.init = function() {
    this.getQueryStringArgs()
    this.browserRedirect()
    this.is_weixn()
}
Pay.prototype.getQueryStringArgs = function() {
    var qs = location.search.length > 0 ? location.search.substring(1) : '',
        args = {},
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
    for (i = 0; i < len; i++) {
        let index = items[i].indexOf('=')
        name = decodeURIComponent(items[i].slice(0, index))
        value = decodeURIComponent(items[i].slice(index + 1))
        if (name.length) {
            args[name] = value;
        }
    }
    this.URLdata = args
}
Pay.prototype.browserRedirect = function() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        this.IsMobile = true;
    }
}
Pay.prototype.is_weixn = function() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.isWeixn = true;
    } else {
        this.isWeixn = false;
    }
}