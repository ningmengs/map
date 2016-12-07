/**
 * Created by m000801 on 2016/11/24.
 */
define(function (require, exports, module) {

    var config = {
        url: {
            today_loan_amounts_cash: 'http://112.74.65.206:8088/big_screen/map?type=loans_messages&count=30'
        }
    };

    var ScrollList = null;

    var timer = 0;

    var failTimers = 0;
    var maxFailTimers = 10;

    window.myScroll = null;

    function formateMoney(money, fixed, len) {
        var n = parseInt(fixed) || 2,
            len = parseInt(len) || 3,
            money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "",
            l = money.split(".")[0].split("").reverse(),
            r = money.split(".")[1],
            t = "";

        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % len == 0 && (i + 1) != l.length ? "," : "");
        }

        if (fixed == 0) {
            return t.split("").reverse().join("");
        } else {
            return t.split("").reverse().join("") + "." + r;
        }
    }

    function makeItemHtml(data) {
        var str = '<li><span>' + data['city'] + '</span><span>' + data['type']
            + '</span><span>' + formateMoney(data['amount']) + '</span></li>';
        return str;
    };

    function getLoanAmount(cb) {
        var url = config.url.today_loan_amounts_cash;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            success: function (ret) {
                failTimers = 0;
                if (ret && ret.length) {
                    if(typeof cb === 'function'){
                        cb(ret);
                    }
                }else{

                }
                action();
            },
            error: function () {

                failTimers++;
                if(failTimers<maxFailTimers){
                    action();
                }else{
                    stop();
                    alert('出错啦，出错服务：' + url);
                }
            }
        });
    }

    function action() {
        timer = setTimeout(function () {
            getLoanAmount(myScroll.appendData);
        }, 18000);
    }

    function stop() {
        clearTimeout(timer);
    }

    function loanAmountSetTimer() {

        myScroll = new ScrollList({
            ulClass: '.js_scroll_ul',
            getItemCb: makeItemHtml,
            dataList: [],
            maxItem: 10,
            autoPlay: false,
            interval: 1500,
            lineHeight: null
        });
        getLoanAmount(myScroll.resetData);
        myScroll.start();
    }

    function init() {

        ScrollList = require('./../lib/scrollList');
        loanAmountSetTimer();
        setTimeout(function () {
            $('.scroll-box').show();
        });
    }

    module.exports = {
        init: init
    };
})
