/**
 * Created by shanshanye on 2016/9/22.
 */
define(function (require, exports, module) {


    function init() {


        require.async('./g_mapPaint', function (module) {
            module.init();
            var time = setTimeout(function(){

                require.async('./g_countUp', function (module) {

                    module.init();

                });

                require.async('./g_scrollList', function (module) {

                    module.init();

                });
            },50);

        });



    };

    module.exports = {
        init: init
    };
})
