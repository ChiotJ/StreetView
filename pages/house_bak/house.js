/**
 * Created by 英硕 on 2015/8/31.
 */
(function () {

    var house = (function () {
        return {
            CUR_BLOCK: 'MENU',
            MENU_INDEX: 0,
            MENU_LENGTH: 4,
            PANO: null,
            KEYBOARD: null,
            SEARCH_INDEX: 0,
            //搜索进程，SEARCH输入及搜索，SEARCHLIST搜索结果列表，SEARCHMAP通过结果列表进入地图，SEARCHPANO地图切换到街景
            SEARCH_PROCESS: 'SEARCH',
            MARKERSARRAY: [],//地图上标记列表
            TEMPLATE_HOUSE: doT.template($('#template-house').text()),//房源列表模板
            TEMPLATE_HOUSE_DETAIL: doT.template($('#template-house-detail').text()),//房源详情模板
            TEMPLATE_HOUSE_INTRO: doT.template($('#template-house-intro').text()),//项目介绍模板
            TEMPLATE_SEARCH: doT.template($('#template-search').text()),//搜索结果模板
            HOUSE_INDEX: 0,//找房当前选中列表位置
            RECOMMEND: false,//是否为推荐直接跳转
            AREA: 0,//相册状态
            IS_SEARCH: false,
            MAP_PERIPHERAL: null,
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
            init: function () {
                Lib.mapInit({}, GHSMLib.cardId);
                this.keyboardInit();
                this.keyListener();
                $(".sInput").focus();

                var recommend = Lib.getQueryString('pano');
                //推荐进来，直接进入街景
                if (recommend) {
                    this.hideMenu();
                    this.initPano();
                    this.CUR_BLOCK = 'PANO';
                    this.RECOMMEND = true;
                    $('#houseDetailContainer').attr('data-id', Lib.getQueryString('hid'));
                    $('#album').show();
                    $('#hintContainer').attr('class', 'housePano');
                    //显示二维码和联系方式
                    $('#houseQrCode').attr('src', TXConneturl + 'http://web.sr.gehua.net.cn/api/common/Image/qrCode.png?text=http://www.hiweixiao.com/h5/zhaofang/list.html?id=' + Lib.getQueryString('hid') + "&size=110");
                    $('#houseTel').html(decodeURI(Lib.getQueryString('tel')));
                    $('.houseDetail').show();
                    this.getHouseDetail(Lib.getQueryString('hid'));
                    this.getHouseIntro(Lib.getQueryString('hid'));
                    this.initMapPeripheral(Lib.getQueryString('lat'), Lib.getQueryString('lng'));
                }
            },
            /*显示街景，初始化*/
            showPano: function (lat, lng) {
                var that = this;
                //街景初始化
                if ($('#panoCon').html() == '') {
                    that.PANO = new mapT();
                    that.PANO.init();
                } else {
                    that.PANO.reInit();
                }
                that.PANO.toPano(lat, lng);
                Lib.MAP.setOptions({keyboardShortcuts: false});
                $('#container').hide();
                $('#panoCon').show();
                $('#_panoSwf_0').focus().trigger('click');
            },
            /*初始化街景，推荐直接进入时使用*/
            initPano: function () {
                var that = this;
                //街景初始化
                that.PANO = new mapT();
                that.PANO.init();
                that.PANO.PANO.setPano(Lib.getQueryString('pano'));
                that.PANO.PANO.setPov(parseInt(Lib.getQueryString('heading')), parseInt(Lib.getQueryString('pitch')));
                $('#panoCon').show();
                $('#container').hide();
                $('#_panoSwf_0').focus();
            },
            control: function (e) {
                var that = this;

                //菜单
                if (that.CUR_BLOCK == 'MENU') {
                    if (e && e.keyCode == 8 || e && e.keyCode == 27) { //返回
                        that.exit();
                        return false;
                    } else if (e && e.keyCode == 39) {//右键
                        if ((that.MENU_INDEX + 1) < that.MENU_LENGTH) {
                            that.MENU_INDEX++;
                            $("#search_" + that.MENU_INDEX).focus();
                        }
                    } else if (e && e.keyCode == 37) {//左键
                        if (that.MENU_INDEX > 0) {
                            that.MENU_INDEX--;
                            $("#search_" + that.MENU_INDEX).focus();
                        }
                    } else if (e && e.keyCode == 40) {//下键
                        if ($("#tv_keyboard_div").css("bottom") == "0px") {
                            that.CUR_BLOCK = 'SEARCH';
                            that.KEYBOARD.changeItem();
                        }
                    } else if (e && e.keyCode == 13) {//enter 键
                        if (that.MENU_INDEX == 0) {
                            that.CUR_BLOCK = "PAGE_BODY";
                            $("#pageBody").focus();
                            $("#tv_keyboard_div").css("bottom", "0px");
                            setTimeout(function () {
                                that.CUR_BLOCK = 'SEARCH';
                                if ($("#tv_keyboard_div").css("bottom") == "0px") {
                                    that.KEYBOARD.changeItem();
                                }
                            }, 1100);
                        } else if (that.MENU_INDEX == 1) {
                            var time = 1000;
                            that.CUR_BLOCK = "PAGE_BODY";
                            $("#pageBody").focus();

                            that.SEARCH_PROCESS = 'SEARCHLIST';
                            if ($("#tv_keyboard_div").css("bottom") == "0px") {
                                $("#tv_keyboard_div").css("bottom", "-384px");
                            } else {
                                time = 0;
                            }
                            setTimeout(function () {
                                $("#resultContainer").css("top", "148px");
                                $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                                setTimeout(function () {
                                    $($('#searchList li')[0]).attr('tabindex', -1).focus();
                                }, 2000);
                            }, time);
                            setTimeout(function () {
                                that.searchMap();
                            }, 2500 + time);
                        } else if (that.MENU_INDEX == 2) {
                            that.hideMenu();
                            Lib.mapFocus();
                            Lib.MAP.setOptions({keyboardShortcuts: true});
                            $('#hintContainer').attr('class', 'houseMap').show();
                            that.CUR_BLOCK = 'MAP';
                            $('#dialog').html('左右移动位置，<br>点击确定进行搜房').fadeIn();
                            that.IS_SEARCH = false;
                        }
                    }
                }
                //搜索
                else if (that.CUR_BLOCK == 'SEARCH') {
                    if (that.SEARCH_PROCESS == 'SEARCH') {
                        if (e && e.keyCode == 8) { // 返回
                            $("#tv_keyboard_div").css("bottom", "-384px");
                            that.CUR_BLOCK = 'MENU';
                            $("#search_" + that.MENU_INDEX).focus();
                            return false;
                        } else if (e && e.keyCode == 27) {
                            that.exit();
                        }
                    } else if (that.SEARCH_PROCESS == 'SEARCHLIST') {
                        if (e.target.id != 'enterKey') {
                            Lib.listListener({
                                e: e,
                                listName: 'search',
                                num: 5,
                                height: 400,
                                type: 'button',
                                enter: function (lib) {
                                    var obj = $('#searchList button')[lib.SEARCH_INDEX];
                                    if (obj) {
                                        var item = obj;
                                        that.hideMenu();
                                        $("#resultContainer").css("top", "720px");
                                        that.IS_SEARCH = true;

                                        that.showPano($(item).attr('data-lat'), $(item).attr('data-lng'));
                                        $('.houseList').hide();
                                        $('#houseQrCode').attr('src', TXConneturl + 'http://web.sr.gehua.net.cn/api/common/Image/qrCode.png?text=http://www.hiweixiao.com/h5/zhaofang/list.html?id=' + $(item).attr('data-id') + "&size=110");
                                        $('#houseTel').html($(item).attr('data-tel'));
                                        $('.houseDetail').show();
                                        $('#album').show();
                                        $('#houseDetailContainer').attr('data-id', $(item).attr('data-id'));
                                        $('#hintContainer').attr('class', 'housePano');
                                        that.CUR_BLOCK = 'PANO';
                                        that.getHouseDetail($(item).attr('data-id'));
                                        that.getHouseIntro($(item).attr('data-id'));
                                        that.initMapPeripheral($(item).attr('data-lat'), $(item).attr('data-lng'));
                                    } else {
                                        $("#resultContainer").css("top", "720px");
                                        Lib.SEARCH_INDEX = 0;
                                        that.CUR_BLOCK = 'MENU';
                                        that.SEARCH_PROCESS = 'SEARCH';
                                        $("#search_" + that.MENU_INDEX).focus();
                                    }
                                },
                                up: 'default',
                                down: 'default'
                            });
                            if (e && e.keyCode == 8) { //返回
                                $("#resultContainer").css("top", "720px");
                                Lib.SEARCH_INDEX = 0;
                                that.CUR_BLOCK = 'MENU';
                                that.SEARCH_PROCESS = 'SEARCH';
                                $("#search_" + that.MENU_INDEX).focus();
                                that.KEYBOARD.clear();
                                return false;
                            } else if (e && e.keyCode == 27) {
                                that.exit();
                            }
                            return false;
                        }
                    }
                }
                //地图
                else if (that.CUR_BLOCK == 'MAP') {
                    $('#dialog').fadeOut();
                    if (e && e.keyCode == 8) { //返回
                        that.showMenu();
                        $(".search").trigger('click');
                        $("#search_" + that.MENU_INDEX).focus();
                        $('#hintContainer').hide();
                        that.CUR_BLOCK = 'MENU';
                        return false;
                    } else if (e && e.keyCode == 27) {
                        that.exit();
                    } else if (e && e.keyCode == 13) {//enter 键
                        that.CUR_BLOCK = "PAGE_BODY";
                        $("#pageBody").focus();
                        that.search();
                    }
                    Lib.zoomListener(e);
                    return false;
                }
                //房源列表
                else if (that.CUR_BLOCK == 'LIST') {
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
                            $('#hintContainer').attr('class', 'housePano');
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
                        $('.houseList').hide();
                        that.deleteOverlays();
                        Lib.MAP_CENTER = true;
                        Lib.mapFocus();
                        Lib.HOUSE_INDEX = 0;
                        that.CUR_BLOCK = 'MAP';
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
                                    that.CUR_BLOCK = "PAGE_BODY";
                                    $("#pageBody").focus();

                                    $('#panoCon').hide();
                                    $('.houseDetail').hide();
                                    $('#container').show();
                                    $('#album').hide();
                                    that.PANO.changeArea(-1);
                                    that.showMenu();
                                    $("#resultContainer").css("top", "148px");
                                    setTimeout(function () {
                                        that.CUR_BLOCK = 'SEARCH';
                                        $("#search_" + that.MENU_INDEX).trigger('click');
                                        $($('#searchList button')[Lib.SEARCH_INDEX]).attr('tabindex', -1).focus();
                                    }, 1000);
                                    $('#hintContainer').hide();
                                } else {
                                    $('#panoCon').hide();
                                    $('.houseDetail').hide();
                                    $('#container').show();
                                    $('.houseList').show();
                                    $('#album').hide();
                                    that.PANO.changeArea(-1);
                                    $($('#houseList li')[Lib.HOUSE_INDEX]).attr('tabindex', -1).focus();
                                    Lib.MAP.setOptions({keyboardShortcuts: true});
                                    $('#hintContainer').attr('class', 'houseMap');
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
                            if (that.PANO.area == 2) {
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
                    } else if (e && e.keyCode == 40) {
                        if (that.PANO.PANO.planeInfo && that.PANO.area == 2) {
                            that.CUR_BLOCK = "PAGE_BODY";
                            $("#pageBody").focus();

                            $('#houseDetail').css('left', '0px').css('opacity', '1');
                            that.AREA = that.PANO.area;
                            that.PANO.changeArea(-1);
                            setTimeout(function () {
                                that.CUR_BLOCK = 'DETAIL';
                                $($('.houseDetailMenu li')[0]).attr('tabindex', -1).focus();
                            }, 500);
                            return false;
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
                                window.location.href = "house.html";
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
                var that = this;
                document.onkeydown = function (event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    //console.log(that.CUR_BLOCK + "-" + e.keyCode);
                    return that.control(e);
                };

                $("#detailIcon").click(function () {
                    $('#houseDetail').css('left', '0px').css('opacity', '1');
                    that.AREA = that.PANO.area;
                    that.PANO.changeArea(-1);
                    that.CUR_BLOCK = 'DETAIL';
                    setTimeout(function () {
                        $($('.houseDetailMenu li')[0]).attr('tabindex', -1).focus();
                    }, 500);
                });

                $(".search div").click(function () {
                    var index = parseInt($(this).attr("id").replace("search_", ""));
                    if (index == 1) {
                        var time = 1000;
                        that.CUR_BLOCK = 'SEARCH';
                        that.SEARCH_PROCESS = 'SEARCHLIST';
                        if ($("#tv_keyboard_div").css("bottom") == "0px") {
                            $("#tv_keyboard_div").css("bottom", "-384px");
                        } else {
                            time = 0;
                        }
                        setTimeout(function () {
                            $("#resultContainer").css("top", "148px");
                            $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                            setTimeout(function () {
                                $($('#searchList li')[0]).attr('tabindex', -1).focus();
                            }, 2000);
                        }, time);
                        setTimeout(function () {
                            that.searchMap();
                        }, 2500 + time);
                    } else if (index == 2) {
                        that.hideMenu();
                        Lib.mapFocus();
                        Lib.MAP.setOptions({keyboardShortcuts: true});
                        $('#hintContainer').attr('class', 'houseMap').show();
                        that.CUR_BLOCK = 'MAP';
                        $('#dialog').html('左右移动位置，<br>点击确定进行搜房').fadeIn();
                        that.IS_SEARCH = false;
                    }
                });

                if (Lib.getQueryString("click")) {
                    $("#exit").show().click(function () {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        e.keyCode = 27;
                        that.control(e);
                    });
                }
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
                    /*searchService = new qq.maps.SearchService({
                     error: function (err) {
                     console.log(err);
                     },
                     complete: function (results) {
                     var pois = results.detail.pois;
                     for (var i = 0, l = pois.length; i < l; i++) {
                     var poi = pois[i];
                     var mAnchor = new qq.maps.Point(57 / 2, 57 / 2),
                     mSize = new qq.maps.Size(57, 57),
                     mOrigin = new qq.maps.Point(0, 0),
                     mIcon = new qq.maps.MarkerImage(src.replace("_focus.png", "_map.png"), mSize, mOrigin, mAnchor);

                     var mMarker = new qq.maps.Marker({
                     icon: mIcon,
                     map: that.MAP_PERIPHERAL,
                     position: poi.latLng
                     });

                     mMarker.setTitle(i + 1);
                     markers.push(mMarker);

                     var mInfo = new qq.maps.InfoWindow({
                     map: that.MAP_PERIPHERAL,
                     position: poi.latLng
                     });

                     var content = poi.name + "（距离" + parseInt(poi.dist) + "米）";
                     mInfo.setContent(content);
                     mInfo.open();
                     infos.push(mInfo);

                     }
                     }
                     });

                     var keyword = $(this).attr("data-id");
                     searchService.setPageCapacity(5);
                     searchService.searchNearBy(keyword, center, 500);*/
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
            //请求房源列表
            search: function () {
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

                            $('#houseList li').click(function () {
                                $(this).focus();
                                var item = $(this);
                                that.showPano($(item).attr('data-lat'), $(item).attr('data-lng'));
                                $('.houseList').hide();
                                $('#houseQrCode').attr('src', TXConneturl + 'http://web.sr.gehua.net.cn/api/common/Image/qrCode.png?text=http://www.hiweixiao.com/h5/zhaofang/list.html?id=' + $(item).attr('data-id') + "&size=110");
                                $('#houseTel').html($(item).attr('data-tel'));
                                $('.houseDetail').show();
                                $('#album').show();
                                $('#houseDetailContainer').attr('data-id', $(item).attr('data-id'));
                                $('#hintContainer').attr('class', 'housePano');
                                that.CUR_BLOCK = 'PANO';
                                that.getHouseDetail($(item).attr('data-id'));
                                that.getHouseIntro($(item).attr('data-id'));
                                that.initMapPeripheral($(item).attr('data-lat'), $(item).attr('data-lng'));
                            });
                        } else {
                            $('#houseList').html('<li style="text-align: center;">搜索失败，请稍后再试</li>');
                            $($('#houseList li')[0]).attr('tabindex', -1).focus();
                        }
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
            hideMenu: function () {
                $("#tv_keyboard_div").css("bottom", "-384px");
                $('.search').css('top', '-148px');
            },
            showMenu: function () {
                $('.search').css('top', '0px');
            },
            /*绑定焦点事件*/
            bindFocus: function (name) {
                $(name).focus(function () {
                    $(this).addClass('cur');
                }).blur(function () {
                    $(this).removeClass('cur');
                });
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

                            $("#houseDetailMenuList li").click(function () {
                                var id = $(this).attr('data-id');
                                if (id == 0) {
                                    $('#houseIntro').css('left', '0');
                                    that.CUR_BLOCK = 'INTRO';
                                } else if (id == 1) {
                                    $('#housePeripheral').css('left', '0');
                                    $($('.housePeripheralMenu li')[0]).attr('tabindex', -1).focus();
                                    that.CUR_BLOCK = 'PERIPHERAL';
                                } else if (id == 2) {
                                    $('#houseDetail').css('left', '1280px').css('opacity', '0');
                                    Lib["houseDetailMenu".toUpperCase() + '_INDEX'] = 0;
                                    setTimeout(function () {
                                        that.PANO.changeArea(that.AREA);
                                    }, 1000);
                                    that.CUR_BLOCK = 'PANO';
                                } else if (id == 3) {
                                    window.location.href = "house.html";
                                }
                            });
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
            /*搜索*/
            searchMap: function () {

                var that = this, input = $('#search_input').val(), lat1, lng1;
                lat1 = Lib.MAP.getCenter().getLat();
                lng1 = Lib.MAP.getCenter().getLng();

                $.ajax({
                    url: TXConneturl + 'http://app.szzunhao.com/Mobile/TvSearch/getSearchList?',
                    type: "GET",
                    data: {
                        title: input,
                        lat: lat1,
                        lng: lng1,
                        isFromDrag: 1,
                        perpage: 30
                    },
                    success: function (result) {
                        that.CUR_BLOCK = 'SEARCH';
                        if (result.status) {
                            $('#searchList').html(that.TEMPLATE_SEARCH(result.data));
                            that.bindFocus('.search_item');
                            $($('#searchList button')[0]).attr('tabindex', -1).focus();

                            $(".search_item").click(function () {
                                Lib.SEARCH_INDEX = $(this).attr("data-index");
                                var item = this;
                                that.hideMenu();
                                $("#resultContainer").css("top", "720px");
                                that.IS_SEARCH = true;

                                that.showPano($(item).attr('data-lat'), $(item).attr('data-lng'));
                                $('.houseList').hide();
                                $('#houseQrCode').attr('src', TXConneturl + 'http://web.sr.gehua.net.cn/api/common/Image/qrCode.png?text=http://www.hiweixiao.com/h5/zhaofang/list.html?id=' + $(item).attr('data-id') + "&size=110");
                                $('#houseTel').html($(item).attr('data-tel'));
                                $('.houseDetail').show();
                                $('#album').show();
                                $('#houseDetailContainer').attr('data-id', $(item).attr('data-id'));
                                $('#hintContainer').attr('class', 'housePano');
                                that.CUR_BLOCK = 'PANO';
                                that.getHouseDetail($(item).attr('data-id'));
                                that.getHouseIntro($(item).attr('data-id'));
                                that.initMapPeripheral($(item).attr('data-lat'), $(item).attr('data-lng'));
                            });

                            new IScroll('#resultContainer', {mouseWheel: true, click: true});
                        } else {
                            $('#searchList').html('<li style="text-align: center;">未找到相关地点</li>');
                            $($('#searchList li')[0]).attr('tabindex', -1).focus();
                        }
                    },
                    error: function () {
                        that.CUR_BLOCK = 'SEARCH';
                        $('#searchList').html('<li style="text-align: center;">搜索失败，请稍后再试</li>');
                        $($('#searchList li')[0]).attr('tabindex', -1).focus();
                    }
                });
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
            suggestion: function (keyword, lat, lng) {
                var that = this, city = '';
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
                return that.getSuggestionByCity(keyword, city);
            },
            keyboard: function (col, row, inputObj) {
                this.str = "";
                col ? this.col = col : this.col = 0;
                row ? this.row = row : this.row = 0;
                inputObj ? this.inputObj = inputObj : null;
            },
            keyboardInit: function () {
                var that = this;
                that.keyboard.prototype = {
                    init: function () {
                        this.changeItem();
                        this.keyListener();
                    },
                    changeItem: function () {
                        if (document.all)
                            var it = document.getElementById("tv_keyboard").children[0];
                        else
                            var it = document.getElementById("tv_keyboard");
                        for (i = 0; i < it.rows.length; i++) {
                            it.rows[i].className = "";
                        }
                        if (this.row < 0) {
                            $("#search_" + that.MENU_INDEX).focus();
                            that.CUR_BLOCK = "MENU";
                            this.row = 0;
                            return;
                        }
                        if (this.row == it.rows.length) {
                            this.row = it.rows.length - 1;
                        }

                        var objtab = document.all.tv_keyboard;
                        var objrow = objtab.rows[this.row].getElementsByTagName("a");

                        if (this.col < 0) {
                            this.col = objrow.length - 1;
                        }
                        if (this.col == objrow.length) {
                            this.col = 0;
                        }
                        this.f = objrow[this.col];
                        this.f.focus();
                    },
                    keyListener: function () {
                        var t = this;
                        document.getElementById("tv_keyboard").onkeydown = function (e) {
                            e = window.event || e;
                            switch (e.keyCode) {
                                case 37: //左键
                                    t.col--;
                                    break;
                                case 38: //向上键
                                    t.row--;
                                    break;
                                case 39: //右键
                                    t.col++;
                                    break;
                                case 40: //向下键
                                    t.row++;
                                    break;
                                case 13:
                                    var str = t.f.innerHTML;
                                    if (str == "删除") {
                                        t.backspace();
                                    } else if (str == "搜索") {
                                        that.CUR_BLOCK = "PAGE_BODY";
                                        $("#pageBody").focus();
                                        $("#tv_keyboard_div").css("bottom", "-384px");
                                        setTimeout(function () {
                                            that.SEARCH_PROCESS = 'SEARCHLIST';
                                            $("#resultContainer").css("top", "148px");
                                            $('#searchList').html('<li style="text-align: center;">搜索中，请稍候。。。</li>');
                                            setTimeout(function () {
                                                $($('#searchList li')[0]).attr('tabindex', -1).focus();
                                            }, 2000);
                                        }, 1000);
                                        setTimeout(function () {
                                            that.searchMap();
                                        }, 3500);
                                    } else {
                                        t.str = t.str + str;
                                        if (t.inputObj) {
                                            t.inputObj.val(t.str);
                                        }
                                    }
                                    return false;
                                default:
                                    break;
                            }
                            t.changeItem();
                        };
                    },
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
                that.KEYBOARD = new that.keyboard(0, 0, $('#search_input'));
                that.KEYBOARD.init();
            },
            exit: function () {
                window.history.go(-1);
                /*if (Lib.getQueryString('click')) {
                 window.location.href = '../list/list.html?id=cff4c78b6825bc3d112df4781700528c&click=true';
                 } else {
                 window.location.href = '../list/list.html?id=cff4c78b6825bc3d112df4781700528c';
                 }*/
            }

        }
    })();

    house.init();

    var musicList = [
        "../../audio/ajdwh.mp3",
        "../../audio/cidm.mp3",
        "../../audio/rtl.mp3",
        "../../audio/sndqd.mp3",
        "../../audio/Refrain.mp3"
    ];

    var audioBG = new GHSMLib.AudioPlayer(musicList, 2);

})();