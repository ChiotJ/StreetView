/**
 * Created by jian_ on 2015/11/2.
 */
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
        apiLoad([["2.3.10", "4F5BZ-ZQSCP-FM6DI-VT2TU-HDRU7-OWBBU", 0], [TXConneturl + "http://open.map.qq.com/", "apifiles/2/3/10/mods/", TXConneturl + "http://open.map.qq.com/apifiles/2/3/10/theme/", true], [1, 18, 34.519469, 104.461761, 4], [1446446140665, TXConneturl + "http://pr.map.qq.com/pingd", TXConneturl + "http://pr.map.qq.com/pingd"], [TXConneturl + "http://apic.map.qq.com/", TXConneturl + "http://apikey.map.qq.com/mkey/index.php/mkey/check", TXConneturl + "http://sv.map.qq.com/xf", TXConneturl + "http://sv.map.qq.com/boundinfo", TXConneturl + "http://sv.map.qq.com/rarp", "http://search.map.qq.com/"], [[null, [TXConneturl + "http://p0.map.gtimg.com/maptilesv3", TXConneturl + "http://p1.map.gtimg.com/maptilesv3", TXConneturl + "http://p2.map.gtimg.com/maptilesv3", TXConneturl + "http://p3.map.gtimg.com/maptilesv3"], "png", [256, 256], 1, 19, "", true, false], [null, [TXConneturl + "http://p0.map.gtimg.com/hwaptiles", TXConneturl + "http://p1.map.gtimg.com/hwaptiles", TXConneturl + "http://p2.map.gtimg.com/hwaptiles", TXConneturl + "http://p3.map.gtimg.com/hwaptiles"], "png", [128, 128], 1, 19, "", false, false], [null, [TXConneturl + "http://p0.map.gtimg.com/sateTiles", TXConneturl + "http://p1.map.gtimg.com/sateTiles", TXConneturl + "http://p2.map.gtimg.com/sateTiles", TXConneturl + "http://p3.map.gtimg.com/sateTiles"], "jpg", [256, 256], 1, 19, "", false, false], [null, [TXConneturl + "http://p0.map.gtimg.com/sateTranTilesv3", TXConneturl + "http://p1.map.gtimg.com/sateTranTilesv3", TXConneturl + "http://p2.map.gtimg.com/sateTranTilesv3", TXConneturl + "http://p3.map.gtimg.com/sateTranTilesv3"], "png", [256, 256], 1, 19, "", false, false], [null, [TXConneturl + "http://sv0.map.qq.com/road/", TXConneturl + "http://sv1.map.qq.com/road/", TXConneturl + "http://sv2.map.qq.com/road/", TXConneturl + "http://sv3.map.qq.com/road/"], "png", [256, 256], 1, 19, "", false, false], [null, [TXConneturl + "http://rtt2.map.qq.com/live/"], "png", [256, 256], 1, 19, "", false, false], null, null, null], [TXConneturl + "http://s.map.qq.com/TPano/v1.1/TPano.js", TXConneturl + "http://map.qq.com/", ""]], loadScriptTime);
    };
    var loadScriptTime = (new Date).getTime();
    getScript("../../lib/mapMain_2.3.10.js");
})();