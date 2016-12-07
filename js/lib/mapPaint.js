/**
 * Created by m000801 on 2016/11/25.
 */
define(function (require, exports, module) {

    function mapPaint(option) {

        var config = {
            boxId: "main",
            fontColor: '#999',
            emphasisFotColor:'#fff',
            backgroundColor: '#000D1E',
            areaColor: ['#104F63', '#143B63', '#153463'],
            borderColor: '#111',
            emphasisAreaColor: '#999',
            emphasisColor: '#2a333d',
            isShowNormalText: true,
            visualMapMin: 0,//地图区域的最小值
            visualMapMax: 2500,//地图区域的最大值
            scatterColor: '#a6c84c',
            scatterImg: '',
            radiationColor: '',
            getScatterItem: null,
            getRadiationItem: null,
            getAreaItem: null,
            autoPlay: true,
            radiationImg: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
            areaData: [],
            scatterData: [],
            radiationData: []
        }

        var myChart = null;

        var city_json = require('../modules/g_city_json');

        function _bindEvent() {
            $(window).resize(function() {
                if(myChart){
                    myChart.resize();
                }
            });
        }

        function autoPlay() {
            stop();
            startArea();
            addScatterItem(config.scatterData);
            addRadiationItem(config.radiationData);
        }

        function _getStaticOpt() {
            var option = {
                backgroundColor: config.backgroundColor,
                tooltip: {
                    trigger: 'item'
                },
                roam: true,
                visualMap: {
                    min: config.visualMapMin,
                    max: config.visualMapMax,
                    left: 'right',
                    top: 'bottom',
                    text: ['高', '低'],
                    calculable: true,
                    inRange: {
                        color: config.areaColor,
                        symbolSize: [1, 30]
                    },
                    textStyle: {
                        color: '#fff'
                    }
                },
                geo: {
                    map: 'china',
                    left:'30%'
                },
                series: [
                    {
                        name: '放款',
                        type: 'map',
                        mapType: 'china',
                        roam: true,
                        left:'30%',
                        label: {
                            normal: {
                                show: config.isShowNormalText,
                                borderColor: config.borderColor,
                                textStyle: {
                                    color: config.fontColor
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    color: config.emphasisFotColor
                                }

                            }
                        },
                        itemStyle: {
                            emphasis: {
                                areaColor: config.emphasisColor
                            }
                        },
                        data: []
                    },
                    {
                        name: '七贷散点图',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: [],
                        // symbolSize: function (val) {
                        //     return val[2] * 200
                        // },
                        symbol: 'circle',
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        itemStyle: {
                            normal: {
                                color: '#fff',
                                shadowBlur: 10,
                                shadowColor: '#333'
                            }
                        },
                        zlevel: 1
                    },
                    {
                        name: '七贷借款',
                        type: 'lines',
                        zlevel: 1,
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0.7,
                            color: '#fff',
                            symbolSize: 2
                        },
                        lineStyle: {
                            normal: {
                                color: '#a6c84c',
                                width: 0,
                                curveness: 0.2
                            }
                        },
                        data: []
                    },
                    {
                        name: '七贷借款',
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0,
                            symbol: config.radiationImg,
                            symbolSize: 15
                        },
                        lineStyle: {
                            normal: {
                                color: '#a6c84c',
                                width: 1,
                                opacity: 0.4,
                                curveness: 0.2
                            }
                        },
                        data: []
                    },
                    {
                        name: '七贷借款',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        zlevel: 2,
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        symbolSize: 5,
                        itemStyle: {
                            normal: {
                                color: '#a6c84c'
                            }
                        },
                        data: []
                    }
                ]
            }
            return option;
        }

        function _log(msg) {
            if (console && typeof console.log == 'function') {
                console.log(msg);
            }
        }

        function stop() {

        }

        function startArea() {
            addAreaItem(config.areaData);
        }

        function addAreaItem(series_area) {
            if ($.isArray(series_area)) {
                var option = {
                    series: [
                        {
                            name: '放款',
                            data: series_area
                        }
                    ]
                };
                myChart.setOption(option);
            } else {
                _log("error: series_area is no Array!");
            }

        }

        function renderScatter(data) {
            var res = [], geoCoord = [], name = '--';
            var citys = city_json.citys || {};
            var rows = citys.rows || [];

            for (var i = 0; i < data.length; i++) {
                $(rows).each(function (index, item) {
                    if (item.adcode == data[i].adcode) {
                        geoCoord = [];
                        geoCoord.push(item.lng);//经度
                        geoCoord.push(item.lat);//纬度
                        name = item.name;
                    }
                })

                if (geoCoord && geoCoord.length) {
                    res.push({
                        name: name,
                        value: geoCoord.concat(data[i].value*10000)
                    });
                }
            }
            return res;
        };

        function addScatterItem(data) {
            if ($.isArray(data)) {
                var option = {
                    series: [
                        {
                            name: '七贷散点图',
                            data: renderScatter(data)
                        }
                    ]
                };
                myChart.setOption(option);
            } else {
                _log("error: data is no Array!");
            }
        }

        function renderRadiation(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = dataItem['from'].split(',');
                var toCoord = dataItem['to'].split(',');
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem['from_str'] || '--',
                        toName: dataItem['to_str'] || '--',
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            return res;

        }

        function addRadiationItem(data) {
            if ($.isArray(data)) {
                var option = {
                    series: [
                        {
                            name: '七贷借款',
                            type: 'lines',
                            zlevel: 1,
                            data: renderRadiation(data)
                        },
                        {
                            name: '七贷借款',
                            type: 'lines',
                            zlevel: 2,
                            data: renderRadiation(data)
                        },
                        {
                            name: '七贷借款',
                            type: 'effectScatter',
                            tooltip: {
                                show: false
                            },
                            data: data.map(function (dataItem) {
                                return {
                                    name: dataItem['to_str'],
                                    value: dataItem['to'].split(',')
                                };
                            })
                        }

                    ]
                };
                myChart.setOption(option);
            } else {
                _log("error: data is no Array!");
            }

        }

        function _init(opt) {
            var fn = arguments.callee;
            if (!fn.hasInit) {
                fn.hasInit = true;
                config = $.extend({}, config, opt);
                myChart = echarts.init(document.getElementById(config.boxId));
                myChart.setOption(_getStaticOpt());
                _bindEvent();

                if (config.autoPlay) {
                    autoPlay();
                }
            }
        };

        _init(option);

        return {
            startArea: startArea,
            stop: stop,
            addAreaItem: addAreaItem,
            addScatterItem: addScatterItem,
            addRadiationItem: addRadiationItem
        };
    }

    module.exports = mapPaint;
})
