var root_theme = "theme/swf/", root_plugin_theme = "theme/swf/", ua = navigator.userAgent, ie = function () {
    return /msie (\d+\.\d+)/i.test(ua) ? document.documentMode || +RegExp.$1 : 0
}(), opera = function () {
    return /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(ua) ? +(RegExp.$6 || RegExp.$2) : 0
}(), safari = function () {
    return /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? +(RegExp.$1 || RegExp.$2) : 0
}();
function event_coordinate(a) {
    var b;
    if (ie) {
        var c = document.documentElement.scrollLeft || document.body.scrollLeft, d = document.documentElement.scrollTop || document.body.scrollTop;
        b = [a.clientX + c, a.clientY + d]
    } else b = [a.pageX, a.pageY];
    return b
}
function dom_coordinate(a) {
    if (null === a.parentNode || "none" == a.style.display)return [0, 0, 0, 0];
    var b = null, c, d = 0, e = 0, f = a.offsetWidth, g = a.offsetHeight;
    if (a.getBoundingClientRect) {
        c = a.getBoundingClientRect();
        var h = Math.max(document.documentElement.scrollTop, document.body.scrollTop), i = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        d = c.left + i, e = c.top + h
    } else {
        if (document.getBoxObjectFor) {
            c = document.getBoxObjectFor(a);
            var j = a.style.borderLeftWidth ? parseInt(a.style.borderLeftWidth) : 0, k = a.style.borderTopWidth ? parseInt(a.style.borderTopWidth) : 0;
            d = c.x - j, e = c.y - k
        } else {
            if (d = a.offsetLeft, e = a.offsetTop, b = a.offsetParent, b != a)while (b)d += b.offsetLeft, e += b.offsetTop, b = b.offsetParent;
            (opera || safari && "absolute" == a.style.position) && (d -= document.body.offsetLeft, e -= document.body.offsetTop)
        }
        b = a.parentNode ? a.parentNode : null;
        while (b && "BODY" != b.tagName && "HTML" != b.tagName)d -= b.scrollLeft, e -= b.scrollTop, b = b.parentNode ? b.parentNode : null
    }
    return [d, e, f, g]
}
var flashDefaultParam1 = {
    movie: root_theme + "TPano.swf",
    altHtml: '<div style="position: relative;width: 300px;background-color:#FFEFB6;border: 1px solid #FFC337;margin: 65px auto;padding: 10px;"><p>\u4f7f\u7528\u817e\u8baf\u8857\u666f\uff0c\u9700\u8981\u5c06\u60a8\u7684Adobe Flash Player \u64ad\u653e\u5668\u5347\u7ea7\u523010\u6216\u66f4\u65b0\u7248\u672c</p><div><a href="http://get.adobe.com/cn/flashplayer/" target="_blank;">\u4e0b\u8f7d\u6700\u65b0\u7248\u672c</a></div></div>',
    minVer: "10.0.0",
    width: "100%",
    height: "100%",
    bgcolor: "#EEEEEE",
    wmode: "transparent",
    align: "middle",
    quality: "high",
    allowscriptaccess: "always",
    allowfullscreen: "true",
    menu: !1
}, metoV = 111319.49077777778, _lastId = 0;
window.checkJSReady = function () {
    return !0
};
function mix(a, b, c) {
    for (var d in b)b.hasOwnProperty(d) && (c || !a.hasOwnProperty(d)) && (a[d] = b[d]);
    return a
}
function TPanoFlash(a, b) {
    this._genId(), setValues(this, b), this.flashVars = {callback: this._getKey("swfCallbackId")}, this.status = 0, this.waitQuene = [], this.view = a, this._isFristLoadFlash = !0, this._isFirstChange = !0, this._labels = {}, this._labelsArr = new Array, this._plugins = {}, this._proxyUrl = b.proxyUrl || "{{URL}}&m=1", this._bindSwfCallback(), this.createPano(), this.view._render = this
}
var fp = TPanoFlash.prototype;
fp._setKey = function (a, b) {
    var c = this[a];
    c && c == b || (this[a] = b)
}, fp._getKey = function (a) {
    return this[a]
}, fp.createPano = function () {
    var a = this.flashVars;
    a.panoId = this._getKey("pano");
    var b = this._getKey("pov");
    b && (null !== b.heading && (a.heading = b.heading), null !== b.pitch && (a.pitch = b.pitch)), null !== this._getKey("zoom") && (a.zoom = parseInt(this._getKey("zoom"))), this._getKey("disableMove") && (a.disableMove = this._getKey("disableMove")), this._getKey("pf") && (a.pf = this._getKey("pf")), this._getKey("ch") && (a.ch = this._getKey("ch")), this._getKey("key") && (a.key = this._getKey("key")), a.keystatus = 1, a.proxyUrl = this._proxyUrl;
    var c = [];
    flashDefaultParam1.id = this._getKey("swfId"), flashDefaultParam1.flashvars = paramToString(a);
    var d = genHtml(flashDefaultParam1);
    c.push(d);
    var e = document.createElement("div");
    e.style.width = "100%", e.style.height = "100%", this._getKey("visible") === !1 && (e.style.visibility = "hidden"), e.innerHTML = c.join(""), this._setKey("panoContainer", e);
    var f = this._getKey("container"), g = "object" == typeof f ? f : document.getElementById(f);
    if (g.appendChild(e), this.status = 1, checkLocalPath()) {
        var h = this;
        setTimeout(function () {
            h.checkCommunication()
        }, 3e3)
    }
    this.focusSwf()
}, fp.focusSwf = function () {
    try {
        getSwf(this._getKey("swfId")).focus()
    } catch (a) {
    }
}, fp.louseFocusSwf = function () {
    try {
        getSwf(this._getKey("swfId")).blur()
    } catch (a) {
        console.log(a)
    }
}, fp.setKeyStatus = function (a) {
    this._sendToAs("setKeyStatus", a)
}, fp.removePano = function () {
    this.status = 0, this.waitQuene = [], this._isFristLoadFlash = !0;
    var a = getSwf(this._getKey("swfId"));
    if (a) {
        var b = isIE();
        if (a && b) {
            a.style.display = "none";
            for (var c in a)"function" == typeof a[c] && (a[c] = null);
            window.CollectGarbage && setTimeout(window.CollectGarbage, 0)
        }
        var d = document.createElement("div");
        d.appendChild(a), d.innerHTML = "";
        var e = this._getKey("container"), f = "object" == typeof e ? e : document.getElementById(e);
        f.removeChild(this._getKey("panoContainer"))
    }
}, fp.setVisible = function (a) {
    this._getKey("visible") != a && (this._setKey("visible", a), this._getKey("panoContainer").style.visibility = a ? "visible" : "hidden")
}, fp.setPano = function (a) {
    if (!a)return void this._setKey("pano", null);
    if (a && a !== this._getKey("pano")) {
        this._getKey("pano") || (this._setKey("pano", a), this.removePano(), this.createPano());
        var b = {svid: a};
        this._setKey("_setPanoValue", {svid: a}), this._sendToAs("setPanoOptions", b)
    }
}, fp.setThumb = function (a) {
    this._sendToAs("setThumb", a.globe)
}, fp.setPov = function (a) {
    var b = this._getKey("pov"), c = {}, d = !1;
    !a || !isNumber(a.heading) || b && b.heading === a.heading || (c.heading = Math.round(10 * a.heading) / 10, d = !0), !a || !isNumber(a.pitch) || b && b.pitch === a.pitch || (c.pitch = Math.round(10 * a.pitch) / 10, d = !0), d && (this._setKey("_setPovValue", c), this._sendToAs("setPanoOptions", c))
}, fp.setZoom = function (a) {
    var b = this._getKey("zoom");
    if (parseInt(a) != b) {
        var c = {zoom: parseInt(a)};
        this._setKey("_setZoomValue", parseInt(a)), this._sendToAs("setPanoOptions", c)
    }
}, fp.pano_changed = function (a) {
    var b = this._getKey("pano");
    (b && b != a || this._isFirstChange) && (this._setKey("pano", a), this._setKey("_setPanoValue", a), this.view.fireEvent("pano_changed", a, this.view))
}, fp.pov_changed = function (a) {
    var b = this._getKey("pov") || {};
    this._pov = a;
    var c = 0, d = {};
    b && (d.heading = b.heading, d.pitch = b.pitch), b && equals(a.heading, b.heading) || (d.heading = a.heading, c = 1), b && equals(a.pitch, b.pitch) || (d.pitch = a.pitch, c = 1), (c || this._isFirstChange) && (this._setKey("pov", d), this._setKey("_setPovValue", d), this.view.fireEvent("pov_changed", d, this.view))
}, fp.zoom_changed = function (a) {
    (a !== this._getKey("zoom") || this._isFirstChange) && (this._setKey("zoom", a), this._setKey("_setZoomValue", a), this.view.fireEvent("zoom_changed", a, this.view))
}, fp.addLabel = function (a) {
    this._labels[a.id] || (this._labelsArr.push(a), this._labels[a.id] = a, this._sendToAs("addLabel", {
        id: a.id,
        lat: latFrom4326ToProjection(a.position.lat),
        lng: lngFrom4326ToProjection(a.position.lng),
        height: a.altitude,
        content: a.content
    }))
}, fp.removeLabel = function (a) {
    this._sendToAs("removeLabel", {id: a}), this._labels[a] = void 0;
    for (var b = 0; b < this._labelsArr.length; b++) {
        var c = this._labelsArr[b];
        c.id == a && this._labelsArr.splice(b, 1)
    }
}, fp.addPlugin = function (a) {
    this._sendToAs("addPlugin", {
        name: a.id,
        options: {url: root_plugin_theme + a.name}
    }), this._plugins[a.id] || (this._plugins[a.id] = a)
}, fp.autoPlayStart = function (a) {
    this._sendToAs("autoPlayStart", a)
}, fp.autoPlayStop = function () {
    this._sendToAs("autoPlayStop")
}, fp._onInterfaceReady = function () {
    this.status = 2;
    while (this.waitQuene.length > 0) {
        var a = this.waitQuene.shift();
        this._sendToAs(a.eventName, a.data, a.tp)
    }
}, fp._addDefalutPlugin = function () {
    (!this._getKey("disableMove") || this._getKey("disableMove") !== !0 && 1 !== this._getKey("disableMove")) && this._sendToAs("addPlugin", {
        name: "PanoOverlay",
        options: {url: root_plugin_theme + "PanoOverlay.swf"}
    })
}, fp._addResetFlash = function () {
    var a = {};
    this._getKey("_setPovValue") && (a.heading = this._getKey("_setPovValue").heading, a.pitch = this._getKey("_setPovValue").pitch, this._sendToAs("setPanoOptions", a)), this._getKey("_setZoomValue") && this._sendToAs("setPanoOptions", {zoom: parseInt(this._getKey("_setZoomValue"))});
    for (var b = 0; b < this._labelsArr.length; b++) {
        var c = this._labelsArr[b];
        this._sendToAs("addLabel", {
            id: c.id,
            lat: latFrom4326ToProjection(c.position.lat),
            lng: lngFrom4326ToProjection(c.position.lng),
            height: c.altitude,
            content: c.content
        })
    }
}, fp._sendToAs = function (a, b, c) {
    if (this.status >= 2)try {
        getSwf(this._getKey("swfId"))[c ? "sendToPlugin" : "sendToAS"](a, b)
    } catch (d) {
    } else {
        var e = mix({}, b);
        this.waitQuene.push({eventName: a, data: e, tp: c})
    }
}, fp._sendToPlugin = function (a, b) {
    this._sendToAs(a, b, !0)
}, fp.checkCommunication = function () {
    var a = null;
    try {
        a = getSwf(this._getKey("swfId")).callBackToAS("checkCommunication")
    } catch (b) {
        var c = this._getKey("panoContainer"), d = 255, e = 45, f = document.createElement("div");
        f.innerHTML = "API\u7a0b\u5e8f\u65e0\u6cd5\u4e0eflash\u901a\u4fe1\uff0c\u5bfc\u81f4\u8857\u666f\u53ef\u80fd\u65e0\u6cd5\u6b63\u5e38\u4f7f\u7528\uff0c\u8fd9\u53ef\u80fd\u548cflash\u5b89\u5168\u7b56\u7565\u6709\u5173,\u8bf7\u53c2\u8003<a href='http://open.map.qq.com/javascript_v2/guide-pano.html#link-two' target='_blank' style='color:#7CCD7C;text-decoration:none '>\u89e3\u51b3\u6b65\u9aa4</a>\u3002", f.style.width = d + "px", f.style.height = e + "px", f.style.position = "absolute", f.style.backgroundColor = "black", f.style.color = "#FFFFFF", f.style.fontSize = "13px", f.style.padding = "5px", f.style.opacity = .5, f.style.filter = "alpha(opacity=50)", f.style.left = c.offsetWidth / 2 - d / 2 + "px", f.style.top = "10px", c.appendChild(f)
    }
}, fp._receiveFromSwf = function (a, b) {
    switch (a) {
        case"interface_ready":
            if (this._onInterfaceReady(), this._addResetFlash(), this._addDefalutPlugin(), this._getKey("_setPanoValue") && this._getKey("_setPanoValue").svid != b.svid) {
                var c = this._getKey("_setPanoValue").svid;
                this.setPano(c)
            }
            this._isFristLoadFlash && (this._isFristLoadFlash = !1, this.view.fireEvent("loaded", null, this.view));
            break;
        case"pano_model_error":
            this.view.fireEvent("error", null, this.view);
            break;
        case"pano_changed":
            var d = null;
            if (b.chartId) {
                b.building && b.building.floors && b.building.floors.floor || (b.building = {
                    floors: {
                        floor: [
                            {id: "1", name: "\u63a8\u8350\u666f\u70b9", svid: ""}
                        ]
                    }, info: {current_floor: "1", default_floor: "1", name: "\u697c\u5c42"}
                });
                var e = [lngFromProjectionTo4326(b.minx), latFromProjectionTo4326(b.miny), lngFromProjectionTo4326(b.maxx), latFromProjectionTo4326(b.maxy)], f = parseFloat(b.lat), g = parseFloat(b.lng), h = {};
                h.lat = latFromProjectionTo4326(f), h.lng = lngFromProjectionTo4326(g);
                var d = {
                    bounds: e,
                    minZoom: b.minZoom,
                    maxZoom: b.maxZoom,
                    zoomLevel: b.bestChartLevel,
                    regionId: b.chartId,
                    building: b.building,
                    forwardMatrix: b.forwardMatrix,
                    backwardMatrix: b.backwardMatrix,
                    center: h
                };
                this._setKey("planeInfo", d)
            } else this._setKey("planeInfo", null);
            var i = {};
            i.dir = b.dir || 0, i.x = b.lng || 0, i.y = b.lat || 0, i.svid = b.svid || "-1", i.mode = b.mode || "day", i.photoTime = b.photoTime || "0000.00", i.sno = b.sno || "-1", i.source = b.source || "qq", i.position = h, i.planeInfo = d, this.pano_changed(i);
            break;
        case"pov_changed":
            this.pov_changed(b);
            break;
        case"zoom_changed":
            this.zoom_changed(b.zoom);
            break;
        case"label_mouse_over":
            this._labels[b.id] && this.view.fireEvent("labelEvent", {
                id: b.id,
                type: "mouseover",
                viewBounds: b.bounds
            });
            break;
        case"label_mouse_out":
            this._labels[b.id] && this.view.fireEvent("labelEvent", {id: b.id, type: "mouseout", viewBounds: b.bounds});
            break;
        case"label_mouse_click":
            this._labels[b.id] && this.view.fireEvent("labelEvent", {id: b.id, type: "click", viewBounds: b.bounds});
            break;
        case"thumb_loaded":
            this._isFirstChange && (this._isFirstChange = !1), this.view.fireEvent("thumb_loaded", b, this.view);
            break;
        case"autoPlayStop":
            this.view.fireEvent("autoPlayStop", b, this.view);
            break;
        case"dragStart":
            this.view.fireEvent("dragstart", b, this.view);
            break;
        case"dragEnd":
            this.view.fireEvent("dragend", b, this.view);
            break;
        default:
            this.view.fireEvent(a, b, this.view)
    }
}, fp._genId = function () {
    var a = _lastId++, b = "_panoSwf_" + a, c = "_panoSwfCallback_" + a;
    this._setKey("swfId", b), this._setKey("swfCallbackId", c)
}, fp._bindSwfCallback = function () {
    var a = this._getKey("swfCallbackId"), b = this;
    window[a] = function (a, c) {
        return b._receiveFromSwf(a, c)
    }
}, fp._initEvents = function () {
    var a = this._getKey("panoContainer"), b = this;
    this._getKey("scrollwheel") && (this._wheelListener = event.addScrollEvent(a, gecko ? "DOMMouseScroll" : "mousewheel", function (c) {
        c = c || window.event;
        var d = event_coordinate(c), e = dom_coordinate(a);
        if (b.status >= 2) {
            var f = 0;
            c.wheelDelta ? f = c.wheelDelta / 120 : c.detail && (f = -c.detail / 3), b._sendToAs("mouseWheel", {
                delta: f,
                mouseX: d[0] - e[0],
                mouseY: d[1] - e[1]
            })
        }
        c.preventDefault ? c.preventDefault() : c.returnValue = !1
    }))
};
function checkLocalPath() {
    var a = window.location.href;
    return -1 != a.indexOf("http://") ? !1 : !0
}
function getSwf(a) {
    return document.getElementById(a)
}
function isNumber(a) {
    return "[object Number]" == Object.prototype.toString.call(a) && isFinite(a)
}
function equals(a, b) {
    return a = Math.round(10 * a) / 10, b = Math.round(10 * b) / 10, a == b
}
function latFrom4326ToProjection(a) {
    var b = Math.log(Math.tan(.008726646259971648 * (90 + a))) / .017453292519943295;
    return b *= metoV
}
function latFromProjectionTo4326(a) {
    var b = a / metoV;
    return b = 114.59155902616465 * Math.atan(Math.exp(.017453292519943295 * b)) - 90
}
function lngFrom4326ToProjection(a) {
    return a * metoV
}
function lngFromProjectionTo4326(a) {
    return a / metoV
}
function paramToString(a) {
    var b = [];
    for (var c in a)if (a.hasOwnProperty(c)) {
        var d = a[c];
        b.push(c + "=" + encodeURIComponent(d))
    }
    return b.join("&")
}
function setValues(a, b) {
    for (var c in b)b.hasOwnProperty(c) && (a[c] = b[c])
}
function gecko() {
    var a = navigator.userAgent;
    return /gecko/i.test(a) && !/like gecko/i.test(a)
}
function isIE() {
    var a = navigator.userAgent;
    return /msie (\d+\.\d+)/i.test(a) ? document.documentMode || +RegExp.$1 : 0
}
function comparaVersion(a, b) {
    a = a.split("."), b = b.split(".");
    for (var c = Math.max(a.length, b.length), d = 0; c > d; d++) {
        var e = a[d], f = b[d];
        if (!e || !f)return e || f ? e ? 1 : -1 : 0;
        if (e = Number(e), f = Number(f), f > e)return -1;
        if (e > f)return 1
    }
    return 0
}
function getFlashPlayerVersion() {
    var a = isIE(), b;
    if (null == b) {
        var c = navigator;
        if (c.plugins && c.mimeTypes.length) {
            var d = c.plugins["Shockwave Flash"];
            d && d.description && (b = d.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + ".0")
        } else if (a)try {
            var e = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            if (e) {
                var f = e.GetVariable("$version");
                b = f.replace(/WIN/g, "").replace(/,/g, ".")
            }
        } catch (g) {
        }
    }
    return b
}
function genHtml(a) {
    var b = isIE(), c = b ? ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"' : ' type="application/x-shockwave-flash"', d = ["id", "width", "height", "align", "data"], e = ["wmode", "movie", "flashvars", "scale", "quality", "play", "loop", "menu", "salign", "bgcolor", "base", "allowscriptaccess", "allownetworking", "allowfullscreen", "seamlesstabbing", "devicefont", "swliveconnect"];
    a = a || {};
    function f() {
        var b, f, g = a.minVer, h = a.maxVer;
        if (g || h) {
            var i = getFlashPlayerVersion();
            if (!i || g && comparaVersion(i, g) < 0 || h && comparaVersion(i, h) > 0)return a.altHtml || ""
        }
        var j = ["<object", c];
        for (a.data = a.movie, b = 0; b < d.length; b++)f = d[b], a.hasOwnProperty(f) && j.push(" ", f, '="', a[f], '"');
        for (j.push(">"), b = 0; b < e.length; b++)f = e[b], a.hasOwnProperty(f) && j.push('<param name="', f, '" value="', a[f], '"/>');
        return j.push("</object>"), j.join("")
    }

    var g = f();
    return g
}
!function () {
    function a(a, b, c) {
        this.panoObj = new TPanoFlash(this, {
            scrollwheel: !0,
            container: a,
            proxyUrl: c.proxyUrl || "{{URL}}&m=1",
            pano: b
        }), c = c || {}, this.changeKeyCode = c.changeKeyCode || 51, this.proxyUrl = c.proxyUrl || "{{URL}}&m=1", this.onPanoChange = c.onPanoChange, this.onPlaneInfoChange = c.onPlaneInfoChange, this._initListener(), this.area = 1, this.preArea = 1;
    }

    var b = a.prototype;
    b.setPano = function (a) {
        this.pano = a, this.get("pano") != this.panoObj.pano.svid && this.panoObj.setPano(this.get("pano"))
    }, b.changeArea = function (a) {
        1 == a ? this.panoObj.focusSwf() : this.panoObj.louseFocusSwf(), this.area = a
    }, b.nextArea = function () {
        this.area += 1, this.area %= 3, this.changeArea(this.area)
    }, b.setZoom = function (a) {
        this.panoObj.setZoom(a)
    }, b.changeFloor = function (a) {
        var b = this.planeInfo;
        b && (a ? this.regeionList.nextFloor() : this.regeionList.preFloor());
        $(this.regeionList.select[0]).attr('tabindex', -1).focus();
    }, b.getProxyUrl = function (a) {
        return this.proxyUrl.replace("{{URL}}", a)
    }, b.changeScene = function (a) {
        var b = this.planeInfo;
        b && (a ? this.photo.nextScene() : this.photo.preScene())
    }, b.setPov = function (a, b) {
        this.panoObj.setPov({heading: a, pitch: b})
    }, b._onPanoChange = function () {

    }, b._initListener = function(){

    }, b.autoPlayStart = function (a) {
        this.panoObj.autoPlayStart(a)
    }, b.autoPlayStop = function () {
        this.panoObj.autoPlayStop()
    };
    var c = {
        "10013511120816190222390": {
            367: {
                id: 367,
                content: "QQ\u9f99\u5e74\u516c\u4ed4",
                altitude: 1,
                position: {lat: 39.98214399650536, lng: 116.30648278813172}
            }
        }
    };
    b.set = function (a, b) {
        this[a] = b
    }, b.get = function (a) {
        return this[a]
    }, b.fireEvent = function (a, b, d) {
        var e = this;
        switch (a) {
            case"pano_changed":
                this.set("pano", b.svid), this.set("planeInfo", this.panoObj.planeInfo), c[b.svid] ? this.panoObj.addLabel(c[b.svid][367]) : this.panoObj.removeLabel("367"), /*this._onPanoChange(),*/ this.onPanoChange && this.onPanoChange();
                break;
            case"labelEvent":
                "click" == b.type;
            case"zoom_changed":
                4 == b ? $("#zoomIn").addClass("zoomInDis") : $("#zoomIn").removeClass("zoomInDis"), 1 == b ? $("#zoomOut").addClass("zoomOutDis") : $("#zoomOut").removeClass("zoomOutDis"), this.set("zoom", b);
                break;
            case"pov_changed":
                this.set("pov", b);
                break;
            case"autoPlayStop":
                e.onAutoPlayStop && e.onAutoPlayStop()
        }
    }, window.Panorama = a
}();
