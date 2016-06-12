(function () {

    var view = (function () {
        return {
            CUR_BLOCK: 'PANO',
            PANO: null,
            DETAIL: null,
            TEMPLATE_VIEW_DETAIL: doT.template($('#template-view-detail').text()),//详情
            TEMPLATE_NAV_DETAIL: doT.template($('#template-nav-detail').text()),//导航
            POSITION_MAP: null,
            DRIVING_MAP: null,
            TRANSFER_MAP: null,
            NAV_MENU: 0,
            NAV_MENU_LENGTH: 2,
            NAV_SEL: 0,
            ICON: {
                viewCenter: {
                    path: 'images/viewCenter.png',
                    width: 56,
                    height: 56
                }
            },
            init: function () {
                var that = this;
                this.initPano();
                this.initListener();
                that.getDetail();

                familyCard.init({
                    show: true,
                    getFamilyCard: true
                });
            },
            initPano: function () {
                var that = this;
                //街景初始化
                if ($('#panoCon').html() == '') {
                    that.PANO = new mapT();
                    that.PANO.init();
                }
                that.PANO.PANO.setPano(Lib.getQueryString('pano'));
                that.PANO.PANO.setPov(parseInt(Lib.getQueryString('heading')), parseInt(Lib.getQueryString('pitch')));
                $('#_panoSwf_0').focus();

                /*var type = Lib.getQueryString("id");
                 if (type == "8b5ca85b96138b65e11b100223016483") {
                 $("#viewQrCode").attr("src", "http://172.16.188.13/api/common/Image/qrCode.png?text=http://58.30.224.22:8082/ditu/mobile/mobile.html?type=food&size=110");
                 $("#viewQrCodeContainer").show();
                 } else if (type == "74a8fb10615c8fca6a09d591851b4297") {
                 $("#viewQrCode").attr("src", "http://172.16.188.13/api/common/Image/qrCode.png?text=http://58.30.224.22:8082/ditu/mobile/mobile.html?type=movie&size=110");
                 $("#viewQrCodeContainer").show();
                 } else if (type == "e1a871630a0d80393534315f1dc4ea1c") {
                 $("#viewQrCode").attr("src", "http://172.16.188.13/api/common/Image/qrCode.png?text=http://58.30.224.22:8082/ditu/mobile/mobile.html?type=country&size=110");
                 $("#viewQrCodeContainer").show();
                 }*/
                if (Lib.getQueryString("click")) {
                    $("#hintContainer").hide();
                }
            },
            control: function (e) {
                var that = this;
                console.log(that.CUR_BLOCK);

                if (that.CUR_BLOCK == "PANO") {
                    if (e && e.keyCode == 27 || e && e.keyCode == 8) { // 按 Esc/返回
                        that.exit();
                    }
                    if (e && e.keyCode == 53 && familyCard.isGeting) {
                        that.CUR_BLOCK = "FAMILYCARD";
                        that.AREA = that.PANO.area;
                        that.PANO.changeArea(-1);
                        Lib['VIEWDETAILMENU_INDEX'] = 0;
                        familyCard.getFamilyCard();
                        $("#pageBody").focus();
                        setTimeout(function () {
                            $("#finishiGetFamilyCard").attr("tabindex", "-1").focus();
                        }, 1000);
                    }
                    return false;
                } else if (that.CUR_BLOCK == "FAMILYCARD") {
                    if (e && e.keyCode == 27 || e && e.keyCode == 8 || e && e.keyCode == 13) {
                        if (familyCard.isFailed) {
                            familyCard.failedGet();
                        } else {
                            familyCard.finishGet();
                        }

                        that.CUR_BLOCK = "PAGE_BODY";
                        $("#pageBody").focus();
                        $('#viewDetail').css('left', '1280px');
                        setTimeout(function () {
                            that.PANO.changeArea(that.AREA);
                            that.CUR_BLOCK = 'PANO';
                        }, 1000);
                        return false;
                    }
                    return false;
                } else if (that.CUR_BLOCK == "DETAIL") {
                    Lib.listAreaListener({
                        e: e,
                        columnNum: 2,
                        type: 'viewDetailMenu',
                        enter: function () {
                            var id = $(e.target).attr('data-id');
                            if (id == 0) {
                                that.CUR_BLOCK = "PAGE_BODY";
                                $("#pageBody").focus();
                                $('#positionMap').css('left', '0');
                                setTimeout(function () {
                                    that.CUR_BLOCK = 'POSITION_MAP';
                                    $($('.viewDetailMenu li')[Lib['VIEWDETAILMENU_INDEX']]).blur();
                                    $($($($('#positionMap').children().children()[0]).children().children()[2]).children()[1]).trigger('click');
                                    $('#hintContainer').attr('class', 'mapHint').css("z-index", "5");
                                    $(".txzc").css("z-index", "5");
                                }, 800);
                            } else if (id == 1) {
                                that.CUR_BLOCK = "PAGE_BODY";
                                $("#pageBody").focus();
                                $('#navMap').css('left', '0');
                                setTimeout(function () {
                                    that.CUR_BLOCK = 'NAVMAP';
                                    $($('#navMenuList li')[0]).focus();
                                }, 500)
                            }
                            return false;
                        },
                        esc: function () {
                            that.exit();
                        },
                        back: function () {
                            that.CUR_BLOCK = "PAGE_BODY";
                            $("#pageBody").focus();
                            $('#viewDetail').css('left', '1280px');
                            setTimeout(function () {
                                that.PANO.changeArea(that.AREA);
                                that.CUR_BLOCK = 'PANO';
                            }, 1000);
                            return false;
                        }
                    });
                    return false;
                } else if (that.CUR_BLOCK == "POSITION_MAP") {
                    if (e && e.keyCode == 8) { //返回
                        that.CUR_BLOCK = "PAGE_BODY";
                        $("#pageBody").focus();
                        $('#positionMap').css('left', '1280px');
                        $('#hintContainer').attr('class', 'view').css("z-index", "0");
                        $(".txzc").css("z-index", "");
                        setTimeout(function () {
                            that.CUR_BLOCK = 'DETAIL';
                            $($('.viewDetailMenu li')[Lib['VIEWDETAILMENU_INDEX']]).focus();
                        }, 800);
                        return false;
                    } else if (e && e.keyCode == 34) {//PgDn缩小
                        that.POSITION_MAP.setZoom(that.POSITION_MAP.getZoom() - 1);
                    } else if (e && e.keyCode == 33) {//PgUp放大
                        that.POSITION_MAP.setZoom(that.POSITION_MAP.getZoom() + 1);
                    } else if (e && e.keyCode == 27) {
                        that.exit();
                    }

                } else if (that.CUR_BLOCK == "NAVMAP") {
                    if (e && e.keyCode == 8) { //返回
                        that.CUR_BLOCK = "PAGE_BODY";
                        $("#pageBody").focus();
                        $('#navMap').css('left', '1280px');
                        $('#hintContainer').attr('class', 'view').css("z-index", "0");
                        setTimeout(function () {
                            that.CUR_BLOCK = 'DETAIL';
                            $($('.viewDetailMenu li')[Lib['VIEWDETAILMENU_INDEX']]).focus();
                        }, 800);
                        return false;
                    } else if (e && e.keyCode == 27) {
                        that.exit();
                    } else if (e && e.keyCode == 40) {//下键
                        if (that.NAV_MENU < (that.NAV_MENU_LENGTH - 1) && that.NAV_SEL == 0) {
                            $(".navContent ul").css("margin-top", 0);
                            $($("#navMenuList li")[++that.NAV_MENU]).focus();
                        } else if (that.NAV_SEL == 1) {
                            var h = parseInt($("#navContent_" + that.NAV_MENU + " ul").css("height").replace("px", ""));
                            var m = parseInt($("#navContent_" + that.NAV_MENU + " ul").css("margin-top").replace("px", ""))
                            if (!m) {
                                m = 0;
                            }
                            if (h > 442) {
                                if (-m + 408 < h - 442) {
                                    $("#navContent_" + that.NAV_MENU + " ul").css("margin-top", m - 408 + "px");
                                } else {
                                    $("#navContent_" + that.NAV_MENU + " ul").css("margin-top", 442 - h + "px");
                                }
                            }
                        }
                    } else if (e && e.keyCode == 38) {//上键
                        if (that.NAV_MENU > 0 && that.NAV_SEL == 0) {
                            $(".navContent ul").css("margin-top", 0);
                            $($("#navMenuList li")[--that.NAV_MENU]).focus();
                        } else if (that.NAV_SEL == 1) {
                            var h = parseInt($("#navContent_" + that.NAV_MENU + " ul").css("height").replace("px", ""));
                            var m = parseInt($("#navContent_" + that.NAV_MENU + " ul").css("margin-top").replace("px", ""))
                            if (!m) {
                                m = 0;
                            }
                            if (h > 442) {
                                if (-m - 408 > 0) {
                                    $("#navContent_" + that.NAV_MENU + " ul").css("margin-top", m + 408 + "px");
                                } else {
                                    $("#navContent_" + that.NAV_MENU + " ul").css("margin-top", 0 + "px");
                                }
                            }
                        }
                    } else if (e && e.keyCode == 39) {//右键
                        if (that.NAV_SEL == 0) {
                            that.NAV_SEL++;
                            $("#navContent_" + that.NAV_MENU + " .route").attr('tabindex', -1).focus();
                        } else if (that.NAV_SEL == 1) {
                            that.NAV_SEL++;
                            $("#navContent_" + that.NAV_MENU + " .map").attr('tabindex', -1).focus();
                        }
                    } else if (e && e.keyCode == 37) {//左键
                        if (that.NAV_SEL == 2) {
                            that.NAV_SEL--;
                            $("#navContent_" + that.NAV_MENU + " .route").attr('tabindex', -1).focus();
                        } else if (that.NAV_SEL == 1) {
                            that.NAV_SEL--;
                            $($("#navMenuList li")[that.NAV_MENU]).focus();
                        }
                    } else if (e && e.keyCode == 13) {
                        if (that.NAV_SEL == 2) {
                            $($($($("#navContent_" + that.NAV_MENU + " .map").children().children()[0]).children().children()[2]).children()[1]).trigger('click');
                            $("#navContent_" + that.NAV_MENU + " .map").removeClass("map").addClass("mapFocus");
                            $('#hintContainer').attr('class', 'mapHint').css("z-index", "5");
                            that.CUR_BLOCK = "NAVMAP_SHOWMAP";
                        }
                    }
                } else if (that.CUR_BLOCK == "NAVMAP_SHOWMAP") {
                    if (e && e.keyCode == 8) { // 按 Esc/返回
                        that.CUR_BLOCK = "PAGE_BODY";
                        $("#pageBody").focus();
                        $("#navContent_" + that.NAV_MENU + " .mapFocus").removeClass("mapFocus").addClass("map");
                        $('#hintContainer').attr('class', 'view').css("z-index", "0");
                        setTimeout(function () {
                            that.CUR_BLOCK = 'NAVMAP';
                            $("#navContent_" + that.NAV_MENU).trigger('click');
                            $("#navContent_" + that.NAV_MENU + " .map").attr('tabindex', -1).focus();
                        }, 500);
                        return false;
                    } else if (e && e.keyCode == 34) {//PgDn缩小
                        if (that.NAV_MENU == 0) {
                            that.DRIVING_MAP.setZoom(that.DRIVING_MAP.getZoom() - 1);
                        } else {
                            that.TRANSFER_MAP.setZoom(that.TRANSFER_MAP.getZoom() - 1);
                        }

                    } else if (e && e.keyCode == 33) {//PgUp放大
                        if (that.NAV_MENU == 0) {
                            that.DRIVING_MAP.setZoom(that.DRIVING_MAP.getZoom() + 1);
                        } else {
                            that.TRANSFER_MAP.setZoom(that.TRANSFER_MAP.getZoom() + 1);
                        }
                    } else if (e && e.keyCode == 27) {
                        that.exit();
                    }
                } else if (that.CUR_BLOCK == 'PAGE_BODY') {
                    if (e && e.keyCode == 27) {
                        that.exit();
                    } else if (e && e.keyCode == 8) {
                        return false;
                    }
                }
            },
            initListener: function () {
                var that = this;
                document.onkeydown = function (event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    //console.log(that.CUR_BLOCK + "-" + e.keyCode);
                    return that.control(e);
                };


                document.getElementById("viewBody_wrapper").onkeydown = function (e) {
                    if (e && e.keyCode == 40) {
                        if ((that.PANO.PANO.planeInfo || !that.PANO.PANO.planeInfo) && that.DETAIL) {
                            that.CUR_BLOCK = "PAGE_BODY";
                            $("#pageBody").focus();
                            $('#viewDetail').css('left', '0px');
                            that.AREA = that.PANO.area;
                            that.PANO.changeArea(-1);
                            Lib['VIEWDETAILMENU_INDEX'] = 0;
                            setTimeout(function () {
                                that.CUR_BLOCK = 'DETAIL';
                                $($('.viewDetailMenu li')[Lib['VIEWDETAILMENU_INDEX']]).attr('tabindex', -1).focus();
                            }, 1000);
                            return false;
                        }

                    }
                };


                $("#detailIcon").click(function () {
                    $('#viewDetail').css('left', '0px');
                    that.AREA = that.PANO.area;
                    that.PANO.changeArea(-1);
                    that.CUR_BLOCK = 'DETAIL';
                    Lib['VIEWDETAILMENU_INDEX'] = 0;
                    setTimeout(function () {
                        $($('.viewDetailMenu li')[Lib['VIEWDETAILMENU_INDEX']]).attr('tabindex', -1).focus();
                    }, 500);
                });

                if (Lib.getQueryString("click")) {
                    $("#exit").show().click(function () {
                        var e = event || window.event || arguments.callee.caller.arguments[0];
                        e.keyCode = 27;
                        that.control(e);
                    });
                }
            },
            getDetail: function () {
                var that = this;
                Lib.getData(Lib.DATA_PATH['subject'] + Lib.getQueryString('id') + "/" + Lib.getQueryString('cid') + '.json', function (data) {
                    if (data.status == 1) {
                        for (var i = 0; i < data.list.length; i++) {
                            if (data.list[i].id == Lib.getQueryString('pano')) {
                                var result = data.list[i];
                                that.DETAIL = result;
                                $("#detailIcon").show();
                                $('#viewDetail').html(that.TEMPLATE_VIEW_DETAIL(result));
                                $('.viewDetailMenu li').focus(function () {
                                    var src = $(this).find("img").attr("src").replace(".png", "_focus.png");
                                    $(this).find("img").attr("src", src);
                                }).blur(function () {
                                    var src = $(this).find("img").attr("src").replace("_focus.png", ".png");
                                    $(this).find("img").attr("src", src)
                                }).click(function () {
                                    var id = $(this).attr('data-id');
                                    if (id == 0) {
                                        $('#positionMap').css('left', '0');
                                        that.CUR_BLOCK = 'POSITION_MAP';
                                        setTimeout(function () {
                                            $($('.viewDetailMenu li')[Lib['VIEWDETAILMENU_INDEX']]).blur();
                                            $($($($('#positionMap').children().children()[0]).children().children()[2]).children()[1]).trigger('click');
                                            $('#hintContainer').attr('class', 'mapHint').css("z-index", "5");
                                        }, 800);
                                    } else if (id == 1) {
                                        $('#navMap').css('left', '0');
                                        that.CUR_BLOCK = 'NAVMAP';
                                        setTimeout(function () {
                                            $($('#navMenuList li')[0]).focus();
                                        }, 500)
                                    }
                                });

                                //位置地图初始化
                                var center = new qq.maps.LatLng(result.map.lat, result.map.lng);
                                if (!that.POSITION_MAP) {
                                    //平面地图初始化
                                    that.POSITION_MAP = new qq.maps.Map(document.getElementById('positionMap'), {
                                        center: center,
                                        zoom: result.map.zoom,
                                        disableDefaultUI: true
                                    });
                                } else {
                                    that.POSITION_MAP.panTo(center);
                                }

                                var iconType = "viewCenter", iconPath = that.ICON[iconType].path, iconWidth = that.ICON[iconType].width, iconHeight = that.ICON[iconType].height;
                                var anchor = new qq.maps.Point(iconWidth / 2, iconHeight),
                                    size = new qq.maps.Size(iconWidth, iconHeight),
                                    origin = new qq.maps.Point(0, 0),
                                    icon = new qq.maps.MarkerImage(iconPath, size, origin, anchor);
                                var marker = new qq.maps.Marker({
                                    icon: icon,
                                    position: center,
                                    map: that.POSITION_MAP
                                });


                                $('#navMenuList li').focus(function () {
                                    that.NAV_MENU = parseInt($(this).attr("data-id"));
                                    var src = $(this).find("img").attr("src").replace("_focus.png", ".png").replace(".png", "_focus.png");
                                    $(this).find("img").attr("src", src);
                                    $("#navContent_" + that.NAV_MENU).show();

                                    for (var i = 0; i < that.NAV_MENU_LENGTH; i++) {
                                        if (that.NAV_MENU != i) {
                                            var img = $("#navMenu_" + i).find("img");
                                            var src_i = img.attr("src").replace("_focus.png", ".png");
                                            img.attr("src", src_i);
                                            $("#navContent_" + i).hide();
                                        }
                                    }
                                });

                                var uP = Lib.getUserPosition(GHSMLib.cardId);
                                var nav = {};
                                nav.start = uP.address;
                                nav.end = result.name;
                                $(".navMapContent").append(that.TEMPLATE_NAV_DETAIL(nav));
                                that.transfer(uP.map.lat, uP.map.lng, result.map.lat, result.map.lng);
                                that.driving(uP.map.lat, uP.map.lng, result.map.lat, result.map.lng);

                                $(".map").click(function () {
                                    $("#navContent_" + that.NAV_MENU + " .map").removeClass("map").addClass("mapFocus");
                                    $('#hintContainer').attr('class', 'mapHint').css("z-index", "5");
                                    that.CUR_BLOCK = "NAVMAP_SHOWMAP";
                                });
                            }
                        }


                    }
                });
            },
            transfer: function (sLat, sLng, eLat, eLng) {
                var map,
                    transfer_plans,
                    start_marker,
                    end_marker,
                    station_markers = [],
                    transfer_lines = [],
                    walk_lines = [],
                    that = this;

                var transferService = new qq.maps.TransferService({
                    location: "北京",
                    complete: function (result) {
                        result = result.detail;
                        var start = result.start,
                            end = result.end;
                        var anchor = new qq.maps.Point(12, 0),
                            size = new qq.maps.Size(24, 36),
                            start_icon = new qq.maps.MarkerImage(
                                'images/busmarker.png',
                                size
                            ),
                            end_icon = new qq.maps.MarkerImage(
                                'images/busmarker.png',
                                size,
                                new qq.maps.Point(24, 0)
                            );

                        start_marker && start_marker.setMap(null);
                        end_marker && end_marker.setMap(null);
                        start_marker = new qq.maps.Marker({
                            icon: start_icon,
                            position: start.latLng,
                            map: map
                        });
                        end_marker = new qq.maps.Marker({
                            icon: end_icon,
                            position: end.latLng,
                            map: map
                        });

                        transfer_plans = result.plans;
                        var plans_desc = [];
                        var actions = transfer_plans[0].actions;
                        for (var j = 0; j < actions.length; j++) {
                            var action = actions[j],
                                img_position;
                            action.type == qq.maps.TransferActionType.BUS && (
                                img_position = '-38px 0px'
                            );
                            action.type == qq.maps.TransferActionType.SUBWAY && (
                                img_position = '-57px 0px'
                            );
                            action.type == qq.maps.TransferActionType.WALK && (
                                img_position = '-76px 0px'
                            );

                            var action_img = '<li><span style="margin-bottom: -4px;' +
                                'display:inline-block;background:url(images/busicon.png) ' +
                                'no-repeat ' + img_position +
                                ';width:19px;height:19px"></span>&nbsp;&nbsp;';
                            plans_desc.push(action_img + action.instructions + "</li>");
                        }

                        document.getElementById('busPlan').innerHTML = plans_desc.join('');
                        //渲染到地图上
                        renderPlan(0);
                        new IScroll('#bus_wrapper', {mouseWheel: true, click: true});
                    },
                    error: function () {
                        that.transfer(sLat, sLng, eLat, eLng)
                    }
                });

                function init() {
                    map = new qq.maps.Map(document.getElementById("transferMap"), {
                        // 地图的中心地理坐标。
                        center: new qq.maps.LatLng(eLat, eLng),
                        disableDefaultUI: true
                    });
                    that.TRANSFER_MAP = map;
                    calcPlan();
                }

                function calcPlan() {
                    transferService.search(new qq.maps.LatLng(sLat, sLng), new qq.maps.LatLng(eLat, eLng));
                    //transferService.setPolicy(qq.maps.TransferActionType.LEAST_TIME);
                }

                //清除地图上的marker
                function clearOverlay(overlays) {
                    var overlay;
                    while (overlay = overlays.pop()) {
                        overlay.setMap(null);
                    }
                }

                function renderPlan(index) {
                    var plan = transfer_plans[index],
                        lines = plan.lines,
                        walks = plan.walks,
                        stations = plan.stations;
                    map.fitBounds(plan.bounds);

                    //clear overlays;
                    clearOverlay(station_markers);
                    clearOverlay(transfer_lines);
                    clearOverlay(walk_lines);
                    var anchor = new qq.maps.Point(6, 6),
                        size = new qq.maps.Size(24, 36),
                        bus_icon = new qq.maps.MarkerImage(
                            'images/busmarker.png',
                            size,
                            new qq.maps.Point(48, 0)
                        ),
                        subway_icon = new qq.maps.MarkerImage(
                            'images/busmarker.png',
                            size,
                            new qq.maps.Point(72, 0)
                        );
                    //draw station marker
                    for (var j = 0; j < stations.length; j++) {
                        var station = stations[j];
                        if (station.type == qq.maps.PoiType.SUBWAY_STATION) {
                            var station_icon = subway_icon;
                        } else {
                            var station_icon = bus_icon;
                        }
                        var station_marker = new qq.maps.Marker({
                            icon: station_icon,
                            position: station.latLng,
                            map: map,
                            zIndex: 0
                        });
                        station_markers.push(station_marker);
                    }

                    //draw bus line
                    for (var j = 0; j < lines.length; j++) {
                        var line = lines[j];
                        var polyline = new qq.maps.Polyline({
                            path: line.path,
                            strokeColor: '#3893F9',
                            strokeWeight: 6,
                            map: map
                        });
                        transfer_lines.push(polyline);
                    }

                    //draw walk line
                    for (var j = 0; j < walks.length; j++) {
                        var walk = walks[j];
                        var polyline = new qq.maps.Polyline({
                            path: walk.path,
                            strokeColor: '#3FD2A3',
                            strokeWeight: 6,
                            map: map
                        });
                        walk_lines.push(polyline);
                    }
                }

                init();
            },
            driving: function (sLat, sLng, eLat, eLng) {
                var map,
                    directions_routes,
                    directions_placemarks = [],
                    directions_labels = [],
                    start_marker,
                    end_marker,
                    route_lines = [],
                    step_line,
                    route_steps = [],
                    that = this;

                var directionsService = new qq.maps.DrivingService({
                    location: "北京",
                    complete: function (result) {
                        result = result.detail;
                        var start = result.start,
                            end = result.end;
                        var anchor = new qq.maps.Point(6, 6),
                            size = new qq.maps.Size(24, 36),
                            start_icon = new qq.maps.MarkerImage(
                                'images/busmarker.png',
                                size
                            ),
                            end_icon = new qq.maps.MarkerImage(
                                'images/busmarker.png',
                                size,
                                new qq.maps.Point(24, 0)
                            );

                        start_marker && start_marker.setMap(null);
                        end_marker && end_marker.setMap(null);
                        start_marker = new qq.maps.Marker({
                            icon: start_icon,
                            position: start.latLng,
                            map: map,
                            zIndex: 1
                        });
                        end_marker = new qq.maps.Marker({
                            icon: end_icon,
                            position: end.latLng,
                            map: map,
                            zIndex: 1
                        });


                        directions_routes = result.routes;
                        var routes_desc = [];
                        //所有可选路线方案
                        var route = directions_routes[0],
                            legs = route;
                        //调整地图窗口显示所有路线
                        map.fitBounds(result.bounds);
                        //所有路程信息
                        //for(var j = 0 ; j < legs.length; j++){
                        var steps = legs.steps;
                        route_steps = steps;
                        polyline = new qq.maps.Polyline(
                            {
                                path: route.path,
                                strokeColor: '#3893F9',
                                strokeWeight: 6,
                                map: map
                            }
                        );
                        route_lines.push(polyline);
                        //所有路段信息
                        for (var k = 0; k < steps.length; k++) {
                            var step = steps[k];
                            //路段途经地标
                            directions_placemarks.push(step.placemarks);
                            //转向
                            var turning = step.turning,
                                img_position;
                            switch (turning.text) {
                                case '左转':
                                    img_position = '0px 0px'
                                    break;
                                case '右转':
                                    img_position = '-19px 0px'
                                    break;
                                case '直行':
                                    img_position = '-38px 0px'
                                    break;
                                case '偏左转':
                                case '靠左':
                                    img_position = '-57px 0px'
                                    break;
                                case '偏右转':
                                case '靠右':
                                    img_position = '-76px 0px'
                                    break;
                                case '左转调头':
                                    img_position = '-95px 0px'
                                    break;
                                default:
                                    mg_position = ''
                                    break;
                            }
                            var turning_img = '<span' +
                                ' style="margin-bottom: -3px;' +
                                'display:inline-block;background:' +
                                'url(images/turning.png) no-repeat ' +
                                img_position + ';width:19px;height:' +
                                '19px"></span>&nbsp;';
                            routes_desc.push("<li>" + turning_img + step.instructions + "</li>");
                        }
                        //方案文本描述
                        document.getElementById('carPlan').innerHTML = routes_desc.join('');
                        new IScroll('#car_wrapper', {mouseWheel: true, click: true});
                    },
                    error: function () {
                        that.driving(sLat, sLng, eLat, eLng)
                    }
                });

                function init() {
                    map = new qq.maps.Map(document.getElementById("drivingMap"), {
                        // 地图的中心地理坐标。
                        center: new qq.maps.LatLng(eLat, eLng),
                        disableDefaultUI: true
                    });
                    that.DRIVING_MAP = map;
                    calcRoute();
                }

                function calcRoute() {
                    route_steps = [];
                    //directionsService.setPolicy(qq.maps.DrivingPolicy["LEAST_TIME"]);
                    directionsService.search(new qq.maps.LatLng(sLat, sLng), new qq.maps.LatLng(eLat, eLng));
                }

                //清除地图上的marker
                function clearOverlay(overlays) {
                    var overlay;
                    while (overlay = overlays.pop()) {
                        overlay.setMap(null);
                    }
                }

                init();
            },
            exit: function () {
                /* if (Lib.getQueryString('click')) {
                 window.location.href = '../list/list.html?id=' + Lib.getQueryString('id') + "&click=true";
                 } else {
                 window.location.href = '../list/list.html?id=' + Lib.getQueryString('id');
                 }*/
                window.history.go(-1);
            }

        }
    })();
    view.init();

    var musicList = [
        "../../audio/ajdwh.mp3",
        "../../audio/cidm.mp3",
        "../../audio/rtl.mp3",
        "../../audio/sndqd.mp3",
        "../../audio/Refrain.mp3"
    ];

    new GHSMLib.AudioPlayer(musicList, 2);
})();