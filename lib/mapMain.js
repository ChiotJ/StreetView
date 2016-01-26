window.qq = window.qq || {};
qq.maps = qq.maps || {};
window.soso || (window.soso = qq);
soso.maps || (soso.maps = qq.maps);
(function () {
    function getScript(src) {
        document.write('<' + 'script src="' + src + '"' + ' type="text/javascript"><' + '/script>');
    }

    qq.maps.__load = function (apiLoad) {
        delete qq.maps.__load;
        apiLoad([["2.3.14", "4F5BZ-ZQSCP-FM6DI-VT2TU-HDRU7-OWBBU", 0], [TXConneturl + "http://open.map.qq.com/", "apifiles/2/3/14/mods/", TXConneturl + "http://open.map.qq.com/apifiles/2/3/14/theme/", true], [1, 18, 34.519469, 104.461761, 4], [1453803904792, TXConneturl + "http://pr.map.qq.com/pingd", TXConneturl + "http://pr.map.qq.com/pingd"], [TXConneturl + "http://apis.map.qq.com/jsapi", TXConneturl + "http://apikey.map.qq.com/mkey/index.php/mkey/check", TXConneturl + "http://sv.map.qq.com/xf", TXConneturl + "http://sv.map.qq.com/boundinfo", TXConneturl + "http://sv.map.qq.com/rarp", TXConneturl + "http://search.map.qq.com/", TXConneturl + "http://routes.map.qq.com/"], [[null, [TXConneturl + "http://p0.map.gtimg.com/maptilesv3", TXConneturl + "http://p1.map.gtimg.com/maptilesv3", TXConneturl + "http://p2.map.gtimg.com/maptilesv3", TXConneturl + "http://p3.map.gtimg.com/maptilesv3"], "png", [256, 256], 1, 19, "", true, false], [null, [TXConneturl + "http://m0.map.gtimg.com/hwap", TXConneturl + "http://m1.map.gtimg.com/hwap", TXConneturl + "http://m2.map.gtimg.com/hwap", TXConneturl + "http://m3.map.gtimg.com/hwap"], "png", [256, 256], 4, 18, "104", false, false], [null, [TXConneturl + "http://p0.map.gtimg.com/sateTiles", TXConneturl + "http://p1.map.gtimg.com/sateTiles", TXConneturl + "http://p2.map.gtimg.com/sateTiles", TXConneturl + "http://p3.map.gtimg.com/sateTiles"], "jpg", [256, 256], 1, 19, "", false, false], [null, [TXConneturl + "http://p0.map.gtimg.com/sateTranTilesv3", TXConneturl + "http://p1.map.gtimg.com/sateTranTilesv3", TXConneturl + "http://p2.map.gtimg.com/sateTranTilesv3", TXConneturl + "http://p3.map.gtimg.com/sateTranTilesv3"], "png", [256, 256], 1, 19, "", false, false], [null, [TXConneturl + "http://sv0.map.qq.com/road/", TXConneturl + "http://sv1.map.qq.com/road/", TXConneturl + "http://sv2.map.qq.com/road/", TXConneturl + "http://sv3.map.qq.com/road/"], "png", [256, 256], 1, 19, "", false, false], [null, [TXConneturl + "http://rtt2a.map.qq.com/live/", TXConneturl + "http://rtt2b.map.qq.com/live/", TXConneturl + "http://rtt2c.map.qq.com/live/"], "png", [256, 256], 1, 19, "", false, false], null, null, null], [TXConneturl + "http://s.map.qq.com/TPano/v1.1.1/TPano.js", TXConneturl + "http://map.qq.com/", ""]], loadScriptTime);
    };
    var loadScriptTime = (new Date).getTime();
    getScript("../../lib/mapMain_2.3.14.js");
})();