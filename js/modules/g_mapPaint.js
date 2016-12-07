/**
 * Created by m000801 on 2016/11/25.
 */
define(function (require, exports, module) {

    var config = {
        urls: {
            radiation: 'http://112.74.65.206:8088/big_screen/map?type=loans_flyingline',
            scatter: 'http://112.74.65.206:8088/big_screen/map?type=loans_scatter',
            area: 'http://112.74.65.206:8088/big_screen/map?type=loans_areas'
        }
    };

    var citys = {}, _paint = null;

    function getAreaMax(data) {
        var _data = data.sort(function (o1, o2) {
            return o1.value - o2.value;
        });
        var _len = _data.length - 1;
        return _data[_len]['value'];
    }

    function getAreaMin(data) {
        var _data = data.sort(function (o1, o2) {
            return o1.value - o2.value;
        });
        return _data[0]['value'];
    }

    function getRadiationData() {

        var url = config.urls.radiation;
        M.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            success: function (ret) {
                if (ret) {
                    return ret;
                }
            },
            error: function () {
                alert('出错啦，出错服务：' + url);
            }
        });
    }

    function getScatterData() {
        var url = config.urls.scatter;
        M.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            success: function (ret) {
                if (ret) {
                    return ret;
                }
            },
            error: function () {
                alert('出错啦，出错服务：' + url);
            }
        });
    }

    function getAreaData() {
        var url = config.urls.area;
        M.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            success: function (ret) {
                if (ret) {
                    return ret;
                }
            },
            error: function () {
                alert('出错啦，出错服务：' + url);
            }
        });
    }

    function radiationSetTimer() {//轮询飞线
        var timer = setInterval(function () {
            var data = getRadiationData();
            _paint.addRadiationItem(data);
        }, 5000);
    }

    function scatterSetTimer() {//轮询散点图
        var timer = setInterval(function () {
            var data = getScatterData();
            _paint.addScatterItem(data);
        }, 5000);
    }

    function areaSetTimer() {//轮询区域
        var timer = setInterval(function () {
            var data = getAreaData();
            _paint.addAreaItem(data);
        }, 5000);
    }

    function init() {

        var data = [
            {name: '北京', value: Math.round(Math.random() * 1000)},
            {name: '天津', value: Math.round(Math.random() * 1000)},
            {name: '上海', value: Math.round(Math.random() * 1000)},
            {name: '重庆', value: Math.round(Math.random() * 1000)},
            {name: '河北', value: Math.round(Math.random() * 1000)},
            {name: '河南', value: Math.round(Math.random() * 1000)},
            {name: '云南', value: Math.round(Math.random() * 1000)},
            {name: '辽宁', value: Math.round(Math.random() * 1000)},
            {name: '黑龙江', value: Math.round(Math.random() * 1000)},
            {name: '湖南', value: Math.round(Math.random() * 1000)},
            {name: '安徽', value: Math.round(Math.random() * 1000)},
            {name: '山东', value: Math.round(Math.random() * 1000)},
            {name: '新疆', value: Math.round(Math.random() * 1000)},
            {name: '江苏', value: Math.round(Math.random() * 1000)},
            {name: '浙江', value: Math.round(Math.random() * 1000)},
            {name: '江西', value: Math.round(Math.random() * 1000)},
            {name: '湖北', value: Math.round(Math.random() * 1000)},
            {name: '广西', value: Math.round(Math.random() * 1000)},
            {name: '甘肃', value: Math.round(Math.random() * 1000)},
            {name: '山西', value: Math.round(Math.random() * 1000)},
            {name: '内蒙古', value: Math.round(Math.random() * 1000)},
            {name: '陕西', value: Math.round(Math.random() * 1000)},
            {name: '吉林', value: Math.round(Math.random() * 1000)},
            {name: '福建', value: Math.round(Math.random() * 1000)},
            {name: '贵州', value: Math.round(Math.random() * 1000)},
            {name: '广东', value: Math.round(Math.random() * 1000)},
            {name: '青海', value: Math.round(Math.random() * 1000)},
            {name: '西藏', value: Math.round(Math.random() * 1000)},
            {name: '四川', value: Math.round(Math.random() * 1000)},
            {name: '宁夏', value: Math.round(Math.random() * 1000)},
            {name: '海南', value: Math.round(Math.random() * 1000)},
            {name: '台湾', value: Math.round(Math.random() * 1000)},
            {name: '香港', value: Math.round(Math.random() * 1000)},
            {name: '澳门', value: Math.round(Math.random() * 1000)}
        ];
        var scatter_data = [
            {
                "adcode": "360400",
                "value": 0.00462
            },
            {
                "adcode": "620100",
                "value": 0.5
            },
            {
                "adcode": "320100",
                "value": 0.00747
            },
            {
                "adcode": "320600",
                "value": 0.01085
            },
            {
                "adcode": "411300",
                "value": 0.01003
            }
        ];
        var radiation_data = [
            {
                "from": "114.298572,30.584355",
                "to": "120.355173,36.082982"
            },
            {
                "from": "114.085947,22.547",
                "to": "126.642464,45.756967"
            },
            {
                "from": "114.085947,22.547",
                "to": "126.642464,45.756967"
            },
            {
                "from": "114.085947,22.547",
                "to": "114.502461,38.045474"
            },
            {
                "from": "114.298572,30.584355",
                "to": "113.665412,34.757975"
            },
            {
                "from": "114.085947,22.547",
                "to": "112.434468,34.663041"
            },
            {
                "from": "114.085947,22.547",
                "to": "112.540918,32.999082"
            },
            {
                "from": "114.085947,22.547",
                "to": "113.665412,34.757975"
            },
            {
                "from": "114.298572,30.584355",
                "to": "113.295259,40.09031"
            },
            {
                "from": "114.085947,22.547",
                "to": "113.295259,40.09031"
            }
        ];

        var mapPaint = require('../lib/mapPaint');
        var _maxvalue = getAreaMax(data), _minvalue = getAreaMin(data);
        _paint = new mapPaint({
            boxId: "main",
            areaData: data,
            autoPlay: true,
            visualMapMax: _maxvalue,
            visualMapMin: _minvalue,
            scatterData: scatter_data,
            radiationData: radiation_data
        });
    }

    module.exports = {
        init: init
    };
})
