/**
 * Created by 英硕 on 2015/9/23.
 */
var webSocket = function () {
    this.url = "ws://172.16.200.18:82/gh-life/websocket";
    this.ws = null;
};

webSocket.prototype = {
    connect: function () {
        var ws = new WebSocket(this.url), that = this;
        ws.onopen = function () {
            ws.send('{"requestType":"join","deviceNo":"1"}');
        };
        ws.onmessage = function (event) {
            var json = eval("(" + event.data + ")");
            that.analysisJson(json);
        };
        ws.onclose = function (event) {
        };
        this.ws = ws;
    },
    disconnect: function () {
        if (this.ws != null) {
            this.ws.close();
            this.ws = null;
        }
    },
    analysisJson: function (json) {
        console.log(json);
        switch (json.messageType) {
            case "join":
                break;
            case "userInfo":
                break;
            case "latlng":
                Lib.MAP.panTo(new qq.maps.LatLng(json.messageInfo.lat, json.messageInfo.lng));
                break;
            case "address":
                var a = json.messageInfo;
                changeAdress({address: a.address, name: a.name, tel: a.phone});
                break;
            case "error":
                break;
            default:
                break;
        }
    }

};