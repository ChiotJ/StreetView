var TXConneturl = "http://" + window.location.host + "/com.zunhao.tv/conneturl?";
//var TXConneturl = "http://" + window.location.host + "/TXJJ/conneturl?";
var TXJJ = "http://" + window.location.host + "/com.zunhao.tv/";
/*if (window.location.host == "58.30.224.22" || window.location.host == "localhost") {
 TXConneturl = "";
 }*/

var Lib = (function () {
    return {
        CUR_MENU: 0,
        ISPANO: false,//街景模式为true，地图模式为false
        ZOOM: 0,//缩放比例
        MAP: null,//地图对象
        PANO: null,//街景对象
        CUR_SUBJECT: 'BLOCK',//当前所在首页或主题
        BLOCK_INDEX: 0,//首页菜单当前位置
        MAP_INDEX: 0,//首页菜单当前位置
        SEARCH_INDEX: 0,//搜索列表
        MAP_CENTER: true,//是否显示地图中点图标
        HOUSE_INDEX: 0,//搜房结果列表当前所在位置
        VIEW_INDEX: 0,//主题街景列表当前所在位置
        ALBUMVIEW_INDEX: 0,//社区列表
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
            }
        },
        DATA_PATH: {
            index: "../../data/json/list.json",
            subject: '../../data/json/'
        },
        /*街景初始化*/
        panoInit: function () {
            /*var that = this;
             var allParam = that.getURLParam(),
             oldParam = null;

             var svid = allParam.pano || '10011031131126113935000';

             //            that.PANO = new Panorama('panoCon', svid);
             that.PANO = new Panorama('panoCon', svid, {
             proxyUrl:TXConneturl+ '{{URL}}&m=2',
             onPanoChange: function () {
             },
             changeKeyCode: 51
             });*/
            var that = this;
            var allParam = that.getURLParam(),
                oldParam = null;

            var svid = allParam.pano || '10011031131126113935000';

//            that.PANO = new Panorama('panoCon', svid);
            that.PANO = new Panorama('panoCon', svid, {
                proxyUrl: TXConneturl + '{{URL}}&m=2',
                onPanoChange: function () {
                    var c = $('#zoomContainer').attr('class');
                    //是否为房源详情
                    if (c != 'houseDetailZoom') {
                        //是否有街景详情列表
                        if (that.PANO.planeInfo) {
                            that.changeHint('albumZoom');
                        } else {
                            if (that.ISPANO) {
                                that.changeHint('panoZoom');
                            } else {
                                that.changeHint('indexZoom');
                            }
                            $("#albumViewBody").html("");
                        }
                    } else {
                        if (that.PANO.planeInfo) {
                            $('#albumCon').show();
                        } else {
                            $("#albumViewBody").html("");
                        }
                    }
                    /*if(that.PANO.planeInfo) {
                     that.changeHint('albumZoom');
                     //                        debugger;
                     //region
                     } else if(c != 'houseDetailZoom') {
                     that.changeHint('indexZoom');
                     //清空album内容
                     $("#albumViewBody").html("");
                     }else{
                     $("#albumViewBody").html("");
                     }*/
                },
                changeKeyCode: 51
            });

            if (allParam.heading && allParam.pitch) {
                that.PANO.setPov(parseInt(allParam.heading), parseInt(allParam.pitch));
            }

            if (allParam.zoom) {
                that.PANO.setZoom(parseInt(allParam.zoom));
            }

            window.onhashchange = function () {
                /*oldParam = allParam;
                 allParam = that.getURLParam();
                 if (allParam.that.PANO != oldParam.that.PANO) {
                 that.PANO.setPano(allParam.that.PANO);
                 }

                 if (allParam.heading && allParam.pitch) {
                 that.PANO.setPov(parseInt(allParam.heading), parseInt(allParam.pitch));
                 }

                 if (allParam.zoom) {
                 that.PANO.setZoom(parseInt(allParam.zoom));
                 }*/
            };
        },
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
        /*地图初始化*/
        mapInit: function (t) {
            var that = this;

            //平面地图初始化
            var center = new qq.maps.LatLng(39.9489391276258, 116.42458676023809);
            this.MAP = new qq.maps.Map(document.getElementById('container'), {
                center: center,
                zoom: 15,
                disableDefaultUI: true
            });
            var marker = that.layMarker(39.9489391276258, 116.42458676023809, 'center');
            qq.maps.event.addListener(that.MAP, 'center_changed', function () {
                //房源列表只显示红点，不显示蓝色中心点
                if (that.MAP_CENTER) {
                    marker.setPosition(that.MAP.getCenter());
                }
            });
            //监听地图缩放级别，大于15级时显示街景高亮路网
            that.PANO_LAYER = new qq.maps.PanoramaLayer();
            qq.maps.event.addListener(that.MAP, 'zoom_changed', function () {
                var zoomLevel = that.MAP.getZoom();
                if (zoomLevel > 15) {
                    that.PANO_LAYER.setMap(that.MAP);
                } else {
                    that.PANO_LAYER.setMap(null);
                }
            });

            if (t && t.markClick) {
                qq.maps.event.addListener(marker, 'click', function () {
                    t.markClick();
                });
            }
        },
        /*地图上标记点*/
        layMarker: function (lat, lng, iconType) {
            var that = this, center = new qq.maps.LatLng(lat, lng), marker = null,
                iconPath = that.ICON[iconType].path, iconWidth = that.ICON[iconType].width, iconHeight = that.ICON[iconType].height;
            if (iconPath) {
                var anchor = new qq.maps.Point(iconWidth / 2, iconHeight),
                    size = new qq.maps.Size(iconWidth, iconHeight),
                    origin = new qq.maps.Point(0, 0),
                    icon = new qq.maps.MarkerImage(iconPath, size, origin, anchor);
                marker = new qq.maps.Marker({
                    icon: icon,
                    position: center,
                    map: that.MAP
                });
            } else {
                marker = new qq.maps.Marker({
                    position: center,
                    map: that.MAP
                });
            }
            return marker;
        },
        /*地图获取焦点，可用键盘操作*/
        mapFocus: function () {
            //1秒后模拟点击设置焦点，立即设置焦点不起作用
            setTimeout(function () {
                $($($($('#container').attr("tabindex","-1").focus().children().children()[0]).children().children()[2]).children()[1]).trigger('click');
            }, 800);
        },
        /*列表上下左右事件响应
         * columnNum 列数*/
        listAreaListener: function (options) {
            var that = this, e = options.e, list = options.type + 'List', //list类名，命名规则type+List
                index = options.type.toUpperCase() + '_INDEX';//当前焦点所在位置序号，命名规则type+_INDEX
            /*if(type == 'museum'){
             list = 'museumList';
             index = 'MUSEUM_INDEX';
             }else if(type == 'park'){
             list = 'parkList';
             index = 'PARK_INDEX';
             }*/
            var length = $('#' + list + ' li').length;
            if (!that[index]) {
                that[index] = 0;
            }
            if (e && e.keyCode == 27) { // 按 Esc/返回
//                $('#'+list).hide();
//                that.backMain();
                that[index] = 0;
                if (options.esc) {
                    options.esc(that);
                }
            }
            else if (e && e.keyCode == 13) {//enter 键
//                var url1 = $($('#'+list+' li')[that[index]]).attr('data-url');
//                var p1 = new that.getParam.get(url1);
//                that.PANO.setPano(p1.pano);
//                that.PANO.setPov(parseInt(p1.heading), parseInt(p1.pitch));
//                that.toType('pano');
//                $('#'+list).hide();
//                $('#zoomContainer').show();
//                that.CUR_MENU = 0;
                if (options.enter) {
                    options.enter(that);
                }
            }
            else if (e && e.keyCode == 37) {//左键
                if (that[index] > 0) {
                    $($('#' + list + ' li')[--that[index]]).attr('tabindex', -1).focus();
                }
            }
            else if (e && e.keyCode == 39) {//右键
                if (that[index] < length - 1) {
                    $($('#' + list + ' li')[++that[index]]).attr('tabindex', -1).focus();
                }
            }
            else if (e && e.keyCode == 38) {//上键
                if (that[index] > options.columnNum - 1) {
                    that[index] -= options.columnNum;
                    $($('#' + list + ' li')[that[index]]).attr('tabindex', -1).focus();
                }
            }
            else if (e && e.keyCode == 40) {//下键
                if (that[index] < length - options.columnNum) {
                    that[index] += options.columnNum;
                    $($('#' + list + ' li')[that[index]]).attr('tabindex', -1).focus();
                }
            }
            return false;
        },
        /*列表左右事件响应，左右滚动，margin值改变
         * num每页数量
         * width每页宽度
         * type 叶子节点类型，如li或button*/
        listListener: function (options) {
            var that = this, e = options.e,
                list = options.listName + 'List', //list类名，命名规则type+List
                index = options.listName.toUpperCase() + '_INDEX', //当前焦点所在位置序号，命名规则type+_INDEX
                listDom = options.type ? $('#' + list + ' ' + options.type) : $('#' + list + ' li');//列表dom节点数组
            if (e && e.keyCode == 27) { // 按 Esc/返回
                if (options.esc) {
                    options.esc(that);
                }
                /*$('#zoomContainer').attr('class','indexZoom');
                 $('.houseList').hide();
                 that.deleteOverlays();
                 that.backMain();*/
            }
            else if (e && e.keyCode == 13) {//enter 键
                if (options.enter) {
                    options.enter(that);
//                    if(that.CUR_SUBJECT == 'BLOCK'){
//                        that.CUR_SUBJECT = e.target.id.toUpperCase();
//                    }
                }
                /*$('#zoomContainer').attr('class','houseDetailZoom');
                 var item = $('#houseList li')[that[index]];
                 if(!that.ISPANO){
                 that.changeType();
                 }
                 that.changePosition($(item).attr('data-lat'),$(item).attr('data-lng'));
                 $('.houseList').hide();
                 $('#houseQrCode').attr('src',TXConneturl+'http://web.sr.gehua.net.cn/api/common/Image/qrCode.png?text=http://www.hiweixiao.com/h5/zhaofangditu/detail.html?id='+$(item).attr('data-id')+"&size=110");
                 $('#houseTel').html($(item).attr('data-tel'));
                 $('.houseDetail').show();
                 that.deleteOverlays();
                 $('#houseList').css('margin-left','0px');
                 $('#houseDetailContainer').attr('data-id',$(item).attr('data-id'));
                 that[index] = 2;
                 that.CUR_MENU = 0;
                 that.STATUS = 'HOUSE_DETAIL';*/
            }
            else if (e && e.keyCode == 37) {//左键
                if (that[index] > 0) {
                    if (options.width) {
                        //全屏向左滑动
                        if (that[index] % options.num == 0) {
                            var margin3 = (parseInt(that[index] / options.num) - 1) * options.width;
                            $('#' + list).css('margin-left', '-' + margin3 + 'px');
                        }
                    }
                    //搜房增加操作
                    if (options.before) {
                        options.before(that);
                    }
                    if (!options.up || (options.up && $('.preSelected').length == 0)) {
                        $(listDom[--that[index]]).attr('tabindex', -1).focus();
                    }
                    //搜房增加操作
                    if (options.after) {
                        options.after(that);
                    }
                    /*that.changeMarker(that[index], 'houseLoc');
                     that.changeMarker(that[index], 'houseFocus');
                     //改变地图中心点，选中房源位置居中
                     var item = listDom[that[index]], lat = $(item).attr('data-lat'), lng = $(item).attr('data-lng');
                     that.MAP.panTo(new qq.maps.LatLng(lat, lng));*/

                }
            }
            else if (e && e.keyCode == 39) {//右键
//                var list = $('#houseList li');
                if (that[index] < listDom.length - 1) {
                    if (options.width) {
                        //全屏向右滑动
                        if (that[index] % options.num == options.num - 1) {
                            var margin4 = (parseInt(that[index] / options.num) + 1) * options.width;
                            $('#' + list).css('margin-left', '-' + margin4 + 'px');
                        }
                    }
                    //搜房增加操作
                    if (options.before) {
                        options.before(that);
                    }
                    if (!options.up || (options.up && $('.preSelected').length == 0)) {
                        $(listDom[++that[index]]).attr('tabindex', -1).focus();
                    }
                    //搜房增加操作
                    if (options.after) {
                        options.after(that);
                    }
                    /*that.changeMarker(that[index], 'houseLoc');
                     that.changeMarker(that[index], 'houseFocus');
                     //改变地图中心点，选中房源位置居中
                     var item2 = listDom[that[index]], lat2 = $(item2).attr('data-lat'), lng2 = $(item2).attr('data-lng');
                     that.MAP.panTo(new qq.maps.LatLng(lat2, lng2));*/
                }
            }
            //特殊情况，上下键选择更多
            if (options.down) {
                if (e && e.keyCode == 40) {//下键
                    if (options.down == 'default') {
                        if (options.height && that[index] < listDom.length - 1) {
                            //全屏向上滑动
                            if (that[index] % options.num == options.num - 1) {
                                var margin1 = (parseInt(that[index] / options.num) + 1) * options.height;
                                $('#' + list).css('margin-top', '-' + margin1 + 'px');
                            }
                            $(listDom[++that[index]]).attr('tabindex', -1).focus();
                        }
                    } else {
                        options.down()
                    }
                }
            }
            if (options.up) {
                if (e && e.keyCode == 38) {//上键
                    if (options.up == 'default') {
                        if (options.height && that[index] > 0) {
                            //全屏向右滑动
                            if (that[index] % options.num == 0) {
                                var margin2 = (parseInt(that[index] / options.num) - 1) * options.height;
                                $('#' + list).css('margin-top', '-' + margin2 + 'px');
                            }
                            $(listDom[--that[index]]).attr('tabindex', -1).focus();
                        }
                    } else {
                        options.up()
                    }
                }
            }
            return false;
        },
        /*缩放事件监听*/
        zoomListener: function (e) {
            var that = this;
            //缩小
            if (e && e.keyCode == 34) {//PgDn缩小
                that.ZOOM = that.MAP.getZoom();
                that.MAP.setZoom(that.ZOOM - 1);
            }
            //放大
            else if (e && e.keyCode == 33) {//PgUp放大
                that.ZOOM = that.MAP.getZoom();
                that.MAP.setZoom(that.ZOOM + 1);
            }
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },
        //获取数据，列表分类，推荐等
        getData: function (url, callback) {
            $.getJSON(url, callback);
        },
        //获取用户位置信息
        getUserPosition: function (CA) {
            var p = {}, map = {};
            map.lat = 39.9489391276258;
            map.lng = 116.42458676023809;
            p.map = map;
            p.address = "北京市东城区青龙胡同1号(歌华大厦)";
            return p;
        }
    }
})();
