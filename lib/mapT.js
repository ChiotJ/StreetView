var mapT = function () {
    this.TXConneturl = TXConneturl;
    //当前焦点区域,0为街景，1为楼层选择框，2为具体相册
    this.area = 2;
    this.zoom = 1;
    this.first = true;
};
mapT.prototype = {
    init: function () {
        //�־���ʼ��
        this.panoInit();
        //����key
        this.keyListener();
    },
    reInit: function () {
        this.first = true;
        /*if (this.photo) {
         console.log(this.photo.select);
         this.photo.select = null;
         }*/
    },
    /*�־���ʼ��*/
    panoInit: function () {
        var allParam = this.getURLParam(),
            oldParam = null;

        var t = this;
        var svid = "";
        allParam.pano ? svid = allParam.pano : svid = "10013500120411142952600";

        this.PANO = new Panorama('panoCon', svid, {
            proxyUrl: this.TXConneturl + '{{URL}}&m=2',
            onPanoChange: function () {
                if (t.PANO.planeInfo) {
                    var lookedScene = parseInt(window.sessionStorage.getItem("lookedScene"));
                    if (lookedScene) {
                        window.sessionStorage.setItem("lookedScene", lookedScene + 1);
                    } else {
                        window.sessionStorage.setItem("lookedScene", 1);
                    }
                    
                    //$("#albumNotice").html('\u6309\u786e\u5b9a\u5f39\u51fa\u76f8\u518c');
                    var src = $("#albumNotice img").attr("src");
                    $("#albumNotice img").attr("src", src.replace("no","has"));
                    var a = t.PANO.planeInfo;
                    if (allParam.pano == "100434K1140710161249090") {
                        var video = new Object();
                        video.id = "0", video.index = -1, video.name = "宣传视频", video.short_name = "视频", video.svid = "video";
                        a.building.floors.floor.splice(0, 0, video);
                        a.building.info.current_floor ? a.building.info.current_floor = (parseInt(a.building.info.current_floor) + 1) : a.building.info.current_floor = 2;
                    }

                    $('#album').css("left", "0");
                    t.photo ?
                        t.photo.changeRegion(a.regionId, t.PANO.pano) :
                        t.photo = new Photo(t, {
                            regionId: a.regionId,
                            cellWidth: 186,
                            cellHeight: 115
                        });
                    t.regeionList ?
                        t.regeionList.setFloorData(a.building.floors.floor) :
                        t.regeionList = new RegionList(t.photo, a.building.floors.floor);
                    t.regeionList.selectFloor(a.building.info.current_floor ? (a.building.info.current_floor > 0 ? (parseInt(a.building.info.current_floor) - 1) : 0) : 0);
                    if (t.first) {
                        t.changeArea(2);
                        t.PANO.autoPlayStart();
                    } else {
                        t.changeArea(t.area);
                    }

                    $(".viewDetailIcon").css("background-color", "rgba(0, 0, 0, 0)");

                } else {
                    t.changeArea(0);
                    $('#album').css("left", "-1280px");
                    var src = $("#albumNotice img").attr("src");
                    $("#albumNotice img").attr("src", src.replace("has","no"));
                    //$("#albumNotice").html("\u6682\u65f6\u6ca1\u6709\u76f8\u518c");


                    $(".viewDetailIcon").css("background-color", "rgba(0, 0, 0, 0.8)");
                }

                $(".viewDetailIcon").css("left", "0");
                t.first = false;
            },
            changeKeyCode: 51
        });
        if (allParam.heading && allParam.pitch) {
            this.PANO.setPov(parseInt(allParam.heading), parseInt(allParam.pitch));
        }
        if (allParam.zoom) {
            this.PANO.setZoom(parseInt(allParam.zoom));
        }

        window.onhashchange = function () {
            oldParam = allParam;
            allParam = t.getURLParam();
            if (allParam.pano != oldParam.pano) {
                t.PANO.setPano(allParam.pano);
            }
            if (allParam.heading && allParam.pitch) {
                t.PANO.setPov(parseInt(allParam.heading), parseInt(allParam.pitch));
            }
            if (allParam.zoom) {
                t.PANO.setZoom(parseInt(allParam.zoom));
            }
        };
    },
    /*��ȡ��ǰURL������*/
    getURLParam: function () {
        var url = window.location.href.replace(/&amp;/g, "&");
        var startIndex = url.indexOf('#');
        var returnObject = {};
        if (url.indexOf('?') > -1 && startIndex > -1) {
            startIndex = Math.min(url.indexOf('?'), url.indexOf('#'));
        } else if (url.indexOf('?') > -1) {
            startIndex = url.indexOf('?');
        }

        if (startIndex > -1) {
            url = url.substring(startIndex + 1);
            url = url.replace(/#/g, '&');
            var params = url.split('&');
            for (var i = 0,
                     len = params.length,
                     pname = null,
                     pvalue = null
                ; i < len; i++) {
                pname = params[i].split('=')[0].toLowerCase();
                pvalue = params[i].substring(params[i].indexOf('=') + 1);
                pname = pname.indexOf('%u') > -1 ? unescape(pname) : pname;
                pvalue = pvalue.indexOf('%u') > -1 ? unescape(pvalue) : pvalue;
                returnObject[pname] = pvalue;
            }
            returnObject.hasUrlParams = '1';
        }
        return returnObject;
    },
    /*�����¼�����*/
    keyListener: function () {
        /*
         * 37-���ͷ
         * 38-�ϼ�ͷ
         * 39-�Ҽ�ͷ
         * 40-�¼�ͷ
         * 13-�س�
         * 27-����esc
         * */
        var t = this;
        $(document).bind("keydown", function (b) {
            //console.log(t.area + ":" + b.keyCode);
            switch (t.area) {
                case 0:
                    switch (b.keyCode) {
                        case 13:
                            if (t.PANO.planeInfo) {
                                t.changeArea(2);
                            }
                            break;
                        case 37:
                            t.PANO.setPov(parseInt(t.PANO.pov.heading - 30 * (1.0 / (t.PANO.zoom * t.PANO.zoom * 1.0))), parseInt(t.PANO.pov.pitch));
                            return false;
                            break;
                        case 39:
                            t.PANO.setPov(parseInt(t.PANO.pov.heading + 30 * (1.0 / (t.PANO.zoom * t.PANO.zoom * 1.0))), parseInt(t.PANO.pov.pitch));
                            return false;
                            break;
                        case 33:
                            t.PANO.setZoom(t.PANO.zoom + 1);
                            break;
                        case 34:
                            t.PANO.setZoom(t.PANO.zoom - 1);
                            break;
                        case 49:
                            t.PANO.setPov(parseInt(t.PANO.pov.heading), parseInt(t.PANO.pov.pitch - 20 * (1.0 / (t.PANO.zoom * t.PANO.zoom * 1.0))));
                            break;
                        case 50:
                            t.PANO.setPov(parseInt(t.PANO.pov.heading), parseInt(t.PANO.pov.pitch + 20 * (1.0 / (t.PANO.zoom * t.PANO.zoom * 1.0))));
                            break;
                    }
                    break;
                case 1:
                    switch (b.keyCode) {
                        case 13:
                            t.PANO.autoPlayStop();
                            t.changeArea(0);
                            break;
                        case 40:
                            t.changeArea(2);
                            break;
                        case 37:
                            t.PANO.autoPlayStop();
                            t.changeFloor(0);
                            break;
                        case 39:
                            t.PANO.autoPlayStop();
                            t.changeFloor(1);
                            break;
                        case 8:
                            t.PANO.autoPlayStop();
                            t.changeArea(0);
                            return false;
                            break;
                    }
                    break;
                case 2:
                    switch (b.keyCode) {
                        case 38:
                            t.changeArea(1);
                            break;
                        case 13:
                            t.PANO.autoPlayStop();
                            t.enterPhoto();
                            break;
                        case 37:
                            t.changePhoto(0);
                            break;
                        case 39:
                            t.changePhoto(1);
                            break;
                        case 8:
                            t.PANO.autoPlayStop();
                            t.changeArea(0);
                            return false;
                            break;
                    }
                    break;
            }
        });
    },
    changeArea: function (area) {
        this.area = area;
        if (area === 0) {
            this.PANO.panoObj.focusSwf();
            $('#album').css("left", "-1280px");
        } else if (area === 1) {
            $('#album').css("left", "0");
            $($('#albumTitleBody li')[this.regeionList.select[0].index]).attr('tabindex', -1).focus();
        } else if (area === 2) {
            $('#album').css("left", "0");
            var margin = parseInt(this.photo.select[0].idx / 5) * 1040;
            //$(this.photo.container).css({marginLeft: -margin + "px"});
            this.photo.scrollTo(margin);
            $($('#albumViewBody .PanoPhotoCell')[this.photo.select[0].idx]).attr('tabindex', -1).focus();
            $(".viewDetailIcon").css("left", "0");
        }
    },
    changePhoto: function (a) {
        var b = this.PANO.planeInfo;
        b && (a ? this.photo.nextScene() : this.photo.preScene())
    },
    enterPhoto: function (a) {
        var p = $(this.photo.select);
        if (this.PANO.pano != p.attr("id")) {
            this.PANO.setPano(p.attr("id"));
            this.PANO.setPov(parseInt(p.attr("heading")), parseInt(p.attr("pitch")));
            this.PANO.setZoom(1);
            $(".cur").removeClass("cur");
            p.addClass('cur');
        }
        if (!a)
            this.changeArea(0);

        $(".viewDetailIcon").css("left", "-1280px");
    },
    changeFloor: function (a) {
        var b = this.PANO.planeInfo;
        b && (a ? this.regeionList.nextFloor() : this.regeionList.preFloor());
        $(this.regeionList.select[0]).attr('tabindex', -1).focus();
    },
    /*搜索后根据经纬度切换地点*/
    toPano: function (lat, lng) {
        var that = this;
        var result = that.getLocationToPano(lat, lng);
        if (result.status == undefined || (result.status != 0 && result.status != 346)) {
            //请求失败
            that.gatewayError();
            return false;
        } else if (result.status == 346) {
            //无街景信息
            that.noPano();
            return false;
        } else {
            if (result && result.id) {
                that.PANO.setPano(result.id);
                that.PANO.setPov(parseInt(result.heading), parseInt(result.pitch));
                $('#_panoSwf_0').focus();
//                that.clearSearch();
                return true;
            } else {
                that.gatewayError();
                return false;
            }
        }
    },
    /*经纬度转换为街景pano值，获取多次直到超过20次或获取到结果*/
    getLocationToPano: function (lat, lng) {
        var that = this;
        var times = 0, r2 = that.getLocationToPanoTry(lat, lng);
        while ((r2.status == undefined || (r2.status != 0 && r2.status != 346)) && times <= 20) {
            r2 = that.getLocationToPanoTry(lat, lng);
            times++;
        }
        return r2;
    },
    getLocationToPanoTry: function (lat, lng) {
        var r = new Object();
        $.ajax({
            url: TXConneturl + "http://apis.map.qq.com/ws/streetview/v1/getpano?",
            type: "GET",
            async: false,
            data: ({
                location: lat + "," + lng,
                key: "4F5BZ-ZQSCP-FM6DI-VT2TU-HDRU7-OWBBU"
            }),
            success: function (data) {
                //            var json = eval("[" + data + "]")[0];
                var json = data;
                if (json.status == 0) {
                    r.id = json.detail.id;
                    var x1 = json.detail.location.lng;
                    var y1 = json.detail.location.lat;
                    var x2 = lng;
                    var y2 = lat;
                    var alpha = Math.acos((y2 - y1) / Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
                    if (x2 - x1 < 0) {
                        alpha = Math.PI * 2 - alpha;
                    }
                    r.heading = alpha / Math.PI * 180;
                    r.pitch = 0;
                }
                r.status = json.status;
                r.message = json.message;
            }
        });
        return r;
    },
    /*网络异常*/
    gatewayError: function () {
        $('#dialog').html('网络异常，请退出重试').fadeIn();
    },
    /*无街景信息*/
    noPano: function () {
        $('#dialog').html('当前位置暂无街景').fadeIn();
        setTimeout(function () {
            $('#dialog').fadeOut();
        }, 2000);
    }
};

//var mt = new mapT();
//mt.init();

//�־����
function Photo(a, b) {
    this.regionId = null, this.container = document.getElementById("albumViewBody"), this.mapT = a, this.pano = a.PANO, this.swipe_photo = null, this.select = null, this.dataLoader = null, this.photoScroll = null, this.cellWidth = b.cellWidth || 59, this.cellPadding = b.cellPadding || 20, this.cellHeight = b.cellHeight || 59, this.photoData = null, this.scrollLeft = 0, this.left = 0;
    this.changeRegion(b.regionId, this.pano.pano)
}
var photoP = Photo.prototype;
photoP.changeRegion = function (a, b) {
    if (this.regionId != a) {
        this.regionId = a;
        this.curSvid = b;
        this.scrollTo(0);
        this._draw(function () {
        });
    }
};
photoP._draw = function (a) {
    var b = "http://sv.map.qq.com/photos?id=" + this.regionId + "&output=jsonp&cb=?", c = this;
    c.dataLoader && c.dataLoader.abort(), c.dataLoader = $.ajax({
        type: "get",
        async: false,
        url: c.pano.getProxyUrl(b),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        cache: false,
        success: function (data) {
            c.dataLoader = null;
            $("#albumViewBody").html("");
            var isScroll = null;
            if (data.detail.scenes && data.detail.scenes.length > 0) {
                var photoLength = data.detail.scenes.length;
                c.photoData = data.detail.scenes;
                c.container.style.width = (c.cellWidth + 2 + c.cellPadding) * photoLength + 4 + "px";
                for (var e = 0; photoLength > e; e++) {
                    e == data.detail.scenes.length - 1 && (c.islast = !0);
                    var f = data.detail.scenes[e];
                    if (f.index = e, c._createCell(f), c.curSvid == f.svid) {
                        var g = f.svid;
                        c.select = $("#" + g);
                        c.select.addClass('cur');
                        c.pano.setPov({
                            heading: parseInt(f.heading),
                            pitch: parseInt(f.pitch)
                        });
                        /* var h = c.container.parentNode.offsetWidth, i = c.container.offsetWidth, j = (e + 1) * (c.cellWidth + c.cellPadding);
                         j - c.left > h && c.scrollTo(j - h)*/
                    }
                }
                if (!c.select) {
                    c.select = $("#" + data.detail.scenes[0].svid);
                }
                a && a()
            }
            new IScroll('#viewBody_wrapper', {
                mouseWheel: true,
                click: true,
                scrollX: true,
                scrollY: false
            });
        },
        error: function (error) {
            alert(error);
        }
    })
};
photoP._createCell = function (a) {
    var b = document.createElement("div");
    b.className = "PanoPhotoCell";
    b.id = a.svid;
    $(b).attr("pitch", a.pitch);
    $(b).attr("heading", a.dir);
    var c = this, d = "http://capture.map.qq.com/screenshot?model=web&from=qqmap&zoom=0&fov=60&width=" + c.cellWidth + "&height=" + c.cellHeight + "&pano=" + a.svid + "&pitch=" + a.pitch + "&heading=" + a.dir;
    b.innerHTML = '<img src="' + c.pano.getProxyUrl(d) + '"><div class="PanoPhotoTitle">' + a.name + "</div>", b.idx = a.index;
    function e(b) {
        b.preventDefault(), c.selectElement(a.index);
        c.mapT.enterPhoto(true);
    }

    return window.isMobile ? $(b).tap(e) : $(b).click(e), c.container.appendChild(b), b
};
photoP.scrollTo = function (a) {
    var b = this.container.parentNode.offsetWidth, c = this.container.offsetWidth;
    this.left = a;
    $(this.container).css({'transform': 'translate( -' + a + 'px, 0px) translateZ(0px)'});

};
photoP.scrollToIndex = function (a) {
    var b = a * (this.cellWidth + this.cellPadding);
    this.scrollTo(b)
};
photoP.selectElement = function (a) {
    var b = this, c = b.photoData[a], d = this.container.parentNode.offsetWidth, e = this.container.offsetWidth, f = (a + 1) * (this.cellWidth + this.cellPadding);
    //b.pano.setPano(c.svid), b.pano.setPov({heading: parseInt(c.heading), pitch: parseInt(c.pitch)}),
    b.select = $("#" + c.svid), b.select.attr('tabindex', -1).focus();
};
photoP.nextScene = function () {
    var a = this.select[0].idx, b = this.photoData.length;
    a++, (b - 1) > a && this.selectElement(a), this.scrollNext();
};
photoP.preScene = function () {
    var a = this.select[0].idx;
    a--, a >= 0 && this.selectElement(a), this.scrollPre();
};
photoP.scrollNext = function () {
    var a = this.select[0].idx, b = this.photoData.length;
    if (a < b - 1) {
        if (a % 5 == 0) {
            var margin = parseInt(a / 5) * 1040;
            //$(this.container).css({marginLeft: -margin + "px"});
            this.scrollTo(margin);
        }
    }
};
photoP.scrollPre = function () {
    var a = this.select[0].idx, b = this.photoData.length;
    if (a > 0) {
        if (a % 5 == 4) {
            var margin = parseInt(a / 5) * 1040;
            //$(this.container).css({marginLeft: -margin + "px"});
            this.scrollTo(margin);
        }
    }
};


//�־�¥��
function RegionList(a, b) {
    this.container = null, this.photo = a, this.data = b, this.select = null, this.swipe_Title = null, this.regionScroll = null;
    var c = this;
    this.init(function () {
    });
    this.setFloorData(b);
}
var RP = RegionList.prototype;
RP.init = function (a) {
    var b = this, c = document.createElement("ul");
    this.container = c;
    var d = document.getElementById("albumTitleBody");
    d.appendChild(c), a && a()
}, RP._createLi = function (a) {
    var b = this, c = document.createElement("li");
    c.innerHTML = a.name, c.id = "floor_" + a.index, c.index = a.index;
    var d = a.svid;
    return window.isMobile ? $(c).tap(function (a) {
        a.preventDefault(), b.selectFloor(this.index, !0)
    }) : $(c).click(function (a) {
        a.preventDefault(), b.selectFloor(this.index, !0)
    }), b.container.appendChild(c), $(c).width();
}, RP.selectFloor = function (a, b) {
    var c = this;
    c.select && c.select.removeClass("select"), c.select = $("#floor_" + a), c.select.addClass("select");
    if (c.data[a].svid == "video") {
        $("#albumViewBody").html("");
        var v = document.createElement("div");
        v.className = "PanoPhotoCell";
        v.id = "video";
        var d = TXConneturl + "http://app.hiweixiao.com/Public/Uploads//2015/08/55e476932de01.jpg";
        v.innerHTML = '<img src="' + d + '"><div class="PanoPhotoTitle">' + "远洋新干线" + "</div>", v.idx = 0;
        document.getElementById("albumViewBody").appendChild(v);
        c.video = true;
        function e(v) {
            c.photo.mapT.enterPhoto();
            v.preventDefault(), $("#video").attr('tabindex', -1).focus();
            $("#yyxgxVideo").show();
            document.getElementById("yyxgxVideo").load();
            document.getElementById("yyxgxVideo").play();
            document.getElementById("au").pause();
        }

        $(v).click(e);
    } else if (c.video) {
        c.photo._draw();
        c.video = false;
        b && c.photo.pano.setPano(c.data[a].svid);
    } else {
        b && c.photo.pano.setPano(c.data[a].svid);
    }
}, RP.nextFloor = function () {
    var a = this.select[0].index, b = this.data.length;
    a++, b > a && this.selectFloor(a, !0)
}, RP.preFloor = function () {
    var a = this.select[0].index;
    a--, a >= 0 && this.selectFloor(a, !0)
}, RP.draw = function () {
    var a = document.getElementById("albumTitleBody"), b = 0, c = this, width = 0, w = 0;
    c.container.innerHTML = "";
    for (var d = 0; d < c.data.length; d++) {
        var e = !1;
        0 === d && (e = !0), c.data[d].index = d, w = c._createLi(c.data[d], e), b += w, width = width + w + 16;
    }
    $("#albumTitleBody").width(width);
    new IScroll('#albumTitle_wrapper', {
        mouseWheel: true,
        click: true,
        scrollX: true,
        scrollY: false
    });
}, RP.setFloorData = function (a) {
    this.data = a, this.draw()
};
