/**
 * Created by m000801 on 2016/11/22.
 */
define(function (require, exports, module) {
    var config = {
        urls: {
            total_accumulated_loans: 'http://112.74.65.206:8088/big_screen/amount?type=total_accumulated_loans',
            total_currently_on_loan: 'http://112.74.65.206:8088/big_screen/amount?type=total_currently_on_loan'
        }
    };
    var accumulated_loans_obj = null;
    var currently_on_loan_obj = null;

    var timer = 0;

    var failTimers = 0;
    var maxFailTimers = 10;

    function renderData(result, dom) {
        if (result) {
            result = result.toString();
            var tmp = result.split(''), str = '';
            for (var i = 0, len = tmp.length; i < len; i++) {
                if (tmp[i] != ",") {
                    str += '<span>' + tmp[i] + '</span>';
                }
            }
            if (dom) {
                dom.innerHTML = str;
            } else {
                return str;
            }

        }
    }

    function countUpInit(element, count, duration_time, option) {
        var options = {
            render: renderData,
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: ''
        };
        $.extend(options, option);
        var account = new CountUp(element, 0 ,count, 0, duration_time, options);
        account.start();
        return account;
    }

    function updateCount(obj, count) {
        obj.update(count);
    }

    function getAccumulatedLoans(cb,count_obj) {
        var url = config.urls.total_accumulated_loans;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            crossDomain:true,
            success: function (ret) {
                if (ret && ret.length) {
                    if(typeof cb === 'function'){
                        cb(accumulated_loans_obj,parseInt(ret[0]['value']));
                    }
                }else{
                    if(typeof cb === 'function'){
                        cb(accumulated_loans_obj,'0');
                    }
                }
            },
            error: function () {
                alert('出错啦，出错服务：' + url);
            }
        });
    }

    function getCurrentlyLoans(cb,count_obj) {
        var url = config.urls.total_currently_on_loan;
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'get',
            contentType: 'application/json',
            crossDomain:true,
            success: function (ret) {
                if (ret && ret.length) {
                    if(typeof cb === 'function'){
                        cb(currently_on_loan_obj,parseInt(ret[0]['value']));
                    }
                }else{
                    if(typeof cb === 'function'){
                        cb(currently_on_loan_obj,'0');
                    }
                }
            },
            error: function () {
                alert('出错啦，出错服务：' + url);
            }
        });
    }

    function loanSetTimer() {//轮询
        accumulated_loans_obj = countUpInit("js_total_accumulated_loans", '0000000', 0, 0, 2.5, {});
        getAccumulatedLoans(updateCount);
        var timer_accu = setInterval(function () {
            getAccumulatedLoans(updateCount);
        }, 5000);

        currently_on_loan_obj = countUpInit("js_total_currently_on_loan", '000000000', 0, 0, 2.5, {});
        getCurrentlyLoans(updateCount);
        var timer_curr = setInterval(function () {
            getCurrentlyLoans(updateCount);
        }, 5000);
    }

    function action(){
        timer = setTimeout(function(){

        },5000);
    }

    function stop(){

    }

    function init() {

      //  loanSetTimer();
        accumulated_loans_obj = countUpInit("js_total_accumulated_loans", '6666', 0, 0, 2.5, {});
        currently_on_loan_obj = countUpInit("js_total_currently_on_loan", '8888', 0, 0, 2.5, {});
        setTimeout(function () {
            $('.js_right_box').show();
        });
    }

    module.exports = {
        init: init
    };
})
