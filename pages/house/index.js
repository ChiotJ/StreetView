!function (window, document) {
    var init = function () {
        $("#pageBody").focus();

        var recommend = Lib.getQueryString('pano');
        //推荐进来，直接进入街景
        if (recommend) {
            house.recommend();
        } else {
            container.init();
            menus.keyListener();
            keyListener.keyborad();
        }


        pageBody.keyListener();


        if (Lib.getQueryString("click")) {
            $("#exit").show();
        }

    };

    var container = {
        init: function () {
            Lib.mapInit(this, GHSMLib.cardId);
            $('#hintContainer').attr('class', 'searchMap').show();
            this.keyListener();
            window.onload = function () {
                Lib.mapFocus();
            };
        },
        keyListener: function () {
            GHSMLib.keyCon.keyListener({
                id: "container",
                pageUp: function () {
                    Lib.MAP.setZoom(Lib.MAP.getZoom() + 1);
                },
                pageDown: function () {
                    Lib.MAP.setZoom(Lib.MAP.getZoom() - 1);
                },
                enter: function () {
                    $("#pageBody").focus();
                    menus.menus_effect(true);
                    setTimeout(function () {
                        $("#menus").attr("tabindex", "-1").focus().trigger("click");
                    }, 500);
                },
                click: function () {
                    return false;
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    exit();
                    return false;
                }
            });
        }
    };


    var menus = {
        menus_effect: function (flag) {
            var time = 500;
            if (flag) {
                $("#menus").animate({
                    width: "300px",
                    height: "300px",
                    top: "210px",
                    left: "490px",
                    opacity: "1"
                }, time);
                $("#menus_top").animate({
                    width: "98px",
                    height: "88px",
                    top: "6px",
                    left: "101px"
                }, time);

                $("#menus_zuo").animate({
                    width: "98px",
                    height: "88px",
                    top: "112px",
                    left: "0"
                }, time);

                $("#menus_you").animate({
                    width: "98px",
                    height: "88px",
                    top: "112px",
                    right: "0"
                }, time);

                $("#menus_xia").animate({
                    width: "98px",
                    height: "88px",
                    bottom: "0",
                    left: "101px"
                }, time);

                $("#menus_zhong").animate({
                    width: "76px",
                    height: "76px",
                    top: "112px",
                    left: "112px"
                }, time);
            } else {
                $("#menus").animate({
                    width: "0",
                    height: "0",
                    top: "360px",
                    left: "640px",
                    opacity: "0"
                }, time);
                $("#menus_top").animate({
                    width: "0",
                    height: "0",
                    top: "0",
                    left: "0"
                }, time);

                $("#menus_zuo").animate({
                    width: "0",
                    height: "0",
                    top: "0",
                    left: "0"
                }, time);

                $("#menus_you").animate({
                    width: "0",
                    height: "0",
                    top: "0",
                    right: "0"
                }, time);

                $("#menus_xia").animate({
                    width: "0",
                    height: "0",
                    bottom: "0",
                    left: "0"
                }, time);

                $("#menus_zhong").animate({
                    width: "0",
                    height: "0",
                    top: "0",
                    left: "0"
                }, time);
            }
        },
        keyListener: function () {
            var self = this;
            GHSMLib.keyCon.keyListener({
                id: "menus",
                enter: function () {
                    $("#pageBody").focus();
                    self.menus_effect(false);
                    Lib.mapFocus();
                },
                up: function () {
                    $("#pageBody").focus();
                    $("#search").css("top", "0");
                    $("#tv_keyboard").css("bottom", "0");
                    self.menus_effect(false);
                    setTimeout(function () {
                        $($("#tv_keyboard").find("li")[0]).focus();
                    }, 1000);
                },
                down: function () {
                    $("#pageBody").focus();
                    house.searchMap();
                    self.menus_effect(false);
                },
                left: function () {
                    $("#pageBody").focus();
                    self.menus_effect(false);
                    var flag = Pano.showPano();
                    if (!flag) {
                        $('#dialog').html('此地暂无街景，敬请期待').fadeIn();
                        Lib.mapFocus();
                    }
                    $("#detailIcon").hide();
                },
                right: function () {
                    $("#pageBody").focus();
                    sessionStorage["StreetView.history.list.menu"] = 0;
                    window.location.href = '../list/list.html?id=cff4c78b6825bc3d112df4781700528c&click=true';
                },
                click: function (item) {
                    return false;
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    self.menus_effect(false);
                    Lib.mapFocus();
                    return false;
                }
            });
        }
    };


    var changeAdd = function () {
        var sock = new SockJS('http://wx.digital-media.com.cn/wx/tvapi?token=' + GHSMLib.cardId);
        var stompClient = Stomp.over(sock);
        stompClient.debug = function (str) {
            //console.log(str);
        };
        stompClient.connect({}, function (frame) {
            stompClient.subscribe("/topic/address", function (data) {
                data = JSON.parse(data.body);
                if (data) {
                    $("#address").html(data.address);
                    $("#name").html(data.name);
                    $("#tel").html(data.phone);
                }
            });
        }, function (msg) {
            //console.log(msg)
        });
    };


    var Pano = {
        PANO: null,
        showPano: function () {
            var $pannoCon = $('#panoCon');
            //街景初始化
            if ($pannoCon.html() == '') {
                this.PANO = new mapT();
                this.PANO.init();
            } else {
                this.PANO.reInit();
            }
            var result = this.PANO.toPano(Lib.MAP.getCenter().getLat(), Lib.MAP.getCenter().getLng());

            if (!result) {
                this.PANO.changeArea(-1);
                return false;
            }
            $('#container').hide();
            $pannoCon.show();
            $('#album').show();
            $('#hintContainer').attr('class', 'panoMap');
            $("#albumNotice").find("img").attr("src", "images/mapPhoto_no.png");
            $('#_panoSwf_0').focus().trigger('click');
            keyListener.pano();
            return true;
        }
    };

    var house = {
        TEMPLATE_HOUSE: doT.template($('#template-house').text()),//房源列表模板
        TEMPLATE_HOUSE_DETAIL: doT.template($('#template-house-detail').text()),//房源详情模板
        TEMPLATE_HOUSE_INTRO: doT.template($('#template-house-intro').text()),//项目介绍模板
        IS_SEARCH: false,
        CUR_BLOCK: "",
        searchDot: doT.template($('#searchDot').text()),
        ICON: {
            center: {
                path: 'images/center.png',
                width: 56,
                height: 56
            },
            houseLoc: {
                path: 'images/houseLoc.png',
                width: 22,
                height: 30
            },
            houseFocus: {
                path: 'images/houseFocus.png',
                width: 22,
                height: 30
            },
            housePeripheralFocus: {
                path: 'images/housePeripheralFocus.png',
                width: 35,
                height: 47
            }
        },
        MARKERSARRAY: [],
        recommend: function () {
            this.showPano(Lib.getQueryString('lat'), Lib.getQueryString('lng'));
            this.CUR_BLOCK = 'PANO';
            this.RECOMMEND = true;
            $('#houseDetailContainer').attr('data-id', Lib.getQueryString('hid'));
            $('#album').show();
            //显示二维码和联系方式
            $('#houseQrCode').attr('src', TXConneturl + 'http://web.sr.gehua.net.cn/api/common/Image/qrCode.png?text=http://www.hiweixiao.com/h5/zhaofang/list.html?id=' + Lib.getQueryString('hid') + "&size=110");
            $('#houseTel').html(decodeURI(Lib.getQueryString('tel')));
            $('.houseDetail').show();
            this.getHouseDetail(Lib.getQueryString('hid'));
            this.getHouseIntro(Lib.getQueryString('hid'));
            this.initMapPeripheral(Lib.getQueryString('lat'), Lib.getQueryString('lng'));
            this.keyListener();
        },
        searchMap: function () {
            var that = this, cLat = Lib.MAP.getCenter().getLat(), cLng = Lib.MAP.getCenter().getLng();
            $.ajax({
                url: TXConneturl + 'http://app.szzunhao.com/Mobile/Qmap/getLoupanList?',
                type: "GET",
                data: {
                    lat: cLat,
                    lng: cLng,
                    perpage: 300,
                    isFromDrag: 1
                },
                success: function (data) {
                    if (data.status) {
                        var result = data.data.slice(0, 30);
                        var length = result.length;
                        for (var i = 0; i < length; i++) {
                            if (i > 1) {
                                result[i].cover = TXConneturl + result[i].cover;
                            }
                            that.MARKERSARRAY.push(that.layMarker(result[i].FLongitude, result[i].FLatitude, 'houseLoc'));
                        }
                        $('#houseList').html('<ul>' + that.TEMPLATE_HOUSE(result) + '</ul>').css('margin-left', '0px');
                        $('.houseList').show();
                        that.bindFocus('#houseList li');
                        Lib.MAP_CENTER = false;
                        that.changeMarker(Lib.HOUSE_INDEX, 'houseFocus');
                        Lib.MAP.panTo(new qq.maps.LatLng(result[Lib.HOUSE_INDEX].FLongitude, result[Lib.HOUSE_INDEX].FLatitude));
                        $('#houseList').trigger('click');
                        $($('#houseList li')[Lib.HOUSE_INDEX]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'LIST';
                        new IScroll('#houseListContainer', {
                            mouseWheel: true,
                            click: true,
                            scrollX: true,
                            scrollY: false
                        });
                    } else {
                        $('#houseList').html('<li style="text-align: center;">搜索失败，请稍后再试</li>');
                        $($('#houseList li')[0]).attr('tabindex', -1).focus();
                    }
                    that.keyListener();
                },
                error: function () {
                }
            });
        },
        /*地图上换标记图标*/
        changeMarker: function (index, iconType) {
            var that = this, iconPath = that.ICON[iconType].path, iconWidth = that.ICON[iconType].width, iconHeight = that.ICON[iconType].height;
            var anchor = new qq.maps.Point(iconWidth / 2, iconHeight / 2),
                size = new qq.maps.Size(iconWidth, iconHeight),
                origin = new qq.maps.Point(0, 0),
                icon = new qq.maps.MarkerImage(iconPath, size, origin, anchor);
            that.MARKERSARRAY[index].setIcon(icon);
        },
        /*地图上标记点*/
        layMarker: function (lat, lng, iconType) {
            var that = this, center = new qq.maps.LatLng(lat, lng), marker = null,
                iconPath = that.ICON[iconType].path, iconWidth = that.ICON[iconType].width, iconHeight = that.ICON[iconType].height;
            if (iconPath) {
                var anchor = new qq.maps.Point(iconWidth / 2, iconHeight / 2),
                    size = new qq.maps.Size(iconWidth, iconHeight),
                    origin = new qq.maps.Point(0, 0),
                    icon = new qq.maps.MarkerImage(iconPath, size, origin, anchor);
                marker = new qq.maps.Marker({
                    icon: icon,
                    position: center,
                    map: Lib.MAP
                });
            } else {
                marker = new qq.maps.Marker({
                    position: center,
                    map: Lib.MAP
                });
            }
            return marker;
        },
        /*清除地图上标记*/
        deleteOverlays: function () {
            var that = this;
            if (that.MARKERSARRAY) {
                for (i in that.MARKERSARRAY) {
                    that.MARKERSARRAY[i].setMap(null);
                }
                that.MARKERSARRAY.length = 0;
            }
        },
        search: function () {
            var self = this, input = $('#search_input').val(), lat1, lng1;
            var $searchList = $('#searchList');
            lat1 = Lib.MAP.getCenter().getLat();
            lng1 = Lib.MAP.getCenter().getLng();

            $.ajax({
                url: TXConneturl + 'http://app.szzunhao.com/Mobile/TvSearch/getSearchList?',
                type: "GET",
                async: false,
                data: {
                    title: input,
                    lat: lat1,
                    lng: lng1,
                    isFromDrag: 1,
                    perpage: 14
                },
                success: function (result) {
                    if (result.status) {
                        $searchList.html(self.searchDot(result.data));
                        new IScroll('#resultContainer', {mouseWheel: true, click: true});
                    } else {
                        $searchList.html('<li tabindex="-1" style="text-align: center;">未找到相关地点</li>');
                    }
                },
                error: function () {
                    $searchList.html('<li tabindex="-1" style="text-align: center;">搜索失败，请稍后再试</li>');
                }
            });

            self.keyListener();
            $($searchList.find("li")[0]).focus();
        },
        getSuggestionByCity: function (keyword, city) {
            var r = new Object();
            $.ajax({
                url: TXConneturl + "http://apis.map.qq.com/ws/place/v1/suggestion?",
                type: "GET",
                async: false,
                data: ({
                    region: city,
                    keyword: keyword,
                    output: "json",
                    key: "4F5BZ-ZQSCP-FM6DI-VT2TU-HDRU7-OWBBU"
                }),
                success: function (data) {
                    r = data;

                }
            });
            return r;
        },
        showPano: function (lat, lng) {
            var $pannoCon = $('#panoCon');
            var self = this;
            //街景初始化
            if ($pannoCon.html() == '') {
                Pano.PANO = new mapT();
                Pano.PANO.init();
            } else {
                Pano.PANO.reInit();
            }
            this.PANO = Pano.PANO;

            Pano.PANO.toPano(lat, lng);
            $('#container').hide();
            $pannoCon.show();
            setTimeout(function () {
                self.CUR_BLOCK = 'PANO';
                $("#albumNotice").find("img").attr("src", "images/mapPhoto_no_2.png");
            }, 1000);
            $('#hintContainer').attr('class', 'panoMap');
            return true;
        },
        suggestion: function (keyword, lat, lng) {
            var city = '';
            $.ajax({
                url: TXConneturl + "http://apis.map.qq.com/ws/geocoder/v1?",
                type: "GET",
                async: false,
                data: ({
                    location: lat + ',' + lng,
                    get_poi: 0,
                    key: "4F5BZ-ZQSCP-FM6DI-VT2TU-HDRU7-OWBBU"
                }),
                success: function (data) {
                    if (data.status == 0) {
                        city = data.result.address_component.city;
                    } else {
                        city = '北京市';
                    }
                },
                error: function () {
                    city = '北京市';
                }
            });
            return this.getSuggestionByCity(keyword, city);
        },
        /*绑定焦点事件*/
        bindFocus: function (name) {
            $(name).focus(function () {
                $(this).addClass('cur');
            }).blur(function () {
                $(this).removeClass('cur');
            });
        },
        control: function (e) {
            var that = this;
            if (that.CUR_BLOCK == 'LIST') {
                Lib.listListener({
                    e: e,
                    listName: 'house',
                    num: 5,
                    width: 1035,
                    enter: function (lib) {
                        var item = $('#houseList li')[lib.HOUSE_INDEX];
                        that.showPano($(item).attr('data-lat'), $(item).attr('data-lng'));
                        $('.houseList').hide();
                        $('#houseQrCode').attr('src', TXConneturl + 'http://web.sr.gehua.net.cn/api/common/Image/qrCode.png?text=http://www.hiweixiao.com/h5/zhaofang/list.html?id=' + $(item).attr('data-id') + "&size=110");
                        $('#houseTel').html($(item).attr('data-tel'));
                        $('.houseDetail').show();
                        $('#album').show();
                        $('#houseDetailContainer').attr('data-id', $(item).attr('data-id'));
                        that.CUR_BLOCK = 'PANO';
                        that.getHouseDetail($(item).attr('data-id'));
                        that.getHouseIntro($(item).attr('data-id'));
                        that.initMapPeripheral($(item).attr('data-lat'), $(item).attr('data-lng'));

                        return false;
                    },
                    before: function (lib) {
                        that.changeMarker(lib.HOUSE_INDEX, 'houseLoc');
                    },
                    after: function (lib) {
                        var item = $('#houseList li')[lib.HOUSE_INDEX], lat = $(item).attr('data-lat'), lng = $(item).attr('data-lng');
                        lib.MAP.panTo(new qq.maps.LatLng(lat, lng));
                        that.changeMarker(lib.HOUSE_INDEX, 'houseFocus');
                    }
                });
                if (e && e.keyCode == 8) { //返回
                    $("#pageBody").focus();
                    $('.houseList').hide();
                    that.deleteOverlays();
                    Lib.MAP_CENTER = true;
                    Lib.HOUSE_INDEX = 0;
                    Lib.mapFocus();
                    that.CUR_BLOCK = "";
                    return false;
                } else if (e && e.keyCode == 27) {
                    that.exit();
                }
            }
            //街景
            else if (that.CUR_BLOCK == 'PANO') {
                if (e && e.keyCode == 8) { // 按 Esc/返回
                    if (!$("#yyxgxVideo").is(':hidden')) {
                        $("#yyxgxVideo").hide();
                        document.getElementById("yyxgxVideo").pause();
                        audioBG.play();
                        that.PANO.changeArea(2);
                    } else {
                        if (that.RECOMMEND) {
                            that.exit();
                        } else {
                            if (that.IS_SEARCH) {
                                that.CUR_BLOCK = "";
                                $("#pageBody").focus();

                                $('.houseDetail').hide();
                                $('#container').show();
                                $('#panoCon').hide();
                                $('#album').hide();
                                $('#hintContainer').attr('class', 'searchMap');
                                Pano.PANO.changeArea(-1);
                                Lib.mapFocus();
                            } else {
                                $('#panoCon').hide();
                                $('.houseDetail').hide();
                                $('#container').show();
                                $('.houseList').show();
                                $('#album').hide();
                                that.PANO.changeArea(-1);
                                $($('#houseList li')[Lib.HOUSE_INDEX]).attr('tabindex', -1).focus();
                                Lib.MAP.setOptions({keyboardShortcuts: true});
                                $('#hintContainer').attr('class', 'searchMap');
                                $("#housePeripheralMenuList li").off("focus").off("blur");
                                that.CUR_BLOCK = 'LIST';
                            }
                        }
                    }

                    return false;
                } else if (e && e.keyCode == 13) {
                    if (!that.PANO.PANO.planeInfo) {
                        that.CUR_BLOCK = "PAGE_BODY";
                        $("#pageBody").focus();
                        //详情
                        $('#houseDetail').css('left', '0px').css('opacity', '1');
                        that.AREA = that.PANO.area;
                        that.PANO.changeArea(-1);
                        setTimeout(function () {
                            that.CUR_BLOCK = 'DETAIL';
                            $($('.houseDetailMenu li')[0]).attr('tabindex', -1).focus();
                        }, 500);
                        return false;
                    } else {
                        if (that.PANO.area == 0) {
                            if (that.PANO.regeionList.video) {
                                if (document.getElementById("yyxgxVideo").paused) {
                                    $("#yyxgxVideo").show();
                                    document.getElementById("yyxgxVideo").load();
                                    document.getElementById("yyxgxVideo").play();
                                    audioBG.pause();
                                }
                            } else {
                                $("#yyxgxVideo").hide();
                                document.getElementById("yyxgxVideo").pause();
                                audioBG.play();
                            }
                        }
                    }
                } else if (e && e.keyCode == 27) {
                    that.exit();
                }
            }
            //详情
            else if (that.CUR_BLOCK == 'DETAIL') {
                if (e && e.keyCode == 8) {
                    $('#houseDetail').css('left', '1280px').css('opacity', '0');
                    that.CUR_BLOCK = "PAGE_BODY";
                    $("#pageBody").focus();
                    setTimeout(function () {
                        that.PANO.changeArea(that.AREA);
                        that.CUR_BLOCK = 'PANO';
                    }, 500);

                    return false;
                }
                else if (e && e.keyCode == 27) {
                    that.exit();
                }
                Lib.listAreaListener({
                    e: e,
                    columnNum: 4,
                    type: 'houseDetailMenu',
                    enter: function () {
                        var id = $(e.target).attr('data-id');
                        if (id == 0) {
                            $('#houseIntro').css('left', '0');
                            that.CUR_BLOCK = 'INTRO';
                        } else if (id == 1) {
                            that.CUR_BLOCK = "PAGE_BODY";
                            $("#pageBody").focus();

                            $('#housePeripheral').css('left', '0');
                            setTimeout(function () {
                                $($('.housePeripheralMenu li')[0]).attr('tabindex', -1).focus();
                                that.CUR_BLOCK = 'PERIPHERAL';
                            }, 1000);
                        } else if (id == 2) {
                            that.CUR_BLOCK = "PAGE_BODY";
                            $("#pageBody").focus();

                            $('#houseDetail').css('left', '1280px').css('opacity', '0');
                            Lib["houseDetailMenu".toUpperCase() + '_INDEX'] = 0;
                            setTimeout(function () {
                                that.CUR_BLOCK = 'PANO';
                                that.PANO.changeArea(that.AREA);
                            }, 1000);

                        } else if (id == 3) {
                            sessionStorage["StreetView.history.list.menu"] = 0;
                            window.location.href = "index.html";
                        }
                        return false;
                    }
                });
                return false;
            } else if (that.CUR_BLOCK == 'INTRO') {
                if (e && e.keyCode == 8) { // 返回
                    $('#houseIntro').css('left', '1280px');
                    $($('.houseDetailMenu li')[0]).attr('tabindex', -1).focus();
                    that.CUR_BLOCK = 'DETAIL';
                    return false;
                } else if (e && e.keyCode == 27) {
                    that.exit();
                }
            } else if (that.CUR_BLOCK == 'PERIPHERAL') {
                if (e && e.keyCode == 8) {
                    that.CUR_BLOCK = "PAGE_BODY";
                    $("#pageBody").focus();

                    $('#housePeripheral').css('left', '1280px');
                    setTimeout(function () {
                        $($('.houseDetailMenu li')[1]).attr('tabindex', -1).focus();
                        that.CUR_BLOCK = 'DETAIL';
                    }, 1000);
                    return false;
                }
                else if (e && e.keyCode == 27) {
                    that.exit();
                }
                Lib.listAreaListener({
                    e: e,
                    columnNum: 6,
                    type: 'housePeripheralMenu',
                    enter: function () {
                        return false;
                    }
                });
                return false;
            } else if (that.CUR_BLOCK == 'PAGE_BODY') {
                if (e && e.keyCode == 27) {
                    that.exit();
                } else if (e && e.keyCode == 8) {
                    return false;
                }
            }
        },
        keyListener: function () {
            var self = this;
            GHSMLib.keyCon.listKeyListener({
                id: "searchList",
                columnNum: 1,
                label: "li",
                focus: function (item) {
                    var b = $(item).find("button");
                    if (b.length > 0)
                        b.addClass("cur");
                },
                blur: function (item) {
                    var b = $(item).find("button");
                    if (b.length > 0)
                        b.removeClass("cur");
                },
                enter: function (item) {
                    var obj = $(item).find("button")[0];
                    $("#pageBody").focus();
                    if (obj) {
                        $("#search").css("top", "-148px");
                        $("#resultContainer").css("top", "720px");
                        keyboard.clear();
                        self.IS_SEARCH = true;

                        self.showPano($(obj).attr('data-lat'), $(obj).attr('data-lng'));
                        $('#houseQrCode').attr('src', TXConneturl + 'http://web.sr.gehua.net.cn/api/common/Image/qrCode.png?text=http://www.hiweixiao.com/h5/zhaofang/list.html?id=' + $(item).attr('data-id') + "&size=110");
                        $('#houseTel').html($(obj).attr('data-tel'));
                        $('.houseDetail').show();
                        $('#album').show();
                        $('#houseDetailContainer').attr('data-id', $(obj).attr('data-id'));
                        self.getHouseDetail($(obj).attr('data-id'));
                        self.getHouseIntro($(obj).attr('data-id'));
                        self.initMapPeripheral($(obj).attr('data-lat'), $(obj).attr('data-lng'));
                    } else {
                        $("#resultContainer").css("top", "720px");
                        setTimeout(function () {
                            $("#tv_keyboard").css("bottom", "0");
                            setTimeout(function () {
                                $($("#tv_keyboard").find("li")[39]).focus();
                            }, 1000);
                        }, 2000);
                    }

                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    $("#resultContainer").css("top", "720px");
                    setTimeout(function () {
                        $("#tv_keyboard").css("bottom", "0");
                        setTimeout(function () {
                            $($("#tv_keyboard").find("li")[39]).focus();
                        }, 1000);
                    }, 2000);
                    return false;
                }
            });

            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                return self.control(e);
            };

            document.getElementById("viewBody_wrapper").onkeydown = function (e) {
                if (e && e.keyCode == 40) {
                    self.CUR_BLOCK = "PAGE_BODY";
                    $("#pageBody").focus();
                    if (self.PANO.PANO.planeInfo) {
                        $('#houseDetail').css('left', '0px').css('opacity', '1');
                        self.AREA = self.PANO.area;
                        self.PANO.changeArea(-1);
                        setTimeout(function () {
                            self.CUR_BLOCK = 'DETAIL';
                            $($('.houseDetailMenu li')[0]).attr('tabindex', -1).focus();
                        }, 500);
                        return false;
                    }
                }
            };

            document.getElementById("_panoSwf_0").onkeydown = function (e) {
            };
        },
        /*获取房源详情*/
        getHouseDetail: function (id) {
            var that = this;
            //请求房源详情
            $.ajax({
                url: TXConneturl + 'http://app.szzunhao.com/Mobile/Qmap/getLoupanDetail?',
                type: "GET",
                data: {
                    id: id
                },
                success: function (data) {
                    if (data.status) {
                        data.data.cover = TXConneturl + data.data.cover;
                        $('#houseDetail').html(that.TEMPLATE_HOUSE_DETAIL(data.data));
                    } else {
                        $('#houseDetail').html('<span class="error">暂无数据</span>');
                    }
                },
                error: function () {
                    $('#houseDetail').html('<span class="error">请稍后再试</span>');
                }
            });
        },
        /*获取房源项目介绍*/
        getHouseIntro: function (id) {
            var that = this;
            //请求房源详情
            $.ajax({
                url: TXConneturl + 'http://app.hiweixiao.com/Mobile/Loupan/getDetailH5?',
                type: "GET",
                data: {
                    id: id
                },
                success: function (d) {
                    var data = eval("[" + d.substr(1, (d.length - 2)) + "]")[0];
                    if (data.status) {
                        data.data.cover_path = TXConneturl + data.data.cover_path;
                        $('#houseIntro').html(that.TEMPLATE_HOUSE_INTRO(data.data));
                    } else {
                        $('#houseIntro').html('<span class="error">暂无数据</span>');
                    }
                },
                error: function () {
                    $('#houseIntro').html('<span class="error">请稍后再试</span>');
                }
            });
        },
        //初始化周边生活模块
        initMapPeripheral: function (lat, lng) {
            var that = this;
            var center = new qq.maps.LatLng(lat, lng);
            if (!this.MAP_PERIPHERAL) {
                //平面地图初始化
                this.MAP_PERIPHERAL = new qq.maps.Map(document.getElementById('mapPeripheral'), {
                    center: center,
                    zoom: 16,
                    disableDefaultUI: true
                });
            } else {
                this.MAP_PERIPHERAL.panTo(center);
            }

            var iconType = "housePeripheralFocus", iconPath = that.ICON[iconType].path, iconWidth = that.ICON[iconType].width, iconHeight = that.ICON[iconType].height;
            var anchor = new qq.maps.Point(iconWidth / 2, iconHeight),
                size = new qq.maps.Size(iconWidth, iconHeight),
                origin = new qq.maps.Point(0, 0),
                icon = new qq.maps.MarkerImage(iconPath, size, origin, anchor);
            var marker = new qq.maps.Marker({
                icon: icon,
                position: center,
                map: that.MAP_PERIPHERAL
            });

            var searchService, markers = [], infos = [];
            $("#housePeripheralMenuList li").focus(function () {
                var src = $(this).find("img").attr("src").replace(".png", "_focus.png");
                $(this).find("img").attr("src", src);
                var keyword = $(this).attr("data-id");
                $.ajax({
                    url: TXConneturl + "http://apis.map.qq.com/ws/place/v1/search?",
                    type: "GET",
                    async: false,
                    data: ({
                        boundary: "nearby(" + lat + "," + lng + ",500)",
                        keyword: keyword,
                        output: "json",
                        key: "4F5BZ-ZQSCP-FM6DI-VT2TU-HDRU7-OWBBU",
                        page_size: 5
                    }),
                    success: function (json) {
                        var pois = json.data;
                        for (var i = 0, l = pois.length; i < l; i++) {
                            var poi = pois[i];
                            var mAnchor = new qq.maps.Point(57 / 2, 57 / 2),
                                mSize = new qq.maps.Size(57, 57),
                                mOrigin = new qq.maps.Point(0, 0),
                                mIcon = new qq.maps.MarkerImage(src.replace("_focus.png", "_map.png"), mSize, mOrigin, mAnchor);


                            var position = new qq.maps.LatLng(poi.location.lat, poi.location.lng);
                            var mMarker = new qq.maps.Marker({
                                icon: mIcon,
                                map: that.MAP_PERIPHERAL,
                                position: position
                            });

                            mMarker.setTitle(i + 1);
                            markers.push(mMarker);

                            if (parseInt(poi._distance) < 500) {
                                var content = poi.title + "（距离" + parseInt(poi._distance) + "米）";
                                var mInfo = new qq.maps.InfoWindow({
                                    map: that.MAP_PERIPHERAL,
                                    position: position,
                                    content: content,
                                    visible: true
                                });

                                infos.push(mInfo);
                            }
                        }
                    }
                });
            }).blur(function () {
                var src = $(this).find("img").attr("src").replace("_focus.png", ".png");
                $(this).find("img").attr("src", src);
                for (i in markers) {
                    markers[i].setMap(null);
                }
                markers.length = 0;

                for (i in infos) {
                    infos[i].close();
                }
                infos.length = 0;
            });

        },
        exit: function () {
            window.history.go(-1);
        }
    };


    var keyListener = {
        pano: function () {
            GHSMLib.keyCon.keyListener({
                id: "_panoSwf_0",
                click: function () {
                    return false;
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    $('#container').show();
                    $('#panoCon').hide();
                    $('#album').hide();
                    $('#hintContainer').attr('class', 'searchMap');
                    Pano.PANO.changeArea(-1);
                    Lib.mapFocus();
                    $("#detailIcon").show();
                    return false;
                }
            });
        },
        keyborad: function () {
            GHSMLib.keyCon.listKeyListener({
                id: "tv_keyboard",
                columnNum: 10,
                label: "li",
                enter: function (item) {
                    var str = $(item).html();
                    if (str == "删除") {
                        keyboard.backspace();
                    } else if (str == "搜索") {
                        $("#pageBody").focus();
                        $("#tv_keyboard").css("bottom", "-384px");
                        setTimeout(function () {
                            $("#resultContainer").css("top", "148px");
                            $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                        }, 1000);
                        setTimeout(function () {
                            house.search();
                        }, 3500);
                    } else {
                        keyboard.str = keyboard.str + str;
                        if (keyboard.inputObj) {
                            keyboard.inputObj.val(keyboard.str);
                        }
                    }
                },
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    $("#pageBody").focus();
                    $("#search").css("top", "-148px");
                    $("#tv_keyboard").css("bottom", "-384px");
                    keyboard.clear();
                    Lib.mapFocus();
                    return false;
                }
            });
        }

    };

    var keyboard = {
        str: "",
        inputObj: $('#search_input'),
        clear: function () {
            this.str = "";
            if (this.inputObj) {
                this.inputObj.val(this.str);
            }
        },
        backspace: function () {
            if (this.str.length > 0)
                this.str = this.str.substring(0, this.str.length - 1);
            if (this.inputObj) {
                this.inputObj.val(this.str);
            }
        }
    };

    var pageBody = {
        keyListener: function () {
            GHSMLib.keyCon.keyListener({
                id: "pageBody",
                esc: function () {
                    exit();
                    return false;
                },
                back: function () {
                    return false;
                }
            });
        }
    };

    var exit = function () {
        window.history.go(-1);
        //window.location.href = '../index/index.html';
    };

    init();

    var musicList = [
        "../../audio/ajdwh.mp3",
        "../../audio/cidm.mp3",
        "../../audio/rtl.mp3",
        "../../audio/sndqd.mp3",
        "../../audio/Refrain.mp3"
    ];

    var audioBG = new GHSMLib.AudioPlayer(musicList, 2);

}(window, document);