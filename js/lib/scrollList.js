/**
 * Created by m000801 on 2016/11/24.
 */

define(function (require, exports, module) {

    function scrollList(option) {

        var config = {
            ulClass: '.js_scroll_list_ul',
            getItemCb: null,
            dataList: [],
            maxItem: 10,
            autoPlay: true,
            interval: 1500,
            maxLength: 30,
            lineHeight: null,
            transition: 'transform 0.5s ease'
        };

        var autoPlayTimer = 0;

        var currentIndex = 0;

        function _bindEvent() {

        };

        function _log(msg) {
            if (console && typeof console.log == 'function') {
                console.log(msg);
            }
        }

        function _init(opt) {
            var fn = arguments.callee;
            if (!fn.hasInit) {
                fn.hasInit = true;
                config = $.extend({}, config, opt);

                $(config.ulClass).css('position', 'relative');

                _bindEvent();
                if (config.autoPlay) {
                    autoPlay();
                }
            }
        };

        function _getItemHeight(liStr) {
            var $getHeightLi = $(liStr);
            $getHeightLi.css({
                'visibility': 'hidden'
            });
            $(config.ulClass).append($getHeightLi);
            config.lineHeight = $getHeightLi.height();
            $getHeightLi.remove();
        };

        function _moveAction() {

            $('li', config.ulClass).each(function (index, item) {
                if (index >= config.maxItem) {
                    $(item).remove();
                } else {
                    var y = index * config.lineHeight;
                    $(item).css({
                        'transition': config.transition,
                        'transform': 'translateY(' + y + 'px)'
                    });
                }
            });
        }

        function _addItem(item) {
            if (item) {
                var liStr = '';
                if (typeof config.getItemCb === 'function') {
                    try {
                        liStr = config.getItemCb(item);
                    } catch (e) {
                        _log('getItemCb error: ' + JSON.stringify(e) + '; data: ' + JSON.stringify(item));
                    }
                } else {
                    liStr = '<li>' + item.data + '</li>';
                }

                if (liStr) {
                    if (!config.lineHeight) {
                        _getItemHeight(liStr);
                    }

                    var $li = $(liStr);
                    $li.css({
                        'position': 'absolute',
                        'transition': config.transition,
                        'transform': 'translateY(' + -config.lineHeight + 'px)'
                    });

                    $(config.ulClass).prepend($li);

                    setTimeout(function () {
                        _moveAction();
                    }, 50);

                }

            }
        }

        function _getData() {
            var data = null;
            if (config && config.dataList && config.dataList.length) {
                var len = config.dataList.length;
                if (currentIndex >= len) {
                    currentIndex = 0;
                }

                if (currentIndex < 0) {
                    currentIndex = 0;
                }

                data = config.dataList[currentIndex];
                currentIndex++;
            }

            return data;
        }

        _init(option);

        function resetData(list) {
            if (list && list.length >= 0) {
                config.dataList = $.extend([], list);
                $(config.ulClass).html('');
            }else{
                config.dataList = [];
                _log('resetData error: list is not a Array!');
            }
        };

        function getDataList(){
            var list = $.extend({}, config.dataList);
            return list;
        };

        function getConfig() {
            var cf = $.extend({}, config);
            return cf;
        }

        function clear() {
            stop();
            $(config.ulClass).html('');
            config.dataList = [];
        };

        function stop() {
            clearInterval(autoPlayTimer);
        };

        function start() {
            stop();
            autoPlay();
        };

        function appendData(data) {
            if(data){
                if(config.dataList && typeof config.dataList.push === 'function'){

                        var _len = config.dataList.length;
                        $(data).each(function(index,item){
                            config.dataList.push(item);
                        })
                         config.dataList.splice(0,_len);
                }
            }
        };

        function autoPlay() {
            stop();
            autoPlayTimer = setInterval(function () {
                _addItem(_getData());
            }, config.interval);
        };

        return {
            resetData: resetData,
            clear: clear,
            stop: stop,
            start: start,
            appendData: appendData,
            autoPlay: autoPlay,
            getDataList: getDataList,
            getConfig: getConfig
        }

    }

    module.exports = scrollList;

});
